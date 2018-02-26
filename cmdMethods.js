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

//const clock = require('world-clock')();
const moment = require('moment');
const momentTZ = require('moment-timezone');


module.exports = {
    execute: function(method, event, userName, db, queryText) {
        return eval(method)(event, userName, db, queryText); // easy and ugly
    }
};

function methodUserCheckTime(event, userName, db, queryText) {
    /* world-clock based
    return 'Taiwan:\t' + clock.localTime('Asia/Taipei').toString().substr(0,5) + ', ' + clock.today('Asia/Taipei').toString() + '\n'
        +  'San Diego:\t' + clock.localTime('America/Los_Angeles').toString().substr(0,5) + ', ' + clock.today('America/Los_Angeles').toString();
    */

    return 'Taiwan:\t' + momentTZ.tz('Asia/Taipei').format() + '\n'
        +  'San Diego:\t' + momentTZ.tz('America/Los_Angeles').format();;
}

function _methodUserCheckDaysToBirthday(user) {
    let today = moment();
    let tmpDay = moment(user.birthday,'YYYY-MM-DD').year(today.year());
    let daysToBDay = 0;

    if (tmpDay.isSame(today))
        daysToBDay = 0;
    else if (tmpDay.isAfter(today))
        daysToBDay = tmpDay.diff(today, 'days')+1;
    else {
        daysToBDay = tmpDay.year(tmpDay.year()+1).diff(today, 'days')+1;
    }

    return daysToBDay;
}

function _methodUserCheckAge(user) {
    return Math.floor((moment().diff(moment(user.birthday,'YYYY-MM-DD'), 'days'))/365);
}

function methodUserCheckBirthday(event, userName, db, queryText) {
    let result = '';
    let nextBirthdayInDays = 0;
    let nextBirthday = null;

    for (let user of db.userDb.users) {
        let days =  _methodUserCheckDaysToBirthday(user);
        result += user.nickNames[0] + '生日' + user.birthday + '(' + _methodUserCheckAge(user) + '歲)，還有' + days + '天生日！\n';

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

    return result;
}