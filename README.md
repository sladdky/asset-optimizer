# ASSET-OPTIMIZER

Optimizing videos, photos, svgs from one folder to another.

**Supported extensions:** JPG, JPEG, PNG, TIFF, SVG, MP4, MOV *(more expcted to be added)*

<br>

## Why?
There are other options like webpack, gulp, vite, nuxt/next plugins, etc. to optimize assets. This library makes optimizing assets framework agnostic, doesn't slow down building your app and gives you callbacks to customize what to do with the files and you don't have to rely on pre-coded options.

**Drawbacks:**
- with current implementation doesn't scale well for infinite number of files.
- for large projects I'd recommend to go with a framework or other asset building library

<br>

## Table of contents
* CLI
  * [installation](#cli-installation)
  * [usage](#cli-usage)
* Programmable
  * [installation](#programmable-installation)
  * [usage](#programmable-usage)
  * [custom rules](#programmable-customrules)


<br>

# CLI
<a name="cli-installation"></a>
## Instalation
```sh
npm install --location=global @sladdky/asset-optimizer
```
<a name="cli-usage"></a>
## Usage
```sh
asset-optimizer
            [--inputcwd=<path>]   default: public-src
            [--outputcwd=<path>]  default: public
            [--ui=<true|false>]   default: false
```

<br>

# Programmable

<a name="programmable-installation"></a>
## Instalation
```sh
npm install --save-dev @sladdky/asset-optimizer
```
<a name="programmable-usage"></a>
## Usage

```sh
const { join } = require('path')
const { createAssetOptimizer } = require('@sladdky/asset-optimizer')

const ao = createAssetOptimizer({
    core: {
        inputCwd: join(__dirname, 'public-src'), //input folder
        outputCwd: join(__dirname, '../public'), //output folder
    }
})
ao.watch()
