'use strict';

let db = require('./pghelper');
let mailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
var randomstring = require('randomstring');
var config = require('./config');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
require('string.format');
var constants = require('./../Constants/Constants.js');

function createToken(user) {
    return jwt.sign(user, config.secret);
}

var smtpTransport = mailer.createTransport(constants.SMTP, {
    service: constants.GMAIL,
    auth: {
        user: constants.EMAILID_TO_SENDMAIL,
        pass: constants.PASSWORD_TO_SENDMAIL
    }
});

let findAll = (req, res, next) => {
    let params = [];
    let sql;
    sql = 'SELECT * FROM UserGetAll()';
    db.query(sql, params)
      .then(result => res.json(result))
      .catch(next);
};

let findById = (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM UserGetById($1)`;
    db.query(sql, [parseInt(id)])
      .then(interviews =>  res.json(interviews[0]))
      .catch(next);
};

let createItem = (req, res, next) => {
    let user = req.body;
    let sql = `SELECT * FROM UserInsert($1, $2, $3, $4, $5, $6)`;
    db.query(sql, [user.FirstName, user.LastName, user.ContactNumber, user.Email, user.Password, user.IsActive])
        .then(result => {
              res.json(result[0])
         })
        .catch(next);
};

let loginDetails = (req, res, next) => {
    let user = req.body;
    var profile = _.pick(req.body, constants.PASSWORD);
    var id_token = createToken(profile);
    let sql = `SELECT * FROM UserGetLoginDetails($1, $2)`;
    db.query(sql, [user.Email, user.Password])
        .then(result => {
            result.push(id_token);
            res.json(result);
        })
        .catch(next);
};

let changePassword = (req, res, next) => {
    let user = req.body;
    let sql = `SELECT * FROM UserChangePassword($1, $2, $3)`;
    db.query(sql, [user.OldPassword, user.NewPassword, user.Email])
        .then(result => {
            res.json(result[0])
         })
        .catch(next);
};

let forgotPassword = (req, res, next) => {
    var randomStringPassword = randomstring.generate(10);
    let user = req.body;
    let sql = `SELECT * FROM UserForgotPassword($1,$2)`;
    db.query(sql, [user.Email, randomStringPassword] )
       .then(function(result) {
          if (result[0].status == constants.OK_STATUS)
          {
              var data = fs.readFileSync('ForgotPasswordEmailHTML.txt');
              var params = {
                  Password : randomStringPassword,
              }
              let mail = {
                  from: constants.FORGOTPASSWORD_FROM,
                  to: user.Email,
                  subject: constants.FORGOTPASSWORD_SUBJECT,
                  html: data.toString().format(params)
              }

              smtpTransport.sendMail(mail);
          }

          res.json(result[0]);
       })
      .catch(next);
};

let updateItem = (req, res, next) => {
    let user = req.body;
    let sql = `SELECT * FROM UserUpdate($1, $2, $3, $4, $5)`;
    db.query(sql, [user.FirstName, user.LastName, user.ContactNumber, user.IsActive, user.UserId])
        .then(result => {
          res.json(result[0])
        })
        .catch(next);
};

let deleteItem = (req, res, next) => {
    let id = req.params.id;
    db.query('SELECT * FROM UserDelete($1)', [id]).then(() => res.send({ result: constants.OK })).catch(next);
};

exports.findAll = findAll;
exports.findById = findById;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.loginDetails = loginDetails;
exports.changePassword = changePassword;
exports.forgotPassword = forgotPassword;