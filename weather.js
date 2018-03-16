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

function init() {

}

function checkWeatherTaiwan() {

    request('https://works.ioa.tw/weather/api/all.json', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(JSON.stringify(body));
    });
}