/**
 * @description 用户喜欢记录
 * @author zhaojianbo
 */

const {
  UserLikeRecord,
  User
} = require('../db/model/index')
const {LIKE_RECORD_TYPE} = require('../enum/User')

const getLikeRecordService = async function(data) {
  const {id, uid} = data
  const res = await UserLikeRecord.findOne({
    where: {uid: id, like_id: uid}
  })
  return res
}

const addLikeRecord = async function(data) {
  const res = await UserLikeRecord.create(data)
  return res
}

const getUserLikeList = async function() {
  const res = await UserLikeRecord.findAll({
    where: {type: LIKE_RECORD_TYPE.I_LIKE}
  })
  return res
}

const updateLikeRecord = async function(data, options) {
  const res = await UserLikeRecord.update(data, options)
  return res
}

const getUserLikedRecord = async function(id) {
  const res = await UserLikeRecord.findAll({
    attributes: ['uid', 'content', 'updatedAt'],
    include: [
      {
        model: User,
        attributes: [
          'nickname',
          'gender',
          'avatar'
        ]
      }
    ],
    where: {
      like_id: id,
      type: LIKE_RECORD_TYPE.I_LIKE
    }
  })
  return res
}

module.exports = {
  getLikeRecordService,
  addLikeRecord,
  getUserLikeList,
  updateLikeRecord,
  getUserLikedRecord,
}
