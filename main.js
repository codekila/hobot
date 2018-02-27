'use strict';

const lineBotSdk = require('@line/bot-sdk');
const express = require('express');

const db = require('./cmdDb.js');
const engine = require('./cmdDbEngine.js');
const modUsers = require('./Users.js');

const CronJob = require('cron').CronJob;

// create LINE SDK config from env variables
const config = {
    //channelID: '1493482238',
    channelSecret: '5e5ea18cd35b31891f679dea2ce06fe1',
    channelAccessToken: '21+xqrIqnH+vF+SEu3B/LqBkOrVmxUs76SkfplRgKVAFGPvtYBQLS++Zs4LraPtMKfE/ukTr8r4xYnwCGNo9IA5yWBT430TK3wqWjLyZ39KGkprX4XHZj2xtc+rQJwDYx2LdMK+znHoZQc7L4TBwzAdB04t89/1O/w1cDnyilFU='
};

// create LINE SDK client
const client = new lineBotSdk.Client(config);

// create Express app
const app = express();

// public data
app.use('/static', express.static(__dirname + '/public'));

// register a webhook handler with middleware
app.post('/callback', lineBotSdk.middleware(config), (req, res) => {
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
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    composeReply(event, cbSendReply);
}

function cbSendReply(event, msgBody) {
    // use reply API
    if (event != null && msgBody != null) {
        return client.replyMessage(event.replyToken, msgBody);
    } else
        return Promise.resolve(null);
}

// compose the context-aware reply
function composeReply(event, replyCbFunc) {
    // only deal with msg sent from user
    if (event.source.type == 'user' || event.source.type == 'group' || event.source.type == 'room') {
        client.getProfile(event.source.userId)
            .then((profile) => {
                let replyText = null;
                let dbResult = null;
                let queryText = event.message.text.trim().toLowerCase();
                let userName = profile.displayName;
                let user = modUsers.find(db, event.source.userId);

                console.log('[' + userName + '(' + event.source.userId + ')] query message = \'' + queryText + '\'');

                // update runtime info
                if (user != null) {
                    user.runtime.lastSeen = Date.now();
                    user.runtime.displayName = userName;
                }
                
                // search for response in the database
                engine.processDb(event, userName, queryText, db, (replyText) => {
                    let msgBody = null;
                    let replyTexts = replyText.split(" ");

                    console.log('[' + userName + '(' + event.source.userId + ')] response message = \'' + replyTexts + '\'');

                    if (replyTexts[0]) {
                        switch (replyTexts[0]) {
                            case '@@image':
                                msgBody = { type: 'image', originalContentUrl: replyTexts[1] + '/original.jpg', previewImageUrl: replyTexts[1]  + '/preview.jpg'};
                                break;
                            case '@@video':
                                msgBody = { type: 'video', originalContentUrl: replyTexts[1] + '/original.mp4', previewImageUrl: replyTexts[1] + '/preview.jpg'};
                                break;
                            case '@@sticker':
                                msgBody = { type: 'sticker', packageId: replyTexts[1], stickerId: replyTexts[2]};
                                break;
                            default:
                                msgBody = { type: 'text', text: replyText };
                        }
                    }
                    replyCbFunc(event, msgBody);
                });
            });
        /*
            .catch((err)=> {
                console.log(':' + err.message);
                replyCbFunc(event, { type: 'text', text: '矮油，我們好像還不是朋友呢，可以把何寶加成你的好友嗎？' });
            });
            */
    }
}

var botStartTime = Date.now();

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`hobot listening to port ${port}`);

    // update display names
    for (let i of db.userDb.users) {
        client.getProfile(i.userId)
            .then((profile) => {
                i.runtime.displayName = profile.displayName;
            });
    }
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

const defaultTZ = 'Asia/Taipei';

const cronJobs = require('./cronJobs.js');

//const jobHourly = new CronJob('0 0 */1 * * *', function() {
const jobHourly = new CronJob('*/5 * * * * *', function() {
        console.log("hourly housekeeping");

        cronJobs.checkWhoIsIdleTooLong(db, 20, (userList) => {
            console.log('you are idle too long: ' + userList);
        });
    
    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    defaultTZ /* Time zone of this job. */
);

const jobDaily = new CronJob('0 0 7 */1 * *', function() {
        //
        console.log("daily housekeeping");
    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    defaultTZ /* Time zone of this job. */
);

const jobWeekly = new CronJob('0 0 8 * * 0-6', function() {
        //
        console.log("weekly housekeeping");
    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    defaultTZ /* Time zone of this job. */
);

const jobMonthly = new CronJob('0 0 9 1 */1 *', function() {
        //
        console.log("monthly housekeeping");
    }, function () {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    defaultTZ /* Time zone of this job. */
);
