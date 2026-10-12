const assert = require('node:assert/strict');
const test = require('node:test');
const { findCodeRanges } = require('../marker-ranges');

test('finds implicit JavaScript block and line markers', () => {
	const text = '/*@code\nconst value = 1;\n*/\n//@code const other = 2;';
	const ranges = findCodeRanges(text, 'javascript', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['/*@code\nconst value = 1;\n*/', '//@code const other = 2;'],
	);
});

test('finds dollar markers only when abbreviations are enabled', () => {
	const text = '/*$\nconst value = 1;\n*/\n//$ const other = 2;';

	assert.equal(findCodeRanges(text, 'javascript', false).length, 0);
	assert.equal(findCodeRanges(text, 'javascript', true).length, 2);
});

test('finds Python @code and dollar line markers', () => {
	const text = '# @code value = 1\n#$ value = 2';

	assert.equal(findCodeRanges(text, 'python', false).length, 1);
	assert.equal(findCodeRanges(text, 'python', true).length, 2);
});

test('ignores marker-like text that is not an implicit marker', () => {
	// Parenthesized suffixes and fenced text must not partially match @code.
	const text = '/*@code(javascript) value = 1;*/\n```javascript\nvalue = 2;\n```';

	assert.equal(findCodeRanges(text, 'javascript', true).length, 0);
});

test('does not decorate nested JavaScript comments', () => {
	// The code is dimmed, but the trailing comment should retain its normal color.
	const text = '//@code const value = 1; // keep this comment normal';
	const ranges = findCodeRanges(text, 'javascript', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['//@code const value = 1; '],
	);
});

test('does not decorate nested Python comments', () => {
	// Python's nested comment delimiter is # rather than //.
	const text = '# @code value = 1 # keep this comment normal';
	const ranges = findCodeRanges(text, 'python', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['# @code value = 1 '],
	);
});

test('can decorate nested comments when preservation is disabled', () => {
	const text = '//@code const value = 1; // dim this too';
	const ranges = findCodeRanges(text, 'javascript', false, false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['//@code const value = 1; // dim this too'],
	);
});

test('finds implicit Go block and line markers', () => {
	const text = '/*@code\nvalue := 1\n*/\n//@code other := 2';
	const ranges = findCodeRanges(text, 'go', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['/*@code\nvalue := 1\n*/', '//@code other := 2'],
	);
});

test('finds Go dollar markers only when abbreviations are enabled', () => {
	const text = '/*$\nvalue := 1\n*/\n//$ other := 2';

	assert.equal(findCodeRanges(text, 'go', false).length, 0);
	assert.equal(findCodeRanges(text, 'go', true).length, 2);
});

test('does not decorate nested Go comments', () => {
	// Go shares the // comment form, so the generic nested comment split applies.
	const text = '//@code value := 1 // keep this comment normal';
	const ranges = findCodeRanges(text, 'go', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['//@code value := 1 '],
	);
});

test('ignores Go markers with an explicit language name', () => {
	const text = '/*@code(go) value := 1*/\n//@code(go) other := 2';

	assert.equal(findCodeRanges(text, 'go', true).length, 0);
});

test('finds implicit TypeScript block and line markers', () => {
	const text = '/*@code\nconst x: number = 1;\n*/\n//@code const y: string = "hello";';
	const ranges = findCodeRanges(text, 'typescript', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['/*@code\nconst x: number = 1;\n*/', '//@code const y: string = "hello";'],
	);
});

test('finds TypeScript dollar markers only when abbreviations are enabled', () => {
	const text = '/*$\nconst x: number = 1;\n*/\n//$ const y: string = "hello";';

	assert.equal(findCodeRanges(text, 'typescript', false).length, 0);
	assert.equal(findCodeRanges(text, 'typescript', true).length, 2);
});

test('does not decorate nested TypeScript comments', () => {
	// TypeScript shares the // comment form, so the generic nested split applies.
	const text = '//@code const x: number = 1; // keep this comment normal';
	const ranges = findCodeRanges(text, 'typescript', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['//@code const x: number = 1; '],
	);
});

test('ignores TypeScript markers with an explicit language name', () => {
	const text = '/*@code(typescript) const x: number = 1;*/\n//@code(typescript) const y: string = "hello";';

	assert.equal(findCodeRanges(text, 'typescript', true).length, 0);
});
