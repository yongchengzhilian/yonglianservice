/**
 * @description 用户资料相关请求
 * @author zhaojianbo
 */

const {
  UserData,
  User
} = require('../db/model/index')
const {APP_ID} = require('../config/wx')
const {USER_STATUS} = require('../enum/User')
const {Op} = require('sequelize')

const getUserList = async function(limit, page, gender, city = 'NING_BO') {
  const res = await User.findAll({
    limit,
    offset: limit * (page -1),
    include: {
      model: UserData,
      attributes: [
        'uid',
        'avatar',
        'nickname',
        'birthday',
        'gender',
        'height',
        'current_place',
        'house_car',
        'marriage',
        'education',
        'updatedAt'
      ],
    },
    order: [['updatedAt', 'DESC']],

    where: {
      gender,
      status: {
        [Op.or]: [USER_STATUS.DATA_AUTHING_2, USER_STATUS.SINGLE_USER]
      }
    }
  })
  return res
}

const updateUserData = async function(data, options) {
  const res = await UserData.update(data, options)
  return res
}

const createUserData = async function(data) {
  await UserData.create(data)
}

const getUserDetailService = async function(uid) {
  const res = await UserData.findOne({
    where: {uid}
  })
  return res
}

module.exports = {
  getUserList,
  updateUserData,
  createUserData,
  getUserDetailService,
}
