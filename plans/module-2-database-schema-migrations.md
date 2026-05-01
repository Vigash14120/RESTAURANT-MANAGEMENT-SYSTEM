# Module 2 Plan - Database Schema and Migrations

## Goal
Deliver a production-safe MySQL schema and migration baseline that exactly supports RMS domain implementation for Modules 3-6.

## Scope
- Convert constitution schema into executable SQL migrations.
- Resolve ambiguous/contradictory relationships before final DDL is locked.
- Define FK actions, unique constraints, indexes, and enum/reference tables.
- Add deterministic seed data for local development.
- Keep `database/schema.sql` synchronized with final migration state.

## Key Decisions to Finalize in Module 2
1. Canonical order model (`customer_order`, `ticket`, `order_ticket`) and exact cardinalities.
2. Modeling choice for `tables` with `kitchen_order`/`service_order` (inheritance vs separate relation).
3. Canonical ownership between overlapping entities (`staff`/`staff_member`, `tables`/`floor_table`).
4. Field normalization and typo cleanup (`order_time` vs `order_tine`).
5. Status handling strategy (free text vs constrained enum/reference table).

## Deliverables
1. Versioned SQL migrations in `database/migrations` (forward-only).
2. Canonical snapshot in `database/schema.sql`.
3. Seed migration for minimum runnable data.
4. Constraint/index strategy documented inline in SQL and reflected in plan notes.
5. API-facing schema stability contract for Modules 3-6.

## Task Breakdown
1. Create migration numbering and naming convention (`0001_*.sql`, `0002_*.sql`, ...).
2. Draft base table migration without high-risk FKs.
3. Add relationship constraints and unique keys after base tables exist.
4. Add performance indexes for common lookups (table status, reservation time, ticket/order joins, stock lookups).
5. Add seed migration for status/reference rows and demo baseline records.
6. Rebuild schema snapshot from applied migrations.
7. Run migration workflow end-to-end and fix ordering/transaction issues.
8. Publish final relationship decision notes for downstream module API work.

## Acceptance Criteria
- Migrations run from empty database to latest without manual intervention.
- Re-running migrations is idempotent (no duplicate apply of prior files).
- All agreed entity relationships are represented by explicit FK constraints.
- Ambiguous fields/relations are resolved and no duplicate semantic fields remain.
- `database/schema.sql` matches migration-composed database state.

## Out of Scope
- CRUD endpoint implementation (Module 3+).
- Frontend data screens (Modules 3-6).
