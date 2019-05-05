const setupPrism = require('./prism/custom-prism');

module.exports = (editor) => {
    setupPrism(editor);
};
