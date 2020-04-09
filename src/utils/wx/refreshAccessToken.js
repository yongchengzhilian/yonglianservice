/**
 * @description 获取AccessToken
 * @author zhaojianbo
 */

const axios = require('axios')
const {
  APP_ID,
  APP_SECRET
} = require('../../config/wx')

const refreshWxAccessToken = async function() {
  const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
    params: {
      grant_type: 'client_credential',
      appid: APP_ID.NING_BO,
      secret: APP_SECRET.NING_BO
    }
  })
  global.access_token = res.data.access_token
}

module.exports = {
  refreshWxAccessToken
}
