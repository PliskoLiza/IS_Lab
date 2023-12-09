-- Create tables without foreign key constraints
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    reg_id INT,
    role_id INT,
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    description TEXT
);

CREATE TABLE permissions (
    perm_id SERIAL PRIMARY KEY,
    description TEXT
);

CREATE TABLE role_to_permissions (
    role_id INT,
    perm_id INT,
    PRIMARY KEY (role_id, perm_id)
);

CREATE TABLE regiment (
    reg_id SERIAL PRIMARY KEY,
    user_id INT,
    count INT,
    description TEXT
);

CREATE TABLE entity (
    ent_id SERIAL PRIMARY KEY,
    description TEXT
);

CREATE TABLE user_to_regiment (
    reg_id INT,
    user_id INT,
    PRIMARY KEY (reg_id, user_id)
);

CREATE TABLE ent_per_regiment_cur (
    reg_id INT,
    ent_id INT,
    PRIMARY KEY (reg_id, ent_id)
);

CREATE TABLE ent_per_regiment_req (
    reg_id INT,
    ent_id INT,
    PRIMARY KEY (reg_id, ent_id)
);

-- Add foreign key constraints
ALTER TABLE users
    ADD FOREIGN KEY (reg_id) REFERENCES regiment(reg_id),
    ADD FOREIGN KEY (role_id) REFERENCES roles(role_id);

ALTER TABLE role_to_permissions
    ADD FOREIGN KEY (role_id) REFERENCES roles(role_id),
    ADD FOREIGN KEY (perm_id) REFERENCES permissions(perm_id);

ALTER TABLE regiment
    ADD FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE user_to_regiment
    ADD FOREIGN KEY (reg_id) REFERENCES regiment(reg_id),
    ADD FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE ent_per_regiment_cur
    ADD FOREIGN KEY (reg_id) REFERENCES regiment(reg_id),
    ADD FOREIGN KEY (ent_id) REFERENCES entity(ent_id);

ALTER TABLE ent_per_regiment_req
    ADD FOREIGN KEY (reg_id) REFERENCES regiment(reg_id),
    ADD FOREIGN KEY (ent_id) REFERENCES entity(ent_id);
