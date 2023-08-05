export type PackageName = {
	API: 'API';
	CORE: 'CORE';
	UI: 'UI';
};

export type LogLevel = {
	warning: 'warning';
	info: 'info';
};

export type Colors = {
	[P in keyof LogLevel]: string;
};

export function log(packageName: keyof PackageName, message: string, level: keyof LogLevel = 'info') {
	const COLORS: Colors = {
		info: '\x1b[2m',
		warning: '\x1b[1m\x1b[31m',
	};
	console.log(`${COLORS[level]}${new Date().toISOString()} ${packageName.padStart(5)}: ${message}\x1b[0m`);
}
