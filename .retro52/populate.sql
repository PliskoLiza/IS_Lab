BEGIN;

-- Populate roles
INSERT INTO roles (description) VALUES
('Commander'),
('Soldier'),
('Engineer'),
('Retro52');

-- Populate permissions
INSERT INTO permissions (description) VALUES
('Access classified information'),
('Operate machinery'),
('Die for fatherland'),
('Manage resources');

-- Populate regiment
INSERT INTO regiment (commander_user_id, count, description) VALUES
(NULL, 100, 'First Regiment'),
(NULL, 150, 'Second Regiment'),
(NULL, 150, 'Third Regiment');

COMMIT;

BEGIN;

INSERT INTO users (role_id, email, password) VALUES
(1, 'commander@example.com', 'password123'),
(2, 'soldier@example.com', 'password123'),
(3, 'engineer@example.com', 'password123');

COMMIT;

BEGIN;

-- Update regiment table with commanders
-- Assuming the first two users are commanders
UPDATE regiment SET commander_user_id = (SELECT user_id FROM users WHERE email = 'commander@example.com') WHERE reg_id = 1;
UPDATE regiment SET commander_user_id = (SELECT user_id FROM users WHERE email = 'engineer@example.com') WHERE reg_id = 2;
UPDATE regiment SET commander_user_id = (SELECT user_id FROM users WHERE email = 'soldier@example.com') WHERE reg_id = 3;

COMMIT;

BEGIN;

-- Populate role_to_permissions
INSERT INTO role_to_permissions (role_id, perm_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- Populate entity (e.g., tanks, socks)
INSERT INTO entity (description) VALUES
('Tank'),
('Socks');

-- Populate user_to_regiment
INSERT INTO user_to_regiment (reg_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 3);

-- Populate ent_per_regiment_cur
INSERT INTO ent_per_regiment_cur (reg_id, ent_id) VALUES
(1, 1),
(2, 2);

-- Populate ent_per_regiment_req
INSERT INTO ent_per_regiment_req (reg_id, ent_id) VALUES
(1, 1),
(2, 2);

COMMIT;
