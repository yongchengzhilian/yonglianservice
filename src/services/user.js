/**
 * @description 用户相关请求
 * @author zhaojianbo
 */
const {Op} = require('sequelize')
const {
  User,
  UserData,
  InviteRecord,
  UserIdcard,
  AUthRecord
} = require('../db/model/index')
const {USER_STATUS} = require('../enum/User')
const Sequelize = require('sequelize')
const {APP_ID} = require('../config/wx')
const {RED_LINE_RECORD_TYPE} = require('../enum/RedLine')
const {addRedLineRecord} = require('./redLine')

/**
 * @description 獲取用戶信息
 * @param {params} 搜索條件
 */
const getUserinfo = async function(params) {
  const res = await User.findOne({
    attributes: [
      'id',
      'nickname',
      'gender',
      'avatar',
      'red_line_count',
      'status',
      'like_count',
      'liked_count',
      'liking_id',
    ],
    where: params
  })
  return res
}

const getUserInfoByUnionid = async function(unionid) {
  const res = await getUserinfo({
    union_id: unionid
  })
  return res
}

const addRedLine = async function (uid, num = 1) {
  await User.update({
    red_line_count: Sequelize.literal('red_line_count + 1'),
  }, {
    where: {
      id: uid
    }
  })
}

const getUserInfoByUidFromTable = async function(uid) {
  const res = await getUserinfo({
    id: uid
  })
  return res
}

const updateUser = async function(data, options) {
  const res = await User.update(data, options)
  return res
}

const getAuthListService = async function() {
  const res = await User.findAll({
    attributes: [
      'nickname',
      'gender',
      'wechat',
      'avatar',
      'phone',
      'status',
      'id'
    ],
    include: [
      {
        model: UserData,
        attributes: [
          'income',
          'education',
          'house_car',
          'updatedAt',
          'marriage',
          'current_place',
          'native_place',
          'height',
          'weight',
          'work'
        ]
      }
    ],
    where: {
      status: {
        [Op.or]: [USER_STATUS.DATA_AUTHING_1, USER_STATUS.DATA_AUTHING_2],
      }
    }
  })
  return res
}

const getAuthDetailService = async function (id) {
  const res = await User.findOne({
    attributes: [
      'nickname',
      'gender',
      'wechat',
      'avatar',
      'phone',
      'status',
      'id'
    ],
    include: [
      {
        model: UserData,
        attributes: [
          'income',
          'education',
          'house_car',
          'updatedAt',
          'marriage',
          'photos',
          'current_place',
          'native_place',
          'about_me',
          'hobby',
          'about_ta',
          'height',
          'weight',
          'work'
        ]
      },
      {
        model: UserIdcard,
        attributes: [
          'idcard_num',
          'name',
          'idcard_front',
          'idcard_back'
        ]
      },
      {
        model: AUthRecord,
        attributes: [
          'auth_nickname',
          'type',
          'comment'
        ]
      }
    ],
    where: {id}
  })
  return res
}


const createUser = async function(data, inviteId, city = 'NING_BO') {
  // 添加新用户
  let res = await User.create({
    nickname: data.nickName,
    avatar: data.avatarUrl,
    gender: data.gender,
    open_id: data.openId,
    union_id: data.unionId,
    city,
    appid: APP_ID[city],
  })
  if (inviteId) {
    // 如果有邀请人 添加邀请记录
    await InviteRecord.create({
      uid: res.id,
      invite_id: inviteId,
      avatar: res.avatar,
      gender: res.gender,
      isregister: false
    })

    // 查询邀请记录
    const inviteList = await InviteRecord.findAndCountAll({
      where: {
        invite_id: inviteId
      }
    })

    // 如果邀请每5个人 送邀请人一条红线
    if (inviteList.count !== 0 && inviteList.count % 5 === 0) {
      await addRedLine(inviteId)
      await addRedLineRecord(RED_LINE_RECORD_TYPE.INVITE, '邀请赠送', inviteId)
    }
  }


  return res
}
module.exports = {
  getUserInfoByUnionid,
  getUserInfoByUidFromTable,
  createUser,
  updateUser,
  getAuthListService,
  getAuthDetailService,
  addRedLine
}
