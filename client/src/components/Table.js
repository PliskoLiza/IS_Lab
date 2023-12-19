import React, {useEffect, useContext, useState} from 'react';
import { AuthContext } from "./AuthContext";
import '../css/table.css';


const EditableTable = () => {
    const [header_users, setHeaderUsers] = useState([ ]);
    const [header_roles, setHeaderRoles] = useState([ ]);
    const [header_permissions, setHeaderPermissions] = useState([ ]);
    const [header_actions, setHeaderActions] = useState([ ]);
    const [header_permissions_roles, setHeaderPermissionsRoles] = useState([ ]);
    const [header_permissions_actions, setHeaderPermissionsActions] = useState([ ]);

    const [roles, setRoles] = useState([ { } ]);
    const [permissions, setPermissions] = useState([ { } ]);
    const [permissions_roles, setPermissionsRoles] = useState([ { } ]);
    const [permissions_info, setPermissionsInfo] = useState([ { } ]);
    const [permissions_actions, setPermissionsActions] = useState([ { } ]);
    const [actions, setActions] = useState([ { } ]);
    const [actions_info, setActionsInfo] = useState([ { } ]);
    const [data, setData] = useState([ { } ]);

    const [role_to_delete, setRoleToDelete] = useState('');
    const [perm_to_delete, setPermToDelete] = useState('');

    const [equipmentCounts, setEquipmentCounts] = useState({});
    const [dirtyFlags, setDirtyFlags] = useState({});

    const [isNewRow, setIsNewRow] = useState(false);

    const [inputRole, setInputRole] = useState('');
    const [inputPermission, setInputPermission] = useState('');
    const [inputPermissionRoles, setInputPermissionRoles] = useState('');
    const [inputPermissionActions, setInputPermissionActions] = useState('');

    const handleSubmitRole = async () => {
        try {
            const response = await fetch(`/api/roles/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description: inputRole })
            });
            if (!response.ok) throw new Error('Failed to create role');
        } catch (error) {
            console.error('Error:', error);
        }
        getRoleData();
    };

    const handleSubmitPermission = async () => {
        try {
            const response = await fetch(`/api/permissions/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description: inputPermission })
            });
            if (!response.ok) throw new Error('Failed to create permission');
        } catch (error) {
            console.error('Error:', error);
        }
        getPermissionsData();
    };

    const handleSubmitPermissionRole = async () => {
        try {
            const response = await fetch(`/api/role_to_permissions/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({role_id: role_to_delete, perm_id: inputPermissionRoles })
            });
            if (!response.ok) throw new Error('Failed to create permission');
        } catch (error) {
            console.error('Error:', error);
        }
        getPermissionsRolesData(role_to_delete);
    };

    const handleSubmitPermissionAction = async () => {
        try {
            const response = await fetch(`/api/permission_to_actions/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({actId: inputPermissionActions, permId: perm_to_delete })
            });
            if (!response.ok) throw new Error('Failed to create permission');
        } catch (error) {
            console.error('Error:', error);
        }
        getPermissionsActionsData(role_to_delete);
    };
    const handleInputChangeRole = (event) => {
        setInputRole(event.target.value);
    };

    const handleInputChangePermission = (event) => {
        setInputPermission(event.target.value);
    };

    const handleInputChangePermissionRole = (event) => {
        console.log(event.target.value)
        setInputPermissionRoles(event.target.value);
    };

    const handleInputChangePermissionAction = (event) => {
        console.log(event.target.value)
        setInputPermissionActions(event.target.value);
    };

    const getUserData = async () => {
        try {
            const response = await fetch(`/api/profile/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const data = await response.json();
                setData(data);
                localStorage.setItem("data", data);
                setHeaderUsers(Object.keys(data[0]));
            } else {
                console.error("Error retrieving user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    };

    const getRoleData = async () => {
        try {
            const response = await fetch(`/api/roles/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const roles = await response.json();
                setRoles(roles);
                localStorage.setItem("roles", roles);
                setHeaderRoles(Object.keys(roles[0]));
            } else {
                console.error("Error retrieving user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    };

    const getPermissionsData = async () => {
        try {
            const response = await fetch(`/api/permissions/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const permissions = await response.json();
                setPermissions(permissions);
                localStorage.setItem("permissions", permissions);
                setHeaderPermissions(Object.keys(permissions[0]));
            } else {
                console.error("Error retrieving user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    };

    useEffect(() => {
        setPermissionsInfo([{}]);
        console.log("permissions_info1", permissions_info);
        console.log("permissions_roles", permissions_roles)
        permissions_roles.forEach(async (item) => {
            console.log("item",item.perm_id)
            try {
                const response = await fetch(`/api/permissions/get/${item.perm_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (response.ok) {
                    const permission = await response.json();
                    console.log(permission);
                    setPermissionsInfo(prevPermissions => [...prevPermissions, permission]);

                    //        console.log(Object.assign(permissions_info, permission));
                } else {
                    console.error("Error retrieving user data:", response.statusText);
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        });
        console.log("permissions_info2", permissions_info);
    }, [permissions_roles]);

    const getPermissionsRolesData = async (roleId) => {
        try {
            const response = await fetch(`/api/role_to_permissions/get/role/${roleId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const permissions_roles = await response.json();
                setPermissionsRoles(permissions_roles);
                localStorage.setItem("permissions_roles", permissions_roles);
                setHeaderPermissionsRoles(Object.keys(permissions_roles[0]));
            } else {
                console.error("Error retrieving user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    };

    useEffect(() => {
        getUserData();
        getRoleData();
        getPermissionsData();
        getActionsData();
    }, [roles, permissions, permissions_roles, permissions_actions]);


    const getActionsData = async () => {
        try {
            const response = await fetch(`/api/actions/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const actions = await response.json();
                setActions(actions);
                localStorage.setItem("actions", actions);
                setHeaderActions(Object.keys(actions[0]));
            } else {
                console.error("Error retrieving user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    };

    useEffect(() => {
        setActionsInfo([{}]);
        permissions_actions.forEach(async (item) => {
            try {
                const response = await fetch(`/api/actions/get/${item.action_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (response.ok) {
                    const action = await response.json();
                    setActionsInfo(prevActions => [...prevActions, action]);
                //    console.log(action);
                 //   console.log(actions_info);

                    //        console.log(Object.assign(permissions_info, permission));
                } else {
                    console.error("Error retrieving user data:", response.statusText);
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        });
        console.log(actions_info);
    }, [permissions_actions]);
    const getPermissionsActionsData = async (permId) => {
        try {
            const response = await fetch(`/api/permission_to_actions/get/permission/${permId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const permission_actions = await response.json();
                setPermissionsActions(permission_actions);
                console.log(permission_actions);
                localStorage.setItem("permission_actions", permission_actions);
                setHeaderPermissionsActions(Object.keys(permission_actions[0]));
            } else {
                console.error("Error retrieving user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
       // console.log(11111, actions, permId)
    };

    const handleRoleChoice = async (roleId) => {
        setRoleToDelete(roleId);
        getPermissionsRolesData(roleId);
    }

    const handlePermissionChoice = async (permId) => {
        console.log(permId)
        setPermToDelete(permId);
        getPermissionsActionsData(permId);
    }

    const addRole = () => {
        return (
            <input
                type="text"
                className="input"
                placeholder="Role"
                onChange={handleInputChangeRole}
            />
        );
    }

    const addPermission = () => {
        return (
            <input
                type="text"
                className="input"
                placeholder="Permission"
                onChange={handleInputChangePermission}
            />
        );
    }

    const addPermissionRole = () => {
        return (
            <input
                type="text"
                className="input"
                placeholder="Permission id"
                onChange={handleInputChangePermissionRole}
            />
        );
    }

    const addPermissionAction = () => {
        return (
            <input
                type="text"
                className="input"
                placeholder="Action id"
                onChange={handleInputChangePermissionAction}
            />
        );
    }

    const deleteRole = async (event) => {
        try {
            const response = await fetch(`/api/roles/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roleId: event.target.id })
            });
            if (!response.ok) throw new Error('Failed to create role');
        } catch (error) {
            console.error('Error:', error);
        }
        getRoleData();
    }

    const deletePermission = async (event) => {
        try {
            const response = await fetch(`/api/permissions/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ permId: event.target.id })
            });
            if (!response.ok) throw new Error('Failed to create role');
        } catch (error) {
            console.error('Error:', error);
        }
        getPermissionsData();
    }

    const deletePermissionRole = async (event) => {
        console.log('deleting', role_to_delete, event.target.id)
        try {
            const response = await fetch(`/api/role_to_permissions/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roleId: role_to_delete, permId: event.target.id})
            });
            if (!response.ok) throw new Error('Failed to create role');
        } catch (error) {
            console.error('Error:', error);
        }
        getPermissionsRolesData(role_to_delete);
    }

    const deletePermissionAction = async (event) => {
        console.log('deleting', perm_to_delete, event.target.id)
        try {
            const response = await fetch(`/api/permission_to_actions/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ actId: event.target.id, permId: perm_to_delete })
            });
            if (!response.ok) throw new Error('Failed to create role');
        } catch (error) {
            console.error('Error:', error);
        }
        getPermissionsActionsData(perm_to_delete);
    }

    return (
        <div className="table-container">
            <h3>Users</h3>
            <table id="UsersTable">
                <thead>
                <tr>
                    <th>User id</th>
                    <th>Role</th>
                    <th>Regiment</th>
                    <th>Email</th>
                    <th>Password</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(data) && data.map((item, dataIndex) => (
                    <tr key={dataIndex}>
                        {header_users.map((headerName, index) => (
                            <td key={index}>
                                {item[headerName.toLowerCase()]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Roles</h3>
            <table id="RolesTable">
                <thead>
                <tr>
                    <th>Role id</th>
                    <th>Role</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(roles) && roles.map((item, dataIndex) => (
                    <tr key={dataIndex}>
                        {header_roles.map((headerName, index) => (
                            <td key={index}>
                                {item[headerName.toLowerCase()]}
                            </td>
                        ))}
                        <td><button className="delete-button" id={item.role_id} onClick={deleteRole}>-</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div  style={{ display: 'flex', alignItems: 'center' }}>
                <button className="confirm-button" onClick={handleSubmitRole}> Add Role </button>
                {addRole()}
            </div>

            <h3>Permissions</h3>
            <table id="PermissionsTable">
                <thead>
                <tr>
                    <th>Permission id</th>
                    <th>Permission</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(permissions) && permissions.map((item, dataIndex) => (
                    <tr key={dataIndex}>
                        {header_permissions.map((headerName, index) => (
                            <td key={index}>
                                {item[headerName.toLowerCase()]}
                            </td>
                        ))}
                        <td><button className="delete-button" id={item.perm_id} onClick={deletePermission}>-</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div  style={{ display: 'flex', alignItems: 'center' }}>
                <button className="confirm-button" onClick={handleSubmitPermission}> Add Permission </button>
                {addPermission()}
            </div>

            <h3>Permissions for roles</h3>
            <div>
                <select onChange={(e) => handleRoleChoice(e.target.value)}>
                    <option key='' value="">Select Option</option>
                    {Array.isArray(roles) && roles.map((item, dataIndex) => (
                        <option key={dataIndex} value={item.role_id}> {item.description} </option>
                    ))}
                </select>
            </div>
            <table id="RoleToPermissionsTable">
                <thead>
                <tr>
                    <th>Permission id</th>
                    <th>Permission</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(permissions_info) && permissions_info.slice(1).map((item, dataIndex) => (
                    <tr key={dataIndex}>
                        {header_permissions.map((headerName, index) => (
                            <td key={index}>
                                {item[headerName.toLowerCase()]}
                            </td>
                        ))}
                        <td><button className="delete-button" id={item.perm_id} onClick={deletePermissionRole}>-</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div  style={{ display: 'flex', alignItems: 'center' }}>
                <button className="confirm-button" onClick={handleSubmitPermissionRole}> Add Permission </button>
                {addPermissionRole()}
            </div>

            <h3>Actions for permissions</h3>
            <div>
                <select onChange={(e) => handlePermissionChoice(e.target.value)}>
                    <option key='' value="">Select Option</option>
                    {Array.isArray(permissions) && permissions.map((item, dataIndex) => (
                        <option key={dataIndex} value={item.perm_id}> {item.description} </option>
                    ))}
                </select>
            </div>
            <table id="ActionsToPermissionsTable">
                <thead>
                <tr>
                    <th>Action id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(actions_info) && actions_info.slice(1).map((item, dataIndex) => (
                    <tr key={dataIndex}>
                        {header_actions.map((headerName, index) => (
                            <td key={index}>
                                {item[headerName.toLowerCase()]}
                            </td>
                        ))}
                        <td><button className="delete-button" id={item.action_id} onClick={deletePermissionAction}>-</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div  style={{ display: 'flex', alignItems: 'center' }}>
                <button className="confirm-button" onClick={handleSubmitPermissionAction}> Add Permission </button>
                {addPermissionAction()}
            </div>
        </div>
    );
};

export default EditableTable;

