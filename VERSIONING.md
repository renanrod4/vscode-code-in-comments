# Versioning Policy

This project follows [Semantic Versioning (SemVer)](https://semver.org/). Version numbers are structured as `MAJOR.MINOR.PATCH`.

## Version Bump Rules

### MAJOR (X.0.0)
- Incompatible API changes or breaking changes to existing functionality.
- Changing the marker syntax (e.g., changing `@code` to something else).
- Removing support for a previously supported host language.
- Refactoring that requires users to change their `settings.json` configuration structure.

### MINOR (0.X.0)
- Adding support for a new host language.
- Adding a new feature that is backwards compatible (e.g., a new configuration setting).
- Improvements that enhance functionality without breaking existing setups.

### PATCH (0.0.X)
- Bug fixes.
- Documentation updates (README, CHANGELOG, etc.).
- Internal refactoring, performance improvements, or dependency updates that do not change external behavior.
