/**
 * @description 订单记录
 * @author zhaojianbo
 */

const {
  OrderRecord
} = require('../db/model/index')

const createOrderRecord = async function(data) {
  await OrderRecord.create(data)
}

const getUserSuccessOrderCount = async function(uid) {
  const res = await OrderRecord.count({
    where: {
      uid,
      result_code: 'SUCCESS'
    }
  })

  console.log(res)

  return res
}

const updateOrderRecord = async function (data, options) {
  const res = await OrderRecord.update(data, options)
  return res
}

const getUidByOrderId = async function(id) {
  const res = await OrderRecord.findOne({
    attributes: ['uid'],
    where: {
      out_trade_no: id
    }
  })
  return res
}

module.exports = {
  createOrderRecord,
  updateOrderRecord,
  getUidByOrderId,
  getUserSuccessOrderCount
}
