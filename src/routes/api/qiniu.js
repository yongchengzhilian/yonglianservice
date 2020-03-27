/**
 * @description 获取七牛云token
 * @author zhaojianbo
 */

const router = require('koa-router')()
const qiniu = require('qiniu')
const axios = require('axios')
const utils = require('utility')
const {SuccessModel} = require('../../model/ResModel')

router.get('/getQiniuToken', async (ctx, next) => {
  const accessKey = 'eFpPQhJlo_cBPS46gAL1IJCH5y1f_OV5-G4qah1d'
  const secretKey = 'vVwO3xO1AsNKY7_QKusn3G-j0tVzBxNb4AygEw9D'
  const bucket = 'aidou-user-image'

  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  let options = {
    scope: bucket,
    expires: 3600 * 24
  }
  let putPolicy = new qiniu.rs.PutPolicy(options)

  let token = putPolicy.uploadToken(mac)
  console.log(token)

  ctx.body = new SuccessModel({token})
})

router.post('/ocridcard', async (ctx, next) => {
  const {url} = ctx.request.body
  console.log(url)
  let body = {data: {url}}
  const accessKey = 'eFpPQhJlo_cBPS46gAL1IJCH5y1f_OV5-G4qah1d'
  const secretKey = 'vVwO3xO1AsNKY7_QKusn3G-j0tVzBxNb4AygEw9D'

  let data =  'POST /v1/ocr/idcard\nHost: ai.qiniuapi.com\nContent-Type: application/json\n\n' + JSON.stringify(body)
  let sign = utils.hmac('sha1', secretKey, data).replace(/\+/g, '-').replace(/\//g, '_')
  try {
    var res = await axios.post('http://ai.qiniuapi.com/v1/ocr/idcard', body ,{
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Qiniu '+accessKey+':'+sign
      }
    })
  }catch (e) {
    console.log(e)
  }
  console.log(res)
  ctx.body = new SuccessModel(res.data)
})

module.exports = router
