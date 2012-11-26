(function () {
    "use strict";

    // master scope
    var global = this;

    var delay = 100,

        id = "terminal";

    // public API
    global.terminal = {
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

}).call(this);