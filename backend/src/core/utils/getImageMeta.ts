import sharp from "sharp"

type ImageMeta = {
    rotation: string
    width: number
    height: number
}

export async function getImageMeta(inputPath: string): Promise<ImageMeta> {
    const metadata = await sharp(inputPath).metadata()
    return {
        rotation: metadata.orientation?.toString() ?? '0',
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
    }
}