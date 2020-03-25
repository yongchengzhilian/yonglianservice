/**
 * @description 用户状态枚举
 * @author zhaojianbo
 * */

// 用戶状态
const USER_STATUS = {
  FORBID: -1, // 黑名单用户
  NEED_EDIT_DATA: 1, // 需要完善资料
  DATA_AUTHING_1: 2, // 新用户第一次提交资料
  DATA_AUTHING_2: 3, // 用户修改资料
  SINGLE_USER: 4, // 单身用户, 可被牵线
  LOVING: 5, // 牵线中用户
  LOG_OFF: 6, // 用户注销
}

// 用戶性别
const USER_GENDER = {
  MALE: 1, // 男性
  FEMALE: 2, // 女性
}

module.exports = { USER_STATUS, USER_GENDER }
