# ChangelogSmith

> A GitHub App that generates clean changelog previews from merged pull requests.

ChangelogSmith helps maintainers create release changelogs directly from GitHub pull requests. It detects merged pull requests, groups them by labels and generates a release changelog preview using a simple pull request comment command.

## Features

- Detects merged pull requests via GitHub webhooks
- Finds the latest GitHub release
- Generates changelogs only from pull requests merged after the latest release
- Groups pull requests by labels
- Supports preview comments with `/changelogsmith preview`
- Updates existing bot preview comments instead of creating duplicates
- Supports repository-specific configuration through `.github/changelogsmith.yml`

## Example

Comment this on a pull request:

```txt
/changelogsmith preview
```

ChangelogSmith will respond with a preview like:

## ChangelogSmith Preview

Latest release: `v0.1.0`
Changes since: `2026-05-06T08:15:50.000Z`
Merged pull requests: `2`

---

## Release Changelog since v0.1.0

### Features

- Add changelog preview command (#17) by @nlln19

### Fixes

- Fix pull request grouping (#18) by @nlln19