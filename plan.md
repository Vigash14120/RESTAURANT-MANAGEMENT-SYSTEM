# RMS Implementation Plan

## Problem and approach
Build the Restaurant Management System from the constitution using React + TypeScript + Node.js + MySQL, split into 6 delivery modules so backend domains and frontend features can be built incrementally with clear dependencies.

## Modules (5-6 target: using 6)
1. Foundation and scaffolding
2. Database schema and migrations
3. Floor and reservation domain
4. Orders ticketing and kitchen service
5. Inventory suppliers and maintenance
6. Frontend shell and dashboards

## Execution order
- Start module 1 immediately.
- Module 2 depends on module 1.
- Modules 3, 4, and 5 depend on module 2.
- Module 6 integrates modules 3, 4, and 5.

## Notes
- Finalize ambiguous relationships during module 2 before exposing public API contracts.
- Keep API and DB naming aligned with constitution (`snake_case` DB, typed DTOs in TypeScript).
- Detailed module plans are stored in `plans/`.
- Module 1 foundation and scaffolding is completed.
- Module 2 plan is saved at `plans/module-2-database-schema-migrations.md`.
