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

test('finds implicit C++ block and line markers', () => {
	const text = '/*@code\nvalue = 1;\n*/\n//@code other = 2';
	const ranges = findCodeRanges(text, 'cpp', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['/*@code\nvalue = 1;\n*/', '//@code other = 2'],
	);
});

test('finds C++ dollar markers only when abbreviations are enabled', () => {
	const text = '/*$\nvalue = 1;\n*/\n//$ other = 2';

	assert.equal(findCodeRanges(text, 'cpp', false).length, 0);
	assert.equal(findCodeRanges(text, 'cpp', true).length, 2);
});

test('does not decorate nested C++ comments', () => {
	const text = '//@code value = 1 // keep this comment normal';
	const ranges = findCodeRanges(text, 'cpp', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['//@code value = 1 '],
	);
});

test('ignores C++ markers with an explicit language name', () => {
	const text = '/*@code(cpp) value = 1*/\n//@code(cpp) other = 2';

	assert.equal(findCodeRanges(text, 'cpp', true).length, 0);
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

test('finds implicit JSX block and line markers', () => {
	const text = '/*@code\nconst x = 1;\n*/\n//@code const y = "hello";\n{/*@code\nconst z = 2;\n*/}';
	const ranges = findCodeRanges(text, 'javascriptreact', false);

	// Block markers are collected before line markers; order is not positional.
	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['/*@code\nconst x = 1;\n*/', '/*@code\nconst z = 2;\n*/', '//@code const y = "hello";'],
	);
});

test('finds JSX dollar markers only when abbreviations are enabled', () => {
	const text = '/*$\nconst x = 1;\n*/\n//$ const y = "hello";';

	assert.equal(findCodeRanges(text, 'javascriptreact', false).length, 0);
	assert.equal(findCodeRanges(text, 'javascriptreact', true).length, 2);
});

test('does not decorate nested JSX comments', () => {
	const text = '//@code const x = 1; // keep this comment normal';
	const ranges = findCodeRanges(text, 'javascriptreact', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['//@code const x = 1; '],
	);
});

test('finds implicit TSX block and line markers', () => {
	const text = '/*@code\nconst x: number = 1;\n*/\n//@code const y: string = "hello";\n{/*@code\nconst z: number = 2;\n*/}';
	const ranges = findCodeRanges(text, 'typescriptreact', false);

	// Block markers are collected before line markers; order is not positional.
	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['/*@code\nconst x: number = 1;\n*/', '/*@code\nconst z: number = 2;\n*/', '//@code const y: string = "hello";'],
	);
});

test('finds TSX dollar markers only when abbreviations are enabled', () => {
	const text = '/*$\nconst x: number = 1;\n*/\n//$ const y: string = "hello";';

	assert.equal(findCodeRanges(text, 'typescriptreact', false).length, 0);
	assert.equal(findCodeRanges(text, 'typescriptreact', true).length, 2);
});

test('does not decorate nested TSX comments', () => {
	const text = '//@code const x: number = 1; // keep this comment normal';
	const ranges = findCodeRanges(text, 'typescriptreact', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['//@code const x: number = 1; '],
	);
});

test('finds implicit Lua block and line markers', () => {
	const text = '--[[@code\nlocal k = 11\n]]\n--@code local m = 12';
	const ranges = findCodeRanges(text, 'lua', false);

	// Block markers are collected before line markers; order is not positional.
	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['--[[@code\nlocal k = 11\n]]', '--@code local m = 12'],
	);
});

test('finds leveled Lua block markers', () => {
	const text = '--[=[@code\nlocal x = 1\n]=]';
	const ranges = findCodeRanges(text, 'lua', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['--[=[@code\nlocal x = 1\n]=]'],
	);
});

test('finds Lua dollar markers only when abbreviations are enabled', () => {
	const text = '--[[$\nlocal n = 13\n]]\n--$ local p = 14';

	assert.equal(findCodeRanges(text, 'lua', false).length, 0);
	assert.equal(findCodeRanges(text, 'lua', true).length, 2);
});

test('does not decorate nested Lua comments', () => {
	// Lua's nested comment delimiter is -- rather than //.
	const text = '--@code local q = 15 -- keep this comment normal';
	const ranges = findCodeRanges(text, 'lua', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['--@code local q = 15 '],
	);
});

test('does not decorate nested Lua comments inside block markers', () => {
	const text = '--[[@code\nlocal x = 1 -- note\n]]';
	const ranges = findCodeRanges(text, 'lua', false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['--[[@code\nlocal x = 1 ', ']]'],
	);
});

test('can decorate nested Lua comments when preservation is disabled', () => {
	const text = '--@code local q = 15 -- dim this too';
	const ranges = findCodeRanges(text, 'lua', false, false);

	assert.deepEqual(
		ranges.map(range => text.slice(range.start, range.start + range.length)),
		['--@code local q = 15 -- dim this too'],
	);
});

test('ignores Lua markers with an explicit language name', () => {
	const text = '--[[@code(lua) local x = 1]]\n--@code(lua) local y = 2';

	assert.equal(findCodeRanges(text, 'lua', true).length, 0);
});
