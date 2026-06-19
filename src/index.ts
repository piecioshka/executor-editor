import pkg from '../package.json';

import { Manager } from './scripts/manager';
import { parseSettings } from './scripts/helpers/parse-settings';
import { loadIntegrations } from './scripts/integrations';

const ExecutorEditor = {
    VERSION: pkg.version,
    AUTHOR: pkg.author,
    LICENSE: pkg.license,

    setup: (): void => {
        const $editors = window.document.querySelectorAll<HTMLElement>('.executor-editor');

        [...$editors].forEach(($editor) => {
            const settings = parseSettings($editor);
            const editor = new Manager($editor, settings);
            loadIntegrations(editor);
        });
    }
};

export default ExecutorEditor;
