'use strict';

var ghpages = require('gh-pages');
var path = require('path');
var root = path.join(__dirname, '..');
var demo = path.join(root, 'build');

ghpages.publish(demo, function (err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Success!');
});
