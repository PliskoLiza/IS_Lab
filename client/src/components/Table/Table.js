import React, { useEffect, useState } from 'react';
import '../../css/table.css';

const Table = ({ data, headers, title }) => (
    <div className='table-container' >
        <h3>{title}</h3>
        <table>
            <thead>
                <tr>
                    {headers.map((header, index) => <th key={index}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        {headers.map((header, index) => <td key={index}>{item[header]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Table;
