/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

const fs = require('fs');
const moment = require('moment');
const momentTZ = require('moment-timezone');

const modConfigs = require('./Configs.js');
const modUsers = require('./Users.js');
const jobs = require('./cronJobs.js');
const modWeather = require('./weather.js');

let mongoose = null;
let QuerySchema = null;
let ResponseSchema = null;
let CommandSchema = null;
let CommandsModel = null;

module.exports = {
    init: init,
    createCommands: createCommands,
    addCommand: addCommand,
    deleteCommand: deleteCommand,
    processDb: processDb
};

function init(db) {
    mongoose = db;

    QuerySchema = new mongoose.Schema({
        priority: {
            type: String,
            default: 'default'
        },
        model: {
            type: String,
            default: 'fuzzy'
        },
        texts: {
            type: [String],
            required: true
        }
    });

    ResponseSchema = new mongoose.Schema({
        priority: {
            type: String,
            default: 'default'
        },
        model: {
            type: String,
            default: 'canned'
        },
        method: {
            type: String,
            default: null
        },
        texts: [String]
    });

    CommandSchema = new mongoose.Schema({
        cmd: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        queries: [QuerySchema],
        responses: [ResponseSchema]
    });

    CommandsModel = mongoose.model('Commands', CommandSchema);
}

/**
 * create the default group of commands and responses
 */
function createCommands(cmds) {
    if (cmds == null)
        cmds = defaultCommands;
    for (let cmd of cmds) {
        const cmdObj = new CommandsModel(cmd);
        cmdObj.save(err => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log('cmd save ok:' + cmd.cmd);
            }
        });
    }
}

/**
 * add a command/response to db
 *
 * add cmd query response
 *
 */
function addCommand(queryText, cb) {
    let cmdStr = queryText.split(' ');

    console.log('cmdstr = ' + cmdStr);
    if (cmdStr.length > 2) {
        CommandsModel.findOne({cmd: cmdStr[1]}, (err, cmd) => {
            if (err) {
                cb('addCommand db error:' + err.message);
            }
            else {
                let needUpdateQ = true;
                let needUpdateR = true;

                if (cmd) {
                    let query, res;
                    console.log('cmd found, updating the data...' + JSON.stringify(cmd));
                    // check if we need to update queries
                    for (query of cmd.queries) {
                        // match based on models
                        for (let text of query.texts) {
                            if (query.model != "command" && text == cmdStr[2]) {
                                needUpdateQ = false;
                                break;
                            }
                        }
                        if (needUpdateQ)
                            query.texts.push(cmdStr[2]);
                    }
                    // check if we need to update canned responses
                    if (cmdStr.length > 3) {
                        for (res of cmd.responses) {
                            // match based on models
                            for (let text of res.texts) {
                                if (res.model == "canned" && cmdStr[3] == text) {
                                    needUpdateR = false;
                                    break;
                                }
                            }
                            if (needUpdateR)
                                res.texts.push(cmdStr[3]);
                        }
                    }
                    console.log('cmd found, updating the data..NEW: ' + JSON.stringify(cmd));
                    // update to db
                    if (needUpdateQ || needUpdateR) {
                        const cmdObj = new CommandsModel(cmd);
                        cmdObj.save(err => {
                            if (err) {
                                cb(err.message);
                            }
                            else {
                                cb('cmd updated: ' + cmd.cmd);
                            }
                        });
                    }
                    else {
                        cb('no update is needed');
                    }
                } else if (cmdStr.length != 4) {
                    cb('command format error');
                } else {
                    console.log('not found, inserting the data...');
                    // generate the record
                    cmd = {
                        cmd: cmdStr[1],
                        queries: [
                            {
                                priority: "default",
                                model: "fuzzy",
                                texts: [
                                    cmdStr[2]
                                ]
                            }
                        ],
                        responses: [
                            {
                                priority: "default",
                                model: "canned",
                                texts: [
                                    cmdStr[3]
                                ]
                            }
                        ]
                    };
                    // insert a record into db
                    const cmdObj = new CommandsModel(cmd);
                    cmdObj.save(err => {
                        if (err) {
                            cb(err.message);
                        }
                        else {
                            cb('cmd inserted: ' + cmd.cmd);
                        }
                    });
                }
            }
        });
    }
    else
        cb('command format error');
}

/**
 * delete a command/response from db
 *
 * del cmd-name
 *
 */
function deleteCommand(queryText, cb) {
    let cmdStr = queryText.split(' ');

    console.log('cmdstr = ' + cmdStr);
    if (cmdStr.length == 2) {
        CommandsModel.findOne({cmd: cmdStr[1]}, (err, cmd) => {
            if (err) {
                cb('deleteCommand db error:' + err.message);
            }
            else {
                // delete it
                if (cmd) {
                    cmd.remove();
                    cb('ok');
                } else {
                    cb(cmdStr[1] + ' not found');
                }
            }
        });
    }
    else
        cb('command format error');
}

/**
 *
 * @param event: incoming event
 * @param userName: display name of the user
 * @param queryText: input text
 * @param cb: callback function of the result
 */
function matchCommand(event, userName, queryText, cb) {
    let o = {};

    console.log('\'' + queryText + '\' --- ' + queryText.substr(0, queryText.indexOf(' ')) + '\'');
    o.map = function () {
        let matched = null;

        for (let query of this.queries) {
            // match based on models
            for (let text of query.texts) {
                if (query.model == "command" && (text == queryText || queryText.substr(0, queryText.indexOf(' ')) == text)) {
                    matched = query;
                } else if (query.model == "precise" && text == queryText) {
                    matched = query;
                } else if (query.model == "fuzzy" && queryText.includes(text)) {
                    matched = query;
                }
                if (matched)
                    break;
            }
        }
        if (matched != null)
            emit(this._id, matched);
    };

    o.reduce = function(key, matchesQueries) {
        let deft = null;
        for (let query of matchesQueries) {
            if (query.priority = 'first') {
                return query;
            }
            if (deft == null)
                deft = query;
        }
        return deft;
    };

    o.scope = {queryText: queryText};

    // try to match a query
    CommandsModel.mapReduce( o, (err, cmd) => {
        if (err)
            console.log('CommandsModel.mapReduce err: ' + err.message);
        else {
            if (cmd.results.length>0) {
                //console.log('matched: ' + cmd.results[0]._id);
                console.log('matched: ' + JSON.stringify(cmd.results[0]));
                cb(cmd.results[0]._id);
            }
        }
    });
}

function processResponse(event, userName, queryText, matchedId, cb) {
    let dbResult = null;
    let responseToDo = null;

    // identify the right response to deal with
    CommandsModel.findOne({_id: matchedId}, (err, cmd) => {
        if (err) {
            console.log('processResponse findOne:' + err.message);
            return;
        }

        for (let response of cmd.responses) {
            if (response.priority == "first" && response.method != null) {
                responseToDo = response;
                break;
            } else if (response.priority == "default") {
                responseToDo = response;
            }
        }

        console.log('response to do:' + JSON.stringify(responseToDo));

        if (responseToDo) {
            switch (responseToDo.model) {
                case "canned":
                    if (responseToDo.texts.length > 0)
                        dbResult = responseToDo.texts[Math.floor(Math.random() * responseToDo.texts.length)];
                    // randomly add the sender's name
                    if (dbResult != null && dbResult != '' && dbResult.substr(0, 2) != '@@') {
                        if (Math.random() > 0.5) {
                            modUsers.find(event.source.userId, user => {
                                if (user)
                                    dbResult = user.nickNames[Math.floor(Math.random() * user.nickNames.length)] + '，' + dbResult;
                                cb(dbResult);
                            });
                        } else
                            cb(dbResult);
                    } else
                        cb(dbResult);
                    break;
                case "smart":
                    eval(responseToDo.method)(event, userName, queryText, (res) => {
                        cb(res);
                    });
                    break;
                default:
                    console.log('the response item doesn\'t support \'' + responseToDo.model + '\' model');
                    cb(dbResult);
            }
        }
    });
}

function processDb(event, userName, queryText, cb) {
    // match a command based on the query
    matchCommand(event, userName, queryText, matchedId => {
        if (matchedId) {
            // react to the matched query
            processResponse(event, userName, queryText, matchedId, cb);
        }
    });
}

function methodUserCheckTime(event, userName, queryText, cb) {
    let taiwanTime = momentTZ.tz('Asia/Taipei').format();
    let SDTime = momentTZ.tz('America/Los_Angeles').format();

    // 2018-02-26T16:53:33+08:00
    cb('Taiwan:\t' + taiwanTime.substr(11, 5) + ' ' + taiwanTime.substr(0, 10) + '\n'
        + 'San Diego:\t' + SDTime.substr(11, 5) + ' ' + SDTime.substr(0, 10));

    jobs.checkWhenSabReturns();
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

function methodAddCommand(event, userName, queryText, cb) {
    addCommand(queryText , result => {
        cb(result);
    });
}

function methodDeleteCommand(event, userName, queryText, cb) {
    deleteCommand(queryText , result => {
        cb(result);
    });
}

function methodShowIdle(event, userName, queryText, cb) {
    modUsers.showIdle(result => {
        cb(result);
    });
}

function methodSetConfig(event, userName, queryText, cb) {
    let cmdStr = queryText.split(' ');
    if (cmdStr.length == 3) {
        modConfigs.set(cmdStr[1], cmdStr[2], err => {
            if (err) cb(err.message);
            cb('OK');
        });
    }
}

function methodWeather(event, userName, queryText, cb) {
    let cmdStr = queryText.split(' ');
    if (cmdStr.length == 2) {
        modWeather.checkWeatherTaiwan(cmdStr[1], result => {
            cb(result);
        });
    }
}

let defaultCommands = [
    {
        cmd: "idiot",
        queries: [
            {
                priority: "first",
                model: "fuzzy",
                texts: [
                    "idiot", "stupid", "moron"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "笨", "蠢", "白痴", "白吃", "白癡", "智障", "傻", "呆", "聰明"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "對不起，我智商比較低",
                    "說你笨你不相信",
                    "別罵我",
                    "豬笑鱉沒尾",
                    "五十步笑百步",
                    "可能比你聰明一點點",
                    "別笑我啦",
                    "你確定我比你笨？"
                ]
            }
        ]
    },
    {
        cmd: "morning",
        queries: [
            {
                priority: "first",
                model: "fuzzy",
                texts: [
                    "morning"
                ]
            },
            {
                priority: "default",
                model: "precise",
                texts: [
                    "早安", "早啊"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "何寶在此跟您問個早",
                    "早安，要記得吃早餐喔！",
                    "早安，今天也要開心喔！",
                    "早啊，運動有益身體健康",
                    "出門記得伸手要錢",
                    "還有人沒起床的嗎？"
                ]
            }
        ]
    },
    {
        cmd: "hello",
        queries: [
            {
                priority: "first",
                model: "fuzzy",
                texts: [
                    "good afternoon", "nap", "hello", "hihi", "hii"
                ]
            },
            {
                priority: "default",
                model: "precise",
                texts: [
                    "午安", "你好", "妳好", "您好", "hi"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "我想睡個午覺",
                    "喝杯咖啡？",
                    "起來走一走",
                    "吃飯了沒？"
                ]
            }
        ]
    },
    {
        cmd: "night",
        queries: [
            {
                priority: "first",
                model: "fuzzy",
                texts: [
                    "good night", "sleep tight"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "晚安", "睡了"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "大家一起來睡覺喔",
                    "何寶跟大家說晚安",
                    "我早睡了",
                    "可是我睡不著誒，跟我聊天？"
                ]
            }
        ]
    },
    {
        cmd: "meow",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "meowco", "meow", "妙可", "貓可", "喵咪", "貓咪", "喵可"
                ]
            },
            {
                priority: "default",
                model: "precise",
                texts: [
                    "貓", "喵"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "誒～我只知道這隻貓很肥！",
                    "就是一隻大肥貓",
                    "喵在睡覺吧",
                    "喵嗚～～～",
                    "喵的啦",
                    "喵身上油很多",
                    "喵不想理你"
                ]
            }
        ]
    },
    {
        cmd: "help",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "help", "hobot", "蛤", "什麼", "等等"
                ]
            },
            {
                priority: "default",
                model: "precise",
                texts: [
                    "幫忙", "何寶", "?", "what", "how", "？", "等一下"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "我也很想啊，但是我目前的智商還差得很遠勒～",
                    "你覺得這是我現在可以做到的嗎？",
                    "可能要很久",
                    "直接找老闆",
                    "等我變聰明一點",
                    "有問題嗎？"
                ]
            }
        ]
    },
    {
        cmd: "hobot",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "hobot", "何寶"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "您找我？",
                    "有事嗎？",
                    "什麼吩咐？"
                ]
            }
        ]
    },
    {
        cmd: "umm",
        queries: [
            {
                priority: "default",
                model: "precise",
                texts: [
                    "um", "嗯", "m", "en", "恩", "ㄣ", "啊", "呀", "喔"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "umm", "恩恩", "嗯嗯", "ㄣㄣ", "啊啊", "啊呀", "喔喔", "啊喔", "嗯呀"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "嗯嗯嗯～",
                    "啊～",
                    "矮油～",
                    "嗯呀～",
                    "ummmmmm..."
                ]
            }
        ]
    },
    {
        cmd: "fat",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "fat"
                ]
            },
            {
                priority: "default",
                model: "precise",
                texts: [
                    "肥", "胖"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "怎摸辦，我也覺得自己有點肥耶～",
                    "該減肥了",
                    "我不覺得呀",
                    "肥已經無法形容我了",
                    "長得壯也是一種罪啊"
                ]
            }
        ]
    },
    {
        cmd: "欠扁",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "欠扁", "欠揍", "欠打"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "嘿嘿，來打我啊～",
                    "別打人啦",
                    "文明一點",
                    "屁股給你打"
                ]
            }
        ]
    },
    {
        cmd: "hsr",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "hsr", "高鐵", "開車"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "小心開車，等你回家喔～",
                    "別又睡過站了啦",
                    "希望有位子",
                    "在家裡等你"
                ]
            }
        ]
    },
    {
        cmd: "lol",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "haha", "lol", "funny", "哈", "呵", "嘿", "笑", "顆顆", "科科", "嘻", "ㄎㄎ"
                ]
            },
            {
                priority: "default",
                model: "precise",
                texts: [
                    "ha"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "超好笑的～",
                    "嘿呀，我也覺得很好笑",
                    "哈哈哈",
                    "@@sticker 1 2",
                    "@@sticker 1 13",
                    "@@sticker 1 106",
                    "顆顆",
                    "lol lol lol",
                    "笑鼠人了",
                    "今天很開心喔",
                    "@@sticker 1 110",
                    "@@sticker 1 100",
                    "超想笑的！",
                    "呵，哈哈！"
                ]
            }
        ]
    },
    {
        cmd: "...",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "...", "無言", "沒事", "來亂", "亂入"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "... ... ...",
                    "...?",
                    "真的...無言",
                    "有點兒...",
                    "@@sticker 1 109",
                    "@@sticker 1 100",
                    "有事嗎？",
                    "是不是很OOXX?"
                ]
            }
        ]
    },
    {
        cmd: "funny",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "好玩", "有趣", "funny", "interesting", "有意思"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "是喔",
                    "哪裏有意思?",
                    "totally!",
                    "我也覺得超好玩的啦",
                    "@@sticker 1 5",
                    "@@sticker 1 1114",
                    "真的假的～",
                    "agree with you..."
                ]
            }
        ]
    },
    {
        cmd: "like",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "喜歡", "like", "love", "可愛", "討喜"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "是喔",
                    "哪裏有意思?",
                    "totally!",
                    "是真的嗎？",
                    "真的假的～",
                    "好喔"
                ]
            }
        ]
    },
    {
        cmd: "dislike",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "討厭", "hate", "dislike", "可惡", "閃啦", "不要"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "是喔",
                    "怎麼啦?",
                    "好吧～",
                    "放輕鬆",
                    "開心點",
                    "嗯嗯嗯"
                ]
            }
        ]
    },
    {
        cmd: "happy",
        queries: [
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "開心", "高興", "爽", " happy", "great", "excellent"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "YEAH!",
                    "超high的啦",
                    "我也替你高興呢",
                    "@@sticker 1 14",
                    "@@sticker 1 103",
                    "一起爽啊",
                    "Great!",
                    "Yo!"
                ]
            }
        ]
    },
    {
        cmd: "shit",
        queries: [
            {
                priority: "default",
                model: "precise",
                texts: [
                    "e04", "幹", "靠"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "媽的", "fuck", "shit", "fxck", "fxxk", "fuxk", "xxx"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "矮油",
                    "什麼事？",
                    "@@sticker 1 7",
                    "@@sticker 1 113",
                    "我們是文明人～",
                    "放輕鬆點啦～"
                ]
            }
        ]
    },
    {
        cmd: "ok",
        queries: [
            {
                priority: "default",
                model: "precise",
                texts: [
                    "ok", "好的", "好", "okok", "可以", "沒問題", "np", "yes"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "okok", "好啦", "okay", "no problem"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "你ＯＫ我當然也ＯＫ拉，顆顆",
                    "ＯＫＯＫ",
                    "沒問題喔",
                    "@@sticker 1 13",
                    "@@sticker 1 13",
                    "No problem!",
                    "ＯＫ的",
                    "@@sticker 1 106",
                    "@@sticker 1 114",
                    "好啊",
                    "就這樣子",
                    "-- O K A Y --",
                    "就醬"
                ]
            }
        ]
    },
    {
        cmd: "great",
        queries: [
            {
                priority: "default",
                model: "precise",
                texts: [
                    "great", "nice", "爽", "ya", "棒", "很好"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "讚", "yeah", "很棒"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "顆顆～",
                    "就是爽！",
                    "@@sticker 1 13",
                    "@@sticker 1 113",
                    "@@sticker 1 132",
                    "@@sticker 1 138",
                    "你真棒！",
                    "有夠讚",
                    "好樣的！",
                    "Yeah!"
                ]
            }
        ]
    },
    {
        cmd: "boring",
        queries: [
            {
                priority: "default",
                model: "precise",
                texts: [
                    "boring"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "無聊", "煩", "懶"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "怎麼辦？",
                    "找點樂子吧",
                    "去唸書",
                    "去運動一下？",
                    "聽聽音樂？",
                    "一起無聊也許就不無聊了！",
                    "說說笑？"
                ]
            }
        ]
    },
    {
        cmd: "angry",
        queries: [
            {
                priority: "default",
                model: "precise",
                texts: [
                    "mad", "angry", "nuts", "crazy"
                ]
            },
            {
                priority: "default",
                model: "fuzzy",
                texts: [
                    "生氣", "可惡", "討厭", "火大", "去死"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: null
            },
            {
                priority: "default",
                model: "canned",
                texts: [
                    "怎麼辦？",
                    "找點樂子吧",
                    "輕鬆一下啦",
                    "Take it easy",
                    "聽聽音樂？",
                    "給你按按摩？",
                    "clam down and eat cookie",
                    "let's have a cup of coffee?"
                ]
            }
        ]
    },
    {
        cmd: "time",
        queries: [
            {
                priority: "default",
                model: "precise",
                texts: [
                    "time", "now"
                ]
            },
            {
                priority: "default",
                model: "precise",
                texts: [
                    "時間", "現在", "タイム"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodUserCheckTime"
            }
        ]
    },
    {
        cmd: "birthday",
        queries: [
            {
                priority: "default",
                model: "command",
                texts: [
                    "bday", "birthday"
                ]
            },
            {
                priority: "default",
                model: "command",
                texts: [
                    "生日"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodUserCheckBirthday"
            }
        ]
    },
    {
        cmd: "image",
        queries: [
            {
                priority: "default",
                model: "command",
                texts: [
                    "image", "picture", "pic", "photo"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodReplyTheImage"
            }
        ]
    },
    {
        cmd: "add",
        queries: [
            {
                priority: "default",
                model: "command",
                texts: [
                    "add", "teach", "learn"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodAddCommand"
            }
        ]
    },
    {
        cmd: "del",
        queries: [
            {
                priority: "default",
                model: "command",
                texts: [
                    "del"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodDeleteCommand"
            }
        ]
    },
    {
        cmd: "idle",
        queries: [
            {
                priority: "default",
                model: "command",
                texts: [
                    "idle"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodShowIdle"
            }
        ]
    },
    {
        cmd: "@set",
        queries: [
            {
                priority: "default",
                model: "command",
                texts: [
                    "@set"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodSetConfig"
            }
        ]
    },
    {
        cmd: "weather",
        queries: [
            {
                priority: "default",
                model: "command",
                texts: [
                    "weather", "天氣"
                ]
            }
        ],
        responses: [
            {
                priority: "first",
                model: "smart",
                method: "methodWeather"
            }
        ]
    }
];

