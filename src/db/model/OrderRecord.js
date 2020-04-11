/**
 * @description 订单记录
 * @author zhaojianbo
 */


// TODO
const seq = require('../seq')
const { INTEGER, STRING } = require('../types')

const OrderRecord = seq.define('order_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  appid: {
    type: STRING,
    comment: '调用接口提交的公众账号ID',
  },
  mch_id: {
    type: STRING,
    comment: '调用接口提交的商户号',
  },
  device_info: {
    type: STRING,
    comment: '自定义参数，可以为请求支付的终端设备号等',
  },
  result_code: {
    type: STRING,
    comment: '业务结果 SUCCESS/FAIL',
  },
  openid: {
    type: STRING,
    comment: 'openid',
  },
  desc: {
    type: STRING,
    comment: '备注',
  },
  total_fee: {
    type: INTEGER,
    comment: '订单总金额，单位为分',
  },
  fee_type: {
    type: STRING,
    comment: '标价币种',
  },
  bank_type: {
    type: STRING,
    comment: '',
  },
  trade_type: {
    type: STRING,
    comment: '交易类型',
  },
  out_trade_no: {
    type: STRING,
    comment: '商户订单号',
  }
})


module.exports = OrderRecord
