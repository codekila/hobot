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
function places(location, cb) {
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
                cb(null);
            } else {
                console.log('GMaps Places response:' + JSON.stringify(response.json.results));

                /*
                 let text = '附近餐廳:';
                 for (let r of response.json.results) {
                 text += '\n' + r.name + '(' + (r.rating ? r.rating:'0.0')  + '): ' + r.vicinity + '\n';
                 }
                 cb(text);
                 */

                // get detail of each place

                let confirmMsg = {
                    type: 'template',
                    altText: 'this is a carousel template',
                    template: {
                        type: "confirm",
                        text: "Are you sure?",
                        actions: [
                            {
                                type: "message",
                                label: "Yes",
                                text: "yes"
                            },
                            {
                                type: "message",
                                label: "No",
                                text: "no"
                            }
                        ]
                    }
                };

                let carouselMsg = {
                    type: 'template',
                    altText: '何寶推薦選擇',
                    template: {
                        type: "carousel",
                        columns: []
                    }
                };
                //cb(carouselMsg);

                let i = 0;
                async.each(response.json.results,
                    (r, cbMyPlaceDetailDone) => {
                        console.log('GMaps Place Detail request=> ' + r.name);

                        googleMapsClient.place({
                            placeid: r.place_id,
                            language: 'zh-TW'
                        }, (err, response) => {
                            if (err) {
                                console.log(err);
                                cbMyPlaceDetailDone(err);
                            } else {
                                //console.log('GMaps Place Detail response: ' + JSON.stringify(response.json.result));
                                if (response.json.result.website && response.json.result.website.length > 0 && i++<10) {
                                    let col = convertToCarouselColumn(response.json.result);
                                    //console.log('GMaps Place Detail Carousel=> ' + JSON.stringify(col));
                                    carouselMsg.template.columns.push(col);
                                }
                                cbMyPlaceDetailDone(null);
                            }
                        });
                    },
                    err => {
                        if (err)
                            console.error("Error:" + err.message);
                        else {
                            console.log('GMaps Place Detail Carousel Msg:' + JSON.stringify(carouselMsg));
                            cb(carouselMsg);
                        }
                    }
                );

            }
        });
    }
}

const querystring = require("querystring");

function convertToCarouselColumn(place) {
    let ret = {
        thumbnailImageUrl: "https://hobot86.herokuapp.com/static/images/store/sky/preview.jpg",
        imageBackgroundColor: "#FFFFFF",
        title: place.name ? place.name : '',
        text: place.formatted_phone_number ? place.formatted_phone_number : '無電話',
        actions: []
    };

    let q = querystring.escape(place.name);

    ret.actions.push({
        type: "uri",
        label: "店家網站",
        uri: place.website ? place.website : 'https://www.google.com.tw/search?q='+ q +'&oq=' + q +'&ie=UTF-8'
    });

    return ret;
}