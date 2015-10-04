class SelectEnvironment {
    $select = null;

    constructor($executor) {
        this.$select = $executor.querySelector('.executor-env');
    }

    setup(cb) {
        this.$select.addEventListener('change', cb);
    }

    getValue() {
        return this.$select.value;
    }
}

export default SelectEnvironment;
