/**
 * @description 获取七牛云token
 * @author zhaojianbo
 */

const router = require('koa-router')()
const qiniu = require('qiniu')
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

module.exports = router
