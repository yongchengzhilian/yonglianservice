/**
 * @description 微信相关请求
 * @author zhaojianbo
 */

const axios = require('axios')
const {getLoginUrl} = require('../config/wx')
const HttpException = require('../middlewares/exception/http-exception')

const wxLogin = async function (code) {
  const { data } = await axios.get(getLoginUrl(code))
  return data
}

module.exports = {
  wxLogin
}
