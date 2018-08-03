'use strict';

let pg = require('pg'),
    config = require('./config'),
    databaseURL = config.databaseURL;
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

exports.query = function (sql, values, singleItem, dontLog) {
    if (!dontLog) {
        console.log(sql, values);
    }

    return new Promise((resolve, reject) => {
        pg.connect(databaseURL, function (err, conn, done) {
            if (err)
                logger.error(err.message);
            try {
                conn.query(sql, values, function (err, result) {
                    done();
                    if (err) {
                        logger.error(err.message);
                    } else {
                        resolve(singleItem ? result.rows[0] : result.rows);
                    }
                });
            }
            catch (e) {
                done();
                reject(e);
            }
        });
    });
};