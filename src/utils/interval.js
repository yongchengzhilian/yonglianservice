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
  console.log('=============>', userLikeList)
  for (let i = 0; i < userLikeList.length; i++) {
    let record = userLikeList[i].dataValues
    const createTime = new Date(record.createdAt).getTime()
    const now = new Date().getTime()
    console.log('=============>', now - createTime)
    if (now - createTime > 1000) {
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
      console.log('--------------', res.dataValues)
      // console.log()
      await subscribeMessage.applyResult({
        openid: res.dataValues.open_id,
        data: {
          phrase1: '牵线失败',
          thing2: '红线已返回,再看看其他有缘人吧'
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

  }
  try {
    // 后期需要改
    // access_token 的有效期目前为 2 个小时，需定时刷新，重复获取将导致上次获取的 access_token 失效
    refreshWxAccessToken()
  } catch (e) {

  }
}, 1000)


setInterval(async function () {
  uploadTempMedia()
}, 1000 * 60 * 60 *24 * 2)

module.exports = {
  userLikeInterval: interval
}
