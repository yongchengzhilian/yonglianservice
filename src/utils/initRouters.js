/**
 * @description 路由初始化
 * @author zhaojianbo
 */


const requireDirectory = require('require-directory')
const Router = require('koa-router')

const initRouters = function (app) {
  const whenLoadModule = (obj) => {
    if (obj instanceof Router) {
      app.use(obj.routes())
    }
  }
  const apiDirectory = `${process.cwd()}/src/routes`
  requireDirectory(module, apiDirectory, {visit: whenLoadModule})
}

module.exports = {
  initRouters
}
