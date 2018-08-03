'use strict';

let db = require('./pghelper');
var constants = require('./../constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');

let findAll = (req, res, next) => {
    let params = [];
    let sql;
    sql = `SELECT * FROM GetInterviewResult()`;
    redisCache.wrap(constants.INTERVIEWRESULTGETALL_CACHEKEY, function (cacheCb) {
      db.query(sql, params)
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

exports.findAll = findAll;