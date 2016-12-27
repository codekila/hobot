var LINEBot = require('line-messaging');

var app = require('express')();
var server = require('http').Server(app);

var bot = LINEBot.create({
    channelID: '1493482238',
    channelSecret: '5e5ea18cd35b31891f679dea2ce06fe1',
    channelToken: '21+xqrIqnH+vF+SEu3B/LqBkOrVmxUs76SkfplRgKVAFGPvtYBQLS++Zs4LraPtMKfE/ukTr8r4xYnwCGNo9IA5yWBT430TK3wqWjLyZ39KGkprX4XHZj2xtc+rQJwDYx2LdMK+znHoZQc7L4TBwzAdB04t89/1O/w1cDnyilFU='
}, server);

app.use(bot.webhook('/'));
bot.on(LINEBot.Events.MESSAGE, function(replyToken, message) {
    console.log("HERE~~");
    console.log("GOT MESSAGE, id" + message.text);
    bot.replyTextMessage(replyToken, 'hello HoHoHo, Merry Christmas!' + message.text).then(function(data) {
        // add your code when success.
    }).catch(function(error) {
        // add your code when error.
    });
});
bot.on(LINEBot.Events.POSTBACK, function(replyToken, message) {
    console.log("GOT POSTBACK");
});
bot.on(LINEBot.Events.FOLLOW, function(replyToken, message) {
    console.log("GOT FOLLOW");
});
bot.on(LINEBot.Events.UNFOLLOW, function(replyToken, message) {
    console.log("GOT UNFOLLOW");
});
bot.on(LINEBot.Events.JOIN, function(replyToken, message) {
    console.log("GOT JOIN");
});
bot.on(LINEBot.Events.LEAVE, function(replyToken, message) {
    console.log("GOT LEAVE");
});
bot.on(LINEBot.Events.BEACON, function(replyToken, message) {
    console.log("GOT BEACON");
});


var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

server.listen(server_port, server_host, function() {
    console.log('hobot listening on port %d', server_port);
});