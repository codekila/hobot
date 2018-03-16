/**
 * Created by jamesho on 16/03/2018.
 */

"use strict";

const moment = require('moment');
const request = require('request');

const modConfigs = require('./Configs.js');
const modCmds = require('./Commands.js');
const modUsers = require('./Users.js');

module.exports = {
    init: init,
    checkWeatherTaiwan: checkWeatherTaiwan
};

let taiwanLocations = null;

function init() {
    getLocationinfo();
}

function getLocationinfo() {
    request('https://works.ioa.tw/weather/api/all.json', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        taiwanLocations = body;
    });
}

function getTownId(townName) {
    if (taiwanLocations == null || townName == null) return 0;
    for (let city of taiwanLocations)
        for (let town of city.towns) {
            if (town.name == townName)
                return town.id;
        }
    return 0;
}

function checkWeatherTaiwan(townName, cb) {
    let townId = getTownId(townName);

    if (townId == 0) {
        cb('找不到這個名字的天氣喔');
        return;
    }
    console.log(townName + ': id = ' + townId);
    request('https://works.ioa.tw/weather/api/weathers/' + townId + '.json', { json: true }, (err, res, body) => {
        if (err) {
            cb(err.message);
        }
        else if (body == null) {
            cb('Empty weather body');
        } else {
            let townInfo = body;
            let text = townName + '天氣狀況：';
            text += '溫度' + townInfo.temperature + '度, 濕度' + townInfo.humidity + '%, ' + townInfo.desc + '。\n';
            text += '更新時間: ' + townInfo.at;
            cb(text);
        }
    });
}