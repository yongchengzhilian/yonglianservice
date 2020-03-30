/**
 * @description 身份证识别
 * @author zhaojianbo
 */

const router = require('koa-router')()
const HttpException = require('../../middlewares/exception/http-exception')
const request = require('../../utils/request')
const {SuccessModel, ErrorModel} = require('../../model/ResModel')

// 登入
router.post('/ocridcard', async (ctx, next) => {
  const {url} = ctx.request.body
  const api_key = '8g-u1g9atILFl48CVHH0bglU9AP_cnK8'
  const api_secret = 'QMZWA6mJdXBLQ9uqa2e__7trcR2lE4Iy'
  let res = await request.post('https://api-cn.faceplusplus.com/cardpp/v1/ocridcard', {
    api_key,
    api_secret,
    image_url: url
  })
  res = JSON.parse(res)
  if (res.error_message) {
    throw new HttpException('身份证解析失败')
  } else{
    ctx.body = new SuccessModel(res.cards[0])
  }
})

module.exports = router
