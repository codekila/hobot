/**
 * Created by jamesho on 27/02/2018.
 */

'use strict';

const HTTPError = require('@line/bot-sdk').HTTPError;
const moment = require('moment');

let mongoose = null;
let UserSchema = null;
let UsersModel = null;

module.exports = {
    init: function (db) {
        mongoose = db;
        UserSchema = new mongoose.Schema({
            userId: {
                type: String,
                index: true,
                required: true,
                unique: true
            },
            nickNames: [String],
            gender: {
                type: String
            },
            birthday: Date,
            location: {
                timeZone: {
                    type: String
                },
                place: {
                    type: String
                }
            },
            contacts: {
                phone: {
                    type: String
                },
                email: {
                    type: String
                }
            },
            hobbies: [String],
            runtime: {
                displayName: {
                    type: String,
                    default: ''
                },
                lastSeen: {
                    type: Date,
                    default: Date.now
                }
            }
        });
        UsersModel = mongoose.model('Users', UserSchema);
    },
    find: function (userId, cb) {
        UsersModel.findOne({userId : userId}, (err, user) => {
            if (cb) cb(user);
        });
    },
    /**
     * 
     */
    updateAllDisplayNames: function() {
        UsersModel.find({}, (err, users) => {
            if (err == null) {
                users.map(user => {
                    global.config.botClient.getProfile(user.userId)
                        .then((profile) => {
                            UsersModel.findOneAndUpdate({userId: user.userId}, {runtime: {displayName: profile.displayName }}, (err, u) => {
                                if (err == null)
                                    console.log('updating: ' + profile.displayName + ' OK');
                                else
                                    console.log('updating: ' + profile.displayName + 'Failed, err:' + err.message);
                            });
                        })
                        .catch((err) => {
                            if (err instanceof HTTPError) {
                                console.error('getProfile error:' + err.statusCode);
                            }
                        });
                });
            } else {
                console.log('updateAllDisplayNames error: ' + err.message);
            }
        });
    },
    updateTimestamp: function(userId, displayName, cb) {
        UsersModel.findOneAndUpdate({userId: user.userId}, {runtime: {displayName: displayName, lastSeen: Date.now() }}, (err, u) => {
            if (err == null)
                console.log('updateTimestamp: ' + displayName + ' OK');
            else
                console.log('updateTimestamp: ' + displayName + 'Failed, err:' + err.message);
            if (cb) cb(u);
        });
    },
    checkBirthdays: function(cb) {
        UsersModel.find({}, (err, users) => {
            let result = '';

            if (err) {
                console.log('checkBirthdays error: ' + err.message);
            } else {
                let nextBirthdayInDays = 0;
                let nextBirthday = null;

                for (let user of users) {
                    let daysToBDay;
                    let age;
                    let today = moment();
                    let tmpDay = moment(user.birthday, 'YYYY-MM-DD').year(today.year());

                    if (tmpDay.isSame(today))
                        daysToBDay = 0;
                    else if (tmpDay.isAfter(today))
                        daysToBDay = tmpDay.diff(today, 'days') + 1;
                    else {
                        daysToBDay = tmpDay.year(tmpDay.year() + 1).diff(today, 'days') + 1;
                    }

                    age = Math.floor((today.diff(moment(user.birthday, 'YYYY-MM-DD'), 'days')) / 365);
                    // forever young mom XDDD
                    if (user.userId == 'Ua686b3b6f5a0fefb00f7897cef7a58c8')
                        age = Math.floor(age / 2);

                    result += user.nickNames[0] + '生日' + user.birthday + '(' + age + '歲)，還有' + daysToBDay + '天生日！\n';

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
            }
            if (cb) cb(result);
        });
    },
    /**
     *
     * @param maxIdle
     * @param cb
     */
    getWhoIsIdleTooLong: function (maxIdle, cb) {
        let now = Date.now();

        UsersModel.find({}, (err, users) => {
            let usersTooLong = [];

            if (err) return null;
            for (let user of users) {
                let diff = now - user.runtime.lastSeen;
                if (diff > maxIdle) {
                    /*
                     if (user.runtime.displayName != null)
                     usersTooLong.push({userName: user.runtime.displayName.toLowerCase(), idle: diff});
                     */
                    if (user.nickNames[0] != null)
                        usersTooLong.push({userName: user.nickNames[0], idle: diff});
                }
            }
            if (cb) cb(usersTooLong);
        });
    },
    /**
     * create the default group of users
     */
    createUsers: function (users) {
        if (users == null)
            users = defaultUsers;
        for (let user of users) {
            const userObj = new UsersModel(user);
            userObj.save(err => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log('save ok:' + user.userId);
                }
            });
        }
    }
};

let defaultUsers = [{
        userId: "Uc173149caaa1f02eb263e113fe154fd0",
        nickNames: [
            "爸爸", "Daddy", "阿爹", "James"
        ],
        gender: "male",
            birthday: "1972-06-26",
            location: {
            timezone: "Asia/Taipei",
                place: "Taiwan 新竹縣竹北市興隆路一段"
        },
        contacts: {
            phone: "+886988227881",
                email: "jamesho86@gmail.com"
        },
        hobbies: [
            "釣魚"
        ]
    }, {
        userId: "Ua686b3b6f5a0fefb00f7897cef7a58c8",
        nickNames: [
            "媽媽", "Mom", "媽咪", "綸綸"
        ],
        gender: "female",
        birthday: "1972-04-03",
        location: {
            timezone: "Asia/Taipei",
            place: "Taiwan 新竹縣竹北市興隆路一段"
        },
        contacts: {
            phone: "+886988227966",
            email: "huang.yulun@gmail.com"
        },
        hobbies: [
            "udn小說", "玩Zuma"
        ]
    }, {
        userId: "U28ab0fb7603d306cfdf90db017d5489e",
        nickNames: [
            "姊姊", "阿姊", "Sabby", "Sab", "Sabrina", "阿澧"
        ],
        gender: "female",
        birthday: "1999-11-07",
        location: {
            timezone: "America/Los_Angeles",
            place: "UCSD"
        },
        contacts: {
            phone: "+18582262846",
            email: "sabrina.sj.ho@gmail.com"
        },
        hobbies: [
            "跆拳道"
        ]
    }, {
        userId: "U723a896291d80108cf013c1a628857ea",
        nickNames: [
            "妹妹", "小妹", "ＪＪ", "Jocelyn", "Ren", "荷荷"
        ],
        gender: "female",
        birthday: "2004-03-22",
        location: {
            timezone: "Asia/Taipei",
            place: "Taiwan 新竹縣竹北市興隆路一段"
        },
        contacts: {
            phone: "+886919322773",
            email: "jocelyn.her.ho@gmail.com"
        },
        hobbies: [
            "看動漫", "玩電動", "做蛋糕", "畫畫", "看Youtube"
        ]
    }
];
