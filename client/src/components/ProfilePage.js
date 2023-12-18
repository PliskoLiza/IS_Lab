import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./AuthContext";

import '../css/profile.css';

export default function ProfilePage() {
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState("");
  const [userWhatCanDoData, setUserWhatCanDoData] = useState(null);


  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/profile/get/${user.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        console.log(response);
        const userData = await response.json();
        setUserData(userData);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("regiment", userData.regiment);
      } else {
        console.error("Error retrieving user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };


  const fetchUserWhatCanDoData = async () => {
    try {
      const response = await fetch(`/api/users/whatcando?userId=${user.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        const userWhatCanDoData = await response.json();
        setUserWhatCanDoData(userWhatCanDoData);
      } else {
        console.error("Error retrieving user permissions data:", response.statusText);
      }
    } catch (error) {
      console.error("Error retrieving user permissions data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserWhatCanDoData();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-image">
          <img src="https://source.unsplash.com/random/?Army" alt="Profile" />
        </div>
        <div className="profile-details">
          <h2>About</h2>
          <div>
            <span>email: {user.email}</span>
          </div>
          <div>
            <span>id: {user.userId}</span>
          </div>
          <div>
            <span>Role: {userData.role || "Not listed" }</span>
          </div>
          <div>
            <span>Regiment: {userData.regiment || "Not listed"}</span>
          </div>
        </div>
      </div>

      <div className="user-permissions">
        <h2>User Permissions</h2>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {userWhatCanDoData && userWhatCanDoData.map((action, index) => (
              <tr key={index}>
                <td>{action.name}</td>
                <td>{action.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
