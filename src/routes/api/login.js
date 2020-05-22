/**
 * @description 登入相关路由
 * @author zhaojianbo
 */

const router = require('koa-router')()
const {
  getUserinfo,
  getUserInfoByUid,
} = require('../../controller/login')
const {SuccessModel} = require('../../model/ResModel')

router.prefix('/login')

/**
 * @description 根据uid登入， 获取用户信息
 * @param {uid}
 * */

// todo 后期需要查询redis
router.get('/getUserInfoByUid/:uid', async (ctx, next) => {
  let { uid } = ctx.params
  const userinfo = await getUserInfoByUid(uid)
  ctx.body = new SuccessModel(userinfo)
})


/**
 * @description 微信登入
 * @param {encryptedData code inviteId iv}
 * */
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
