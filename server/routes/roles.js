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

    router.delete('/delete', (req, res) => {
        const { roleId } = req.body;
    
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
                    await client.query('DELETE FROM role_to_permissions WHERE role_id = $1', [roleId]);
                    await client.query('UPDATE users SET role_id = NULL WHERE role_id = $1', [roleId]);
                    await client.query('DELETE FROM roles WHERE role_id = $1', [roleId]);
                    await client.query('COMMIT');
                    res.json({ message: 'Role deleted successfully' });
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
        const { roleId, description } = req.body;
        pool.query(
            'UPDATE roles SET description = $1 WHERE role_id = $2',
            [description, roleId],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ message: 'Role updated successfully' });
                }
            }
        );
    });
    
    return router;
};
