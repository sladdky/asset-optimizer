# ASSET-OPTIMIZER

Optimizing videos, photos, svgs from one folder to another.

**Supported extensions:** JPG, JPEG, PNG, SVG, MP4, MOV *(more expcted to be added)*

<br>

## Why?
There are other options like webpack, gulp, vite, nuxt/next plugins, etc. to optimize assets. This library makes optimizing assets framework agnostic, doesn't slow down building your app and gives you callbacks to customize what to do with the files and you don't have to rely on pre-coded options.

<br>

## Table of contents
* [installation](#installation)
* [usage](#usage)


<br>


<a name="installation"></a>
## Instalation
```sh
npm install @sladdky/asset-optimizer --save-dev
```

<br>

<a name="usage"></a>
## Usage
```sh
const { join } = require('path')
import { createAssetOptimizer } from '@sladdky/asset-optimizer';

const ao = createAssetOptimizer({
    tempCwd: join(__dirname, 'temp'), //temporary cache files for ASSET-OPTIMIZED
    inputCwd: join(__dirname, 'public-src'), //unoptimized files
    outputCwd: join(__dirname, 'public'), //optimized files
})
ao.watch()
```

