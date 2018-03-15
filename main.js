'use strict';

const lineBotSdk = require('@line/bot-sdk');
const HTTPError = require('@line/bot-sdk').HTTPError;
const JSONParseError = require('@line/bot-sdk').JSONParseError;
const ReadError = require('@line/bot-sdk').ReadError;
const RequestError = require('@line/bot-sdk').RequestError;

const express = require('express');
const CronJob = require('cron').CronJob;
const moment = require('moment');

const modConfigs = require('./Configs.js');
const modCmds = require('./Commands.js');
const modUsers = require('./Users.js');
const jobs = require('./cronJobs.js');


// create LINE SDK configLINE from env variables
const configLINE = {
    //channelID: '1493482238',
    channelSecret: '5e5ea18cd35b31891f679dea2ce06fe1',
    channelAccessToken: '21+xqrIqnH+vF+SEu3B/LqBkOrVmxUs76SkfplRgKVAFGPvtYBQLS++Zs4LraPtMKfE/ukTr8r4xYnwCGNo9IA5yWBT430TK3wqWjLyZ39KGkprX4XHZj2xtc+rQJwDYx2LdMK+znHoZQc7L4TBwzAdB04t89/1O/w1cDnyilFU='
};

// global config for all
global.config = {
    botClient: (()=> new lineBotSdk.Client(configLINE))(),
    botStartTime: (()=> Date.now())(),
    defaultTZ: 'Asia/Taipei',
    mongoURL: 'mongodb://hobot:hobotpass123@ds151558.mlab.com:51558/hobot',
    mongoose: require('mongoose'),
    channel3idiots: 'C9378e378d388296e286f09a39caaa8a8',
    channelTest: 'Ced664c11782376a001d6c43c5bb3e850'
};

// create Express app
const app = express();

// public data
app.use('/static', express.static(__dirname + '/public'));

// register a webhook handler with middleware
app.post('/callback', lineBotSdk.middleware(configLINE), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// event handler
function handleEvent(event) {
    switch (event.type) {
        case 'message':
            switch (event.message.type) {
                case 'text':
                    composeReply(event, cbSendReply);
                    return;
                default:
            }
            break;
        case 'join':
            global.config.botClient.replyMessage(event.replyToken, {type: 'text', text: '您好，我是何寶！'});
            return;
        default:
    }
    return Promise.resolve(null);
}

function cbSendReply(event, msgBody) {
    // use reply API
    if (event != null && msgBody != null) {
        return global.config.botClient.replyMessage(event.replyToken, msgBody).catch((err) => {
            if (err instanceof HTTPError) {
                console.error('replyMessage error:' + err.statusCode);
            }
        });
    } else
        return Promise.resolve(null);
}

// compose the context-aware reply
function composeReply(event, replyCbFunc) {
    // only deal with msg sent from user
    if (event.source.type == 'user' || event.source.type == 'group' || event.source.type == 'room') {
        global.config.botClient.getProfile(event.source.userId).then((profile) => {
                modUsers.find(event.source.userId, user => {
                let groupInfo;
                let replyText = null;
                let dbResult = null;
                let queryText = event.message.text.trim().toLowerCase();
                let userName = profile.displayName;

                if (event.source.type == 'group')
                    groupInfo = ' from group [' + event.source.groupId + ']';
                else if (event.source.type == 'room')
                    groupInfo = ' from room [' + event.source.roomId + ']';
                else
                    groupInfo = '';

                console.log('[' + userName + '(' + event.source.userId + ')]' + groupInfo + ', query message = \'' + queryText + '\'');

                // update runtime info
                if (user) modUsers.updateTimestamp(user.userId, userName, null);

                // search for response in the database
                modCmds.processDb(event, userName, queryText, (replyMsg) => {
                    if (replyMsg) {
                        let msgBody = null;
                        let replyTexts = replyMsg.split(" ");

                        console.log('[' + userName + '(' + event.source.userId + ')] response message = \'' + replyTexts + '\'');

                        if (replyTexts[0]) {
                            switch (replyTexts[0]) {
                                case '@@image':
                                    msgBody = {
                                        type: 'image',
                                        originalContentUrl: replyTexts[1] + '/original.jpg',
                                        previewImageUrl: replyTexts[1] + '/preview.jpg'
                                    };
                                    break;
                                case '@@video':
                                    msgBody = {
                                        type: 'video',
                                        originalContentUrl: replyTexts[1] + '/original.mp4',
                                        previewImageUrl: replyTexts[1] + '/preview.jpg'
                                    };
                                    break;
                                case '@@sticker':
                                    msgBody = {type: 'sticker', packageId: replyTexts[1], stickerId: replyTexts[2]};
                                    break;
                                default:
                                    msgBody = {type: 'text', text: replyMsg};
                            }
                        }
                        replyCbFunc(event, msgBody);
                    }
                });
            })
        })
        .catch((err) => {
            if (err instanceof HTTPError) {
                console.log('composeReply()--> getProfile error:' + err.statusCode);
                if (err.statusCode == 404) {
                    replyCbFunc(event, {type: 'text', text: '矮油，我們好像還不是朋友呢，可以把何寶加成你的好友嗎？'});
                }
            } else {
                console.error('composeReply error:' + err.message);
                replyCbFunc(event, {type: 'text', text: 'Exception: ' + err.message});
            }
        });
    }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`hobot listening to port ${port}`);

    // init mongodb
    global.config.mongoose.connect(global.config.mongoURL);
    global.db = global.config.mongoose.connection;
    global.db.on('error', console.error.bind(console, 'database connection error:'));
    global.db.once('open', () => {
        console.log("Database Connected.");

        modConfigs.init(global.config.mongoose);
        modCmds.init(global.config.mongoose);
        modUsers.init(global.config.mongoose);
        jobs.init();

        modCmds.createCommands();
        modUsers.createUsers();

        // update display names
        modUsers.updateAllDisplayNames();
    });

    global.config.mongoose.set('debug', true);

    // create db models
    //global.dbModel.CommandModel = global.config.mongoose.model('Commands', CommandSchema);
});

/*
 initiate cron jobs

 Seconds: 0-59
 Minutes: 0-59
 Hours: 0-23
 Day of Month: 1-31
 Months: 0-11 (Jan-Dec)
 Day of Week: 0-6 (Sun-Sat)

 */
//const jobHourly = new CronJob('0 0 */1 * * *', function () {
const jobHourly = new CronJob('*/10 * * * * *', function() {
        let now = moment();
        console.log("hourly housekeeping");

        modConfigs.get('lastOneHourTime', last => {
            // initialize it if the timestamp doesn't exist
            if (last == null) {
                modConfigs.set('lastOneHourTime', now.toString());
                return;
            }
            // real cron jobs here
            if (now.diff(moment(last), 'minutes') >= 1) {
                jobs.checkWhoIsIdling(12);
                //jobs.checkWhenSabReturns();

            }
            // otherwise it may be restarted within an hour
        });
    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    global.config.defaultTZ /* Time zone of this job. */
);

const jobDaily = new CronJob('0 0 7 */1 * *', function () {
        //
        console.log("daily housekeeping");

        jobs.checkWhenSabReturns();

    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    global.config.defaultTZ /* Time zone of this job. */
);

const jobWeekly = new CronJob('0 0 8 * * 0-6', function () {
        //
        console.log("weekly housekeeping");
    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    global.config.defaultTZ /* Time zone of this job. */
);

const jobMonthly = new CronJob('0 0 9 1 */1 *', function () {
        //
        console.log("monthly housekeeping");
    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    global.config.defaultTZ /* Time zone of this job. */
);
