import React, {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {AuthContext} from "./AuthContext";
import '../css/mainpage.css';
import ProgressBarComponent from './ProgressBar';
import RegimentInfoComponent from './RegimentManagement/RegimentInfo';
import EquipmentListComponent from './RegimentManagement/EquipmentList';

const MainPage = () => {
    const [loading, setLoading] = useState(true);
    const [entities, setEntities] = useState({});
    const { user, logout } = useContext(AuthContext);
    const [userRegId, setUserRegId] = useState(null);
    const [regimentData, setRegimentData] = useState(null);
    const [regimentEntityReqData, setRegimentEntityReqData] = useState([]);
    const [regimentEntityCurData, setRegimentEntityCurData] = useState([]);

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchAllEntities();
        } else {
            setLoading(false);
        }
    }, [user]);

    const getUserRegimentID = async () => {
        try {
            const response = await fetch(`/api/user_to_regiment/get/user/${user.userId}?userId=${user.userId}`);
            if (response.ok) {
                const data = await response.json();
                return data[0].reg_id;
            }
        } catch (error) {
            console.error('Error fetching user regiment ID:', error);
        }
        return null;
    }
    
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const regId = await getUserRegimentID();
            if (regId) {
                setUserRegId(regId);
                console.log(userRegId); // Log the directly returned value
                await fetchRegimentData(regId);
                await fetchRegimentEntityReqData(regId);
                await fetchRegimentEntityCurData(regId);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };
    
    const fetchAllEntities = async () => {
        try {
            const response = await fetch(`/api/entity/get?userId=${user.userId}`);
            if (response.ok) {
                const data = await response.json();
                // Convert array to object for easier access
                const entityMap = data.reduce((acc, entity) => {
                    acc[entity.ent_id] = entity.description;
                    return acc;
                }, {});
                setEntities(entityMap);
            }
        } catch (error) {
            console.error('Error fetching entities:', error);
        }
    };

    const fetchRegimentData = async (regId) => {
        try {
            const regResponse = await fetch(`/api/regiment/get/${regId}?userId=${user.userId}`);
            if (regResponse.ok) {
                const regData = await regResponse.json();
                setRegimentData(regData);
            } else {
                console.error('Failed to fetch regiment data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchRegimentEntityReqData = async (regId) => {
        try {
            const response = await fetch(`/api/ent_per_regiment_req/get/regiment/${regId}?userId=${user.userId}`);
            if (response.ok) {
                const data = await response.json();
                setRegimentEntityReqData(data);
            }
        } catch (error) {
            console.error('Error fetching regiment required entity data:', error);
        }
    };

    const fetchRegimentEntityCurData = async (regId) => {
        try {
            const response = await fetch(`/api/ent_per_regiment_cur/get/regiment/${regId}?userId=${user.userId}`);
            if (response.ok) {
                const data = await response.json();
                setRegimentEntityCurData(data);
            }
        } catch (error) {
            console.error('Error fetching regiment current entity data:', error);
        }
    };

    const calculateProgress = (entityId) => {
        const required = regimentEntityReqData.find(item => item.ent_id === entityId)?.count || 0;
        const current = regimentEntityCurData.find(item => item.ent_id === entityId)?.count || 0;
        const percentage = Math.min((current / required) * 100, 100);
        return { current, required, percentage };
    };

    const handleRegimentUpdated = (updatedRegimentData) => {
        setRegimentData(updatedRegimentData);
    };

    // Inside MainPage component
    const handleEquipmentUpdated = () => {
        // Fetch the updated equipment list
        fetchRegimentEntityReqData(userRegId);
        fetchRegimentEntityCurData(userRegId);
    };

    
    if (!user) {
        return (
            <div className='main-page'>
                <Link to="/login">
                    <button>You need to be logged in to edit the database.</button>
                </Link>
            </div>
        );
    }

    return (
        <div className='main-page'>
          {loading ? <h1>Loading...</h1> : (
            <>
              {regimentData && <RegimentInfoComponent regimentData={regimentData} user={user} onRegimentUpdated={handleRegimentUpdated} canEdit={true} />}
              {entities && <EquipmentListComponent entities={entities} user={user} calculateProgress={calculateProgress} onEquipmentUpdated={handleEquipmentUpdated} regimentId={userRegId} canEdit={true} />}
            </>
          )}
        </div>
      );
    };

export default MainPage;
