-- RMS canonical schema snapshot (aligned with migrations 0001-0004)

CREATE TABLE restaurant_status (
  status_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE reservation_status (
  reservation_status_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE restaurant (
  restaurant_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  phone_number VARCHAR(30) NOT NULL,
  manager_restaurant_id BIGINT NULL,
  status_id BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_restaurant_manager
    FOREIGN KEY (manager_restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_restaurant_status
    FOREIGN KEY (status_id) REFERENCES restaurant_status(status_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE staff (
  staff_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE staff_member (
  staff_member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  employer_staff_id BIGINT NULL,
  restaurant_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_staff_member_employer
    FOREIGN KEY (employer_staff_id) REFERENCES staff(staff_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_staff_member_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CHECK (salary >= 0)
) ENGINE=InnoDB;

CREATE TABLE staff_shift_log (
  shift_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_id BIGINT NOT NULL,
  shift_time DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shift_log_staff
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE `tables` (
  table_number INT PRIMARY KEY,
  restaurant_id BIGINT NOT NULL,
  capacity INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tables_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CHECK (capacity > 0)
) ENGINE=InnoDB;

CREATE TABLE floor_table (
  table_number INT PRIMARY KEY,
  capacity INT NOT NULL,
  location VARCHAR(100) NOT NULL,
  served_by_staff_member_id BIGINT NULL,
  CONSTRAINT uq_floor_table_served_by UNIQUE (served_by_staff_member_id),
  CONSTRAINT fk_floor_table_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_floor_table_staff_member
    FOREIGN KEY (served_by_staff_member_id) REFERENCES staff_member(staff_member_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CHECK (capacity > 0)
) ENGINE=InnoDB;

CREATE TABLE reservation (
  reservation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  reservation_time DATETIME NOT NULL,
  reservation_status_id BIGINT NOT NULL,
  party_size INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservation_floor_table
    FOREIGN KEY (table_number) REFERENCES floor_table(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reservation_status
    FOREIGN KEY (reservation_status_id) REFERENCES reservation_status(reservation_status_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_reservation_party_size CHECK (party_size > 0)
) ENGINE=InnoDB;

CREATE TABLE table_assignment (
  assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  reservation_id BIGINT NULL,
  menu_price DECIMAL(10,2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_table_assignment_floor_table
    FOREIGN KEY (table_number) REFERENCES floor_table(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_table_assignment_reservation
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CHECK (menu_price IS NULL OR menu_price >= 0)
) ENGINE=InnoDB;

CREATE TABLE menu_category (
  category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  current_location VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_menu_category_restaurant UNIQUE (restaurant_id),
  CONSTRAINT fk_menu_category_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE dish (
  item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  category_name VARCHAR(120) NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  is_alcoholic BOOLEAN NOT NULL DEFAULT FALSE,
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dish_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_dish_category
    FOREIGN KEY (category_id) REFERENCES menu_category(category_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE recipe (
  recipe_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  item_id BIGINT NOT NULL,
  is_alcoholic BOOLEAN NOT NULL DEFAULT FALSE,
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  instructions TEXT NULL,
  CONSTRAINT uq_recipe_item UNIQUE (item_id),
  CONSTRAINT fk_recipe_dish
    FOREIGN KEY (item_id) REFERENCES dish(item_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE customer (
  customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(150) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE kitchen_ticket_log (
  kitchen_ticket_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  emergency_id VARCHAR(100) NULL,
  dispatch_time DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kitchen_ticket_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE customer_order (
  customer_order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  table_number INT NOT NULL,
  dish_type VARCHAR(50) NOT NULL,
  time_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_customer_order_table UNIQUE (table_number),
  CONSTRAINT fk_customer_order_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_customer_order_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE ticket (
  ticket_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_order_id BIGINT NOT NULL,
  party_size INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_ticket_customer_order UNIQUE (customer_order_id),
  CONSTRAINT fk_ticket_customer_order
    FOREIGN KEY (customer_order_id) REFERENCES customer_order(customer_order_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CHECK (party_size > 0)
) ENGINE=InnoDB;

CREATE TABLE order_ticket (
  order_ticket_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  customer_order_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_order_ticket_ticket UNIQUE (ticket_id),
  CONSTRAINT uq_order_ticket_customer_order UNIQUE (customer_order_id),
  CONSTRAINT fk_order_ticket_ticket
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_order_ticket_customer_order
    FOREIGN KEY (customer_order_id) REFERENCES customer_order(customer_order_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE emergency_request (
  order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_ticket_id BIGINT NOT NULL,
  order_time DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_emergency_request_order_ticket
    FOREIGN KEY (order_ticket_id) REFERENCES order_ticket(order_ticket_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE payment_area (
  payment_area_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  emergency_order_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_area_emergency
    FOREIGN KEY (emergency_order_id) REFERENCES emergency_request(order_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE kitchen_order (
  kitchen_order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  staff_member_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kitchen_order_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kitchen_order_staff_member
    FOREIGN KEY (staff_member_id) REFERENCES staff_member(staff_member_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE service_order (
  service_order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_number INT NOT NULL,
  is_alcoholic BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_order_table
    FOREIGN KEY (table_number) REFERENCES `tables`(table_number)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE supplier (
  supplier_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(150) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE ingredient_stock (
  ingredient_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  stock_level DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (stock_level >= 0)
) ENGINE=InnoDB;

CREATE TABLE supplier_ingredient_stock (
  supplier_id BIGINT NOT NULL,
  ingredient_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (supplier_id, ingredient_id),
  CONSTRAINT fk_supplier_ingredient_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_supplier_ingredient_stock
    FOREIGN KEY (ingredient_id) REFERENCES ingredient_stock(ingredient_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE supplement_maintenance_log (
  maintenance_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  supplier_id BIGINT NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  details TEXT NULL,
  CONSTRAINT uq_supplement_log_supplier UNIQUE (supplier_id),
  CONSTRAINT fk_supplement_log_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE job_assignment (
  assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_id BIGINT NOT NULL,
  shift_time DATETIME NOT NULL,
  restaurant_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_job_assignment_restaurant UNIQUE (restaurant_id),
  CONSTRAINT fk_job_assignment_staff
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_job_assignment_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE equipment (
  equipment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  assignment_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_equipment_assignment
    FOREIGN KEY (assignment_id) REFERENCES job_assignment(assignment_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_staff_shift_log_shift_time ON staff_shift_log (shift_time);
CREATE INDEX idx_floor_table_location ON floor_table (location);
CREATE INDEX idx_reservation_time_status ON reservation (reservation_time, reservation_status_id);
CREATE INDEX idx_table_assignment_table_reservation ON table_assignment (table_number, reservation_id);
CREATE INDEX idx_dish_category ON dish (category_id, item_name);
CREATE INDEX idx_kitchen_ticket_dispatch ON kitchen_ticket_log (dispatch_time);
CREATE INDEX idx_customer_order_created ON customer_order (time_created);
CREATE INDEX idx_emergency_request_time ON emergency_request (order_time);
CREATE INDEX idx_kitchen_order_created ON kitchen_order (created_at);
CREATE INDEX idx_service_order_created ON service_order (created_at);
CREATE INDEX idx_ingredient_stock_level ON ingredient_stock (stock_level);
