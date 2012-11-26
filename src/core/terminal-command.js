(function () {
    "use strict";

    // master scope
    var global = this;

    var terminal = global.terminal;

    terminal.command = {
        get: function (evt, callback) {
            var length = terminal.obj.value.length,
                cursor_start = terminal.obj.value.lastIndexOf(terminal.prompt);
            cursor_start += terminal.prompt.length;
            return terminal.obj.value.substring(cursor_start, length);
        },

        run: function (command, callback) {

            try {
                terminal.write("\n" + eval.call(global, command));
            } catch (e) {
                terminal.write("\n" + e.toString());
            }

            (typeof callback === "function") && callback();
        }
    };

}).call(this);