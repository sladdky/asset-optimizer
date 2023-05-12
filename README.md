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
    inputCwd: join(__dirname, 'public-src'), //raw, unoptimized files
    outputCwd: join(__dirname, '../public'), //optimized files
    rules: {
        // custom rules
    }
})
ao.watch()
```
<a name="programmable-customrules"></a>
## Custom rule (example)
```sh
const { join, dirname } = require('path')
const fs = require('fs/promises')
const { createAssetOptimizer } = require('@sladdky/asset-optimizer')

async function exampleTxtCallback({ relativePath, inputCwd, outputCwd }) {
    const srcPath = join(inputCwd, relativePath)
    const outputPath = join(outputCwd, relativePath)
    await fs.mkdir(dirname(outputPath), {
        recursive: true,
    })
    const content = await fs.readFile(srcPath)
    await fs.writeFile(outputPath, `Optimized content:\n${content.subarray(0,10)}`)
}

const assetOptimizer = createAssetOptimizer({
    inputCwd: join(__dirname, 'public-src'),
    outputCwd: join(__dirname, 'public'),
    rules: {
        'txt': {
            callback: exampleTxtCallback
        }
    }
})
assetOptimizer.watch()
```
