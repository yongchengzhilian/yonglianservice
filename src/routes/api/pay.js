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
const {
  RED_LINE_RECORD_TYPE,
  RED_LINE_PRICE,
  NEW_USER_COUNT_RATE
} = require('../../enum/RedLine')
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

/**
 * @description 微信公众号授权回调
 * */
router.all('/oauth', async (ctx, next) => {
  const url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='
  const {code} = ctx.query
  const data = await axios.get(`${url}${APP_ID.FWH}&secret=${APP_SECRET.FWH}&code=${code}&grant_type=authorization_code`)
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

/**
 * @description 微信客服消息回调
 * */
router.all('/token', async (ctx, next) => {
  console.log('微信客服消息==========>', ctx.request.body.Content)
  const url = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='
  if (ctx.request.body.Content === '1' || !ctx.request.body.Content) {
    await axios.post(`${url}${global.access_token}`, {
      access_token,
      touser: ctx.request.body.FromUserName,
      msgtype: 'image',
      image: {media_id: global.gzh_media_id},
    })
  } else {
    await axios.post(`${url}${global.access_token}`, {
      access_token,
      touser: ctx.request.body.FromUserName,
      msgtype: 'image',
      image: {media_id: global.kf_media_id},
    })
  }
  console.log('客服消息回调成功=============>')
  ctx.body = 'success'
})


/**
 * @description 小程序下单
 * @param {uid} 如果是小程序下单， uid从token中获取
 * */
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
  let price = RED_LINE_PRICE
  if (numRes < 3) {
    price = RED_LINE_PRICE * NEW_USER_COUNT_RATE
  }
  const res = await pay({
    appid: APP_ID.NING_BO,
    orderId,
    openid: open_id,
    desc: '甬城红线',
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


/**
 *  @description 获取订单数量， 小程序端 不需要传参， 直接从token获取id
 *  @params {uid} 小程序端 直接从token中获取
 * */
router.post('/orderNum', async (ctx, next) => {
  let uid = ctx.request.body.uid
  if (!uid) {
    const token = ctx.header.authorization
    const tokendata = await parseToken(token)
    uid = tokendata.id
  }
  const numRes = await getUserSuccessOrderCount(uid)
  ctx.body = new SuccessModel({data: numRes})
})


/**
 * @description 支付回调地址， 需要判断是否支付成功 还需判断是否已提交入库
 * */
router.post('/notify', async (ctx, next) => {
  const xml = await raw(inflate(ctx.req));
  const xml2json = fxp.parse(xml.toString());
  if (xml2json.xml.result_code === 'SUCCESS') {
    const res = await getUidByOrderId(xml2json.xml.out_trade_no)
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
