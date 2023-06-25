// const files = []
// const p = true

// function upload(blobOrFile) {
// 	var xhr = new XMLHttpRequest()
// 	xhr.open('POST', '/server', false)
// 	xhr.onload = function (e) {}
// 	xhr.send(blobOrFile)
// }

// function run() {
// 	for (var j = 0; j < files.length; j++) {
// 		var blob = files[j]

// 		const BYTES_PER_CHUNK = 1024 * 1024
// 		// 1MB chunk sizes.
// 		const SIZE = blob.size

// 		var start = 0
// 		var end = BYTES_PER_CHUNK

// 		while (start < SIZE) {
// 			if ('mozSlice' in blob) {
// 				var chunk = blob.mozSlice(start, end)
// 			} else {
// 				var chunk = blob.webkitSlice(start, end)
// 			}

// 			upload(chunk)

// 			start = end
// 			end = start + BYTES_PER_CHUNK
// 		}
// 		p = (j = files.length - 1) ? true : false
// 		self.postMessage(blob.name + ' Uploaded Succesfully')
// 	}
// }

// self.onmessage = function (event) {
// 	// for (var j = 0; j < event.data.length; j++) files.push(event.data[j])

// 	// if (p) {
// 	// 	run()
// 	// }
// }
