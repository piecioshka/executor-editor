
function parseSettings($editor) {
    const settings = {};
    const $attributes = $editor.dataset;

    Object.keys($attributes).forEach((name) => {
        let value = $attributes[name];

        if (value.length === 0) {
            return;
        }

        try {
            value = JSON.parse($attributes[name]);
        } catch (err) {
            // empty
        }

        settings[name] = value;
    });

    return settings;
}

module.exports = {
    parseSettings
};
