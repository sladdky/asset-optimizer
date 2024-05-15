import ffmpeg from 'fluent-ffmpeg'

type VideoMeta = {
    rotation: string //'-90' | '90' | '180',
    width: number
    height: number
    fps: number
}

export function getVideoMeta(inputPath: string): Promise<VideoMeta> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (error, data) => {
            if (error) {
                reject(error)
            }

            resolve({
                rotation:  data.streams[0]?.rotation?.toString() ?? '0',
                width: data.streams[0]?.width ?? 1,
                height: data.streams[0]?.height ?? 1,
                fps: parseInt(data.streams[0]?.r_frame_rate ?? '-1')
            })
        })
    })
}