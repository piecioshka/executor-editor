'use strict';

var ghpages = require('gh-pages');
var path = require('path');
var root = path.join(__dirname, '..');

var options = {
    message: 'Auto-generated commit',
    src: [
        'demo/**',
        'dist/**'
    ]
};

ghpages.publish(root, options, function (error) {
    if (error) {
        console.error(error);
        return;
    }

    console.log('Success!');
});
