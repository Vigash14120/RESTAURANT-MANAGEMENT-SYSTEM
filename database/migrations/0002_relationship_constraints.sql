ALTER TABLE restaurant
  ADD CONSTRAINT fk_restaurant_manager
    FOREIGN KEY (manager_restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_restaurant_status
    FOREIGN KEY (status_id) REFERENCES restaurant_status(status_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE staff_member
  ADD CONSTRAINT fk_staff_member_employer
    FOREIGN KEY (employer_staff_id) REFERENCES staff(staff_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_staff_member_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE staff_shift_log
  ADD CONSTRAINT fk_shift_log_staff
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `tables`
  ADD CONSTRAINT fk_tables_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE floor_table
  ADD CONSTRAINT uq_floor_table_served_by UNIQUE (served_by_staff_member_id),
  ADD CONSTRAINT fk_floor_table_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_floor_table_staff_member
    FOREIGN KEY (served_by_staff_member_id) REFERENCES staff_member(staff_member_id)
    ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE reservation
  ADD CONSTRAINT fk_reservation_floor_table
    FOREIGN KEY (table_number) REFERENCES floor_table(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_reservation_status
    FOREIGN KEY (reservation_status_id) REFERENCES reservation_status(reservation_status_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE table_assignment
  ADD CONSTRAINT fk_table_assignment_floor_table
    FOREIGN KEY (table_number) REFERENCES floor_table(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_table_assignment_reservation
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
    ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE menu_category
  ADD CONSTRAINT uq_menu_category_restaurant UNIQUE (restaurant_id),
  ADD CONSTRAINT fk_menu_category_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE dish
  ADD CONSTRAINT fk_dish_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_dish_category
    FOREIGN KEY (category_id) REFERENCES menu_category(category_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE recipe
  ADD CONSTRAINT uq_recipe_item UNIQUE (item_id),
  ADD CONSTRAINT fk_recipe_dish
    FOREIGN KEY (item_id) REFERENCES dish(item_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE kitchen_ticket_log
  ADD CONSTRAINT fk_kitchen_ticket_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE customer_order
  ADD CONSTRAINT uq_customer_order_table UNIQUE (table_number),
  ADD CONSTRAINT fk_customer_order_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_customer_order_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ticket
  ADD CONSTRAINT uq_ticket_customer_order UNIQUE (customer_order_id),
  ADD CONSTRAINT fk_ticket_customer_order
    FOREIGN KEY (customer_order_id) REFERENCES customer_order(customer_order_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE order_ticket
  ADD CONSTRAINT uq_order_ticket_ticket UNIQUE (ticket_id),
  ADD CONSTRAINT uq_order_ticket_customer_order UNIQUE (customer_order_id),
  ADD CONSTRAINT fk_order_ticket_ticket
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_order_ticket_customer_order
    FOREIGN KEY (customer_order_id) REFERENCES customer_order(customer_order_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE emergency_request
  ADD CONSTRAINT fk_emergency_request_order_ticket
    FOREIGN KEY (order_ticket_id) REFERENCES order_ticket(order_ticket_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE payment_area
  ADD CONSTRAINT fk_payment_area_emergency
    FOREIGN KEY (emergency_order_id) REFERENCES emergency_request(order_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE kitchen_order
  ADD CONSTRAINT fk_kitchen_order_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_kitchen_order_staff_member
    FOREIGN KEY (staff_member_id) REFERENCES staff_member(staff_member_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE service_order
  ADD CONSTRAINT fk_service_order_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE supplier_ingredient_stock
  ADD CONSTRAINT fk_supplier_ingredient_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_supplier_ingredient_stock
    FOREIGN KEY (ingredient_id) REFERENCES ingredient_stock(ingredient_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE supplement_maintenance_log
  ADD CONSTRAINT uq_supplement_log_supplier UNIQUE (supplier_id),
  ADD CONSTRAINT fk_supplement_log_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE job_assignment
  ADD CONSTRAINT uq_job_assignment_restaurant UNIQUE (restaurant_id),
  ADD CONSTRAINT fk_job_assignment_staff
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_job_assignment_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE equipment
  ADD CONSTRAINT fk_equipment_assignment
    FOREIGN KEY (assignment_id) REFERENCES job_assignment(assignment_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;
