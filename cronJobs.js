"use strict";

const moment = require('moment');

module.exports = {
    checkWhoIsIdleTooLong: function (db, maxIdle, cb) {
        let now = Date.now();
        let usersTooLong = [];

        for (let i of db.userDb.users) {
            let diff = now - i.runtime.lastSeen;
            if (diff > maxIdle) {
                if (i.runtime.displayName != null)
                    usersTooLong.push({userName: i.runtime.displayName, idle: diff});
            }
        }
        cb(usersTooLong);
    }
};
