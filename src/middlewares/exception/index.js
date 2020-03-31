/**
 * @description 全局未知错误监听
 * @author zhaojianbo
 */
const { ErrorModel } = require('../../model/ResModel')
const HttpException = require('./http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    console.log('error', e)
    if (e instanceof HttpException) {
      ctx.body = new ErrorModel({
        errno: e.errcode,
        message: e.errmsg
      })
    } else {
      ctx.body = new ErrorModel({
        errno: -1,
        message: JSON.stringify(e)
      })
    }
  }
}

module.exports = catchError
