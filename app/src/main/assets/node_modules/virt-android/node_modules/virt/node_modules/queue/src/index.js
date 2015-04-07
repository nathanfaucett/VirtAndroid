var createPool = require("create_pool");


module.exports = Queue;


function Queue() {
    this.__callbacks = [];
}

createPool(Queue);

Queue.prototype.enqueue = function(callback) {
    var callbacks = this.__callbacks;
    callbacks[callbacks.length] = callback;
    return this;
};

Queue.prototype.notifyAll = function() {
    var callbacks = this.__callbacks,
        i = -1,
        il = callbacks.length - 1;

    while (i++ < il) {
        callbacks[i]();
    }
    callbacks.length = 0;

    return this;
};

Queue.prototype.destructor = function() {
    this.__callbacks.length = 0;
    return this;
};

Queue.prototype.reset = Queue.prototype.destructor;
