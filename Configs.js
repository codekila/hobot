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
        if (cb) cb(r ? r.value : null);
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
        if (err) {
            if (cb) cb(err);
        } else {
            if (r) {
                console.log('config set: ' + r.key + '=' + r.value + ' OK');
                if (cb) cb(null);
            }
            else {
                const obj = new ConfigModel({key: key, value: value});
                obj.save(err => {
                    if (err) {
                        console.log(err.message);
                        if (cb) cb(err);
                    }
                    else {
                        console.log('config add ok:' + key);
                        if (cb) cb(null);
                    }
                });
            }
        }
    });
}