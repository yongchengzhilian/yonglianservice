/**
 * @description 消息订阅
 * @author zhaojianbo
 */

const axios = require('axios')
const {
  TEMPLATE_ID
} = require('../../config/wx')

class SubscribeMessage {
  async send (data)   {
    const res = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${global.access_token}`, {
      access_token: global.access_token,
      touser: data.openid,
      template_id: data.template_id,
      page: 'pages/login/index/index',
      data: data.data
    })

    // 日志打印
    console.log('订阅消息微信请求结果', JSON.stringify({
      request: {
        ...data,
        access_token: global.access_token,
      },
      result: res.data
    }))
    console.log('消息订阅发送的access_token', global.access_token)
    if (res.data.errcode != 0) {
      console.error(res.data)
    }
  }

  async authMessage (data) {
    await this.send({
      data: data.data,
      openid: data.openid,
      template_id: TEMPLATE_ID.AUTH_RESULT
    })
  }

  async applyMessage (data) {
    await this.send({
      data: data.data,
      openid: data.openid,
      template_id: TEMPLATE_ID.APPLY
    })
  }

  async applyResult (data) {
    await this.send({
      data: data.data,
      openid: data.openid,
      template_id: TEMPLATE_ID.APPLY_RESULT
    })
  }

  async breakUp (data) {
    this.send({
      data: data.data,
      openid: data.openid,
      template_id: TEMPLATE_ID.BREAK_UP
    })
  }
}

const subscribeMessage = new SubscribeMessage()

module.exports = {
  SubscribeMessage,
  subscribeMessage,
}
