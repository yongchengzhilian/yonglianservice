/**
 * @description 用户退出
 * @author zhaojianbo
 */


// TODO
const seq = require('../seq')
const { INTEGER } = require('../types')

// users
const Logout = seq.define('logout', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  type: {
    type: INTEGER,
    comment: '退出类型',
  }
})


module.exports = Logout
