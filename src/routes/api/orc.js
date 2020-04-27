/**
 * @description 身份证识别
 * @author zhaojianbo
 */

const router = require('koa-router')()
const request = require('../../utils/request')
const {SuccessModel} = require('../../model/ResModel')
const axios = require('axios')
const {
  API_KEY,
  API_SECRET,
  API_URL
} = require('../../config/orc')

// 登入
router.post('/ocridcard', async (ctx, next) => {
  const {url, type} = ctx.request.body
  // let res = await axios.post(`https://api.weixin.qq.com/cv/ocr/idcard?type=${type}&img_url=${url}&access_token=${global.access_token}`, {
  //   type,
  //   img_url: url,
  //   access_token: global.access_token
  // })
  // ctx.body = new SuccessModel(res.data)
  let res = await request.post(API_URL, {
    api_key: API_KEY,
    api_secret: API_SECRET,
    image_url: url
  })
  res = JSON.parse(res)
  if (res.error_message) {
    throw new global.HttpException('身份证解析失败')
  } else{
    ctx.body = new SuccessModel(res.cards[0])
  }
})

module.exports = router
