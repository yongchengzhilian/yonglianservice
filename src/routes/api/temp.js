const router = require('koa-router')()

const {
  User,
  UserData,
  UserIdcard,

} = require('../../db/model/index')

router.prefix('/temp')

router.get('/getAllUser', async (ctx, next) => {
  const res = await User.findAll({
    include: [
      {model: UserData},
      {model: UserIdcard}
    ]
  })
  ctx.body = res
})

module.exports = router
