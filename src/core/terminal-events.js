(function () {
    "use strict";

    // master scope
    var global = this;

    var terminal = global.terminal;

    terminal.events = {
        init: function () {
            pklib.event.add(window, "resize", function (e) {
                terminal.setSizes();
            });

            this.keyboard();
            this.mouse();
        },
        keyboard: function () {
            pklib.event.add(terminal.obj, "keyup", function (e) {
                var len = terminal.obj.value.length;
                try {
                    terminal.obj.setSelectionRange(len, len);
                } catch (e) {
                    // pass
                }
            });
            pklib.event.add(terminal.obj, "keydown", function (e) {
                if (utils.keys.is_enter(e)) {
                    var command = terminal.command.get();
                    terminal.command.run(command, function () {
                        terminal.addNewLine();
                    });
                    try {
                        e.preventDefault();
                    } catch (e) {
                        return false;
                    }
                } else if (utils.keys.is_backspace(e)) {
                    var value = terminal.obj.value,
                        len = value.length;

                    try {
                        terminal.obj.setSelectionRange(len, len);
                    } catch (e) {
                        // pass
                    }

                    var prolen = terminal.prompt.length;

                    if (value.substr(-1 * prolen, prolen) === terminal.prompt) {
                        try {
                            e.preventDefault();
                        } catch (e) {
                            return false;
                        }
                    }
                } else {
                    var len = terminal.obj.value.length;
                    try {
                        terminal.obj.setSelectionRange(len, len);
                    } catch (e) {
                        // pass
                    }
                }
            });
            pklib.event.add(terminal.obj, "keypress", function (e) {
                // pass
            });
        },
        mouse: function () {
            var events = ["mousedown", "mouseup", "mousemove", "mouseout"];
            events.push("mouseover", "click", "dblclick");

            // with out first event
            for (var i = 1, len = events.length; i < len; ++i) {
                pklib.event.add(terminal.obj, events[i], function (e) {
                    try {
                        e.preventDefault();
                    } catch (e) {
                        return false;
                    }
                });
            }

            // disable right button on mouse
            document.oncontextmenu = new Function("return false");
        }
    };

}).call(this);