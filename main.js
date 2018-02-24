'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
    //channelID: '1493482238',
    channelSecret: '5e5ea18cd35b31891f679dea2ce06fe1',
    channelAccessToken: '21+xqrIqnH+vF+SEu3B/LqBkOrVmxUs76SkfplRgKVAFGPvtYBQLS++Zs4LraPtMKfE/ukTr8r4xYnwCGNo9IA5yWBT430TK3wqWjLyZ39KGkprX4XHZj2xtc+rQJwDYx2LdMK+znHoZQc7L4TBwzAdB04t89/1O/w1cDnyilFU='
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
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
    const echo = composeReply(event);

    // use reply API
    if (echo != null)
        return client.replyMessage(event.replyToken, echo);
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
    let echoText = null;
    let queryText = event.message.text;

    // a bit of fun here
    console.log('query message = \'' + queryText + '\'');
    if (queryText.includes('笨') || queryText.includes('蠢') || queryText.includes('白痴')
        || queryText.includes('智障') || queryText.includes('白痴') || queryText.toLowerCase().includes('idiot')) {
        echoText = '對不起，我智商比較低～～～><';
    } else if (queryText.toLowerCase() == 'time' || queryText == '時間' || queryText == 'タイム') {
        echoText = handleQueryTime();
    } else if (queryText.toLowerCase() == 'meowco' || queryText == '妙可') {
        echoText = '誒～我只知道這隻貓很肥！';
    } else if (queryText.toLowerCase() == 'help' || queryText == '幫忙') {
        echoText = '我也很想啊，但是我目前的智商還差得很遠勒～';
    }

    if (echoText != null)
        return { type: 'text', text: echoText };
    else
        return null;
}

const clock = require('world-clock')();

function handleQueryTime() {
    return 'Taiwan: ' + clock.today('Asia/Taipei').toString() + ' ' + clock.localTime('Asia/Taipei').toString().substr(0,5)
            + '\nSan Diego: ' + clock.today('America/Los_Angeles').toString() + ' ' + clock.localTime('America/Los_Angeles').toString().substr(0,5);

}