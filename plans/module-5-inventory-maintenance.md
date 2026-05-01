# Module 5 Plan - Inventory, Suppliers, and Maintenance

## Goal
Implement inventory tracking, supplier management, and maintenance logging flows, ensuring stock levels are maintained and equipment/supplements are adequately serviced.

## Scope
- Backend entities/services for:
  - `supplier`
  - `ingredient_stock`
  - `supplier_ingredient_stock`
  - `supplement_maintenance_log`
- REST endpoints for managing suppliers, viewing and updating ingredient stock, linking suppliers to ingredients, and logging maintenance tasks.
- Frontend workflows for:
  - Adding and listing suppliers.
  - Viewing current ingredient inventory levels.
  - Tracking supplier-ingredient mappings.
  - Logging maintenance records for external supplements.
- Shared type contracts and request validation schemas.

## Deliverables
1. Shared DTOs and contracts for inventory, supplier, and maintenance APIs.
2. API routes and service layer for CRUD operations on inventory and suppliers.
3. React screens for inventory management, supplier directory, and maintenance logs.
4. Typed API contracts shared between frontend and backend.
5. Integration notes for handoff to Module 6 dashboard aggregation.

## Task Breakdown
1. Finalize shared DTOs/contracts for supplier, ingredient_stock, supplier_ingredient_stock, and supplement_maintenance_log APIs.
2. Implement repository layer for inventory and supplier data access.
3. Add supplier and inventory endpoints (create/list/update operations).
4. Add supplier-ingredient linking endpoints.
5. Add maintenance log endpoints.
6. Build frontend UI for inventory and suppliers.
7. Build frontend UI for maintenance logs.
8. Run integration pass for Module 5.

## Acceptance Criteria
- Supplier records can be created and listed successfully.
- Ingredient stock levels can be managed and prevented from falling below 0.
- Ingredients can be properly linked to multiple suppliers.
- Maintenance logs for external suppliers can be created and queried.
- UI supports clear data tables and forms for these entities.
- All payloads/responses are validated and typed across API and web clients.

## Dependency Note
- Module 5 relies on Module 2 database schemas being available.
