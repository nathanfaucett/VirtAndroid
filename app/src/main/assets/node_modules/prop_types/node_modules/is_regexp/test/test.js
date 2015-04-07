var assert = require("assert"),
    isRegExp = require("../src/index");


describe("isRegExp", function() {
    it("should return true when the value is a RegExp", function() {
        assert.equal(isRegExp(null), false);
        assert.equal(isRegExp([]), false);
        assert.equal(isRegExp({}), false);
        assert.equal(isRegExp(/./), true);
    });
});
