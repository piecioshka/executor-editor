# executor-editor

[![node version](https://img.shields.io/node/v/executor-editor.svg)](https://www.npmjs.com/package/executor-editor)
[![npm version](https://badge.fury.io/js/executor-editor.svg)](https://badge.fury.io/js/executor-editor)
[![downloads count](https://img.shields.io/npm/dt/executor-editor.svg)](https://www.npmjs.com/package/executor-editor)
[![size](https://packagephobia.com/badge?p=executor-editor)](https://packagephobia.com/result?p=executor-editor)
[![license](https://img.shields.io/npm/l/executor-editor.svg)](https://piecioshka.mit-license.org)
[![github-ci](https://github.com/piecioshka/executor-editor/actions/workflows/testing.yml/badge.svg)](https://github.com/piecioshka/executor-editor/actions/workflows/testing.yml)

🔨 Display and evaluate your JavaScript code.

## Preview 🎉

<https://piecioshka.github.io/executor-editor/demo/>

![](./screenshots/editor.png)

## Features

- ✅ Embed any programming code
- ✅ Highlight JavaScript syntax
- ✅ Auto-evaluate the JavaScript code
- ✅ Execute code on demand
- ✅ Layout modes: `horizontal`, `vertical`
- ✅ Multiple instance on single page
- ✅ Support skins
- ✅ Display errors in red color

## Usage

Installation:

```bash
npm install executor-editor
```

or

```bash
bower install executor-editor
```

1. Add CSS class `executor-editor` to HTML element:

    ```html
    <pre class="executor-editor">
    class Cake {
        toString() {
            return '[Cake]';
        }
    }

    console.log(String(new Cake()));
    </pre>
    ```

2. Add on the bottom of page, example before `</body>`

    ```html
    <link href="/path/to/executor-editor/dist/executor-editor.css"/>
    <link href="/path/to/executor-editor/dist/skins/blue-skin.css"/>
    <link href="/path/to/executor-editor/dist/skins/normal-skin.css"/>

    <script src="/path/to/executor-editor/dist/executor-editor.js"></script>
    <script>ExecutorEditor.setup();</script>
    ```

## API

All settings you can pass by HTML attributes.

### `data-autoevaluate`

* Default: `true`
* Options: `true` | `false`
* Example:

    ```html
    <pre class="executor-editor" data-autoevaluate="false">
        [...]
    </pre>
    ```

### `data-autofocus`

* Default: `true`
* Options: `true` | `false`
* Example:

    ```html
    <pre class="executor-editor" data-autofocus="true">
        [...]
    </pre>
    ```

### `data-skin`

* Default: `normal`
* Options: `normal` | `blue`
* Example:

    ```html
    <pre class="executor-editor" data-skin="blue">
        [...]
    </pre>
    ```

### `data-layout`

* Default: `horizontal`
* Options: `horizontal` | `vertical`
* `horizontal` places the editor next to the result; `vertical` stacks the editor above the result.
* Example:

    ```html
    <pre class="executor-editor" data-layout="vertical">
        [...]
    </pre>
    ```

## Purpose

The project was created for presentation slides, to embed code and quickly execute it.

## License

[The MIT License](https://piecioshka.mit-license.org) @ 2015
