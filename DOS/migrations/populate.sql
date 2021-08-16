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
1	1	USR-R	Read User data
2	1	USR-U	Update/Create User data
3	1	USR-D	Delete User data
4	2	TIE-R	Read Tie-Down Equipment data
5	2	TIE-U	Update/Create Tie-Down Equipment data
6	2	TIE-D	Delete Tie-Down Equipment data
7	3	REP-R	Take a look at reports
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
