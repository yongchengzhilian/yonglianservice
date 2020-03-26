class HttpException extends Error {
  constructor (errmsg = '服务器异常', errcode = -1) {
    super()
    this.errcode = errcode
    this.errmsg = errmsg
  }
}

module.exports = HttpException
