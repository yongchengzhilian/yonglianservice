/**
 * @description 用户审核相关
 * @author zhaojianbo
 */

const router = require('koa-router')()
const {SuccessModel} = require('../../model/ResModel')
const {
  getAuthList,
  getAuthDetail,
  userAuth,
} = require('../../controller/userAuth')
router.prefix('/auth')

// 获取审核列表
router.get('/getAuthList', async (ctx, next) => {
  const data = await getAuthList()
  ctx.body = new SuccessModel(data)
})

router.get('/getAuthDetail/:uid', async (ctx, next) => {
  const {uid} = ctx.params
  const data = await getAuthDetail(uid)
  ctx.body = new SuccessModel(data)
})

router.post('/userAuth', async (ctx, next) => {
  const {uid, nickname, content, type, oldStatus} = ctx.request.body
  await userAuth({uid, nickname, content, type, oldStatus})
  ctx.body = new SuccessModel('审核成功')
})

module.exports = router
