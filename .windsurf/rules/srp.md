---
trigger: always_on
---

Max File Length & Single Responsibility Principle (SRP)

Rule: Limit JavaScript/TypeScript component or utility files to a maximum of 300 lines.
If a file exceeds this length, it must be refactored by splitting into smaller, clearly-named modules, components, or hooks with single, well-defined responsibilities.

Recommended approach:
Identify logical blocks within the large file.

Extract UI components, custom hooks, helpers, and utilities, classes, functions into their own dedicated files under dedicated folders.

Favor directory structure by feature, functionality, or purpose.