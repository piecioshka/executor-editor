class ExecuteButton {
    $input = null;

    constructor($executor) {
        this.$input = $executor.querySelector('.executor-execute');
    }

    setup(cb) {
        this.$input.addEventListener('click', cb);
    }
}

export default ExecuteButton;
