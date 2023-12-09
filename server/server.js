const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

require('dotenv').config({ debug: true, override: false });

const app = express();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(bodyParser.json());

// Import user routes
const userRoutes = require('./routes/users')(pool);
const roleRoutes = require('./routes/roles')(pool);
const entityRoutes = require('./routes/entity')(pool);
const regimentRoutes = require('./routes/regiment')(pool);
const permissionRoutes = require('./routes/permissions')(pool);
const userToRegimentRoutes = require('./routes/user_to_regiment')(pool);
const roleToPermissionRoutes = require('./routes/role_to_permissions')(pool);
const entPerRegimentCurRoutes = require('./routes/ent_per_regiment_cur')(pool);
const entPerRegimentReqRoutes = require('./routes/ent_per_regiment_req')(pool);

// Debug view
app.get("/api/debug/:tabName", (req, res) => {
    const { tabName } = req.params;

    const allowedTables = ['users', 'roles', 'permissions', 'role_to_permissions', 'regiment', 'entity', 'ent_per_regiment_cur', 'ent_per_regiment_req'];
    if (!allowedTables.includes(tabName)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    pool.query(`SELECT * FROM ${tabName}`, (error, result) => {
        if (error) {
            console.error('Error retrieving data from the database:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(result.rows);
        }
    });
});

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/entity', entityRoutes);
app.use('/api/regiment', regimentRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/user_to_regiment', userToRegimentRoutes);
app.use('/api/role_to_permissions', roleToPermissionRoutes);
app.use('/api/ent_per_regiment_cur', entPerRegimentCurRoutes);
app.use('/api/ent_per_regiment_req', entPerRegimentReqRoutes);

app.listen(5000, () => {
    console.log('Server started on port 5000');
});
