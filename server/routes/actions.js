const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM actions', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:actId', (req, res) => {
        const { actId } = req.params;
        pool.query('SELECT * FROM actions WHERE action_id = $1', [actId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.post('/create', (req, res) => {
        const { name, description } = req.body;
        pool.query(
            'INSERT INTO actions (name, description) VALUES ($1, $2) RETURNING action_id',
            [name, description],
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
        const { actId } = req.body;
    
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
                    await client.query('DELETE FROM permission_to_actions WHERE action_id = $1', [actId]);
                    await client.query('DELETE FROM actions WHERE action_id = $1', [actId]);
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
        const { actId, name, description } = req.body;
        pool.query(
            'UPDATE actions SET name = $1, description = $2 WHERE action_id = $3',
            [name, description, actId],
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
