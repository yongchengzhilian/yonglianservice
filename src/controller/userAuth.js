/**
 * @description 用户审核相关
 * @author zhaojianbo
 */
const {
  getAuthListService,
  getAuthDetailService
} = require('../services/user')
const {timeFormat} = require('../utils/dt')


const getAuthList = async function () {
  const res = await getAuthListService()
  // if () {}
  const list = res.map(item => {
    const {
      nickname,
      gender,
      wechat,
      avatar,
      phone,
      status,
      id
    } = item.dataValues
    let time = timeFormat(item.dataValues.user_data[0].dataValues.updatedAt)
    return {
      nickname,
      gender,
      wechat,
      avatar,
      phone,
      status,
      id,
      time,
      ...item.dataValues.user_data[0].dataValues
    }
  })
  return list
}

const getAuthDetail = async function (id) {
  const res = await getAuthDetailService(id)
  return res.dataValues
}

module.exports = {
  getAuthList,
  getAuthDetail
}
