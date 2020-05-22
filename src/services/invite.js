/**
 * @description 邀请记录
 * @author zhaojianbo
 */
const {
  InviteRecord
} = require('../db/model/index')

const getInviteListService = async function (id) {
  const res = InviteRecord.findAll({
    attributes: ['avatar'],
    where: {
      invite_id: id
    }
  })
  return res
}

module.exports = {
  getInviteListService
}
