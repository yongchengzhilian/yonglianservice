/**
 * @description 用户喜欢记录
 * @author zhaojianbo
 */

const seq = require('../seq')
const { INTEGER, STRING } = require('../types')

const UserLikeRecord = seq.define('user_like_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  mid: {
    type: INTEGER,
    comment: '中间关联id',
  },
  type: {
    type: INTEGER,
    comment: '喜欢类型：1 我喜欢、2 喜欢我',
  },
  like_id: {
    type: INTEGER,
    comment: '对方id',
  },
  content: {
    type: STRING,
    comment: '留言内容',
  }
})


module.exports = UserLikeRecord
