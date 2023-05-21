#!/usr/bin/env node

const { join } = require('path')
const { createAssetOptimizer } = require('../backend/lib')

main()

function main() {
    const args = {
        inputcwd: 'public-src',
        outputcwd: 'public',
        api: 'false',
        ui: 'false',
        ...parseArgv()
    }

    const assetOptimizer = createAssetOptimizer({
        core: {
            inputCwd: join(process.cwd(), args.inputcwd),
            outputCwd: join(process.cwd(), args.outputcwd),
        }
    })
    assetOptimizer.watch({
        api: args.ui === 'true' || args.api === 'true',
        ui: args.ui === 'true',
    })
}

function parseArgv() {
    const args = {}
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            // long arg
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=')
                const longArgFlag = longArg[0].slice(2, longArg[0].length)
                const longArgValue = longArg.length > 1 ? longArg[1] : true
                args[longArgFlag] = longArgValue
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('')
                flags.forEach(flag => {
                    args[flag] = true
                })
            }
        })
    return args
}

