# Module 2 Contract Notes

## Finalized Decisions

1. **Order chain normalization**
   - Canonical flow is `customer_order` (header) -> `ticket` (1:1) -> `order_ticket` (1:1).
   - `order_ticket.customer_order_id` is retained and unique for explicit joins and consistency checks.
   - This resolves conflicting cardinality statements by enforcing a single deterministic path.

2. **Tables vs kitchen/service model**
   - `kitchen_order` and `service_order` are modeled as child entities referencing `tables`.
   - ISA wording is treated as operational specialization, not table inheritance.

3. **Staff overlap**
   - `staff` remains master identity (`staff_id`, names).
   - `staff_member` holds payroll/restaurant assignment and keeps `first_name` to preserve requested attributes.
   - `staff_member.employer_staff_id` links back to `staff`.

4. **Floor table overlap**
   - `floor_table` is a table extension keyed by `table_number` (PK/FK to `tables`).
   - `capacity` is retained in both tables to preserve requested attributes for both entities.

5. **Typo and field cleanup**
   - `emergency_request.order_tine` was removed.
   - Canonical field is `emergency_request.order_time`.

6. **Status strategy**
   - Status text is normalized via reference tables:
     - `restaurant_status`
     - `reservation_status`
   - `reservation` now stores `reservation_status_id`.

## Constraint and Safety Defaults
- Core parent-child links use `ON DELETE RESTRICT`.
- Optional ownership links use `ON DELETE SET NULL` (`manager_restaurant_id`, `employer_staff_id`, `served_by_staff_member_id`, `table_assignment.reservation_id`).
- Monetary and stock fields enforce non-negative checks.

## Migration Sequence
1. `0001_base_tables.sql`
2. `0002_relationship_constraints.sql`
3. `0003_performance_indexes.sql`
4. `0004_seed_reference_data.sql`
