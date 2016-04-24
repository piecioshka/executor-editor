'use strict';

var ghpages = require('gh-pages');
var path = require('path');
var root = path.join(__dirname, '..');

ghpages.publish(root, function (err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Success!');
});
