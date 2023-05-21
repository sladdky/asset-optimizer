export const ruleDefs = [
	{
		name: 'image-optimize',
		ext: 'jpg|png|svg',
	},
	{
		name: 'image-resize-and-optimize',
		ext: 'jpg|png',
	},
	{
		name: 'video-optimize',
		ext: 'mp4|mov',
	},
	{
		name: 'video-resize-and-optimize',
		ext: 'mp4|mov',
	},
	{
		name: 'copy',
		ext: '',
	},
]

export const files = [
	{
		id: 1,
		isDir: true,
		modified: 1203910239,
		relativePath: 'test-folder',
		ext: '',
	},
	{
		id: 2,
		isDir: false,
		modified: 1203910239,
		relativePath: 'test-folder/test.txt',
		ext: 'txt',
	},
	{
		id: 3,
		isDir: false,
		modified: 1203910239,
		relativePath: 'test-folder/image.jpg',
		ext: 'jpg',
	},
]

export const rules = [
	{
		id: 1,
		fileId: 2, //update on start
		fileRelativePath: 'test-folder/test.txt',
		ruleName: 'copy',
	},
	{
		id: 2,
		fileId: 2, //update on start
		fileRelativePath: 'test-folder/test.txt',
		ruleName: 'optimize',
	},
	{
		id: 3,
		fileId: 3, //update on start
		fileRelativePath: 'test-folder/image.jpg',
		ruleName: 'optimize',
	},
]

export const optimizations = [
	{
		id: 1,
		modified: 1124245782,
		fileRuleId: 1,
		relativePath: 'test-folder/test.txt',
	},
	{
		id: 2,
		modified: 1124245782,
		fileRuleId: 1,
		relativePath: 'test-folder/test_2.txt',
	},
	{
		id: 3,
		modified: 1124245782,
		fileRuleId: 3,
		relativePath: 'test-folder/test.jpg',
	},
	{
		id: 4,
		modified: 1124245782,
		fileRuleId: 3,
		relativePath: 'test-folder/test.jpg',
	},
	{
		id: 5,
		modified: 1124245782,
		fileRuleId: 2,
		relativePath: 'test-folder/test_optimized.txt',
	},
]
