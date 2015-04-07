var assert = require("assert"),
    Queue = require("../src/index");


describe("Queue", function() {
    it("should enqueue callbacks and call all in order when notifyAll() is called", function() {
        var queue = Queue.getPooled(),
            called0 = false,
            called1 = false;

        queue.enqueue(function() {
            called0 = true;
        });

        queue.enqueue(function() {
            called1 = true;
        });

        queue.notifyAll();

        assert(called0 === true);
        assert(called1 === true);
    });
});
