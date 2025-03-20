# Project Rules and Conventions

## Code Style and Organization

### File and Folder Structure
- Use kebab-case for file names (e.g., `notice-board.js`)
- Group related files in descriptive folders:
  ```
  src/
  ├── components/
  ├── pages/
  ├── lib/
  ├── models/
  ├── hooks/
  ├── utils/
  └── styles/
  ```

### Naming Conventions
- **Components**: PascalCase (e.g., `NoticeCard.js`)
- **Functions**: camelCase (e.g., `getNotices()`)
- **Variables**: camelCase (e.g., `userProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_NOTICES_PER_PAGE`)
- **Database Fields**: camelCase (matching the models defined in guide)

### JavaScript Conventions
- Use ES6+ features
- Use PropTypes for component props validation
- Use JSDoc for type documentation
- Prefer const over let, avoid var
- Use destructuring where applicable
- Use arrow functions for component definitions
- Use async/await for asynchronous operations

## Git Conventions

### Branches
- Main branch: `main`
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`
- Releases: `release/version-number`

### Commit Messages
- Format: `type(scope): message`
- Types:
  - feat: New feature
  - fix: Bug fix
  - docs: Documentation
  - style: Formatting
  - refactor: Code restructuring
  - test: Adding tests
  - chore: Maintenance

## API Conventions

### Endpoints
- Use RESTful conventions
- Base URL: `/api`
- Versioning: Not required for initial release
- Authentication: JWT in Authorization header

### Response Format
```javascript
{
  success: boolean,
  data: Object || null,
  error: {
    message: String,
    code: String
  } || null
}
```

## Security Rules

### Authentication
- Passwords must be hashed using bcrypt
- Minimum password length: 4 characters

### Authorization
- Only super admins can create/edit/delete notices
- Regular users can only view notices
- API routes must validate JWT and user role

## Notice Rules

### Content
- Title: 5-100 characters
- Description: 10-1000 characters
- Dates must be valid and endingDate must be after startingDate
- All notices must have both dates specified

### Display
- Sort notices by startingDate (newest first)
- Show active notices first
- Paginate results (10 notices per page)

## Testing Requirements

### Unit Tests
- Required for all utility functions
- Required for API routes
- Required for database operations

### Integration Tests
- Test complete user flows
- Test authentication process
- Test notice CRUD operations

## Performance Guidelines

### Frontend
- Implement proper loading states
- Use proper image optimization
- Implement proper error boundaries
- Use client-side caching where appropriate

### Backend
- Implement rate limiting
- Use proper database indexing
- Implement request timeout handling
- Cache frequently accessed data

## Documentation Requirements

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Keep README up to date
- Document all environment variables

### API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes
- Keep postman collection updated

## Deployment Rules

### Environment Variables
- Never commit .env files
- Document all required environment variables
- Use separate environments for development/staging/production

### Build Process
- Run ESLint checks before deployment
- Check for security vulnerabilities
- Optimize assets for production
- Use proper error handling middleware```

These rules and conventions will help maintain consistency throughout the project development process.
