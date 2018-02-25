/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

module.exports = {
    processDb: processDb
};

let responseMatchingPriorities = {
    "default": responseMatchingPriorityDefault,
    "first": responseMatchingPriorityFirst
};

let responseMatchingModels = {
    "smart": responseMatchingModelSmart,
    "canned": responseMatchingModelCanned
};

function responseMatchingPriorityDefault() {

}

function responseMatchingPriorityFirst() {

}

function responseMatchingModelSmart() {

}

function responseMatchingModelCanned() {

}

function matchDb(queryText, db) {
    let dbItemMatched = null;
    let matchedQuery = null;
    let newlyMatchedQuery = null;

    // try to match a query
    for (let dbItem of db) {
        for (let query of dbItem.queries) {
            // match based on models
            for (let text of query.texts) {
                switch (query.model) {
                    case "precise":
                        if (text == queryText)
                            newlyMatchedQuery = query;
                        break;
                    case "fuzzy":
                        if (text.includes(queryText))
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
                    dbItemMatched = dbItem;
                    break;
                } else if  (query.priority == "default") {
                    // update only when there is nothing matched yet
                    if (matchedQuery == null) {
                        matchedQuery = newlyMatchedQuery;
                        dbItemMatched = dbItem;
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
        console.log('not matched');
        return null;
    }
}

function processResponse(matchedItem) {
    let dbResult = null;
    let responseToDo = null;

    console.log('responses to look for:' + JSON.stringify(matchedItem.responses));

    // identify the right response to deal with
    for (let response of matchedItem.responses) {
        if (response.priority == "first" && response.method != null) {
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
                break;
            case "smart":
                    dbResult = 'I can\'t do this in a smart way yet';
                break;
            default:
                console.log('the response item doesn\'t support \'' + responseToDo.model + '\' model');
        }
    }

    return dbResult;
}

function processDb(queryText, cmdDb) {
    let dbResult = null;
    let matchedItem = matchDb(queryText, cmdDb.db);

    if (matchedItem) {

        // react to the matched query
        dbResult = processResponse(matchedItem);
    }
    
    return dbResult;
}
