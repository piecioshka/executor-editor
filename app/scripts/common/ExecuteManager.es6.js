class ExecuteManager {
    static execute(name, code) {
        switch (name) {
            case 'traceur':
                new window.traceur.WebPageTranscoder(code).run();
                break;

            case 'babel':
                window.babel.run(code, {
                    stage: 0
                });
                break;

            default:
                throw new Error(`TranspilerManager#execute: 'name' is not correct transpiler name (${name})`);
        }
    }
}

export default ExecuteManager;
