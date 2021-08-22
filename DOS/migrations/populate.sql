--
-- Data for Name: apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apps (id, title) FROM stdin;
1	USERS
3	REPORTING
2	TIE-DOWN-EQUIPMENT
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
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);
