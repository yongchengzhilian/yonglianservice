/**
 * @description 红线记录
 * @author zhaojianbo
 */

const seq = require('../seq')
const { INTEGER, STRING } = require('../types')

// users
const LineRecord = seq.define('line_record', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  /**
   1 注册赠送
   2 分享赠送
   3 分享注册赠送
   4 其他赠送
   5 购买
   6 牵线扣除
   7 拒绝反还
   8 到期自动反还
   * */
  type: {
    type: INTEGER,
    comment: '类型',
  },
  comment: {
    type: STRING,
    comment: '备注'
  }
})


module.exports = LineRecord
