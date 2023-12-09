const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM ent_per_regiment_cur', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    // Entity-specific
    router.get('/get/entity/:entityId', (req, res) => {
        const { entityId } = req.params;
        pool.query('SELECT * FROM ent_per_regiment_cur WHERE ent_id = $1', [entityId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    // Regiment-specific
    router.get('/get/regiment/:regimentId', (req, res) => {
        const { regimentId } = req.params;
        pool.query('SELECT * FROM ent_per_regiment_cur WHERE reg_id = $1', [regimentId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.post('/create', (req, res) => {
        const { reg_id, ent_id } = req.body;
        pool.query(
            'INSERT INTO ent_per_regiment_cur (reg_id, ent_id) VALUES ($1, $2)',
            [reg_id, ent_id],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(200).json({ message: 'Record created successfully' });
                }
            }
        );
    });

    return router;
};
