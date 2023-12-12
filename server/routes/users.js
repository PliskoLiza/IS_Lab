const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM users', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:userId', (req, res) => {
        const { userId } = req.params;
        pool.query('SELECT * FROM users WHERE user_id = $1', [userId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    
    // Login
    router.post("/login", (req, res) => {
        const { email, password } = req.body;
        pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
            if (error) {
                console.error('Error retrieving user from the database:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                const user = result.rows[0];
                if (user && user.password === password) {
                    res.json({ success: true, userId: user.user_id, email: user.email });
                } else {
                    res.status(401).json({ error: "Invalid email or password" });
                }
            }
        });
    });

    // Register
    router.post("/register", (req, res) => {
        const { email, password} = req.body;

        pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id',
            [email, password],
            (error, result) => {
                if (error) {
                    console.error('Error registering user:', error);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(200).json({ userId: result.rows[0].user_id });
                }
            }
        );
    });

    router.delete('/delete', (req, res) => {
        const { userId } = req.body;
    
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
                    // Update or delete related records
                    await client.query('UPDATE regiment SET commander_user_id = NULL WHERE commander_user_id = $1', [userId]);
                    await client.query('DELETE FROM user_to_regiment WHERE user_id = $1', [userId]);
    
                    // Delete the user
                    await client.query('DELETE FROM users WHERE user_id = $1', [userId]);
    
                    // Commit the transaction
                    await client.query('COMMIT');
                    res.json({ message: 'User deleted successfully' });
                } catch (error) {
                    // Rollback in case of error
                    await client.query('ROLLBACK');
                    res.status(500).json({ error: 'Internal server error' });
                } finally {
                    done();
                }
            });
        });
    });

    router.put('/update', (req, res) => {
        const { userId, roleId, email, password } = req.body;
        pool.query(
            'UPDATE users SET role_id = $1, email = $2, password = $3 WHERE user_id = $4',
            [roleId, email, password, userId],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ message: 'User updated successfully' });
                }
            }
        );
    });
    
    return router;
};
