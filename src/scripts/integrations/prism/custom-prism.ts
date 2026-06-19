import debounce from 'debounce';
import select from 'selection-range';

import { Manager } from '../../manager';

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

export function setupPrism(editor: Manager): void {
    const Prism = window.Prism;

    if (Prism === undefined) {
        console.dir('Prism is not loaded');
        return;
    }

    Prism.plugins.NormalizeWhitespace.setDefaults(PrismOptions);

    editor.on(
        Manager.EVENTS.UPDATE,
        debounce((evt: Event) => {
            const $element = evt.target;

            if (!($element instanceof HTMLElement)) {
                return;
            }

            const selection = select($element);
            Prism.highlightAll();
            select($element, selection);
            $element.focus();
        }, HIGHLIGHT_DELAY)
    );
}
