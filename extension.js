const vscode = require('vscode');

function activate(context) {
	let activeEditor = vscode.window.activeTextEditor;
	let dimmedCommentCodeDecoration;

	function updateDecorationType() {
		if (dimmedCommentCodeDecoration) {
			dimmedCommentCodeDecoration.dispose();
		}

		const configuration = vscode.workspace.getConfiguration('commentCodeBlocks');
		const opacity = configuration.get('opacity', 0.5);
		const grayscale = configuration.get('grayscale', 25);

		dimmedCommentCodeDecoration = vscode.window.createTextEditorDecorationType({
			opacity: String(opacity),
			textDecoration: `none; filter: grayscale(${grayscale}%);`,
		});
	}

	function updateDecorations() {
		if (!activeEditor) return;

		const text = activeEditor.document.getText();
		const configuration = vscode.workspace.getConfiguration('commentCodeBlocks');
		const decorations = [];
		const enableAbbreviations = configuration.get('enableAbbreviations', false);

		function addDecoration(startOffset, length) {
			const start = activeEditor.document.positionAt(startOffset);
			const end = activeEditor.document.positionAt(startOffset + length);
			decorations.push({ range: new vscode.Range(start, end) });
		}

		// Keep fenced blocks supported while adding explicit @code markers.
		const blockCommentRegex = /\/\*[\s\S]*?\*\//g;
		const fencedCodeRegex = /```[\s\S]*?```/g;
		let match;
		while ((match = blockCommentRegex.exec(text)) !== null) {
			const commentText = match[0];
			const commentStartOffset = match.index;
			let codeMatch;

			while ((codeMatch = fencedCodeRegex.exec(commentText)) !== null) {
				addDecoration(commentStartOffset + codeMatch.index, codeMatch[0].length);
			}

			const marker = enableAbbreviations
				? /\/(?:\*@code|\*\$)(?:\([^)]*\))?[\s\S]*?\*\//g
				: /\/\*@code(?:\([^)]*\))?[\s\S]*?\*\//g;
			while ((codeMatch = marker.exec(commentText)) !== null) {
				addDecoration(commentStartOffset + codeMatch.index, codeMatch[0].length);
			}
		}

		const lineCommentRegex = enableAbbreviations
			? /^\s*\/\/(?:@code|\$)(?:\([^)]*\))?.*$/gm
			: /^\s*\/\/@code(?:\([^)]*\))?.*$/gm;
		while ((match = lineCommentRegex.exec(text)) !== null) {
			addDecoration(match.index, match[0].length);
		}

		activeEditor.setDecorations(dimmedCommentCodeDecoration, decorations);
	}

	updateDecorationType();

	if (activeEditor) {
		updateDecorations();
	}

	// Atualiza as decorações quando o usuário muda de arquivo ou digita
	vscode.window.onDidChangeActiveTextEditor(
		editor => {
			activeEditor = editor;
			if (editor) updateDecorations();
		},
		null,
		context.subscriptions,
	);

	vscode.workspace.onDidChangeTextDocument(
		event => {
			if (activeEditor && event.document === activeEditor.document) {
				updateDecorations();
			}
		},
		null,
		context.subscriptions,
	);

	vscode.workspace.onDidChangeConfiguration(
		event => {
			if (event.affectsConfiguration('commentCodeBlocks')) {
				updateDecorationType();
				updateDecorations();
			}
		},
		null,
		context.subscriptions,
	);

	context.subscriptions.push({
		dispose: () => {
			if (dimmedCommentCodeDecoration) {
				dimmedCommentCodeDecoration.dispose();
			}
		},
	});
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
