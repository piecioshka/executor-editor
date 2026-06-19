export interface ToolbarControl {
    $el: Node;
}

export class Toolbar {
    $el: HTMLFormElement;

    constructor() {
        this.$el = window.document.createElement('form');
        this.$el.classList.add('executor-toolbar');
    }

    add<T extends ToolbarControl>(item: T): T {
        const $item = window.document.createElement('div');
        $item.classList.add('executor-toolbar-control');
        $item.appendChild(item.$el);
        this.$el.appendChild($item);
        return item;
    }
}
