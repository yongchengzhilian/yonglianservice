/**
 * @description 用户资料
 * @author zhaojianbo
 */

const seq = require('../seq')
const { STRING, INTEGER, DATE, TEXT } = require('../types')

const UserData = seq.define('user_data', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  city: {
    type: STRING,
    comment: '城市',
  },
  nickname: {
    type: STRING,
    comment: '用户昵称',
  },
  birthday: {
    type: DATE,
    comment: '生日',
  },
  avatar: {
    type: STRING,
    comment: '用户头像',
  },
  gender: {
    type: INTEGER,
    comment: '用户性别',
  },
  income: {
    type: INTEGER,
    comment: '收入',
  },
  education: {
    type: INTEGER,
    comment: '用户学历',
  },
  photos: {
    type: TEXT,
    comment: '用户相册逗号隔开的字符串',
  },
  house_car: {
    type: INTEGER,
    comment: '房子车子',
  },
  marriage: {
    type: INTEGER,
    comment: '婚姻状态',
  },
  native_place: {
    type: STRING,
    comment: '籍贯',
  },
  current_place: {
    type: INTEGER,
    comment: '现住',
  },
  height: {
    type: INTEGER,
    comment: '身高',
  },
  weight: {
    type: INTEGER,
    comment: '体重(kg)',
  },
  work: {
    type: INTEGER,
    comment: '工作',
  },
  about_me: {
    type: STRING,
    comment: '关于我',
  },
  hobby: {
    type: STRING,
    comment: '兴趣爱好',
  },
  about_ta: {
    type: STRING,
    comment: '心动的Ta',
  }
})


module.exports = UserData
