/**
 * @description 用户举报记录
 * @author zhaojianbo
 */


// TODO
const seq = require('../seq')
const { INTEGER, STRING, TEXT } = require('../types')

const ReportRecord = seq.define('report_record', {
  reporter_uid: {
    type: INTEGER,
    comment: '举报者用户id',
  },
  type: {
    type: INTEGER,
    comment: '举报类型',
  },
  describe: {
    type: STRING,
    comment: '描述',
  },
  reported_uid: {
    type: INTEGER,
    comment: '被举报者uid',
  },
  photos: {
    type: TEXT,
    comment: '证据照片',
  },
})


module.exports = ReportRecord
