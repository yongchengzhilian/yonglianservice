/**
 * @description 微信相关请求
 * @author zhaojianbo
 */

const axios = require('axios')
const {getLoginUrl} = require('../config/wx')

const wxLogin = async function (code) {
  const { data } = await axios.get(getLoginUrl(code))
  if (data.errcode) {
    throw new Error(JSON.stringify(data))
  }
  return data
}

module.exports = {
  wxLogin
}
