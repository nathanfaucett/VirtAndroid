var assert = require("assert"),
    fastSlice = require("../src/index");


describe("fastSlice", function() {
    it("should copy array with the given offset", function() {
        assert.deepEqual(fastSlice([0, 1, 2, 3], 1), [1, 2, 3]);
    });
});
