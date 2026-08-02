# Agent Guidelines & Project Rules

## Environment Variables & Security Rules
- **NEVER hardcode environment variables, secret tokens, API keys, or default values** directly into source code, build scripts, or CI/CD workflow files (e.g. `.github/workflows/*.yml`).
- Environment variables must ALWAYS be referenced strictly through:
  - Runtime environment files (`.env` / `.env.example`)
  - GitHub Secrets (`${{ secrets.VARIABLE_NAME }}`) or GitHub Variables (`${{ vars.VARIABLE_NAME }}`)
- ALWAYS ask the user for confirmation before introducing or modifying environment variable mappings in configuration files.
