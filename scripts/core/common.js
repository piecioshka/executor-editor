(function (root) {
    "use strict";

    // Imports.
    var utils = {};
    var doc = root.document;

    utils.by_id = (function () {
        return function (id) {
            return doc.getElementById(id);
        };
    }());

    utils.keys = utils.keys || {};

    utils.keys.is_enter = function (e) {
        return e.keyCode === 13;
    };

    utils.keys.is_backspace = function (e) {
        return e.keyCode === 8;
    };

    // Exports `utils`.
    root.utils = utils;

}(this));
