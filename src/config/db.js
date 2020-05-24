/**
 * @description 存储配置
 * @author zhaojianbo
 */

const { isProd } = require('../utils/env')

let REDIS_CONF = {
  port: 6379,
  host: '127.0.0.1'
}

let MYSQL_CONF = {
  host: '49.235.104.23',
  user: 'root',
  // password: 'root',
  password: 'aidou1818',
  port: '3306',
  database: 'yongcheng_liangyuan',
  logging: false
}

if (isProd) {
  REDIS_CONF = {
    // 线上的 redis 配置
    port: 6379,
    host: '127.0.0.1'
  }

  MYSQL_CONF = {
    // 线上的 mysql 配置
    host: '49.235.104.23',
    user: 'root',
    password: 'aidou1818',
    port: '3306',
    database: 'yongcheng_liangyuan'
  }

}

module.exports = {
    REDIS_CONF,
    MYSQL_CONF
}
