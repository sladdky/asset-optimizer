describe('valid test', () => {
	let trueVariable = false;

	beforeAll(() => {
		trueVariable = true;
	});

	test('should be true', () => {
		expect(trueVariable).toBeTruthy();
	});
});
