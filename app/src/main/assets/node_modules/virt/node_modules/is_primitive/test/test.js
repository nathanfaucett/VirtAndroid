var assert = require("assert"),
    isPrimitive = require("../src/index");


describe("isPrimitive", function() {
    it("should return true when the value is a primitive", function() {
        assert.equal(isPrimitive({}), false);
        assert.equal(isPrimitive([]), false);
        assert.equal(isPrimitive(/./), false);
        assert.equal(isPrimitive(function noop() {}), false);
        assert.equal(isPrimitive(""), true);
        assert.equal(isPrimitive(0), true);
        assert.equal(isPrimitive(undefined), true);
        assert.equal(isPrimitive(null), true);
    });
});
