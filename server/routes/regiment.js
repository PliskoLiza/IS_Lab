const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get('/get', (req, res) => {
        pool.query('SELECT * FROM regiment', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:regId', (req, res) => {
        const { regId } = req.params;
        pool.query('SELECT * FROM regiment WHERE reg_id = $1', [regId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.post('/create', (req, res) => {
        const { user_id, count, description } = req.body;
        pool.query(
            'INSERT INTO regiment (commander_user_id, count, description) VALUES ($1, $2, $3) RETURNING reg_id',
            [user_id, count, description],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ regId: result.rows[0].reg_id });
                }
            }
        );
    });

    router.delete('/delete', (req, res) => {
        const { regId } = req.body;
    
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
                    await client.query('DELETE FROM user_to_regiment WHERE reg_id = $1', [regId]);
                    await client.query('DELETE FROM ent_per_regiment_cur WHERE reg_id = $1', [regId]);
                    await client.query('DELETE FROM ent_per_regiment_req WHERE reg_id = $1', [regId]);
    
                    // Delete the regiment
                    await client.query('DELETE FROM regiment WHERE reg_id = $1', [regId]);
    
                    // Commit the transaction
                    await client.query('COMMIT');
                    res.json({ message: 'Regiment deleted successfully' });
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
    
    return router;
};
