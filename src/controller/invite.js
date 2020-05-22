/**
 *  @description 邀请业务处理
 * */

const {
  getInviteListService
} = require('../services/invite')

const getInviteList = async function (id) {
  const res = await getInviteListService(id)
  console.error(res)
  const list = res.map(item => {
    return item.dataValues
  })
  return list
}

module.exports = {
  getInviteList
}
