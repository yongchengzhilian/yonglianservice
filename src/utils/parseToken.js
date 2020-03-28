/**
 * @description token解析
 * @author zhaojianbo
 */

const util = require('util')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../config/jwt')
const verify = util.promisify(jwt.verify)

/**
 * 解析token主函数
 * @param {token}
 * */
const parseToken = async function(token) {
  const payload = await verify(token.split(' ')[1], SECRET)
  return payload
}

module.exports = parseToken
