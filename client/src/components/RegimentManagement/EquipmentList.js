import React, { useState, useEffect } from 'react';
import ProgressBarComponent from '../ProgressBar';
import '../../css/regimentequipment.css'

const EquipmentListComponent = ({ entities, user, calculateProgress, onEquipmentUpdated, regimentId, canEdit }) => {
    const [error, setError] = useState('');
    const [dirtyFlags, setDirtyFlags] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [equipmentCounts, setEquipmentCounts] = useState({});

    useEffect(() => {
        const initialCounts = {};
        const initialDirtyFlags = {};
        Object.entries(entities).forEach(([entId, _]) => {
            const { current, required } = calculateProgress(parseInt(entId));
            initialCounts[entId] = { current, required };
            initialDirtyFlags[entId] = { current: false, required: false };
        });
        setEquipmentCounts(initialCounts);
        setDirtyFlags(initialDirtyFlags);
    }, [entities, calculateProgress]);

    const handleCountChange = (entId, type, value) => {
        const parsedValue = parseInt(value);
        setEquipmentCounts({
            ...equipmentCounts,
            [entId]: {
                ...equipmentCounts[entId],
                [type]: isNaN(parsedValue) ? 0 : parsedValue
            }
        });
        setDirtyFlags({
            ...dirtyFlags,
            [entId]: { ...dirtyFlags[entId], [type]: true }
        });
    };
    
    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        try {
            for (const [entId, counts] of Object.entries(equipmentCounts)) {
                if (dirtyFlags[entId]?.current) {
                    await updateCount('current', entId, counts.current || 0);
                }
                if (dirtyFlags[entId]?.required) {
                    await updateCount('required', entId, counts.required || 0);
                }
            }
            onEquipmentUpdated();
        } catch (error) {
            setError('Failed to update equipment data.');
            console.error('Error:', error);
        }
        setIsLoading(false);
    };

    const updateCount = async (type, entId, count) => {
        const endpoint = type === 'current' ? '/api/ent_per_regiment_cur/update' : '/api/ent_per_regiment_req/update';
        try {
            const response = await fetch(`${endpoint}?userId=${user.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regId: regimentId, entId: entId, count: count })
            });
            if (!response.ok) throw new Error('Failed to update count');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="equipment-list-container">
            <h3>Regiment Equipment</h3>
            {error && <div className="error-message">{error}</div>}

            {Object.entries(entities).map(([entId, name]) => {
                const { current, required, percentage } = calculateProgress(parseInt(entId));
                return (
                    <div key={entId} className="equipment-item">
                        <div className="equipment-name">
                            <p>{name}:</p>
                            <ProgressBarComponent
                                percentage={percentage}
                                label={`${current}/${required}`}
                            />
                        </div>
                        {
                            canEdit &&
                            <div className="equipment-inputs">
                            <input 
                                type="number"
                                className="equipment-input"
                                value={equipmentCounts[entId]?.current !== undefined ? equipmentCounts[entId].current : current}
                                onChange={(e) => handleCountChange(entId, 'current', e.target.value)} 
                                placeholder="Current"
                            />
                            <input 
                                type="number"
                                className="equipment-input"
                                value={equipmentCounts[entId]?.required !== undefined ? equipmentCounts[entId].required : required}
                                onChange={(e) => handleCountChange(entId, 'required', e.target.value)} 
                                placeholder="Required"
                            />
                            </div>
                        }
                    </div>
                );
            })}

            {
                canEdit &&
                <button className="confirm-button" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Confirm'}
                </button>
            }
        </div>
    );
};

export default EquipmentListComponent;
