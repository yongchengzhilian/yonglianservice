/**
 * @description 用户喜欢记录
 * @author zhaojianbo
 */

const seq = require('../seq')
const { INTEGER } = require('../types')

const UserLikeRecord = seq.define('user_like_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  type: {
    type: INTEGER,
    comment: '喜欢类型：1 我喜欢、2 喜欢我',
  },
  like_id: {
    type: INTEGER,
    comment: '对方id',
  }
})


module.exports = UserLikeRecord
