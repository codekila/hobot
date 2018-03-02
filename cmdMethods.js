/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

const fs = require('fs');

const moment = require('moment');
const momentTZ = require('moment-timezone');

const modUsers = require('./Users.js');

module.exports = {
    execute: function (method, event, userName, queryText, cb) {
        return eval(method)(event, userName, queryText, cb); // easy and ugly
    }
};

function methodUserCheckTime(event, userName, queryText, cb) {
    let taiwanTime = momentTZ.tz('Asia/Taipei').format();
    let SDTime = momentTZ.tz('America/Los_Angeles').format();

    // 2018-02-26T16:53:33+08:00
    cb('Taiwan:\t' + taiwanTime.substr(11, 5) + ' ' + taiwanTime.substr(0, 10) + '\n'
        + 'San Diego:\t' + SDTime.substr(11, 5) + ' ' + SDTime.substr(0, 10));
}

function methodUserCheckBirthday(event, userName, queryText, cb) {
    modUsers.checkBirthdays(result => {
        cb(result);
    });
}

function methodReplyTheImage(event, userName, queryText, cb) {
    fs.readdir("./public/images/store", function (err, items) {
        console.log(items);

        cb("@@image https://hobot86.herokuapp.com/static/images/store/" + items[Math.floor(Math.random() * items.length)]);
    });
}
