import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "./AuthContext";
import ProgressBarComponent from './ProgressBar';

import '../css/table.css'

const HighLevelManagement = () => {
    const [entities, setEntities] = useState([]);
    const [regiments, setRegiments] = useState([]);
    const [regimentsEntCur, setRegimentsEntCur] = useState([]);
    const [regimentsEntReq, setRegimentsEntReq] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchRegiments();
        fetchEntities();
        fetchRegimentsCurrent();
        fetchRegimentsRerquired();

        if (user) {
            fetchUserPermissions(user.userId).then(permissions => setUserPermissions(permissions));
        }
    }, []);

    const fetchUserPermissions = async (userId) => {
        try {
            const response = await fetch(`/api/users/whatcando?userId=${userId}`);
            if (response.ok) {
                const permissions = await response.json();
                return permissions.map(permission => permission.name);
            } else {
                console.error('Failed to fetch user permissions');
                return [];
            }
        } catch (error) {
            console.error('Error fetching user permissions:', error);
            return [];
        }
    };

    const fetchRegiments = async () => {
        try {
            const response = await fetch(`/api/regiment/get?userId=${user.userId}`);
            const data = await response.json();
            setRegiments(data);
        } catch (error) {
            console.error('Error fetching regiments', error);
        }
    };

    const fetchRegimentsRerquired = async () => {
        try {
            const response = await fetch(`/api/ent_per_regiment_req/get?userId=${user.userId}`);
            const data = await response.json();
            setRegimentsEntReq(data);
        } catch (error) {
            console.error('Error fetching regiments', error);
        }
    };

    const fetchRegimentsCurrent = async () => {
        try {
            const response = await fetch(`/api/ent_per_regiment_cur/get?userId=${user.userId}`);
            const data = await response.json();
            setRegimentsEntCur(data);
        } catch (error) {
            console.error('Error fetching regiments', error);
        }
    };

    const fetchEntities = async () => {
        try {
            const response = await fetch(`/api/entity/get?userId=${user.userId}`);
            if (response.ok) {
                const data = await response.json();
                setEntities(data);
            }
        } catch (error) {
            console.error('Error fetching entities:', error);
        }
    };

    const canSee = () => {
        return (userPermissions.includes("Read All Entity") && userPermissions.includes("Read All Regiments"));
    };

    if (!canSee()) {
        return (
            <div className='main-page'>
                <h1> You don`t have the necessary permissions </h1>
            </div>
        );
    }

    const aggregateEquipmentData = () => {
        const equipmentStatus = entities.map(entity => {
            const currentCount = regimentsEntCur.reduce((acc, cur) => cur.ent_id === entity.ent_id ? acc + cur.count : acc, 0);
            const requiredCount = regimentsEntReq.reduce((acc, req) => req.ent_id === entity.ent_id ? acc + req.count : acc, 0);
            const percentage = requiredCount === 0 ? 100 : Math.round((currentCount / requiredCount) * 100);
            return {
                ...entity,
                currentCount,
                requiredCount,
                percentage
            };
        });
        return equipmentStatus;
    };

    const equipmentWithStatus = aggregateEquipmentData();

    return (
        <div className="table-container">
            <h1>High-Level Regiment Management</h1>
            <h2>Regiments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Regiment ID</th>
                        <th>Commander User ID</th>
                        <th>Count</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {regiments.map(regiment => (
                        <tr key={regiment.reg_id}>
                            <td>{regiment.reg_id}</td>
                            <td>{regiment.commander_user_id}</td>
                            <td>{regiment.count}</td>
                            <td>{regiment.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Entities</h2>
            <table>
                <thead>
                    <tr>
                        <th>Entity ID</th>
                        <th>Description</th>
                        <th>Current Count</th>
                        <th>Required Count</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {equipmentWithStatus.map(item => (
                        <tr key={item.ent_id}>
                            <td>{item.ent_id}</td>
                            <td>{item.description}</td>
                            <td>{item.currentCount}</td>
                            <td>{item.requiredCount}</td>
                            <td>
                                <ProgressBarComponent 
                                    percentage={item.percentage} 
                                    label={`${item.percentage}%`}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HighLevelManagement;
