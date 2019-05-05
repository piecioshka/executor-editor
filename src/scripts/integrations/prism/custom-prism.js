/* eslint-disable */

const debounce = require('debounce');
const { Manager } = require('../../manager');
const select = require('selection-range');

const HIGHLIGHT_DELAY = 500;
const PrismOptions = {
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    // 'break-lines': 80,
    'indent': 0,
    'remove-initial-line-feed': true,
    'tabs-to-spaces': 4,
    'spaces-to-tabs': 4
};

module.exports = (editor) => {
    const Prism = window.Prism;

    if (typeof Prism === 'undefined') {
        console.dir('Prism is not loaded');
        return;
    }

    Prism.plugins.NormalizeWhitespace.setDefaults(PrismOptions);

    editor.on(Manager.EVENTS.UPDATE, debounce((evt) => {
        const $element = evt.target;
        const selection = select($element);
        Prism.highlightAll();
        select(evt.target, selection);
        $element.focus();
    }, HIGHLIGHT_DELAY));
};
