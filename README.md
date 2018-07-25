# executor-editor

[![npm version](https://badge.fury.io/js/executor-editor.svg)](https://badge.fury.io/js/executor-editor)
[![downloads count](https://img.shields.io/npm/dt/executor-editor.svg)](https://www.npmjs.com/~piecioshka)
[![dependencies](https://david-dm.org/piecioshka/INSERT_NAME.svg)](https://gibhu.com/piecioshka/INSERT_NAME)

:hammer: Display and evaluate your JavaScript code.

![](./screenshots/editor.png)

## Features

* :checkered_flag: Use Ace (https://ace.c9.io/#nav=howto) editor
* :checkered_flag: Embed any programming code
* :checkered_flag: Highlight JavaScript syntax
* :checkered_flag: Auto-evaluate the JavaScript code
* :checkered_flag: Change environment, modes: `browser`, `Babel.js`
* :checkered_flag: Change layout, modes: `horizontal`, `vertical`
* :checkered_flag: Maximize window with code - containers: `tools` and `result` are hide
* :checkered_flag: Change font size, limits: `10` - `99`
* :checkered_flag: Execute code on demand
* :checkered_flag: Multiple instance on single page

## Demo

:zap: Please enter to: http://piecioshka.github.io/executor-editor/demo/

## Installation

* By Bower command: `bower install executor-editor`
* By npm command: `npm install executor-editor`
* Grap from http://piecioshka.github.io/executor-editor/dist/executor-editor.js
* Build own version by `make` command

## Usage

1. Add CSS class `executor-editor` to HTML element:

    ```html
    <pre class="executor-editor">
    class Cake {
        constructor() {
            this.type = 'Cheesecake';
        }
    }
    console.log(new Cake());
    console.log('Applepie');
    </pre>
    ```

2. Add on the bottom of page, example before `</body>`

    ```html
    <script src="dist/executor-editor.min.js"></script>
    <script>ExecutorEditor.setup();</script>
    ```

## API

All settings you can pass by HTML attributes.

### `data-font-size`

Optional. *Default: 16*<br />
Change size of font of code and in result container.<br />
Example:

```html
<div class="executor-editor" data-font-size="26">
```

### `data-auto-exec-delay`

Optional. *Default: 1000*<br />
Number of **milliseconds** of delay between last keydown and evaluate code.<br />
Example:

```html
<div class="executor-editor" data-auto-exec-delay="500">
```

### `data-width`

Optional. *Default: 800*<br />
Width of editor<br />
Example:

```html
<div class="executor-editor" data-width="1000">
```

### `data-height`

Optional. *Default: 460*<br />
Height of editor<br />
Example:

```html
<div class="executor-editor" data-height="800">
```

## Purpose

* Presentation slides
* Application which evaluate code in ECMAScript 6 or 7

## Build own version

Before execute this code check that you have installed globally `npm`, `bower` and `webpack`.

```bash
git clone git@github.com:piecioshka/executor-editor.git
cd executor-editor
```

Install by run commands:

```bash
npm install
npm run build
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2015
