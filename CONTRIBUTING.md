# Contributing to OnScribe

Thank you for your interest in contributing to OnScribe! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professionalism

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a detailed issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has been requested
2. Create an issue with:
   - Clear use case
   - Proposed solution
   - Potential alternatives
   - Implementation considerations

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Create a pull request

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/yourusername/onscribe.git
cd onscribe

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Fill in your credentials in .env

# Start development server
npm run dev
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types
- Use functional components

### React
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into hooks
- Use proper prop types

### Naming Conventions
- Components: PascalCase (`ArticleCard.tsx`)
- Functions: camelCase (`generateSlug`)
- Constants: UPPER_CASE (`MAX_TITLE_LENGTH`)
- Types/Interfaces: PascalCase (`Article`, `CreateArticleInput`)

### File Organization
```
component-name/
├── index.tsx           # Main component
├── hooks/              # Custom hooks
├── utils.ts           # Helper functions
└── types.ts           # Type definitions
```

## Testing

### Run Tests
```bash
npm test                # Run all tests
npm test:watch         # Watch mode
npm test:coverage      # Coverage report
```

### Writing Tests
- Unit tests for utilities
- Component tests for UI
- Integration tests for API
- E2E tests for critical flows

### Test Example
```typescript
import { generateSlug } from './utils';

describe('generateSlug', () => {
  it('converts title to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(generateSlug('Hello! World?')).toBe('hello-world');
  });
});
```

## Commit Messages

Format: `type(scope): message`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(editor): add image upload functionality
fix(api): resolve article creation bug
docs(readme): update setup instructions
```

## Pull Request Process

1. **Update Documentation**: Update README if needed
2. **Add Tests**: Include tests for new features
3. **Update Changelog**: Add entry to CHANGELOG.md
4. **Check Build**: Ensure `npm run build` succeeds
5. **Run Linter**: Fix any linting issues
6. **Request Review**: Tag relevant maintainers

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

## Project Structure

```
onscribe/
├── app/                    # Next.js pages
│   ├── api/               # API routes
│   └── [pages]/           # Page components
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── [features]/       # Feature components
├── lib/                   # Utility libraries
├── types/                 # TypeScript types
└── public/               # Static assets
```

## Key Areas

### Frontend Development
- React components in `components/`
- Pages in `app/`
- Styling with Tailwind CSS
- State management with React hooks

### Backend Development
- API routes in `app/api/`
- Database queries in route handlers
- External API integrations in `lib/`

### Blockchain Integration
- Story Protocol in `lib/story-protocol.ts`
- IPFS operations in `lib/ipfs.ts`
- Web3 configuration in providers

### Database
- Schema in `supabase-schema.sql`
- Queries use Supabase client
- RLS policies for security

## Best Practices

### Performance
- Use Next.js Image component
- Implement lazy loading
- Optimize bundle size
- Cache API responses

### Security
- Never commit secrets
- Validate all inputs
- Sanitize user content
- Use environment variables

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### SEO
- Meta tags on all pages
- Structured data
- Sitemap generation
- Open Graph tags

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Story Protocol Docs](https://docs.storyprotocol.xyz)
- [Supabase Documentation](https://supabase.com/docs)

## Getting Help

- GitHub Issues for bugs
- GitHub Discussions for questions
- Discord for community chat
- Email for security issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website

Thank you for contributing to OnScribe!
