const checkUserPermission = async (pool, userId, actionName) => {
    console.log(userId);
    console.log(actionName);

    const query = `
        SELECT * FROM permission_to_actions pa
        JOIN role_to_permissions rp ON pa.perm_id = rp.perm_id
        JOIN users u ON rp.role_id = u.role_id
        JOIN actions a ON pa.action_id = a.action_id
        WHERE u.user_id = $1 AND a.name = $2
    `;
    const result = await pool.query(query, [userId, actionName]);
    return { hasPermission: result.rows.length > 0 };
};

module.exports = checkUserPermission;
