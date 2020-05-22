/**
 * @description 根据用户的下单请求调用微信统一下单api拿到范围的关键数据prepay_id
 * @author zhaojianbo
 * */

const {
  APP_ID
} = require('../../config/wx')
const request = require('request')
const crypto = require('crypto')
const xml2js = require('xml2js')
const mch_id = '1556840741'
const key = 'poiuytrewqasdfghjklmnbvcxz123456'
const notify_url = 'https://www.qike.site/yongcheng/pay/notify'

const pay = async ({openid,orderId,desc,totalPrice,spbill_create_ip, appid})=> {
  let obj = {
    appid,
    mch_id,
    nonce_str: get_nonce_str(32),
    body: desc,
    out_trade_no: orderId,
    total_fee: parseInt(totalPrice * 100),
    spbill_create_ip,
    notify_url,
    trade_type:'JSAPI',
    openid
  }
  let arr = Object.keys(obj).sort().map(item => {
    return `${item}=${obj[item]}`
  })

  let str = arr.join('&') + '&key=' + key

  obj.sign = getSign(str);
  let res;
  try{
    res = await wechatPay(obj);
    let {prepay_id} = res;
    if(prepay_id){
      res = getClientPayConfig(prepay_id, appid)
    }
  }catch(e){
    res = e;
  }
  return res;
}

const prepay_url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

/**
 * 统一下单
 * @param {Object} obj 调用统一下单的必须参数
 */
const wechatPay = (obj)=>{
  let xml = json2xml(obj);
  return new Promise((resolve,reject)=>{
    request({
      method: 'POST',
      url: prepay_url,
      body: xml
    },(err,res, body)=>{
      if (err) {
        reject(err);
      } else {
        //如果成功即可得到微信返回参数
        let obj = parseXml(body).xml
        resolve(obj)
      }
    })
  })
}


/**
 * 对指定字符串进行md5加密
 * @param {String} str
 */
const getSign = (str)=>{
  let hash = crypto.createHash('md5').update(str,'utf8');
  return hash.digest('hex').toUpperCase();
}

/**
 * 转化xml用了xml2js库
 https://github.com/Leonidas-from-XIV/node-xml2js
 * @param {Object} obj
 */
const json2xml = (obj)=>{
  let builder = new xml2js.Builder({
    headless:true,
    allowSurrogateChars: true,
    rootName:'xml',
    cdata:true
  });
  var xml = builder.buildObject(obj);
  return xml;
}

const parseXml = (xml)=>{
  let {parseString} = xml2js;
  let res;
  parseString(xml,  {
    trim: true,
    explicitArray: false
  }, function (err, result) {
    res = result;
  });
  return res;
}

/**
 * 生成指定长度的随机数
 * @param {*int} len
 */
const get_nonce_str = (len)=>{
  let str = '';
  while(str.length < len){
    str +=  Math.random().toString(36).slice(2);
  }
  return str.slice(-len);
}



/**
 * 生成前端调启支付界面的必要参数
 * @param {String} prepay_id
 */
const getClientPayConfig = (prepay_id, appid)=>{
  let obj = {
      appId: appid,
      timeStamp: String(Math.floor(Date.now()/1000)),
    nonceStr: get_nonce_str(32),
    package: 'prepay_id=' + prepay_id,
    signType: 'MD5'
}
  let arr = Object.keys(obj).sort().map(item => {
    return `${item}=${obj[item]}`;
  });
  let str = arr.join('&') + '&key=' + key;
  obj.paySign = getSign(str);
  return obj;
}

module.exports = {
  pay
}
