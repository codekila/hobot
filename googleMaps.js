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
                        }
                    });
                }
            }
        });
    }
}
