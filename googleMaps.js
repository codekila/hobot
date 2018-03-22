/**
 * Created by jamesho on 19/03/2018.
 */

"use strict";

const myGoogleMapsAPIKey = 'AIzaSyCST9EN_cfvQcj8_w200O44zsgTA2ASBuI';

let googleMapsClient = require('@google/maps').createClient({
    key: myGoogleMapsAPIKey
});

const MAX_LINE_CAROUSEL_NUMBER = 10;

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

function sortByRating(a,b) {
    return a.rating - b.rating;
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
                //console.log('GMaps Places response:' + JSON.stringify(response.json.results));

                /*
                 let text = '附近餐廳:';
                 for (let r of response.json.results) {
                 text += '\n' + r.name + '(' + (r.rating ? r.rating:'0.0')  + '): ' + r.vicinity + '\n';
                 }
                 cb(text);
                 */

                response.json.results.sort((a,b) => {
                   return a.rating - b.rating;
                });
                response.json.results.splice(0,MAX_LINE_CAROUSEL_NUMBER+5); // add 5 more to allow some timeout on getting details

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
                let queryTimeout = false;
                //cb(carouselMsg);
                
                setTimeout( () => {
                    console.log('GMaps Place Detail Carousel Msg(' + carouselMsg.template.columns.length + ') Timeout');
                    if (carouselMsg.template.columns.length>0) {
                        queryTimeout = true;
                        carouselMsg.template.columns.sort(sortByRating).splice(0, MAX_LINE_CAROUSEL_NUMBER);
                        cb(carouselMsg);
                    }
                }, 1000);

                async.each(response.json.results,
                    (r, cbMyPlaceDetailDone) => {
                        console.log('GMaps Place Detail request=> ' + r.name);

                        googleMapsClient.place({
                            placeid: r.place_id,
                            language: 'zh-TW'
                        }, (err, response) => {
                            if (err) {
                                i++;
                                console.log('ERROR:' + err);
                                cbMyPlaceDetailDone(err);
                            } else {
                                //console.log('GMaps Place Detail response=> ' + carouselMsg.columns.length + ' --->' + JSON.stringify(response.json.result));
                                let col = convertToCarouselColumn(response.json.result);
                                carouselMsg.template.columns.push(col);
                                //console.log('GMaps Place Detail Carousel=> ' + carouselMsg.template.columns.length + ' --->' + JSON.stringify(col));
                                cbMyPlaceDetailDone(null);
                            }
                        });
                    },
                    err => {
                        if (err)
                            console.error("Error:" + err.message);
                        else {
                            console.log('GMaps Place Detail Carousel Msg(' + carouselMsg.template.columns.length + ') Done');
                            if (queryTimeout == false) {
                                carouselMsg.template.columns.sort(sortByRating).splice(0, MAX_LINE_CAROUSEL_NUMBER);
                                cb(carouselMsg);
                            }
                        }
                    }
                );

            }
        });
    }
}

const querystring = require("querystring");

function convertToCarouselColumn(place) {
    let q = querystring.escape(place.name);
    let title = place.name + (place.rating ? (' (' + place.rating + +'/' + place.reviews.length + ')'):'');
    let text = place.vicinity + (place.formatted_phone_number ? (' (' + place.formatted_phone_number + ')'):'');
    let uri= place.website ? place.website : 'https://www.google.com.tw/search?q=' + q + '&oq=' + q + '&ie=UTF-8';
    let ret = {
        thumbnailImageUrl: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=' + place.photos[0].photo_reference + '&key=' + myGoogleMapsAPIKey,
        imageBackgroundColor: "#FFFFFF",
        title: title,
        text: text,
        defaultAction: {
            type: "uri",
            label: "前往店家網站",
            uri: uri
        },
        actions: []
    };
/*
    if (place.photos.length>0) {
        ret.thumbnailImageUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=' + place.photos[0].photo_reference + '&key=' + myGoogleMapsAPIKey;
        ret.imageBackgroundColor = "#FFFFFF";
    }
*/
    ret.actions.push({
        type: "uri",
        label: "前往店家網站",
        uri: uri
    });

    return ret;
}