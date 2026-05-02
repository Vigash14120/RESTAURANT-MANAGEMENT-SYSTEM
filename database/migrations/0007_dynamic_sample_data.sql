-- Ensure all tables are in floor_table before adding reservations
INSERT INTO floor_table (table_number, capacity, location, served_by_staff_member_id) VALUES
  (10, 8, 'Private Dining Room X1', NULL)
ON DUPLICATE KEY UPDATE location = VALUES(location);

-- Add dynamic reservations (relative to NOW)
INSERT INTO reservation (reservation_id, table_number, reservation_time, reservation_status_id, party_size) VALUES
  (2, 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 2, 2),
  (3, 3, DATE_ADD(NOW(), INTERVAL 4 HOUR), 1, 5),
  (4, 4, DATE_ADD(NOW(), INTERVAL 1 DAY), 1, 4),
  (5, 1, DATE_ADD(NOW(), INTERVAL -1 HOUR), 4, 4),
  (6, 2, DATE_ADD(NOW(), INTERVAL -5 HOUR), 3, 2),
  (7, 10, DATE_ADD(NOW(), INTERVAL 6 HOUR), 1, 8)
ON DUPLICATE KEY UPDATE reservation_time = VALUES(reservation_time);


-- Add customer orders
INSERT INTO customer_order (customer_order_id, customer_id, table_number, dish_type, time_created) VALUES
  (2, 2, 2, 'dine_in', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
  (3, 3, 3, 'takeaway', DATE_SUB(NOW(), INTERVAL 15 MINUTE))
ON DUPLICATE KEY UPDATE dish_type = VALUES(dish_type);

-- Add tickets
INSERT INTO ticket (ticket_id, customer_order_id, party_size) VALUES
  (2, 2, 2),
  (3, 3, 1)
ON DUPLICATE KEY UPDATE party_size = VALUES(party_size);

-- Add kitchen orders
INSERT INTO kitchen_order (kitchen_order_id, table_number, staff_member_id, created_at) VALUES
  (2, 2, 2, DATE_SUB(NOW(), INTERVAL 25 MINUTE)),
  (3, 3, 3, DATE_SUB(NOW(), INTERVAL 10 MINUTE))
ON DUPLICATE KEY UPDATE created_at = VALUES(created_at);

-- Add upcoming shifts
INSERT INTO staff_shift_log (staff_id, shift_time) VALUES
  (2, DATE_ADD(NOW(), INTERVAL 1 HOUR)),
  (3, DATE_ADD(NOW(), INTERVAL 2 HOUR)),
  (4, DATE_ADD(NOW(), INTERVAL 5 HOUR)),
  (5, DATE_ADD(NOW(), INTERVAL 8 HOUR))
;
