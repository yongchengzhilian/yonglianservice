/**
 * @description 用户审核相关
 * @author zhaojianbo
 */
const {
  getAuthListService,
  updateUser,
  getAuthDetailService
} = require('../services/user')
const {createUserData, updateUserData} = require('../services/userData')
const {
  createAuthRecord
} = require('../services/authRecord')
const {getUserAuthData} = require('../services/userAuthData')
const {timeFormat} = require('../utils/dt')

const {AUTH_TYPE, USER_STATUS} = require('../enum/User')


const getAuthList = async function () {
  const res = await getAuthListService()
  // if () {}
  const list = res.map(item => {
    const {
      nickname,
      gender,
      wechat,
      avatar,
      phone,
      status,
      id
    } = item.dataValues
    let time = timeFormat(item.dataValues.user_auth_data[0].dataValues.updatedAt)
    return {
      nickname,
      gender,
      wechat,
      avatar,
      phone,
      status,
      id,
      time,
      ...item.dataValues.user_auth_data[0].dataValues
    }
  })
  return list
}

const getAuthDetail = async function (id) {
  const res = await getAuthDetailService(id)
  return res.dataValues
}

const userAuth = async function(data) {
  const {uid, nickname, content, type, oldStatus} = data
  await createAuthRecord({
    type,
    uid: uid,
    comment: content,
    auth_nickname: nickname
  })
  let status = oldStatus
  if (type === AUTH_TYPE.SUCCESS && oldStatus === USER_STATUS.NEED_USER_DATA) {
    status = USER_STATUS.SINGLE_USER
  }

  await updateUser({status}, {where: {id: uid}})
  if (type === AUTH_TYPE.SUCCESS) {
    const userinfo = await getUserAuthData(uid)
    if (oldStatus === USER_STATUS.NEED_USER_DATA) {
      createUserData(userinfo)
    } else {
      updateUserData(userinfo, {where: {uid}})
    }
  }

}

module.exports = {
  getAuthList,
  userAuth,
  getAuthDetail
}
