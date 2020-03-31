/**
 * @description 用户身份证
 * @author zhaojianbo
 */

const UserIdcard = require('../db/model/UserIdcard')

const saveIdcard = async function (data) {
  const res = await UserIdcard.create(data)
  return res
}

const getIdcard = async function(options) {
  const idcard = await UserIdcard.findOne({
    where: options
  })
  console.log(idcard)
  return idcard
}

module.exports = {
  saveIdcard,
  getIdcard,
}