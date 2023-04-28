const { join } = require('path')
const { createAssetOptimizer } = require('../lib/index')

const assetOptimizer = createAssetOptimizer({
    inputCwd: join(__dirname, 'public-src'),
    outputCwd: join(__dirname, 'public'),
})
assetOptimizer.watch()