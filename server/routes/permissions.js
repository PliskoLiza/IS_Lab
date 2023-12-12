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

    router.delete('/delete', (req, res) => {
        const { permId } = req.body;
    
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
                    await client.query('DELETE FROM role_to_permissions WHERE perm_id = $1', [permId]);
                    await client.query('DELETE FROM permissions WHERE perm_id = $1', [permId]);
                    await client.query('COMMIT');
                    res.json({ message: 'Permission deleted successfully' });
                } catch (error) {
                    await client.query('ROLLBACK');
                    res.status(500).json({ error: 'Internal server error' });
                } finally {
                    done();
                }
            });
        });
    });
    
    router.put('/update', (req, res) => {
        const { permId, description } = req.body;
        pool.query(
            'UPDATE permissions SET description = $1 WHERE perm_id = $2',
            [description, permId],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ message: 'Permission updated successfully' });
                }
            }
        );
    });
    
    return router;
};
