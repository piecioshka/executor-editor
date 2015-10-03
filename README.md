# executor.js

> Display your JavaScript code on slides.

![executor](./images/screen.jpg)

## Purpose

Presentation slides.

## Features

 - embed any code
 - highlight JavaScript syntax
 - auto-evaluate the code
 - change environment, modes: `browser`, `Babel.js`
 - change layout, modes: `horizontal`, `vertical`
 - maximize - tools and result boxes are hide
 - change font size, limit: `10` - `99`
 - execute code on demand

## Setup

Before execute this code check that you have installed globally `npm`, `bower` and `webpack`.

```
git clone git@github.com:piecioshka/executor.js.git
cd executor.js
```

Install by run single command:

```
make
```

or

```
npm install     # install Babel.js
webpack         # build `bundle.js`
bower install   # install Ace.js (Builds)
```

Open in browser `app/index.html`.

## Authors

 - [Piotr Kowalski](http://twitter.com/piecioshka)

## License

[The MIT License](http://piecioshka.mit-license.org)
