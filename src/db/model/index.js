/**
 * @description 数据模型入口文件
 * @author zhaojianbo
 */

const User = require('./User')
const InviteRecord = require('./InviteRecord')
const UserIdcard = require('./UserIdcard')
const UserData = require('./UserData')
const UserLikeRecord = require('./UserLikeRecord')
const UserLoveRecord = require('./UserLoveRecord')
const LineRecord = require('./LineRecord')

InviteRecord.belongsTo(User, {
  foreignKey: 'invide_id',
  // targetKey: 'id'
})

UserIdcard.belongsTo(User, {
  foreignKey: 'uid',
})

UserLikeRecord.belongsTo(User, {
  foreignKey: 'uid',
})

LineRecord.belongsTo(User, {
  foreignKey: 'uid',
})


UserLoveRecord.belongsTo(User, {
  foreignKey: 'uid',
})


UserData.belongsTo(User, {
  foreignKey: 'uid',
})

module.exports = {
  User,
  InviteRecord,
  UserIdcard,
  UserData,
  UserLikeRecord,
  UserLoveRecord,
  LineRecord,
}
