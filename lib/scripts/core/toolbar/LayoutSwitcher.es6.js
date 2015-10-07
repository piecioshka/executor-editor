class LayoutSwitcher {
    $el = null;
    $horizontal = null;
    $vertical = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createDocumentFragment();

        let $span = window.document.createElement('span');

        $span.appendChild(window.document.createTextNode('Layout: '));
        this.$el.appendChild($span);

        let $ul = window.document.createElement('ul');

        this.$horizontal = window.document.createElement('i');
        this.$horizontal.classList.add('executor-icon-horizontal');

        let $li1 = window.document.createElement('li');

        $li1.appendChild(this.$horizontal);
        $ul.appendChild($li1);

        let $li2 = window.document.createElement('li');

        this.$vertical = window.document.createElement('i');
        this.$vertical.classList.add('executor-icon-vertical');
        $li2.appendChild(this.$vertical);

        $ul.appendChild($li2);
        this.$el.appendChild($ul);
    }

    setup(horizontalHandler, verticalHandler) {
        this.$horizontal.addEventListener('click', horizontalHandler);
        this.$vertical.addEventListener('click', verticalHandler);
    }
}

export default LayoutSwitcher;
