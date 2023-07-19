type Props<T> = {
	maxConcurents: number;
	onUnqueue: (item: T) => Promise<void>;
	onStart: () => void;
	onEnd: () => void;
};

export function createQueue<T>({ maxConcurents = 0, onUnqueue, onStart, onEnd }: Partial<Props<T>>) {
	const queue: T[] = [];
	let count = 0;

	const add = (item: T) => {
		if (queue.includes(item)) {
			return;
		}
		queue.push(item);
		run();

		if (queue.length === 1) {
			onStart?.();
		}
	};

	const unqueue = async (item: T) => {
		count += 1;
		await onUnqueue?.(item);
		count -= 1;
		run();

		if (queue.length === 0) {
			onEnd?.();
		}
	};

	const run = () => {
		if (count > maxConcurents) {
			return;
		}

		const item = queue.shift();
		if (!item) {
			return;
		}

		unqueue(item);
	};

	return {
		add,
		run,
	};
}
