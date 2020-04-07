/**
 * @description 登入相关业务请求
 * @author zhaojianbo
 */

const {wxLogin} = require('../services/wx')
const decryptData = require('../utils/wx/decryptData')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../config/jwt')
const {
  getUserInfoByUnionid,
  getUserInfoByUidFromTable,
  createUser
} = require('../services/user')

const generateToken = function(userinfo) {
  const token = jwt.sign(userinfo, SECRET, {
    expiresIn: '168h'
  })
  return token
}

const getUserinfo = async function (iv, encryptedData, code, inviteId) {
  // 先获取用户unionid
  const wxRes = await wxLogin(code)
  const {session_key} = wxRes

  // 解密
  const userinfo = decryptData(session_key, encryptedData, iv)
  console.log(userinfo, 'userinfo')

  // 判断该用户是否是新用户
  let user = await getUserInfoByUnionid(userinfo.unionId)

  if (!user) {
    // 用户不存在 创建用户
    const createRes = await createUser(userinfo, inviteId)
    user = {
      id: createRes.id,
      nickname: createRes.nickname,
      gender: createRes.gender,
      avatar: createRes.avatar,
      red_line_count: createRes.red_line_count,
      status: createRes.status,
      like_count: createRes.like_count,
      liked_count: createRes.liked_count,
      liking_id: createRes.liking_id,
    }
  } else {
    user = user.dataValues
  }
  user.token = generateToken(user)
  return user
}

const getUserInfoByUid = async function (uid) {
  let user = await getUserInfoByUidFromTable(uid)
  user = user.dataValues
  user.token = generateToken(user)
  return user
}

const getCenterData = async function(uid) {
  let user = await getUserInfoByUidFromTable(uid)
  user = user.dataValues
  return user
}

module.exports = {
  getUserinfo,
  getCenterData,
  getUserInfoByUid
}
