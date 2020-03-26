/**
 * @description 红线相关枚举
 * @author zhaojianbo
 */

const RED_LINE_RECORD_TYPE = {
  REGISTER: 1, // 自己注册
  INVITE: 2, // 邀请
  INVITE_REGISTER: 3, // 邀请注册
  BUY: 4, // 购买
  RETURN: 5, // 自动反还
  REFUSE: 6, // 拒绝反还
  LOVE: 7, // 牵线扣除
  OTHER: 8, // 其他
}

module.exports = {
  RED_LINE_RECORD_TYPE
}
