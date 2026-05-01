# Module 3 Plan - Floor and Reservation Domain

## Goal
Implement the floor and reservation domain end-to-end with typed API contracts and React screens for table visibility, assignments, and reservation lifecycle.

## Scope
- Backend entities/services for:
  - `restaurant`
  - `tables`
  - `floor_table`
  - `reservation`
  - `table_assignment`
  - reference status lookups used by reservation flow
- REST endpoints with validation and explicit error responses.
- Frontend pages/components for:
  - floor/table list + status visualization
  - reservation creation/update/cancel flow
  - table assignment workflow
- Shared DTO updates in `packages/shared-types`.

## Deliverables
1. API routes and service layer for floor/reservation operations.
2. Request/response schemas and validation for all endpoints.
3. React UI for table map/list, reservation timeline/list, and assignment actions.
4. Query patterns and indexes aligned to reservation status/time and table usage.
5. Domain notes for edge-case behavior (double-booking, capacity mismatch, invalid status transitions).

## Task Breakdown
1. Define final DTO contracts for floor/reservation APIs in shared types.
2. Implement repository/service methods for tables, floor tables, reservations, and assignments.
3. Add API routes:
   - `GET /api/floor-tables`
   - `GET /api/reservations`
   - `POST /api/reservations`
   - `PATCH /api/reservations/:id/status`
   - `POST /api/table-assignments`
4. Enforce business rules:
   - no overlapping reservations for same table/time slot
   - reservation table capacity must satisfy party size
   - status transitions must be valid
5. Build frontend pages for floor/tables and reservations with filtering/search.
6. Wire API client and optimistic UI/state refresh patterns.
7. Add error/empty/loading states and actionable validation messages.
8. Verify integration against migrated database state.

## Acceptance Criteria
- Floor and reservation APIs work with validated payloads and typed responses.
- Users can create, view, update, and cancel reservations from UI.
- Table assignment reflects in both floor and reservation views.
- Invalid transitions and booking conflicts are rejected with clear error messages.
- Shared types are consumed consistently by both API and web apps.

## Dependency Note
- Module 3 implementation should start after Module 2 migration validation is unblocked (valid MySQL credentials and successful migration run).

## Out of Scope
- Kitchen/service order workflows (Module 4).
- Inventory/supplier workflows (Module 5).
- Cross-module dashboard aggregation (Module 6).
