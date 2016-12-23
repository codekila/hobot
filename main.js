var LINEBot = require('line-messaging');

var app = require('express')();
var server = require('http').Server(app);

var bot = LINEBot.create({
    channelID: '1493482238',
    channelSecret: '5e5ea18cd35b31891f679dea2ce06fe1',
    channelToken: '21+xqrIqnH+vF+SEu3B/LqBkOrVmxUs76SkfplRgKVAFGPvtYBQLS++Zs4LraPtMKfE/ukTr8r4xYnwCGNo9IA5yWBT430TK3wqWjLyZ39KGkprX4XHZj2xtc+rQJwDYx2LdMK+znHoZQc7L4TBwzAdB04t89/1O/w1cDnyilFU='
}, server);

app.use(bot.webhook('/webhook'));
bot.on(LINEBot.Events.MESSAGE, function(replyToken, message) {
    console.log("GOT MESSAGE");
    bot.replyTextMessage(replyToken, 'hello HoHoHo!').then(function(data) {
        // add your code when success.
    }).catch(function(error) {
        // add your code when error.
    });
});

server.listen(process.env.PORT || 8080);
