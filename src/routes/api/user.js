/**
 * @description 用户信息相关路由
 * @author zhaojianbo
 */


const router = require('koa-router')()
const {
  getList,
  updateAvatar,
  updateNickname
} = require('../../controller/user')
const {genValidator} = require('../../middlewares/validator')
const {nicknameValidate} = require('../../validator/user')
const {SuccessModel} = require('../../model/ResModel')
const parseToken = require('../../utils/parseToken')

router.prefix('/user')


// 用户列表
router.post('/list', async (ctx, next) => {
  const {limit, page} = ctx.request.body
  const list = await getList(limit, page)
  ctx.body = new SuccessModel({data: list})
})

router.post('/updateNickname', genValidator(nicknameValidate), async (ctx, next) => {
  const {nickname} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await updateNickname(nickname, id)
  ctx.body = new SuccessModel({data: '修改成功'})
})

router.post('/updateAvatar', async (ctx, next) => {
  const {avatar} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await updateAvatar(avatar, id)
  ctx.body = new SuccessModel({data: '修改成功'})
})

module.exports = router
