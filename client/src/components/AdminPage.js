import React, {useContext, useEffect, useState} from 'react';
import "../css/admin.css";
import Table from "./Table/Table";
import { Link } from 'react-router-dom';
import EditableTable from "./Table/EditableTable";
import { AuthContext } from "./AuthContext";

function generateRandomHash(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default function AdminPage() {
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (e) {
            console.error('Fetch error:', e);
            return [];
        }
    };

    const { user, logout } = useContext(AuthContext);

    const [roles, setRoles] = useState([]);
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([]);
    const [inviteToken, setInviteToken] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [permissionActions, setPermissionActions] = useState([]);

    
    useEffect(() => {
        const initializeData = async () => {
            const userPermissions = await fetchData(`/api/users/whatcando?userId=${user.userId}`);

            const rolesData = await fetchData('/api/roles/get');
            const actionsData = await fetchData('/api/actions/get');
            const permissionsData = await fetchData('/api/permissions/get');
            const rolePermissionsData = await fetchData('/api/role_to_permissions/get');
            const permissionActionsData = await fetchData('/api/permission_to_actions/get');

            setRoles(rolesData);
            setActions(actionsData);
            setPermissions(permissionsData);
            setRolePermissions(rolePermissionsData);
            setPermissionActions(permissionActionsData);
            setUserPermissions(userPermissions.map(permission => permission.name));

            setLoading(false);
        };

        initializeData();
    }, []);

    const updateRolePermission = async (item, permId, action) => {
        const method = action === 'add' ? 'POST' : 'DELETE';
        const body = { roleId: item.role_id, permId: permId };
        const url = `/api/role_to_permissions/${action === 'add' ? 'create' : 'delete'}`;
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error('Failed to update permission action');
    
            // Refresh permissionActions state after successful update
            const updatedPermissionActions = await fetchData('/api/role_to_permissions/get');
            setRolePermissions(updatedPermissionActions);
        } catch (error) {
            console.error('Error updating permission action:', error);
        }
    };

    const updatePermissionAction = async (item, actionId, action) => {
        const method = action === 'add' ? 'POST' : 'DELETE';
        const body = { permId: item.perm_id, actId: actionId };
        const url = `/api/permission_to_actions/${action === 'add' ? 'create' : 'delete'}`;
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error('Failed to update permission action');
    
            // Refresh permissionActions state after successful update
            const updatedPermissionActions = await fetchData('/api/permission_to_actions/get');
            setPermissionActions(updatedPermissionActions);
        } catch (error) {
            console.error('Error updating permission action:', error);
        }
    };

    const createNewRole = async (description) => {
        try {
            const response = await fetch('/api/roles/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });
            if (!response.ok) throw new Error('Failed to create new role');
    
            const updatedRoles = await fetchData('/api/roles/get');
            setRoles(updatedRoles);
        } catch (error) {
            console.error('Error creating new role:', error);
        }
    };
    
    const createNewPermission = async (description) => {
        try {
            const response = await fetch('/api/permissions/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });
            if (!response.ok) throw new Error('Failed to create new permission');
    
            const updatedPermission = await fetchData('/api/permissions/get');
            setPermissions(updatedPermission);
        } catch (error) {
            console.error('Error creating new permission:', error);
        }
    };

    const removePermission = async (item) => {
        try {
            const response = await fetch('/api/permissions/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permId: item.perm_id })
            });
            if (!response.ok) throw new Error('Failed to delete role');
    
            const updatedPermission = await fetchData('/api/permissions/get');
            setPermissions(updatedPermission);
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    }

    const removeRole = async (item) => {
        try {
            const response = await fetch('/api/roles/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roleId: item.role_id })
            });
            if (!response.ok) throw new Error('Failed to delete role');
    
            const updatedRoles = await fetchData('/api/roles/get');
            setRoles(updatedRoles);
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    }

    const createUserHash = async () => {
        try {
            const randomHash = generateRandomHash();
            console.log(randomHash);

            const response = await fetch('/api/tokens/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({hash: randomHash})
            });

            if (!response.ok) {
                throw new Error('Failed to create token');
            }
    
        } catch (error) {
            console.error('Error updating permission action:', error);
        }
    };

    const canSee = () => {
        return (userPermissions.includes("Read All Users") || userPermissions.includes("Write All Users"));
    };

    if (!user) {
        return (
            <div className='main-page'>
                <Link to="/login">
                    <button>Press ME to login for regiment management.</button>
                </Link>
            </div>
        );
    }

    if (loading) {
        return ( 
        <div className='main-page'>
            <h1>Loading...</h1> 
        </div>
        );
    }

    if (!canSee()) {
        return (
            <div className='main-page'>
                {<h1> You don`t have the necessary permissions </h1>}
            </div>
        );
    }

    return (
        <>
            <div>
                <h2> Invite user: </h2>
                <button onClick={createUserHash} > Generate hash: </button>
                <h3>{inviteToken || ""}</h3>
            </div>
            <div className="table-container">
                <Table data={actions} headers={actions.length > 0 ? Object.keys(actions[0]) : []} title="Actions" />

                <EditableTable 
                    data={roles} 
                    mapKey="role_id"
                    commonKeyForOptions="perm_id"
                    mappingData={rolePermissions}
                    allOptions={permissions}
                    updateMapping={updateRolePermission}
                    title="Roles" 
                    mapDisplayKey="description"
                    itemDisplayKey="description"
                    removeItem={removeRole}
                    createNewItem={createNewRole}
                />
                <EditableTable 
                    mapKey="perm_id"
                    commonKeyForOptions="action_id"
                    data={permissions} 
                    mappingData={permissionActions}
                    allOptions={actions}
                    updateMapping={updatePermissionAction}
                    title="Permissions" 
                    mapDisplayKey="name"
                    itemDisplayKey="description"
                    removeItem={removePermission}
                    createNewItem={createNewPermission}
                />
            </div>
        </>
    );
}
