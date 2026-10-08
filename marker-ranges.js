function findCodeRanges(text, languageId, enableAbbreviations, preserveNestedComments = true) {
	const ranges = [];
	const addRange = (start, length) => ranges.push({ start, length });
	// A marker can contain a language comment of its own. Split the decorated
	// range so that the nested comment keeps the host language's normal color.
	const addRangeWithoutNestedComments = (start, length) => {
		const end = start + length;
		// The marker is part of the decorated range, but must not be mistaken for
		// the nested comment that follows it.
		const markerPattern =
			languageId === 'python'
				? /^\s*#[ \t]*(?:@code|\$)(?!\()[ \t]*/
				: text.slice(start, end).startsWith('/*')
					? /^\/\*(?:@code|\$)(?!\()[ \t\r\n]*/
					: /^\s*\/\/(?:@code|\$)(?!\()[ \t]*/;
		const marker = text.slice(start, end).match(markerPattern);
		const contentStart = marker ? start + marker[0].length : start;
		const nestedCommentPattern = languageId === 'python' ? /#/g : /\/\//g;
		nestedCommentPattern.lastIndex = contentStart;
		let segmentStart = start;
		let nestedComment;

		while ((nestedComment = nestedCommentPattern.exec(text)) !== null) {
			if (nestedComment.index >= end) break;
			addRange(segmentStart, nestedComment.index - segmentStart);
			// Nested line comments remain undecorated through the end of the line.
			const lineEnd = text.indexOf('\n', nestedComment.index);
			segmentStart = lineEnd === -1 || lineEnd >= end ? end : lineEnd + 1;
			nestedCommentPattern.lastIndex = segmentStart;
		}

		if (segmentStart < end) addRange(segmentStart, end - segmentStart);
	};
	const addMarkerRange = preserveNestedComments ? addRangeWithoutNestedComments : addRange;
	const blockCommentRegex = /\/\*[\s\S]*?\*\//g;
	let match;

	if (languageId === 'python') {
		// Python uses # comments, while the other supported languages use //.
		const pythonLineCommentRegex = enableAbbreviations
			? /^\s*#\s*(?:@code|\$)(?!\().*$/gm
			: /^\s*#\s*@code(?!\().*$/gm;
		while ((match = pythonLineCommentRegex.exec(text)) !== null) {
			addMarkerRange(match.index, match[0].length);
		}
	}

	while ((match = blockCommentRegex.exec(text)) !== null) {
		const commentText = match[0];
		const commentStart = match.index;
		// Scan only block comments here; this prevents ordinary code from being
		// decorated when it happens to contain a marker-like string.
		const marker = enableAbbreviations
			? /\/(?:\*@code(?![(])|\*\$(?![(]))[\s\S]*?\*\//g
			: /\/\*@code(?![(])[\s\S]*?\*\//g;
		let codeMatch;
		while ((codeMatch = marker.exec(commentText)) !== null) {
			addMarkerRange(commentStart + codeMatch.index, codeMatch[0].length);
		}
	}

	// Explicit language names are rejected by the negative lookahead after the
	// marker, keeping the runtime behavior aligned with the TextMate grammars.
	const lineCommentRegex = enableAbbreviations
		? /^\s*\/\/(?:@code(?![(])|\$(?![(])).*$/gm
		: /^\s*\/\/@code(?![(]).*$/gm;
	while ((match = lineCommentRegex.exec(text)) !== null) {
		addMarkerRange(match.index, match[0].length);
	}

	return ranges;
}

module.exports = { findCodeRanges };
