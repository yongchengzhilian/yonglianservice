/**
 * @description 用户相关业务请求
 * @author zhaojianbo
 */

const {
  getUserList
} = require('../services/userData')
const {
  updateUser
} = require('../services/user')

const getList = async function(limit, page, city = 'NING_BO') {
  let list = await getUserList(limit, page, city)
  return list.map(item => item.dataValues)
}

const updateNickname = async function(nickname, id) {
  await updateUser({nickname}, {where: {id}})
}

const updateAvatar = async function(avatar, id) {
  await updateUser({avatar}, {where: {id}})
}

module.exports = {
  getList,
  updateAvatar,
  updateNickname
}
