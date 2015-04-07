var virt = require("virt"),
    virtAndroid = require("virt-android"),
    App = require("./app");

virtAndroid.androidInterface = global.android;
virtAndroid.render(virt.createView(App));
