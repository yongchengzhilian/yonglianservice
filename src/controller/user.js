/**
 * @description 用户相关业务请求
 * @author zhaojianbo
 */

const {
  getUserList,
  getUserDetailService,
  updateUserData
} = require('../services/userData')
const {
  getLikeRecordService,
  getUserLikedRecord,
  updateLikeRecord,
  addLikeRecord
} = require('../services/userLikeRecord')
const {
  createUserAuthData,
  updateUserAuthData
} = require('../services/userAuthData')
const {
  updateUser,
  getSelfInfoService,
  updateLikeCount,
  updateLikedCount,
  getLoveDataService,
  updateRedLine,
  getUserInfoByUidFromTable
} = require('../services/user')

const {
  saveIdcard,
  getIdcard,
} = require('../services/userIdcard')
const {
  analyzeIDCard
} = require('../utils/utils')

const {
  addRedLineRecord
} = require('../services/redLine')

const {
  createLoveRecord,
  updateLoveRecord
} = require('../services/userLoveRecord')

const {
  USER_STATUS,
  LOVE_REFUSE_TYPE,
  LIKE_RECORD_TYPE,
  LOVE_TYPE
} = require('../enum/User')

const {
  timeFormat,
  getCurrentDate
} = require('../utils/dt')

const {subscribeMessage} = require('../utils/wx/subscribeMessage')

const {
  RED_LINE_RECORD_TYPE
} = require('../enum/RedLine')

const getList = async function(limit, page, gender, city = 'NING_BO') {
  let list = await getUserList(limit, page, gender, city)
  const listFormat = list.map(item => {
    return item.dataValues.user_data[0]
  })
  return listFormat
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
  await createUserAuthData({
    gender,
    nickname,
    avatar,
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
  const phone = data.mobile
  if (data.status !== USER_STATUS.NEED_USER_DATA) {
    status = USER_STATUS.DATA_AUTHING_2
  }
  const userinfo = {
    old_status: data.status,
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
  await updateUser({status, wechat, phone}, {where: {id: data.id}})
  await updateUserAuthData(userinfo, {where: {uid: data.id}})
}

const getSelfInfo = async function(id) {
  const res = await getSelfInfoService(id)
  let selfInfo = res.dataValues
  const data = selfInfo.user_data[0].dataValues
  delete selfInfo.user_data
  return {...selfInfo, ...data}
}

const getUserDetail = async function (uid) {
  const res = await getUserDetailService(uid)
  return res.dataValues
}

const getLikeRecord = async function(data) {
  const res = await getLikeRecordService(data)
  if (!res) {
    return {}
  }
  return res.dataValues
}

const addLike = async function(data) {
  // 第一次喜欢
  if (data.type === 'create') {
    const res = await addLikeRecord({
      uid: data.id,
      content: data.content,
      like_id: data.uid,
      type: LIKE_RECORD_TYPE.I_LIKE
    })
    await addLikeRecord({
      uid: data.uid,
      content: data.content,
      mid: res.dataValues.id,
      like_id: data.id,
      type: LIKE_RECORD_TYPE.LIKE_ME
    })
    await updateLikeCount(data.id)
    await updateLikedCount(data.uid)
    await updateRedLine(data.id, -1)
    await addRedLineRecord({
      uid: data.id,
      type: RED_LINE_RECORD_TYPE.LOVE,
      comment: '牵线扣除'
    })
  } else {
    // 第二次喜欢
    await updateLikeRecord({
      content: data.content,
      type: LIKE_RECORD_TYPE.I_LIKE
    }, {
      where: {
        uid: data.id,
        like_id: data.uid,
      }
    })
    await updateLikeRecord({
      content: data.content,
      type: LIKE_RECORD_TYPE.LIKE_ME
    }, {
      where: {
        uid: data.uid,
        like_id: data.id
      }
    })
    await updateRedLine(data.id, -1)
    await addRedLineRecord({
      uid: data.id,
      type: RED_LINE_RECORD_TYPE.LOVE,
      comment: '牵线扣除'
    })
  }

  getUserInfoByUidFromTable(data.uid).then(res => {
    subscribeMessage.applyMessage({
      openid: res.dataValues.open_id,
      data: {
        name1: {
          value: res.dataValues.nickname,
        },
        date2: {
          value: getCurrentDate(),
        }
      }
    })
  })


}

const userRefuse = async function(data) {
  await updateLikeRecord({
    type: LIKE_RECORD_TYPE.I_LIKE_FAIL
  }, {
    where: {
      uid: data.uid,
      like_id: data.id,
    }
  })
  await updateLikeRecord({
    type: LIKE_RECORD_TYPE.LIKE_ME_FAIL
  }, {
    where: {
      uid: data.id,
      like_id: data.uid,
    }
  })
  await updateRedLine(data.uid, 1)
  await addRedLineRecord({
    uid: data.uid,
    type: RED_LINE_RECORD_TYPE.REFUSE,
    comment: '拒绝反还'
  })

  getUserInfoByUidFromTable(data.uid).then(res => {
    subscribeMessage.applyResult({
      openid: res.dataValues.open_id,
      data: {
        phrase1: '牵线失败',
        thing2: '红线已返回,再看看其他有缘人吧'
      }
    })
  })
}

const userAgree = async function(data) {
  await updateUser({
    status: USER_STATUS.LOVING,
    liking_id: data.uid
  }, {where: {id: data.id}})

  await updateUser({
    status: USER_STATUS.LOVING,
    liking_id: data.id
  }, {where: {id: data.uid}})

  await updateLikeRecord({
    type: LIKE_RECORD_TYPE.I_LIKE_SUCCESS
  }, {where:
      {
        uid: data.uid,
        like_id: data.id
      }
  })
  await updateLikeRecord({
    type: LIKE_RECORD_TYPE.LIKE_ME_SUCCESS
  }, {where:
      {
        uid: data.id,
        like_id: data.uid
      }
  })
  const loves = [
    {
      uid: data.id,
      love_type: LOVE_TYPE.LOVE_ME,
      love_id: data.uid
    },
    {
      uid: data.uid,
      love_type: LOVE_TYPE.I_LOVE,
      love_id: data.id
    }
  ]
  await createLoveRecord(loves)
  getUserInfoByUidFromTable(data.uid).then(res => {
    subscribeMessage.applyResult({
      openid: res.dataValues.open_id,
      data: {
        phrase1: '牵线成功',
        thing2: '快来查看您的有缘人'
      }
    })
  })
}

const applyList = async function(id) {
  const res = await getUserLikedRecord(id)
  const list = res.map(item => {
    const record = item.dataValues
    let user = record.user.dataValues
    delete record.user
    record.updatedAt = timeFormat(record.updatedAt)
    return {...record, ...user}
  })
  return list
}
const getLoveData = async function(data) {
  const res = await getLoveDataService(data.uid)
  const loveData = res.dataValues
  const userData = loveData.user_data[0].dataValues
  delete loveData.user_data
  return {...loveData, ...userData}
}

const userBreakUp = async function (data) {
  await updateUser({
    status: USER_STATUS.SINGLE_USER,
    liking_id: null
  }, {where: {id: data.id}})
  await updateUser({
    status: USER_STATUS.SINGLE_USER,
    liking_id: null
  }, {where: {id: data.uid}})
  await updateLoveRecord({
    refuse_type: LOVE_REFUSE_TYPE.I_REFUSE
  }, {where: {
    uid: data.id,
      love_id: data.uid
    }
  })
  await updateLoveRecord({
    refuse_type: LOVE_REFUSE_TYPE.REFUSE_ME
  }, {where: {
      uid: data.uid,
      love_id: data.id
    }
  })

  getUserInfoByUidFromTable(data.uid).then(res => {
    subscribeMessage.breakUp({
      openid: res.dataValues.open_id,
      data: {
        phrase1: '匹配失败',
        thing2: '再看看其他有缘人吧'
      }
    })
  })
}

module.exports = {
  getList,
  updateAvatar,
  idcardIsExist,
  getSelfInfo,
  getLikeRecord,
  addLike,
  saveIdcardInfo,
  saveUserData,
  getUserDetail,
  userRefuse,
  userAgree,
  applyList,
  getLoveData,
  userBreakUp,
  updateNickname
}
