const checkPermission = (pool, requiredAction) => {
    return async (req, res, next) => {
        const { userId } = req.query;
        try {
            const query = `
                SELECT * FROM permission_to_actions pa
                JOIN role_to_permissions rp ON pa.perm_id = rp.perm_id
                JOIN users u ON rp.role_id = u.role_id
                JOIN actions a ON pa.action_id = a.action_id
                WHERE u.user_id = $1 AND POSITION($2 IN a.name) > 0
            `;

            const result = await pool.query(query, [userId, requiredAction]);

            if (result.rows.length > 0) {
                console.log('Access granted: ' + requiredAction);
                next(); // User has permission, proceed to the endpoint
            } else {
                console.log('Access denied: ' + requiredAction);
                res.status(403).json({ error: 'Access denied' });
            }
        } catch (error) {
            console.log('Error: ' + error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = checkPermission;
