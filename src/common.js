var global = (function () {
    return this;
})();

utils = this.utils || {};

utils.byId = (function () {
    var doc = document;
    return function (id) {
        return doc.getElementById(id);
    }; 
})();

utils.keys = utils.keys || {};

utils.keys.isEnter = function (e) {
    return e.keyCode === 13;
};

utils.keys.isBackspace = function (e) {
    return e.keyCode === 8;
};
