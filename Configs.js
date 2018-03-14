/**
 * Created by jamesho on 14/03/2018.
 */

'use strict';

let mongoose = null;
let ConfigSchema = null;
let ConfigModel = null;

module.exports = {
    init: init,
    get: get,
    set: set
};

function init(db) {
    mongoose = db;
    ConfigSchema = new mongoose.Schema({
        key: {
            type: String,
            index: true,
            required: true,
            unique: true
        },
        value: String
    });
    ConfigModel = mongoose.model('Configs', ConfigSchema);
}

function get(key, cb) {
    ConfigModel.findOne({key: key}, (err, r) => {
        if (cb) cb(r.value);
    });
}

/**
 *
 * @param key
 * @param value
 * @param cb --> null if update success, err otherwise
 */
function set(key, value, cb) {
    ConfigModel.findOneAndUpdate({key: key}, {vale: value}, (err, r) => {
        if (err == null) {
            console.log('updating: ' + r.key + '=' + r.value + ' OK');
            cb(null);
        } else {
            console.log('updating: ' + key + 'Failed, err:' + err.message);
            const obj = new ConfigModel({key: key, value: value});
            obj.save(err => {
                if (err) {
                    console.log(err.message);
                    cb(err);
                }
                else {
                    console.log('set insert ok:' + key);
                    cb(null);
                }
            });
        }
    });
}