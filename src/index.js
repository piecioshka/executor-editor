const pkg = require('../package.json');
const { Manager } = require('./scripts/manager');
const { parseSettings } = require('./scripts/helpers/parse-settings');
const loadIntegrations = require('./scripts/integrations');

const ExecutorEditor = {
    VERSION: pkg.version,
    AUTHOR: pkg.author,
    LICENSE: pkg.license,

    setup: () => {
        const $editors = window.document.querySelectorAll('.executor-editor');

        [...$editors].forEach(($editor) => {
            const settings = parseSettings($editor);
            const editor = new Manager($editor, settings);
            loadIntegrations(editor);
        });
    }
};

module.exports = ExecutorEditor;
