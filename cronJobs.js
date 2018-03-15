"use strict";

const moment = require('moment');

const modConfigs = require('./Configs.js');
const modCmds = require('./Commands.js');
const modUsers = require('./Users.js');

module.exports = {
    checkWhoIsIdling: jobCheckWhoIsIdling,
    checkWhenSabReturns: jobCheckWhenSabReturns
};

function jobCheckWhoIsIdling(hours) {
    modUsers.getWhoIsIdleTooLong(hours * 60 * 60 * 1000, (userList) => {
        if (userList && userList.length > 0) {
            let reply = '';
            console.log('you are idle too long: ' + JSON.stringify(userList));
            for (let i of userList) {
                reply += '@' + i.userName + ' ';
            }

            global.config.botClient.pushMessage(global.config.channel3idiots, {
                type: 'text',
                text: reply + '潛水太久了喔，出來透透氣吧！'
            });
        }
    });
}

function jobCheckWhenSabReturns() {
    modConfigs.get("sabreturndate", value => {
        if (value != null) {
            let today = moment();
            let days = Math.floor(moment(value, 'YYYY-MM-DD').diff(today, 'days'));

            if (days > 0) {
                global.config.botClient.pushMessage(global.config.channel3idiots, {
                    type: 'text',
                    text: '姊姊還有' + days + '天(' + value + ')就要回來了喔！'
                });
            }
        }
    });
}
