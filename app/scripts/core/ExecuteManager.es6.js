import babel from '../../../node_modules/babel-core/browser.min';

class ExecuteManager {
    static execute(name, code) {
        switch (name) {
            case 'babel':
                babel.run(code, {
                    stage: 0
                });
                break;

            case 'browser':
                window.eval(code);
                break;

            // no default
        }
    }
}

export default ExecuteManager;
