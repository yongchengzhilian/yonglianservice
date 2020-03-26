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

module.exports = {
  getUserList,
}
