# Contributing Guide

Thank you for your interest in contributing to MusicStream!

## Development Setup

See [SETUP.md](./SETUP.md) for full setup instructions.

## Branch Strategy

- `main` — production-ready code
- `develop` — integration branch
- `feature/<name>` — new features
- `fix/<name>` — bug fixes
- `hotfix/<name>` — urgent production fixes

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `develop`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test your changes
5. Commit with a clear message:
   ```bash
   git commit -m "feat: add user avatar upload"
   ```
6. Push and open a pull request to `develop`

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation update
- `style:` — formatting (no logic change)
- `refactor:` — code refactor
- `test:` — adding tests
- `chore:` — maintenance tasks

Examples:
```
feat: add audio equalizer component
fix: resolve playlist song ordering bug
docs: update API endpoint examples
```

## Code Style

### JavaScript/React
- Use functional components with hooks
- Use `const` for variables that don't reassign
- Use `async/await` over `.then()` chains
- Prefer named exports for components
- Keep components focused (single responsibility)

### CSS / Tailwind
- Use Tailwind utility classes
- Custom CSS only for complex animations or browser-specific styling
- Use the design tokens defined in `tailwind.config.js`

## Project Structure

```
frontend/src/
  components/   # Reusable UI components
  pages/        # Route-level page components
  context/      # React context providers
  hooks/        # Custom hooks
  services/     # API service functions
  styles/       # Global CSS files
```

## Reporting Bugs

Please open a GitHub issue with:
- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, browser)

## Feature Requests

Open a GitHub issue with the `enhancement` label. Describe the feature and its use case clearly.

## Code of Conduct

Be respectful, inclusive, and constructive. We're here to build something great together.
