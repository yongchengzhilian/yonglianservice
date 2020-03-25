/**
 * @description 用户数据模型
 * @author zhaojianbo
 */

const seq = require('../seq')
const { STRING, INTEGER } = require('../types')

// users
const User = seq.define('user', {
  nickname: {
    type: STRING,
    allowNull: false,
    comment: '用户昵称',
  },
  wechat: {
    type: STRING,
    comment: '用户微信号',
  },
  gender: {
    type: INTEGER,
    allowNull: false,
    comment: '用户性别',
  },
  avatar: {
    type: STRING,
    allowNull: false,
    comment: '用户头像',
  },
  phone: {
    type: STRING,
    comment: '用手机号',
  },
  union_id: {
    type: STRING,
    comment: '微信unionid',
  },
  open_id: {
    type: STRING,
    comment: '微信openid',
  },
  appid: {
    type: STRING,
    comment: '小程序appid',
  },
  red_line_count: {
    type: INTEGER,
    comment: '用户红线数量',
  },
  status: {
    type: INTEGER,
    comment: '用户状态',
  },
  like_count: {
    type: INTEGER,
    comment: '喜欢的数量',
  },
  liked_count: {
    type: INTEGER,
    comment: '被喜欢的数量',
  },
  liking_id: {
    type: INTEGER,
    comment: '当前互相喜欢的用户id',
  }
})


module.exports = User
