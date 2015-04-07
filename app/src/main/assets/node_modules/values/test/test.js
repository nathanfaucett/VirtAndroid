var assert = require("assert"),
    values = require("../src/index");


describe("values(array, depth)", function() {
    it("should return object's values", function() {
        assert.deepEqual(values({
            0: 0,
            1: 1,
            2: 2
        }), [0, 1, 2]);
    });
});
