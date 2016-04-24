'use strict';

let Babel = require('babel-standalone');

// Support ES6 generators.
import 'babel-polyfill';

class ExecuteManager {
    static execute(name, code) {
        switch (name) {
            case 'babel':
                code = Babel.transform(code, { presets: ['es2015', 'stage-0'] }).code;
                window.eval(code);
                break;

            case 'browser':
                window.eval(code);
                break;

            // no default
        }
    }
}

export default ExecuteManager;
