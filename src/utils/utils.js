/**
 * @description 工具类集合
 * @author zhaojianbo
 */


/**
 * 身份证号解析
 * @param {idcardNum}
 * */

const area = require('../lib/area')
const analyzeIDCard = function(idcardNum) {
  let userInfo = {}

  //获取用户身份证号码
  let userCard = idcardNum

  //如果身份证号码为undefind则返回空
  if(!userCard){
    return userInfo
  }

  //获取性别
  if(parseInt(userCard.substr(16,1)) % 2 == 1){
    userInfo.gender = 1
  }else{
    userInfo.gender = 2
  }
  //获取出生年月日
  //userCard.substring(6,10) + "-" + userCard.substring(10,12) + "-" + userCard.substring(12,14);
  let yearBirth = userCard.substring(6,10)
  let monthBirth = userCard.substring(10,12)
  let dayBirth = userCard.substring(12,14)
  userInfo.birthday = `${yearBirth}-${monthBirth}-${dayBirth}`
  //获取当前年月日并计算年龄
  let myDate = new Date()
  let monthNow = myDate.getMonth() + 1
  let dayNow = myDate.getDay()
  let age = myDate.getFullYear() - yearBirth
  if(monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)){
    age--
  }
  //得到年龄
  userInfo.age = age

  // 获取省份
  const provinceCode = `${userCard.substring(0,2)}0000`
  const province = area.province[provinceCode]
  const cityCode = `${userCard.substring(0,4)}00`
  const city = area.city[cityCode]

  userInfo.native_place = `${province}-${city}`

  //返回性别和年龄
  return userInfo
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};

module.exports = {
  analyzeIDCard,
  getClientIP,
}
