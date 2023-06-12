# ASSET-OPTIMIZER

Optimizing videos, photos, svgs from one folder to another.

**Supported extensions:**<br>
JPG, JPEG, PNG, TIFF, SVG, MP4, MOV *...(more to be added)*

<br>

## Why?
There are other options like webpack, gulp, vite, nuxt/next plugins, etc. to optimize assets. This library makes optimizing assets framework agnostic, doesn't slow down building your app and gives you callbacks to customize what to do with the files and you don't have to rely on pre-coded options.

**Drawbacks:**
- with current implementation doesn't scale well for infinite number of file => use for large projects is not suitable at the moment

<br>

## Table of contents
**CLI**
* [installation](#cli-installation)
* [usage](#cli-usage)

<br>

**Programmable**
* [installation](#programmable-installation)
* [usage](#programmable-usage)


<br><br><br>

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
        inputCwd: join(__dirname, 'public-src'),
        outputCwd: join(__dirname, 'public'), //optimized|processed files
    }
})
ao.watch()
