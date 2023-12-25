const express = require('express');
const router = express.Router();
const checkUserPermission = require('./perm_check_user');

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

    router.get('/search', (req, res) => {
        const { email = '', page = 0 } = req.query;
        const limit = 10; // Number of results per page
        const offset = page * limit;
    
        const query = `
            SELECT * FROM users 
            WHERE email LIKE $1 
            ORDER BY user_id 
            LIMIT $2 OFFSET $3
        `;
    
        pool.query(query, [`%${email}%`, limit, offset], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });
    
    router.get('/whatcando', async (req, res) => {
        const { userId } = req.query;
    
        try {
            const query = `
                SELECT a.name, a.description FROM actions a
                JOIN permission_to_actions pa ON a.action_id = pa.action_id
                JOIN role_to_permissions rp ON pa.perm_id = rp.perm_id
                JOIN users u ON rp.role_id = u.role_id
                WHERE u.user_id = $1
            `;
            const result = await pool.query(query, [userId]);
    
            const actions = result.rows.map(row => ({ name: row.name, description: row.description }));
            res.json(actions);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
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
        const { email, password, token } = req.body;
    
        // Start a database transaction
        pool.connect((err, client, done) => {
            if (err) {
                console.error('Error acquiring client:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            client.query('BEGIN', async (err) => {
                if (err) {
                    done(); // release the client back to the pool
                    console.error('Error starting transaction:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                try {
                    const tokenResult = await client.query(
                        'SELECT is_valid FROM tokens WHERE token_hash = $1',
                        [token]
                    );
    
                    if (tokenResult.rows.length === 0 || !tokenResult.rows[0].is_valid) {
                        throw new Error('Invalid or expired token');
                    }
    
                    const userResult = await client.query(
                        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id',
                        [email, password]
                    );
    
                    await client.query(
                        'UPDATE tokens SET is_valid = FALSE WHERE token_hash = $1',
                        [token]
                    );
    
                    await client.query('COMMIT'); // Commit the transaction
    
                    res.status(200).json({ userId: userResult.rows[0].user_id });
                } catch (error) {
                    await client.query('ROLLBACK'); // Rollback the transaction on error
                    console.error('Transaction error:', error);
                    res.status(500).json({ error: error.message });
                } finally {
                    done(); // release the client back to the pool
                }
            });
        });
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
