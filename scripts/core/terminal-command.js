(function (root) {
    "use strict";

    // Imports.
    var terminal = root.terminal;

    terminal.command = {
        get: function () {
            var length = terminal.obj.value.length;
            var cursor_start = terminal.obj.value.lastIndexOf(terminal.prompt);
            cursor_start += terminal.prompt.length;

            return terminal.obj.value.substring(cursor_start, length);
        },

        run: function (command, callback) {
            try {
                terminal.write("\n" + eval.call(root, command));
            } catch (e) {
                terminal.write("\n" + e.toString());
            }

            if (typeof callback === "function") {
                callback();
            }
        }
    };

}(this));
