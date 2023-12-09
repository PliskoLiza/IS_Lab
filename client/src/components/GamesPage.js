import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';

import '../css/stack.css';

export default function GamePage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await fetch('/api/games');
            const data = await response.json();
            setGames(data.games);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    console.log(games);

    return (
        <div>
            {games.map((game) => (
                <Link key={game.id} to={`/game/${game.id}`} className="card">
                    <img
                        src={game.poster_link}
                        alt="Game Poster"
                    />
                    <div className="card-content">
                        <h2>{game.title}</h2>
                        <p>{game.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
