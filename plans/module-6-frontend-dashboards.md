# Module 6 Plan - Frontend Shell and Dashboards

## Goal
Finalize the RMS platform by implementing the remaining domains (Staffing and Assignments), aggregating system-wide data into a high-level analytics Dashboard, and completing the frontend shell.

## Scope
- Backend entities/services for Staff and Assignments:
  - `staff`
  - `staff_member`
  - `staff_shift_log`
  - `job_assignment`
  - `equipment`
- Backend entities/services for Restaurant/Menu (Global Settings):
  - `restaurant`
  - `menu_category`
  - `dish`
  - `recipe`
- REST endpoints for:
  - Managing staff, shift logs, and job assignments.
  - Fetching aggregated dashboard metrics (e.g., active orders, low stock alerts, active reservations).
- Frontend workflows for:
  - `StaffingAssignmentsPage`: Manage staff, view shift logs, and assign equipment to jobs.
  - `DashboardPage`: High-level widget overview of restaurant health.

## Deliverables
1. Shared DTOs and contracts for Staffing, Menu, and Analytics.
2. Data access and service layers for the remaining schema entities.
3. API routes for Staff, Menu, and Dashboard analytics.
4. Finished React UI for `StaffingAssignmentsPage.tsx`.
5. Finished React UI for `DashboardPage.tsx`.
6. Full application integration pass.

## Task Breakdown
1. Define shared DTOs/contracts for Staff, Menu, and Dashboard analytics.
2. Implement repository layer for Staff, Assignments, Menu, and Analytics.
3. Implement REST API routes for the remaining domains.
4. Build `StaffingAssignmentsPage` UI to manage staff and shifts.
5. Build `DashboardPage` UI combining metrics from Modules 3, 4, 5, and 6.
6. Conduct final RMS Integration Pass (requires database configuration).

## Acceptance Criteria
- All 6 defined pages in the React Router are fully functional.
- Staff records, shift logs, and job/equipment assignments can be managed.
- The Dashboard accurately aggregates cross-module data (reservations, orders, inventory).
- The application acts as a cohesive shell without hanging routes or missing API links.
