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
  sql = 'SELECT * FROM AnswerGetAll()';
  redisCache.wrap(constants.ANSWERGETALL_CACHEKEY, function (cacheCb) {
    db.query(sql, params)
      .then(cacheCb)
      .catch(next);
  }, commonFunctions.responder(res));
};

exports.findAll = findAll;