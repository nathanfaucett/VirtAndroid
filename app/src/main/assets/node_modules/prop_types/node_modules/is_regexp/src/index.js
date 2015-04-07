var isObjectLike = require("is_object_like");


var objectRegExpStr = "[object RegExp]",
    objectToString = Object.prototype.toString;


module.exports = function isRegExp(obj) {
    return (isObjectLike(obj) && objectToString.call(obj) === objectRegExpStr) || false;
};
