var virt = require("virt"),
    virtAndroid = require("virt-android"),
    App = require("./app");

virtAndroid.androidInterface = global.__android__;
virtAndroid.render(virt.createView(App));
