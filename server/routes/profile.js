const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get/:userId', (req, res) => {
        const { userId } = req.params;
        pool.query('SELECT roles.description as role, r.description as regiment\n' +
            'FROM users\n' +
            '         JOIN roles ON users.role_id = roles.role_id\n' +
            'JOIN user_to_regiment utr on users.user_id = utr.user_id\n' +
            'JOIN regiment r on r.reg_id = utr.reg_id\n' +
            'WHERE users.user_id = $1', [userId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.get('/get', (req, res) => {
        pool.query('SELECT users.user_id, roles.description, r.description as regiment, users.email, users.password\n' +
        'FROM users\n' +
        'JOIN roles ON users.role_id = roles.role_id\n' +
        'JOIN user_to_regiment utr on users.user_id = utr.user_id\n' +
        'JOIN regiment r on r.reg_id = utr.reg_id', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    return router;
};
