/**
 * @description 审核记录
 * @author zhaojianbo
 */

const seq = require('../seq')
const { STRING, INTEGER } = require('../types')

const AuthRecord = seq.define('auth_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  type: {
    type: INTEGER,
    comment: '1: 通过 2: 不通过',
  },
  auth_nickname: {
    type: STRING,
    comment: '审核人昵称'
  },
  comment: {
    type: STRING,
    comment: '备注'
  }
})


module.exports = AuthRecord
