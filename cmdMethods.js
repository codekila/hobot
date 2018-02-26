/**
 * Created by jamesho on 25/02/2018.
 */

/**
 * All methods take the same set of parameters:
 *
 * @param event: event body from LINE Messaging API
 * @param userName: display name of the source user
 * @param db: database to look for answers
 * @param queryText: origianl message from the user
 * @returns {string}: result string, null if nothing to respond to
 */

"use strict";

const clock = require('world-clock')();
const moment = require('moment');

module.exports = {
    execute: function(method, event, userName, db, queryText) {
        return eval(method)(event, userName, db, queryText); // easy and ugly
    }
};

function methodUserCheckTime(event, userName, db, queryText) {
    return 'Taiwan:\t' + clock.localTime('Asia/Taipei').toString().substr(0,5) + ', ' + clock.today('Asia/Taipei').toString() + '\n'
        +  'San Diego:\t' + clock.localTime('America/Los_Angeles').toString().substr(0,5) + ', ' + clock.today('America/Los_Angeles').toString();
}

function _methodUserCheckAge(user) {
    let now = moment();
    let userBDay = moment(user.birthday,'YYYY-MM-DD');
    let diffDays = userBDay.diff(now, 'days');

    return Math.floor(diffDays/365);
}

function methodUserCheckBirthday(event, userName, db, queryText) {
    let result = '';

    for (let user of db.userDb.users) {
        result += user.nickNames[0] + '的生日是 ' + user.birthday + '(' + _methodUserCheckAge(user) + '歲)\n';
    }

    // chop off the last '\n'
    if (result.length>1)
        result = result.slice(0,-1);

    return result;
}