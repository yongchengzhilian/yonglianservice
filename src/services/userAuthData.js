/**
 * @description 用户资料审核
 * @author zhaojianbo
 */

const {UserAuthData} = require('../db/model/index')

const updateUserAuthData = async function(data, options) {
  const res = await UserAuthData.update(data, options)
  return res
}

const createUserAuthData = async function(data) {
  await UserAuthData.create(data)
}

const getUserAuthData = async function(uid) {
  const res = await UserAuthData.findOne({
    attributes: [
      'uid',
      'nickname',
      'birthday',
      'avatar',
      'gender',
      'income',
      'education',
      'photos',
      'house_car',
      'marriage',
      'native_place',
      'current_place',
      'height',
      'weight',
      'work',
      'about_me',
      'hobby',
      'about_ta',
    ],
    where: {uid}
  })
  return res.dataValues
}

module.exports = {
  updateUserAuthData,
  createUserAuthData,
  getUserAuthData,
}
