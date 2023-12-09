--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8
-- Dumped by pg_dump version 15.2

-- Started on 2023-06-04 22:05:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16394)
-- Name: data; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA data;


--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3335 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 24587)
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    id integer NOT NULL,
    title character varying(255),
    release_year integer,
    team character varying(255),
    description text,
    price numeric(10,2),
    poster_link character varying(255) NOT NULL,
    download_link character varying(255)
);


--
-- TOC entry 213 (class 1259 OID 24586)
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3336 (class 0 OID 0)
-- Dependencies: 213
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- TOC entry 212 (class 1259 OID 16403)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    age integer,
    name character varying(255),
    last_name character varying(255),
    about_me text
);


--
-- TOC entry 215 (class 1259 OID 24595)
-- Name: users_games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_games (
    game_id integer NOT NULL,
    user_id integer NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 16402)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3337 (class 0 OID 0)
-- Dependencies: 211
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3176 (class 2604 OID 24590)
-- Name: games id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- TOC entry 3175 (class 2604 OID 16406)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3327 (class 0 OID 24587)
-- Dependencies: 214
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.games (id, title, release_year, team, description, price, poster_link, download_link) FROM stdin;
33	The Witcher 3: Wild Hunt	2023	CDProject Red	The Witcher 3: Wild Hunt is a 2015 action role-playing game developed and published by CD Projekt. It is the sequel to the 2011 game The Witcher 2: Assassins of Kings and the third game in The Witcher video game series, played in an open world with a third-person perspective. The games follow The Witcher series of fantasy novels written by Andrzej Sapkowski.\n\nThe game takes place in a fictional fantasy world based on Slavic mythology. Players control Geralt of Rivia, a monster slayer for hire known as a Witcher, and search for his adopted daughter, who is on the run from the otherworldly Wild Hunt. Players battle the game's many dangers with weapons and magic, interact with non-player characters, and complete quests to acquire experience points and gold, which are used to increase Geralt's abilities and purchase equipment. The game's story has three possible endings, determined by the player's choices at key points in the narrative.\n\n	\N	https://www.overclockers.ua/video/witcher-3-test-2/01-the-witcher-3-wild-hunt-new-test.jpg	https://www.overclockers.ua/video/witcher-3-test-2/01-the-witcher-3-wild-hunt-new-test.jpg
36	Cyberpunk 2077	2020	CD Projekt Red	Cyberpunk 2077 is a 2020 action role-playing video game developed by CD Projekt Red and published by CD Projekt. Taking place in Night City, an open world set in the Cyberpunk universe, players assume the role of a customisable mercenary known as V, who can acquire skills in hacking and machinery with options for melee and ranged combat. The main story follows V's struggle as they deal with a mysterious cybernetic implant that threatens to overwrite their body with the personality and memories of a deceased celebrity only perceived by V; the two must work together to be separated and save V's life.\n\n	\N	https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/bxSj4jO0KBqUgAbH3zuNjCje.jpg	https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/bxSj4jO0KBqUgAbH3zuNjCje.jpg
39	RED DEAD REDEMPTION II	2018	ROCKSTAR	Red Dead Redemption 2 is a 2018 action-adventure game developed and published by Rockstar Games. The game is the third entry in the Red Dead series and a prequel to the 2010 game Red Dead Redemption. The story is set in a fictionalized representation of the United States in 1899 and follows the exploits of outlaw Arthur Morgan, a member of the Van der Linde gang, who must deal with the decline of the Wild West whilst attempting to survive against government forces, rival gangs, and other adversaries. The game is presented through first- and third-person perspectives, and the player may freely roam in its interactive open world. Gameplay elements include shootouts, robberies, hunting, horseback riding, interacting with non-player characters, and maintaining the character's honor rating through moral choices and deeds. A bounty system governs the response of law enforcement and bounty hunters to crimes committed by the player.\n\n	\N	https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg?t=1671485009	https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg?t=1671485009
41	Elden Ring	2022	FromSoftware	Just pain	\N	https://image.api.playstation.com/vulcan/ap/rnd/202108/0410/2odx6gpsgR6qQ16YZ7YkEt2B.png	https://image.api.playstation.com/vulcan/ap/rnd/202108/0410/2odx6gpsgR6qQ16YZ7YkEt2B.png
42	2 devs game	2023	2 bit studio	2 bros	\N	https://static1.squarespace.com/static/6010abba780628040ee8db6d/t/60139f03e917a1034677593c/1673840009105/	https://static1.squarespace.com/static/6010abba780628040ee8db6d/t/60139f03e917a1034677593c/1673840009105/
\.


--
-- TOC entry 3325 (class 0 OID 16403)
-- Dependencies: 212
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, age, name, last_name, about_me) FROM stdin;
1	user1@example.com	password1	25	John	Doe	\N
2	user2@example.com	password2	30	Jane	Smith	\N
3	user3@example.com	password3	28	Michael	Johnson	\N
4	user4@example.com	password4	32	Emily	Williams	\N
5	user5@example.com	password5	27	David	Brown	\N
6	user6@example.com	password6	29	Olivia	Jones	\N
7	user7@example.com	password7	31	Daniel	Taylor	\N
8	user8@example.com	password8	26	Sophia	Davis	\N
9	user9@example.com	password9	33	Alexander	Miller	\N
10	user10@example.com	password10	24	Ava	Wilson	\N
12	test@gmail.com	test	\N	\N	\N	\N
29	asd@a	12345	\N	\N	\N	\N
28	Retro53@test	nonadmin	50	The rope	\N	I killed Sadam Hussein\nLul :)
27	Retro52	admin	100	Saddam Hussein Abd al-Majid al-Tikriti	\N	Hi\nMy name is Anton\nHere is a link to my resume: retro52.github.io\n\nJust text:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis justo ac ligula hendrerit semper. Sed aliquet fermentum felis, eget ullamcorper odio imperdiet sit amet. Donec tempus eros eu dictum feugiat. Vestibulum ornare, felis quis volutpat vehicula, eros quam venenatis urna, et sodales felis magna ultricies orci. Aliquam ac ante non mauris ornare lobortis sed vel turpis. Nulla malesuada cursus magna, quis facilisis magna sollicitudin nec. Integer ac eleifend neque.\n\nPhasellus facilisis vel augue vel interdum. Donec dapibus odio vitae ex lacinia, in imperdiet nulla sodales. Vivamus quis pulvinar est. Integer a laoreet mi, vitae tincidunt erat. Pellentesque enim felis, dapibus sit amet hendrerit et, ornare vel nulla. Vivamus rhoncus, ipsum quis tincidunt maximus, ipsum erat dignissim dolor, consequat vulputate sapien nunc quis leo. Phasellus hendrerit nisi nec diam vehicula, ut mattis lacus suscipit. Donec consectetur, tortor in venenatis posuere, ipsum ipsum mattis erat, vel cursus ex nisl vel nunc. Suspendisse dignissim, ex vel pellentesque laoreet, tellus orci egestas nisl, a congue nisi urna eu magna. Ut metus quam, pharetra eget massa quis, elementum mattis turpis. Fusce imperdiet nibh tempor elit volutpat, id commodo tellus eleifend. Donec pretium sit amet orci et placerat. Cras vulputate, dui ut egestas consequat, sem tortor tincidunt erat, eu mollis turpis dolor id sapien.\n\n
\.


--
-- TOC entry 3328 (class 0 OID 24595)
-- Dependencies: 215
-- Data for Name: users_games; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_games (game_id, user_id) FROM stdin;
33	28
36	27
39	27
41	28
42	28
\.


--
-- TOC entry 3338 (class 0 OID 0)
-- Dependencies: 213
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.games_id_seq', 42, true);


--
-- TOC entry 3339 (class 0 OID 0)
-- Dependencies: 211
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 29, true);


--
-- TOC entry 3180 (class 2606 OID 24594)
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- TOC entry 3182 (class 2606 OID 24611)
-- Name: users_games users_games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_games
    ADD CONSTRAINT users_games_pkey PRIMARY KEY (game_id, user_id);


--
-- TOC entry 3178 (class 2606 OID 16410)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3183 (class 2606 OID 24612)
-- Name: users_games users_games_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_games
    ADD CONSTRAINT users_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- TOC entry 3184 (class 2606 OID 24605)
-- Name: users_games users_games_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_games
    ADD CONSTRAINT users_games_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3334 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2023-06-04 22:05:32

--
-- PostgreSQL database dump complete
--

