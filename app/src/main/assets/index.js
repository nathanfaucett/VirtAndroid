(function(dependencies, global) {
    var cache = [];

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];
            exports = {};

            cache[index] = module = {
                exports: exports,
                require: require
            };

            callback.call(exports, require, exports, module, global);
            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {

        require(0);

    }
}([
    function(require, exports, module, global) {

        var virt = require(1),
            virtAndroid = require(57),
            WS = require(69),
            App = require(70);


        var socket = virtAndroid.socket = new WS("ws://127.0.0.1:8080");

        socket.onopen = function onOpen() {
            virtAndroid.render(virt.createView(App));
        };


    },
    function(require, exports, module, global) {

        var View = require(2);


        var virt = exports;


        virt.Root = require(21);

        virt.Component = require(46);

        virt.View = View;
        virt.createView = View.create;
        virt.createFactory = View.createFactory;

        virt.registerNativeComponent = require(56);
        virt.context = require(20);
        virt.owner = require(19);


    },
    function(require, exports, module, global) {

        var isPrimitive = require(3),
            isFunction = require(5),
            isArray = require(6),
            isString = require(9),
            isObjectLike = require(8),
            isNullOrUndefined = require(4),
            isNumber = require(10),
            fastSlice = require(11),
            has = require(12),
            map = require(13),
            owner = require(19),
            context = require(20);


        var ViewPrototype;


        module.exports = View;


        function View(type, key, ref, props, children, owner, context) {
            this.__owner = owner;
            this.__context = context;
            this.type = type;
            this.key = key;
            this.ref = ref;
            this.props = props;
            this.children = children;
        }

        ViewPrototype = View.prototype;

        ViewPrototype.__View__ = true;

        ViewPrototype.copy = function(view) {
            this.__owner = view.__owner;
            this.__context = view.__context;
            this.type = view.type;
            this.key = view.key;
            this.ref = view.ref;
            this.props = view.props;
            this.children = view.children;
            return this;
        };

        ViewPrototype.clone = function() {
            return new View(this.type, this.key, this.ref, this.props, this.children, this.__owner, this.__context);
        };

        ViewPrototype.toJSON = function() {
            return toJSON(this);
        };

        View.isView = isView;
        View.isPrimativeView = isPrimativeView;
        View.isViewComponent = isViewComponent;
        View.isViewJSON = isViewJSON;

        View.create = function(type, config, children) {
            var isConfigArray = isArray(config),
                argumentsLength = arguments.length;

            if (isChild(config) || isConfigArray) {
                if (isConfigArray) {
                    children = config;
                } else if (argumentsLength > 1) {
                    children = fastSlice(arguments, 1);
                }
                config = null;
            } else {
                if (!isArray(children) && argumentsLength > 2) {
                    children = fastSlice(arguments, 2);
                }
            }

            return construct(type, config, children);
        };

        View.createFactory = function(type) {
            return function factory(config, children) {
                var isConfigArray = isArray(config),
                    argumentsLength = arguments.length;

                if (isChild(config) || isConfigArray) {
                    if (isConfigArray) {
                        children = config;
                    } else if (argumentsLength > 0) {
                        children = fastSlice(arguments);
                    }
                    config = null;
                } else {
                    if (!isArray(children) && argumentsLength > 1) {
                        children = fastSlice(arguments, 1);
                    }
                }

                return construct(type, config, children);
            };
        };

        function construct(type, config, children) {
            var props = {},
                key = null,
                ref = null,
                propName, defaultProps;

            if (config) {
                key = config.key != null ? config.key : null;
                ref = config.ref != null ? config.ref : null;

                for (propName in config) {
                    if (has(config, propName)) {
                        if (!(propName === "key" || propName === "ref")) {
                            props[propName] = config[propName];
                        }
                    }
                }
            }

            if (type && type.defaultProps) {
                defaultProps = type.defaultProps;

                for (propName in defaultProps) {
                    if (isNullOrUndefined(props[propName])) {
                        props[propName] = defaultProps[propName];
                    }
                }
            }

            return new View(type, key, ref, props, insureValidChildren(children), owner.current, context.current);
        }

        function propsToJSON(props) {
            var out = {},
                key, value;

            for (key in props) {
                if (!isFunction((value = props[key]))) {
                    out[key] = value;
                }
            }

            return out;
        }

        function toJSON(view) {
            if (isPrimitive(view)) {
                return view;
            } else {
                return {
                    type: view.type,
                    key: view.key,
                    ref: view.ref,
                    props: propsToJSON(view.props),
                    children: map(view.children, toJSON)
                };
            }
        }

        function isView(obj) {
            return isObjectLike(obj) && obj.__View__ === true;
        }

        function isViewComponent(obj) {
            return isView(obj) && isFunction(obj.type);
        }

        function isViewJSON(obj) {
            return (
                isObjectLike(obj) &&
                isString(obj.type) &&
                isObjectLike(obj.props) &&
                isArray(obj.children)
            );
        }

        function isPrimativeView(object) {
            return isString(object) || isNumber(object);
        }

        function isChild(object) {
            return isView(object) || isPrimativeView(object);
        }

        function insureValidChildren(children) {
            var i, il, child;

            if (isArray(children)) {
                i = -1;
                il = children.length - 1;

                while (i++ < il) {
                    child = children[i];

                    if (isView(child)) {
                        continue;
                    } else if (isPrimativeView(child)) {
                        children[i] = child;
                    } else {
                        throw new TypeError("child of a View must be a String, Number or a View");
                    }
                }
            } else {
                children = [];
            }

            return children;
        }


    },
    function(require, exports, module, global) {

        var isNullOrUndefined = require(4);


        module.exports = function isPrimitive(obj) {
            var typeStr;
            return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
        };


    },
    function(require, exports, module, global) {

        module.exports = function isNullOrUndefined(obj) {
            return obj === null || obj === void 0;
        };


    },
    function(require, exports, module, global) {

        var objectFunction = "[object Function]",
            toString = Object.prototype.toString,
            isFunction;


        if (typeof(/./) === "function" || (typeof(Uint8Array) !== "undefined" && typeof(Uint8Array) !== "function")) {
            isFunction = function isFunction(obj) {
                return toString.call(obj) === objectFunction;
            };
        } else {
            isFunction = function isFunction(obj) {
                return typeof(obj) === "function" || false;
            };
        }


        module.exports = isFunction;


    },
    function(require, exports, module, global) {

        var isLength = require(7),
            isObjectLike = require(8);


        var objectArray = "[object Array]",
            toString = Object.prototype.toString;


        module.exports = Array.isArray || function isArray(obj) {
            return isObjectLike(obj) && isLength(obj.length) && toString.call(obj) === objectArray;
        };


    },
    function(require, exports, module, global) {

        var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


        module.exports = function isLength(obj) {
            return typeof(obj) === "number" && obj > -1 && obj % 1 === 0 && obj <= MAX_SAFE_INTEGER;
        };


    },
    function(require, exports, module, global) {

        module.exports = function isObjectLike(obj) {
            return (obj && typeof(obj) === "object") || false;
        };


    },
    function(require, exports, module, global) {

        module.exports = function isString(obj) {
            return typeof(obj) === "string" || false;
        };


    },
    function(require, exports, module, global) {

        module.exports = function isNumber(obj) {
            return typeof(obj) === "number" || false;
        };


    },
    function(require, exports, module, global) {

        module.exports = function fastSlice(array, offset) {
            var length, i, il, result, j;

            offset = offset || 0;

            length = array.length;
            i = offset - 1;
            il = length - 1;
            result = new Array(length - offset);
            j = 0;

            while (i++ < il) {
                result[j++] = array[i];
            }

            return result;
        };


    },
    function(require, exports, module, global) {

        var hasOwnProp = Object.prototype.hasOwnProperty;


        module.exports = function has(obj, key) {
            return hasOwnProp.call(obj, key);
        };


    },
    function(require, exports, module, global) {

        var keys = require(14),
            isNullOrUndefined = require(4),
            fastBindThis = require(17),
            isArrayLike = require(18);


        function mapArray(array, callback) {
            var length = array.length,
                i = -1,
                il = length - 1,
                result = new Array(length);

            while (i++ < il) {
                result[i] = callback(array[i], i);
            }

            return result;
        }

        function mapObject(object, callback) {
            var objectKeys = keys(object),
                i = -1,
                il = objectKeys.length - 1,
                result = {},
                key;

            while (i++ < il) {
                key = objectKeys[i];
                result[key] = callback(object[key], key);
            }

            return result;
        }

        module.exports = function map(object, callback, thisArg) {
            callback = isNullOrUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 2);
            return isArrayLike(object) ? mapArray(object, callback) : mapObject(object, callback);
        };


    },
    function(require, exports, module, global) {

        var has = require(12),
            isNative = require(15),
            isObject = require(16);


        var nativeKeys = Object.keys;


        if (!isNative(nativeKeys)) {
            nativeKeys = function keys(obj) {
                var localHas = has,
                    out = [],
                    i = 0,
                    key;

                for (key in obj) {
                    if (localHas(obj, key)) {
                        out[i++] = key;
                    }
                }

                return out;
            };
        }

        module.exports = function keys(obj) {
            return nativeKeys(isObject(obj) ? obj : Object(obj));
        };


    },
    function(require, exports, module, global) {

        var isFunction = require(5);


        var reHostCtor = /^\[object .+?Constructor\]$/,

            functionToString = Function.prototype.toString,

            reNative = RegExp("^" +
                functionToString.call(toString)
                .replace(/[.*+?^${}()|[\]\/\\]/g, "\\$&")
                .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
            ),

            isHostObject = (function() {
                try {
                    String({
                        "toString": 0
                    } + "");
                } catch (e) {
                    return function isHostObject() {
                        return false;
                    };
                }

                return function isHostObject(value) {
                    return !isFunction(value.toString) && typeof(value + "") === "string";
                };
            }());


        module.exports = function isNative(obj) {
            return obj && (
                isFunction(obj) ?
                reNative.test(functionToString.call(obj)) : (
                    typeof(obj) === "object" && (
                        (isHostObject(obj) ? reNative : reHostCtor).test(obj) || false
                    )
                )
            ) || false;
        };


    },
    function(require, exports, module, global) {

        module.exports = function isObject(obj) {
            var type = typeof(obj);
            return type === "function" || (obj && type === "object") || false;
        };


    },
    function(require, exports, module, global) {

        module.exports = function fastBindThis(callback, thisArg, length) {
            switch (length || callback.length) {
                case 0:
                    return function bound() {
                        return callback.call(thisArg);
                    };
                case 1:
                    return function bound(a1) {
                        return callback.call(thisArg, a1);
                    };
                case 2:
                    return function bound(a1, a2) {
                        return callback.call(thisArg, a1, a2);
                    };
                case 3:
                    return function bound(a1, a2, a3) {
                        return callback.call(thisArg, a1, a2, a3);
                    };
                case 4:
                    return function bound(a1, a2, a3, a4) {
                        return callback.call(thisArg, a1, a2, a3, a4);
                    };
                default:
                    return function bound() {
                        return callback.apply(thisArg, arguments);
                    };
            }
        };


    },
    function(require, exports, module, global) {

        var isLength = require(7),
            isObjectLike = require(8);


        module.exports = function isArrayLike(obj) {
            return isObjectLike(obj) && isLength(obj.length);
        };


    },
    function(require, exports, module, global) {

        var owner = exports;


        owner.current = null;


    },
    function(require, exports, module, global) {

        var context = exports;


        context.current = null;


    },
    function(require, exports, module, global) {

        var Transaction = require(22),
            shouldUpdate = require(36),
            EventManager = require(37),
            Node = require(38);


        var RootPrototype,
            ROOT_ID = 0;


        module.exports = Root;


        function Root() {

            this.id = "." + (ROOT_ID++).toString(36);
            this.childHash = {};

            this.eventManager = new EventManager();

            this.adaptor = null;

            this.__transactions = [];
            this.__currentTransaction = null;
        }

        RootPrototype = Root.prototype;

        RootPrototype.appendNode = function(node) {
            var id = node.id,
                childHash = this.childHash;

            if (childHash[id] === undefined) {
                node.root = this;
                childHash[id] = node;
            } else {
                throw new Error("Root appendNode(node) trying to override node at " + id);
            }
        };

        RootPrototype.removeNode = function(node) {
            var id = node.id,
                childHash = this.childHash;

            if (childHash[id] !== undefined) {
                node.root = null;
                delete childHash[id];
            } else {
                throw new Error("Root removeNode(node) trying to remove node that does not exists with id " + id);
            }
        };

        RootPrototype.__processTransaction = function() {
            var _this = this,
                transactions = this.__transactions,
                transaction;

            if (this.__currentTransaction === null && transactions.length !== 0) {
                this.__currentTransaction = transaction = transactions[0];

                this.adaptor.handle(transaction, function onHandle() {
                    transactions.splice(0, 1);

                    transaction.queue.notifyAll();
                    transaction.destroy();

                    _this.__currentTransaction = null;

                    if (transactions.length !== 0) {
                        _this.__processTransaction();
                    }
                });
            }
        };

        RootPrototype.__enqueueTransaction = function(transaction) {
            var transactions = this.__transactions;
            transactions[transactions.length] = transaction;
        };

        RootPrototype.unmount = function() {
            var node = this.childHash[this.id],
                transaction;

            if (node) {
                transaction = Transaction.create();

                transaction.unmount(this.id);
                node.__unmount(transaction);

                this.__enqueueTransaction(transaction);
                this.__processTransaction();
            }
        };

        RootPrototype.update = function(node) {
            var transaction = Transaction.create();

            node.update(node.currentView, transaction);

            this.__enqueueTransaction(transaction);
            this.__processTransaction();
        };

        RootPrototype.render = function(nextView, id) {
            var transaction = Transaction.create(),
                node;

            id = id || this.id;
            node = this.childHash[id];

            if (node) {
                if (shouldUpdate(node.currentView, nextView)) {

                    node.update(nextView, transaction);
                    this.__enqueueTransaction(transaction);
                    this.__processTransaction();

                    return;
                } else {
                    if (this.id === id) {
                        node.__unmount(transaction);
                        transaction.unmount(id);
                    } else {
                        node.unmount(transaction);
                    }
                }
            }

            node = new Node(this.id, id, nextView);
            this.appendNode(node);
            node.mount(transaction);

            this.__enqueueTransaction(transaction);
            this.__processTransaction();
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            Queue = require(25),
            consts = require(26),
            InsertPatch = require(28),
            MountPatch = require(29),
            UnmountPatch = require(30),
            OrderPatch = require(31),
            PropsPatch = require(32),
            RemovePatch = require(33),
            ReplacePatch = require(34),
            TextPatch = require(35);


        module.exports = Transaction;


        function Transaction() {

            this.queue = Queue.getPooled();

            this.removes = {};
            this.patches = {};

            this.events = {};
            this.eventsRemove = {};
        }
        createPool(Transaction);
        Transaction.consts = consts;

        Transaction.create = function() {
            return Transaction.getPooled();
        };

        Transaction.prototype.destroy = function() {
            Transaction.release(this);
        };

        function clearPatches(hash) {
            var id, array, j, jl;

            for (id in hash) {
                if ((array = hash[id]) !== undefined) {
                    j = -1;
                    jl = array.length - 1;

                    while (j++ < jl) {
                        array[j].destroy();
                    }

                    delete hash[id];
                }
            }
        }

        function clearHash(hash) {
            for (var id in hash) {
                if (hash[id] !== undefined) {
                    delete hash[id];
                }
            }
        }

        Transaction.prototype.destructor = function() {
            clearPatches(this.patches);
            clearPatches(this.removes);
            clearHash(this.events);
            clearHash(this.eventsRemove);
            return this;
        };

        Transaction.prototype.mount = function(id, next) {
            this.append(MountPatch.create(id, next));
        };

        Transaction.prototype.unmount = function(id) {
            this.append(UnmountPatch.create(id));
        };

        Transaction.prototype.insert = function(id, childId, index, next) {
            this.append(InsertPatch.create(id, childId, index, next));
        };

        Transaction.prototype.order = function(id, order) {
            this.append(OrderPatch.create(id, order));
        };

        Transaction.prototype.props = function(id, previous, props) {
            this.append(PropsPatch.create(id, previous, props));
        };

        Transaction.prototype.replace = function(id, childId, index, next) {
            this.append(ReplacePatch.create(id, childId, index, next));
        };

        Transaction.prototype.text = function(id, index, next) {
            this.append(TextPatch.create(id, index, next));
        };

        Transaction.prototype.remove = function(id, childId, index) {
            this.appendRemove(RemovePatch.create(id, childId, index));
        };

        Transaction.prototype.event = function(id, type) {
            this.events[id] = type;
        };

        Transaction.prototype.removeEvent = function(id, type) {
            this.eventsRemove[id] = type;
        };

        function append(hash, value) {
            var id = value.id,
                patchArray = hash[id] || (hash[id] = []);

            patchArray[patchArray.length] = value;
        }

        Transaction.prototype.append = function(value) {
            append(this.patches, value);
        };

        Transaction.prototype.appendRemove = function(value) {
            append(this.removes, value);
        };

        Transaction.prototype.toJSON = function() {
            return {
                removes: this.removes,
                patches: this.patches,

                events: this.events,
                eventsRemove: this.eventsRemove
            };
        };


    },
    function(require, exports, module, global) {

        var isFunction = require(5),
            isNumber = require(10),
            defineProperty = require(24);


        var descriptor = {
            configurable: false,
            enumerable: false,
            writable: false,
            value: null
        };

        function addProperty(object, name, value) {
            descriptor.value = value;
            defineProperty(object, name, descriptor);
            descriptor.value = null;
        }

        function createPooler(Constructor) {
            switch (Constructor.length) {
                case 0:
                    return createNoArgumentPooler(Constructor);
                case 1:
                    return createOneArgumentPooler(Constructor);
                case 2:
                    return createTwoArgumentsPooler(Constructor);
                case 3:
                    return createThreeArgumentsPooler(Constructor);
                case 4:
                    return createFourArgumentsPooler(Constructor);
                case 5:
                    return createFiveArgumentsPooler(Constructor);
                default:
                    return createApplyPooler(Constructor);
            }
        }

        function createNoArgumentPooler(Constructor) {
            return function pooler() {
                var instancePool = Constructor.instancePool,
                    instance;

                if (instancePool.length) {
                    instance = instancePool.pop();
                    return instance;
                } else {
                    return new Constructor();
                }
            };
        }

        function createOneArgumentPooler(Constructor) {
            return function pooler(a0) {
                var instancePool = Constructor.instancePool,
                    instance;

                if (instancePool.length) {
                    instance = instancePool.pop();
                    Constructor.call(instance, a0);
                    return instance;
                } else {
                    return new Constructor(a0);
                }
            };
        }

        function createTwoArgumentsPooler(Constructor) {
            return function pooler(a0, a1) {
                var instancePool = Constructor.instancePool,
                    instance;

                if (instancePool.length) {
                    instance = instancePool.pop();
                    Constructor.call(instance, a0, a1);
                    return instance;
                } else {
                    return new Constructor(a0, a1);
                }
            };
        }

        function createThreeArgumentsPooler(Constructor) {
            return function pooler(a0, a1, a2) {
                var instancePool = Constructor.instancePool,
                    instance;

                if (instancePool.length) {
                    instance = instancePool.pop();
                    Constructor.call(instance, a0, a1, a2);
                    return instance;
                } else {
                    return new Constructor(a0, a1, a2);
                }
            };
        }

        function createFourArgumentsPooler(Constructor) {
            return function pooler(a0, a1, a2, a3) {
                var instancePool = Constructor.instancePool,
                    instance;

                if (instancePool.length) {
                    instance = instancePool.pop();
                    Constructor.call(instance, a0, a1, a2, a3);
                    return instance;
                } else {
                    return new Constructor(a0, a1, a2, a3);
                }
            };
        }

        function createFiveArgumentsPooler(Constructor) {
            return function pooler(a0, a1, a2, a3, a4) {
                var instancePool = Constructor.instancePool,
                    instance;

                if (instancePool.length) {
                    instance = instancePool.pop();
                    Constructor.call(instance, a0, a1, a2, a3, a4);
                    return instance;
                } else {
                    return new Constructor(a0, a1, a2, a3, a4);
                }
            };
        }

        function createApplyConstructor(Constructor) {
            function F(args) {
                return Constructor.apply(this, args);
            }
            F.prototype = Constructor.prototype;

            return function applyConstructor(args) {
                return new F(args);
            };
        }

        function createApplyPooler(Constructor) {
            var applyConstructor = createApplyConstructor(Constructor);

            return function pooler() {
                var instancePool = Constructor.instancePool,
                    instance;

                if (instancePool.length) {
                    instance = instancePool.pop();
                    Constructor.apply(instance, arguments);
                    return instance;
                } else {
                    return applyConstructor(arguments);
                }
            };
        }

        function createReleaser(Constructor) {
            return function releaser(instance) {
                var instancePool = Constructor.instancePool;

                if (isFunction(instance.destructor)) {
                    instance.destructor();
                }
                if (Constructor.poolSize === -1 || instancePool.length < Constructor.poolSize) {
                    instancePool[instancePool.length] = instance;
                }
            };
        }

        module.exports = function createPool(Constructor, poolSize) {
            addProperty(Constructor, "instancePool", []);
            addProperty(Constructor, "getPooled", createPooler(Constructor));
            addProperty(Constructor, "release", createReleaser(Constructor));

            if (!Constructor.poolSize) {
                Constructor.poolSize = isNumber(poolSize) ? (poolSize < -1 ? -1 : poolSize) : -1;
            }

            return Constructor;
        };


    },
    function(require, exports, module, global) {

        var isFunction = require(5),
            isObjectLike = require(8),
            isNative = require(15);


        var defineProperty;


        if (!isNative(Object.defineProperty)) {
            defineProperty = function defineProperty(object, name, value) {
                if (!isObjectLike(object)) {
                    throw new TypeError("defineProperty called on non-object");
                }
                object[name] = isObjectLike(value) ? (isFunction(value.get) ? value.get : value.value) : value;
            };
        } else {
            defineProperty = Object.defineProperty;
        }

        module.exports = defineProperty;


    },
    function(require, exports, module, global) {

        var createPool = require(23);


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


    },
    function(require, exports, module, global) {

        var keyMirror = require(27);


        module.exports = keyMirror([
            "TEXT",
            "REPLACE",
            "PROPS",
            "ORDER",
            "INSERT",
            "REMOVE",
            "MOUNT",
            "UNMOUNT"
        ]);


    },
    function(require, exports, module, global) {

        var keys = require(14),
            isArrayLike = require(18);


        function keyMirrorArray(array) {
            var i = array.length,
                results = {},
                key;

            while (i--) {
                key = array[i];
                results[key] = array[i];
            }

            return results;
        }

        function keyMirrorObject(object) {
            var objectKeys = keys(object),
                i = -1,
                il = objectKeys.length - 1,
                results = {},
                key;

            while (i++ < il) {
                key = objectKeys[i];
                results[key] = key;
            }

            return results;
        }

        module.exports = function keyMirror(object) {
            return isArrayLike(object) ? keyMirrorArray(object) : keyMirrorObject(Object(object));
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = InsertPatch;


        function InsertPatch() {
            this.type = consts.INSERT;
            this.id = null;
            this.childId = null;
            this.index = null;
            this.next = null;
        }
        createPool(InsertPatch);

        InsertPatch.create = function(id, childId, index, next) {
            var patch = InsertPatch.getPooled();
            patch.id = id;
            patch.childId = childId;
            patch.index = index;
            patch.next = next;
            return patch;
        };

        InsertPatch.prototype.destructor = function() {
            this.id = null;
            this.childId = null;
            this.index = null;
            this.next = null;
            return this;
        };

        InsertPatch.prototype.destroy = function() {
            return InsertPatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = MountPatch;


        function MountPatch() {
            this.type = consts.MOUNT;
            this.id = null;
            this.next = null;
        }
        createPool(MountPatch);

        MountPatch.create = function(id, next) {
            var patch = MountPatch.getPooled();
            patch.id = id;
            patch.next = next;
            return patch;
        };

        MountPatch.prototype.destructor = function() {
            this.id = null;
            this.next = null;
            return this;
        };

        MountPatch.prototype.destroy = function() {
            return MountPatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = UnmountPatch;


        function UnmountPatch() {
            this.type = consts.UNMOUNT;
            this.id = null;
        }
        createPool(UnmountPatch);

        UnmountPatch.create = function(id) {
            var patch = UnmountPatch.getPooled();
            patch.id = id;
            return patch;
        };

        UnmountPatch.prototype.destructor = function() {
            this.id = null;
            return this;
        };

        UnmountPatch.prototype.destroy = function() {
            return UnmountPatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = OrderPatch;


        function OrderPatch() {
            this.type = consts.ORDER;
            this.id = null;
            this.order = null;
        }
        createPool(OrderPatch);

        OrderPatch.create = function(id, order) {
            var patch = OrderPatch.getPooled();
            patch.id = id;
            patch.order = order;
            return patch;
        };

        OrderPatch.prototype.destructor = function() {
            this.id = null;
            this.order = null;
            return this;
        };

        OrderPatch.prototype.destroy = function() {
            return OrderPatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = PropsPatch;


        function PropsPatch() {
            this.type = consts.PROPS;
            this.id = null;
            this.previous = null;
            this.next = null;
        }
        createPool(PropsPatch);

        PropsPatch.create = function(id, previous, next) {
            var patch = PropsPatch.getPooled();
            patch.id = id;
            patch.previous = previous;
            patch.next = next;
            return patch;
        };

        PropsPatch.prototype.destructor = function() {
            this.id = null;
            this.previous = null;
            this.next = null;
            return this;
        };

        PropsPatch.prototype.destroy = function() {
            return PropsPatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = RemovePatch;


        function RemovePatch() {
            this.type = consts.REMOVE;
            this.id = null;
            this.childId = null;
            this.index = null;
        }
        createPool(RemovePatch);

        RemovePatch.create = function(id, childId, index) {
            var patch = RemovePatch.getPooled();
            patch.id = id;
            patch.childId = childId;
            patch.index = index;
            return patch;
        };

        RemovePatch.prototype.destructor = function() {
            this.id = null;
            this.childId = null;
            this.index = null;
            return this;
        };

        RemovePatch.prototype.destroy = function() {
            return RemovePatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = ReplacePatch;


        function ReplacePatch() {
            this.type = consts.REPLACE;
            this.id = null;
            this.childId = null;
            this.index = null;
            this.next = null;
        }
        createPool(ReplacePatch);

        ReplacePatch.create = function(id, childId, index, next) {
            var patch = ReplacePatch.getPooled();
            patch.id = id;
            patch.childId = childId;
            patch.index = index;
            patch.next = next;
            return patch;
        };

        ReplacePatch.prototype.destructor = function() {
            this.id = null;
            this.childId = null;
            this.index = null;
            this.next = null;
            return this;
        };

        ReplacePatch.prototype.destroy = function() {
            return ReplacePatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var createPool = require(23),
            consts = require(26);


        module.exports = TextPatch;


        function TextPatch() {
            this.type = consts.TEXT;
            this.id = null;
            this.index = null;
            this.next = null;
        }
        createPool(TextPatch);

        TextPatch.create = function(id, index, next) {
            var patch = TextPatch.getPooled();
            patch.id = id;
            patch.index = index;
            patch.next = next;
            return patch;
        };

        TextPatch.prototype.destructor = function() {
            this.id = null;
            this.index = null;
            this.next = null;
            return this;
        };

        TextPatch.prototype.destroy = function() {
            return TextPatch.release(this);
        };


    },
    function(require, exports, module, global) {

        var isString = require(9),
            isNumber = require(10),
            isNullOrUndefined = require(4);


        module.exports = shouldUpdate;


        function shouldUpdate(previous, next) {
            if (isNullOrUndefined(previous) || isNullOrUndefined(next)) {
                return false;
            } else {
                if (isString(previous) || isNumber(previous)) {
                    return isString(next) || isNumber(next);
                } else {
                    return (
                        previous.type === next.type &&
                        previous.key === next.key
                    );
                }
            }
        }


    },
    function(require, exports, module, global) {

        var EventManagerPrototype;


        module.exports = EventManager;


        function EventManager() {
            this.propNameToTopLevel = {};
            this.events = {};
        }

        EventManagerPrototype = EventManager.prototype;

        EventManagerPrototype.on = function(id, topLevelType, listener, transaction) {
            var events = this.events,
                event = events[topLevelType] || (events[topLevelType] = {});

            event[id] = listener;
            transaction.event(id, topLevelType);
        };

        EventManagerPrototype.off = function(id, topLevelType, transaction) {
            var events = this.events,
                event = events[topLevelType];

            if (event[id] !== undefined) {
                delete event[id];
                transaction.removeEvent(id, topLevelType);
            }
        };

        EventManagerPrototype.allOff = function(id, transaction) {
            var events = this.events,
                event, topLevelType;

            for (topLevelType in events) {
                if ((event = events[topLevelType])[id] !== undefined) {
                    delete event[id];
                    transaction.removeEvent(id, topLevelType);
                }
            }
        };


    },
    function(require, exports, module, global) {

        var process = require(39);
        var has = require(12),
            map = require(13),
            indexOf = require(40),
            isString = require(9),
            isFunction = require(5),
            extend = require(41),
            owner = require(19),
            context = require(20),
            shouldUpdate = require(36),
            componentState = require(42),
            getComponentClassForType = require(43),
            View = require(2),
            getChildKey = require(51),
            emptyObject = require(50),
            diffProps = require(53),
            diffChildren;


        var NodePrototype,
            isPrimativeView = View.isPrimativeView;


        module.exports = Node;


        function Node(parentId, id, currentView) {

            this.parent = null;
            this.parentId = parentId;
            this.id = id;

            this.context = null;

            this.root = null;

            this.component = null;

            this.isBottomLevel = true;
            this.isTopLevel = false;

            this.renderedNode = null;
            this.renderedChildren = null;

            this.currentView = currentView;
        }

        NodePrototype = Node.prototype;

        NodePrototype.appendNode = function(node) {
            var renderedChildren = this.renderedChildren;

            this.root.appendNode(node);
            node.parent = this;

            renderedChildren[renderedChildren.length] = node;
        };

        NodePrototype.removeNode = function(node) {
            var renderedChildren = this.renderedChildren,
                index;

            node.parent = null;

            index = indexOf(renderedChildren, node);
            if (index !== -1) {
                renderedChildren.splice(index, 1);
            }
        };

        NodePrototype.mountComponent = function() {
            var currentView = this.currentView,
                ComponentClass, component, props, children, context;

            if (isFunction(currentView.type)) {
                ComponentClass = currentView.type;
            } else {
                ComponentClass = getComponentClassForType(currentView.type);
                this.isTopLevel = true;
            }

            props = this.__processProps(currentView.props);
            children = currentView.children;
            context = this.__processContext(currentView.__context);

            component = new ComponentClass(props, children, context);

            this.component = component;

            component.__node = this;
            component.props = props;
            component.children = children;
            component.context = context;
        };

        NodePrototype.mount = function(transaction) {
            transaction.mount(this.id, this.__mount(transaction));
        };

        NodePrototype.__mount = function(transaction) {
            var component, renderedView, renderedNode;

            this.context = context.current;
            this.mountComponent();

            renderedView = this.renderView();

            if (this.isTopLevel !== true) {
                renderedNode = this.renderedNode = new Node(this.parentId, this.id, renderedView);
                renderedNode.root = this.root;
                renderedNode.isBottomLevel = false;
                renderedView = renderedNode.__mount(transaction);
            } else {
                mountEvents(this.id, renderedView.props, this.root.eventManager, transaction);
                this.__mountChildren(renderedView, transaction);
            }

            component = this.component;
            component.__mountState = componentState.MOUNTING;
            component.componentWillMount();

            transaction.queue.enqueue(function onMount() {
                component.__mountState = componentState.MOUNTED;
                component.componentDidMount();
            });

            this.__attachRefs();

            return renderedView;
        };

        NodePrototype.__mountChildren = function(renderedView, transaction) {
            var _this = this,
                parentId = this.id,
                renderedChildren = [];

            this.renderedChildren = renderedChildren;

            renderedView.children = map(renderedView.children, function(child, index) {
                var node, id;

                if (isPrimativeView(child)) {
                    return child;
                } else {
                    id = getChildKey(parentId, child, index);
                    node = new Node(parentId, id, child);
                    _this.appendNode(node);
                    return node.__mount(transaction);
                }
            });
        };

        NodePrototype.unmount = function(transaction) {
            this.__unmount(transaction);
            transaction.remove(this.parentId, this.id, 0);
        };

        NodePrototype.__unmount = function(transaction) {
            var component = this.component;

            if (this.isTopLevel !== true) {
                this.renderedNode.__unmount(transaction);
                this.renderedNode = null;
            } else {
                this.__unmountChildren(transaction);
                this.root.eventManager.allOff(this.id, transaction);
                this.renderedChildren = null;
            }

            component.__mountState = componentState.UNMOUNTING;
            component.componentWillUnmount();

            if (this.isBottomLevel !== false) {
                this.root.removeNode(this);
            }

            this.__detachRefs();

            this.context = null;
            this.component = null;
            this.currentView = null;

            transaction.queue.enqueue(function onUnmount() {
                component.__mountState = componentState.UNMOUNTED;
            });
        };

        NodePrototype.__unmountChildren = function(transaction) {
            var renderedChildren = this.renderedChildren,
                i = -1,
                il = renderedChildren.length - 1;

            while (i++ < il) {
                renderedChildren[i].__unmount(transaction);
            }
        };

        NodePrototype.update = function(nextView, transaction) {
            this.receiveView(nextView, nextView.__context, transaction);
        };

        NodePrototype.receiveView = function(nextView, nextContext, transaction) {
            var prevView = this.currentView,
                prevContext = this.context;

            this.updateComponent(
                prevView,
                nextView,
                prevContext,
                nextContext,
                transaction
            );
        };

        NodePrototype.updateComponent = function(
            prevParentView, nextParentView, prevUnmaskedContext, nextUnmaskedContext, transaction
        ) {
            var component = this.component,

                nextProps = component.props,
                nextChildren = component.children,
                nextContext = component.context,

                nextState;

            component.__mountState = componentState.UPDATING;

            if (prevParentView !== nextParentView) {
                nextProps = this.__processProps(nextParentView.props);
                nextChildren = nextParentView.children;
                nextContext = this.__processContext(nextParentView.__context);

                component.componentWillReceiveProps(nextProps, nextChildren, nextContext);
            }

            nextState = component.__nextState;

            if (component.shouldComponentUpdate(nextProps, nextChildren, nextState, nextContext)) {
                this.__updateComponent(
                    nextParentView, nextProps, nextChildren, nextState, nextContext, nextUnmaskedContext, transaction
                );
            } else {
                this.currentView = nextParentView;
                this.context = nextUnmaskedContext;

                component.props = nextProps;
                component.children = nextChildren;
                component.state = nextState;
                component.context = nextContext;

                component.__mountState = componentState.MOUNTED;
            }
        };

        NodePrototype.__updateComponent = function(
            nextParentView, nextProps, nextChildren, nextState, nextContext, unmaskedContext, transaction
        ) {
            var component = this.component,

                prevProps = component.props,
                prevChildren = component.children,
                prevState = component.__previousState,
                prevContext = component.context,

                prevParentView;

            component.componentWillUpdate(nextProps, nextChildren, nextState, nextContext);

            component.props = nextProps;
            component.children = nextChildren;
            component.state = nextState;
            component.context = nextContext;

            this.context = unmaskedContext;

            if (this.isTopLevel !== true) {
                this.currentView = nextParentView;
                this.__updateRenderedNode(unmaskedContext, transaction);
            } else {
                prevParentView = this.currentView;
                this.currentView = nextParentView;
                this.__updateRenderedView(prevParentView, unmaskedContext, transaction);
            }

            transaction.queue.enqueue(function onUpdate() {
                component.__mountState = componentState.UPDATED;
                component.componentDidUpdate(prevProps, prevChildren, prevState, prevContext);
                component.__mountState = componentState.MOUNTED;
            });
        };

        NodePrototype.__updateRenderedNode = function(context, transaction) {
            var prevNode = this.renderedNode,
                prevRenderedView = prevNode.currentView,
                nextRenderedView = this.renderView(),
                renderedNode;

            if (shouldUpdate(prevRenderedView, nextRenderedView)) {
                prevNode.receiveView(nextRenderedView, this.__processChildContext(context), transaction);
            } else {
                prevNode.__unmount(transaction);

                renderedNode = this.renderedNode = new Node(this.parentId, this.id, nextRenderedView);
                renderedNode.root = this.root;
                renderedNode.isBottomLevel = false;

                transaction.replace(this.parentId, this.id, 0, renderedNode.__mount(transaction));
            }

            this.__attachRefs();
        };

        diffChildren = require(55);

        NodePrototype.__updateRenderedView = function(prevRenderedView, context, transaction) {
            var id = this.id,
                nextRenderedView = this.renderView(),
                propsDiff = diffProps(id, this.root.eventManager, transaction, prevRenderedView.props, nextRenderedView.props);

            if (propsDiff !== null) {
                transaction.props(id, prevRenderedView.props, propsDiff);
            }

            diffChildren(this, prevRenderedView, nextRenderedView, transaction);
        };

        NodePrototype.renderView = function() {
            var currentView = this.currentView,
                previousContext = context.current,
                renderedView;

            context.current = this.__processChildContext(currentView.__context);
            owner.current = this.component;

            renderedView = this.component.render();

            context.current = previousContext;
            owner.current = null;

            return renderedView;
        };

        NodePrototype.__checkTypes = function(propTypes, props) {
            var localHas = has,
                displayName = this.__getName(),
                propName, error;

            if (propTypes) {
                for (propName in propTypes) {
                    if (localHas(propTypes, propName)) {
                        error = propTypes[propName](props, propName, displayName);
                        if (error !== null) {
                            console.warn(error);
                        }
                    }
                }
            }
        };

        NodePrototype.__processProps = function(props) {
            var propTypes;

            if (process.env.NODE_ENV !== "production") {
                propTypes = this.currentView.type.propTypes;

                if (propTypes) {
                    this.__checkTypes(propTypes, props);
                }
            }

            return props;
        };

        NodePrototype.__maskContext = function(context) {
            var maskedContext = null,
                contextTypes, contextName, localHas;

            if (isString(this.currentView.type)) {
                return emptyObject;
            } else {
                contextTypes = this.currentView.type.contextTypes;

                if (contextTypes) {
                    maskedContext = {};
                    localHas = has;

                    for (contextName in contextTypes) {
                        if (localHas(contextTypes, contextName)) {
                            maskedContext[contextName] = context[contextName];
                        }
                    }
                }

                return maskedContext;
            }
        };

        NodePrototype.__processContext = function(context) {
            var maskedContext = this.__maskContext(context),
                contextTypes;

            if (process.env.NODE_ENV !== "production") {
                contextTypes = this.currentView.type.contextTypes;

                if (contextTypes) {
                    this.__checkTypes(contextTypes, maskedContext);
                }
            }

            return maskedContext;
        };

        NodePrototype.__processChildContext = function(currentContext) {
            var component = this.component,
                childContext = component.getChildContext(),
                childContextTypes, localHas, contextName, displayName;

            if (childContext) {
                childContextTypes = this.currentView.type.childContextTypes;

                if (process.env.NODE_ENV !== "production") {
                    if (childContextTypes) {
                        this.__checkTypes(childContextTypes, childContext);
                    }
                }

                if (childContextTypes) {
                    localHas = has;
                    displayName = this.__getName();

                    for (contextName in childContext) {
                        if (!localHas(childContextTypes, contextName)) {
                            console.warn(new Error(
                                displayName + " getChildContext(): key " + contextName + " is not defined in childContextTypes"
                            ));
                        }
                    }
                }

                return extend({}, currentContext, childContext);
            } else {
                return currentContext;
            }
        };

        NodePrototype.__attachRefs = function() {
            var view = this.currentView,
                ref = view.ref;

            if (isString(ref)) {
                attachRef(this.component, ref, view.__owner);
            }
        };

        NodePrototype.__detachRefs = function() {
            var view = this.currentView,
                ref = view.ref;

            if (isString(ref)) {
                detachRef(ref, view.__owner);
            }
        };

        NodePrototype.__getName = function() {
            var type = this.currentView.type,
                constructor;

            if (isString(type)) {
                return type;
            } else {
                constructor = this.component && this.component.constructor;
                return type.displayName || (constructor && constructor.displayName) || null;
            }
        };

        function attachRef(component, ref, owner) {
            var refs;

            if (isString(ref)) {
                refs = owner.refs === emptyObject ? (owner.refs = {}) : owner.refs;
                refs[ref] = component;
            }
        }

        function detachRef(ref, owner) {
            var refs = owner.refs;
            delete refs[ref];
        }

        function mountEvents(id, props, eventManager, transaction) {
            var propNameToTopLevel = eventManager.propNameToTopLevel,
                localHas = has,
                key;

            for (key in props) {
                if (localHas(propNameToTopLevel, key)) {
                    eventManager.on(id, propNameToTopLevel[key], props[key], transaction);
                }
            }
        }


    },
    function(require, exports, module, global) {

        // shim for using process in browser

        var process = module.exports = {};

        process.nextTick = (function() {
            var canSetImmediate = typeof window !== 'undefined' && window.setImmediate;
            var canMutationObserver = typeof window !== 'undefined' && window.MutationObserver;
            var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;

            if (canSetImmediate) {
                return function(f) {
                    return window.setImmediate(f)
                };
            }

            var queue = [];

            if (canMutationObserver) {
                var hiddenDiv = document.createElement("div");
                var observer = new MutationObserver(function() {
                    var queueList = queue.slice();
                    queue.length = 0;
                    queueList.forEach(function(fn) {
                        fn();
                    });
                });

                observer.observe(hiddenDiv, {
                    attributes: true
                });

                return function nextTick(fn) {
                    if (!queue.length) {
                        hiddenDiv.setAttribute('yes', 'no');
                    }
                    queue.push(fn);
                };
            }

            if (canPost) {
                window.addEventListener('message', function(ev) {
                    var source = ev.source;
                    if ((source === window || source === null) && ev.data === 'process-tick') {
                        ev.stopPropagation();
                        if (queue.length > 0) {
                            var fn = queue.shift();
                            fn();
                        }
                    }
                }, true);

                return function nextTick(fn) {
                    queue.push(fn);
                    window.postMessage('process-tick', '*');
                };
            }

            return function nextTick(fn) {
                setTimeout(fn, 0);
            };
        })();

        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;

        process.binding = function(name) {
            throw new Error('process.binding is not supported');
        };

        // TODO(shtylman)
        process.cwd = function() {
            return '/'
        };
        process.chdir = function(dir) {
            throw new Error('process.chdir is not supported');
        };


    },
    function(require, exports, module, global) {

        var isLength = require(7),
            isObjectLike = require(8);


        function arrayIndexOf(array, value, fromIndex) {
            var i = fromIndex - 1,
                il = array.length - 1;

            while (i++ < il) {
                if (array[i] === value) {
                    return i;
                }
            }

            return -1;
        }

        module.exports = function indexOf(array, value, fromIndex) {
            return (isObjectLike(array) && isLength(array.length)) ? arrayIndexOf(array, value, fromIndex || 0) : -1;
        };


    },
    function(require, exports, module, global) {

        var keys = require(14);


        function baseExtend(a, b) {
            var objectKeys = keys(b),
                i = -1,
                il = objectKeys.length - 1,
                key;

            while (i++ < il) {
                key = objectKeys[i];
                a[key] = b[key];
            }
        }

        module.exports = function extend(out) {
            var i = 0,
                il = arguments.length - 1;

            while (i++ < il) {
                baseExtend(out, arguments[i]);
            }

            return out;
        };


    },
    function(require, exports, module, global) {

        var keyMirror = require(27);


        module.exports = keyMirror([
            "MOUNTING",
            "MOUNTED",
            "UPDATING",
            "UPDATED",
            "UNMOUNTING",
            "UNMOUNTED"
        ]);


    },
    function(require, exports, module, global) {

        var nativeComponents = require(44),
            createNativeComponentForType = require(45);


        module.exports = getComponentClassForType;


        function getComponentClassForType(type) {
            var Class = nativeComponents[type];

            if (Class) {
                return Class;
            } else {
                Class = createNativeComponentForType(type);
                nativeComponents[type] = Class;
                return Class;
            }
        }


    },
    function(require, exports, module, global) {




    },
    function(require, exports, module, global) {

        var View = require(2),
            Component = require(46);


        module.exports = createNativeComponentForType;


        function createNativeComponentForType(type) {
            function NativeComponent(props, children) {
                Component.call(this, props, children);
            }
            Component.extend(NativeComponent, type);

            NativeComponent.prototype.render = function() {
                return new View(type, null, null, this.props, this.children, null, null);
            };

            return NativeComponent;
        }


    },
    function(require, exports, module, global) {

        var inherits = require(47),
            extend = require(41),
            componentState = require(42),
            emptyObject = require(50);


        var ComponentPrototype;


        module.exports = Component;


        function Component(props, children, context) {
            this.__node = null;
            this.__mountState = componentState.UNMOUNTED;
            this.__nextState = null;
            this.props = props;
            this.children = children;
            this.context = context;
            this.state = null;
            this.refs = emptyObject;
        }

        ComponentPrototype = Component.prototype;

        Component.extend = function(child, displayName) {
            inherits(child, this);
            child.displayName = child.prototype.displayName = displayName || ComponentPrototype.displayName;
            return child;
        };

        ComponentPrototype.displayName = "Component";

        ComponentPrototype.render = function() {
            throw new Error("render() render must be defined on Components");
        };

        ComponentPrototype.setState = function(state) {
            var node = this.__node;

            this.__nextState = extend({}, this.state, state);

            if (this.__mountState === componentState.MOUNTED) {
                node.root.update(node);
            }
        };

        ComponentPrototype.forceUpdate = function() {
            var node = this.__node;

            if (this.__mountState === componentState.MOUNTED) {
                node.root.update(node);
            }
        };

        ComponentPrototype.isMounted = function() {
            return this.__mountState === componentState.MOUNTED;
        };

        ComponentPrototype.getId = function() {
            return this.__node.id;
        };

        ComponentPrototype.emitMessage = function(name, data, callback) {
            this.__node.root.adaptor.messenger.emit(name, data, callback);
        };

        ComponentPrototype.onMessage = function(name, callback) {
            this.__node.root.adaptor.messenger.on(name, callback);
        };

        ComponentPrototype.offMessage = function(name, callback) {
            this.__node.root.adaptor.messenger.off(name, callback);
        };

        ComponentPrototype.getChildContext = function() {};

        ComponentPrototype.componentDidMount = function() {};

        ComponentPrototype.componentDidUpdate = function( /* previousProps, previousChildren, previousState, previousContext */ ) {};

        ComponentPrototype.componentWillMount = function() {};

        ComponentPrototype.componentWillUnmount = function() {};

        ComponentPrototype.componentWillReceiveProps = function( /* nextProps, nextChildren, nextContext */ ) {};

        ComponentPrototype.componentWillUpdate = function( /* nextProps, nextChildren, nextState, nextContext */ ) {};

        ComponentPrototype.shouldComponentUpdate = function( /* nextProps, nextChildren, nextState, nextContext */ ) {
            return true;
        };


    },
    function(require, exports, module, global) {

        var create = require(48),
            extend = require(41),
            mixin = require(49),
            defineProperty = require(24);


        var descriptor = {
            configurable: true,
            enumerable: false,
            writable: true,
            value: null
        };


        function defineNonEnumerableProperty(object, name, value) {
            descriptor.value = value;
            defineProperty(object, name, descriptor);
            descriptor.value = null;
        }

        function defineStatic(name, value) {
            defineNonEnumerableProperty(this, name, value);
        }

        function inherits(child, parent) {

            mixin(child, parent);

            child.prototype = extend(create(parent.prototype), child.prototype);

            defineNonEnumerableProperty(child, "__super", parent.prototype);
            defineNonEnumerableProperty(child.prototype, "constructor", child);

            child.defineStatic = defineStatic;
            child.super_ = parent; // support node

            return child;
        }

        inherits.defineProperty = defineNonEnumerableProperty;


        module.exports = inherits;


    },
    function(require, exports, module, global) {

        module.exports = Object.create || (function() {
            function F() {}
            return function create(object) {
                F.prototype = object;
                return new F();
            };
        }());


    },
    function(require, exports, module, global) {

        var keys = require(14),
            isNullOrUndefined = require(4);


        function baseMixin(a, b) {
            var objectKeys = keys(b),
                i = -1,
                il = objectKeys.length - 1,
                key, value;

            while (i++ < il) {
                key = objectKeys[i];

                if (isNullOrUndefined(a[key]) && !isNullOrUndefined((value = b[key]))) {
                    a[key] = value;
                }
            }
        }

        module.exports = function mixin(out) {
            var i = 0,
                il = arguments.length - 1;

            while (i++ < il) {
                baseMixin(out, arguments[i]);
            }

            return out;
        };


    },
    function(require, exports, module, global) {




    },
    function(require, exports, module, global) {

        var getViewKey = require(52);


        module.exports = getChildKey;


        function getChildKey(parentId, child, index) {
            return parentId + "." + getViewKey(child, index);
        }


    },
    function(require, exports, module, global) {

        var isNullOrUndefined = require(4);


        var reEscape = /[=.:]/g;


        module.exports = getViewKey;


        function getViewKey(view, index) {
            var key = view.key;

            if (isNullOrUndefined(key)) {
                return index.toString(36);
            } else {
                return "$" + escapeKey(key);
            }
        }

        function escapeKey(key) {
            return (key + "").replace(reEscape, "$");
        }


    },
    function(require, exports, module, global) {

        var has = require(12),
            isObject = require(16),
            getPrototypeOf = require(54),
            isNullOrUndefined = require(4);


        module.exports = diffProps;


        function diffProps(id, eventManager, transaction, previous, next) {
            var result = null,
                localHas = has,
                propNameToTopLevel = eventManager.propNameToTopLevel,
                key, previousValue, nextValue, propsDiff;

            for (key in previous) {
                nextValue = next[key];

                if (isNullOrUndefined(nextValue)) {
                    result = result || {};
                    result[key] = undefined;

                    if (localHas(propNameToTopLevel, key)) {
                        eventManager.off(id, propNameToTopLevel[key], transaction);
                    }
                } else {
                    previousValue = previous[key];

                    if (previousValue === nextValue) {
                        continue;
                    } else if (isObject(previousValue) && isObject(nextValue)) {
                        if (getPrototypeOf(previousValue) !== getPrototypeOf(nextValue)) {
                            result = result || {};
                            result[key] = nextValue;
                        } else {
                            propsDiff = diffProps(id, eventManager, transaction, previousValue, nextValue);
                            if (propsDiff !== null) {
                                result = result || {};
                                result[key] = propsDiff;
                            }
                        }
                    } else {
                        result = result || {};
                        result[key] = nextValue;
                    }
                }
            }

            for (key in next) {
                if (isNullOrUndefined(previous[key])) {
                    nextValue = next[key];

                    result = result || {};
                    result[key] = nextValue;

                    if (localHas(propNameToTopLevel, key)) {
                        eventManager.on(id, propNameToTopLevel[key], transaction);
                    }
                }
            }

            return result;
        }


    },
    function(require, exports, module, global) {

        var isObject = require(16),
            isNative = require(15);


        var nativeGetPrototypeOf = Object.getPrototypeOf;


        if (!isNative(nativeGetPrototypeOf)) {
            nativeGetPrototypeOf = function getPrototypeOf(obj) {
                return obj.__proto__ || (
                    obj.constructor ? obj.constructor.prototype : null
                );
            };
        }

        module.exports = function getPrototypeOf(obj) {
            return obj == null ? null : nativeGetPrototypeOf(
                (isObject(obj) ? obj : Object(obj))
            );
        };


    },
    function(require, exports, module, global) {

        var isNullOrUndefined = require(4),
            getChildKey = require(51),
            shouldUpdate = require(36),
            View = require(2),
            Node;


        var isPrimativeView = View.isPrimativeView;


        module.exports = diffChildren;


        Node = require(38);


        function diffChildren(node, previous, next, transaction) {
            var root = node.root,
                previousChildren = previous.children,
                nextChildren = reorder(previousChildren, next.children),
                previousLength = previousChildren.length,
                nextLength = nextChildren.length,
                parentId = node.id,
                i = -1,
                il = (previousLength > nextLength ? previousLength : nextLength) - 1;

            while (i++ < il) {
                diffChild(root, node, previousChildren[i], nextChildren[i], parentId, i, transaction);
            }

            if (nextChildren.moves) {
                transaction.order(parentId, nextChildren.moves);
            }
        }

        function diffChild(root, parentNode, previousChild, nextChild, parentId, index, transaction) {
            var node, id;

            if (previousChild !== nextChild) {
                if (isNullOrUndefined(previousChild)) {
                    if (isPrimativeView(nextChild)) {
                        transaction.insert(parentId, null, index, nextChild);
                    } else {
                        id = getChildKey(parentId, nextChild, index);
                        node = new Node(parentId, id, nextChild);
                        parentNode.appendNode(node);
                        transaction.insert(parentId, id, index, node.__mount(transaction));
                    }
                } else if (isPrimativeView(previousChild)) {
                    if (isNullOrUndefined(nextChild)) {
                        transaction.remove(parentId, null, index);
                    } else if (isPrimativeView(nextChild)) {
                        transaction.text(parentId, index, nextChild);
                    } else {
                        id = getChildKey(parentId, nextChild, index);
                        node = new Node(parentId, id, nextChild);
                        parentNode.appendNode(node);
                        transaction.replace(parentId, id, index, node.__mount(transaction));
                    }
                } else {
                    if (isNullOrUndefined(nextChild)) {
                        id = getChildKey(parentId, previousChild, index);
                        node = root.childHash[id];
                        node.unmount(transaction);
                        parentNode.removeNode(node);
                    } else if (isPrimativeView(nextChild)) {
                        transaction.replace(parentId, null, index, nextChild);
                    } else {
                        id = getChildKey(parentId, previousChild, index);
                        node = root.childHash[id];

                        if (node) {
                            if (shouldUpdate(previousChild, nextChild)) {
                                node.update(nextChild, transaction);
                            } else {
                                node.__unmount(transaction);
                                parentNode.removeNode(node);

                                id = getChildKey(parentId, nextChild, index);
                                node = new Node(parentId, id, nextChild);
                                parentNode.appendNode(node);
                                transaction.replace(parentId, id, index, node.__mount(transaction));
                            }
                        } else {
                            id = getChildKey(parentId, nextChild, index);
                            node = new Node(parentId, id, nextChild);
                            parentNode.appendNode(node);
                            transaction.insert(parentId, id, index, node.__mount(transaction));
                        }
                    }
                }
            }
        }

        function reorder(previousChildren, nextChildren) {
            var previousKeys, nextKeys, previousMatch, nextMatch, key, previousLength, nextLength,
                length, shuffle, freeIndex, i, moveIndex, moves, removes, reverse, hasMoves, move, freeChild;

            nextKeys = keyIndex(nextChildren);
            if (nextKeys === null) {
                return nextChildren;
            }

            previousKeys = keyIndex(previousChildren);
            if (previousKeys === null) {
                return nextChildren;
            }

            nextMatch = {};
            previousMatch = {};

            for (key in nextKeys) {
                nextMatch[nextKeys[key]] = previousKeys[key];
            }

            for (key in previousKeys) {
                previousMatch[previousKeys[key]] = nextKeys[key];
            }

            previousLength = previousChildren.length;
            nextLength = nextChildren.length;
            length = previousLength > nextLength ? previousLength : nextLength;
            shuffle = [];
            freeIndex = 0;
            i = 0;
            moveIndex = 0;
            moves = {};
            removes = moves.removes = {};
            reverse = moves.reverse = {};
            hasMoves = false;

            while (freeIndex < length) {
                move = previousMatch[i];

                if (move !== undefined) {
                    shuffle[i] = nextChildren[move];

                    if (move !== moveIndex) {
                        moves[move] = moveIndex;
                        reverse[moveIndex] = move;
                        hasMoves = true;
                    }

                    moveIndex++;
                } else if (i in previousMatch) {
                    shuffle[i] = undefined;
                    removes[i] = moveIndex++;
                    hasMoves = true;
                } else {
                    while (nextMatch[freeIndex] !== undefined) {
                        freeIndex++;
                    }

                    if (freeIndex < length) {
                        freeChild = nextChildren[freeIndex];

                        if (freeChild) {
                            shuffle[i] = freeChild;
                            if (freeIndex !== moveIndex) {
                                hasMoves = true;
                                moves[freeIndex] = moveIndex;
                                reverse[moveIndex] = freeIndex;
                            }
                            moveIndex++;
                        }
                        freeIndex++;
                    }
                }
                i++;
            }

            if (hasMoves) {
                shuffle.moves = moves;
            }

            return shuffle;
        }

        function keyIndex(children) {
            var i = -1,
                il = children.length - 1,
                keys = null,
                child;

            while (i++ < il) {
                child = children[i];

                if (!isNullOrUndefined(child.key)) {
                    keys = keys || {};
                    keys[child.key] = i;
                }
            }

            return keys;
        }


    },
    function(require, exports, module, global) {

        var nativeComponents = require(44);


        module.exports = registerNativeComponent;


        function registerNativeComponent(type, constructor) {
            nativeComponents[type] = constructor;
        }


    },
    function(require, exports, module, global) {

        var virt = require(1),
            AndroidAdaptor = require(58);


        require(63);
        require(66);
        require(67);
        require(68);


        var virtAndroid = exports,
            root = null;


        virtAndroid.socket = null;

        virtAndroid.render = function(view) {
            if (root === null) {
                root = new virt.Root();
                root.adaptor = new AndroidAdaptor(root, virtAndroid.socket);
            }

            root.render(view);

            return root;
        };

        virtAndroid.unmount = function() {
            if (root !== null) {
                root.unmount();
                root = null;
            }
        };


    },
    function(require, exports, module, global) {

        var Messenger = require(59),
            MessengerWebSocketAdaptor = require(60),
            consts = require(61);


        module.exports = AndroidAdaptor;


        function AndroidAdaptor(root, socket) {
            var messenger = new Messenger(new MessengerWebSocketAdaptor(socket)),
                eventManager = root.eventManager,
                events = eventManager.events;

            this.root = root;
            this.messenger = messenger;

            eventManager.propNameToTopLevel = consts.propNameToTopLevel;

            messenger.on("__AndroidAdaptor:handleEventDispatch__", function(data, callback) {
                var childHash = root.childHash,
                    topLevelType = data.topLevelType,
                    targetId = data.targetId,
                    nativeEvent = data.nativeEvent,
                    eventType = events[topLevelType],
                    target = childHash[targetId];

                if (target && eventType[targetId]) {
                    nativeEvent.target = target.component;
                    eventType[targetId](nativeEvent);
                }

                callback(undefined);
            });

            this.handle = function(transaction, callback) {
                messenger.emit("__AndroidAdaptor:handleTransaction__", transaction, callback);
            };
        }


    },
    function(require, exports, module, global) {

        var MESSENGER_ID = 0,
            MessengerPrototype;


        module.exports = Messenger;


        function Messenger(adaptor) {
            var _this = this;

            this.__id = (MESSENGER_ID++).toString(36);
            this.__messageId = 0;
            this.__callbacks = {};
            this.__listeners = {};

            this.__adaptor = adaptor;

            adaptor.addMessageListener(function onMessage(data) {
                _this.onMessage(data);
            });
        }
        MessengerPrototype = Messenger.prototype;

        MessengerPrototype.onMessage = function(message) {
            var id = message.id,
                name = message.name,
                callbacks = this.__callbacks,
                callback = callbacks[id],
                listeners, adaptor;

            if (name) {
                listeners = this.__listeners;
                adaptor = this.__adaptor;

                if (listeners[name]) {
                    emit(listeners[name], message.data, function callback(error, data) {
                        adaptor.postMessage({
                            id: id,
                            error: error || undefined,
                            data: data
                        });
                    });
                }
            } else {
                if (callback && isMatch(id, this.__id)) {
                    callback(message.error, message.data);
                    delete callbacks[id];
                }
            }
        };

        MessengerPrototype.emit = function(name, data, callback) {
            var id = this.__id + "-" + (this.__messageId++).toString(36);

            if (callback) {
                this.__callbacks[id] = callback;
            }

            this.__adaptor.postMessage({
                id: id,
                name: name,
                data: data
            });
        };

        MessengerPrototype.on = function(name, callback) {
            var listeners = this.__listeners,
                listener = listeners[name] || (listeners[name] = []);

            listener[listener.length] = callback;
        };

        MessengerPrototype.off = function(name, callback) {
            var listeners = this.__listeners,
                listener = listeners[name],
                i;

            if (listener) {
                i = listener.length;

                while (i--) {
                    if (listener[i] === callback) {
                        listener.splice(i, 1);
                    }
                }
            }
        };

        function emit(listeners, data, callback) {
            var index = 0,
                length = listeners.length,
                called = false;

            function done(err, data) {
                if (called === false) {
                    called = true;
                    callback(err, data);
                }
            }

            function next(err, data) {
                if (err || index === length) {
                    done(err, data);
                } else {
                    listeners[index++](data, next);
                }
            }

            next(undefined, data);
        }

        function isMatch(messageId, id) {
            return messageId.split("-")[0] === id;
        }


    },
    function(require, exports, module, global) {

        var MessengerWebSocketAdaptorPrototype;


        module.exports = MessengerWebSocketAdaptor;


        function MessengerWebSocketAdaptor(socket) {
            this.__socket = socket;
        }
        MessengerWebSocketAdaptorPrototype = MessengerWebSocketAdaptor.prototype;

        MessengerWebSocketAdaptorPrototype.addMessageListener = function(callback) {
            this.__socket.onmessage = function onMessage(data) {
                callback(JSON.parse(data));
            };
        };

        MessengerWebSocketAdaptorPrototype.postMessage = function(data) {
            this.__socket.send(JSON.stringify(data));
        };


    },
    function(require, exports, module, global) {

        var forEach = require(62),
            keyMirror = require(27);


        var consts = exports,

            propNameToTopLevel = consts.propNameToTopLevel = {},

            eventTypes = [
                "topBlur",
                "topChange",
                "topClick",
                "topCompositionEnd",
                "topCompositionStart",
                "topCompositionUpdate",
                "topContextMenu",
                "topCopy",
                "topCut",
                "topDoubleClick",
                "topDrag",
                "topDragEnd",
                "topDragEnter",
                "topDragExit",
                "topDragLeave",
                "topDragOver",
                "topDragStart",
                "topDrop",
                "topError",
                "topFocus",
                "topInput",
                "topKeyDown",
                "topKeyPress",
                "topKeyUp",
                "topLoad",
                "topMouseDown",
                "topMouseMove",
                "topMouseOut",
                "topMouseOver",
                "topMouseUp",
                "topPaste",
                "topReset",
                "topScroll",
                "topSelectionChange",
                "topSubmit",
                "topTextInput",
                "topTouchCancel",
                "topTouchEnd",
                "topTouchMove",
                "topTouchStart",
                "topWheel"
            ];

        consts.topLevelTypes = keyMirror(eventTypes);

        forEach(eventTypes, function(str) {
            propNameToTopLevel[replaceTopWithOn(str)] = str;
        });

        function replaceTopWithOn(str) {
            return str.replace(/^top/, "on");
        }


    },
    function(require, exports, module, global) {

        var keys = require(14),
            isNullOrUndefined = require(4),
            fastBindThis = require(17),
            isArrayLike = require(18);


        function forEachArray(array, callback) {
            var i = -1,
                il = array.length - 1;

            while (i++ < il) {
                if (callback(array[i], i) === false) {
                    return false;
                }
            }

            return array;
        }

        function forEachObject(object, callback) {
            var objectKeys = keys(object),
                i = -1,
                il = objectKeys.length - 1,
                key;

            while (i++ < il) {
                key = objectKeys[i];

                if (callback(object[key], key) === false) {
                    return false;
                }
            }

            return object;
        }

        module.exports = function forEach(object, callback, thisArg) {
            callback = isNullOrUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 2);
            return isArrayLike(object) ? forEachArray(object, callback) : forEachObject(object, callback);
        };


    },
    function(require, exports, module, global) {

        var process = require(39);
        var virt = require(1),
            some = require(64),
            isNotPrimitive = require(65);


        var View = virt.View,
            Component = virt.Component,
            ButtonPrototype;


        virt.registerNativeComponent("Button", Button);


        function Button(props, children, context) {

            Component.call(this, props, children, context);

            if (process.env.NODE_ENV !== "production") {
                if (some(children, isNotPrimitive)) {
                    throw new Error("TextView: children must be primitives");
                }
            }

            if (children.length > 1) {
                children[0] = children.join("");
            }
        }
        Component.extend(Button, "Button");

        ButtonPrototype = Button.prototype;

        ButtonPrototype.render = function() {
            return new View("Button", null, null, this.props, this.children, null, null);
        };


    },
    function(require, exports, module, global) {

        var keys = require(14),
            isNullOrUndefined = require(4),
            fastBindThis = require(17),
            isArrayLike = require(18);


        function someArray(array, callback) {
            var i = array.length;

            while (i--) {
                if (callback(array[i], i)) {
                    return true;
                }
            }

            return false;
        }

        function someObject(object, callback) {
            var objectKeys = keys(object),
                i = objectKeys.length,
                key;

            while (i--) {
                key = objectKeys[i];

                if (callback(object[key], key)) {
                    return true;
                }
            }

            return false;
        }

        module.exports = function some(object, callback, thisArg) {
            callback = isNullOrUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 2);
            return isArrayLike(object) ? someArray(object, callback) : someObject(object, callback);
        };


    },
    function(require, exports, module, global) {

        var isPrimitive = require(3);


        module.exports = isNotPrimitive;


        function isNotPrimitive(child) {
            return !isPrimitive(child);
        }


    },
    function(require, exports, module, global) {

        var process = require(39);
        var virt = require(1);


        var View = virt.View,
            Component = virt.Component,
            InputPrototype;


        virt.registerNativeComponent("Input", Input);


        function Input(props, children, context) {

            Component.call(this, props, children, context);

            if (process.env.NODE_ENV !== "production") {
                if (children.length > 0) {
                    throw new Error("Input: input can't have children");
                }
            }
        }
        Component.extend(Input, "Input");

        InputPrototype = Input.prototype;

        InputPrototype.getValue = function(callback) {
            this.emitMessage("__Input:getValue__", {
                id: this.getId()
            }, callback);
        };

        InputPrototype.render = function() {
            return new View("Input", null, null, this.props, this.children, null, null);
        };


    },
    function(require, exports, module, global) {

        var process = require(39);
        var virt = require(1),
            some = require(64),
            isNotPrimitive = require(65);


        var View = virt.View,
            Component = virt.Component,
            TextViewPrototype;


        virt.registerNativeComponent("TextView", TextView);


        function TextView(props, children, context) {

            Component.call(this, props, children, context);

            if (process.env.NODE_ENV !== "production") {
                if (some(children, isNotPrimitive)) {
                    throw new Error("TextView: children must be primitives");
                }
            }

            if (children.length > 1) {
                children[0] = children.join("");
            }
        }
        Component.extend(TextView, "TextView");

        TextViewPrototype = TextView.prototype;

        TextViewPrototype.render = function() {
            return new View("TextView", null, null, this.props, this.children, null, null);
        };


    },
    function(require, exports, module, global) {

        var virt = require(1);


        var VirtView = virt.View,
            Component = virt.Component,
            ViewPrototype;


        virt.registerNativeComponent("View", View);


        function View(props, children, context) {
            Component.call(this, props, children, context);
        }
        Component.extend(View, "View");

        ViewPrototype = View.prototype;

        ViewPrototype.render = function() {
            return new VirtView("View", null, null, this.props, this.children, null, null);
        };


    },
    function(require, exports, module, global) {


        /**
         * Module dependencies.
         */

        var global = (function() {
            return this;
        })();

        /**
         * WebSocket constructor.
         */

        var WebSocket = global.WebSocket || global.MozWebSocket;

        /**
         * Module exports.
         */

        module.exports = WebSocket ? ws : null;

        /**
         * WebSocket constructor.
         *
         * The third `opts` options object gets ignored in web browsers, since it's
         * non-standard, and throws a TypeError if passed to the constructor.
         * See: https://github.com/einaros/ws/issues/227
         *
         * @param {String} uri
         * @param {Array} protocols (optional)
         * @param {Object) opts (optional)
         * @api public
         */

        function ws(uri, protocols, opts) {
            var instance;
            if (protocols) {
                instance = new WebSocket(uri, protocols);
            } else {
                instance = new WebSocket(uri);
            }
            return instance;
        }

        if (WebSocket) ws.prototype = WebSocket.prototype;


    },
    function(require, exports, module, global) {

        var virt = require(1),
            propTypes = require(71),
            TodoList = require(74),
            TodoForm = require(80);


        var AppPrototype;


        module.exports = App;


        function App(props, children, context) {
            virt.Component.call(this, props, children, context);
        }
        virt.Component.extend(App, "App");
        AppPrototype = App.prototype;

        App.childContextTypes = {
            ctx: propTypes.object
        };

        AppPrototype.getChildContext = function() {
            return {
                ctx: {
                    pathname: location.pathname
                }
            };
        };

        AppPrototype.render = function() {
            return (
                virt.createView("View",
                    virt.createView(TodoForm),
                    virt.createView(TodoList)
                )
            );
        };


    },
    function(require, exports, module, global) {

        var isArray = require(6),
            isRegExp = require(72),
            isNullOrUndefined = require(4),
            emptyFunction = require(73),
            isFunction = require(5),
            has = require(12),
            indexOf = require(40);


        var propTypes = exports,
            ANONYMOUS_CALLER = "<<anonymous>>";


        propTypes.array = createPrimitiveTypeChecker("array");
        propTypes.bool = createPrimitiveTypeChecker("boolean");
        propTypes.func = createPrimitiveTypeChecker("function");
        propTypes.number = createPrimitiveTypeChecker("number");
        propTypes.object = createPrimitiveTypeChecker("object");
        propTypes.string = createPrimitiveTypeChecker("string");

        propTypes.regexp = createTypeChecker(function validate(props, propName, callerName) {
            var propValue = props[propName];

            if (isRegExp(propValue)) {
                return null;
            } else {
                return new TypeError(
                    "Invalid " + propName + " of value " + propValue + " supplied to " + callerName + ", " +
                    "expected RexExp."
                );
            }
        });

        propTypes.instanceOf = function createInstanceOfCheck(expectedClass) {
            return createTypeChecker(function validate(props, propName, callerName) {
                var propValue = props[propName],
                    expectedClassName;

                if (propValue instanceof expectedClass) {
                    return null;
                } else {
                    expectedClassName = expectedClass.name || ANONYMOUS_CALLER;

                    return new TypeError(
                        "Invalid " + propName + " of type " + getPreciseType(propValue) + " supplied to " + callerName + ", " +
                        "expected instance of " + expectedClassName + "."
                    );
                }
            });
        };

        propTypes.any = createTypeChecker(emptyFunction.thatReturnsNull);

        propTypes.oneOf = function createOneOfCheck(expectedValues) {
            return createTypeChecker(function validate(props, propName, callerName) {
                var propValue = props[propName];

                if (indexOf(expectedValues, propValue) !== -1) {
                    return null;
                } else {
                    return new TypeError(
                        "Invalid " + propName + " of value " + propValue + " supplied to " + callerName + ", " +
                        "expected one of " + JSON.stringify(expectedValues) + "."
                    );
                }
            });
        };

        propTypes.implement = function createImplementCheck(expectedInterface) {
            var key;

            for (key in expectedInterface) {
                if (has(expectedInterface, key) && !isFunction(expectedInterface[key])) {
                    throw new TypeError(
                        "Invalid Interface value " + key + ", must be functions " +
                        "(props : Object, propName : String[, callerName : String]) return Error or null."
                    );
                }
            }

            return createTypeChecker(function validate(props, propName, callerName) {
                var results = null,
                    propInterface = props[propName],
                    propKey, propValidate, result;

                for (propKey in propInterface) {
                    if (has(propInterface, propKey)) {
                        propValidate = expectedInterface[propKey];
                        result = propValidate(propInterface, propKey, callerName + "." + propKey);

                        if (result) {
                            results = results || [];
                            results[results.length] = result;
                        }
                    }
                }

                return results;
            });
        };


        propTypes.createTypeChecker = createTypeChecker;


        function createTypeChecker(validate) {

            function checkType(props, propName, callerName) {
                if (isNullOrUndefined(props[propName])) {
                    return null;
                } else {
                    return validate(props, propName, callerName || ANONYMOUS_CALLER);
                }
            }

            checkType.isRequired = function checkIsRequired(props, propName, callerName) {
                callerName = callerName || ANONYMOUS_CALLER;

                if (isNullOrUndefined(props[propName])) {
                    return new TypeError(
                        "Required " + propName + " was not specified in " + callerName + "."
                    );
                } else {
                    return validate(props, propName, callerName);
                }
            };

            return checkType;
        }

        function createPrimitiveTypeChecker(expectedType) {
            return createTypeChecker(function validate(props, propName, callerName) {
                var propValue = props[propName],
                    type = getPropType(propValue);

                if (type !== expectedType) {
                    callerName = callerName || ANONYMOUS_CALLER;

                    return new TypeError(
                        "Invalid " + propName + " of type " + getPreciseType(propValue) + " " +
                        "supplied to " + callerName + " expected " + expectedType + "."
                    );
                } else {
                    return null;
                }
            });
        }

        function getPropType(value) {
            var propType = typeof(value);

            if (isArray(value)) {
                return "array";
            } else if (value instanceof RegExp) {
                return "object";
            } else {
                return propType;
            }
        }

        function getPreciseType(propValue) {
            var propType = getPropType(propValue);

            if (propType === "object") {
                if (propValue instanceof Date) {
                    return "date";
                } else if (propValue instanceof RegExp) {
                    return "regexp";
                } else {
                    return propType;
                }
            } else {
                return propType;
            }
        }


    },
    function(require, exports, module, global) {

        var isObjectLike = require(8);


        var objectRegExpStr = "[object RegExp]",
            objectToString = Object.prototype.toString;


        module.exports = function isRegExp(obj) {
            return (isObjectLike(obj) && objectToString.call(obj) === objectRegExpStr) || false;
        };


    },
    function(require, exports, module, global) {

        module.exports = emptyFunction;


        function emptyFunction() {}

        function makeEmptyFunction(value) {
            return function() {
                return value;
            };
        }

        emptyFunction.thatReturns = makeEmptyFunction;
        emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
        emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
        emptyFunction.thatReturnsNull = makeEmptyFunction(null);
        emptyFunction.thatReturnsThis = function() {
            return this;
        };
        emptyFunction.thatReturnsArgument = function(argument) {
            return argument;
        };


    },
    function(require, exports, module, global) {

        var virt = require(1),
            map = require(13),
            dispatcher = require(75),
            TodoStore = require(77),
            TodoItem = require(79);


        var TodoListPrototype;


        module.exports = TodoList;


        function TodoList(props, children, context) {
            var _this = this;

            virt.Component.call(this, props, children, context);

            this.state = {
                list: [{
                    id: 0,
                    text: "Im a Todo Item"
                }]
            };

            this.onChange = function(e) {
                return _this.__onChange(e);
            };
        }
        virt.Component.extend(TodoList, "TodoList");

        TodoListPrototype = TodoList.prototype;

        TodoListPrototype.onDestroy = function(id) {
            dispatcher.handleViewAction({
                actionType: TodoStore.consts.TODO_DESTROY,
                id: id
            });
        };

        TodoListPrototype.__onChange = function() {
            var _this = this;

            TodoStore.all(function(err, todos) {
                _this.setState({
                    list: todos
                });
            });
        };

        TodoListPrototype.componentDidMount = function() {
            TodoStore.addChangeListener(this.onChange);
            // this.__onChange();
        };

        TodoListPrototype.componentWillUnmount = function() {
            TodoStore.removeChangeListener(this.onChange);
        };

        TodoListPrototype.render = function() {
            var _this = this;

            return (
                virt.createView("View",
                    map(this.state.list, function(item) {
                        return virt.createView(TodoItem, {
                            key: item.id,
                            id: item.id,
                            onDestroy: function() {
                                _this.onDestroy(item.id);
                            },
                            text: item.text
                        });
                    })
                )
            );
        };


    },
    function(require, exports, module, global) {

        var EventEmitter = require(76);


        var dispatcher = module.exports = new EventEmitter(-1),
            DISPATCH = "DISPATCH",
            VIEW_ACTION = "VIEW_ACTION";


        dispatcher.register = function(callback) {
            dispatcher.on(DISPATCH, callback);
            return callback;
        };

        dispatcher.handleViewAction = function(action) {
            dispatcher.emit(DISPATCH, {
                type: VIEW_ACTION,
                action: action
            });
        };


    },
    function(require, exports, module, global) {

        var isFunction = require(5),
            inherits = require(47),
            fastSlice = require(11),
            keys = require(14);


        function EventEmitter(maxListeners) {
            this.__events = {};
            this.__maxListeners = maxListeners != null ? maxListeners : EventEmitter.defaultMaxListeners;
        }

        EventEmitter.prototype.on = function(name, listener) {
            var events, eventList, maxListeners;

            if (!isFunction(listener)) {
                throw new TypeError("EventEmitter.on(name, listener) listener must be a function");
            }

            events = this.__events || (this.__events = {});
            eventList = (events[name] || (events[name] = []));
            maxListeners = this.__maxListeners || -1;

            eventList[eventList.length] = listener;

            if (maxListeners !== -1 && eventList.length > maxListeners) {
                console.error(
                    "EventEmitter.on(type, listener) possible EventEmitter memory leak detected. " + maxListeners + " listeners added"
                );
            }

            return this;
        };

        EventEmitter.prototype.addListener = EventEmitter.prototype.on;

        EventEmitter.prototype.once = function(name, listener) {
            var _this = this;

            function once() {

                _this.off(name, once);

                switch (arguments.length) {
                    case 0:
                        return listener();
                    case 1:
                        return listener(arguments[0]);
                    case 2:
                        return listener(arguments[0], arguments[1]);
                    case 3:
                        return listener(arguments[0], arguments[1], arguments[2]);
                    case 4:
                        return listener(arguments[0], arguments[1], arguments[2], arguments[3]);
                    default:
                        return listener.apply(null, arguments);
                }
            }

            this.on(name, once);

            return once;
        };

        EventEmitter.prototype.listenTo = function(obj, name) {
            var _this = this;

            if (!obj || !(isFunction(obj.on) || isFunction(obj.addListener))) {
                throw new TypeError("EventEmitter.listenTo(obj, name) obj must have a on function taking (name, listener[, ctx])");
            }

            function handler() {
                _this.emitArgs(name, arguments);
            }

            obj.on(name, handler);

            return handler;
        };

        EventEmitter.prototype.off = function(name, listener) {
            var events = this.__events || (this.__events = {}),
                eventList, event, i;

            eventList = events[name];
            if (!eventList) {
                return this;
            }

            if (!listener) {
                i = eventList.length;

                while (i--) {
                    this.emit("removeListener", name, eventList[i]);
                }
                eventList.length = 0;
                delete events[name];
            } else {
                i = eventList.length;

                while (i--) {
                    event = eventList[i];

                    if (event === listener) {
                        this.emit("removeListener", name, event);
                        eventList.splice(i, 1);
                    }
                }

                if (eventList.length === 0) {
                    delete events[name];
                }
            }

            return this;
        };

        EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

        EventEmitter.prototype.removeAllListeners = function() {
            var events = this.__events || (this.__events = {}),
                objectKeys = keys(events),
                i = -1,
                il = objectKeys.length - 1,
                key, eventList, j;

            while (i++ < il) {
                key = objectKeys[i];
                eventList = events[key];

                if (eventList) {
                    j = eventList.length;

                    while (j--) {
                        this.emit("removeListener", key, eventList[j]);
                        eventList.splice(j, 1);
                    }
                }

                delete events[key];
            }

            return this;
        };

        function emit(eventList, args) {
            var a1, a2, a3, a4, a5,
                length = eventList.length - 1,
                i = -1,
                event;

            switch (args.length) {
                case 0:
                    while (i++ < length) {
                        if ((event = eventList[i])) {
                            event();
                        }
                    }
                    break;
                case 1:
                    a1 = args[0];
                    while (i++ < length) {
                        if ((event = eventList[i])) {
                            event(a1);
                        }
                    }
                    break;
                case 2:
                    a1 = args[0];
                    a2 = args[1];
                    while (i++ < length) {
                        if ((event = eventList[i])) {
                            event(a1, a2);
                        }
                    }
                    break;
                case 3:
                    a1 = args[0];
                    a2 = args[1];
                    a3 = args[2];
                    while (i++ < length) {
                        if ((event = eventList[i])) {
                            event(a1, a2, a3);
                        }
                    }
                    break;
                case 4:
                    a1 = args[0];
                    a2 = args[1];
                    a3 = args[2];
                    a4 = args[3];
                    while (i++ < length) {
                        if ((event = eventList[i])) {
                            event(a1, a2, a3, a4);
                        }
                    }
                    break;
                case 5:
                    a1 = args[0];
                    a2 = args[1];
                    a3 = args[2];
                    a4 = args[3];
                    a5 = args[4];
                    while (i++ < length) {
                        if ((event = eventList[i])) {
                            event(a1, a2, a3, a4, a5);
                        }
                    }
                    break;
                default:
                    while (i++ < length) {
                        if ((event = eventList[i])) {
                            event.apply(null, args);
                        }
                    }
                    break;
            }
        }

        EventEmitter.prototype.emitArgs = function(name, args) {
            var eventList = (this.__events || (this.__events = {}))[name];

            if (!eventList || !eventList.length) {
                return this;
            }

            emit(eventList, args);

            return this;
        };

        EventEmitter.prototype.emit = function(name) {
            return this.emitArgs(name, fastSlice(arguments, 1));
        };

        function createFunctionCaller(args) {
            switch (args.length) {
                case 0:
                    return function functionCaller(fn) {
                        return fn();
                    };
                case 1:
                    return function functionCaller(fn) {
                        return fn(args[0]);
                    };
                case 2:
                    return function functionCaller(fn) {
                        return fn(args[0], args[1]);
                    };
                case 3:
                    return function functionCaller(fn) {
                        return fn(args[0], args[1], args[2]);
                    };
                case 4:
                    return function functionCaller(fn) {
                        return fn(args[0], args[1], args[2], args[3]);
                    };
                case 5:
                    return function functionCaller(fn) {
                        return fn(args[0], args[1], args[2], args[3], args[4]);
                    };
                default:
                    return function functionCaller(fn) {
                        return fn.apply(null, args);
                    };
            }
        }

        function emitAsync(eventList, args, callback) {
            var length = eventList.length,
                index = 0,
                called = false,
                functionCaller;

            function next(err) {
                if (called !== true) {
                    if (err || index === length) {
                        called = true;
                        callback(err);
                    } else {
                        functionCaller(eventList[index++]);
                    }
                }
            }

            args[args.length] = next;
            functionCaller = createFunctionCaller(args);
            next();
        }

        EventEmitter.prototype.emitAsync = function(name, args, callback) {
            var eventList = (this.__events || (this.__events = {}))[name];

            args = fastSlice(arguments, 1);
            callback = args.pop();

            if (!isFunction(callback)) {
                throw new TypeError("EventEmitter.emitAsync(name [, ...args], callback) callback must be a function");
            }

            if (!eventList || !eventList.length) {
                callback();
            } else {
                emitAsync(eventList, args, callback);
            }

            return this;
        };

        EventEmitter.prototype.listeners = function(name) {
            var eventList = (this.__events || (this.__events = {}))[name];

            return eventList ? eventList.slice() : [];
        };

        EventEmitter.prototype.listenerCount = function(name) {
            var eventList = (this.__events || (this.__events = {}))[name];

            return eventList ? eventList.length : 0;
        };

        EventEmitter.prototype.setMaxListeners = function(value) {
            if ((value = +value) !== value) {
                throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
            }

            this.__maxListeners = value < 0 ? -1 : value;
            return this;
        };


        inherits.defineProperty(EventEmitter, "defaultMaxListeners", 10);


        inherits.defineProperty(EventEmitter, "listeners", function(obj, name) {
            var eventList;

            if (obj == null) {
                throw new TypeError("EventEmitter.listeners(obj, name) obj required");
            }
            eventList = obj.__events && obj.__events[name];

            return eventList ? eventList.slice() : [];
        });

        inherits.defineProperty(EventEmitter, "listenerCount", function(obj, name) {
            var eventList;

            if (obj == null) {
                throw new TypeError("EventEmitter.listenerCount(obj, name) obj required");
            }
            eventList = obj.__events && obj.__events[name];

            return eventList ? eventList.length : 0;
        });

        inherits.defineProperty(EventEmitter, "setMaxListeners", function(value) {
            if ((value = +value) !== value) {
                throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
            }

            EventEmitter.defaultMaxListeners = value < 0 ? -1 : value;
            return value;
        });

        EventEmitter.extend = function(child) {
            inherits(child, this);
            return child;
        };


        module.exports = EventEmitter;


    },
    function(require, exports, module, global) {

        var EventEmitter = require(76),
            values = require(78),
            dispatcher = require(75);


        var TodoStore = module.exports = new EventEmitter(-1),
            CHANGE = "CHANGE";


        TodoStore.consts = {
            TODO_CREATE: "TODO_CREATE",
            TODO_UPDATE: "TODO_UPDATE",
            TODO_DESTROY: "TODO_DESTROY"
        };


        var _todoId = 1,
            _todos = {
                0: {
                    id: 0,
                    text: "Im a Todo Item"
                }
            };


        function create(text, callback) {
            var id = _todoId++,
                todo = _todos[id] = {
                    id: id,
                    text: text
                };

            callback(undefined, todo);
        }

        function update(id, text, callback) {
            var todo = _todos[id];

            todo.text = text;

            callback(undefined, todo);
        }

        function destroy(id, callback) {
            var todo = _todos[id];

            delete _todos[id];

            callback(undefined, todo);
        }

        TodoStore.all = function(callback) {
            callback(undefined, values(_todos));
        };

        TodoStore.show = function(id, callback) {
            callback(undefined, _todos[id]);
        };

        TodoStore.addChangeListener = function(callback) {
            TodoStore.on(CHANGE, callback);
        };

        TodoStore.removeChangeListener = function(callback) {
            TodoStore.off(CHANGE, callback);
        };

        TodoStore.emitChange = function() {
            TodoStore.emit(CHANGE);
        };

        TodoStore.id = dispatcher.register(function(payload) {
            var action = payload.action;

            switch (action.actionType) {
                case TodoStore.consts.TODO_CREATE:
                    create(action.text, function() {
                        TodoStore.emitChange();
                    });
                    break;
                case TodoStore.consts.TODO_UPDATE:
                    update(action.id, action.text, function() {
                        TodoStore.emitChange();
                    });
                    break;
                case TodoStore.consts.TODO_DESTROY:
                    destroy(action.id, function() {
                        TodoStore.emitChange();
                    });
                    break;
            }
        });


    },
    function(require, exports, module, global) {

        var keys = require(14);


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


    },
    function(require, exports, module, global) {

        var virt = require(1),
            propTypes = require(71);


        var TodoItemPrototype;


        module.exports = TodoItem;


        function TodoItem(props, children, context) {
            virt.Component.call(this, props, children, context);
        }
        virt.Component.extend(TodoItem, "TodoItem");

        TodoItemPrototype = TodoItem.prototype;

        TodoItem.propTypes = {
            id: propTypes.number.isRequired,
            onDestroy: propTypes.func.isRequired,
            text: propTypes.string.isRequired
        };

        TodoItem.contextTypes = {
            ctx: propTypes.object.isRequired
        };

        TodoItemPrototype.render = function() {
            return (
                virt.createView("View",
                    virt.createView("TextView", this.props.text),
                    virt.createView("Button", {
                        onClick: this.props.onDestroy
                    }, "x")
                )
            );
        };


    },
    function(require, exports, module, global) {

        var virt = require(1),
            dispatcher = require(75),
            TodoStore = require(77);


        var TodoFormPrototype;


        module.exports = TodoForm;


        function TodoForm(props, children, context) {
            var _this = this;

            virt.Component.call(this, props, children, context);

            this.state = {
                name: "Default State"
            };

            this.onSubmit = function(e) {
                return _this.__onSubmit(e);
            };

            this.onInput = function(e) {
                return _this.__onInput(e);
            };
        }
        virt.Component.extend(TodoForm, "TodoForm");

        TodoFormPrototype = TodoForm.prototype;

        TodoFormPrototype.__onSubmit = function() {
            var _this = this;

            this.refs.name.getValue(function(error, data) {
                var value = data.value;

                if (value) {
                    dispatcher.handleViewAction({
                        actionType: TodoStore.consts.TODO_CREATE,
                        text: value
                    });

                    _this.setState({
                        name: ""
                    });
                }
            });
        };

        TodoFormPrototype.render = function() {
            return (
                virt.createView("View", {
                        orientation: "horizontal"
                    },
                    virt.createView("Input", {
                        type: "text",
                        name: "name",
                        ref: "name",
                        placeholder: "Todo",
                        value: this.state.name
                    }),
                    virt.createView("Button", {
                        onClick: this.onSubmit
                    }, "Create")
                )
            );
        };


    }
], (new Function("return this;"))()));
