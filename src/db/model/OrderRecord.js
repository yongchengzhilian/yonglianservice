/**
 * @description 订单记录
 * @author zhaojianbo
 */


// TODO
const seq = require('../seq')
const { INTEGER, STRING, TEXT } = require('../types')

const OrderRecord = seq.define('order_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  order_status: {
    type: INTEGER,
    comment: '用户id', // 1：未支付 2：已支付   -1:订单异常
  }
})


module.exports = OrderRecord
