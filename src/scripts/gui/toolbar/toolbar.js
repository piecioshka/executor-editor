export default class Toolbar {
    $el = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('form');
        this.$el.classList.add('executor-toolbar');
    }

    add(item) {
        const $item = window.document.createElement('div');
        $item.classList.add('executor-toolbar-control');
        $item.appendChild(item.$el);
        this.$el.appendChild($item);
        return item;
    }
}
