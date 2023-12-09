import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../css/profile.css";

export default function GuestProfilePage() {
  const { email } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: { email } }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          throw new Error("Error retrieving user data");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, [email]);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-image">
          <img src="https://source.unsplash.com/random/1920x1080/?self-care" alt="Profile" />
        </div>
        <div className="profile-details">
          <h1>{userData && userData.email ? userData.email : ""}</h1>
          <h2>About me</h2>
          <span>Name: {userData && userData.name ? userData.name : ""}</span>
          <span>Age: {userData && userData.age ? userData.age : ""}</span>

          <h2>About me</h2>
          <p>{userData && userData.about_me ? userData.about_me : ""}</p>
        </div>
      </div>
    </div>
  );
}
