/**
 * @description 用户相关业务请求
 * @author zhaojianbo
 */

const {
  getUserList,
  createUserData
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
}

const updateAvatar = async function(avatar, id) {
  await updateUser({avatar}, {where: {id}})
}

const saveIdcardInfo = async function(data) {
  const {
    idcard_num,
    idcard_front,
    idcard_back,
    id,
    name
  } = data
  console.log(222, data)
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

module.exports = {
  getList,
  updateAvatar,
  idcardIsExist,
  saveIdcardInfo,
  updateNickname
}
