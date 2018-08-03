'use strict';

let db = require('./pghelper');
let moment = require('moment');
var constants = require('./../constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');

let findAll = (req, res, next) => {
    let params = [];
    let sql;
    sql = `SELECT * FROM PersonGetAll()`;
    redisCache.wrap(constants.PERSONGETALL_CACHEKEY, function (cacheCb) {
      db.query(sql, params)
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let getPersonWiseInterviewCount = (req, res, next) => {
    let toEmail = req.body.toEmail;
    let interviewStatus = req.body.interviewStatus;
    if (toEmail == undefined || toEmail == '')
    {
        toEmail = '0';
    }

    if (interviewStatus == undefined || interviewStatus == '' || interviewStatus == null)
    {
        interviewStatus = '0';
    }

    db.query(`SELECT * FROM GetPersonWiseInterviewCount($1, $2)`, [toEmail, interviewStatus])
        .then(result => res.json(result))
        .catch(next);
};

let findByDateAndPerson = (req, res, next) => {
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let toEmail = req.body.toEmail;
    if (fromDate === undefined || fromDate === null)
    {
      fromDate = constants.DEFAULT_DATE;
    }
    else
    {
      fromDate = moment(fromDate).format('ddd MMM DD YYYY HH:mm:ss').toString();
    }
    if (toDate === undefined || toDate === null)
    {
      toDate = constants.DEFAULT_DATE;
    }
    else
    {
      toDate = moment(toDate).format('ddd MMM DD YYYY HH:mm:ss').toString();
    }
    if (toEmail === undefined || toEmail === '')
    {
      toEmail = '0';
    }

    db.query(`SELECT * FROM InterviewScheduleGetByPersonAndDate($1, $2, $3)`, [fromDate, toDate, toEmail])
        .then(result =>  res.json(result))
        .catch(next);
};

let findByPersonId = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM PersonGetById($1)`;
    var cacheKey = constants.PERSON_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [parseInt(id)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

exports.findAll = findAll;
exports.findByDateAndPerson = findByDateAndPerson;
exports.findByPersonId = findByPersonId;
exports.getPersonWiseInterviewCount = getPersonWiseInterviewCount;