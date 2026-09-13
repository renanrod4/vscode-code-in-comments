# Comment Code Blocks

## Overview

Comment Code Blocks is a proposed Visual Studio Code extension. Its goal is to
improve the readability of code examples written inside documentation comments,
while keeping the example's language recognizable and making the distinction
between documentation and executable code clear.

## Motivation

Code examples frequently appear in API comments, embedded documentation, and
reference files. When these examples look too similar to the rest of the file,
it can be difficult to quickly identify what belongs to the documentation and
what belongs to the program.

The extension should provide an additional visual layer for these examples
without removing the syntax highlighting of the language declared in the block.

## Proposal

The extension should recognize code blocks delimited by three backticks when
they are inside block comments such as `/* ... */`. When a block
is found, it should:

- preserve the syntax highlighting for the language declared in the opening;
- apply a distinct visual appearance to the documented example;
- allow that appearance to be adjusted by the user;
- update the result when the editor, document, or settings change.

## Expected usage

````javascript
/**
 * Example usage:
 *
 * ```javascript
 * const message = 'Hello, world!';
 * console.log(message);
 * ```
 */
````

In this scenario, the block should continue to be recognized as JavaScript while
also being visually identified as part of a comment.

## Planned configuration

The extension may provide settings through the VS Code preferences interface and
through `settings.json`.

### `commentCodeBlocks.opacity`

This setting should control the opacity applied to code blocks found inside
comments. The expected value should be a number between `0` and `1`.

### `commentCodeBlocks.grayscale`

This setting should control the grayscale percentage applied to the blocks. The
expected value should be a number between `0` and `100`.

## Technical direction

The implementation should combine two VS Code mechanisms:

1. A TextMate grammar should allow code blocks inside comments to receive syntax
   highlighting for the declared language.
2. The extension should identify the relevant blocks and apply a configurable
   visual decoration to the detected ranges.

The behavior should be updated when the user switches editors, edits the
document, or changes the extension settings.

## Initial scope

The first version should prioritize:

- block comments in the `/* ... */` and `/** ... */` forms;
- blocks enclosed by three backticks;
- language identifiers after the opening backticks;
- configurable opacity and grayscale;
- a simple testing experience inside an Extension Development Host.

Support for line comments such as `//`, `#`, and `--` may be considered in a
later stage, along with handling for more complex syntax cases.

## Development plan

1. Define the extension contribution and its settings.
2. Create the grammar to integrate fenced blocks into comment scopes.
3. Detect the ranges that should receive the visual decoration.
4. Update the decoration while editing and when settings change.
5. Validate the behavior with examples in different languages.
6. Document installation, known limitations, and the publishing process.

## Project status

This repository represents the initial proposal stage. Implementation details,
default setting values, language support, and the distribution process remain to
be confirmed during development.
