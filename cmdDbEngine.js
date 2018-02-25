/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

const methods = require('./cmdMethods.js');

module.exports = {
    processDb: processDb
};

function matchDb(event, userName, queryText, db) {
    let dbItemMatched = null;
    let matchedQuery = null;

    // try to match a query
    for (let dbItem of db) {
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

function matchUser(userId, userDb) {
    for (let user of userDb.users) {
        if (userId == user.userId) {
            return user.nickNames[Math.floor(Math.random() * user.nickNames.length)];
        }
    }
    return null;
}

function processResponse(event, userName, queryText, matchedItem, db) {
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

    console.log('[' + event.source.userId + ']response to do:' + JSON.stringify(responseToDo));

    if (responseToDo) {
        switch (responseToDo.model) {
            case "canned":
                if (responseToDo.texts.length > 0)
                    dbResult = responseToDo.texts[Math.floor(Math.random() * responseToDo.texts.length)];
                    // randomly add the sender's name
                    if (dbResult != null && dbResult != '') {
                        if (Math.random()>0.4) {
                            let name = matchUser(event.source.userId, db.userDb);
                            if (name)
                                dbResult = name + '，' + dbResult;
                        }
                    }
                break;
            case "smart":
                dbResult = methods.execute(responseToDo.method, queryText);
                break;
            default:
                console.log('the response item doesn\'t support \'' + responseToDo.model + '\' model');
        }
    }

    return dbResult;
}

function processDb(event, userName, queryText, cmdDb) {
    let dbResult = null;
    let matchedItem = matchDb(event, userName, queryText, cmdDb.db);

    if (matchedItem) {
        // react to the matched query
        dbResult = processResponse(event, userName, queryText, matchedItem, cmdDb.db);
    }
    
    return dbResult;
}
