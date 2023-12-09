const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM roles', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:roleId', (req, res) => {
        const { roleId } = req.params;
        pool.query('SELECT * FROM roles WHERE role_id = $1', [roleId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.post('/create', (req, res) => {
        const { description } = req.body;
        pool.query(
            'INSERT INTO roles (description) VALUES ($1) RETURNING role_id',
            [description],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ roleId: result.rows[0].role_id });
                }
            }
        );
    });

    return router;
};
