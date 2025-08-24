# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by emailing [batuhangoren99@hotmail.com]. Please do not report security vulnerabilities through public GitHub issues.

When reporting, please include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes

We will acknowledge your report within 48 hours and provide a timeline for resolution.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Best Practices for Contributors

### Authentication & Data Protection
- Always validate user input on both client and server side
- Use parameterized queries to prevent SQL injection
- Implement proper session management
- Never commit sensitive data to the repository

### Environment Security
- Keep all environment variables in `.env` files
- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Regularly rotate API keys and secrets

### Code Security
- Keep dependencies updated
- Run security audits regularly (`npm audit`)
- Use TypeScript strict mode
- Implement proper error handling without exposing sensitive information

### Data Handling
- Implement proper access controls
- Use encryption for sensitive data at rest
- Ensure secure data transmission (HTTPS)
- Follow data minimization principles

## Security Measures Implemented

- JWT-based authentication with secure token handling
- Input validation using class-validator
- CORS configuration
- Rate limiting on API endpoints
- Secure password hashing
- Database query protection via ORM

For questions about this security policy, please contact the development team.