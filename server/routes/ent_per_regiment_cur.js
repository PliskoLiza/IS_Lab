const express = require('express');
const router = express.Router();
const checkPermission = require('./perm_check');
const { checkReadRegimentAccess, checkWriteRegimentAccess } = require('./perm_check_reg');

module.exports = (pool) => {
    router.get('/get', checkPermission(pool, 'Read All Regiment'), (req, res) => {
        pool.query('SELECT * FROM ent_per_regiment_cur', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    // Entity-specific
    router.get('/get/entity/:entityId', checkReadRegimentAccess(pool), checkPermission(pool, 'Read All Entity'), (req, res) => {
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
    router.get('/get/regiment/:regId', checkReadRegimentAccess(pool), (req, res) => {
        const { regId } = req.params;
        pool.query('SELECT * FROM ent_per_regiment_cur WHERE reg_id = $1', [regId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.post('/create', checkWriteRegimentAccess(pool), (req, res) => {
        const { regId, entId } = req.body;
        pool.query(
            'INSERT INTO ent_per_regiment_cur (reg_id, ent_id) VALUES ($1, $2)',
            [regId, entId],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(200).json({ message: 'Record created successfully' });
                }
            }
        );
    });

    router.put('/update', checkWriteRegimentAccess(pool), async (req, res) => {
        const { regId, entId, count } = req.body;

        try {
            // Check if the entry exists
            const checkResult = await pool.query(
                'SELECT * FROM ent_per_regiment_cur WHERE reg_id = $1 AND ent_id = $2',
                [regId, entId]
            );
    
            if (checkResult.rowCount > 0) {
                // Entry exists, perform update
                await pool.query(
                    'UPDATE ent_per_regiment_cur SET count = $3 WHERE reg_id = $1 AND ent_id = $2',
                    [regId, entId, count]
                );
            } else {
                // Entry does not exist, perform insert
                await pool.query(
                    'INSERT INTO ent_per_regiment_cur (reg_id, ent_id, count) VALUES ($1, $2, $3)',
                    [regId, entId, count]
                );
            }
    
            res.status(200).json({ message: 'Record updated successfully' });
        } catch (error) {
            console.error('Error on updating/inserting ent_per_regiment_cur:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.delete('/delete', checkWriteRegimentAccess(pool), (req, res) => {
        const { regId, entId } = req.body;
    
        pool.connect((err, client, done) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            client.query('BEGIN', async (err) => {
                if (err) {
                    done();
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                try {
                    await client.query('DELETE FROM ent_per_regiment_cur WHERE ent_id = $1 AND reg_id = $2', [entId, regId]);
                    await client.query('COMMIT');
                    res.json({ message: 'Entity deleted successfully' });
                } catch (error) {
                    await client.query('ROLLBACK');
                    res.status(500).json({ error: 'Internal server error' });
                } finally {
                    done();
                }
            });
        });
    });

    return router;
};
