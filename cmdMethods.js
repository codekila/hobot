/**
 * Created by jamesho on 25/02/2018.
 */

"use strict";

const fs = require('fs');

//const clock = require('world-clock')();
const moment = require('moment');
const momentTZ = require('moment-timezone');

const modUsers = require('./Users.js');

module.exports = {
    execute: function(method, event, userName, db, queryText, cb) {
        return eval(method)(event, userName, db, queryText, cb); // easy and ugly
    }
};

function methodUserCheckTime(event, userName, db, queryText, cb) {
    /* world-clock based
    return 'Taiwan:\t' + clock.localTime('Asia/Taipei').toString().substr(0,5) + ', ' + clock.today('Asia/Taipei').toString() + '\n'
        +  'San Diego:\t' + clock.localTime('America/Los_Angeles').toString().substr(0,5) + ', ' + clock.today('America/Los_Angeles').toString();
    */

    let taiwanTime = momentTZ.tz('Asia/Taipei').format();
    let SDTime = momentTZ.tz('America/Los_Angeles').format();

    // 2018-02-26T16:53:33+08:00
    cb('Taiwan:\t' + taiwanTime.substr(11, 5) + ' ' + taiwanTime.substr(0, 10) + '\n'
        +  'San Diego:\t' + SDTime.substr(11, 5) + ' ' + SDTime.substr(0, 10));
}

function methodUserCheckBirthday(event, userName, db, queryText, cb) {
    let result = '';
    let nextBirthdayInDays = 0;
    let nextBirthday = null;

    for (let user of db.userDb.users) {
        let days =  modUsers.findDaysToBirthday(user);
        result += user.nickNames[0] + '生日' + user.birthday + '(' + modUsers.findAge(user) + '歲)，還有' + days + '天生日！\n';

        // find who's next birthday...
        // doesn't deal with same day birthday things
        if (nextBirthday == null || (nextBirthday != null && nextBirthdayInDays>days)) {
            nextBirthday = user.nickNames[0];
            nextBirthdayInDays = days;
        }
    }

    if (result.length>0) {
        result += '\n何寶發現' + nextBirthday + '的生日快到了喔，再過' + nextBirthdayInDays + '天！\n\n買個蛋糕慶祝一下！';
    }

    cb(result);
}

function methodReplyTheImage(event, userName, db, queryText, cb) {
    fs.readdir("./public/images/store", function(err, items) {
        console.log(items);

        cb("@@image https://hobot86.herokuapp.com/static/images/store/" + items[Math.floor(Math.random()*items.length)]);
    });
}
