/**
 * @description 用户喜欢列表定时器
 * @author zhaojianbo
 */
const {
  RED_LINE_BACK_TIME,
  ONE_HOURS_INTERVAL
} = require('../config/config')
const {LIKE_RECORD_TYPE} = require('../enum/User')

const {RED_LINE_RECORD_TYPE} = require('../enum/RedLine')
const {
  getUserLikeList,
  updateLikeRecord,
} = require('../services/userLikeRecord')

const {
  refreshWxAccessToken
} = require('./wx/refreshAccessToken')

const {
  updateRedLine
} = require('../services/user')

const {
  addRedLineRecord
} = require('../services/redLine')

const userLikeHandle = async function() {
  const userLikeList = await getUserLikeList()
  for (let i = 0; i < userLikeList.length; i++) {
    let record = userLikeList[i].dataValues
    const createTime = new Date(record.createdAt).getTime()
    const now = new Date().getTime()
    if (now - createTime > RED_LINE_BACK_TIME) {
      await updateLikeRecord({type: LIKE_RECORD_TYPE.I_LIKE_FAIL_TIMEOUT}, {
        where: {
          id: record.id
        }
      })
      await updateLikeRecord({type: LIKE_RECORD_TYPE.LIKE_ME_FAIL_TIMEOUT}, {
        where: {
          mid: record.id
        }
      })
      await updateRedLine(record.uid, 1)
      await addRedLineRecord({
        uid: record.uid,
        type: RED_LINE_RECORD_TYPE.RETURN,
        comment: '牵线超时自动返还'
      })

      const res = getUserInfoByUidFromTable(record.uid)
      subscribeMessage.applyResult({
        openid: res.dataValues.open_id,
        data: {
          phrase1: '牵线失败',
          thing2: '红线已返回,再看看其他有缘人吧'
        }
      })
    }
  }
}

refreshWxAccessToken()

const interval = setInterval(async function () {
  try {
    userLikeHandle()
  } catch (e) {

  }
  try {
    refreshWxAccessToken()
  } catch (e) {

  }
}, ONE_HOURS_INTERVAL)

module.exports = {
  userLikeInterval: interval
}
