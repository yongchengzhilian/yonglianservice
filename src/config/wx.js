/**
 * @description 微信相关配置
 * @author zhaojianbo
 */

const APP_ID = {
  NING_BO: 'wx938259363d663a46'
}
const APP_SECRET = {
  NING_BO: 'a30097c2e2885135deaa4cfc13246bd2'
}

const getLoginUrl = function(code, city = 'NING_BO') {
  return 'https://api.weixin.qq.com/sns/jscode2session?appid='
    + APP_ID[city]
    + '&secret='
    + APP_SECRET[city]
    + '&grant_type=authorization_code&js_code='
    + code
}

module.exports = {
  APP_ID,
  APP_SECRET,
  getLoginUrl
}
