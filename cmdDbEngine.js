/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

const methods = require('./cmdMethods.js');
const modUsers = require('./Users.js');

module.exports = {
    processDb: processDb
};

function matchDb(event, userName, queryText, db) {
    let dbItemMatched = null;
    let matchedQuery = null;

    // try to match a query
    for (let dbItem of db.cmdDb.db) {
        let newlyMatchedQuery = null;

        for (let query of dbItem.queries) {
            // match based on models
            for (let text of query.texts) {
                switch (query.model) {
                    case "precise":
                        if (text == queryText)
                            newlyMatchedQuery = query;
                        break;
                    case "fuzzy":
                        if (queryText.includes(text))
                            newlyMatchedQuery = query;
                        break;
                    default:
                        console.log('the query item doesn\'t support \'' + query.model + '\' model');
                        newlyMatchedQuery = null;
                }
                if (newlyMatchedQuery)
                    break;
            }

            //now look at priority
            if (newlyMatchedQuery) {
                if (query.priority == "first") {
                    // overwrtie whatever previously matched and stop matching
                    matchedQuery = newlyMatchedQuery;
                    dbItemMatched = JSON.parse(JSON.stringify(dbItem));
                    break;
                } else if  (query.priority == "default") {
                    // update only when there is nothing matched yet
                    if (matchedQuery == null) {
                        matchedQuery = newlyMatchedQuery;
                        dbItemMatched = JSON.parse(JSON.stringify(dbItem));
                    }
                } else {
                    console.log('the query item doesn\'t support \'' + query.model + '\' priority');
                }
            }
        }
        // stop matching if matched && with first priority
        if (matchedQuery && matchedQuery.priority == "first") {
            console.log('\'first\' matched:' + JSON.stringify(matchedQuery));
            return dbItemMatched;
        }
    }

    if (matchedQuery) {
        console.log('matched:' + JSON.stringify(matchedQuery));
        return dbItemMatched;
    }
    else {
        console.log('no match');
        return null;
    }
}

function processResponse(event, userName, queryText, matchedItem, db, cb) {
    let dbResult = null;
    let responseToDo = null;

    // identify the right response to deal with
    for (let response of matchedItem.responses) {
        if (response.priority == "first" && response.method != null) {
            responseToDo = response;
            break;
        } else if (response.priority == "default") {
            responseToDo = response;
        }
    }

    console.log('response to do:' + JSON.stringify(responseToDo));

    if (responseToDo) {
        switch (responseToDo.model) {
            case "canned":
                if (responseToDo.texts.length > 0)
                    dbResult = responseToDo.texts[Math.floor(Math.random() * responseToDo.texts.length)];
                    // randomly add the sender's name
                    if (dbResult != null && dbResult != '' && dbResult.substr(0,2) != '@@') {
                        if (Math.random()>0.5) {
                            modUsers.find(event.source.userId, user => {
                                if (user)
                                    dbResult = user.nickNames[Math.floor(Math.random() * user.nickNames.length)] + '，' + dbResult;
                                cb(dbResult);
                            });
                        } else
                            cb(dbResult);
                    } else
                        cb(dbResult);
                break;
            case "smart":
                methods.execute(responseToDo.method, event, userName, db, queryText, (res) => {
                    cb(res);
                });
                break;
            default:
                console.log('the response item doesn\'t support \'' + responseToDo.model + '\' model');
                cb(dbResult);
        }
    }
}

function processDb(event, userName, queryText, db, cb) {
    let matchedItem = matchDb(event, userName, queryText, db);

    if (matchedItem) {
        // react to the matched query
        processResponse(event, userName, queryText, matchedItem, db, cb);
    }
}
