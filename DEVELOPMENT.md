# Development Guide

This document explains how CodeInComments works and records the details that
are easy to miss when changing the extension.

## Project map

- `extension.js` is the VS Code runtime entry point. It creates the decoration,
  listens for editor and document changes, and converts text offsets into VS
  Code ranges.
- `marker-ranges.js` contains the pure marker detector. It does not import
  VS Code, so it can be tested with Node.js.
- `syntaxes/` contains TextMate injection grammars. These grammars provide
  syntax highlighting inside supported comments.
- `test/marker-ranges.test.js` tests marker detection without starting an
  Extension Development Host.
- `test/langs/` contains manual fixtures for JavaScript, JSX, TypeScript, TSX,
  Rust, Python, and Go.
- `package.json` declares activation events, settings, grammars, and scripts.
- `public/` contains the extension icon and README preview image.

## Runtime flow

1. VS Code activates the extension for JavaScript, Rust, Python, or Go through
   the `onLanguage` activation events in `package.json`.
2. `activate()` creates a `TextEditorDecorationType` using
   `codeInComments.opacity` and `codeInComments.grayscale`.

  `codeInComments.preserveNestedComments` controls whether the runtime splits
  ranges around nested comments. It defaults to `true`.
3. The active document is passed to `findCodeRanges()` in `marker-ranges.js`.
4. Each returned `{ start, length }` pair is converted into a `vscode.Range`.
5. `setDecorations()` applies the decoration to those ranges.
6. The ranges are recalculated when the active editor changes, the document is
   edited, or an extension setting changes.

The TextMate grammars and the runtime decoration have separate jobs. The
runtime controls the visual dimming. TextMate controls the token scopes and
syntax colors inside the marked code.

The runtime splits marked ranges around nested line comments. This keeps
comments such as `// comment` in JavaScript/Rust/Go and `# comment` in Python
out of the opacity and grayscale decoration.

## Supported syntax

The current implicit syntax is:

- JavaScript: `/*@code ... */`, `//@code ...`, and `$` aliases when enabled.
- JSX: same markers as JavaScript, including `{/*@code ... */}` and
  `{/*$ ... */}` inside JSX expression containers.
- TypeScript: `/*@code ... */`, `//@code ...`, and `$` aliases when enabled.
- TSX: same markers as TypeScript, including `{/*@code ... */}` and
  `{/*$ ... */}` inside JSX expression containers.
- Rust: block and line comments with `@code` and `$` aliases.
- Python: `# @code ...` and `#$ ...` aliases when enabled.
- Go: `/*@code ... */`, `//@code ...`, and `$` aliases when enabled.

The language is inferred from the host document, keeping markers independent
of a second language identifier.

`$` is controlled by `codeInComments.enableAbbreviations`. The TextMate grammar
can recognize the alias, but the runtime does not decorate it when the setting
is disabled. Keep both layers aligned when changing this behavior.

## TextMate grammar details

### Injection selectors

A grammar must be injected into the host language and, where possible, limited
to comment scopes:

```json
"injectionSelector": "L:comment.block.js, L:comment.line.double-slash.js"
```

Using `source.rust` or `source.python` as the selector is too broad. It can
make ordinary comments lose their native comment color or cause the injected
grammar to compete with the entire host grammar.

The exact comment scopes come from the host language grammar. Common examples
are:

- JavaScript: `comment.block.js`, `comment.line.double-slash.js`.
- JSX: `comment.block.js.jsx`, `comment.line.double-slash.js.jsx`.
- TypeScript: `comment.block.ts`, `comment.line.double-slash.ts`.
- TSX: `comment.block.tsx`, `comment.line.double-slash.tsx`.
- Rust: `comment.block.rust`, `comment.line.double-slash.rust`.
- Python: `comment.line.number-sign.python`.
- Go: `comment.block.go`, `comment.line.double-slash.go`.

When a grammar is restricted to a comment scope, the comment delimiter may
already have been consumed. Therefore the `begin` expression usually needs to
match the marker content after `//`, `#`, or `/*`, rather than requiring the
full delimiter again.

### `begin`, `contentName`, and `beginCaptures`

`begin` starts the embedded region. `contentName` names the content after the
marker. If the marker itself needs the special comment scope, use
`beginCaptures`:

```json
{
	"begin": "@code(?!\\()\\s*",
	"beginCaptures": {
		"0": { "name": "comment.code.block" }
	},
	"contentName": "meta.embedded.block.javascript",
	"patterns": [{ "include": "source.js" }]
}
```

Without `beginCaptures`, the marker can remain only in the host comment scope
while the embedded code gets the expected scopes. Conversely, putting
`comment.code.block` in `contentName` colors all embedded variables and
keywords as comments. The desired split is:

- marker: `comment.code.block`;
- code content: `meta.embedded.block.<language>` plus the host language scopes.

### Regex practices

TextMate regular expressions are not identical to JavaScript regular
expressions. Keep patterns conservative:

- Escape literal dollar signs as `\\$` in JSON grammar files.
- Escape literal parentheses when using a negative lookahead such as
  `(?!\\()` to reject `@code(...)`.
- Prefer separate pattern entries for `@code` and `$` instead of complex
  alternations when a grammar engine reports regex errors.
- Use fixed-length lookbehind only. For example, `(?<=//)` and `(?<=#)` are
  safer than variable-length alternatives.
- Remember the escaping layers: JSON escaping is applied before TextMate sees
  the regex. A literal backslash normally appears as `\\` in JSON.
- Test the JSON with `python3 -m json.tool` and compile the extracted regexes
  with Node as a quick sanity check.

Line and block comments often need different `end` expressions:

- line comments usually end with `$`;
- block comments usually end with `(?=\\*/)`, leaving `*/` to the host grammar.

Do not use a line-comment `end: "$"` blindly inside a block-comment rule. It
can terminate the embedded region too early or produce confusing scopes.

## Adding a language

1. Confirm the VS Code language id, such as `javascript`, `rust`, or `python`.
2. Find the host grammar's actual comment scopes in its TextMate grammar.
3. Add a grammar file under `syntaxes/` with a unique `scopeName`.
4. Use a narrow `injectionSelector` for the host comment scopes.
5. Add separate rules for `@code` and `$` if the language needs both.
6. Use `beginCaptures` for `comment.code.block` and keep the embedded content
   under `meta.embedded.block.<language>`.
7. Add the grammar to `contributes.grammars` in `package.json`.
8. Add an `onLanguage:<language-id>` activation event if the runtime should
   decorate that language.
9. Update `marker-ranges.js` only when the comment syntax differs from the
   existing generic block or line detection.
10. Add a fixture under `test/langs/` and a focused test in
    `test/marker-ranges.test.js`.
11. Update the README, changelog, and this guide if the supported syntax or
    limitations change.

The runtime detector currently recognizes C-style block comments, `//` line
comments, and Python `#` line comments. Languages using `--`, `;`, or another
comment form need explicit detector support; adding only a TextMate grammar is
not enough to receive opacity and grayscale decoration.

## Common failure modes

### The whole comment becomes white or loses comment color

The injection selector is probably too broad, such as `L:source.rust` or
`L:source.python`. Restrict it to the host language's comment scopes.

### The embedded code is still colored as a comment

Check `contentName`. It should not include `comment.code.block`; use
`beginCaptures` for the marker and `meta.embedded.block.<language>` for the
content.

### The marker has no special scope, but the code does

The `begin` matched only the code content or the marker is outside the capture.
Add `beginCaptures` with `comment.code.block`.

### `$` does not work

Check both layers: `codeInComments.enableAbbreviations` must be enabled for
runtime decoration, and the TextMate grammar must have a separate escaped
`\\$` rule. Reload the Extension Development Host after changing grammars.

### Opacity or grayscale appears not to work

First confirm that the runtime found at least one range. A valid TextMate scope
alone does not create a decoration. Check the active setting namespace,
`codeInComments.*`, and reload the Extension Development Host. The installed
VSIX can behave differently from a paused or stale development host, so test a
freshly packaged VSIX as well.

### A nested comment is dimmed with the code

The nested comment detector is language-specific. JavaScript, JSX, TypeScript,
TSX, Rust, and Go use `//`, while Python uses `#`. Add a focused range test
before extending this behavior to a language with another comment syntax.

### The Extension Development Host takes too long to start

Make sure there are no breakpoints or a `debugger` statement at the beginning
of `extension.js`. The project uses language-specific activation events rather
than `"*"`; global activation can slow startup and produces a VS Code warning.

## Validation checklist

Run the following before committing or packaging:

```bash
python3 -m json.tool package.json > /dev/null
for file in syntaxes/*.json; do python3 -m json.tool "$file" > /dev/null; done
node --check extension.js
npm test
git diff --check
npm run build
```

Then install the generated `.vsix` in VS Code and manually verify one block and
one line marker in each supported language, including `$` with the abbreviation
setting enabled.
