const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM permissions', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:permId', (req, res) => {
        const { permId } = req.params;
        pool.query('SELECT * FROM permissions WHERE perm_id = $1', [permId], (error, result) => {
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
            'INSERT INTO permissions (description) VALUES ($1) RETURNING perm_id',
            [description],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ permId: result.rows[0].perm_id });
                }
            }
        );
    });

    return router;
};
