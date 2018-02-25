/**
 * Created by jamesho on 25/02/2018.
 */

"use strict";

module.exports = {
    execute: function(method, queryText) {
        console.log('Executing ' + method);
        return method(queryText);
    }
};

const clock = require('world-clock')();

function methodTime(queryText) {
    console.log('YES! SMART!');
    return 'Taiwan:    ' + clock.localTime('Asia/Taipei').toString().substr(0,5) + ', ' + clock.today('Asia/Taipei').toString() + '\n'
        +  'San Diego: ' + clock.localTime('America/Los_Angeles').toString().substr(0,5) + ', ' + clock.today('America/Los_Angeles').toString();
}