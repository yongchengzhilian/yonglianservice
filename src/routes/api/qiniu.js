/**
 * @description 获取七牛云token
 * @author zhaojianbo
 */

const router = require('koa-router')()
const qiniu = require('qiniu')
const {SuccessModel} = require('../../model/ResModel')
const {
  BUCKET,
  ACCESS_KEY,
  SECRET_KEY
} = require('../../config/qiniu')

router.get('/getQiniuToken', async (ctx, next) => {
  let mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)
  let options = {
    scope: BUCKET,
    expires: 3600 * 24
  }
  let putPolicy = new qiniu.rs.PutPolicy(options)

  let token = putPolicy.uploadToken(mac)

  ctx.body = new SuccessModel({token})
})

router.post('/delQiniuImage', async (ctx, next) => {
  const {key} = ctx.request.body
  let mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)
  // bucketManager = new BucketManager(mac, config);
})

module.exports = router
