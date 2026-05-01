# Module 4 Plan - Orders, Ticketing, and Kitchen Service

## Goal
Implement order intake, ticketing, kitchen/service coordination, and emergency escalation flows with typed API contracts and operational UI.

## Scope
- Backend entities/services for:
  - `customer_order`
  - `ticket`
  - `order_ticket`
  - `kitchen_order`
  - `service_order`
  - `kitchen_ticket_log`
  - `emergency_request`
  - `payment_area`
- REST endpoints for order lifecycle, ticket lifecycle, kitchen dispatch, and emergency handoff.
- Frontend workflows for:
  - order creation and ticket generation
  - kitchen/service board status tracking
  - emergency escalation and payment-area linkage
- Shared type contracts and request validation schemas.

## Deliverables
1. API routes and service layer for orders/tickets/kitchen/emergency flows.
2. Business rule enforcement for ticket linkage, table-order constraints, and escalation validity.
3. React screens for order creation, ticket timeline, and kitchen/service operations.
4. Typed API contracts shared between frontend and backend.
5. Integration notes for handoff to Module 6 dashboard aggregation.

## Task Breakdown
1. Finalize shared DTOs/contracts for order, ticket, kitchen, service, and emergency APIs.
2. Implement repository/service layer for order and ticket linking.
3. Add order/ticket endpoints (create/list/detail/update operations).
4. Add kitchen/service dispatch endpoints and board query endpoints.
5. Add emergency request + payment-area linkage endpoints.
6. Build frontend order/ticket management page flows.
7. Build frontend kitchen/service board with actionable transitions.
8. Run integration pass and confirm cross-module consistency with reservations/tables.

## Acceptance Criteria
- Order creation produces valid linked records (`customer_order` -> `ticket` -> `order_ticket`).
- Kitchen/service APIs expose actionable queues and update operations.
- Emergency requests are linked to tickets and payment areas correctly.
- UI supports order-to-kitchen operational flow with clear status feedback.
- All payloads/responses are validated and typed across API and web clients.

## Dependency Note
- Module 4 implementation should start after Module 2 migration validation is unblocked and database connectivity is configured.

## Out of Scope
- Inventory and supplier workflows (Module 5).
- Final cross-domain KPI dashboards (Module 6).
