'use strict';

let db = require('./pghelper');
var constants = require('./../constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');

let questionGetAll = (req, res, next) => {
  let params = [];
  redisCache.wrap(constants.QUESTIONGETALL_CACHEKEY, function (cacheCb) {
    db.query('SELECT * FROM QuestionGetAll()', params)
        .then(cacheCb)
        .catch(next);
  }, commonFunctions.responder(res));
};

let questionGetById = (req, res, next) => {
    let questionId = req.params.id;
    var cacheKey = constants.QUESTION_CACHEKEY + questionId;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(`SELECT * FROM QuestionGetById($1)`, [parseInt(questionId)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let questionCategoryGetAll = (req, res, next) => {
    let params = [];
    redisCache.wrap(constants.QUESTIONCATEGORYFORQUESTIONS_CACHEKEY, function (cacheCb) {
      db.query('SELECT * FROM QuestionCategoryGetAllForQuestions()', params)
          .then(cacheCb)
          .catch(next);
    }, commonFunctions.responder(res));
};

let questionInsert = (req, res, next) => {
    let question = req.body;
    db.query(`SELECT * FROM QuestionInsert($1, $2, $3, $4)`, [question.question, question.questionCategoryId, question.isActive, question.sortOrder])
      .then(result => { res.json(result[0]) })
      .catch(next);
};

let questionUpdate = (req, res, next) => {
    let question = req.body;
    db.query(`SELECT * FROM QuestionUpdate($1, $2, $3, $4, $5)`, [question.QuestionId, question.Question, question.QuestionCategoryId, question.IsActive, question.SortOrder])
      .then(result => { res.json(result[0]) })
      .catch(next);
};

let questionDelete = (req, res, next) => {
    let id = req.params.id;
    db.query('SELECT * FROM QuestionDelete($1)', [id]).then(() => res.send({ result: constants.OK })).catch(next);
};

let findByIdFromAnswer = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM GetResponseData($1)`;
    var cacheKey = constants.GETRESPONSEDATA_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [parseInt(id)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let findQuestionAnswersSQL = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM GetSQLData($1)`;
    var cacheKey = constants.GETSQLDATA_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [parseInt(id)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let findQuestionAnswers = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM getsqldatawithcategory($1)`;
    var cacheKey = constants.GETSQLDATAWITHCATEGORY_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [parseInt(id)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let findQuestionAnswersMultiple = (req, res, next) => {
    let id = req.body.join(',');
    let sql = `SELECT * FROM getmultiplecategories($1)`;
    var cacheKey = constants.GETMULTIPLECATEGORIES_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [id])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let findQuestionAnswersSQLForMultiple = (req, res, next) => {
    let id = req.body.join(',');
    let sql = `SELECT * FROM GetSQLDataMultiple($1)`;
    var cacheKey = constants.GETSQLDATAMULTIPLE_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [id])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let findQuestionAnswersADO = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM GetADOData($1)`;
    var cacheKey = constants.GETADODATA_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [parseInt(id)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let findQuestionAnswersADOForMultiple = (req, res, next) => {
    let id = req.body.join(',');
    let sql = `SELECT * FROM GetADODataMultiple($1)`;
    var cacheKey = constants.GETADODATAMULTIPLE_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [id])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let getEmailData = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM GetMailData($1)`;
    var cacheKey = constants.GETMAILDATA_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [parseInt(id)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let getMultipleEmailData = (req, res, next) => {
    let id = req.body.join(',');
    let sql = `SELECT * FROM GetMailDataMultiple($1)`;
    var cacheKey = constants.GETMAILDATAMULTIPLE_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [id])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let createItem = (req, res, next) => {
    let responseData = req.body.answerValues;
    let id = responseData.ansList[0].InterviewId;
    let sql = `SELECT * FROM GetResponseCountOfInterviewQuestions($1)`;
          db.query(sql, [parseInt(id)])
          .then(result => {
    if (result[0].Count > 0)
          {
      db.query(`SELECT * FROM ResponseDelete($1)`, [parseInt(id)]).catch(next);
          }

          let ansRecords = responseData.ansList;
    for (var i = 0; i < responseData.ansList.length; i++) {
      let sql2 = `SELECT * FROM ResponseInsert($1, $2, $3, $4, $5)`;
      db.query(sql2, [ansRecords[i].QuestionId, ansRecords[i].InterviewId, ansRecords[i].AnswerId, ansRecords[i].Remarks, ansRecords[i].IsUpdate]);
          }
        }).catch(next);

    let updateResult = `SELECT * FROM InterviewResultUpdate($1, $2, $3, $4)`;
          db.query(updateResult, [responseData.ResultRemark, responseData.ResultScore, responseData.InterviewResult, responseData.interviewId])
            .then(() => res.send({result: constants.OK}))
            .catch(next);
};

let getAllQuestionAndResponseData = (req, res, next) => {
    let interviewId = req.params.id;
    var cacheKey = constants.GETALLQUESTIONANDRESPONSEDATA_CACHEKEY + interviewId;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(`SELECT * FROM GetAllQuestionAndResponseData($1)`, [parseInt(interviewId)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

exports.questionGetAll = questionGetAll;
exports.questionGetById = questionGetById;
exports.questionCategoryGetAll = questionCategoryGetAll;
exports.questionInsert = questionInsert;
exports.questionUpdate = questionUpdate;
exports.questionDelete = questionDelete;
exports.createItem = createItem;
exports.findByIdFromAnswer = findByIdFromAnswer;
exports.findQuestionAnswersSQL = findQuestionAnswersSQL;
exports.findQuestionAnswersADO = findQuestionAnswersADO;
exports.findQuestionAnswersSQLForMultiple =findQuestionAnswersSQLForMultiple;
exports.findQuestionAnswersADOForMultiple = findQuestionAnswersADOForMultiple;
exports.getMultipleEmailData = getMultipleEmailData;
exports.getEmailData = getEmailData;
exports.getAllQuestionAndResponseData = getAllQuestionAndResponseData;
exports.findQuestionAnswers = findQuestionAnswers;
exports.findQuestionAnswersMultiple = findQuestionAnswersMultiple;