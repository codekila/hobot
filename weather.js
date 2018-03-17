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
    checkWeather: checkWeather,
    checkWeatherTaiwan: checkWeatherTaiwan,
    checkWeatherYahoo: checkWeatherYahoo
};

let taiwanLocations = null;

function init() {
    getTaiwanLocationinfo();
}

function checkWeather(townName, cb) {
    let townId = getTaiwanTownId(townName);

    console.log(townName + ': id = ' + townId);

    if (townId == 0)
        return checkWeatherYahoo(townName, cb);
    else
        return checkWeatherTaiwan(townName, cb);
}

function getTaiwanLocationinfo() {
    request('https://works.ioa.tw/weather/api/all.json', {json: true}, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        taiwanLocations = body;
    });
}

function getTaiwanTownId(townName) {
    let townId = 0;
    if (taiwanLocations == null || townName == null) return 0;
    for (let city of taiwanLocations) {
        if (city.name.includes(townName))
            townId = city.towns[0].id;
        for (let town of city.towns) {
            if (town.name.includes(townName))
                return town.id;
        }
    }
    return townId;
}

function checkWeatherTaiwan(townName, cb) {
    let townId = getTaiwanTownId(townName);

    if (townId == 0) {
        cb('在台灣找不到這個名字的地方喔');
        return;
    }
    console.log(townName + ': id = ' + townId);
    request('https://works.ioa.tw/weather/api/weathers/' + townId + '.json', {json: true}, (err, res, body) => {
        if (err) {
            cb(err.message);
        }
        else if (body == null) {
            cb('Empty Taiwan weather body');
        } else {
            let townInfo = body;
            let text = townName + '：';
            text += '溫度' + townInfo.temperature + '度，濕度' + townInfo.humidity + '%，' + townInfo.desc + '。\n';
            text += '更新時間：' + townInfo.at;
            cb(text);
        }
    });
}

/**
 *  Yahoo Weather code is forked from: https://github.com/codekila/yahoo-weather
 */

/*
 input: location (for example "gainesville, fl")
 output: full yahoo weather info in json format (see above)
 */
function getWeatherYahoo(location, cb) {
    let locationUrl = 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")&format=json&env=store://datatables.org/alltableswithkeys';

    request(locationUrl, {json: true}, (err, res, body) => {
        if (err) {
            console.log(err);
            cb(null);
        }
        else {
            cb(body);
        }
    });
}

/*
 input: location (for example "gainesville, fl")
 output: full yahoo weather info in json format (https://developer.yahoo.com/weather/)
 */
function checkFullWeatherYahoo(location, cb) {
    getWeatherYahoo(location, ans => {
        cb(ans);
    });
}

/*
 input: location (for example "gainesville, fl")
 output: simplified yahoo weather info in json format
 */
function checkWeatherYahoo(location, cb) {
    getWeatherYahoo(location, yw => {
        console.log('yw: ' + JSON.stringify(yw));
        let ans = {};
        try {
            if (yw.query.results != null) {
                // try to shorten the calls
                let gen = yw.query.results.channel;
                let info = yw.query.results.channel.item;

                ans.date = info.condition.date;
                ans.location = {lat: info.lat, long: info.long};
                ans.weather = {
                    temperature: {value: info.condition.temp, units: gen.units.temperature},
                    wind: {value: gen.wind.speed, units: gen.units.speed},
                    windChill: {value: gen.wind.chill, units: gen.units.temperature},
                    condition: info.condition.text
                };
                ans.forecast = info.forecast;
            }
            console.log('ans: ' + ans);
            cb(ans);
        } catch (err) {
            console.log(err);
            cb(null);
        }
    });
}
