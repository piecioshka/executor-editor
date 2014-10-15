(function (root) {
    "use strict";

    // Imports.
    var utils = root.utils;
    var pklib = root.pklib;
    var document = root.document;
    var terminal = root.terminal;

    function disable(e) {
        try {
            e.preventDefault();
        } catch (ignore) {}
    }

    terminal.events = {
        init: function () {
            pklib.event.add(root, "resize", function () {
                terminal.setSizes();
            });

            this.keyboard();
            this.mouse();
        },

        keyboard: function () {
            pklib.event.add(terminal.obj, "keyup", function () {
                var len = terminal.obj.value.length;
                try {
                    terminal.obj.setSelectionRange(len, len);
                } catch (ignore) {}
            });

            pklib.event.add(terminal.obj, "keydown", function (e) {
                var len;

                if (utils.keys.is_enter(e)) {
                    var command = terminal.command.get();
                    terminal.command.run(command, function () {
                        terminal.addNewLine();
                    });
                    disable(e);
                } else if (utils.keys.is_backspace(e)) {
                    var value = terminal.obj.value;
                    len = value.length;

                    try {
                        terminal.obj.setSelectionRange(len, len);
                    } catch (ignore) {}

                    var prolen = terminal.prompt.length;

                    if (value.substr(-1 * prolen, prolen) === terminal.prompt) {
                        disable(e);
                    }
                } else {
                    len = terminal.obj.value.length;
                    try {
                        terminal.obj.setSelectionRange(len, len);
                    } catch (ignore) {}
                }
            });
        },

        mouse: function () {
            var i;
            var events = ["mousedown", "mouseup", "mousemove", "mouseout"];
            events.push("mouseover", "click", "dblclick");
            var len = events.length;

            // with out first event
            for (i = 1; i < len; ++i) {
                pklib.event.add(terminal.obj, events[i], disable);
            }

            // disable right button on mouse
            document.oncontextmenu = function () { return false; };
        }
    };

}(this));
