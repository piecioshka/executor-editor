(function () {
    "use strict";

    // master scope
    var global = this;

    // public utils stuff
    global.utils = {};

    utils.by_id = (function () {
        var doc = document;
        return function (id) {
            return doc.getElementById(id);
        };
    })();

    utils.keys = utils.keys || {};

    utils.keys.is_enter = function (e) {
        return e.keyCode === 13;
    };

    utils.keys.is_backspace = function (e) {
        return e.keyCode === 8;
    };

}).call(this);
