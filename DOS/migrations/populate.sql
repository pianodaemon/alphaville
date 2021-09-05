--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

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
-- Data for Name: apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apps (id, title) FROM stdin;
1	USUARIOS
3	REPORTES
2	EQUIPO DE AMARRE
\.


--
-- Data for Name: authorities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authorities (id, app_id, code, title) FROM stdin;
1	1	USU-L	Leer datos de Usuario
2	1	USU-A	Actualizar/Crear datos de Usuario
3	1	USU-E	Eliminar Datos de Usuario
4	2	EQA-L	Leer datos de Equipo de amarre
5	2	EQA-A	Actualizar/Crear datos de Equipo de amarre
6	2	EQA-E	Eliminar datos de Equipo de amarre
7	3	REP-L	Visualizar reportes
\.


--
-- Data for Name: carriers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carriers (id, code, title, disabled, last_touch_time, creation_time, blocked) FROM stdin;
\.


--
-- Data for Name: equipments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipments (id, code, title, unit_cost, regular, last_touch_time, creation_time, blocked) FROM stdin;
1	LONA001	LONAS	6000.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
2	CADE001	CADENAS	1300.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
3	GATA001	GATAS	1820.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
4	BAND001	BANDAS 4"	820.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
5	BAND002	BANDAS 2"	650.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
6	WINC001	WINCHE UNIVERSAL	550.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
7	BARR001	BARROTES 4X4	800.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
8	BARR002	BARROTES 6X6	900.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
9	BASE001	BASES STD	550.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
10	HULE001	HULES	550.00	t	2021-09-02 17:47:40.597295-05	2021-09-02 17:47:40.597295-05	f
\.


--
-- Data for Name: patios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patios (id, code, title, last_touch_time, creation_time, blocked) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, title) FROM stdin;
1	Director General
2	Director
3	Gerente
4	Jefe
5	Intercambista
6	Operador
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, code, title, last_touch_time, creation_time, blocked) FROM stdin;
1	IT-450	1	2021-08-22 18:03:37.871431-05	2021-08-22 18:03:37.871431-05	f
2	D1-247	2	2021-08-22 18:04:48.01237-05	2021-08-22 18:04:48.01237-05	f
3	D1-150	3	2021-08-22 18:04:48.01237-05	2021-08-22 18:04:48.01237-05	f
4	D1-181	4	2021-08-22 18:04:48.01237-05	2021-08-22 18:04:48.01237-05	f
5	D1-205	5	2021-08-22 18:04:48.01237-05	2021-08-22 18:04:48.01237-05	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, passwd, role_id, disabled, first_name, last_name, last_touch_time, creation_time, blocked) FROM stdin;
1	admin	123qwe	2	f	Ricardo	Baeza	2021-08-17 23:13:00.518181-05	2021-08-17 23:12:01.622645-05	f
\.


--
-- Data for Name: users_authorities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_authorities (user_id, authority_id) FROM stdin;
1	2
\.


--
-- Name: apps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.apps_id_seq', 3, true);


--
-- Name: authorities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authorities_id_seq', 7, true);


--
-- Name: carriers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carriers_id_seq', 1, false);


--
-- Name: equipments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipments_id_seq', 10, true);


--
-- Name: patios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patios_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.units_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

