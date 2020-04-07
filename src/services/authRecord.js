/**
 * @description 用户审核
 * @author zhaojianbo
 */

const {
  AUthRecord
} = require('../db/model/index')

const createAuthRecord = async function(data) {
  await AUthRecord.create(data)
}

module.exports = {
  createAuthRecord
}
