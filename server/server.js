const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config({ debug: true, override: false }); // Load environment variables from .env file

const app = express();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(bodyParser.json());

app.get("/api", (req, res) => {
    pool.query('SELECT * FROM users', (error, result) => {
        if (error) {
            console.error('Error retrieving users from the database:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(result.rows);
        }
    });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        if (error) {
            console.error('Error retrieving user from the database:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const user = result.rows[0];
            if (user && user.password === password) {
                res.json({ success: true, email: user.email });
            } else {
                res.status(401).json({ error: "Invalid email or password" });
            }
        }
    });
});

app.post("/api/register", (req, res) => {
    const { email, password } = req.body;

    pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, password],
        (error, result) => {
            if (error) {
                console.error('Error registering user:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Registration successful' });
            }
        }
    );
});

app.post("/api/profile", (req, res) => {
    const { email } = req.body.user; // Access email property from req.body.user
    console.log(req.body);
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        if (error) {
            console.error('Error retrieving user from the database:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(result.rows[0]);
        }
    });
});

app.post("/api/profile/updateName", (req, res) => {
    const { email, name } = req.body;
    console.log(email, name, req.body);
    // Perform validation checks if required

    // Update the name in the database
    pool.query('UPDATE users SET name = $1 WHERE email = $2', [name, email], (error, result) => {
        if (error) {
            console.error('Error updating name:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ success: true });
        }
    });
});

app.post("/api/profile/updateAge", (req, res) => {
    const { email, age } = req.body;
    console.log(email, age);
    // Perform validation checks if required

    // Update the age in the database
    pool.query('UPDATE users SET age = $1 WHERE email = $2', [age, email], (error, result) => {
        if (error) {
            console.error('Error updating age:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ success: true });
        }
    });
});

app.post("/api/profile/updateAboutMe", (req, res) => {
    const { email, about_me } = req.body;

    pool.query('UPDATE users SET about_me = $1 WHERE email = $2', [about_me, email], (error, result) => {
        if (error) {
            console.error('Error updating About Me:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/api/games', (req, res) => {
    const limit = 10; // Number of games to fetch
    const query = 'SELECT * FROM games LIMIT $1';
    const values = [limit];

    // Execute the SQL query
    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const games = result.rows;
            res.json({ games });
        }
    });
});

app.get('/api/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const query = 'SELECT * FROM games WHERE id = $1';
    const values = [gameId];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error fetching game details:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const game = result.rows[0];
            if (!game) {
                res.status(404).json({ error: 'Game not found' });
            } else {
                res.json(game);
            }
        }
    });
});

// Insert the new game into the games table
app.post("/api/add_game", (req, res) => {
    const {
        title,
        teamName,
        developers,
        releaseYear,
        posterLink,
        downloadLink,
        gameDescription
    } = req.body;

    // Perform any validation or additional processing as needed

    // Insert the new game into the games table
    pool.query(
        "INSERT INTO games (title, team, release_year, poster_link, download_link, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [title, teamName, releaseYear, posterLink, downloadLink, gameDescription],
        (error, result) => {
            if (error) {
                console.error("Error creating game:", error);
                res.status(500).json({ error: "Internal server error" });
                return;
            }

            const gameId = result.rows[0].id;

            // Begin a transaction
            pool.query("BEGIN", (error) => {
                if (error) {
                    console.error("Error starting transaction:", error);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }

                // Create an array of promises for retrieving user_id for each developer email
                const fetchUserIdPromises = developers.map((developer) => {
                    return new Promise((resolve, reject) => {
                        pool.query(
                            "SELECT id FROM users WHERE email = $1",
                            [developer],
                            (error, result) => {
                                if (error) {
                                    console.error("Error retrieving user_id for developer:", error);
                                    reject(error);
                                } else if (result.rows.length === 0) {
                                    console.error(`Developer with email ${developer} not found.`);
                                    reject(new Error(`Developer with email ${developer} not found.`));
                                } else {
                                    resolve(result.rows[0].id);
                                }
                            }
                        );
                    });
                });

                // Retrieve all user_ids in parallel using Promise.all
                Promise.all(fetchUserIdPromises)
                    .then((userIds) => {
                        // Create an array of promises for inserting into users_games table
                        const insertUserGamePromises = userIds.map((userId) => {
                            return new Promise((resolve, reject) => {
                                pool.query(
                                    "INSERT INTO users_games (game_id, user_id) VALUES ($1, $2)",
                                    [gameId, userId],
                                    (error) => {
                                        if (error) {
                                            console.error("Error inserting into users_games:", error);
                                            reject(error);
                                        } else {
                                            resolve();
                                        }
                                    }
                                );
                            });
                        });

                        // Insert all user_games in parallel using Promise.all
                        return Promise.all(insertUserGamePromises);
                    })
                    .then(() => {
                        // Commit the transaction
                        pool.query("COMMIT", (commitError) => {
                            if (commitError) {
                                console.error("Error committing transaction:", commitError);
                                res.status(500).json({ error: "Internal server error" });
                            } else {
                                res.status(201).json({ success: true });
                            }
                        });
                    })
                    .catch((error) => {
                        // Rollback the transaction on error
                        pool.query("ROLLBACK", (rollbackError) => {
                            if (rollbackError) {
                                console.error("Error rolling back transaction")
                            }
                            res.status(500).json({ error: "Internal server error" });
                        });
                    });
            });
        });
});

app.get("/api/game-devs/:id", (req, res) => {
    const gameId = req.params.id;

    pool.query(
        "SELECT users.id, users.email FROM users JOIN users_games ON users.id = users_games.user_id WHERE users_games.game_id = $1",
        [gameId],
        (error, result) => {
            if (error) {
                console.error("Error retrieving developers:", error);
                res.status(500).json({ error: "Internal server error" });
            } else {
                const developers = result.rows;
                res.json(developers);
            }
        }
    );
});

app.get('/api/games/random/:count', async (req, res) => {
    const { count } = req.params;

    try {
        const response = await pool.query('SELECT * FROM games ORDER BY random() LIMIT $1', [count]);
        const randomGames = response.rows;
        res.json(randomGames);
    } catch (error) {
        console.error('Error fetching random games:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});
