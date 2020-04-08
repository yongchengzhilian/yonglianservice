/**
 * @description 用户互相喜欢记录
 * @author zhaojianbo
 */

const {
  UserLoveRecord,
  User
} = require('../db/model/index')

const createLoveRecord = async function (data) {
  const res = await UserLoveRecord.bulkCreate(data)
  return res
}

module.exports = {
  createLoveRecord
}
