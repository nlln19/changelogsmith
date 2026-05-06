# Contributing

Thanks for your interest in contributing to ChangelogSmith.

ChangelogSmith is a GitHub App that generates changelog previews from merged pull requests.

## Reporting Issues

Open an issue if you find a bug or have an idea for an improvement.

Please include:

- what you expected to happen
- what actually happened
- steps to reproduce the issue
- relevant logs or screenshots, if available

## Development Setup

Install dependencies:

```sh
npm install
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

Start the app:

```sh
npm start
```

## Running Checks

Before opening a pull request, run:

```sh
npm run check
npm test
npm run lint
```

Format code with:

```sh
npm run format
```

## Pull Requests

1. Fork and clone the repository.
2. Create a new branch:

```sh
git checkout -b my-change
```

3. Make your changes.
4. Add or update tests when needed.
5. Run the checks.
6. Open a pull request.

Keep pull requests focused and small when possible.

## Commit Messages

Use clear commit messages, for example:

```txt
fix: handle missing release config
feat: add release preview command
docs: update setup instructions
```

## Security

Do not commit:

- `.env`
- GitHub App private keys
- API keys
- tokens
- generated secret files

## Code of Conduct

By participating in this project, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).