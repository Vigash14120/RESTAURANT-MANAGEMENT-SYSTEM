INSERT INTO restaurant_status (status_id, name) VALUES
  (1, 'active'),
  (2, 'inactive'),
  (3, 'maintenance')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO reservation_status (reservation_status_id, name) VALUES
  (1, 'pending'),
  (2, 'confirmed'),
  (3, 'cancelled'),
  (4, 'completed')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO restaurant (restaurant_id, phone_number, manager_restaurant_id, status_id) VALUES
  (1, '+1-555-0101', NULL, 1)
ON DUPLICATE KEY UPDATE phone_number = VALUES(phone_number), status_id = VALUES(status_id);

INSERT INTO staff (staff_id, first_name, last_name) VALUES
  (1, 'Alex', 'Manager')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), last_name = VALUES(last_name);

INSERT INTO staff_member (staff_member_id, first_name, salary, employer_staff_id, restaurant_id) VALUES
  (1, 'Alex', 45000.00, 1, 1)
ON DUPLICATE KEY UPDATE salary = VALUES(salary), employer_staff_id = VALUES(employer_staff_id);

INSERT INTO staff_shift_log (shift_log_id, staff_id, shift_time) VALUES
  (1, 1, '2026-01-01 09:00:00')
ON DUPLICATE KEY UPDATE shift_time = VALUES(shift_time);

INSERT INTO `tables` (table_number, restaurant_id, capacity) VALUES
  (1, 1, 4),
  (2, 1, 2)
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity);

INSERT INTO floor_table (table_number, capacity, location, served_by_staff_member_id) VALUES
  (1, 4, 'Main Hall A1', 1),
  (2, 2, 'Main Hall A2', NULL)
ON DUPLICATE KEY UPDATE location = VALUES(location), served_by_staff_member_id = VALUES(served_by_staff_member_id);

INSERT INTO reservation (reservation_id, table_number, reservation_time, reservation_status_id) VALUES
  (1, 1, '2026-01-01 19:00:00', 2)
ON DUPLICATE KEY UPDATE reservation_time = VALUES(reservation_time), reservation_status_id = VALUES(reservation_status_id);

INSERT INTO table_assignment (assignment_id, table_number, reservation_id, menu_price) VALUES
  (1, 1, 1, 120.00)
ON DUPLICATE KEY UPDATE menu_price = VALUES(menu_price);

INSERT INTO menu_category (category_id, restaurant_id, name, current_location) VALUES
  (1, 1, 'Main Menu', 'Dining Hall')
ON DUPLICATE KEY UPDATE name = VALUES(name), current_location = VALUES(current_location);

INSERT INTO dish (item_id, restaurant_id, category_id, category_name, item_name, description, is_alcoholic, is_vegetarian) VALUES
  (1, 1, 1, 'Main Menu', 'House Pasta', 'Signature tomato basil pasta.', FALSE, TRUE)
ON DUPLICATE KEY UPDATE item_name = VALUES(item_name), description = VALUES(description);

INSERT INTO recipe (recipe_id, item_id, is_alcoholic, is_vegetarian, instructions) VALUES
  (1, 1, FALSE, TRUE, 'Boil pasta, prepare sauce, and plate warm.')
ON DUPLICATE KEY UPDATE instructions = VALUES(instructions);

INSERT INTO customer (customer_id, full_name) VALUES
  (1, 'Demo Customer')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO customer_order (customer_order_id, customer_id, table_number, dish_type, time_created) VALUES
  (1, 1, 1, 'dine_in', '2026-01-01 19:05:00')
ON DUPLICATE KEY UPDATE dish_type = VALUES(dish_type), time_created = VALUES(time_created);

INSERT INTO ticket (ticket_id, customer_order_id, party_size) VALUES
  (1, 1, 2)
ON DUPLICATE KEY UPDATE party_size = VALUES(party_size);

INSERT INTO order_ticket (order_ticket_id, ticket_id, customer_order_id) VALUES
  (1, 1, 1)
ON DUPLICATE KEY UPDATE customer_order_id = VALUES(customer_order_id);

INSERT INTO emergency_request (order_id, order_ticket_id, order_time) VALUES
  (1, 1, '2026-01-01 19:10:00')
ON DUPLICATE KEY UPDATE order_time = VALUES(order_time);

INSERT INTO payment_area (payment_area_id, emergency_order_id) VALUES
  (1, 1)
ON DUPLICATE KEY UPDATE emergency_order_id = VALUES(emergency_order_id);

INSERT INTO kitchen_ticket_log (kitchen_ticket_log_id, customer_id, emergency_id, dispatch_time) VALUES
  (1, 1, 'EMG-1', '2026-01-01 19:12:00')
ON DUPLICATE KEY UPDATE dispatch_time = VALUES(dispatch_time);

INSERT INTO kitchen_order (kitchen_order_id, table_number, staff_member_id, created_at) VALUES
  (1, 1, 1, '2026-01-01 19:06:00')
ON DUPLICATE KEY UPDATE staff_member_id = VALUES(staff_member_id);

INSERT INTO service_order (service_order_id, table_number, is_alcoholic, created_at) VALUES
  (1, 1, FALSE, '2026-01-01 19:07:00')
ON DUPLICATE KEY UPDATE is_alcoholic = VALUES(is_alcoholic);

INSERT INTO supplier (supplier_id, company_name) VALUES
  (1, 'RMS Supplies')
ON DUPLICATE KEY UPDATE company_name = VALUES(company_name);

INSERT INTO ingredient_stock (ingredient_id, stock_level) VALUES
  (1, 100.00)
ON DUPLICATE KEY UPDATE stock_level = VALUES(stock_level);

INSERT INTO supplier_ingredient_stock (supplier_id, ingredient_id) VALUES
  (1, 1)
ON DUPLICATE KEY UPDATE ingredient_id = VALUES(ingredient_id);

INSERT INTO supplement_maintenance_log (maintenance_log_id, supplier_id, company_name, details) VALUES
  (1, 1, 'RMS Supplies', 'Initial supplier maintenance baseline.')
ON DUPLICATE KEY UPDATE details = VALUES(details), company_name = VALUES(company_name);

INSERT INTO job_assignment (assignment_id, staff_id, shift_time, restaurant_id) VALUES
  (1, 1, '2026-01-01 09:00:00', 1)
ON DUPLICATE KEY UPDATE shift_time = VALUES(shift_time);

INSERT INTO equipment (equipment_id, assignment_id, name) VALUES
  (1, 1, 'Standard Oven')
ON DUPLICATE KEY UPDATE name = VALUES(name);
