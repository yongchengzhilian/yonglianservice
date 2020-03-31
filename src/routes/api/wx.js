/**
 * @description 微信相关路由
 * @author zhaojianbo
 */

const router = require('koa-router')()
const {SuccessModel} = require('../../model/ResModel')
const {
  getPhone
} = require('../../controller/wx')

router.prefix('/wx')

// 登入
router.post('/getPhone', async (ctx, next) => {
  let { ivdata, encrypdata, code } = ctx.request.body

  const data = await getPhone({ ivdata, encrypdata, code })
  ctx.body = new SuccessModel(data)
})


module.exports = router
