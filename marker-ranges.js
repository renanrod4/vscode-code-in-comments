function findCodeRanges(text, languageId, enableAbbreviations) {
	const ranges = [];
	const addRange = (start, length) => ranges.push({ start, length });
	const blockCommentRegex = /\/\*[\s\S]*?\*\//g;
	let match;

	if (languageId === 'python') {
		const pythonLineCommentRegex = enableAbbreviations
			? /^\s*#\s*(?:@code|\$)(?!\().*$/gm
			: /^\s*#\s*@code(?!\().*$/gm;
		while ((match = pythonLineCommentRegex.exec(text)) !== null) {
			addRange(match.index, match[0].length);
		}
	}

	while ((match = blockCommentRegex.exec(text)) !== null) {
		const commentText = match[0];
		const commentStart = match.index;
		const marker = enableAbbreviations
			? /\/(?:\*@code(?![(])|\*\$(?![(]))[\s\S]*?\*\//g
			: /\/\*@code(?![(])[\s\S]*?\*\//g;
		let codeMatch;
		while ((codeMatch = marker.exec(commentText)) !== null) {
			addRange(commentStart + codeMatch.index, codeMatch[0].length);
		}
	}

	const lineCommentRegex = enableAbbreviations
		? /^\s*\/\/(?:@code(?![(])|\$(?![(])).*$/gm
		: /^\s*\/\/@code(?![(]).*$/gm;
	while ((match = lineCommentRegex.exec(text)) !== null) {
		addRange(match.index, match[0].length);
	}

	return ranges;
}

module.exports = { findCodeRanges };
