// Query for CRUD
'use strict';

let db = require('./pghelper');
var fs = require('fs');
var path = require('path');
var fileExists = require('file-exists');
let moment = require('moment');
var constants = require('./../constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');

let findAll = (req, res, next) => {
  let params = [];
  let sql;
  sql = 'SELECT * FROM InterviewScheduleGetAll()';
  redisCache.wrap(constants.INTERVIEWSCHEDULEGETALL_CACHEKEY, function (cacheCb) {
    db.query(sql, params)
      .then(cacheCb)
      .catch(next);
  }, commonFunctions.responder(res));
};

let monthlyInterviews = (req, res, next) => {
  let params = [];
  let parameter = req.body;
  let sql;
  sql = 'SELECT * FROM InterviewScheduleGetDateWiseForMonthlyReport($1,$2)';
  db.query(sql, [parameter.Month, parameter.Year])
    .then(result => res.json(result))
    .catch(next);
};

let findById = (req, res, next) => {
  let id = req.params.id;
  let sql = `SELECT * FROM InterviewScheduleGetById($1)`;
  var cacheKey = constants.INTERVIEWSCHEDULE_CACHEKEY + id;
  redisCache.wrap(cacheKey, function (cacheCb) {
    db.query(sql, [parseInt(id)])
      .then(cacheCb)
      .catch(next);
  }, commonFunctions.responder(res));
};

let createItem = (req, res, next) => {
    let interview = req.body;
    let sql = `SELECT * FROM InterviewScheduleInsert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`;
    db.query(sql, [interview.FirstName, interview.LastName, interview.PhoneNumber, interview.AlternatePhoneNumber, interview.EmailId, moment(interview.ScheduleDate).format('YYYY-MM-DD').toString(),
      interview.ScheduleTime, interview.PositionName, interview.Experience, interview.ModeofInterview, interview.InterviewStatusId, interview.ToEmail, interview.CCEmail,
      interview.IsActive, interview.Resume, interview.IsInvoiced, interview.IsArchived])
     .then(result => {
        res.json(result[0])
     })
    .catch(next);
};

let updateItem = (req, res, next) => {
  let interview = req.body;
  let sql = `SELECT * FROM InterviewScheduleUpdate($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 , $17, $18)`;
  db.query(sql, [interview.FirstName, interview.LastName, interview.PhoneNumber, interview.AlternatePhoneNumber, interview.EmailId, moment(interview.ScheduleDate).format('YYYY-MM-DD').toString(),
    interview.ScheduleTime, interview.PositionName, interview.Experience, interview.ModeofInterview, interview.InterviewStatusId, interview.ToEmail, interview.CCEmail,
    interview.IsActive, interview.Resume, interview.InterviewId, interview.IsInvoiced, interview.IsArchived])
  .then(result => {
    res.json(result[0])
  })
  .catch(next);
};

let updateReportShared = (req, res, next) => {
  let interview = req.params.id;
  db.query(`SELECT * FROM InterviewSharedReportUpdate($1)`, [interview]).then(result => { res.json(result[0]) }).catch(next);
};

let deleteItem = (req, res, next) => {
  let interviewId = req.params.id;
  db.query('SELECT * FROM InterviewScheduleDelete($1)', [interviewId]).then(() => res.send({ result: constants.OK })).catch(next);
};

let downloadResume = (req, res, next) => {
  let id = req.params.id;
  var fileName;
  let sql = `SELECT * FROM InterviewScheduleGetResumeDetailById($1)`;
  db.query(sql, [parseInt(id)])
    .then(function(value) {
      fileName = value[0].Resume;
    var dirPath =  path.dirname(__dirname);
    var file = dirPath + '/Uploads/' + fileName;
    res.sendFile(file)
    })
    .catch(next);
};

let resumeRemove = (req, res, next) => {
  var file = __dirname + '/../uploads/';
  var ResumeName = req.body.ResumeName;
  var InterviewId = req.body.InterviewId;
  if (fs.existsSync(file + ResumeName)) {
    fs.unlink(file + ResumeName);
  }

  let sql = `SELECT * FROM InterviewResumeDelete($1)`;
  db.query(sql, [InterviewId])
    .then(() => res.send({result: constants.OK}))
    .catch(next);
};

let resultById = (req, res, next) => {
  let id = req.params.id;
  let sql = `SELECT * FROM ResultGetById($1)`;
  var cacheKey = constants.INTERVIEWRESULT_CACHEKEY + id;
  redisCache.wrap(cacheKey, function (cacheCb) {
    db.query(sql, [parseInt(id)])
      .then(cacheCb)
      .catch(next);
  }, commonFunctions.responder(res));
};

exports.findAll = findAll;
exports.findById = findById;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.updateReportShared = updateReportShared;
exports.deleteItem = deleteItem;
exports.downloadResume = downloadResume;
exports.resumeRemove = resumeRemove;
exports.resultById = resultById;
exports.monthlyInterviews = monthlyInterviews;