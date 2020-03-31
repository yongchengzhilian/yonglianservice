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
  getSelfInfo,
  updateNickname
} = require('../../controller/user')
const {
  getUserInfoByUid,
} = require('../../controller/login')
const {genValidator} = require('../../middlewares/validator')
const {nicknameValidate} = require('../../validator/user')
const {SuccessModel} = require('../../model/ResModel')
const parseToken = require('../../utils/parseToken')

router.prefix('/user')


/**
 * 获取用户列表
 * @param ${limit, page}
 * */
router.post('/list', async (ctx, next) => {
  const {limit, page} = ctx.request.body
  const list = await getList(limit, page)
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
  await saveUserData({
    id,
    status,
    ...ctx.request.body
  })
  ctx.body = new SuccessModel({data: '保存成功'})
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
