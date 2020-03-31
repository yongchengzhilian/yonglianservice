/**
 * @description 用户相关业务请求
 * @author zhaojianbo
 */

const {
  getUserList,
  createUserData,
  updateUserData
} = require('../services/userData')
const {
  updateUser
} = require('../services/user')

const {
  saveIdcard,
  getIdcard,
} = require('../services/userIdcard')
const {
  analyzeIDCard
} = require('../utils/utils')

const {USER_STATUS} = require('../enum/User')

const getList = async function(limit, page, city = 'NING_BO') {
  let list = await getUserList(limit, page, city)
  return list.map(item => item.dataValues)
}

const updateNickname = async function(nickname, id) {
  await updateUser({nickname}, {where: {id}})
  await updateUserData({nickname}, {where: {uid: id}})
}

const updateAvatar = async function(avatar, id) {
  await updateUser({avatar}, {where: {id}})
  await updateUserData({avatar}, {where: {uid: id}})
}

const saveIdcardInfo = async function(data) {
  const {
    idcard_num,
    idcard_front,
    idcard_back,
    id,
    nickname,
    avatar,
    name
  } = data
  await saveIdcard({
    idcard_num,
    idcard_front,
    idcard_back,
    uid: id,
    name
  })
  const userInfo = analyzeIDCard(idcard_num)
  const gender = userInfo.gender
  const status = USER_STATUS.NEED_USER_DATA
  await updateUser({
    gender, status
  }, {where: {id}})
  await createUserData({
    gender,
    nickname,
    avatar,
    city: 'NING_BO',
    native_place: userInfo.native_place,
    birthday: userInfo.birthday,
    uid: id
  })
}

const idcardIsExist = async function(idcardNum) {
  const idcard = await getIdcard({idcard_num: idcardNum})
  if (idcard) {
    throw new global.HttpException('身份证已存在,若有疑问请联系红娘')
  }
  return
}

const saveUserData = async function(data) {
  let status = USER_STATUS.DATA_AUTHING_1
  const wechat = data.wechat
  if (data.status !== USER_STATUS.NEED_USER_DATA) {
    status = USER_STATUS.DATA_AUTHING_2
  }
  const userinfo = {
    status,
    income: data.income,
    education: data.education,
    photos: data.photo,
    house_car: data.house_car,
    marriage: data.marriage,
    current_place: data.currentPlace,
    height: data.height,
    weight: data.weight,
    about_me: data.content,
    about_ta: data.favoriteTa,
    hobby: data.interest,
    work: data.work
  }
  await updateUser({status, wechat}, {where: {id: data.id}})
  await updateUserData(userinfo, {where: {uid: data.id}})
}

const getSelfInfo = async function(data) {

}

module.exports = {
  getList,
  updateAvatar,
  idcardIsExist,
  getSelfInfo,
  saveIdcardInfo,
  saveUserData,
  updateNickname
}
