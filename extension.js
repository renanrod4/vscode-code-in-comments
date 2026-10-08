const vscode = require('vscode');
const { findCodeRanges } = require('./marker-ranges');

function activate(context) {
	let activeEditor = vscode.window.activeTextEditor;
	let dimmedCommentCodeDecoration;

	function updateDecorationType() {
		if (dimmedCommentCodeDecoration) {
			dimmedCommentCodeDecoration.dispose();
		}

		const configuration = vscode.workspace.getConfiguration('codeInComments');
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
		const configuration = vscode.workspace.getConfiguration('codeInComments');
		const enableAbbreviations = configuration.get('enableAbbreviations', false);
		const decorations = findCodeRanges(text, activeEditor.document.languageId, enableAbbreviations).map(
			({ start, length }) => {
				const rangeStart = activeEditor.document.positionAt(start);
				const rangeEnd = activeEditor.document.positionAt(start + length);
				return { range: new vscode.Range(rangeStart, rangeEnd) };
			},
		);

		activeEditor.setDecorations(dimmedCommentCodeDecoration, decorations);
	}

	updateDecorationType();

	if (activeEditor) {
		updateDecorations();
	}

	// Recalculate ranges when the active document or its content changes.
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
			if (event.affectsConfiguration('codeInComments')) {
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
