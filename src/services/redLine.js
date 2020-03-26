/**
 * @description 红线
 * @author zhaojianbo
 */

const LineRecord = require('../db/model/LineRecord')

const addRedLineRecord = async function (type, comment, uid) {
  await LineRecord.create({
    uid, comment, type
  })
}
