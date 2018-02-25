/**
 * Created by jamesho on 25/02/2018.
 */

"use strict";

const clock = require('world-clock')();

module.exports = {
    execute: function(method, queryText) {
        return eval(method)(queryText); // easy and ugly
    }
};

/**
 *
 * @param queryText
 * @returns {string}
 */
function methodTime(queryText) {
    return 'Taiwan:\t' + clock.localTime('Asia/Taipei').toString().substr(0,5) + ', ' + clock.today('Asia/Taipei').toString() + '\n'
        +  'San Diego:\t' + clock.localTime('America/Los_Angeles').toString().substr(0,5) + ', ' + clock.today('America/Los_Angeles').toString();
}