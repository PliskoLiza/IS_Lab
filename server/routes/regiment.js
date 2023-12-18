const express = require('express');
const router = express.Router();
const checkPermission = require('./perm_check');
const { checkReadRegimentAccess, checkWriteRegimentAccess } = require('./perm_check_reg');

module.exports = (pool) => {
    router.get('/get', checkPermission(pool, 'Read All Regiment'), (req, res) => {
        pool.query('SELECT * FROM regiment', (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows);
            }
        });
    });

    router.get('/get/:regId', checkReadRegimentAccess(pool), (req, res) => {
        const { regId } = req.params;
        pool.query('SELECT * FROM regiment WHERE reg_id = $1', [regId], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(result.rows[0]);
            }
        });
    });

    router.post('/create', checkPermission(pool, 'Write All Regiment'), (req, res) => {
        console.log("Create regiment");

        const { userId, count, description } = req.body;
        pool.query(
            'INSERT INTO regiment (commander_user_id, count, description) VALUES ($1, $2, $3) RETURNING reg_id',
            [userId, count, description],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ regId: result.rows[0].reg_id });
                }
            }
        );
    });

    router.delete('/delete', checkWriteRegimentAccess(pool), (req, res) => {
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
    
    router.put('/update', checkWriteRegimentAccess(pool), (req, res) => {
        const { regId, commanderUserId, count, description } = req.body;
        pool.query(
            'UPDATE regiment SET commander_user_id = $1, count = $2, description = $3 WHERE reg_id = $4',
            [commanderUserId, count, description, regId],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ message: 'Regiment updated successfully' });
                }
            }
        );
    });
    
    return router;
};
