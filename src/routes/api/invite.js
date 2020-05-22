/**
 * @description 邀请记录
 * */
const router = require('koa-router')()
const {SuccessModel} = require('../../model/ResModel')
const parseToken = require('../../utils/parseToken')
const {getInviteList} = require('../../controller/invite')

router.prefix('/invite')

router.get('/list', async (ctx, next) => {
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const list = await getInviteList(id)
  ctx.body = new SuccessModel(list)
})

module.exports = router
