/**
 * @description 身份证识别
 * @author zhaojianbo
 */

const router = require('koa-router')()
const request = require('../../utils/request')
const {SuccessModel} = require('../../model/ResModel')
const {
  API_KEY,
  API_SECRET,
  API_URL
} = require('../../config/orc')

// 登入
router.post('/ocridcard', async (ctx, next) => {
  const {url} = ctx.request.body
  let res = await request.post(API_URL, {
    api_key: API_KEY,
    api_secret: API_SECRET,
    image_url: url
  })
  res = JSON.parse(res)
  if (res.error_message) {
    console.error('身份证解析失败', JSON.stringify(res))
    throw new global.HttpException('身份证解析失败')
  } else{
    ctx.body = new SuccessModel(res.cards[0])
  }
})

module.exports = router
