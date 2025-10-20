# Contributing to Family Hub

Thank you for considering contributing to Family Hub! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and constructive in all interactions. This project aims to be welcoming to contributors of all backgrounds and experience levels.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, browser)

### Suggesting Features

1. Open an issue with the "Feature Request" label
2. Describe the feature and why it would be useful
3. Include examples or mockups if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write/update tests if applicable
5. Run linting: `npm run lint:fix`
6. Format code: `npm run format`
7. Commit with clear messages
8. Push to your fork
9. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/family-hub.git
cd family-hub

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npm run db:generate

# Push schema to local database
npx prisma db push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types when possible
- Use proper type definitions

### Vue/Nuxt

- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Use composables for shared logic
- Keep components focused and reusable

### Code Style

- Run ESLint: `npm run lint`
- Run Prettier: `npm run format`
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Git Commit Messages

Follow the conventional commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```
feat: add calendar month view

- Implement month grid layout
- Add navigation between months
- Show event indicators on dates
```

## Project Structure

- `components/` - Reusable Vue components
- `composables/` - Vue composables
- `layouts/` - Page layouts
- `lib/` - Utility functions
- `middleware/` - Route middleware
- `pages/` - Application pages (auto-routed)
- `server/api/` - API endpoints
- `prisma/` - Database schema and migrations

## Testing

While this project doesn't have automated tests yet, contributions to add testing are welcome!

Suggested test areas:
- API endpoint tests
- Component unit tests
- Integration tests
- E2E tests with Playwright

## Documentation

When adding features:
- Update README.md if needed
- Add JSDoc comments to functions
- Update DEPLOYMENT.md for deployment changes
- Add inline comments for complex logic

## Review Process

1. Maintainer reviews the PR
2. Feedback is provided if changes needed
3. Once approved, PR is merged
4. Changes are deployed in next release

## Questions?

Feel free to open an issue with the "Question" label or reach out to maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

