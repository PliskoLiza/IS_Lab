const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM user_to_regiment', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    // Role-specific permissions
    router.get('/get/user/:userId', (req, res) => {
        const { userId } = req.params;
        pool.query('SELECT * FROM user_to_regiment WHERE user_id = $1', [userId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    // Permission-specific roles
    router.get('/get/regiment/:regId', (req, res) => {
        const { regId } = req.params;
        pool.query('SELECT * FROM user_to_regiment WHERE reg_id = $1', [regId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.post('/create', (req, res) => {
        const { user_id, reg_id } = req.body;
        pool.query(
            'INSERT INTO user_to_regiment (user_id, reg_id) VALUES ($1, $2)',
            [user_id, reg_id],
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
        const { userId, regId } = req.body;
    
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
                    await client.query('DELETE FROM user_to_regiment WHERE user_id = $1 AND reg_id = $2', [userId, regId]);
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
