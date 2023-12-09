import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "../css/game.css";

export default function GamePage() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [devsData, setDevsData] = useState(null);

  useEffect(() => {
    fetchGameDetails();
    resetScrollPosition();
  }, []);

  const resetScrollPosition = () => {
    window.scrollTo(0, 0);
    console.log("Scroll performed");
  };

  const fetchGameDetails = async () => {
    try {
      const response = await fetch(`/api/games/${id}`);
      const data = await response.json();

      const developersResponse = await fetch(`/api/game-devs/${id}`);
      const developersData = await developersResponse.json();

      setGameData(data);
      setDevsData(developersData);

    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  };

  const handlePlayGame = () => {
    if (download_link) {
      window.open(download_link, "_blank");
    }
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  const { title, description, team, release_year, poster_link, download_link } = gameData;

  console.log(gameData);
  console.log(devsData);

  return (
    <div className="game-page" >
      <h2 className="title" >{title}</h2>

      <div className="game-info">
        <div className="left-column">
          <img src={poster_link} alt="Game Image" />
          <div className="description">
            <h3>Game Description</h3>
            <p>{description}</p>
          </div>
        </div>

        <div className="highlighted-column">
          <h3>Game Details</h3>
          <ul>
            <li>Team: {team}</li>
            <li>Release Date: {release_year}</li>
            <li> Developers:
              {devsData.map((developer) => (
                <div className="dev-item">
                  <Link to={`/profile/${developer.email}`} key={developer.id}>
                    {developer.email}
                  </Link>
                </div>
              ))}
            </li>

          </ul>
          <button onClick={handlePlayGame}>Play Game</button>
        </div>
      </div>
    </div>
  );
}
