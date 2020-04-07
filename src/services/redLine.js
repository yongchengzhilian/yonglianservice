/**
 * @description 红线
 * @author zhaojianbo
 */

const LineRecord = require('../db/model/LineRecord')

const addRedLineRecord = async function (data) {
  await LineRecord.create(data)
}

module.exports = {
  addRedLineRecord
}
