const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM role_to_permissions', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    // Role-specific permissions
    router.get('/get/role/:roleId', (req, res) => {
        const { roleId } = req.params;
        pool.query('SELECT * FROM role_to_permissions WHERE role_id = $1', [roleId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    // Permission-specific roles
    router.get('/get/permission/:permId', (req, res) => {
        const { permId } = req.params;
        pool.query('SELECT * FROM role_to_permissions WHERE perm_id = $1', [permId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.post('/create', (req, res) => {
        const { roleId, permId } = req.body;
        pool.query(
            'INSERT INTO role_to_permissions (role_id, perm_id) VALUES ($1, $2)',
            [roleId, permId],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(200).json({ message: 'Record created successfully' });
                }
            }
        );
    });
    
    router.delete('/delete', (req, res) => {
        const { roleId, permId } = req.body;
    
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
                    await client.query('DELETE FROM role_to_permissions WHERE role_id = $1 AND perm_id = $2', [roleId, permId]);
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
