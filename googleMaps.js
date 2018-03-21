/**
 * Created by jamesho on 19/03/2018.
 */

"use strict";

const myGoogleMapsAPIKey = 'AIzaSyCST9EN_cfvQcj8_w200O44zsgTA2ASBuI';

let googleMapsClient = require('@google/maps').createClient({
    key: myGoogleMapsAPIKey
});

const moment = require('moment');
const request = require('request');
const async = require('async');

const modConfigs = require('./Configs.js');
const modCmds = require('./Commands.js');
const modUsers = require('./Users.js');

module.exports = {
    init: init,
    geoCode: geoCode,
    places: places
};

function init() {
}

/**
 *
 * Geocode an address
 *
 * @param address: street address or point of interest
 * @param cb
 */
function geoCode(address, cb) {
    console.log('GMaps Geocode:' + address);
    if (address == null) {
        cb(null);
    } else {
        googleMapsClient.geocode({
            address: address,
            language: 'zh-TW'
        }, function (err, response) {
            if (err) {
                console.log(err);
                cb(null);
            } else {
                console.log('GMaps Geocode response:' + JSON.stringify(response.json.results));
                cb(response.json.results[0].geometry.location);
            }
        });
    }
}

/**
 *
 * @param location: coordinates to look up
 * @param cb
 */
function places(location, cbFunc) {
    console.log('GMaps Places:' + JSON.stringify(location));
    if (location == null) {
        cb(null);
    } else {
        // get a list of places nearby
        googleMapsClient.placesNearby({
            language: 'zh-TW',
            location: [location.lat, location.lng],
            rankby: 'distance',
            opennow: true,
            type: 'restaurant'
        }, function (err, response) {
            if (err) {
                console.log(err);
                cbFunc(null);
            } else {
                console.log('GMaps Places response:' + JSON.stringify(response.json.results));

                let text = '附近餐廳:';
                for (let r of response.json.results) {
                    text += '\n' + r.name + '(' + (r.rating ? r.rating:'0.0')  + '): ' + r.vicinity + '\n';
                }
                cbFunc(text);

                // get detail of each place
                let carouselMsg = {
                    type: 'template',
                    altText: 'this is a carousel template',
                    template: {
                        type: 'carousel',
                        columns: []
                    }
                };

                async.forEachSeries(response.json.results,
                    (r, callback) => {
                        console.log('GMaps Place Detail request: ' + r.name);

                        googleMapsClient.place({
                            placeid: r.place_id,
                            language: 'zh-TW'
                        }, (err, response) => {
                            if (err) {
                                console.log(err);
                                callback(err);
                            } else {
                                //console.log('GMaps Place Detail response: ' + JSON.stringify(response.json.result));
                                let col = convertToCarouselColumn(response.json.result);
                                console.log('GMaps Place Detail Carousel: ' + JSON.stringify(col));
                                carouselMsg.columns.push(col);
                                callback();
                            }
                        });
                    },
                    err => {
                        if (err)
                            console.error("Error:" + err.message);
                        else {
                            console.log('GMaps Place Detail Carousel Msg:' + JSON.stringify(carouselMsg));

                        }
                    }
                );

/*
                for (let r of response.json.results) {
                    googleMapsClient.place({
                        placeid: r.place_id,
                        language: 'zh-TW'
                    }, function (err, response) {
                        if (err) {
                            console.log(err);
                            cb(null);
                        } else {
                            console.log('GMaps Place Detail response:' + JSON.stringify(response.json.result));
                            let col = convertToCarouselColumn(response.json.result);
                            console.log('GMaps Place Detail Carousel:' + JSON.stringify(col));
                            carouselMsg.columns.push(col);
                        }
                    });
                }
                */
            }
        });
    }
}

function convertToCarouselColumn(place) {
    let ret =   {
                    thumbnailImageUrl: "https://example.com/bot/images/item1.jpg",
                    imageBackgroundColor: "#FFFFFF",
                    title: place.name,
                    text: place.formatted_phone_number,
                    defaultAction: {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/123'
                    },
                    actions: [
                        {
                            type: "postback",
                            label: "Buy",
                            data: "action=buy&itemid=111"
                        },
                        {
                            type: "postback",
                            label: "Add to cart",
                            data: "action=add&itemid=111"
                        },
                        {
                            type: "uri",
                            label: "View detail",
                            uri: "http://example.com/page/111"
                        }
                    ]
                };
    return ret;
}