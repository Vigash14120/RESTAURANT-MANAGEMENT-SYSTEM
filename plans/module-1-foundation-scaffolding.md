# Module 1 Plan - Foundation and Scaffolding

## Goal
Establish a production-ready baseline for RMS development so all later modules can be implemented consistently across React, Node.js, and MySQL.

## Scope
- Monorepo/app structure:
  - `apps/web` (React + TypeScript)
  - `apps/api` (Node.js + TypeScript + Express)
  - `database` (schema + migrations)
  - `packages/shared-types` (shared DTO and domain types)
- Tooling setup:
  - TypeScript strict mode
  - Linting + formatting baseline
  - Environment variable strategy (`.env.example`, runtime validation)
  - Shared scripts for dev/build/test
- API baseline:
  - Health endpoint
  - Error response format
  - Request validation pattern
- Database baseline:
  - MySQL connection layer
  - Migration runner scaffold
  - Initial migration folder structure
- Frontend baseline:
  - App shell layout (sidebar + top bar + routed pages placeholders)
  - API client service with typed responses

## Deliverables
1. Workspace and package setup complete with installable dependencies.
2. Apps start independently (`web` and `api`) with documented run commands.
3. Shared types package consumed by both frontend and backend.
4. Migration framework wired and ready for Module 2 schema implementation.
5. Base UI shell and route skeleton matching RMS module areas.

## Task Breakdown
1. Initialize directory structure and package manifests.
2. Configure TypeScript project references and strict compiler settings.
3. Add ESLint/Prettier and root scripts (`dev`, `build`, `test`, `lint`).
4. Create API bootstrap (Express app, middleware, health route, error handler).
5. Create DB bootstrap (pool config, migration command entrypoint).
6. Create web bootstrap (router, shell, placeholder pages, API client).
7. Add shared type contracts for base entities and API envelope.
8. Add environment templates and startup documentation.

## Acceptance Criteria
- Single command installs all dependencies.
- API starts and returns a typed JSON health response.
- Web starts and renders navigation + module placeholders.
- Shared TypeScript types compile in both apps without duplication.
- Migration command runs (even with empty migration set) successfully.

## Out of Scope
- Full domain schema implementation (Module 2).
- Domain business workflows and CRUD screens (Modules 3-6).
