export function parseSize(strInput: string) {
	const [rawWidth = null, rawHeight = null] = strInput.split('x')

    if (rawWidth === null || rawHeight === null) {
        throw new Error(`Unable to parse '${strInput}' into width and height`)
    }

    return {
		width: parseInt(rawWidth),
		height: parseInt(rawHeight),
	}
}
