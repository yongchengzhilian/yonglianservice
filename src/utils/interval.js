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
  updateRedLine,
  getUserInfoByUidFromTable
} = require('../services/user')

const {
  addRedLineRecord
} = require('../services/redLine')
const {subscribeMessage} = require('./wx/subscribeMessage')
const {
  uploadTempMedia
} = require('./uploadTempMedia')

const userLikeHandle = async function() {
  const userLikeList = await getUserLikeList()
  for (let i = 0; i < userLikeList.length; i++) {
    let record = userLikeList[i].dataValues
    const createTime = new Date(record.updatedAt).getTime()
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

      const res = await getUserInfoByUidFromTable(record.uid)
      // console.log()
      await subscribeMessage.applyResult({
        openid: res.dataValues.open_id,
        data: {
          phrase1: {value: '牵线失败'},
          thing2: {value: '红线已返回,再看看其他有缘人吧'}
        }
      })
    }
  }
}

refreshWxAccessToken().then(res => {
  uploadTempMedia()
})
userLikeHandle()


const interval = setInterval(async function () {
  try {
    userLikeHandle()
  } catch (e) {
    console.error(e)
  }
}, ONE_HOURS_INTERVAL)

// access_token 5分钟刷新一次
setInterval(() => {
  refreshWxAccessToken()
}, 1000 * 60 * 4)

setInterval(async function () {
  uploadTempMedia()
}, 1000 * 60 * 60 *24 * 2)

module.exports = {
  userLikeInterval: interval
}
