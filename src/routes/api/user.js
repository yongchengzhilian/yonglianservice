/**
 * @description 用户信息相关路由
 * @author zhaojianbo
 */


const router = require('koa-router')()
const {
  getList,
  updateAvatar,
  idcardIsExist,
  saveUserData,
  saveIdcardInfo,
  getLikeRecord,
  addLike,
  getSelfInfo,
  getUserDetail,
  userRefuse,
  userAgree,
  applyList,
  getLoveData,
  userBreakUp,
  updateNickname
} = require('../../controller/user')
const {
  getUserInfoByUid,
  getCenterData
} = require('../../controller/login')
const {genValidator} = require('../../middlewares/validator')
const {nicknameValidate} = require('../../validator/user')
const {SuccessModel} = require('../../model/ResModel')
const parseToken = require('../../utils/parseToken')
const {USER_STATUS} = require('../../enum/User')

router.prefix('/user')

/**
 * 获取用户信息
 * @param ${uid}
 * */
// todo 这个接口调用频繁, 后需要从redis获取
router.get('/getCenterData', async (ctx, next) => {
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const userinfo = await getCenterData(id)
  ctx.body = new SuccessModel(userinfo)
})

/**
 * 获取用户列表
 * @param ${limit, page}
 * */
// todo 列表排序目前还有问题
router.post('/list', async (ctx, next) => {
  const {limit, page} = ctx.request.body
  const token = ctx.header.authorization
  const {gender} = await parseToken(token)
  const targetGender = gender === 1 ? 2 : 1
  const list = await getList(limit, page, targetGender)
  ctx.body = new SuccessModel({data: list})
})

/**
 * 修改用户昵称
 * @param ${nickname}
 * */
router.post('/updateNickname', genValidator(nicknameValidate), async (ctx, next) => {
  const {nickname} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await updateNickname(nickname, id)
  ctx.body = new SuccessModel({data: '修改成功'})
})

/**
 * 修改获取用户详情
 * @param ${nickname}
 * */
router.get('/detail/:uid', async (ctx, next) => {
  const {uid} = ctx.params
  const data = await getUserDetail(uid)
  ctx.body = new SuccessModel(data)
})

/**
 * 修改头像
 * @param ${avatar}
 * */
router.post('/updateAvatar', async (ctx, next) => {
  const {avatar} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await updateAvatar(avatar, id)
  ctx.body = new SuccessModel({data: '修改成功'})
})

/**
 * 保存身份信息
 * @param ${idcard_num,idcard_front,idcard_back,name}
 * */
router.post('/saveIdcardInfo', async (ctx, next) => {
  const {
    idcard_num,
    idcard_front,
    idcard_back,
    name
  } = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const {avatar, nickname} = await getUserInfoByUid(id)
  await saveIdcardInfo({
    id,
    avatar,
    nickname,
    idcard_num,
    idcard_front,
    idcard_back,
    name
  })
  ctx.body = new SuccessModel({data: '上传成功'})
})

/**
 * 判断身份证是否已上传
 * @param ${idcardNum}
 * */
router.post('/idcardIsExist', async (ctx, next) => {
  const {idcardNum} = ctx.request.body
  await idcardIsExist(idcardNum)
  ctx.body = new SuccessModel({data: '上传成功'})
})

/**
 * 保存用户信息
 * @param ${userData}
 * */
router.post('/saveUserData', async (ctx, next) => {
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const {status} = await getUserInfoByUid(id)
  if (status === USER_STATUS.DATA_AUTHING_1 || status === USER_STATUS.DATA_AUTHING_2) {
    throw new global.HttpException('资料审核中')
  }
  await saveUserData({
    id,
    status,
    ...ctx.request.body
  })
  ctx.body = new SuccessModel({data: '保存成功'})
})

/**
 * 获取用户喜欢记录
 * @param ${uid}
 * */
router.get('/getLikeRecord/:uid', async (ctx, next) => {
  const {uid} = ctx.params
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const data = await getLikeRecord({id, uid})
  ctx.body = new SuccessModel(data)
})

router.post('/like', async (ctx, next) => {
  const {uid, content, type} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await addLike({id, uid, content, type})
  ctx.body = new SuccessModel({data: '操作成功'})
})


/**
 * 我喜歡列表
 * @param ${uid}
 * */
router.post('/likeList', async (ctx, next) => {
  const {uid} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await userRefuse({id, uid})
  ctx.body = new SuccessModel({data: '操作成功'})
})

/**
 * 互相喜欢资料
 * @param ${uid}
 * */
router.post('/loveData', async (ctx, next) => {
  const {uid} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const loveData = await getLoveData({uid, id})
  ctx.body = new SuccessModel(loveData)
})


/**uid
 * 喜歡我列表
 * @param ${}
 * */
router.post('/likedList', async (ctx, next) => {
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await userRefuse({id, uid})
  ctx.body = new SuccessModel({data: '操作成功'})
})

/**
 * 申請列表
 * @param ${}
 * */
router.post('/applyList', async (ctx, next) => {
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const list = await applyList(id)
  ctx.body = new SuccessModel(list)
})

/**
 * 拒絕喜歡
 * @param ${uid}
 * */
router.post('/refuse', async (ctx, next) => {
  const {uid} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await userRefuse({id, uid})
  ctx.body = new SuccessModel({data: '操作成功'})
})

/**
 * 同意牽綫
 * @param ${uid}
 * */
router.post('/agree', async (ctx, next) => {
  const {uid} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await userAgree({id, uid})
  ctx.body = new SuccessModel({data: '操作成功'})
})

/**
 * 斷開牽綫
 * @param ${uid}
 * */
router.post('/breakUp', async (ctx, next) => {
  const {uid} = ctx.request.body
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  await userBreakUp({id, uid})
  ctx.body = new SuccessModel({data: '操作成功'})
})

/**
 * 获取自己信息
 * @param ${}
 * */
router.post('/selfinfo', async (ctx, next) => {
  const token = ctx.header.authorization
  const {id} = await parseToken(token)
  const selfInfo = await getSelfInfo(id)
  ctx.body = new SuccessModel(selfInfo)
})

module.exports = router
