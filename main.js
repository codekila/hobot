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

    // create a echoing text message
    const replyMsg = composeReply(event);

    // use reply API
    if (replyMsg != null)
        return client.replyMessage(event.replyToken, replyMsg);
    else
        return Promise.resolve(null);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`hobot listening on ${port}`);
});

// compose the context-aware reply
function composeReply(event) {
    let replyText = null;
    let dbResult = null;
    let userName = '';
    let queryText = event.message.text.trim().toLowerCase();

    // get user info
    if (event.source.type == 'user') {
        client.getProfile(event.source.userId)
            .then((profile) => {
                userName = profile.displayName;

                console.log('[' + userName + '] query message = \'' + queryText + '\'');

                // search for response in the database
                if ((dbResult = engine.processDb(event, queryText, db.cmdDb)) != null) {
                    replyText = dbResult;
                }

                console.log('[' + userName + ']response message = \'' + replyText + '\'');

                if (replyText != null)
                    return { type: 'text', text: replyText };
                else
                    return null;
            })
            .catch((err) => {
                return null;
            });

    }
}

