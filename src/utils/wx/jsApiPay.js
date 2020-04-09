//签名;
//mchkey是你在支付平台设置的一个API密钥
function MSign(param, mchkey){
  var string = raw(param);
  string = string + '&key=' + mchkey;	//key拼接在字符串最后面
  var crypto = require('crypto');
  return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
}

//args是一个JSON，方法将json中的字段按照ASCII码从小到大排序，生成一个字符串key1=value1&key2=value2。
function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key] = args[key];
  });
  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}


//创建随机数;
function getRandomNumberSection(begin, end) {
  return Math.floor(Math.random() * (begin - end) + end);
}
//创建随机字符串;
function getRandomStr(length) {
  let value = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = "";
  for (let i = 0; i < length; i++) {
    let v = value[getRandomNumberSection(0, value.length - 1)];
    while (i === 0 && v === '0') {
      v = value[getRandomNumberSection(0, value.length - 1)];
    }
    result += v;
  }
  return result;
}
//创建JSAPI订单;
//openid:微信用户的OPENID
//body: 订单信息;
//out_trade_no: 你自己生产的商户订单号;
//spbill_create_ip: 客户端IP地址
//total_fee: 支付金额(单位分)
async function CreateJSAPIpay(openid, body, out_trade_no, spbill_create_ip, total_fee, callback) {
  let that = this;
  let notify_url = '你需要设置支付完成后的回调URL';
  let WxAppid = '微信APPID';
  let mch_id = '商户ID';
  let trade_type = 'JSAPI';
  let sign_type = 'MD5';
  let noncestr = (new Date()).getTime() + '_';
  noncestr += getRandomStr(31 - noncestr.length);	//产生32位随机字符串;
  //1.签名参数;
  let sign = MSign({
    appid: WxAppid,
    mch_id: mch_id,
    nonce_str: noncestr,
    notify_url: notify_url,
    trade_type: trade_type,
    sign_type: sign_type,
    openid: openid,		//微信用户的OPENID
    body: body,			//订单信息;
    out_trade_no: out_trade_no,//你自己生产的商户订单号;
    spbill_create_ip: spbill_create_ip,//客户端IP地址
    total_fee: total_fee	//金额(单位分)
  }, this.mchkey);

  //2.生成XML格式;
  let formData = "<xml>";
  formData += "<appid>" + WxAppid + "</appid>";
  formData += "<body><![CDATA[" + body + "]]></body>";
  formData += "<mch_id>" + mch_id + "</mch_id>";
  formData += "<nonce_str>" + noncestr + "</nonce_str>";
  formData += "<notify_url>" + notify_url + "</notify_url>";
  formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
  formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
  formData += "<total_fee>" + total_fee + "</total_fee>";
  formData += "<trade_type>" + trade_type + "</trade_type>";
  formData += "<openid>" + openid + "</openid>";
  formData += "<sign_type>" + sign_type + "</sign_type>";
  formData += "<sign>" + sign + "</sign>"; 	//sign是上一步签名产生的;
  formData += "</xml>";

  //3.请求微信
  let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
  request({ url: url, method: 'POST', body: formData },
    function (err, response, body) {
      if (!err && response.statusCode == 200) {
        xmlreader.read(body.toString("utf-8"), function (errors, response) {
          if (null !== errors) {
            callback(false, errors, null);
          }
          else {
            if (response.xml.return_msg.text().toLocaleUpperCase() == 'OK') {
              //此时返回的数据并不能直接用在客户端，需要再次签名;
              let prepay_id = response.xml.prepay_id.text();
              let timestamp = parseInt(new Date().getTime() / 1000) + '';
              //4.签名
              let finalsign = MSign({
                appId: WxAppid,
                timeStamp: timestamp,
                nonceStr: noncestr,
                package: 'prepay_id=' + prepay_id,
                signType: sign_type
              }, mchkey);
              //这才是客户端最后使用的数据;
              let clientParam = {
                'appId': WxAppid,
                'nonceStr': noncestr,
                'timeStamp': timestamp,
                'package': 'prepay_id=' + prepay_id,
                'signType': that.sign_type,
                'sign': finalsign
              };
              callback(true, clientParam);
            }
            else {
              callback(false, null);
            }
          }
        });
      }
      else {
        callback(false, null);
      }
    });
}
