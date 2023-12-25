import React, { useState, useEffect } from 'react';
import ProgressBarComponent from '../ProgressBar';
import '../../css/regimentequipment.css'

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EquipmentListComponent = ({ entities, user, calculateProgress, onEquipmentUpdated, regimentId, regimentName, canEdit }) => {
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

    const exportPDF = () => {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        let y = 20; // Initial vertical offset
    
        // Add a title
        pdf.setFontSize(16);
        pdf.text('Regiment Equipment Report', margin, y);
        y += 10; // Increment y offset
    
        pdf.setFontSize(14);
        pdf.text(`Regiment: ${regimentName}`, margin, y);
        y += 10;

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        pdf.text(`Date: ${formattedDate}`, margin, y);
        y += 20; // Increment y offset
    
        // Table Headers
        pdf.setFontSize(12);
        pdf.text('Equipment Name', margin, y);
        pdf.text('Current Count', pageWidth / 2, y);
        pdf.text('Required Count', pageWidth - 60, y);
        y += 10; // Increment y offset
    
        // Table Rows
        pdf.setFontSize(10);
        Object.entries(entities).forEach(([entId, name]) => {
            const { current, required } = equipmentCounts[entId] || { current: 0, required: 0 };
    
            pdf.text(name, margin, y);
            pdf.text(String(current), pageWidth / 2, y);
            pdf.text(String(required), pageWidth - 60, y);
            y += 10; // Increment y offset for next row
    
            // Check for page end and add a new page if needed
            if (y > pdf.internal.pageSize.getHeight() - 20) {
                pdf.addPage();
                y = 20; // Reset y offset for the new page
            }
        });
    
        // Save the PDF
        pdf.save('equipment-report.pdf');
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
            <button onClick={exportPDF}>Export as PDF</button>
        </div>
    );
};

export default EquipmentListComponent;
