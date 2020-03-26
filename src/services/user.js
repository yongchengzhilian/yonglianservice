/**
 * @description 用户相关请求
 * @author zhaojianbo
 */

const User = require('../db/model/User')
const InviteRecord = require('../db/model/InviteRecord')
const Sequelize = require('sequelize')
const {APP_ID} = require('../config/wx')
const seq = require('../db/seq')
const {RED_LINE_RECORD_TYPE} = require('../enum/RedLine')
const {addRedLineRecord} = require('./redLine')

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


const createUser = async function(data, inviteId, city = 'NING_BO') {
  let res = null
  await seq.transaction(async t => {
    // 添加新用户
    res = await User.create({
      nickname: data.nickName,
      avatar: data.avatarUrl,
      gender: data.gender,
      open_id: data.openId,
      union_id: data.unionId,
      appid: APP_ID[city],
    }, {transaction: t})
    if (inviteId) {
      console.log(inviteId)
      // 如果有邀请人 添加邀请记录
      await InviteRecord.create({
        uid: res.id,
        invite_id: inviteId,
        avatar: res.avatar,
        gender: res.gender,
        isregister: false
      }, {transaction: t})
      // 查询邀请记录
      const inviteList = await InviteRecord.findAndCountAll({
        where: {
          invite_id: inviteId
        }
      })
      console.log(inviteList)
      // 如果邀请每5个人 送邀请人一条红线
      if (inviteList.count !== 0 && inviteList.count % 5 === 0) {
        await addRedLine(inviteId)
        await addRedLineRecord(RED_LINE_RECORD_TYPE.INVITE, '邀请赠送', inviteId)
      }
    }
  })


  return res
}
module.exports = {
  getUserInfoByUnionid,
  getUserInfoByUidFromTable,
  createUser,
  addRedLine
}
