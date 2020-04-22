/**
 * @description 微信相关配置
 * @author zhaojianbo
 */

const APP_ID = {
  NING_BO: 'wx938259363d663a46',
  FWH: 'wxb55e464ea69e3136',
  DYH: ''
}
const APP_SECRET = {
  NING_BO: '593dfdbc4d9f2e1b14f61fa3f3a69fe3',
  FWH: 'd035a14cdd00fbb8e0d2ba3e67082def'
}

const TEMPLATE_ID = {
  AUTH_RESULT: 'HN8Io6y0HHkyCZwkBF6XvLKeecxspv0W601s640eosA',
  APPLY: '6y7BSPpc-P6T1lubq45n9hQ09keOYyUK9_b9GRFtkN8',
  APPLY_RESULT: 'Xog069rTvytwulNvY8tdDooykmulHTom2atyRLgPlT8',
  BREAK_UP: 'YuSbkp4KjrVSOmYxMxdb8MQsdYvUhsEGo-M17cirytg'
}

const getLoginUrl = function(code, city = 'NING_BO') {
  return 'https://api.weixin.qq.com/sns/jscode2session?appid='
    + APP_ID[city]
    + '&secret='
    + APP_SECRET[city]
    + '&grant_type=authorization_code&js_code='
    + code
}

const ORDER_TYPE = {
  XCX: 1,
  DYH: 2
}

const MCH_ID = '1556840741'

module.exports = {
  APP_ID,
  APP_SECRET,
  ORDER_TYPE,
  MCH_ID,
  TEMPLATE_ID,
  getLoginUrl
}
