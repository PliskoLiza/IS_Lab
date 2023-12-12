import React, {useEffect, useContext, useState} from 'react';
import { AuthContext } from "./AuthContext";
import '../css/table.css';


const EditableTable = ({user, table}) => {
    const [header, setHeader] = useState([ ]);
    const [rows, setRows] = useState([ { } ]);
    const [data, setData] = useState([ { } ]);


    // Функция для обновления данных в таблице
    const handleEdit = (id, field, value) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const getData = async () => {
        try {
            const response = await fetch(`/api/${table}/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const data = await response.json();
                setData(data);
                localStorage.setItem("data", data);
                setHeader(Object.keys(data[0]));
            } else {
                console.error("Error retrieving user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
        }
    };
    useEffect(() => {
        getData();
        //const data = localStorage.getItem("data");
    }, []);

    useEffect(() => {
        getData();
        //const data = localStorage.getItem("data");
    }, [localStorage.getItem("table")]);


    return (
        <div className="table-container">
            <table id="editableTable">
                <thead>
                <tr>
                    {header.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((item, dataIndex) => (
                    <tr key={dataIndex}>
                        {header.map((headerName, index) => (
                            <td key={index} contentEditable onBlur={(e) => handleEdit(dataIndex, headerName.toLowerCase(), e.target.innerText)}>
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

