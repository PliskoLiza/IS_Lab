const express = require('express');
const router = express.Router();
const checkPermission = require('./perm_check');

module.exports = (pool) => {
    router.get('/get', checkPermission(pool, 'Read All Tokens'), (req, res) => {
        pool.query('SELECT * FROM tokens', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:entId', checkPermission(pool, 'Read All Tokens'), (req, res) => {
        const { entId } = req.params;
        pool.query('SELECT * FROM entity WHERE ent_id = $1', [entId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.post('/create', checkPermission(pool, 'Write All Tokens'), (req, res) => {
        const { hash } = req.body;
        pool.query(
            'INSERT INTO tokens (token_hash, is_valid) VALUES ($1, TRUE) RETURNING token_hash',
            [hash],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ hash: result.rows[0].token_hash });
                }
            }
        );
    });

    router.get('/is_valid/:tokenHash', (req, res) => {
        const { tokenHash } = req.params;
        pool.query(
            'SELECT * FROM tokens WHERE token_hash = $1 AND is_valid = TRUE',
            [tokenHash],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else if (result.rows.length === 0) {
                    res.status(404).json({ error: 'Token not found' });
                } else {
                    const isValid = result.rows[0].is_valid;
                    res.json({ isValid });
                }
            }
        );
    });

    router.delete('/delete', checkPermission(pool, 'Write All Tokens'), (req, res) => {
        const { tokenId } = req.body;
    
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
                    await client.query('DELETE FROM tokens WHERE token_id = $1', [tokenId]);
    
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
    
    router.put('/update', checkPermission(pool, 'Write All Tokens'), (req, res) => {
        const { tokenId, isValid } = req.body;
        pool.query(
            'UPDATE tokens SET is_valid = $1 WHERE token_id = $2',
            [isValid, tokenId],
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
