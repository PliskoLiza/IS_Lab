import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import "../css/admin.css";
import EditableTable from "./Table";

export default function AdminPage() {
    return (
        <div>
            {EditableTable()}
        </div>
    );
}
