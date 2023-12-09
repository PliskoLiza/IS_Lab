CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email character varying(255) NOT NULL,
                       password character varying(255) NOT NULL,
                       age integer,
                       name character varying(255),
                       last_name character varying(255),
                       about_me text
);

CREATE TABLE games (
                       id SERIAL PRIMARY KEY,
                       title character varying(255),
                       release_year integer,
                       team character varying(255),
                       description text,
                       price numeric(10,2),
                       poster_link character varying(255) NOT NULL,
                       download_link character varying(255)
);

CREATE TABLE users_games (
                             game_id integer NOT NULL,
                             user_id integer NOT NULL
);

ALTER TABLE ONLY users_games
    ADD CONSTRAINT users_games_pkey PRIMARY KEY (game_id, user_id);