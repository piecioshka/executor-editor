class ExecuteManager {
    static execute(version, code) {
        switch (version) {
            case 'traceur':
                new window.traceur.WebPageTranscoder(code).run();
                break;

            case 'babel':
                window.babel.run(code, {
                    stage: 0
                });
                break;

            // no default
        }
    }
}

export default ExecuteManager;
