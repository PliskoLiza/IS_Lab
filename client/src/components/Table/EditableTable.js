import React, { useState } from 'react';
import '../../css/table.css';


function extractRelevantData(item, mappingData, mapKey) {
    return mappingData
        .filter(obj => obj[mapKey] === item[mapKey])
        .map(obj => {
            let extracted = { ...obj };
            delete extracted[mapKey];
            return extracted;
        });
}

const EditableRow = ({ item, mappingData, allOptions, updateMapping, mapKey, commonKeyForOptions, itemDisplayKey, mapDisplayKey, removeItem }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const relevantMappings = extractRelevantData(item, mappingData, mapKey);

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleUpdateMapping = (action, mappingId = null) => {
        const targetId = mappingId || selectedOption;
        if (targetId) {
            updateMapping(item, targetId, action);
        }

        setSelectedOption('');
    };

    const renderOptions = () => {
        const excludedIds = relevantMappings.map(mapping => mapping[commonKeyForOptions]);
        return allOptions
            .filter(option => !excludedIds.includes(option[commonKeyForOptions]))
            .map(option => <option key={option.id} value={option[commonKeyForOptions]}>{option[mapDisplayKey]}</option>);
    };

    return (
        <tr>
            <td>{item[itemDisplayKey]}</td>
            <td>
                <button onClick={() => removeItem(item)}> Delete </button>
            </td>
            <td colSpan="1">
                {relevantMappings.map(mapping => (
                    <div key={mapping[commonKeyForOptions]} className="mapping-row">
                        <span>{allOptions.find(option => option[commonKeyForOptions] === mapping[commonKeyForOptions])[mapDisplayKey]}</span>
                        <button onClick={() => handleUpdateMapping('remove', mapping[commonKeyForOptions])}>Remove</button>
                    </div>
                ))}
            </td>
            <td colSpan="2">
                <select onChange={handleSelectChange} value={selectedOption}>
                    <option value="">Select Option</option>
                    {renderOptions()}
                </select>

                <button onClick={() => handleUpdateMapping('add')}>Add</button>
            </td>
        </tr>
    );
};

const NewItemRow = ({ createNewItem, newItemKey }) => {
    const [newItemValue, setNewItemValue] = useState('');

    const handleCreateClick = () => {
        createNewItem(newItemValue);
        setNewItemValue(''); // Reset the input field after creating the item
    };

    return (
        <tr>
            <td>
                <input
                    type="text"
                    value={newItemValue}
                    onChange={(e) => setNewItemValue(e.target.value)}
                    placeholder={`New ${newItemKey}`}
                />
            </td>
            <td colSpan="3">
                <button onClick={handleCreateClick}>Create</button>
            </td>
        </tr>
    );
};

const EditableTable = ({ data, mappingData, allOptions, updateMapping, title, mapKey, commonKeyForOptions, mapDisplayKey, itemDisplayKey, removeItem, createNewItem }) => {
    return (
        <div className='table-container'>
            <h3>{title}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Delete row</th>
                        <th>Current Mappings</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <EditableRow 
                            key={item.id}
                            item={item}
                            mapKey={mapKey}
                            removeItem={removeItem}
                            allOptions={allOptions}
                            mappingData={mappingData}
                            updateMapping={updateMapping}
                            mapDisplayKey={mapDisplayKey}
                            itemDisplayKey={itemDisplayKey}
                            commonKeyForOptions={commonKeyForOptions}
                        />
                    ))}
                    <NewItemRow createNewItem={createNewItem} newItemKey={itemDisplayKey} />
                </tbody>
            </table>
        </div>
    );
};

export default EditableTable;
