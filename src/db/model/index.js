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
const AUthRecord = require('./AuthRecord')
const UserAuthData = require('./UserAuthData')
const OrderRecord = require('./OrderRecord')

InviteRecord.belongsTo(User, {
  foreignKey: 'invite_id',
})
User.hasMany(InviteRecord, {
  foreignKey: 'invite_id'
})

OrderRecord.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(OrderRecord, {
  foreignKey: 'uid'
})

AUthRecord.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(AUthRecord, {
  foreignKey: 'uid'
})

UserAuthData.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(UserAuthData, {
  foreignKey: 'uid'
})


UserIdcard.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(UserIdcard, {
  foreignKey: 'uid'
})

UserLikeRecord.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(UserLikeRecord, {
  foreignKey: 'uid'
})


LineRecord.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(LineRecord, {
  foreignKey: 'uid'
})



UserLoveRecord.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(UserLoveRecord, {
  foreignKey: 'uid'
})

UserData.belongsTo(User, {
  foreignKey: 'uid',
})
User.hasMany(UserData, {
  foreignKey: 'uid'
})

module.exports = {
  User,
  InviteRecord,
  UserIdcard,
  UserData,
  UserLikeRecord,
  AUthRecord,
  UserLoveRecord,
  LineRecord,
  UserAuthData,
  OrderRecord,
}
