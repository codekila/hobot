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

function _methodUserCheckDaysToBirthday(user) {
    let today = moment();
    let tmpDay = moment(user.birthday,'YYYY-MM-DD').year(today.year());
    let daysToBDay = 0;

    if (tmpDay.isSame(today))
        daysToBDay = 0;
    else if (tmpDay.isAfter(today))
        daysToBDay = 366 - tmpDay.diff(today, 'days');
    else {
        daysToBDay = 366 - tmpDay.year(tmpDay.year()+1).diff(today, 'days');
    }

    return daysToBDay;
}

function _methodUserCheckAge(user) {
    return Math.floor((moment().diff(moment(user.birthday,'YYYY-MM-DD'), 'days'))/365);
}

function methodUserCheckBirthday(event, userName, db, queryText) {
    let result = '';

    for (let user of db.userDb.users) {
        result += user.nickNames[0] + '生日' + user.birthday + '(' + _methodUserCheckAge(user) + '歲)，還有' + _methodUserCheckDaysToBirthday(user) + '天生日！\n';
    }

    // chop off the last '\n'
    if (result.length>1)
        result = result.slice(0,-1);

    return result;
}