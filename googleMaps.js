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
    geoCode: geoCode
};

function init() {
}

/**
 *
 * Geocode an address
 *
 * @param address
 * @param cb
 */
function geoCode(address, cb) {
    console.log('GMaps Geocode:' + address);
    if (address == null) {
        cb(null);
    } else {
        googleMapsClient.geocode({
            address: address,
            language: 'zh-tw'
        }, function (err, response) {
            if (err) {
                console.log(err);
                cb(null);
            } else {
                let r = response.json.results;
                console.log('GMaps Geocode repsonse:' + JSON.stringify(r));
                let text = r[0].geometry.location.lat + ', ' + r[0].geometry.location.lng + '\n';
                text += r[0].formatted_address;

                cb(text);
            }
        });
    }
}