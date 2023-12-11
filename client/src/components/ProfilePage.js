import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./AuthContext";

import '../css/profile.css';
import {useNavigate} from "react-router-dom";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [regiment, setRegiment] = useState(null);
  const [error, setError] = useState("");


  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/profile/get/${user.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setRegiment(data.regiment || "");
        setRole(data.role || "");
      } else {
        console.error("Error retrieving user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-image">
          <img src="https://source.unsplash.com/random/1920x1080/?self-care" alt="Profile" />
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
            <span>Role: {role}</span>
          </div>
          <div>
            <span>Regiment: {regiment}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
