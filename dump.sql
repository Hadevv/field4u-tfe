--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: Field4u_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "Field4u_owner";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: Field4u_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AgendaStatus; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."AgendaStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public."AgendaStatus" OWNER TO "Field4u_owner";

--
-- Name: CropCategory; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."CropCategory" AS ENUM (
    'VEGETABLE',
    'FRUIT'
);


ALTER TYPE public."CropCategory" OWNER TO "Field4u_owner";

--
-- Name: CropSeason; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."CropSeason" AS ENUM (
    'SPRING',
    'SUMMER',
    'FALL',
    'WINTER',
    'YEAR_ROUND'
);


ALTER TYPE public."CropSeason" OWNER TO "Field4u_owner";

--
-- Name: GleaningPeriodStatus; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."GleaningPeriodStatus" AS ENUM (
    'AVAILABLE',
    'NOT_AVAILABLE',
    'PENDING',
    'CLOSED'
);


ALTER TYPE public."GleaningPeriodStatus" OWNER TO "Field4u_owner";

--
-- Name: GleaningStatus; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."GleaningStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."GleaningStatus" OWNER TO "Field4u_owner";

--
-- Name: Language; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."Language" AS ENUM (
    'ENGLISH',
    'FRENCH',
    'DUTCH'
);


ALTER TYPE public."Language" OWNER TO "Field4u_owner";

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."NotificationType" AS ENUM (
    'NEW_ANNOUNCEMENT',
    'RESERVATION_REQUEST',
    'FIELD_UPDATED',
    'GLEANING_ACCEPTED'
);


ALTER TYPE public."NotificationType" OWNER TO "Field4u_owner";

--
-- Name: ParticipationStatus; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."ParticipationStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'ATTENDED',
    'NO_SHOW'
);


ALTER TYPE public."ParticipationStatus" OWNER TO "Field4u_owner";

--
-- Name: UserPlan; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."UserPlan" AS ENUM (
    'FREE',
    'PREMIUM'
);


ALTER TYPE public."UserPlan" OWNER TO "Field4u_owner";

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: Field4u_owner
--

CREATE TYPE public."UserRole" AS ENUM (
    'FARMER',
    'GLEANER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO "Field4u_owner";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "Field4u_owner";

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refreshTokenExpiresIn" text,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO "Field4u_owner";

--
-- Name: agendas; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.agendas (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    status public."AgendaStatus" DEFAULT 'PENDING'::public."AgendaStatus" NOT NULL,
    announcement_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    notification_id text,
    start_date timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.agendas OWNER TO "Field4u_owner";

--
-- Name: announcement_gleaning_periods; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.announcement_gleaning_periods (
    announcement_id text NOT NULL,
    gleaning_period_id text NOT NULL
);


ALTER TABLE public.announcement_gleaning_periods OWNER TO "Field4u_owner";

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    crop_type_id text NOT NULL,
    field_id text NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    owner_id text NOT NULL,
    quantity_available integer,
    updated_at timestamp(3) without time zone NOT NULL,
    images text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.announcements OWNER TO "Field4u_owner";

--
-- Name: comments; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.comments (
    id text NOT NULL,
    content text NOT NULL,
    announcement_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.comments OWNER TO "Field4u_owner";

--
-- Name: crop_types; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.crop_types (
    id text NOT NULL,
    name text NOT NULL,
    season public."CropSeason" NOT NULL,
    category public."CropCategory" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.crop_types OWNER TO "Field4u_owner";

--
-- Name: farms; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.farms (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    city text,
    latitude double precision,
    longitude double precision,
    postal_code text,
    contact_info text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    owner_id text NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.farms OWNER TO "Field4u_owner";

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.favorites (
    id text NOT NULL,
    announcement_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.favorites OWNER TO "Field4u_owner";

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.feedbacks (
    id text NOT NULL,
    message text NOT NULL,
    email text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text
);


ALTER TABLE public.feedbacks OWNER TO "Field4u_owner";

--
-- Name: fields; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.fields (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    city text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    postal_code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    crop_type_id text NOT NULL,
    farm_id text,
    is_available boolean DEFAULT true NOT NULL,
    owner_id text,
    qr_code_url text,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.fields OWNER TO "Field4u_owner";

--
-- Name: gleaning_participations; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.gleaning_participations (
    gleaning_id text NOT NULL,
    participation_id text NOT NULL
);


ALTER TABLE public.gleaning_participations OWNER TO "Field4u_owner";

--
-- Name: gleaning_periods; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.gleaning_periods (
    id text NOT NULL,
    field_id text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    status public."GleaningPeriodStatus" DEFAULT 'AVAILABLE'::public."GleaningPeriodStatus" NOT NULL
);


ALTER TABLE public.gleaning_periods OWNER TO "Field4u_owner";

--
-- Name: gleanings; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.gleanings (
    id text NOT NULL,
    user_id text NOT NULL,
    announcement_id text NOT NULL,
    status public."GleaningStatus" DEFAULT 'PENDING'::public."GleaningStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.gleanings OWNER TO "Field4u_owner";

--
-- Name: likes; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.likes (
    id text NOT NULL,
    announcement_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.likes OWNER TO "Field4u_owner";

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    type public."NotificationType" NOT NULL,
    message text NOT NULL,
    agenda_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.notifications OWNER TO "Field4u_owner";

--
-- Name: participations; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.participations (
    id text NOT NULL,
    status public."ParticipationStatus" DEFAULT 'CONFIRMED'::public."ParticipationStatus" NOT NULL,
    announcement_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.participations OWNER TO "Field4u_owner";

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    rating integer NOT NULL,
    content text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gleaning_id text NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text NOT NULL,
    images text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.reviews OWNER TO "Field4u_owner";

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    session_token text NOT NULL,
    user_id text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessions OWNER TO "Field4u_owner";

--
-- Name: statistics; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.statistics (
    id text NOT NULL,
    last_updated timestamp(3) without time zone NOT NULL,
    total_announcements integer DEFAULT 0 NOT NULL,
    total_fields integer DEFAULT 0 NOT NULL,
    total_food_saved double precision DEFAULT 0 NOT NULL,
    user_id text NOT NULL,
    total_gleanings integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.statistics OWNER TO "Field4u_owner";

--
-- Name: users; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    image text,
    bio text,
    plan public."UserPlan" DEFAULT 'FREE'::public."UserPlan" NOT NULL,
    role public."UserRole" DEFAULT 'GLEANER'::public."UserRole" NOT NULL,
    language public."Language" DEFAULT 'FRENCH'::public."Language" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp(3) without time zone,
    email_verified timestamp(3) without time zone,
    password_hash text,
    resend_contact_id text,
    stripe_customer_id text,
    updated_at timestamp(3) without time zone NOT NULL,
    "onboardingCompleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO "Field4u_owner";

--
-- Name: verificationtokens; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.verificationtokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verificationtokens OWNER TO "Field4u_owner";

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
aab0377c-3a9f-48e2-8e77-cbf8c6366def	260d96aa75e4c54be2ff6a0b736d96e33dc6c2e206c3d262d264cd099019120b	2025-02-04 09:46:01.077976+00	20250109202716_init_field4u_db	\N	\N	2025-02-04 09:46:00.896652+00	1
cfd7c317-80ec-46ed-b796-7ea5b6ab069e	5d027e086ab0c7bbe39e4be86ce2ff388d8d3e6391d0328a7a75d09fb0c4aee1	2025-02-04 09:55:20.736228+00	20250204095520_db_normalization_update	\N	\N	2025-02-04 09:55:20.511626+00	1
9457e441-7dc3-4343-ad07-74a2aa5f8cb9	c2f899c5cc02e24f2a14c16ef9dbd796db4fd854950e77ee0719f19dbbe41628	2025-02-04 12:46:09.106535+00	20250204124608_remove_password_unique	\N	\N	2025-02-04 12:46:08.988148+00	1
5a6ba7df-3b98-4743-8385-dafdaabafb86	786bf273d0aa88d06d1a8c106682cd1b435e990e02c1b0bf7000a035ca7114dc	2025-02-08 21:16:36.18582+00	20250208211635_image_field_addition	\N	\N	2025-02-08 21:16:36.04597+00	1
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", "refreshTokenExpiresIn", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: agendas; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.agendas (id, title, description, status, announcement_id, created_at, end_date, notification_id, start_date, updated_at, user_id) FROM stdin;
ovpNzoHKSOL7Xbgq_JamW	Glanage de pommes à Gembloux	Session de glanage de l'après-midi	PENDING	pbr455LymFr8apNm1eVwY	2025-02-08 21:21:10.904	2024-10-10 15:00:00	\N	2024-10-10 12:00:00	2025-02-08 21:21:10.904	AHoQ1rBGVOfGtfOK6KV-w
I2pw4G_X_hxm9OIFfJXC7	Glanage de pommes de terre à Namur	Session de glanage du matin	CONFIRMED	jguifDL-yx8_oylx1PM_u	2025-02-08 21:21:10.904	2024-09-15 10:00:00	\N	2024-09-15 07:00:00	2025-02-08 21:21:10.904	8oGxeQPTGCiG37gSx5EWi
\.


--
-- Data for Name: announcement_gleaning_periods; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.announcement_gleaning_periods (announcement_id, gleaning_period_id) FROM stdin;
pbr455LymFr8apNm1eVwY	S4g1ac9etgJd_1vFg-MYR
jguifDL-yx8_oylx1PM_u	OBafmxL1mriAQTdQkqevb
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.announcements (id, title, slug, description, created_at, crop_type_id, field_id, is_published, owner_id, quantity_available, updated_at, images) FROM stdin;
pbr455LymFr8apNm1eVwY	Pommes à glaner	HLSa4d	Pommes non récoltées disponibles pour le glanage	2025-02-08 21:21:09.572	uvbB2hjWVbeEnh0T-p4MQ	Ks7_L1uoH_Mi46a5zD5-J	t	_3s7xb6NKwSmCtQqFOvT9	300	2025-02-08 21:21:09.572	{}
jguifDL-yx8_oylx1PM_u	Glanage de pommes de terre	TrUCLG	Venez glaner des pommes de terre bio après la récolte principale	2025-02-08 21:21:09.572	NKwCP65imOe9JP_521FqU	N_QgGk9_u3dlD5RK4gbn9	t	29Z7b5e1rgt6iBwUISCcV	500	2025-02-08 21:21:09.572	{}
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.comments (id, content, announcement_id, created_at, updated_at, user_id) FROM stdin;
GJM47xnwBGWj2ORP_ywBK	Faut-il apporter son propre matériel ?	pbr455LymFr8apNm1eVwY	2025-02-08 21:21:10.666	2025-02-08 21:21:10.666	8oGxeQPTGCiG37gSx5EWi
Z3eR3sRcd4v58lPn2XAHe	Possible de venir en fin de journée ?	pbr455LymFr8apNm1eVwY	2025-02-08 21:21:10.666	2025-02-08 21:21:10.666	AHoQ1rBGVOfGtfOK6KV-w
-EpguDAueW6i5qbcj1Xc2	Est-ce qu'il y a un parking à proximité du champ ?	jguifDL-yx8_oylx1PM_u	2025-02-08 21:21:10.666	2025-02-08 21:21:10.666	8oGxeQPTGCiG37gSx5EWi
3ISI80SIg3hKeBnzjZJIg	Quelle variété de pommes de terre est disponible ?	jguifDL-yx8_oylx1PM_u	2025-02-08 21:21:10.666	2025-02-08 21:21:10.666	AHoQ1rBGVOfGtfOK6KV-w
\.


--
-- Data for Name: crop_types; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.crop_types (id, name, season, category, created_at, updated_at) FROM stdin;
oa8oajHeBF3oQPoZOIEvO	Tomates	SUMMER	VEGETABLE	2025-02-08 21:21:09.35	2025-02-08 21:21:09.35
BZaW1dM7I7Up9Da1IXaqR	Poires	FALL	FRUIT	2025-02-08 21:21:09.35	2025-02-08 21:21:09.35
NKwCP65imOe9JP_521FqU	Pommes de terre	FALL	VEGETABLE	2025-02-08 21:21:09.349	2025-02-08 21:21:09.349
uvbB2hjWVbeEnh0T-p4MQ	Pommes	FALL	FRUIT	2025-02-08 21:21:09.35	2025-02-08 21:21:09.35
GZwBenHWEdMuBnPhxucEu	Carottes	YEAR_ROUND	VEGETABLE	2025-02-08 21:21:09.349	2025-02-08 21:21:09.349
\.


--
-- Data for Name: farms; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.farms (id, name, slug, description, city, latitude, longitude, postal_code, contact_info, created_at, owner_id, updated_at) FROM stdin;
57NM0izM5ISup60mBfttT	Ferme du Bonheur	pNEbz-	Ferme biologique familiale spécialisée dans les légumes de saison	Namur	50.4673883	4.8719854	5000	+32 123 456 789	2025-02-08 21:21:09.428	29Z7b5e1rgt6iBwUISCcV	2025-02-08 21:21:09.428
wpHxLyWxfz8GA5j_Vo-qh	Les Vergers de Pierre	XNtRdf	Vergers traditionnels de pommes et poires	Gembloux	50.5590556	4.6999974	5030	+32 987 654 321	2025-02-08 21:21:09.428	_3s7xb6NKwSmCtQqFOvT9	2025-02-08 21:21:09.428
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.favorites (id, announcement_id, created_at, user_id) FROM stdin;
TzqNQdgkAcnGmY3B54vEQ	jguifDL-yx8_oylx1PM_u	2025-02-08 21:21:10.771	8oGxeQPTGCiG37gSx5EWi
3sf0sCVK4CJCm5M_XttUn	pbr455LymFr8apNm1eVwY	2025-02-08 21:21:10.771	AHoQ1rBGVOfGtfOK6KV-w
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.feedbacks (id, message, email, created_at, updated_at, user_id) FROM stdin;
0pNmBM_jyNNhB3T_G8rPR	Suggestion : ajouter une fonction de messagerie entre agriculteurs et glaneurs	farmer.jean@example.be	2025-02-08 21:21:10.814	2025-02-08 21:21:10.814	29Z7b5e1rgt6iBwUISCcV
4FvD9pV7NrEdBAVq9hD-u	Super initiative pour réduire le gaspillage alimentaire !	visiteur@example.be	2025-02-08 21:21:10.814	2025-02-08 21:21:10.814	\N
XFrAuVnialNvFkYi7M--d	L'application est très utile pour trouver des opportunités de glanage	marie.gleaner@example.be	2025-02-08 21:21:10.814	2025-02-08 21:21:10.814	8oGxeQPTGCiG37gSx5EWi
\.


--
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.fields (id, name, slug, description, city, latitude, longitude, postal_code, created_at, crop_type_id, farm_id, is_available, owner_id, qr_code_url, updated_at) FROM stdin;
N_QgGk9_u3dlD5RK4gbn9	Champ Principal	RcDHT0	Grand champ de pommes de terre	Namur	50.4673883	4.8719854	5000	2025-02-08 21:21:09.475	NKwCP65imOe9JP_521FqU	57NM0izM5ISup60mBfttT	t	29Z7b5e1rgt6iBwUISCcV	\N	2025-02-08 21:21:09.475
Ks7_L1uoH_Mi46a5zD5-J	Verger Est	ZluKRy	Verger de pommiers	Gembloux	50.5590556	4.6999974	5030	2025-02-08 21:21:09.475	uvbB2hjWVbeEnh0T-p4MQ	wpHxLyWxfz8GA5j_Vo-qh	t	_3s7xb6NKwSmCtQqFOvT9	\N	2025-02-08 21:21:09.475
\.


--
-- Data for Name: gleaning_participations; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.gleaning_participations (gleaning_id, participation_id) FROM stdin;
djnbAoKKeMbCtN4FN1gQN	RcWmHcIfnO1Hx2Kj84Fff
dqtH9pha6Ctpf6G3XS0Ri	e3-VOyJ5ljHraHkftwDFi
\.


--
-- Data for Name: gleaning_periods; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.gleaning_periods (id, field_id, start_date, end_date, status) FROM stdin;
OBafmxL1mriAQTdQkqevb	N_QgGk9_u3dlD5RK4gbn9	2024-09-01 00:00:00	2024-09-30 00:00:00	AVAILABLE
S4g1ac9etgJd_1vFg-MYR	Ks7_L1uoH_Mi46a5zD5-J	2024-10-01 00:00:00	2024-10-31 00:00:00	AVAILABLE
\.


--
-- Data for Name: gleanings; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.gleanings (id, user_id, announcement_id, status, created_at, updated_at) FROM stdin;
djnbAoKKeMbCtN4FN1gQN	8oGxeQPTGCiG37gSx5EWi	jguifDL-yx8_oylx1PM_u	PENDING	2025-02-08 21:21:10.074	2025-02-08 21:21:10.074
dqtH9pha6Ctpf6G3XS0Ri	AHoQ1rBGVOfGtfOK6KV-w	pbr455LymFr8apNm1eVwY	PENDING	2025-02-08 21:21:10.074	2025-02-08 21:21:10.074
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.likes (id, announcement_id, created_at, user_id) FROM stdin;
HB9Mn1ncJSrMi1UkjXsWu	pbr455LymFr8apNm1eVwY	2025-02-08 21:21:10.72	8oGxeQPTGCiG37gSx5EWi
mUE65OQGvyT4iQ-t_xBIq	jguifDL-yx8_oylx1PM_u	2025-02-08 21:21:10.72	8oGxeQPTGCiG37gSx5EWi
hOViWgLBczlRzGpUbvSpL	jguifDL-yx8_oylx1PM_u	2025-02-08 21:21:10.72	AHoQ1rBGVOfGtfOK6KV-w
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.notifications (id, type, message, agenda_id, created_at, is_read, updated_at, user_id) FROM stdin;
1SsFXLJMrp_po6m_gVLMx	GLEANING_ACCEPTED	Votre demande de glanage a été acceptée	\N	2025-02-08 21:21:10.859	f	2025-02-08 21:21:10.859	AHoQ1rBGVOfGtfOK6KV-w
pBWTzS4Sfunjq-N6-rVE2	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage près de chez vous	\N	2025-02-08 21:21:10.859	f	2025-02-08 21:21:10.859	8oGxeQPTGCiG37gSx5EWi
E65RaE--l3vaBmQNuq_Sz	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-08 21:21:10.859	t	2025-02-08 21:21:10.859	29Z7b5e1rgt6iBwUISCcV
\.


--
-- Data for Name: participations; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.participations (id, status, announcement_id, created_at, user_id) FROM stdin;
e3-VOyJ5ljHraHkftwDFi	CONFIRMED	pbr455LymFr8apNm1eVwY	2025-02-08 21:21:10.022	AHoQ1rBGVOfGtfOK6KV-w
RcWmHcIfnO1Hx2Kj84Fff	CONFIRMED	jguifDL-yx8_oylx1PM_u	2025-02-08 21:21:10.022	8oGxeQPTGCiG37gSx5EWi
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.reviews (id, rating, content, created_at, gleaning_id, updated_at, user_id, images) FROM stdin;
45hOG6pTUiMxFpl_kJub9	4	Belle expérience de glanage, fruits de qualité	2025-02-08 21:21:10.56	dqtH9pha6Ctpf6G3XS0Ri	2025-02-08 21:21:10.56	AHoQ1rBGVOfGtfOK6KV-w	{}
jZLAajDhS8fSdxgRUgDlz	5	Excellent accueil et très bonne organisation du glanage	2025-02-08 21:21:10.56	djnbAoKKeMbCtN4FN1gQN	2025-02-08 21:21:10.56	8oGxeQPTGCiG37gSx5EWi	{}
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.sessions (id, session_token, user_id, expires, created_at) FROM stdin;
\.


--
-- Data for Name: statistics; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.statistics (id, last_updated, total_announcements, total_fields, total_food_saved, user_id, total_gleanings) FROM stdin;
pzOMlAKWX4F3ljbBj_jXI	2025-02-08 21:21:10.608	0	0	0	_3s7xb6NKwSmCtQqFOvT9	0
I9CLM0R1emQLWFARcBUE9	2025-02-08 21:21:10.608	0	0	0	8oGxeQPTGCiG37gSx5EWi	0
gsvwXHnmTvQsbwymf7hYr	2025-02-08 21:21:10.608	0	0	0	AHoQ1rBGVOfGtfOK6KV-w	0
ouHv30Lq6S-MyG0PShNMg	2025-02-08 21:21:10.608	0	0	0	29Z7b5e1rgt6iBwUISCcV	0
CpkiRbQNXnZbgPVAmtUqb	2025-02-08 21:21:10.608	0	0	0	BO81xb_b2Bz6gAzIcFYTH	0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.users (id, name, email, image, bio, plan, role, language, created_at, deleted_at, email_verified, password_hash, resend_contact_id, stripe_customer_id, updated_at, "onboardingCompleted") FROM stdin;
BO81xb_b2Bz6gAzIcFYTH	Admin User	admin@glean.be	\N	\N	FREE	ADMIN	ENGLISH	2025-02-08 21:21:09.103	\N	\N	$2b$10$pxDD.QpkdD4JUxSPR8gBmeIX8soydHA/CTJyIjK6rvW3wF6sS6hQ2	\N	\N	2025-02-08 21:21:09.103	t
29Z7b5e1rgt6iBwUISCcV	Jean Dupont	farmer.jean@example.be	\N	Agriculteur bio depuis 20 ans dans la région de Namur	FREE	FARMER	FRENCH	2025-02-08 21:21:09.103	\N	\N	$2b$10$pxDD.QpkdD4JUxSPR8gBmeIX8soydHA/CTJyIjK6rvW3wF6sS6hQ2	\N	\N	2025-02-08 21:21:09.103	t
AHoQ1rBGVOfGtfOK6KV-w	Sophie Van den Berg	sophie.gleaner@example.be	\N	Engagée dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-08 21:21:09.103	\N	\N	$2b$10$pxDD.QpkdD4JUxSPR8gBmeIX8soydHA/CTJyIjK6rvW3wF6sS6hQ2	\N	\N	2025-02-08 21:21:09.103	t
8oGxeQPTGCiG37gSx5EWi	Marie Lambert	marie.gleaner@example.be	\N	Passionnée par la réduction du gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-08 21:21:09.103	\N	\N	$2b$10$pxDD.QpkdD4JUxSPR8gBmeIX8soydHA/CTJyIjK6rvW3wF6sS6hQ2	\N	\N	2025-02-08 21:21:09.103	t
_3s7xb6NKwSmCtQqFOvT9	Pierre Dubois	farmer.pierre@example.be	\N	Ferme familiale depuis trois générations	FREE	FARMER	FRENCH	2025-02-08 21:21:09.103	\N	\N	$2b$10$pxDD.QpkdD4JUxSPR8gBmeIX8soydHA/CTJyIjK6rvW3wF6sS6hQ2	\N	\N	2025-02-08 21:21:09.103	f
\.


--
-- Data for Name: verificationtokens; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.verificationtokens (identifier, token, expires) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: agendas agendas_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.agendas
    ADD CONSTRAINT agendas_pkey PRIMARY KEY (id);


--
-- Name: announcement_gleaning_periods announcement_gleaning_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.announcement_gleaning_periods
    ADD CONSTRAINT announcement_gleaning_periods_pkey PRIMARY KEY (announcement_id, gleaning_period_id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: crop_types crop_types_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.crop_types
    ADD CONSTRAINT crop_types_pkey PRIMARY KEY (id);


--
-- Name: farms farms_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT farms_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: fields fields_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_pkey PRIMARY KEY (id);


--
-- Name: gleaning_participations gleaning_participations_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleaning_participations
    ADD CONSTRAINT gleaning_participations_pkey PRIMARY KEY (gleaning_id, participation_id);


--
-- Name: gleaning_periods gleaning_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleaning_periods
    ADD CONSTRAINT gleaning_periods_pkey PRIMARY KEY (id);


--
-- Name: gleanings gleanings_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleanings
    ADD CONSTRAINT gleanings_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: participations participations_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- Name: agendas_notification_id_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX agendas_notification_id_key ON public.agendas USING btree (notification_id);


--
-- Name: announcements_field_id_crop_type_id_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX announcements_field_id_crop_type_id_idx ON public.announcements USING btree (field_id, crop_type_id);


--
-- Name: announcements_slug_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX announcements_slug_idx ON public.announcements USING btree (slug);


--
-- Name: announcements_slug_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX announcements_slug_key ON public.announcements USING btree (slug);


--
-- Name: crop_types_name_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX crop_types_name_key ON public.crop_types USING btree (name);


--
-- Name: farms_slug_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX farms_slug_idx ON public.farms USING btree (slug);


--
-- Name: farms_slug_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX farms_slug_key ON public.farms USING btree (slug);


--
-- Name: fields_slug_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX fields_slug_idx ON public.fields USING btree (slug);


--
-- Name: fields_slug_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX fields_slug_key ON public.fields USING btree (slug);


--
-- Name: gleanings_user_id_announcement_id_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX gleanings_user_id_announcement_id_key ON public.gleanings USING btree (user_id, announcement_id);


--
-- Name: notifications_agenda_id_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX notifications_agenda_id_key ON public.notifications USING btree (agenda_id);


--
-- Name: participations_user_id_announcement_id_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX participations_user_id_announcement_id_key ON public.participations USING btree (user_id, announcement_id);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: statistics_user_id_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX statistics_user_id_key ON public.statistics USING btree (user_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verificationtokens_identifier_token_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX verificationtokens_identifier_token_key ON public.verificationtokens USING btree (identifier, token);


--
-- Name: verificationtokens_token_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX verificationtokens_token_key ON public.verificationtokens USING btree (token);


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: agendas agendas_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.agendas
    ADD CONSTRAINT agendas_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: agendas agendas_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.agendas
    ADD CONSTRAINT agendas_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: agendas agendas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.agendas
    ADD CONSTRAINT agendas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcement_gleaning_periods announcement_gleaning_periods_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.announcement_gleaning_periods
    ADD CONSTRAINT announcement_gleaning_periods_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcement_gleaning_periods announcement_gleaning_periods_gleaning_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.announcement_gleaning_periods
    ADD CONSTRAINT announcement_gleaning_periods_gleaning_period_id_fkey FOREIGN KEY (gleaning_period_id) REFERENCES public.gleaning_periods(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_crop_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_crop_type_id_fkey FOREIGN KEY (crop_type_id) REFERENCES public.crop_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: announcements announcements_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: announcements announcements_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: farms farms_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT farms_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fields fields_crop_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_crop_type_id_fkey FOREIGN KEY (crop_type_id) REFERENCES public.crop_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fields fields_farm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fields fields_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gleaning_participations gleaning_participations_gleaning_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleaning_participations
    ADD CONSTRAINT gleaning_participations_gleaning_id_fkey FOREIGN KEY (gleaning_id) REFERENCES public.gleanings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gleaning_participations gleaning_participations_participation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleaning_participations
    ADD CONSTRAINT gleaning_participations_participation_id_fkey FOREIGN KEY (participation_id) REFERENCES public.participations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gleaning_periods gleaning_periods_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleaning_periods
    ADD CONSTRAINT gleaning_periods_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: gleanings gleanings_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleanings
    ADD CONSTRAINT gleanings_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: gleanings gleanings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.gleanings
    ADD CONSTRAINT gleanings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: likes likes_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: participations participations_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: participations participations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_gleaning_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_gleaning_id_fkey FOREIGN KEY (gleaning_id) REFERENCES public.gleanings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: statistics statistics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Field4u_owner
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: Field4u_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

