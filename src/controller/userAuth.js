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

const {subscribeMessage} = require('../utils/wx/subscribeMessage')

const {AUTH_TYPE, USER_STATUS} = require('../enum/User')


const getAuthList = async function () {
  const res = await getAuthListService()
  console.log('listService', res)
  // if () {}
  const list = res.map(item => {
    const dataValues = item.dataValues
    const authData = dataValues.user_auth_data[0].dataValues
    authData.time = timeFormat(authData.updatedAt)
    delete dataValues.user_auth_data
    return {
      ...dataValues,
      ...authData
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
  let authResult = '不通过'
  let authMsg = content
  await createAuthRecord({
    type,
    uid: uid,
    comment: content,
    auth_nickname: nickname
  })
  let status = oldStatus
  if (type === AUTH_TYPE.SUCCESS && oldStatus !== USER_STATUS.LOVING) {
    status = USER_STATUS.SINGLE_USER
  }
  await updateUser({status}, {where: {id: uid}})
  if (type === AUTH_TYPE.SUCCESS) {
    authResult = '通过'
    authMsg = content || '若遇可疑人员， 可向客服举报'
    const userinfo = await getUserAuthData(uid)
    if (oldStatus === USER_STATUS.NEED_USER_DATA) {
      await createUserData(userinfo)
      await updateRedLine(uid, 1)
      await addRedLineRecord({
        uid,
        type: RED_LINE_RECORD_TYPE.OTHER,
        comment: '资料提交赠送'
      })
    } else {
      updateUserData(userinfo, {where: {uid}})
    }
  }
  subscribeMessage.authMessage({
    openid: data.open_id,
    data: {
      phrase2: {
        value: authResult
      },
      thing3: {
        value: authMsg
      }
    }
  })

}

module.exports = {
  getAuthList,
  userAuth,
  getAuthDetail
}
