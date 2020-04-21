/**
 * @description 小程序媒体素材上传
 * @author zhaojianbo
 */
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const request = require('request')
function _promiseRequest({ imgStram = null, imgBuffer = null }) {
  const url = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${global.access_token}&type=image`;
  return new Promise((resolve, reject) => {
    const req = request.post(
      {
        url,
        headers: {
          accept: '*/*',
        },
      },
      (err, res) => {
        if (err) {
          reject(err);
        }

        try {
          const resData = JSON.parse(res.body); // 里面带有返回的media_id

          resolve(resData);
        } catch (e) {
          console.log(e)
        }
      },
    );

    const form = req.form();

    if (imgBuffer) {
      form.append('media', imgBuffer, {
        contentType: 'image/jpeg', // 微信识别需要
        filename: 'code.jpg', // 微信识别需要
      });
    } else if (imgStram) {
      form.append('media', imgStram);
    }

    form.append('hack', ''); // 微信服务器的bug，需要hack一下才能识别到对象
  });
}

const uploadTempMedia = async function () {

  const { data: imgStram } = await axios.get('https://www.qike.site/wl.png', {
    responseType: 'stream',
  });
  const data = await _promiseRequest({imgStram})
  global.media_id = data.media_id
}
// uploadTempMedia()

module.exports = {
  uploadTempMedia
}
