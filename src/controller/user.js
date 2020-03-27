/**
 * @description 用户相关业务请求
 * @author zhaojianbo
 */

const {
  getUserList
} = require('../services/userData')

const getList = async function(limit, page, city = 'NING_BO') {
  let list = await getUserList(limit, page, city)
  return list.map(item => item.dataValues)
}


module.exports = {
  getList
}
