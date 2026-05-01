# Restaurant Management System (RMS)

Module 1 establishes the base workspace for:
- React + TypeScript frontend (`apps/web`)
- Node.js + TypeScript API (`apps/api`)
- Shared type contracts (`packages/shared-types`)
- MySQL migration structure (`database/migrations`)

## Prerequisites
- Node.js 20+
- npm 10+
- MySQL 8+

## Setup
1. Copy environment templates:
   - Root: `.env.example` -> `.env` (optional convenience)
   - API: `apps/api/.env.example` -> `apps/api/.env`
   - Web: `apps/web/.env.example` -> `apps/web/.env`
2. Install dependencies:
   - `npm install`

## Run
- API only: `npm run dev -w @rms/api`
- Web only: `npm run dev -w @rms/web`
- Both apps: `npm run dev`

## Build and quality checks
- Build all: `npm run build`
- Typecheck all: `npm run typecheck`
- Lint all: `npm run lint`
- Tests: `npm run test`

## Migrations
- Run migrations: `npm run migrate`
- SQL files location: `database/migrations`
