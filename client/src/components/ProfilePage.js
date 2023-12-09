import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./AuthContext";

import '../css/profile.css';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const textareaRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { email: user.email } }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setAge(data.age || "");
        setName(data.name || "");
        setAboutMe(data.about_me || "");
      } else {
        console.error("Error retrieving user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user.email]);

  const [age, setAge] = useState(userData && userData.age ? userData.age : "");
  const [name, setName] = useState(userData && userData.name ? userData.name : "");
  const [aboutMe, setAboutMe] = useState(userData && userData.about_me ? userData.about_me : "");

  const [editAge, setEditAge] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editAboutMe, setEditAboutMe] = useState(false);


  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleAboutMeChange = (e) => {
    setAboutMe(e.target.value);

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleEditName = () => {
    setEditName(true);
  };

  const handleEditAge = () => {
    setEditAge(true);
  };

  const handleEditAboutMe = () => {
    setEditAboutMe(true);
  };

  const handleCancelEditName = () => {
    setEditName(false);
    setName(userData.name || "");
  };

  const handleCancelEditAge = () => {
    setEditAge(false);
    setAge(userData.age || "");
  };

  const handleCancelEditAboutMe = () => {
    setEditAboutMe(false);
    setAboutMe(userData.about_me || "")
  };

  const handleSaveField = async (field, value, json_field, setEditField) => {
    // Make a POST request to save the updated field
    try {
      const response = await fetch(`/api/profile/update${field}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: user.email, [json_field]: value })
      });
  
      if (response.ok) {
        setEditField(false);
        await fetchUserData(); // Fetch updated user data after saving the changes
      } else {
        console.error(`Error saving ${field}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
    }
  };
  
  // Usage example:
  const handleSaveName = async () => {
    await handleSaveField('Name', name, 'name', setEditName);
  };
  
  const handleSaveAge = async () => {
    await handleSaveField('Age', age, 'age', setEditAge);
  };

  const handleSaveAboutMe = async () => {
    await handleSaveField('AboutMe', aboutMe, 'about_me', setEditAboutMe);
  };
  // console.log(age);
  // console.log(name);
  // console.log(aboutMe);
  // console.log(userData);

  const getNumberOfRows = () => {
    if (!aboutMe) {
      return 1;
    }
    return aboutMe.split("\n").length + 1;
  };


  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-image">
          <img src="https://source.unsplash.com/random/1920x1080/?self-care" alt="Profile" />
        </div>
        <div className="profile-details">
          <h1>{user.email}</h1>
          <h2>About me</h2>
          {editName ? (
            <div>
              <input type="text" value={name} onChange={handleNameChange} />
              <button onClick={handleSaveName}>Save</button>
              <button onClick={handleCancelEditName}>Cancel</button>
            </div>
          ) : (
            <div>
            <span>Name: {userData && userData.name ? userData.name : ""}</span>
              <button onClick={handleEditName}>Edit</button>
            </div>
          )}

          {editAge ? (
            <div>
              <input type="number" value={age} onChange={handleAgeChange} />
              <button onClick={handleSaveAge}>Save</button>
              <button onClick={handleCancelEditAge}>Cancel</button>
            </div>
          ) : (
            <div>
            <span>Age: {userData && userData.age ? userData.age : ""}</span>
              <button onClick={handleEditAge}>Edit</button>
            </div>
          )}

          <h2>About me</h2>
          {editAboutMe ? (
            <div>
              <textarea
                ref={textareaRef}
                value={aboutMe}
                onChange={handleAboutMeChange}
                rows={getNumberOfRows()}
                style={{ whiteSpace: "pre-wrap" }}
              />
              <button onClick={handleSaveAboutMe}>Save</button>
              <button onClick={handleCancelEditAboutMe}>Cancel</button>
            </div>
          ) : (
            <div>
            <p>{userData && userData.about_me ? userData.about_me : ""}</p>
              <button onClick={handleEditAboutMe}>Edit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
