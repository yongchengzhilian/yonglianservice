/**
 * @description 用戶邀请记录表
 * @author zhaojianbo
 */

const seq = require('../seq')
const { STRING, INTEGER, BOOLEAN } = require('../types')

// users
const InviteRecord = seq.define('invite_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  invide_id: {
    type: INTEGER,
    comment: '邀请人id',
  },
  avatar: {
    type: STRING,
    comment: '用户头像',
  },
  gender: {
    type: INTEGER,
    comment: '用户性别',
  },
  isregister: {
    type: BOOLEAN,
    comment: '是否注册',
  }
})


module.exports = InviteRecord
