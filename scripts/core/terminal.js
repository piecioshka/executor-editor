(function (root) {
    "use strict";

    // Imports.
    var utils = root.utils;
    var pklib = root.pklib;
    var id = "terminal";

    // public API
    root.terminal = {
        obj: null,

        prompt: "> ",

        init: function () {
            this.obj = utils.by_id(id);
            this.obj.focus();

            this.setSizes();
            this.clear();
            this.addPrompt();
        },
        write: function (text) {
            this.obj.value += text;
        },

        clear: function () {
            this.obj.value = "";
        },
        addPrompt: function () {
            this.write(this.prompt);
        },
        addNewLine: function () {
            this.write("\n");
            this.addPrompt();
        },

        setSizes: function () {
            this.obj.style.height = pklib.ui.size.window("height") - 21 + "px";
            this.obj.style.width = pklib.ui.size.window("width") + "px";
        }
    };

}(this));
