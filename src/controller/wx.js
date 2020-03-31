/**
 * @description 微信相关api
 * @author zhaojianbo
 */

const decryptData = require('../utils/wx/decryptData')
const {wxLogin} = require('../services/wx')

const getPhone = async function(data) {
  const {ivdata, encrypdata, code} = data
  const wxRes = await wxLogin(code)
  const {session_key} = wxRes
  const userPhone = decryptData(session_key, encrypdata, ivdata)
  return userPhone
}

module.exports = {
  getPhone
}
