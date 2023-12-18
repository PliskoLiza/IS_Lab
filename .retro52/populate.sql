BEGIN;

-- Populate roles
INSERT INTO roles (description) VALUES
('Not indicated'),
('Commander'),
('Soldier'),
('Engineer'),
('Admin');

-- Populate actions
-- Actions for users table
INSERT INTO actions (name, description) VALUES
('Read All Users', 'Read all entries in users table'),
('Write All Users', 'Write to all entries in users table'),
('Read Own User', 'Read own entry in users table'),
('Write Own User', 'Write to own entry in users table');

-- Actions for regiment table
INSERT INTO actions (name, description) VALUES
('Read All Regiment', 'Read all entries in regiment table'),
('Write All Regiment', 'Write to all entries in regiment table'),
('Read Own Regiment', 'Read own entry in regiment table'),
('Write Own Regiment', 'Write to own entry in regiment table');

-- Actions for entity table
INSERT INTO actions (name, description) VALUES
('Read All Entity', 'Read all entries in regiment table'),
('Write All Entity', 'Write to own entry in regiment table');

-- Populate permissions with sets of actions
-- Permission for basic user access
INSERT INTO permissions (description) VALUES
('Basic User Access');

-- Permission for regiment management
INSERT INTO permissions (description) VALUES
('Regiment Management');

-- Permission for full administrative access
INSERT INTO permissions (description) VALUES
('Full Administrative Access');

-- Linking permissions to actions for Basic User Access
INSERT INTO permission_to_actions (perm_id, action_id) SELECT 
    (SELECT perm_id FROM permissions WHERE description = 'Basic User Access'), 
    action_id FROM actions WHERE name IN ('Read Own User', 'Write Own User');

-- Linking permissions to actions for Regiment Management
INSERT INTO permission_to_actions (perm_id, action_id) SELECT 
    (SELECT perm_id FROM permissions WHERE description = 'Regiment Management'), 
    action_id FROM actions WHERE name IN ('Read All Regiment', 'Write Own Regiment', 'Read All Entity', 'Write All Entity');

-- Linking permissions to actions for Full Administrative Access
INSERT INTO permission_to_actions (perm_id, action_id) SELECT 
    (SELECT perm_id FROM permissions WHERE description = 'Full Administrative Access'), 
    action_id FROM actions;

-- Populate regiment
INSERT INTO regiment (commander_user_id, count, description) VALUES
(NULL, 3000, '92 Separate Assault Brigade'),
(NULL, 3500, '93 Separate Mechanized Brigade'),
(NULL, 2000, '1 Separate Tank Brigade');

COMMIT;

BEGIN;

INSERT INTO users (role_id, email, password) VALUES
(2, 'commander@example.com', 'password123'),
(3, 'soldier@example.com', 'password123'),
(4, 'engineer@example.com', 'password123'),
(5, 'admin@example.com', 'password123');

COMMIT;

BEGIN;

-- Update regiment table with commanders
UPDATE regiment SET commander_user_id = (SELECT user_id FROM users WHERE email = 'commander@example.com') WHERE reg_id = 1;
UPDATE regiment SET commander_user_id = (SELECT user_id FROM users WHERE email = 'engineer@example.com') WHERE reg_id = 2;
UPDATE regiment SET commander_user_id = (SELECT user_id FROM users WHERE email = 'soldier@example.com') WHERE reg_id = 3;

COMMIT;

BEGIN;

-- Populate role_to_permissions
INSERT INTO role_to_permissions (role_id, perm_id) VALUES
(2, 2), -- Commander with access to classified information
(3, 1); -- Soldier with no special access

-- Populate entity (e.g., tanks, socks)
INSERT INTO entity (description) VALUES
('T-64BV zr. 2017'),
('T-64BV zr. 2022'),
('T-72AMT'),
('BMP-1'),
('BMP-2'),
('BTR-70'),
('BTR-80'),
('BTR-4E'),
('HMMWV'),
('5.45x39 Firearm'),
('5.56x45 Firearm'),
('7.62x51 Machine gun'),
('12.7x99 Machine gun'),
('82mm Mortar'),
('120mm Mortar'),
('155mm Artilery'),
('Socks');

-- Populate user_to_regiment
INSERT INTO user_to_regiment (reg_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 3);

INSERT INTO ent_per_regiment_cur (reg_id, ent_id, count) VALUES
(1, 1, 27), 
(1, 8, 55), 

(2, 1, 28),
(2, 4, 12),
(2, 5, 48),
(2, 6, 65),

(3, 1, 12), 
(3, 2, 7), 
(3, 3, 40), 
(3, 4, 6), 
(3, 6, 10), 
(3, 7, 13);

-- Populate ent_per_regiment_req
INSERT INTO ent_per_regiment_req (reg_id, ent_id, count) VALUES
(1, 1, 34), 
(1, 8, 102), 

(2, 1, 34),
(2, 4, 34),
(2, 5, 68),
(2, 6, 34),

(3, 1, 34), 
(3, 2, 11), 
(3, 3, 57), 
(3, 4, 12), 
(3, 6, 11), 
(3, 7, 11);

COMMIT;
