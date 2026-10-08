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

		// VS Code accepts opacity directly; the filter is embedded in textDecoration
		// because this is the supported way to apply grayscale to a text range.
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
		const preserveNestedComments = configuration.get('preserveNestedComments', true);
		// Keep offset detection independent from VS Code so it can be unit-tested.
		const decorations = findCodeRanges(
			text,
			activeEditor.document.languageId,
			enableAbbreviations,
			preserveNestedComments,
		).map(({ start, length }) => {
			const rangeStart = activeEditor.document.positionAt(start);
			const rangeEnd = activeEditor.document.positionAt(start + length);
			return { range: new vscode.Range(rangeStart, rangeEnd) };
		});

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
