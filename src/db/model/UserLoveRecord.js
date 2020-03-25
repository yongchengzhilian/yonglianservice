/**
 * @description 用户互相喜欢记录
 * @author zhaojianbo
 */

const seq = require('../seq')
const { INTEGER, STRING } = require('../types')

const UserLoveRecord = seq.define('user_love_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  type: {
    type: INTEGER,
    comment: '喜欢类型：1 我喜欢、2 喜欢我',
  },
  love_id: {
    type: INTEGER,
    comment: '对方id',
  },
  love_type: {
    type: INTEGER,
    comment: '1 我发起、2 对方发起'
  },
  refuse_type: {
    type: INTEGER,
    comment: 'null 牵线中、1 我拒绝、2 对方拒绝'
  },
  refuse_reason: {
    type: STRING,
    comment: '拒绝原因'
  }
})


module.exports = UserLoveRecord
