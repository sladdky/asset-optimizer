# ASSET-OPTIMIZER

Optimizing assets - videos, photos, svgs from one folder to another (default: `public-src` to `public`)

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
import { createAssetOptimizer } from 'asset-optimizer';

const ao = createAssetOptimizer()
ao.watch()
```