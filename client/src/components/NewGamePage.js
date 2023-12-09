import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import '../css/upload.css'

export default function NewGame() {
    const textareaRef = useRef(null);
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const [title, setTitle] = useState("");
    const [teamName, setTeamName] = useState("");
    const [posterLink, setPosterLink] = useState("");
    const [downloadLink, setDownloadLink] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [developers, setDevelopers] = useState([user?.email]);
    const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDeveloperChange = (e, index) => {
        const updatedDevelopers = [...developers];
        updatedDevelopers[index] = e.target.value;
        setDevelopers(updatedDevelopers);
    };

    const handleAddDeveloper = () => {
        setDevelopers([...developers, ""]);
    };

    const handleRemoveDeveloper = (index) => {
        const updatedDevelopers = [...developers];
        updatedDevelopers.splice(index, 1);
        setDevelopers(updatedDevelopers);
    }

    const handleReleaseYearChange = (e) => {
        setReleaseYear(e.target.value);
    };

    const handlePosterLinkChange = (e) => {
        setPosterLink(e.target.value);
    };

    const handleDownloadLinkChange = (e) => {
        setDownloadLink(e.target.value);
    };

    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setGameDescription(e.target.value);

        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;    
    };


    const getNumberOfRows = () => {
        if (!gameDescription) {
            return 1;
        }
        return gameDescription.split("\n").length + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title.trim() === "") {
            alert("Please enter a title.");
            return;
        }

        try {
            const game = {
                title,
                teamName,
                developers,
                releaseYear,
                posterLink,
                downloadLink,
                gameDescription
            };

            const response = await fetch("/api/add_game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(game),
            });

            if (response.status === 201) {
                alert("Game created successfully.");
                navigate("/");
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            console.error("Error creating game:", error);
            alert("Error creating game. Please try again later.");
        }
    };

    return (
        <div className="upload-page">
            <h2>Upload New Game</h2>
            <form onSubmit={handleSubmit}>
                <div className="upload-container">
                    <div className="upload-details">
                        <label>Title:</label>
                        <input type="text" value={title} onChange={handleTitleChange} required />
                    </div>
                    <div className="upload-details">
                        <label>Team name:</label>
                        <input type="text" value={teamName} onChange={handleTeamNameChange} />
                    </div>
                    <div className="upload-details">
                        <label>Developers:</label>
                        {developers.map((developer, index) => (
                            <div key={index} className="developer-input">
                                <input
                                    type="text"
                                    value={developer}
                                    onChange={(e) => handleDeveloperChange(e, index)}
                                    required
                                />
                                {index >= 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDeveloper(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddDeveloper}>
                            Add Developer
                        </button>
                    </div>
                    <div className="upload-details">
                        <label>Release Year:</label>
                        <input
                            type="number"
                            value={releaseYear}
                            onChange={handleReleaseYearChange}
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>
                    <div className="upload-details">
                        <label>Poster Link:</label>
                        <input type="text" value={posterLink} onChange={handlePosterLinkChange} />
                        {posterLink.length > 0 && <img src={posterLink} alt="Profile" /> }
                    </div>
                    <div className="upload-details">
                        <label>Download Link:</label>
                        <input type="text" value={downloadLink} onChange={handleDownloadLinkChange} />
                    </div>
                    <div className="upload-details">
                        <label>Description:</label>
                        <textarea
                            ref={textareaRef}
                            value={gameDescription}
                            onChange={handleDescriptionChange}
                            rows={getNumberOfRows()}
                            style={{ whiteSpace: "pre-wrap" }}
                        />
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
