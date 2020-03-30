/**
 * @description 用户资料相关请求
 * @author zhaojianbo
 */

const UserData = require('../db/model/UserData')
const {APP_ID} = require('../config/wx')

const getUserList = async function(limit, page, city = 'NING_BO') {
  const res = await UserData.findAll({
    limit,
    offset: limit * (page -1),
    order: [['updatedAt', 'DESC']],
    attributes: ['avatar', 'birthday', 'height', 'current_place', 'house_car', 'marriage', 'education'],
    where: {
      city
    }
  })
  return res
}

const updateUserData = async function(data, options) {
  const res = await UserData.update(data, options)
  return res
}

const createUserData = async function(data) {
  await UserData.create(data)
}

module.exports = {
  getUserList,
  updateUserData,
  createUserData,
}
