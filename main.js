'use strict';

const lineBotSdk = require('@line/bot-sdk');
const express = require('express');

const db = require('./cmdDb.js');
const engine = require('./cmdDbEngine.js');

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

function cbSendReply(event, replyMsg, msgType) {
    // use reply API
    if (replyMsg != null && msgType != null) {
        let msgBody = null;

        switch(msgType) {
            case 'text':
                msgBody = { type: msgType, text: replyMsg };
                break;
            case 'image':
                msgBody = { type: msgType, originalContentUrl: replyMsg + '/original.jpg', previewImageUrl: replyMsg + '/preview.jpg'};
                break;
            case 'video':
                msgBody = { type: msgType, originalContentUrl: replyMsg + '/original.mp4', previewImageUrl: replyMsg + '/preview.jpg'};
                break;
            default:
                msgBody = { type: 'text', text: 'not supported type of response: ' + msgType };
        }
        return client.replyMessage(event.replyToken, msgBody);
    } else
        return Promise.resolve(null);
}

// compose the context-aware reply
function composeReply(event, replyCbFunc) {
    let replyText = null;
    let dbResult = null;
    let userName = '';
    let queryText = event.message.text.trim().toLowerCase();

    // only deal with msg sent from user
    if (event.source.type == 'user' || event.source.type == 'group' || event.source.type == 'room') {
        client.getProfile(event.source.userId)
            .then((profile) => {
                let msgType;
                userName = profile.displayName;

                console.log('[' + userName + '(' + event.source.userId + ')] query message = \'' + queryText + '\'');

                // search for response in the database
                if ((dbResult = engine.processDb(event, userName, queryText, db)) != null) {
                    replyText = dbResult;
                }

                console.log('[' + userName + '(' + event.source.userId + ')] response message = \'' + replyText + '\'');

                switch(replyText.substr(0,2)){
                    case 'i:':
                        msgType = 'image';
                        replyText = replyText.substr(2);
                        break;
                    case 'v:':
                        msgType = 'video';
                        replyText = replyText.substr(2);
                        break;
                    default:
                        msgType = 'text';
                }

                replyCbFunc(event, replyText, msgType);
            })
            .catch((err)=> {
                console.log('getUserProfileError:' + err.message);
                replyCbFunc(event, '矮油，我們好像還不是朋友呢，可以把何寶加成你的好友嗎？', 'text');
            });

    }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`hobot listening to port ${port}`);
});

