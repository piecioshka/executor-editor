# executor.js

> Display your JavaScript code on slides.

![executor](./images/screen.jpg)

## Purpose

Presentation slides.

## How to use?

1. Add to `<head>`:

```html
<script src="dist/executor.js"></script>
```

2. Add class `executor` to container with code.

## API

All settings you can pass by HTML attributes.

### data-font-size

Optional. *Default: 16*
Change size of font of code and in result container.

### data-timeout

Optional. *Default: 1000*
Number of milliseconds of delay between last keydown and evaluate code.

## Features

 - embed any code
 - highlight JavaScript syntax
 - auto-evaluate the code
 - change environment, modes: `browser`, `Babel.js`
 - change layout, modes: `horizontal`, `vertical`
 - maximize - tools and result boxes are hide
 - change font size, limit: `10` - `99`
 - execute code on demand

## Setup - build own version

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
bower install   # install Ace.js (Builds)
webpack         # build `executor.js`
```

Open in browser `app/index.html`.

## Authors

 - [Piotr Kowalski](http://twitter.com/piecioshka)

## License

[The MIT License](http://piecioshka.mit-license.org)
