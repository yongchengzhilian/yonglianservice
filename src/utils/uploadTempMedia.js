/**
 * @description 小程序媒体素材上传
 * @author zhaojianbo
 */
const axios = require('axios')
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
          // console.log(e)
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

  const { data: gzhImgStram } = await axios.get('https://www.qike.site/xiaochengxu/image/yongchengzhilian.jpg', {
    responseType: 'stream',
  });
  const gzh = await _promiseRequest({imgStram: gzhImgStram})
  console.log('公众号图片媒体资源上传------------>', JSON.stringify(gzh))
  global.gzh_media_id = gzh.media_id


  const { data: kfImgStram } = await axios.get('https://www.qike.site/xiaochengxu/image/kf.jpg', {
    responseType: 'stream',
  });
  const kf = await _promiseRequest({imgStram: kfImgStram})
  console.log('客服图片媒体资源上传------------>', JSON.stringify(kf))
  global.kf_media_id = kf.media_id
}
// uploadTempMedia()

module.exports = {
  uploadTempMedia
}
