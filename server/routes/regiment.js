const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM regiment', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:regId', (req, res) => {
        const { regId } = req.params;
        pool.query('SELECT * FROM regiment WHERE reg_id = $1', [regId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.post('/create', (req, res) => {
        const { user_id, count, description } = req.body;
        pool.query(
            'INSERT INTO regiment (user_id, count, description) VALUES ($1, $2, $3) RETURNING reg_id',
            [user_id, count, description],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ regId: result.rows[0].reg_id });
                }
            }
        );
    });

    return router;
};
