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

test('ignores explicit language markers and fenced blocks', () => {
	const text = '/*@code(javascript) value = 1;*/\n```javascript\nvalue = 2;\n```';

	assert.equal(findCodeRanges(text, 'javascript', true).length, 0);
});
