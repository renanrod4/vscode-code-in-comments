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
		const decorations = [];

		// Expressão regular para localizar blocos de comentário /* ... */
		const blockCommentRegex = /\/\*[\s\S]*?\*\//g;
		// Expressão regular para localizar blocos de código ``` dentro do comentário
		const codeBlockRegex = /```[\s\S]*?```/g;

		let match;
		while ((match = blockCommentRegex.exec(text)) !== null) {
			const commentText = match[0];
			const commentStartOffset = match.index;

			let codeMatch;
			while ((codeMatch = codeBlockRegex.exec(commentText)) !== null) {
				const startPos = activeEditor.document.positionAt(commentStartOffset + codeMatch.index);
				const endPos = activeEditor.document.positionAt(
					commentStartOffset + codeMatch.index + codeMatch[0].length,
				);

				decorations.push({
					range: new vscode.Range(startPos, endPos),
				});
			}
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
