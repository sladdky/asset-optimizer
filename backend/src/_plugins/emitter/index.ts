export class Emitter {
	map: Record<
		string,
		{
			fn: (data: any) => any;
		}[]
	>;

	constructor() {
		this.map = {};
	}

	on(name: string, callback: (data: any) => any | void) {
		const evt = this.map || (this.map = {});

		(evt[name] || (evt[name] = [])).push({
			fn: callback,
		});

		return this;
	}

	// once(name: string, callback: () => any) {
	// 	const self = this;
	// 	function listener() {
	// 		self.off(name, listener);
	// 		callback.apply(arguments);
	// 	}

	// 	listener._ = callback;
	// 	return this.on(name, listener);
	// }

	emit(name: string, data?: any) {
		const evts = [...((this.map || (this.map = {}))[name] || [])];

		for (const evt of evts) {
			//event should be synchronous => resolve fn because it could be async
			Promise.resolve(evt.fn(data)).then((newData) => {
				if (typeof newData !== 'undefined') {
					data = newData;
				}
			});
		}
		return data;
	}

	off(name: string, callback: (data: any) => any | void) {
		const evt = this.map || (this.map = {});
		const evts = evt[name];
		const liveEvents = [];

		if (evts) {
			for (const evt of evts) {
				if (evt.fn !== callback) liveEvents.push(evt); //if (evt.fn !== callback && evt.fn._ !== callback)
			}
		}

		liveEvents.length ? (evt[name] = liveEvents) : delete evt[name];

		return this;
	}
}
