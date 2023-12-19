import React, {useContext, useEffect, useState} from 'react';
import "../css/admin.css";
import Table from "./Table/Table";
import { Link } from 'react-router-dom';
import EditableTable from "./Table/EditableTable";
import { AuthContext } from "./AuthContext";

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
        console.log(item, permId, action);

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
        console.log(item, actionId, action);

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

    
    const canSee = () => {
        console.log(userPermissions);
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
            />
        </div>
    );
}
