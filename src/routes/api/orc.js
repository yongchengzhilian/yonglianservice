/**
 * @description 身份证识别
 * @author zhaojianbo
 */

// https://api-cn.faceplusplus.com/cardpp/v1/ocridcard
const router = require('koa-router')()
const FormData = require('form-data')
const axios = require('axios')

// 登入
router.post('/ocridcard', async (ctx, next) => {

  const api_key = ''
  const api_secret = ''
  const image_url = ''
})

module.exports = router
