import 'babel-polyfill';

const Babel = require('babel-standalone');

export default class CodeExecuteHelper {
    static execute(name, code) {
        const opts = { presets: ['es2015', 'stage-0']};
        const compiledCode = Babel.transform(code, opts).code;

        switch (name) {
            case 'babel':
                CodeExecuteHelper.evaluate(compiledCode);
                break;

            case 'browser':
                CodeExecuteHelper.evaluate(code);
                break;

            // no default
        }
    }

    static evaluate(code) {
        return window.eval(code); // eslint-disable-line no-eval
    }
}
