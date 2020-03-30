/**
 * @description 请求封装
 * @author zhaojianbo
 */

const request = require('request')

const post = function(url, form) {
  return new Promise((resolve, reject) => {
    request({
      url,
      method: 'POST',
      form,
    }, function (error, response, body) {
      if (error) {
        console.log(11111, error)
        reject(error)
      } else {
        resolve(body)
      }
    })
  })
}

module.exports = {
  post
}