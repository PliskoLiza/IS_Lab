import React, { useState } from 'react';
import '../../css/regimentinfo.css'

const RegimentInfoComponent = ({ regimentData, user, onRegimentUpdated, canEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRegimentData, setEditedRegimentData] = useState({ ...regimentData });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditedRegimentData({ ...regimentData });
    };

    const handleInputChange = (e) => {
        setEditedRegimentData({
            ...editedRegimentData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/regiment/update?userId=${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editedRegimentData, regId: regimentData.reg_id })
            });

            if (response.ok) {
                setIsEditing(false);
                onRegimentUpdated(editedRegimentData);
            } else {
                console.error('Failed to update regiment');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <h1>Regiment Information</h1>
            <div className='regiment-info' >
                {!isEditing ? (
                    <>
                        <h3>Regiment: {regimentData.description}</h3>
                        <p>Count: {regimentData.count}</p>
                        <p>Your role: {regimentData.commander_user_id === user.userId ? "Commander" : "Subordinate"}</p>
                        {canEdit && <button onClick={handleEditToggle}>Edit</button>}
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={editedRegimentData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="count">Count:</label>
                            <input
                                type="number"
                                id="count"
                                name="count"
                                value={editedRegimentData.count}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleEditToggle}>Cancel</button>
                    </form>
                )}
            </div>
        </>
    );
};

export default RegimentInfoComponent;
