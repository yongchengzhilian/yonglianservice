require('./src/utils/userLikeInterval')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const { initRouters } = require('./src/utils/initRouters')
const catchError = require('./src/middlewares/exception/index')
const HttpException = require('./src/middlewares/exception/http-exception')
const jwtKoa = require('koa-jwt')
const {SECRET} = require('./src/config/jwt')

// error handler
onerror(app)
global.HttpException  = HttpException

// middlewares
app.use(jwtKoa({
  secret:SECRET
}).unless({
  // 这些路由不需要校验jwt
  path: [/^\/login/, /^\/auth/]
}))
app.use(catchError)
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/src/public'))

app.use(views(__dirname + '/src/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
initRouters(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
