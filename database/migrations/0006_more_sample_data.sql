INSERT INTO restaurant (restaurant_id, phone_number, manager_restaurant_id, status_id) VALUES
  (2, '+1-555-0202', 1, 1),
  (3, '+1-555-0303', 1, 3)
ON DUPLICATE KEY UPDATE phone_number = VALUES(phone_number);

INSERT INTO staff (staff_id, first_name, last_name) VALUES
  (2, 'Jordan', 'Smith'),
  (3, 'Casey', 'Johnson'),
  (4, 'Morgan', 'Lee'),
  (5, 'Taylor', 'Brown')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

INSERT INTO staff_member (staff_member_id, first_name, salary, employer_staff_id, restaurant_id) VALUES
  (2, 'Jordan', 35000.00, 1, 1),
  (3, 'Casey', 32000.00, 1, 2),
  (4, 'Morgan', 38000.00, 2, 2),
  (5, 'Taylor', 31000.00, 1, 1)
ON DUPLICATE KEY UPDATE salary = VALUES(salary);

INSERT INTO tables (table_number, restaurant_id, capacity) VALUES
  (3, 1, 6),
  (4, 1, 4),
  (5, 2, 4),
  (6, 2, 2),
  (10, 1, 8)
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity);

INSERT INTO floor_table (table_number, capacity, location, served_by_staff_member_id) VALUES
  (3, 6, 'Window Side B1', 2),
  (4, 4, 'Garden View C1', 5),
  (5, 4, 'Branch 2 - Main Hall', NULL),
  (6, 2, 'Branch 2 - Corner', NULL)
ON DUPLICATE KEY UPDATE location = VALUES(location);

INSERT INTO customer (customer_id, full_name) VALUES
  (2, 'John Doe'),
  (3, 'Jane Smith'),
  (4, 'Bob Wilson')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO ingredient_stock (ingredient_id, stock_level) VALUES
  (2, 5.50),
  (3, 2.00),
  (4, 12.00),
  (5, 45.00)
ON DUPLICATE KEY UPDATE stock_level = VALUES(stock_level);

INSERT INTO supplier (supplier_id, company_name) VALUES
  (2, 'Global Foods'),
  (3, 'Kitchen Pro'),
  (4, 'Fresh Produce Co')
ON DUPLICATE KEY UPDATE company_name = VALUES(company_name);

INSERT INTO supplement_maintenance_log (maintenance_log_id, supplier_id, company_name, details) VALUES
  (2, 2, 'Global Foods', 'Re-stocked ingredient #2.'),
  (3, 3, 'Kitchen Pro', 'Quarterly inspection of Branch 1 kitchen.')
ON DUPLICATE KEY UPDATE details = VALUES(details);
