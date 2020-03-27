/**
 * @description 登入相关路由
 * @author zhaojianbo
 */

const router = require('koa-router')()
const {
  getUserinfo,
  getCenterData,
  getUserInfoByUid,
} = require('../../controller/login')
const {SuccessModel} = require('../../model/ResModel')

router.prefix('/login')

// 登入
router.get('/getUserInfoByUid/:uid', async (ctx, next) => {
  let { uid } = ctx.params

  const userinfo = await getUserInfoByUid(uid)
  ctx.body = new SuccessModel(userinfo)
})

// 获取用户信息 不生成token
router.get('/getCenterData/:uid', async (ctx, next) => {
  let { uid } = ctx.params
  const userinfo = await getCenterData(uid)
  ctx.body = new SuccessModel(userinfo)
})

router.post('/getUserinfo', async (ctx, next) => {
  const {
    iv,
    encryptedData,
    code,
    inviteId
  } = ctx.request.body
  const userinfo = await getUserinfo(
    iv,
    encryptedData,
    code,
    inviteId
  )
  ctx.body = new SuccessModel(userinfo)
})

module.exports = router
