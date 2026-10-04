# CodeInComments

## Overview

CodeInComments is a Visual Studio Code extension that visually separates code
examples inside comments from executable code. It reuses the syntax
highlighting of the current file language while applying a configurable opacity
and grayscale effect to the documented example.

## Motivation

Code examples frequently appear in API comments, embedded documentation, and
reference files. When these examples look too similar to the rest of the file,
it can be difficult to quickly identify what belongs to the documentation and
what belongs to the program.

The extension provides an additional visual layer for these examples without
removing the syntax highlighting of the file language.

## Proposal

The extension recognizes `@code` blocks inside comments such as `/* ... */`.
When a block is found, it:

- preserves the syntax highlighting for the current file language;
- applies a distinct visual appearance to the documented example;
- allows that appearance to be adjusted by the user;
- updates the result when the editor, document, or settings change.

Line comment markers are also supported with the `@code` syntax. The language
is always inferred from the current file:

```rust
/*@code
let greetings = println!("Hello, world!");
*/

/*@code
let greetings = println!("Hello, world!");
*/

//@code let greetings = println!("Hello, world!");
```

For example, in a JavaScript file:

```javascript
//@code const message = "Hello, world!"; console.log(message);
```

The extension applies the visual decoration to each matching line. Explicit
language markers such as `@code(javascript)` are intentionally unsupported.

The `$` abbreviation can be enabled with `codeInComments.enableAbbreviations`:

```json
{
	"codeInComments.enableAbbreviations": true
}
```

When enabled, `/*$ ... */` and `//$ ...` are accepted as aliases for the
corresponding implicit `@code` forms.

## Result

The code inside the comment is intentionally dimmed, while the executable code
outside the comment keeps its normal appearance.

![Comment Code Blocks preview](public/example.webp)

## Expected usage

```javascript
/** @code
 * const message = 'Hello, world!';
 * console.log(message);
 */
```

In this scenario, the block should continue to be recognized as JavaScript while
also being visually identified as part of a comment.

## Configuration

The extension provides settings through the VS Code preferences interface and
through `settings.json`.

### `codeInComments.opacity`

Controls the opacity applied to code blocks found inside comments. The value is a
number between `0` and `1`. The default is `0.5`.

```json
{
	"codeInComments.opacity": 0.7
}
```

### `codeInComments.grayscale`

Controls the grayscale percentage applied to the blocks. The value is a number
between `0` and `100`. The default is `25`.

```json
{
	"codeInComments.grayscale": 40
}
```

## Technical direction

The implementation combines two VS Code mechanisms:

1. A TextMate grammar allows code blocks inside comments to receive syntax
   highlighting for the current file language.
2. The extension identifies the relevant blocks and applies a configurable
   visual decoration to the detected ranges.

The decoration is refreshed when the user switches editors, edits the document,
or changes the extension settings.

## Initial scope

The current version supports:

- block comments in the `/* ... */` and `/** ... */` forms;
- `@code` blocks and inline markers inside block and line comments;
- optional `$` abbreviations controlled by `codeInComments.enableAbbreviations`;
- implicit `@code` syntax highlighting for JavaScript, Rust, and Python comments;
- configurable opacity and grayscale;
- a simple testing experience inside an Extension Development Host.

Comments using `#` and `--` are not currently scanned. Explicit language
markers and syntax highlighting for additional host languages are pending. The
runtime detector uses regular expressions, so more complex comment and marker
syntax may require additional handling.

## Installation and development

### Requirements

- VS Code `1.39.0` or newer.
- Node.js and npm.

### Install dependencies

```bash
npm install
```

### Run locally

1. Open the project in VS Code.
2. Press `F5` to start an Extension Development Host.
3. Open a source file containing an `@code` block inside a comment.
4. Change the extension settings and verify that the decoration updates.

### Validate the project

```bash
python3 -m json.tool package.json > /dev/null
python3 -m json.tool syntaxes/comment.message.block.json > /dev/null
node --check extension.js
npm run build
```

## Project structure

```text
.
├── extension.js
├── public/
│   └── example.png
├── syntaxes/
│   ├── comment.message.block.json
│   ├── comment.message.javascript.json
│   └── comment.message.rust.json
├── test/
│   ├── langs/
│   │   ├── js.js
│   │   └── rs.rs
│   ├── test.block.rs
│   └── test.js
├── package.json
└── README.md
```

## Project status

The first functional version is implemented. Future versions may expand syntax
highlighting for `@code` markers, improve block detection, and add automated
extension tests.
