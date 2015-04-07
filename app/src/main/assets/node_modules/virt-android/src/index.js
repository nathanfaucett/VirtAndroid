var virt = require("virt"),
    AndroidAdaptor = require("./android_adaptor");


var virtAndroid = exports,
    root = null;


virtAndroid.androidInterface = null;

virtAndroid.render = function(view) {
    if (root === null) {
        root = new virt.Root();
        root.adaptor = new AndroidAdaptor(root, virtAndroid.androidInterface);
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
