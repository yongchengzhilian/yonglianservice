/**
 * @description 时间相关的工具函数
 * @author zhaojianbo
 */

const { format } = require('date-fns')

/**
 * 格式化时间，如 09.05 23:02
 * @param {string} str 时间字符串
 */
function timeFormat(str) {
  let now = new Date()
  let time = new Date(str).getTime()
  let difference = (now - time) / 1000
  if (difference < 60) {
    return '刚刚'
  }
  if (difference < (60 * 60)) {
    return parseInt(difference / 60) + '分钟前'
  }
  if (difference < (60 * 60 * 24)) {
    return parseInt(difference / 60 / 60) + '小时前'
  }
  return parseInt(difference / 60 / 60 / 24) + '天前'
}

module.exports = {
    timeFormat
}
