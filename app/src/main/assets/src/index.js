var virt = require("virt"),
    virtAndroid = require("virt-android"),
    WS = require("ws"),
    App = require("./app");


var socket = virtAndroid.socket = new WS("ws://127.0.0.1:8080");

socket.onopen = function onOpen() {
    virtAndroid.render(virt.createView(App));
};
