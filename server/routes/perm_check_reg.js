const checkUserPermission = require('./perm_check_user'); 

const checkReadRegimentAccess = (pool) => {
    return async (req, res, next) => {
        const { userId } = req.query;
        const regId = req.params.regId || req.body.regId;

        try {
            
            const result_all = await checkUserPermission(pool, userId, 'Read All Regiments');

            if (result_all.hasPermission) {
                next(); // User has "Read All Regiment" permission
            } else {
                // Check if the user is part of the regiment
                const regimentResult = await pool.query(
                    'SELECT * FROM user_to_regiment WHERE user_id = $1 AND reg_id = $2',
                    [userId, regId]
                );

                if (regimentResult.rows.length > 0) {
                    const result_own = await checkUserPermission(pool, userId, 'Read Own Regiments');

                    if (result_own.hasPermission) {
                        next();
                    }
                    else {
                        res.status(403).json({ error: 'Access denied' });
                    }

                } else {
                    res.status(403).json({ error: 'Access denied' });
                }
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

const checkWriteRegimentAccess = (pool) => {
    return async (req, res, next) => {
        const { userId } = req.query;
        const regId = req.params.regId || req.body.regId;

        try {
            
            const result_all = await checkUserPermission(pool, userId, 'Write All Regiments');

            if (result_all.hasPermission) {
                next(); // User has "Read All Regiment" permission
            } else {
                // Check if the user is part of the regiment
                const regimentResult = await pool.query(
                    'SELECT * FROM user_to_regiment WHERE user_id = $1 AND reg_id = $2',
                    [userId, regId]
                );

                if (regimentResult.rows.length > 0) {
                    const result_own = await checkUserPermission(pool, userId, 'Write Own Regiments');

                    if (result_own.hasPermission) {
                        next();
                    }
                    else {
                        res.status(403).json({ error: 'Access denied' });
                    }

                } else {
                    res.status(403).json({ error: 'Access denied' });
                }
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = { checkReadRegimentAccess, checkWriteRegimentAccess };
