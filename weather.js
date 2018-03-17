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
        console.log('Yahoo Weather result: ' + JSON.stringify(yw));
        try {
            if (yw.query.results == null) {
                cb('not found');
            } else {
                // try to shorten the calls
                let channel = yw.query.results.channel;
                let text = channel.location.city + ',' + channel.location.region;
                let temp;

                if (channel.units.temperature == 'F') {
                    temp = channel.item.condition.temp + '°F(' + Math.floor((channel.item.condition.temp-32)*5/9) + '°C)';
                } else {
                    temp = channel.item.condition.temp + '°C(' + Math.floor((channel.item.condition.temp*9/5)+32) + '°F)';
                }

                text += '現在溫度' + temp +' 濕度' + channel.atmosphere.humidity + '% ' + yahooWeatherCode[channel.item.condition.code] + '.\n';

                let i = 0;
                for (let channel of channel.item.forecast) {
                    let tempHigh, tempLow;

                    if (channel.units.temperature == 'F') {
                        tempHigh = Math.floor((forecast.high-32)*5/9);
                        tempLow = Math.floor((forecast.low-32)*5/9);
                    } else {
                        tempHigh = forecast.high;
                        tempLow = forecast.low;
                    }
                    text += '\n' + weekOfDays[forecast.day] + ': ' + tempHigh + '/' + tempLow + '°C, ' + yahooWeatherCode[forecast.code];
                    if (++i == 5) break; // display 5 days at most
                }
                cb(text);
            }
        } catch (err) {
            console.log(err);
            cb(null);
        }
    });
}

const weekOfDays = {
    'Sun': '週日',
    'Mon': '週一',
    'Tue': '週二',
    'Wed': '週三',
    'Thr': '週四',
    'Fri': '週五',
    'Sat': '週六'
};

const yahooWeatherCode = [
    '龍捲風', // 0
    '熱帶風暴',
    '颱風',
    '嚴重暴風雨',
    '暴風雨',
    '雨夾雪', // 5
    '雨夾雪',
    '雨夾雪',
    '凍雨',
    '細雨',
    '凍雨', // 10
    '陣雨',
    '陣雨',
    '毛雪',
    '雪夾雨',
    '吹雪', // 15
    '下雪',
    '冰雹',
    '雨夾雪',
    '沙塵',
    '有霧', // 20
    '有霾',
    '有煙',
    '大風',
    '有風',
    '寒冷', // 25
    '有雲',
    '陰天',
    '陰天',
    '多雲',
    '多雲', // 30
    '晴天',
    '晴天',
    '晴天',
    '晴天',
    '雨夾冰雹', // 35
    '很熱',
    '暴雨',
    '偶有暴雨',
    '偶有暴雨',
    '偶有陣雨', // 40
    '大雪',
    '偶有雨雪',
    '大雪',
    '有雲',
    '雷陣雨', // 45
    '雪雨',
    '雷陣雨'
];

let x = {
    "query": {
        "count": 1,
        "created": "2018-03-17T00:57:43Z",
        "lang": "en-US",
        "results": {
            "channel": {
                "units": {
                    "distance": "mi",
                    "pressure": "in",
                    "speed": "mph",
                    "temperature": "F"
                },
                "title": "Yahoo! Weather - Nome, AK, US",
                "link": "http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2460286/",
                "description": "Yahoo! Weather for Nome, AK, US",
                "language": "en-us",
                "lastBuildDate": "Fri, 16 Mar 2018 04:57 PM AKDT",
                "ttl": "60",
                "location": {
                    "city": "Nome",
                    "country": "United States",
                    "region": " AK"
                },
                "wind": {
                    "chill": "-9",
                    "direction": "23",
                    "speed": "11"
                },
                "atmosphere": {
                    "humidity": "60",
                    "pressure": "1018.0",
                    "rising": "0",
                    "visibility": "16.1"
                },
                "astronomy": {
                    "sunrise": "9:17 am",
                    "sunset": "9:6 pm"
                },
                "image": {
                    "title": "Yahoo! Weather",
                    "width": "142",
                    "height": "18",
                    "link": "http://weather.yahoo.com",
                    "url": "http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif"
                },
                "item": {
                    "title": "Conditions for Nome, AK, US at 03:00 PM AKDT",
                    "lat": "64.499474",
                    "long": "-165.405792",
                    "link": "http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2460286/",
                    "pubDate": "Fri, 16 Mar 2018 03:00 PM AKDT",
                    "condition": {
                        "code": "32",
                        "date": "Fri, 16 Mar 2018 03:00 PM AKDT",
                        "temp": "3",
                        "text": "Sunny"
                    },
                    "forecast": [
                        {
                            "code": "32",
                            "date": "16 Mar 2018",
                            "day": "Fri",
                            "high": "3",
                            "low": "-4",
                            "text": "Sunny"
                        },
                        {
                            "code": "14",
                            "date": "17 Mar 2018",
                            "day": "Sat",
                            "high": "20",
                            "low": "-4",
                            "text": "Snow Showers"
                        },
                        {
                            "code": "14",
                            "date": "18 Mar 2018",
                            "day": "Sun",
                            "high": "22",
                            "low": "14",
                            "text": "Snow Showers"
                        },
                        {
                            "code": "28",
                            "date": "19 Mar 2018",
                            "day": "Mon",
                            "high": "23",
                            "low": "15",
                            "text": "Mostly Cloudy"
                        },
                        {
                            "code": "34",
                            "date": "20 Mar 2018",
                            "day": "Tue",
                            "high": "13",
                            "low": "-1",
                            "text": "Mostly Sunny"
                        },
                        {
                            "code": "30",
                            "date": "21 Mar 2018",
                            "day": "Wed",
                            "high": "5",
                            "low": "-3",
                            "text": "Partly Cloudy"
                        },
                        {
                            "code": "30",
                            "date": "22 Mar 2018",
                            "day": "Thu",
                            "high": "7",
                            "low": "-2",
                            "text": "Partly Cloudy"
                        },
                        {
                            "code": "34",
                            "date": "23 Mar 2018",
                            "day": "Fri",
                            "high": "15",
                            "low": "4",
                            "text": "Mostly Sunny"
                        },
                        {
                            "code": "30",
                            "date": "24 Mar 2018",
                            "day": "Sat",
                            "high": "14",
                            "low": "8",
                            "text": "Partly Cloudy"
                        },
                        {
                            "code": "30",
                            "date": "25 Mar 2018",
                            "day": "Sun",
                            "high": "16",
                            "low": "5",
                            "text": "Partly Cloudy"
                        }
                    ],
                    "description": "<![CDATA[<img src=\"http://l.yimg.com/a/i/us/we/52/32.gif\"/>\n<BR />\n<b>Current Conditions:</b>\n<BR />Sunny\n<BR />\n<BR />\n<b>Forecast:</b>\n<BR /> Fri - Sunny. High: 3Low: -4\n<BR /> Sat - Snow Showers. High: 20Low: -4\n<BR /> Sun - Snow Showers. High: 22Low: 14\n<BR /> Mon - Mostly Cloudy. High: 23Low: 15\n<BR /> Tue - Mostly Sunny. High: 13Low: -1\n<BR />\n<BR />\n<a href=\"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2460286/\">Full Forecast at Yahoo! Weather</a>\n<BR />\n<BR />\n<BR />\n]]>",
                    "guid": {
                        "isPermaLink": "false"
                    }
                }
            }
        }
    }
};