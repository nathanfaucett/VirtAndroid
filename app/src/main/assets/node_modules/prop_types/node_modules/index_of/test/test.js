var assert = require("assert"),
    indexOf = require("../src/index");


describe("indexOf", function() {
    it("should return index of item in array", function() {
        assert.equal(indexOf([0, 1, 2], 1), 1);
        assert.equal(indexOf([0, 1, 2], 3), -1);
        assert.equal(indexOf(null, 3), -1);
    });
});
