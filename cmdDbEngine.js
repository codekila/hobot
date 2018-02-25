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
    let dbItem;
    let matched = null;
    let newlyMatched = null;

    // try to match a query
    for (dbItem in db) {
        for (let query in dbItem.queries) {
            // match based on models
            console.log(JSON.stringify(query));
            for (let text in query.texts) {
                switch (query.model) {
                    case "precise":
                        if (text == queryText)
                            newlyMatched = query;
                        break;
                    case "fuzzy":
                        if (text.includes(queryText))
                            newlyMatched = query;
                        break;
                    default:
                        console.log('the query item doesn\'t support \'' + query.model + '\' model');
                        newlyMatched = null;
                }
                if (newlyMatched)
                    break;
            }

            //now look at priority
            if (newlyMatched) {
                if (query.priority == "first") {
                    // overwrtie whatever previously matched and stop matching
                    matched = newlyMatched;
                    break;
                } else if  (query.priority == "default") {
                    // update only when there is nothing matched yet
                    if (matched == null)
                        matched = newlyMatched;
                } else {
                    console.log('the query item doesn\'t support \'' + query.model + '\' priority');
                }
            }
        }
        // stop matching if matched && with first priority
        if (matched && query.priority == "first") {
            console.log('\'first\' matched:' + JSON.stringify(matched));
            return dbItem;
        }
    }

    if (matched) {
        console.log('matched:' + JSON.stringify(matched));
        return dbItem;
    }
    else {
        console.log('not matched');
        return null;
    }
}

function processResponse(matchedItem) {
    let dbResult = null;
    let response;

    // identify the right response to deal with
    for (response in matchedItem.responses) {
        if (response.priority == "first") {
            break;
        }
    }

    if (response) {
        switch (response.model) {
            case "canned":
                if (response.texts.size > 0)
                    dbResult = response.texts[Math.floor(Math.random() * response.texts.size)];
                break;
            case "smart":
                    dbResult = 'I can\'t do this in a smart way yet';
                break;
            default:
                console.log('the response item doesn\'t support \'' + response.model + '\' model');
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
