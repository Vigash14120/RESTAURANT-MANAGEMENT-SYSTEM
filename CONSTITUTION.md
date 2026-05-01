# Restaurant Management System Constitution

## 1. Purpose
This document is the **source of truth** for implementing the Restaurant Management System (RMS) with:
- **Frontend:** React + TypeScript
- **Backend:** Node.js + TypeScript (Express)
- **Database:** MySQL 8+

All modules, APIs, migrations, and UI flows must conform to this constitution.

## 2. Core Architecture
- `apps/web`: React + TypeScript client.
- `apps/api`: Node.js + TypeScript REST API.
- `database/schema.sql`: canonical MySQL schema from this constitution.
- `database/migrations`: forward-only schema migrations.

## 3. Naming and Data Rules
- Database naming uses `snake_case`.
- Every table has a primary key.
- Foreign keys are mandatory for declared relationships.
- `created_at`/`updated_at` timestamps are added where lifecycle tracking is needed.
- Use `DECIMAL(10,2)` for money fields (`salary`, `menu_price`).

## 4. Canonical Entity Implementation
The following schema implements your provided entities and relationship set (including inferred entities referenced by relationships but missing from the entity list: `status`, `kitchen_order`, `staff_shift_log`, `customer`, `order_ticket`, `payment_area`, `equipment`).

```sql
CREATE TABLE restaurant_status (
  status_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE restaurant (
  restaurant_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  phone_number VARCHAR(30) NOT NULL,
  manager_restaurant_id BIGINT NULL,
  status_id BIGINT NULL,
  CONSTRAINT fk_restaurant_manager
    FOREIGN KEY (manager_restaurant_id) REFERENCES restaurant(restaurant_id),
  CONSTRAINT fk_restaurant_status
    FOREIGN KEY (status_id) REFERENCES restaurant_status(status_id)
);

CREATE TABLE staff (
  staff_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL
);

CREATE TABLE staff_member (
  staff_member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  employer_staff_id BIGINT NULL,
  restaurant_id BIGINT NOT NULL,
  CONSTRAINT fk_staff_member_employer
    FOREIGN KEY (employer_staff_id) REFERENCES staff(staff_id),
  CONSTRAINT fk_staff_member_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE staff_shift_log (
  shift_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_id BIGINT NOT NULL,
  shift_time DATETIME NOT NULL,
  CONSTRAINT fk_shift_log_staff
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

CREATE TABLE tables (
  table_number INT PRIMARY KEY,
  restaurant_id BIGINT NOT NULL,
  capacity INT NOT NULL,
  CONSTRAINT fk_tables_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE floor_table (
  table_number INT PRIMARY KEY,
  capacity INT NOT NULL,
  location VARCHAR(100) NOT NULL,
  served_by_staff_member_id BIGINT UNIQUE NULL,
  CONSTRAINT fk_floor_table_table
    FOREIGN KEY (table_number) REFERENCES tables(table_number),
  CONSTRAINT fk_floor_table_staff_member
    FOREIGN KEY (served_by_staff_member_id) REFERENCES staff_member(staff_member_id)
);

CREATE TABLE reservation (
  reservation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  reservation_time DATETIME NOT NULL,
  status VARCHAR(30) NOT NULL,
  CONSTRAINT fk_reservation_floor_table
    FOREIGN KEY (table_number) REFERENCES floor_table(table_number)
);

CREATE TABLE table_assignment (
  assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  reservation_id BIGINT NULL,
  menu_price DECIMAL(10,2) NULL,
  CONSTRAINT fk_table_assignment_floor_table
    FOREIGN KEY (table_number) REFERENCES floor_table(table_number),
  CONSTRAINT fk_table_assignment_reservation
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
);

CREATE TABLE menu_category (
  category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  current_location VARCHAR(120) NULL,
  CONSTRAINT fk_menu_category_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE dish (
  item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  category_name VARCHAR(120) NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  is_alcoholic BOOLEAN NOT NULL DEFAULT FALSE,
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_dish_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id),
  CONSTRAINT fk_dish_category
    FOREIGN KEY (category_id) REFERENCES menu_category(category_id)
);

CREATE TABLE recipe (
  recipe_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  item_id BIGINT NOT NULL,
  CONSTRAINT fk_recipe_dish
    FOREIGN KEY (item_id) REFERENCES dish(item_id)
);

CREATE TABLE customer (
  customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(150) NULL
);

CREATE TABLE kitchen_ticket_log (
  kitchen_ticket_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  emergency_id VARCHAR(100) NULL,
  dispatch_time DATETIME NULL,
  CONSTRAINT fk_kitchen_ticket_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE customer_order (
  customer_order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  table_number INT NOT NULL UNIQUE,
  dish_type VARCHAR(50) NOT NULL,
  time_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_customer_order_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  CONSTRAINT fk_customer_order_table
    FOREIGN KEY (table_number) REFERENCES tables(table_number)
);

CREATE TABLE ticket (
  ticket_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_order_id BIGINT NOT NULL UNIQUE,
  party_size INT NOT NULL,
  CONSTRAINT fk_ticket_customer_order
    FOREIGN KEY (customer_order_id) REFERENCES customer_order(customer_order_id)
);

CREATE TABLE order_ticket (
  order_ticket_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL UNIQUE,
  customer_order_id BIGINT NOT NULL,
  CONSTRAINT fk_order_ticket_ticket
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id),
  CONSTRAINT fk_order_ticket_customer_order
    FOREIGN KEY (customer_order_id) REFERENCES customer_order(customer_order_id)
);

CREATE TABLE emergency_request (
  order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_ticket_id BIGINT NOT NULL,
  order_time DATETIME NOT NULL,
  order_tine DATETIME NULL,
  CONSTRAINT fk_emergency_request_order_ticket
    FOREIGN KEY (order_ticket_id) REFERENCES order_ticket(order_ticket_id)
);

CREATE TABLE payment_area (
  payment_area_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  emergency_order_id BIGINT NOT NULL,
  CONSTRAINT fk_payment_area_emergency
    FOREIGN KEY (emergency_order_id) REFERENCES emergency_request(order_id)
);

CREATE TABLE kitchen_order (
  kitchen_order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  staff_member_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kitchen_order_table
    FOREIGN KEY (table_number) REFERENCES tables(table_number),
  CONSTRAINT fk_kitchen_order_staff_member
    FOREIGN KEY (staff_member_id) REFERENCES staff_member(staff_member_id)
);

CREATE TABLE service_order (
  service_order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  is_alcoholic BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_order_table
    FOREIGN KEY (table_number) REFERENCES tables(table_number)
);

CREATE TABLE supplier (
  supplier_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(150) NOT NULL
);

CREATE TABLE ingredient_stock (
  ingredient_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  stock_level DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE supplier_ingredient_stock (
  supplier_id BIGINT NOT NULL,
  ingredient_id BIGINT NOT NULL,
  PRIMARY KEY (supplier_id, ingredient_id),
  CONSTRAINT fk_supplier_ingredient_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id),
  CONSTRAINT fk_supplier_ingredient_stock
    FOREIGN KEY (ingredient_id) REFERENCES ingredient_stock(ingredient_id)
);

CREATE TABLE supplement_maintenance_log (
  maintenance_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  supplier_id BIGINT NOT NULL UNIQUE,
  logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  details TEXT NULL,
  CONSTRAINT fk_supplement_log_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE job_assignment (
  assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_id BIGINT NOT NULL,
  shift_time DATETIME NOT NULL,
  restaurant_id BIGINT NOT NULL UNIQUE,
  CONSTRAINT fk_job_assignment_staff
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
  CONSTRAINT fk_job_assignment_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE equipment (
  equipment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  assignment_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  CONSTRAINT fk_equipment_assignment
    FOREIGN KEY (assignment_id) REFERENCES job_assignment(assignment_id)
);
```

## 5. Relationship Contract (Implemented)
- `restaurant` self-reference (`manages`), and `restaurant` -> `restaurant_status`.
- `restaurant` contains `tables` (1:N), `dish` (1:N), `menu_category` (1:1).
- `tables` -> `kitchen_order` (1:N) and `tables` -> `service_order` (1:N).
- `kitchen_order` -> `staff_member` (N:1).
- `staff_member` -> `floor_table` (1:1 via `served_by_staff_member_id`).
- `staff_member` -> `staff` (N:1 via `employer_staff_id`).
- `staff` -> `staff_shift_log` (1:N).
- `floor_table` -> `table_assignment` (1:N) and `floor_table` -> `reservation` (1:N).
- `customer` -> `kitchen_ticket_log` (1:N).
- `customer_order` -> `tables` (1:1).
- `customer_order` -> `order_ticket` (N:1 implemented by FK to `customer_order`).
- `customer_order` <-> `ticket` (1:1).
- `ticket` <-> `order_ticket` (1:1).
- `emergency_request` -> `order_ticket` (N:1).
- `emergency_request` -> `payment_area` (1:N).
- `supplier` <-> `ingredient_stock` (N:N via junction table).
- `supplier` <-> `supplement_maintenance_log` (1:1).
- `job_assignment` -> `restaurant` (1:1).
- `equipment` -> `job_assignment` (N:1).

## 6. Backend and Frontend Contract
- Backend exposes REST resources matching table names (`/restaurants`, `/staff-members`, `/customer-orders`, etc.).
- DTOs and API schemas must stay typed with shared TypeScript interfaces.
- React pages map to bounded contexts:
  - Floor/Tables
  - Reservations
  - Orders/Tickets
  - Kitchen/Service
  - Inventory/Suppliers
  - Staffing/Assignments

## 7. Implementation Governance
- Use strict TypeScript (`"strict": true`) in both frontend and backend.
- No silent failure paths; API returns explicit error objects.
- All DB writes go through transactional service methods in the API layer.
- Any schema update must be recorded as a migration before code merge.
