/**
 * @description 用户相关业务请求
 * @author zhaojianbo
 */

const {
  getUserList
} = require('../services/userData')

const getList = async function(limit, page, city = 'NING_BO') {
  const list = await getUserList(limit, page, city)
  console.log(111, list)
}


module.exports = {
  getList
}
