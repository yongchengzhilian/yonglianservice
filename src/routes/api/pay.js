/**
 * @description 支付功能
 * @author zhaojianbo
 */

const router = require('koa-router')()
const {SuccessModel} = require('../../model/ResModel')
const {pay} = require('../../utils/wx/pay')
const {getClientIP} = require('../../utils/utils')

router.prefix('/pay')

router.post('/order', async (ctx, next) => {
  // console.log(33333, getClientIP(ctx.req))
  // console.log("headers = " + JSON.stringify(ctx.req.headers));// 包含了各种header，包括x-forwarded-for(如果被代理过的话)
  // console.log("x-forwarded-for = " + ctx.req.headers['x-forwarded-for']);// 各阶段ip的CSV, 最左侧的是原始ip
  // console.log("ips = " + JSON.stringify(ctx.req.ips));// 相当于(req.header('x-forwarded-for') || '').split(',')
  // console.log("remoteAddress = " + ctx.req.connection.remoteAddress);// 未发生代理时，请求的ip
  // console.log("ip = " + ctx.req.ip);// 同req.connection.remoteAddress, 但是格式要好一些
  let now = new Date().getTime()
  const orderId = `AI_DOU_PAY_ORDER_ID${now}`
  const res = await pay({
    orderId,
    openid: 'opssg5RDWNGdpqdvnB_iTEG9w1fY',
    desc: '测试',
    totalPrice: 0.01,
    spbill_create_ip: getClientIP(ctx.req)
  })
  ctx.body = new SuccessModel(res)
})

router.get('/notify', async (ctx, next) => {
  console.log(111, ctx.params)
})


module.exports = router
