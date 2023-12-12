import React, {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css';
import EditableTable from "./Table";
import {AuthContext} from "./AuthContext";

  const MainPage = () => {
    const [answers, setAnswers] = useState(['', '', '']); // Состояние ответов, начальное значение для трех форм
       const { user } = useContext(AuthContext);
      const [userData, setUserData] = useState(null);
      const [role, setRole] = useState(null);
      const [regiment, setRegiment] = useState(null);

      const [formType, setFormType] = useState(localStorage.getItem("table") || "");
    const handleInputChange = (index, value) => {
      const updatedAnswers = [...answers];
      updatedAnswers[index] = value;
      setAnswers(updatedAnswers);
    };

      const fetchUserData = async () => {
          try {
              const response = await fetch(`/api/profile/get/${user.userId}`, {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  }
              });
              if (response.ok) {
                  const userData = await response.json();
                  setUserData(userData);
                  setRegiment(userData.regiment || ""); // Устанавливаем regiment в state
                  localStorage.setItem("regiment", JSON.stringify(regiment));
                  setRole(userData.role || "");
                  localStorage.setItem("role", JSON.stringify(role));
              } else {
                  console.error("Error retrieving user data:", response.statusText);
              }
          } catch (error) {
              console.error("Error retrieving user data:", error);
          }
      };

      useEffect(() => {
          if (localStorage.getItem("table")) {
              setFormType(localStorage.getItem("table"));
          }
          fetchUserData();
      }, []);

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Ответы:', answers);
      // Добавьте здесь логику отправки ответов на сервер или их обработки
    };


    const handleSelectChange = (event) => {
        const newformType = event.target.value;
      setFormType(newformType);
      localStorage.setItem("table", newformType);
      console.log(localStorage.getItem("table"));
   //   callTable();
    };

    const renderChoice = () => {
        if (role === 'Commander') {
            return(
                <select value={formType} onChange={handleSelectChange}>
                    <option value="">Choice table</option>
                    <option value="users">Users</option>
                    <option value="entity">Entity</option>
                    <option value="permissions">Permissions</option>
                </select>
                );

        } else {
            return(
                <select value={formType} onChange={handleSelectChange}>
                    <option value="">Choice table</option>
                    <option value="entity">Entity</option>
                    <option value="permissions">Permissions</option>
                    <option value="regiment">Regiment</option>
                    <option value="roles">Roles</option>
                    <option value="users">Users</option>
                    <option value="ent_per_regiment_cur">Entity per regiment current</option>
                    <option value="ent_per_regiment_req">Entity per regiment required</option>
                    <option value="role_to_permissions">Role to permissions</option>
                    <option value="user_to_regiment">User to regiment</option>
                </select>
            );
        }
    };

    const callTable = () =>{
        return(
            <EditableTable user = {user} table = {localStorage.getItem("table")}/>
        );
    }

    useEffect(() => {
        callTable();
        }, [formType]);

    return (
        <div>
            <h1>Choice table</h1>
            {renderChoice()}
            {callTable()}
        </div>
    );
  };
export default MainPage;