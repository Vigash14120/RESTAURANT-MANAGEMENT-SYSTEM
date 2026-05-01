ALTER TABLE reservation
  ADD COLUMN party_size INT NOT NULL DEFAULT 1 AFTER reservation_status_id;

ALTER TABLE reservation
  ADD CONSTRAINT chk_reservation_party_size CHECK (party_size > 0);
