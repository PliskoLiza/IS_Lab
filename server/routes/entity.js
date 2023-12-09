const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM entity', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:entId', (req, res) => {
        const { entId } = req.params;
        pool.query('SELECT * FROM entity WHERE ent_id = $1', [entId], (error, result) => {
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
            'INSERT INTO regiment (description) VALUES ($1, $2, $3) RETURNING ent_id',
            [user_id, count, description],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ entId: result.rows[0].ent_id });
                }
            }
        );
    });

    return router;
};
