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

const AUTH_TYPE = {
  SUCCESS: 1,
  FAIL: 2
}


const LIKE_RECORD_TYPE = {
  I_LIKE: 1, // 我喜欢
  LIKE_ME: 2, // 喜欢我
  I_LIKE_SUCCESS: 3, // 我喜欢牵线成功
  LIKE_ME_SUCCESS: 4, // 喜欢我牵线成功
  I_LIKE_FAIL_TIMEOUT: 5, // 我喜欢超時牵线失败
  LIKE_ME_FAIL_TIMEOUT: 6, // 喜欢我超時牵线失败
  I_LIKE_FAIL: 7, // 喜欢我牵线失败
  LIKE_ME_FAIL: 8, // 喜欢我牵线失败
}

module.exports = {
  USER_STATUS,
  USER_GENDER,
  AUTH_TYPE,
  LIKE_RECORD_TYPE,
}
