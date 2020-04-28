/**
 * @description 用户创建测试
 * @author zhaojianbo
 * */

const { User } = require('../../src/db/model')
test('用户创建成功', async () => {
  const res = await User.create({
    nickname: 'ni',
    gender: 1,
    avatar: 'www'
  })
  expect(res.nickname).toEqual('ni');
})

test('修改用户成功', async () => {
  const res = await User.update({
    nickname: 'haha',
    gender: 1,
    avatar: 'www'
  }, {
    where: { id: 1 }
  })
  expect(res[0]).toEqual(1);
})
