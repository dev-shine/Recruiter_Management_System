'use strict';

let db = require('./pghelper');
var constants = require('./../constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');

let findAll = (req, res, next) => {
    let params = [];
    let sql;
    sql = `SELECT * FROM QuestionCategoryGetAll()`;
    redisCache.wrap(constants.QUESTIONCATEGORYGETALL_CACHEKEY, function (cacheCb) {
      db.query(sql, params)
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let getActiveCategories = (req, res, next) => {
    let interviewId = req.params.id;
    var cacheKey = constants.GETACTIVECATEGORIES_CACHEKEY + interviewId;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(`SELECT * FROM QuestionCategoryGetAllActiveCategory($1)`, [parseInt(interviewId)])
          .then(cacheCb)
          .catch(next);
    }, commonFunctions.responder(res));
};

let getAllActiveCategories = (req, res, next) => {
    let params = [];
    redisCache.wrap(constants.GETALLACTIVECATEGORIES_CACHEKEY, function (cacheCb) {
      db.query(`SELECT * FROM QuestionCategoryActiveGetAll()`, params)
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let createItem = (req, res, next) => {
    let category = req.body;
    let sql = `SELECT * FROM QuestionCategoryInsert($1, $2, $3, $4)`;
    db.query(sql, [category.QuestionCategoryName, category.DisplayName, category.SortOrder, category.IsActive])
        .then(result => { res.json(result[0]) })
        .catch(next);
};

let findById = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM QuestionCategoryGetById($1)`;
    var cacheKey = constants.QUESTIONCATEGORY_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
      db.query(sql, [parseInt(id)])
        .then(cacheCb)
        .catch(next);
    }, commonFunctions.responder(res));
};

let updateItem = (req, res, next) => {
    let category = req.body;
    let sql = `SELECT * FROM QuestionCategoryUpdate($1, $2, $3, $4, $5)`;
    db.query(sql, [category.QuestionCategoryName, category.DisplayName, category.SortOrder, category.IsActive, category.QuestionCategoryId])
        .then(result => { res.json(result[0]) })
        .catch(next);
};

let deleteItem = (req, res, next) => {
    let id = req.params.id;
    db.query('SELECT * FROM QuestionCategoryDelete($1)', [id])
        .then(result => { res.json(result[0]) })
        .catch(next);
};

exports.findAll = findAll;
exports.getActiveCategories = getActiveCategories;
exports.getAllActiveCategories = getAllActiveCategories;
exports.findById = findById;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;