/**
 * @description 用户身份证信息
 * @author zhaojianbo
 */

const seq = require('../seq')
const { STRING, INTEGER } = require('../types')

const UserIdcard = seq.define('user_idcard', {
  uid: {
    type: INTEGER,
    comment: '用户id',
  },
  idcard_num: {
    type: STRING,
    comment: '身份证号',
  },
  idcard_front: {
    type: STRING,
    comment: '身份证正面图片地址',
  },
  idcard_back: {
    type: STRING,
    comment: '身份证反面图片地址',
  },
})


module.exports = UserIdcard
