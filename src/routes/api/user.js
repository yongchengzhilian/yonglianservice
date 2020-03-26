/**
 * @description 用户信息相关路由
 * @author zhaojianbo
 */


const router = require('koa-router')()
const util = require('util')
const jwt = require('jsonwebtoken')
const {
  addRedLine,
} = require('../../services/user')
const {
  getList
} = require('../../controller/user')

const {SECRET} = require('../../config/jwt')
const {SuccessModel} = require('../../model/ResModel')

router.prefix('/user')

const verify = util.promisify(jwt.verify)

// 用户列表
router.post('/list', async (ctx, next) => {
  const {limit, page} = ctx.request.body
  const list = await getList(limit, page)
  ctx.body = new SuccessModel({data: list})
})

// router.get('/getUserData/:uid', async (ctx, next) => {
//   const token = ctx.header.authorization
//   try {
//     const payload = await verify(token.split(' ')[1], SECRET)
//     ctx.body = {
//       code: 1,
//       data: payload
//     }
//   }catch (e) {
//     ctx.body = {
//       code: 1,
//       data: 'fail'
//     }
//   }
// })
//
// router.get('/add/redLine', async (ctx, next) => {
//   addRedLine()
// })

module.exports = router
