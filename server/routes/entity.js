const express = require('express');
const router = express.Router();
const checkPermission = require('./perm_check');

module.exports = (pool) => {
    router.get('/get', checkPermission(pool, 'Read All Entity'), (req, res) => {
        pool.query('SELECT * FROM entity', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:entId', checkPermission(pool, 'Read All Entity'), (req, res) => {
        const { entId } = req.params;
        pool.query('SELECT * FROM entity WHERE ent_id = $1', [entId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.post('/create', checkPermission(pool, 'Write All Entity'), (req, res) => {
        const { userId, count, description } = req.body;
        pool.query(
            'INSERT INTO regiment (description) VALUES ($1, $2, $3) RETURNING ent_id',
            [userId, count, description],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ entId: result.rows[0].ent_id });
                }
            }
        );
    });

    router.delete('/delete', checkPermission(pool, 'Write All Entity'), (req, res) => {
        const { entId } = req.body;
    
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
                    await client.query('DELETE FROM ent_per_regiment_cur WHERE ent_id = $1', [entId]);
                    await client.query('DELETE FROM ent_per_regiment_req WHERE ent_id = $1', [entId]);
    
                    await client.query('DELETE FROM entity WHERE ent_id = $1', [entId]);
    
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
    
    router.put('/update', checkPermission(pool, 'Write All Entity'), (req, res) => {
        const { entId, description } = req.body;
        pool.query(
            'UPDATE entity SET description = $1 WHERE ent_id = $2',
            [description, entId],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ message: 'Entity updated successfully' });
                }
            }
        );
    });
    
    return router;
};
