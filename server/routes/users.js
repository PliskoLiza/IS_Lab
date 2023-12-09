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
        const { email, password, reg_id, role_id } = req.body;

        pool.query(
            'INSERT INTO users (email, password, reg_id, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id',
            [email, password, reg_id, role_id],
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

    return router;
};
