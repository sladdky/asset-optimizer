type Options = {
    meta: {
        rotation: string //'-90' | '90' | '180' | '-180'
        width: number
        height: number
    },
    desiredSize: {
        width: number
        height: number
    },
    strategy: 'exact' | 'fit'
    isRotationIncluded?: boolean
    isShrinkOnly?: boolean
    isResultInFloats?: boolean
}

type TransformInfoExtract = {
    width: number
    height: number
    top: number
    left: number
}
type TransformInfoSize = {
    width: number
    height: number
}

type TransformInfo = {
    extract: TransformInfoExtract | null,
    size: TransformInfoSize | null
}

//pre-requesities = rotation has been applied
export function calculateTransformInfo(opts: Options): TransformInfo {
    const getDefaultExtract = (): TransformInfoExtract => ({
        width: opts.meta.width,
        height: opts.meta.height,
        top: 0,
        left: 0
    })
    const getDefaultSize = (): TransformInfoSize => ({
        width: opts.desiredSize.width,
        height: opts.desiredSize.height
    })

    let extract: TransformInfoExtract | null = getDefaultExtract()
    let size: TransformInfoSize | null = getDefaultSize()

    const AR = opts.meta.width / opts.meta.height
    const desiredAR = opts.desiredSize.width / opts.desiredSize.height
    const is90deg = ['-90', '90', '6', '8'].includes(opts.meta.rotation) //6,8 for images, 90 for videos

    //calculate center cutout
    if (opts.strategy === 'exact' && AR !== desiredAR) {
        let width = 0
        let height = 0
        if (AR <= desiredAR) {
            width = Math.min(opts.meta.width, opts.desiredSize.width)
            height = width / desiredAR
        } else {
            height = Math.min(opts.meta.height, opts.desiredSize.height)
            width = height * desiredAR
        }

        extract = {
            width,
            height,
            top: (opts.meta.height - height) / 2, //center
            left: (opts.meta.width - width) / 2 //center
        }
    }

    if (opts.strategy === 'fit') {
        let width = 0
        let height = 0
        if (AR >= desiredAR) {
            width = opts.desiredSize.width
            height = width / AR
        } else {
            height = opts.desiredSize.height
            width = height * AR
        }
        size = {
            width,
            height
        }
    }

    if (opts.isShrinkOnly) {
        const sizeAR = size.width > size.height ? size.width / size.height : size.height / size.width

        const width1 = Math.min(opts.meta.width, opts.desiredSize.width, extract.width, size.width)
        const height1 = width1 * sizeAR
        const res1 = width1 * height1

        const height2 = Math.min(opts.meta.height, opts.desiredSize.height, extract.height, size.height)
        const width2 = height2 / sizeAR
        const res2 = width2 * height2

        size = {
            width: res1 <= res2 ? width1 : width2,
            height: res1 <= res2 ? height1 : height2
        }
    }

    if (!opts.isResultInFloats) {
        extract = {
            width: Math.ceil(extract.width),
            height: Math.ceil(extract.height),
            top: Math.floor(extract.top),
            left: Math.floor(extract.left),
        }
        size = {
            width: Math.ceil(size.width),
            height: Math.ceil(size.height),
        }
    }


    //flip 90deg if desired
    if (opts.isRotationIncluded && is90deg && extract) {
        extract = {
            width: extract.height,
            height: extract.width,
            top: extract.left,
            left: extract.top
        }
        size = {
            width: size.height,
            height: size.width
        }
    }

    return {
        extract,
        size
    }
}