/**
 * Created by jamesho on 27/02/2018.
 */

"use strict";

const moment = require('moment');

let botClient = null;
let dbUsers = null;

module.exports = {
    init: function (bot, db) {
        botClient = bot;
        dbUsers = db;
    },
    /**
     *
     * @param userId
     * @returns {*}
     */
    find: function (userId) {
        return dbUsers[userId];
    },
    /**
     *
     * @param userId
     * @returns {number}: days to next birthday, -1 if user not found
     */
    getDaysToBirthday: function (userId) {
        let daysToBDay = -1;
        let user = this.find(userId);

        if (user) {
            let today = moment();
            let tmpDay = moment(user.birthday, 'YYYY-MM-DD').year(today.year());

            if (tmpDay.isSame(today))
                daysToBDay = 0;
            else if (tmpDay.isAfter(today))
                daysToBDay = tmpDay.diff(today, 'days') + 1;
            else {
                daysToBDay = tmpDay.year(tmpDay.year() + 1).diff(today, 'days') + 1;
            }
        }
        return daysToBDay;
    },
    /**
     *
     * @param userId
     * @returns {number}: ages, -1 if user not found
     */
    getAge: function (userId) {
        let age = -1;
        let user = this.find(userId);

        if (user) {
            age = Math.floor((moment().diff(moment(user.birthday, 'YYYY-MM-DD'), 'days')) / 365);
            // forever young mom XDDD
            if (user.userId == 'Ua686b3b6f5a0fefb00f7897cef7a58c8')
                return Math.floor(age / 2);
        }
        return age;
    },
    /**
     * 
     */
    updateAllDisplayNames() {
        for (let userId in dbUsers) {
            botClient.getProfile(userId)
                .then((profile) => {
                    dbUsers[userId].runtime.displayName = profile.displayName;
                })
                .catch((err) => {
                    if (err instanceof HTTPError) {
                        console.error('getProfile error:' + err.statusCode);
                    }
                });
        }
    },
    /**
     *
     * @param maxIdle
     * @param cb
     */
    getWhoIsIdleTooLong: function (maxIdle, cb) {
        let now = Date.now();
        let usersTooLong = [];

        for (let user of dbUsers) {
            let diff = now - user.runtime.lastSeen;
            if (diff > maxIdle) {
                if (user.runtime.displayName != null)
                    usersTooLong.push({userName: user.runtime.displayName.toLowerCase(), idle: diff});
            }
        }
        cb(usersTooLong);
    }
};


