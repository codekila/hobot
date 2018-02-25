'use strict';

const line = require('@line/bot-sdk');
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
const client = new line.Client(config);

// create Express app
const app = express();

// register a webhook handler with middleware
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
    let replyText = null;
    let dbResult = null;
    let queryText = event.message.text.trim().toLowerCase();

    console.log('query message = \'' + queryText + '\'');

    // search for response in the database
    if ((dbResult = engine.processDb(queryText, db.cmdDb)) != null) {
        replyText = dbResult;
    }
    else {
        // a bit more fun here
        if (queryText.toLowerCase() == 'time' || queryText == '時間' || queryText == 'タイム') {
            replyText = handleQueryTime();
        } else if (queryText.toLowerCase() == 'meowco' || queryText.includes('妙可')) {
            replyText = '誒～我只知道這隻貓很肥！';
        } else if (queryText.toLowerCase() == 'help' || queryText.toLowerCase() == 'hobot' || queryText == '何寶' || queryText == '幫忙') {
            replyText = '我也很想啊，但是我目前的智商還差得很遠勒～';
        } else if (queryText.toLowerCase() == 'good afternoon' || queryText == '午安') {
            replyText = '我想睡個午覺';
        } else if (queryText.toLowerCase() == 'good night' || queryText == '晚安') {
            replyText = '大家一起來睡覺喔';
        } else if (queryText.includes('肥') || queryText.includes('胖')) {
            replyText = '我也覺得自己有點肥耶';
        } else if (queryText.includes('肥') || queryText.includes('胖')) {
            replyText = '我也覺得自己有點肥耶';
        } else if (queryText.includes('欠扁') || queryText.includes('欠揍')) {
            replyText = '嘿嘿，來打我啊～';
        } else if (queryText.includes('肥') || queryText.includes('胖')) {
            replyText = '怎摸辦，我也覺得自己有點肥耶～';
        } else if (queryText.toLowerCase().includes('hsr') || queryText.includes('高鐵')) {
            replyText = '小心開車，等你回家喔～';
        } else if (queryText.toLowerCase().includes('lol') || queryText.toLowerCase().includes('haha') || queryText.includes('哈')
            || queryText.includes('呵') || queryText.includes('嘿') || queryText.includes('笑')) {
            replyText = (Math.random() < 0.5) ? '超好笑的！' : '嘿呀，我也覺得很好笑';
        } else if (queryText.includes('...')) {
            replyText = '... ... ... 呼呼';
        } else if (queryText.toLowerCase().includes('ok')) {
            replyText = '你ＯＫ我當然也ＯＫ拉，顆顆';
        } else if (queryText.includes('讚')) {
            replyText = '顆顆～';
        }
    }

    console.log('response message = \'' + replyText + '\'');

    if (replyText != null)
        return { type: 'text', text: replyText };
    else
        return null;
}

const clock = require('world-clock')();

function handleQueryTime() {
    return 'Taiwan:    ' + clock.localTime('Asia/Taipei').toString().substr(0,5) + ', ' + clock.today('Asia/Taipei').toString() + '\n'
        +  'San Diego: ' + clock.localTime('America/Los_Angeles').toString().substr(0,5) + ', ' + clock.today('America/Los_Angeles').toString();

}

