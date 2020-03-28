/**
 * @description 用户状态枚举
 * @author zhaojianbo
 * */

// 用戶状态
const USER_STATUS = {
  FORBID: -1, // 黑名单用户
  NEED_IDCARD: 1, // 需要提交资料以及实名认证
  NEED_USER_DATA: 2, // 已实名未提交资料
  DATA_AUTHING_1: 3, // 新用户第一次提交资料
  DATA_AUTHING_2: 4, // 用户修改资料
  SINGLE_USER: 5, // 单身用户, 可被牵线
  LOVING: 6, // 牵线中用户
  LOG_OFF: 7, // 用户注销
}

// 用戶性别
const USER_GENDER = {
  MALE: 1, // 男性
  FEMALE: 2, // 女性
}

module.exports = { USER_STATUS, USER_GENDER }
