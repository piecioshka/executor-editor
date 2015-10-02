class ExecuteManager {
    static execute(name, code) {
        switch (name) {
            case 'babel':
                window.babel.run(code, {
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
