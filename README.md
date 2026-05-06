# ChangelogSmith

A GitHub App that generates changelog previews from merged pull requests.

## Features

- Detects merged pull requests
- Finds the latest GitHub release
- Includes only PRs merged after the latest release
- Groups PRs by labels such as `feature`, `bug`, and `docs`
- Supports `/changelogsmith preview` in pull request comments
- Works without AI or paid external APIs

## Usage

Comment this on a pull request:

```txt
/changelogsmith preview
```

ChangelogSmith replies with a release changelog preview.

Example:

```md
## Release Changelog since v0.1.0

### Features

- Add preview command (#17) by @nlln19

### Fixes

- Fix label grouping (#18) by @nlln19
```

## Default Label Mapping

| Labels | Section |
|---|---|
| `breaking`, `breaking-change` | Breaking Changes |
| `feature`, `enhancement` | Features |
| `bug`, `fix` | Fixes |
| `docs`, `documentation` | Documentation |
| `chore`, `refactor`, `dependencies`, `deps` | Maintenance |
| everything else | Other |

## Configuration

Optional repository config:

```txt
.github/changelogsmith.yml
```

Example:

```yml
commentOnMergedPullRequest: false
changelogTitle: Pull Request Changelog Preview

sectionOrder:
  - Breaking Changes
  - Features
  - Fixes
  - Documentation
  - Maintenance
  - Other
```

## Local Development

```sh
npm install
npm start
```

Create a local `.env` file:

```env
WEBHOOK_PROXY_URL=https://smee.io/your-smee-url
APP_ID=your-github-app-id
PRIVATE_KEY_PATH=your-private-key.pem
WEBHOOK_SECRET=development
LOG_LEVEL=info
```

Do not commit `.env` or private key files.

## GitHub App Permissions

Required repository permissions:

| Permission | Access |
|---|---|
| Metadata | Read-only |
| Contents | Read-only |
| Pull requests | Read-only |
| Issues | Read and write |

Subscribed events:

```txt
pull_request
issue_comment
```

## License

[ISC](LICENSE) © 2026 Nillan Sivarasa