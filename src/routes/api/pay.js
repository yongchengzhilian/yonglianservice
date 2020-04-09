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
  console.log(33333, getClientIP(ctx.req))
  const res = await pay({
    openid: '',
    orderId: 'asdfghjklp1234567890poiuytreew21',
    desc: '测试',
    totalPrice: 0.1,
    spbill_create_ip: getClientIP(ctx.req)
  })
  console.log(res)
})


module.exports = router