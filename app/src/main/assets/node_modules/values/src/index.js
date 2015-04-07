var keys = require("keys");


function objectValues(object, objectKeys) {
    var length = objectKeys.length,
        results = new Array(length),
        i = -1,
        il = length - 1;

    while (i++ < il) {
        results[i] = object[objectKeys[i]];
    }

    return results;
}


function values(object) {
    return objectValues(object, keys(object));
}

values.objectValues = objectValues;


module.exports = values;
