#!/usr/bin/env bash

sass \
    "src/styles/main.scss":"dist/executor-editor.css" \
    "src/styles/skins/blue.scss":"dist/skins/blue-skin.css" \
    "src/styles/skins/normal.scss":"dist/skins/normal-skin.css" \
    --no-source-map -s compressed
