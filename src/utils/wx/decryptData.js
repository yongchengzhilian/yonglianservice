/**
 * @description 微信数据解密
 * @author zhaojianbo
 */

var WXBizDataCrypt = require('./WXBizDataCrypt')
const {APP_ID} = require('../../config/wx')

const decryptData = function (sessionKey, encryptedData, iv, city = 'NING_BO') {
  const pc = new WXBizDataCrypt(APP_ID[city], sessionKey)
  return pc.decryptData(encryptedData , iv)
}

module.exports = decryptData
