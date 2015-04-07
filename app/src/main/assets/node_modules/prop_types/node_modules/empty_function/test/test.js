var assert = require("assert"),
    emptyFunction = require("../src/index");


describe("emptyFunction()", function() {
    it("should return undefined", function() {
        assert.equal(emptyFunction(), undefined);
    });

    describe("#thatReturns(value)", function() {
        it("should return function that returns value", function() {
            var returnsNull = emptyFunction.thatReturns(null);
            assert.equal(returnsNull(), null);
        });
    });

    describe("#thatReturnsFalse()", function() {
        it("should return function that returns false", function() {
            assert.equal(emptyFunction.thatReturnsFalse(), false);
        });
    });

    describe("#thatReturnsTrue()", function() {
        it("should return function that returns true", function() {
            assert.equal(emptyFunction.thatReturnsTrue(), true);
        });
    });

    describe("#thatReturnsNull()", function() {
        it("should return function that returns null", function() {
            assert.equal(emptyFunction.thatReturnsNull(), null);
        });
    });

    describe("#thatReturnsThis()", function() {
        it("should return function that returns this", function() {
            assert.equal(emptyFunction.thatReturnsThis(), emptyFunction);
        });
    });

    describe("#thatReturnsArgument(value)", function() {
        it("should return function that returns argument", function() {
            assert.equal(emptyFunction.thatReturnsArgument(null), null);
        });
    });
});
