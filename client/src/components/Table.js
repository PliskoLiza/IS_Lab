import React, {useEffect, useContext, useState} from 'react';
import { AuthContext } from "./AuthContext";
import '../css/table.css';


const EditableTable = () => {
    const [header_users, setHeaderUsers] = useState([ ]);
    const [header_roles, setHeaderRoles] = useState([ ]);
    const [header_permissions, setHeaderPermissions] = useState([ ]);
    const [roles, setRoles] = useState([ { } ]);
    const [permissions, setPermissions] = useState([ { } ]);
    const [data, setData] = useState([ { } ]);
    const [equipmentCounts, setEquipmentCounts] = useState({});
    const [dirtyFlags, setDirtyFlags] = useState({});

    const [isNewRow, setIsNewRow] = useState(false);

    const [inputRole, setInputRole] = useState('');

    const handleSubmitRole = async () => {
        console.log(inputRole);

    };

    const handleInputChangeRole = (event) => {
        setInputRole(event.target.value);
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
        getUserData();
        getRoleData();
        getPermissionsData();
    }, []);


    const addRole = () => {
        return (
            <div className="equipment-inputs">
                <input
                    type="text"
                    className="equipment-input"
                    placeholder="Role"
                    onChange={handleInputChangeRole}
                />
            </div>
        );
    }

    const handleConfirm = (value) => {
        console.log(value.target)
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
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="confirm-button"  onClick={handleSubmitRole}> Add Role </button>
            {addRole()}

            <h3>Permissions</h3>
            <table id="PermissionsTable">
                <thead>
                <tr>
                    <th>Permission id</th>
                    <th>Permission</th>
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default EditableTable;

