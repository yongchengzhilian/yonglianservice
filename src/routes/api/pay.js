/**
 * @description 支付功能
 * @author zhaojianbo
 */

const router = require('koa-router')()
const {SuccessModel} = require('../../model/ResModel')
const {pay} = require('../../utils/wx/pay')
const {getClientIP} = require('../../utils/utils')
const raw = require('raw-body');
const axios = require('axios')
const fxp = require("fast-xml-parser");
const {RED_LINE_RECORD_TYPE} = require('../../enum/RedLine')
const {
  createOrderRecord,
  getUserSuccessOrderCount,
  getUidByOrderId,
  updateOrderRecord
} = require('../../services/orderRecord')
const {
  addRedLineRecord
} = require('../../services/redLine')
const {
  getUserInfoByUidFromTable,
  getUserInfoByUnionid,
  updateRedLine
} = require('../../services/user')
const parseToken = require('../../utils/parseToken')
const {
  ORDER_TYPE,
  MCH_ID,
  APP_ID,
  APP_SECRET
} = require('../../config/wx')
const inflate = require('inflation');

router.prefix('/pay')

let json2Xml = function (json) {
  let _xml = '';
  Object.keys(json).map((key) => {
    _xml += `<${key}>${json[key]}</${key}>`
  })
  return `<xml>${_xml}</xml>`;
}

router.all('/oauth', async (ctx, next) => {
  console.log('code', ctx.query)
  console.log('code', ctx.request.body)
  const {code} = ctx.query
  const data = await axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID.FWH}&secret=${APP_SECRET.FWH}&code=${code}&grant_type=authorization_code`)
  console.log('data', data.data)
  const {unionid} = data.data
  const res = await getUserInfoByUnionid(unionid)
  const {
    id,
    nickname,
    avatar,
    red_line_count
  } = res.dataValues
  const params = `id=${id}&name=${nickname}&avatar=${avatar}&count=${red_line_count}`
  ctx.response.redirect(`https://www.qike.site/pay?${params}`);
})

router.all('/token', async (ctx, next) => {
  console.log(ctx.request.body)
  if (ctx.request.body.Content === '1' || !ctx.request.body.Content) {
    axios.post('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+global.access_token, {
      access_token,
      touser: ctx.request.body.FromUserName,
      msgtype: 'image',
      image: {media_id: global.gzh_media_id},
    })
  } else {
    axios.post('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+global.access_token, {
      access_token,
      touser: ctx.request.body.FromUserName,
      msgtype: 'image',
      image: {media_id: global.kf_media_id},
    })
  }
  ctx.body = 'success'
})


router.post('/order/xcx', async (ctx, next) => {
  let now = new Date().getTime()
  let id = ctx.request.body.uid
  if (!id) {
    const token = ctx.header.authorization
    const tokendata = await parseToken(token)
    id = tokendata.id
  }

  const {open_id} = await getUserInfoByUidFromTable(id)
  const orderId = `AI_DOU_XCX_ORDER_ID${now}`
  const numRes = await getUserSuccessOrderCount(id)
  let price = 0.01
  if (numRes > 2) {
    price = 0.02
  }
  const res = await pay({
    appid: APP_ID.NING_BO,
    orderId,
    openid: open_id,
    desc: '测试',
    totalPrice: price,
    spbill_create_ip: getClientIP(ctx.req)
  })
  await createOrderRecord({
    uid: id,
    appid: APP_ID.NING_BO,
    mch_id: MCH_ID,
    openid: open_id,
    out_trade_no: orderId,
    device_info: getClientIP(ctx.req)
  })

  ctx.body = new SuccessModel(res)
})

router.post('/orderNum', async (ctx, next) => {
  // const {uid} = ctx.request.body
  let uid = ctx.request.body.uid
  if (!uid) {
    const token = ctx.header.authorization
    const tokendata = await parseToken(token)
    uid = tokendata.id
  }
  const numRes = await getUserSuccessOrderCount(uid)
  // console.log()
  ctx.body = new SuccessModel({data: numRes})
})

router.post('/notify', async (ctx, next) => {
  const xml = await raw(inflate(ctx.req));
  const xml2json = fxp.parse(xml.toString());

  if (xml2json.xml.result_code === 'SUCCESS') {
    const res = await getUidByOrderId(xml2json.xml.out_trade_no)
    // if (res.dataValues.result_code !== 'SUCCESS') {
    //
    // }
    if (!res.dataValues.total_fee) {
      await updateRedLine(res.dataValues.uid)
      await addRedLineRecord({
        uid: res.dataValues.uid,
        type: RED_LINE_RECORD_TYPE.BUY,
        comment: '购买添加'
      })
      await updateOrderRecord({
        result_code: 'SUCCESS',
        total_fee: xml2json.xml.total_fee,
        fee_type: xml2json.xml.fee_type,
        bank_type: xml2json.xml.bank_type,
        trade_type: xml2json.xml.trade_type,
      }, {
        where: {
          out_trade_no: xml2json.xml.out_trade_no
        }
      })
    }
  }

  let sendData = {
    return_code: 'SUCCESS',
    return_msg: 'OK'
  }
  ctx.body = json2Xml(sendData)
})

module.exports = router
