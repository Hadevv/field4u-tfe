--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
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
    'GLEANING_ACCEPTED',
    'NEW_REVIEW',
    'GLEANING_REMINDER',
    'GLEANING_CANCELLED'
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
    id character(21) NOT NULL,
    "userId" character(21) NOT NULL,
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
    id character(21) NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(500),
    status public."AgendaStatus" DEFAULT 'PENDING'::public."AgendaStatus" NOT NULL,
    announcement_id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    notification_id character(21),
    start_date timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.agendas OWNER TO "Field4u_owner";

--
-- Name: announcement_gleaning_periods; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.announcement_gleaning_periods (
    announcement_id character(21) NOT NULL,
    gleaning_period_id character(21) NOT NULL
);


ALTER TABLE public.announcement_gleaning_periods OWNER TO "Field4u_owner";

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.announcements (
    id character(21) NOT NULL,
    title character varying(255) NOT NULL,
    slug character(6) NOT NULL,
    description character varying(2000) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    crop_type_id character(21) NOT NULL,
    field_id character(21) NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    owner_id character(21) NOT NULL,
    quantity_available integer,
    updated_at timestamp(3) without time zone NOT NULL,
    images character varying(255)[] DEFAULT ARRAY[]::text[],
    CONSTRAINT quantity_non_negative CHECK ((quantity_available >= 0))
);


ALTER TABLE public.announcements OWNER TO "Field4u_owner";

--
-- Name: comments; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.comments (
    id character(21) NOT NULL,
    content character varying(1000) NOT NULL,
    announcement_id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.comments OWNER TO "Field4u_owner";

--
-- Name: crop_types; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.crop_types (
    id character(21) NOT NULL,
    name character varying(100) NOT NULL,
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
    id character(21) NOT NULL,
    name character varying(255) NOT NULL,
    slug character(6) NOT NULL,
    description character varying(500),
    city character varying(100),
    latitude double precision,
    longitude double precision,
    postal_code character varying(10),
    contact_info character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    owner_id character(21) NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.farms OWNER TO "Field4u_owner";

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.favorites (
    id character(21) NOT NULL,
    announcement_id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.favorites OWNER TO "Field4u_owner";

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.feedbacks (
    id character(21) NOT NULL,
    message character varying(1000) NOT NULL,
    email character varying(254),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21)
);


ALTER TABLE public.feedbacks OWNER TO "Field4u_owner";

--
-- Name: fields; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.fields (
    id character(21) NOT NULL,
    name character varying(100) NOT NULL,
    slug character(6) NOT NULL,
    description character varying(500),
    city character varying(100) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    postal_code character varying(10) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    crop_type_id character(21) NOT NULL,
    farm_id character(21),
    is_available boolean DEFAULT true NOT NULL,
    owner_id character(21),
    qr_code_url character varying(255),
    updated_at timestamp(3) without time zone NOT NULL,
    CONSTRAINT ownership_check CHECK ((((farm_id IS NOT NULL) AND (owner_id IS NULL)) OR ((farm_id IS NULL) AND (owner_id IS NOT NULL))))
);


ALTER TABLE public.fields OWNER TO "Field4u_owner";

--
-- Name: gleaning_participations; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.gleaning_participations (
    gleaning_id character(21) NOT NULL,
    participation_id character(21) NOT NULL
);


ALTER TABLE public.gleaning_participations OWNER TO "Field4u_owner";

--
-- Name: gleaning_periods; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.gleaning_periods (
    id character(21) NOT NULL,
    field_id character(21) NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    status public."GleaningPeriodStatus" DEFAULT 'AVAILABLE'::public."GleaningPeriodStatus" NOT NULL,
    CONSTRAINT valid_date_range CHECK ((start_date < end_date))
);


ALTER TABLE public.gleaning_periods OWNER TO "Field4u_owner";

--
-- Name: gleanings; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.gleanings (
    id character(21) NOT NULL,
    user_id character(21) NOT NULL,
    announcement_id character(21) NOT NULL,
    status public."GleaningStatus" DEFAULT 'PENDING'::public."GleaningStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.gleanings OWNER TO "Field4u_owner";

--
-- Name: likes; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.likes (
    id character(21) NOT NULL,
    announcement_id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.likes OWNER TO "Field4u_owner";

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.notifications (
    id character(21) NOT NULL,
    type public."NotificationType" NOT NULL,
    message character varying(255) NOT NULL,
    agenda_id character(21),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.notifications OWNER TO "Field4u_owner";

--
-- Name: participations; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.participations (
    id character(21) NOT NULL,
    status public."ParticipationStatus" DEFAULT 'CONFIRMED'::public."ParticipationStatus" NOT NULL,
    announcement_id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.participations OWNER TO "Field4u_owner";

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.reviews (
    id character(21) NOT NULL,
    rating smallint NOT NULL,
    content character varying(500),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gleaning_id character(21) NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21),
    images character varying(255)[] DEFAULT ARRAY[]::text[],
    CONSTRAINT rating_range CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO "Field4u_owner";

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.sessions (
    id character(21) NOT NULL,
    session_token text NOT NULL,
    user_id character(21) NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessions OWNER TO "Field4u_owner";

--
-- Name: statistics; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.statistics (
    id character(21) NOT NULL,
    last_updated timestamp(3) without time zone NOT NULL,
    total_announcements integer DEFAULT 0 NOT NULL,
    total_fields integer DEFAULT 0 NOT NULL,
    total_food_saved double precision DEFAULT 0 NOT NULL,
    user_id character(21) NOT NULL,
    total_gleanings integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.statistics OWNER TO "Field4u_owner";

--
-- Name: users; Type: TABLE; Schema: public; Owner: Field4u_owner
--

CREATE TABLE public.users (
    id character(21) NOT NULL,
    name character varying(100),
    email character varying(254) NOT NULL,
    image character varying(500),
    bio character varying(500),
    plan public."UserPlan" DEFAULT 'FREE'::public."UserPlan" NOT NULL,
    role public."UserRole" DEFAULT 'GLEANER'::public."UserRole" NOT NULL,
    language public."Language" DEFAULT 'FRENCH'::public."Language" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp(3) without time zone,
    email_verified timestamp(3) without time zone,
    password_hash character varying(255),
    resend_contact_id character varying(255),
    stripe_customer_id character varying(255),
    updated_at timestamp(3) without time zone NOT NULL,
    "onboardingCompleted" boolean DEFAULT false NOT NULL,
    accepted_rules boolean DEFAULT false NOT NULL
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
0550d488-1e24-40fc-a2c6-fd15b702a7f9	260d96aa75e4c54be2ff6a0b736d96e33dc6c2e206c3d262d264cd099019120b	2025-02-20 19:59:22.183999+00	20250109202716_init_field4u_db	\N	\N	2025-02-20 19:59:21.978994+00	1
63aa1725-58c4-45d0-b308-31ad182b6e1b	70f7d302d28eb9f997b50f7e7449cd424663ac2a622e82a155e26bd3d8edd562	2025-02-20 19:59:22.402137+00	20250204095520_db_normalization_update	\N	\N	2025-02-20 19:59:22.22619+00	1
2df2d9de-5993-4a5a-a6cc-d425fc6dcc8d	149657631abfba6735851044b80d5b0c9e683b12ecdc585dca0ea7f903a39eca	2025-02-20 19:59:22.620792+00	20250204124608_remove_password_unique	\N	\N	2025-02-20 19:59:22.443467+00	1
a3202fc4-7259-4f31-831a-1ebd0116c89e	786bf273d0aa88d06d1a8c106682cd1b435e990e02c1b0bf7000a035ca7114dc	2025-02-20 19:59:22.772107+00	20250208211635_image_field_addition	\N	\N	2025-02-20 19:59:22.663014+00	1
5680d60d-83b1-4fad-937b-f25572167607	004ed0abb9ffe6e351eb0f4b7e876ad3c0aca995feafd7cd15c6fa64d26065b2	2025-02-20 19:59:30.929284+00	20250220195930_optimize_column_types	\N	\N	2025-02-20 19:59:30.708314+00	1
24dfc2cb-0ff1-482a-8e2d-003645f4442e	9d0c8fd273c5017032beeb4896e4828630e663fd447a672a84f7f725b4102f3d	2025-02-20 20:15:16.011571+00	20250220201051_add_check_constraints	\N	\N	2025-02-20 20:15:15.879921+00	1
740a9637-7dd6-4b2c-bb9b-b8942c541ca7	8a532539bed730278082ca2a62fc78c440a3af89c41084abed4c39166ee09a02	2025-02-21 22:56:07.377459+00	20250221225607_add_gleaning_cancelled	\N	\N	2025-02-21 22:56:07.230285+00	1
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
w4wT_KBEbQxmf_8wqxTVs	Glanage de Poireaux à undefined	Session de glanage organisée par Ilona Daugherty	PENDING	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:47.401	2025-04-04 04:49:24.902	\N	2025-04-04 00:49:24.902	2025-02-22 14:12:47.401	BImDoUWp0nYtVR1XBADA1
5FqRivzRIRQa3giD_8wgx	Glanage de Carottes à undefined	Session de glanage organisée par Jason Schroeder	CONFIRMED	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:47.401	2025-05-04 19:49:37.03	\N	2025-05-04 15:49:37.03	2025-02-22 14:12:47.401	kx7a_V0q_vcPJ4KEUOulN
0WiBW0f_VWE_fy2aknfte	Glanage de Poireaux à undefined	Session de glanage organisée par Ilona Daugherty	CONFIRMED	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:47.401	2025-03-28 22:10:44.492	\N	2025-03-28 18:10:44.492	2025-02-22 14:12:47.401	D5dndkr5njKtW4Ac_tmVm
Q7l4Mi2PUccou2MCQIUdU	Glanage de Choux-fleurs à undefined	Session de glanage organisée par Julia Roux	PENDING	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:47.401	2025-05-30 19:25:15.705	\N	2025-05-30 17:25:15.705	2025-02-22 14:12:47.401	BImDoUWp0nYtVR1XBADA1
JJZh2cBiRaVleHhq0GERT	Glanage de Poivrons à undefined	Session de glanage organisée par Madeleine Bauch	CANCELLED	RbURtIE6B-a1AkuKenD6Y	2025-02-22 14:12:47.401	2025-08-19 15:42:14.337	\N	2025-08-19 12:42:14.337	2025-02-22 14:12:47.401	SgxumAVx13SBTjv0d5tj7
4m6C8O6qLX6U6HDn26jyP	Glanage de Citrouilles à undefined	Session de glanage organisée par Billie Strosin	PENDING	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:47.401	2025-05-17 05:25:49.358	\N	2025-05-17 01:25:49.358	2025-02-22 14:12:47.401	is2ySgVuj4Gt_ae787YZU
fhQBYxcK22M_SDZWj39tw	Glanage de Haricots verts à undefined	Session de glanage organisée par Ilona Daugherty	CONFIRMED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:47.401	2025-05-02 17:45:03.49	\N	2025-05-02 13:45:03.49	2025-02-22 14:12:47.401	ILUPZhhZW3bZHegBDR2Cu
I8h1odd78OeJ8OlMUyBGX	Glanage de Haricots verts à undefined	Session de glanage organisée par Ilona Daugherty	CANCELLED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:47.402	2025-05-05 10:19:52.123	\N	2025-05-05 08:19:52.123	2025-02-22 14:12:47.402	-IMaZyj9yDW7KJmrtsnR_
LlYvLGhToZDtg2GLFeBVR	Glanage de Choux-fleurs à undefined	Session de glanage organisée par Julia Roux	CONFIRMED	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:47.401	2025-06-05 02:00:29.035	\N	2025-06-04 22:00:29.035	2025-02-22 14:12:47.401	010kfQ2xnGsgQEP4d6Qpq
8kqSL7lRv-gvrocOmrfjC	Glanage de Cerises à undefined	Session de glanage organisée par Lyne Perrin	CONFIRMED	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:47.401	2025-08-22 05:26:15.832	\N	2025-08-22 01:26:15.832	2025-02-22 14:12:47.401	kgaapwTlgtogyJtO0yC-U
rYAyBfK2WMWuUwkHrrWKF	Glanage de Haricots verts à undefined	Session de glanage organisée par Ilona Daugherty	CANCELLED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:47.401	2025-05-03 18:30:48.534	\N	2025-05-03 15:30:48.534	2025-02-22 14:12:47.401	BImDoUWp0nYtVR1XBADA1
wxOjIZwgVTMC7uN6iJpq-	Glanage de Piments à undefined	Session de glanage organisée par Milan Frami	PENDING	NXgvz4jDKfrEifJT6U6zm	2025-02-22 14:12:47.402	2025-07-26 21:31:57.411	\N	2025-07-26 17:31:57.411	2025-02-22 14:12:47.402	Ex4nSdiMXZ0pxRkSveWu4
yk8Jdt3aLOflLZKdxxrks	Glanage de Citrouilles à undefined	Session de glanage organisée par Billie Strosin	CONFIRMED	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:47.401	2025-05-19 15:37:19.103	\N	2025-05-19 13:37:19.103	2025-02-22 14:12:47.401	hEbvLiNvGJFCxlvnn1ajy
z5ovZp3RqcLnRc0IXGbsC	Glanage de Haricots verts à undefined	Session de glanage organisée par Cheick Kunde	CONFIRMED	r1UjwKdgeV8YjUUDNr8kl	2025-02-22 14:12:47.401	2025-05-10 19:40:35.518	\N	2025-05-10 16:40:35.518	2025-02-22 14:12:47.401	8WPa-GF3tVDwE42Ve7zLg
NnGtODUC7lSu0DWQzJ8wG	Glanage de Cerises à undefined	Session de glanage organisée par Lyne Perrin	CANCELLED	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:47.401	2025-08-21 06:12:10.195	\N	2025-08-21 02:12:10.195	2025-02-22 14:12:47.401	6M7Jhq31GYGjqhlXnuSlS
Gq5m-1xNbXUmC6QsDVHUu	Glanage de Carottes à undefined	Session de glanage organisée par Jason Schroeder	CONFIRMED	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:47.401	2025-05-01 06:40:14.211	\N	2025-05-01 02:40:14.211	2025-02-22 14:12:47.401	G68D-oGzsmHx-UKs7zfbc
JXihJnmVBm-AVTqC-6jVq	Glanage de Haricots verts à undefined	Session de glanage organisée par Violette Gaillard	CONFIRMED	hDlmu5xi6ucPuMMaPg6lZ	2025-02-22 14:12:47.401	2025-05-14 07:14:22.104	\N	2025-05-14 05:14:22.104	2025-02-22 14:12:47.401	YTDvLZ3zpIPxyf7NWbig-
6vMF28PaXkTn1M4ePbneC	Glanage de Poivrons à undefined	Session de glanage organisée par Theophane Kertzmann	CONFIRMED	mjqGmqjSW4A0-Ep0Uu1_1	2025-02-22 14:12:47.402	2025-07-22 08:48:51.575	\N	2025-07-22 05:48:51.575	2025-02-22 14:12:47.402	8WPa-GF3tVDwE42Ve7zLg
QkxeLn3aLnMXAPRJ5zDSK	Glanage de Haricots verts à undefined	Session de glanage organisée par Traci Hilll	CONFIRMED	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:47.402	2025-05-06 03:43:21.216	\N	2025-05-06 01:43:21.216	2025-02-22 14:12:47.402	7eSbGUXbGwrL5mz1Q2HW5
I0tr11k7UB6i-pR2uPE6s	Glanage de Piments à undefined	Session de glanage organisée par Milan Frami	CANCELLED	NXgvz4jDKfrEifJT6U6zm	2025-02-22 14:12:47.402	2025-07-30 09:31:40.626	\N	2025-07-30 07:31:40.626	2025-02-22 14:12:47.402	Vnpa0CWF6tNufHq2B0JEP
hczYWYTaBRCHR0WRbRug2	Glanage de Maïs à undefined	Session de glanage organisée par June Kiehn	PENDING	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:47.402	2025-03-31 11:32:01.837	\N	2025-03-31 08:32:01.837	2025-02-22 14:12:47.402	G-CIpmGST2Fn9m5H53Pn6
GuYCm_q0WryOXRpkACfPL	Glanage de Betteraves à undefined	Session de glanage organisée par Salvador Welch	CONFIRMED	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:47.402	2025-05-03 04:13:14.388	\N	2025-05-03 01:13:14.388	2025-02-22 14:12:47.402	bgcNiV1FK70eotHEVXTeG
_hdp34LPb0Mwy02f2dQzX	Glanage de Haricots verts à undefined	Session de glanage organisée par Ilona Daugherty	CONFIRMED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:47.402	2025-05-02 18:37:14.479	\N	2025-05-02 14:37:14.479	2025-02-22 14:12:47.402	RMC8eL7WJqBWqTMNPNJ0M
dlk_bsG_cYYuaI76HoJcm	Glanage de Maïs à undefined	Session de glanage organisée par June Kiehn	CONFIRMED	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:47.402	2025-04-01 00:02:26.847	\N	2025-03-31 21:02:26.847	2025-02-22 14:12:47.402	G4kuP6N_ckTd0Rop-VJa-
YrdvAcBdte5Wtu7ObQgy-	Glanage de Aubergines à undefined	Session de glanage organisée par Kenny Leannon	CANCELLED	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:47.402	2025-07-16 19:38:06.301	\N	2025-07-16 15:38:06.301	2025-02-22 14:12:47.402	RMC8eL7WJqBWqTMNPNJ0M
J94Ga1dKoLaqleTg1nqoz	Glanage de Piments à undefined	Session de glanage organisée par Théo Dicki	PENDING	PzuGdErwYJjgVb-tiNwNJ	2025-02-22 14:12:47.402	2025-08-27 13:54:39.032	\N	2025-08-27 11:54:39.032	2025-02-22 14:12:47.402	taknNHxsb9gYMyf3hMBlE
141JY0N7VsKVPJhBr_aik	Glanage de Maïs à undefined	Session de glanage organisée par June Kiehn	PENDING	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:47.402	2025-04-01 01:25:59.531	\N	2025-03-31 22:25:59.531	2025-02-22 14:12:47.402	uo5LsCc99Vak-gUkgIzfX
c5ZCXiF_3I82KSNySVqGg	Glanage de Maïs à undefined	Session de glanage organisée par June Kiehn	CANCELLED	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:47.402	2025-04-03 18:26:06.305	\N	2025-04-03 15:26:06.305	2025-02-22 14:12:47.402	HoNUiG2AQhcJzcxp1vtJI
sOI8QXV8q2O8YPs_oxDo_	Glanage de Haricots verts à undefined	Session de glanage organisée par Kenny Leannon	CANCELLED	Af_xhEH-w4oh-8mNII6ml	2025-02-22 14:12:47.402	2025-06-26 05:19:11.383	\N	2025-06-26 03:19:11.383	2025-02-22 14:12:47.402	CVm0n4hzIWdsDBrDJradD
FAyIUtBslRlqj4Q9RuNus	Glanage de Poivrons à undefined	Session de glanage organisée par Tiguida Gislason	CANCELLED	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:47.402	2025-08-27 13:04:41.836	\N	2025-08-27 09:04:41.836	2025-02-22 14:12:47.402	SgxumAVx13SBTjv0d5tj7
mQliaJ0tIObTXGXgtIBBE	Glanage de Aubergines à undefined	Session de glanage organisée par Fode Hodkiewicz	CONFIRMED	ndL1DHgeaaCjTN8RtrQ9S	2025-02-22 14:12:47.402	2025-05-09 03:45:31.715	\N	2025-05-08 23:45:31.715	2025-02-22 14:12:47.402	o12gDGrqvcIG_AaVqUrCX
YyuXDU2C7zptS0Fl1eM84	Glanage de Brocolis à undefined	Session de glanage organisée par Kristy Goodwin	PENDING	0a3HdSxD6gJJrZ1V_d1ny	2025-02-22 14:12:47.402	2025-04-05 20:33:06.625	\N	2025-04-05 16:33:06.625	2025-02-22 14:12:47.402	TwaN7v8EaCLjjs8adJGIQ
-sSfQnwgFvGwT1MvlrzHv	Glanage de Choux-fleurs à undefined	Session de glanage organisée par Emilie Kessler	PENDING	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:47.402	2025-07-23 23:36:00.917	\N	2025-07-23 19:36:00.917	2025-02-22 14:12:47.402	H9mgMEsnXG8WR65ZYemRV
CPWYzPmC5wk_iYtYjlgrK	Glanage de Raisins à undefined	Session de glanage organisée par Guillaume Raynor	CANCELLED	_staYYIPRFdrPytEYjPR4	2025-02-22 14:12:47.402	2025-07-22 12:35:16.849	\N	2025-07-22 10:35:16.849	2025-02-22 14:12:47.402	G-CIpmGST2Fn9m5H53Pn6
_ekzty92FD6S0dn4fTsaH	Glanage de Mûres à undefined	Session de glanage organisée par Ephraïm Bradtke	CONFIRMED	1wNUiByRERoYMJjrhzhqk	2025-02-22 14:12:47.402	2025-07-04 05:56:47.351	\N	2025-07-04 02:56:47.351	2025-02-22 14:12:47.402	eE4mNWW5LeV8ael4lbHxF
A7Ary-gljA-XhZPk8Ei_d	Glanage de Raisins à undefined	Session de glanage organisée par Cyril Blanc	CANCELLED	CLTeqQb13pUifhxKoS8xu	2025-02-22 14:12:47.402	2025-05-08 16:29:20.205	\N	2025-05-08 14:29:20.205	2025-02-22 14:12:47.402	RMC8eL7WJqBWqTMNPNJ0M
UrkGqEtO-ZbJIF-IPBhmf	Glanage de Pommes à undefined	Session de glanage organisée par Claude Vidal	CONFIRMED	bqCEmwlKkuPvyw_BG_o23	2025-02-22 14:12:47.402	2025-08-03 09:09:30.675	\N	2025-08-03 06:09:30.675	2025-02-22 14:12:47.402	010kfQ2xnGsgQEP4d6Qpq
C84BGlAjd1qenczt9j6Ln	Glanage de Poivrons à undefined	Session de glanage organisée par Aden Collins	CONFIRMED	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:47.402	2025-06-04 09:58:44.974	\N	2025-06-04 06:58:44.974	2025-02-22 14:12:47.402	xWBJ_Lk4-5xl_S95ch4DN
jhpE5OrYaOgz6ANDgKQNk	Glanage de Poivrons à undefined	Session de glanage organisée par Aden Collins	PENDING	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:47.402	2025-06-03 08:32:42.096	\N	2025-06-03 06:32:42.096	2025-02-22 14:12:47.402	MolqmNWVa06zm-Io5X_AL
7Z3HRODSolO-FX4oYCI5c	Glanage de Betteraves à undefined	Session de glanage organisée par Salvador Welch	CONFIRMED	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:47.402	2025-05-03 08:47:52.117	\N	2025-05-03 06:47:52.117	2025-02-22 14:12:47.402	FWIZrDngg9Qx2C6LLK0TZ
3lf97alzBfEofcutGM3A8	Glanage de Choux-fleurs à undefined	Session de glanage organisée par Aden Collins	PENDING	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:47.402	2025-07-02 15:24:57.699	\N	2025-07-02 13:24:57.699	2025-02-22 14:12:47.402	6tAud8OtyM-8ik06LVaIY
WCCF5FmXos2Qkdsd0ofxL	Glanage de Pommes de terre à undefined	Session de glanage organisée par Ayaan Rohan	PENDING	iY8GqXzNJ9k0CYa6CIjd_	2025-02-22 14:12:47.402	2025-03-13 13:24:34.343	\N	2025-03-13 11:24:34.343	2025-02-22 14:12:47.402	BImDoUWp0nYtVR1XBADA1
4ETxZE6pA8gNVFMFB9BN5	Glanage de Mûres à undefined	Session de glanage organisée par Craig Corkery	CANCELLED	xq-V5AMQpEVc9mWkAker3	2025-02-22 14:12:47.402	2025-07-10 19:54:49.773	\N	2025-07-10 15:54:49.773	2025-02-22 14:12:47.402	bdjT6dtbumKCFGpF8xKCz
BQpvfRDVxlLmsMOmNqjUQ	Glanage de Poires à undefined	Session de glanage organisée par Helèna Konopelski	CONFIRMED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:47.402	2025-06-30 04:11:24.14	\N	2025-06-30 00:11:24.14	2025-02-22 14:12:47.402	8WPa-GF3tVDwE42Ve7zLg
NnI7vRDEPNQ3rUL_DoJ2l	Glanage de Poivrons à undefined	Session de glanage organisée par Aden Collins	PENDING	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:47.402	2025-06-04 09:10:21.006	\N	2025-06-04 07:10:21.006	2025-02-22 14:12:47.402	hBWjYB97bi-PTiXh6V5lL
qWSyVaWTSk5gfCXSLong9	Glanage de Courgettes à undefined	Session de glanage organisée par Amelia MacGyver	CANCELLED	PDutvax019TIxfo26I1IN	2025-02-22 14:12:47.402	2025-03-23 05:29:54.535	\N	2025-03-23 03:29:54.535	2025-02-22 14:12:47.402	FWIZrDngg9Qx2C6LLK0TZ
vygA_Cw2xNGfcIWQJCRja	Glanage de Poires à undefined	Session de glanage organisée par Helèna Konopelski	CANCELLED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:47.402	2025-07-01 01:08:12.714	\N	2025-06-30 22:08:12.714	2025-02-22 14:12:47.402	MnoyNuzPIA932-N7FVVu9
rgo33M53TwcYTMGigluKZ	Glanage de Maïs à undefined	Session de glanage organisée par Sue Hirthe	CONFIRMED	WtsUu45cytRzZu8j7aJMr	2025-02-22 14:12:47.402	2025-08-28 04:23:09.942	\N	2025-08-28 00:23:09.942	2025-02-22 14:12:47.402	kgaapwTlgtogyJtO0yC-U
jVNVkzCQyS3JnVq8E0KXG	Glanage de Pommes à undefined	Session de glanage organisée par Cyril Blanc	CONFIRMED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:47.402	2025-06-18 13:51:41.315	\N	2025-06-18 11:51:41.315	2025-02-22 14:12:47.402	qB9sSTyr1VEcIpWOfVvmE
CBtcHQXpIEyopVHH92imr	Glanage de Poires à undefined	Session de glanage organisée par Helèna Konopelski	CONFIRMED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:47.402	2025-07-01 04:25:38.216	\N	2025-07-01 02:25:38.216	2025-02-22 14:12:47.402	xqaIMhPePn0LfXF-YKQLh
y6jizQfFBxVviY-MKpZgk	Glanage de Navets à undefined	Session de glanage organisée par Ayaan Rohan	PENDING	ZI3ZaEJPZcKWCCdYeqarQ	2025-02-22 14:12:47.402	2025-08-08 01:09:23.652	\N	2025-08-07 22:09:23.652	2025-02-22 14:12:47.402	SgxumAVx13SBTjv0d5tj7
6PtQIUXoH19PDUzqAOwSi	Glanage de Courgettes à undefined	Session de glanage organisée par Cyril Blanc	CONFIRMED	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:47.402	2025-03-11 02:55:10.221	\N	2025-03-11 00:55:10.221	2025-02-22 14:12:47.402	ZcTt5h_MdndtHtmFxIfxR
an48i8rSe2OfYfHSDl7W3	Glanage de Raisins à undefined	Session de glanage organisée par Nada Dupuis	PENDING	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:47.402	2025-05-28 10:40:10.958	\N	2025-05-28 08:40:10.958	2025-02-22 14:12:47.402	MVar0M4VbKvaTyMGHm5TX
s_akiLifESV3C_ixXkUOX	Glanage de Cerises à undefined	Session de glanage organisée par Sue Hirthe	CANCELLED	bBUngx7oAupi_cBInbLm-	2025-02-22 14:12:47.402	2025-04-24 05:26:58.35	\N	2025-04-24 03:26:58.35	2025-02-22 14:12:47.402	Pxq28Q6QNzB72vY1-EpHc
usatn1xa4MSC3uRtxJ9gi	Glanage de Pommes à undefined	Session de glanage organisée par Cyril Blanc	CONFIRMED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:47.402	2025-06-21 16:58:40.572	\N	2025-06-21 12:58:40.572	2025-02-22 14:12:47.402	G-CIpmGST2Fn9m5H53Pn6
hEH4ZWcJMTu-A6loudFIQ	Glanage de Piments à undefined	Session de glanage organisée par Rami Barton	PENDING	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:47.402	2025-07-29 10:16:07.998	\N	2025-07-29 08:16:07.998	2025-02-22 14:12:47.402	taknNHxsb9gYMyf3hMBlE
MjQMJHYa5ghsk9p-tS5hA	Glanage de Pommes à undefined	Session de glanage organisée par Bonnie Kub	CANCELLED	XmUu9isiAhmW32xZH4ZZk	2025-02-22 14:12:47.402	2025-05-28 08:59:51.726	\N	2025-05-28 06:59:51.726	2025-02-22 14:12:47.402	YTDvLZ3zpIPxyf7NWbig-
Mf8MSCwpH7zGlXmHGH3Fj	Glanage de Citrouilles à undefined	Session de glanage organisée par Russell Medhurst	PENDING	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:47.402	2025-03-11 03:33:00.786	\N	2025-03-11 00:33:00.786	2025-02-22 14:12:47.402	Vnpa0CWF6tNufHq2B0JEP
2Pe51byVveimBNOi1JDYC	Glanage de Choux-fleurs à undefined	Session de glanage organisée par Jessie Stehr	CANCELLED	TbroWkkhGNI9ohebhZUVy	2025-02-22 14:12:47.402	2025-08-19 09:07:14.991	\N	2025-08-19 05:07:14.991	2025-02-22 14:12:47.402	edIBp-z6GbU6qMrFyP-on
d6mUI5bEs5yoyv2F3QhDO	Glanage de Courgettes à undefined	Session de glanage organisée par Cyril Blanc	CANCELLED	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:47.402	2025-03-11 18:39:13.948	\N	2025-03-11 15:39:13.948	2025-02-22 14:12:47.402	BImDoUWp0nYtVR1XBADA1
MJSRAa6gSijDXEGt0mm6t	Glanage de Piments à undefined	Session de glanage organisée par Rami Barton	PENDING	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:47.402	2025-07-30 15:37:41.315	\N	2025-07-30 11:37:41.315	2025-02-22 14:12:47.402	kx7a_V0q_vcPJ4KEUOulN
qDNVDRa15XFspaXhhcEcv	Glanage de Pommes à undefined	Session de glanage organisée par Cyril Blanc	CANCELLED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:47.402	2025-06-20 21:31:11.129	\N	2025-06-20 18:31:11.129	2025-02-22 14:12:47.402	W2u_mWX7wJprusJBrO6Qy
759Yjatv14VEqdXer1DBQ	Glanage de Mûres à undefined	Session de glanage organisée par Rami Barton	CANCELLED	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:47.402	2025-04-05 15:20:26.264	\N	2025-04-05 13:20:26.264	2025-02-22 14:12:47.402	hCTGZ3il5htDkjYnF3wXS
JAROT9ats20vadQvjY6ii	Glanage de Mûres à undefined	Session de glanage organisée par Rami Barton	CONFIRMED	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:47.402	2025-04-04 03:40:35.909	\N	2025-04-03 23:40:35.909	2025-02-22 14:12:47.402	TwaN7v8EaCLjjs8adJGIQ
PmCvO7j5HBdpexz5UIBca	Glanage de Poivrons à undefined	Session de glanage organisée par Amelia MacGyver	CANCELLED	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:47.402	2025-07-21 12:18:57.291	\N	2025-07-21 10:18:57.291	2025-02-22 14:12:47.402	edIBp-z6GbU6qMrFyP-on
wS6uQP-BQ70Mqsj4HGzFK	Glanage de Courgettes à undefined	Session de glanage organisée par Amelia MacGyver	CONFIRMED	PDutvax019TIxfo26I1IN	2025-02-22 14:12:47.402	2025-03-22 04:16:43.619	\N	2025-03-22 00:16:43.619	2025-02-22 14:12:47.402	edIBp-z6GbU6qMrFyP-on
3sU6xrMHnLXdB4ZBGxGKo	Glanage de Salades à undefined	Session de glanage organisée par Rami Barton	PENDING	vgtI4Nw6SrWDtdCnAz4RD	2025-02-22 14:12:47.402	2025-05-21 19:22:48.257	\N	2025-05-21 16:22:48.257	2025-02-22 14:12:47.402	8WPa-GF3tVDwE42Ve7zLg
8sf7vbhNV7PWONxoL2UKK	Glanage de Raisins à undefined	Session de glanage organisée par Nada Dupuis	CONFIRMED	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:47.402	2025-05-29 07:43:38.511	\N	2025-05-29 03:43:38.511	2025-02-22 14:12:47.402	WvVs9H432Rb7EPLVveQBu
UGTfpn32-RuY2uBzJ891s	Glanage de Poivrons à undefined	Session de glanage organisée par Aden Collins	PENDING	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:47.402	2025-06-04 12:19:45.723	\N	2025-06-04 08:19:45.723	2025-02-22 14:12:47.402	Ex4nSdiMXZ0pxRkSveWu4
oOzJN0Ay-XwYia5PjbykV	Glanage de Maïs à undefined	Session de glanage organisée par Sally Bahringer	CANCELLED	lYgnnJ2vt5Z1jICs5a851	2025-02-22 14:12:47.402	2025-08-12 02:48:16.213	\N	2025-08-12 00:48:16.213	2025-02-22 14:12:47.402	RMC8eL7WJqBWqTMNPNJ0M
Geog_6JJ9v9gvc_FEHRql	Glanage de Pommes à undefined	Session de glanage organisée par Cyril Blanc	CANCELLED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:47.402	2025-06-19 18:27:16.573	\N	2025-06-19 14:27:16.573	2025-02-22 14:12:47.402	ZUyzKoj-4sITYZmn66MyV
kZh_x7LtdmQvlK0R-W5Fy	Glanage de Salades à undefined	Session de glanage organisée par Rami Barton	CANCELLED	vgtI4Nw6SrWDtdCnAz4RD	2025-02-22 14:12:47.402	2025-05-22 04:33:24.15	\N	2025-05-22 00:33:24.15	2025-02-22 14:12:47.402	YTDvLZ3zpIPxyf7NWbig-
Be9f6g6QXlLrCgYZrApSF	Glanage de Piments à undefined	Session de glanage organisée par Rami Barton	PENDING	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:47.402	2025-07-25 05:06:10.224	\N	2025-07-25 01:06:10.224	2025-02-22 14:12:47.402	ynfjsfccIOGfleSPiodgL
LlhPbds1iZ6QW7vaspOoy	Glanage de Choux-fleurs à undefined	Session de glanage organisée par Aden Collins	CANCELLED	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:47.402	2025-06-22 17:57:43.234	\N	2025-06-22 14:57:43.234	2025-02-22 14:12:47.402	ZUyzKoj-4sITYZmn66MyV
QTkbHxMNe-0trAs-jTbWO	Glanage de Poires à undefined	Session de glanage organisée par Helèna Konopelski	CONFIRMED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:47.402	2025-06-28 17:02:21.516	\N	2025-06-28 14:02:21.516	2025-02-22 14:12:47.402	HoNUiG2AQhcJzcxp1vtJI
RpR24jI3sz4TRQltUbyp0	Glanage de Choux-fleurs à undefined	Session de glanage organisée par Aden Collins	CANCELLED	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:47.402	2025-06-29 20:13:02.993	\N	2025-06-29 18:13:02.993	2025-02-22 14:12:47.402	y1Hx4GXVmNiq1OxpUKFxa
ShVUf_OjVDpLpSQqU8ue4	Glanage de Courgettes à undefined	Session de glanage organisée par Sally Bahringer	PENDING	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:47.402	2025-08-14 19:29:53.931	\N	2025-08-14 15:29:53.931	2025-02-22 14:12:47.402	XBIUrzPwMaB--z4fp4Q_Y
M_DrPsATL9LZXesc0Bte7	Glanage de Courgettes à undefined	Session de glanage organisée par Sally Bahringer	PENDING	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:47.402	2025-08-17 21:53:41.88	\N	2025-08-17 17:53:41.88	2025-02-22 14:12:47.402	hCTGZ3il5htDkjYnF3wXS
11Rv0lEeP-QWS1bzTTImj	Glanage de Courgettes à undefined	Session de glanage organisée par Sally Bahringer	PENDING	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:47.402	2025-08-17 10:38:16.858	\N	2025-08-17 07:38:16.858	2025-02-22 14:12:47.402	Oa2qVBSUXJgYNiT-NN2Iu
\.


--
-- Data for Name: announcement_gleaning_periods; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.announcement_gleaning_periods (announcement_id, gleaning_period_id) FROM stdin;
HKS6fCzi-MOL2-XDXXz1e	NK1OQai4EwR_5mL7IAbNQ
LeyqVixhNtsb2_lmKzziX	7CMrEZUhCNT6G9uJ6bYf3
ppQZ0EBN8iVxOEjo7cNVp	xTQ_33oSBQ8LgomPaplQ7
moy7jq0XMWj8GZZYfQLwS	xfRkwBSCFTexvJIM617Rg
Q_BFkCEJAPxYsrQk5uB3R	xTVy_uJ4HUKY6XZ4plME1
UNesA6JeouCfaD6g75bUk	M-0HNN7HUcny1KDjVbzSK
vmNxqd4jGgV1YGpQgQAIv	HvozADGbJ_V_GB7CeBugW
r1UjwKdgeV8YjUUDNr8kl	uHwmkcouLb6vLYTdeUYt4
gE54sw2rRxiKQtkGVvCJ8	Pp9c17boS5vBDCWs-DZtT
qkPrIOzHNfjHTeBOLVWIS	htYGKfXcgkj7B91gHUJN8
e6r8LuJgaWcjU42lwS5eU	vcNPrX9lzmZeJY987fbLn
2phuQfXKz4nl_mM5muiDN	WMc9rpRBzjxHJKox3uNE3
iRnhK3ZUexr0HPTRATD2K	q1BeI5NJqLFWmlqyxIo-b
zwD0zc74Y7HIWaW4xbfeS	cbt-yustEbXf4D40SUw-2
LRQBM9v5m0N0z-kORmBym	tp-OnmjJo3qPbC1YJK_Hf
hDlmu5xi6ucPuMMaPg6lZ	hUjvkq76TJl_BgB6I26K8
2mJV3Zz3M2i_APe2WKGoA	SQqF5oFU6aPV4p4BsyLlz
5fpSdMQ12zDUA30v8hxHy	bZm0q8TdNcOsuHdqRuwcp
RbURtIE6B-a1AkuKenD6Y	6dlRI4i_t2ANkBtpARwyr
Z9IWUFemRgdlAUA2exU9w	8krg2W5cot-X0KT22UPeM
fzVGDzQMEj6SuoZ2SwbZj	B1e5oHiqWkveXNrxdN0I5
_sRAuMKiqFb82KP6NWkp5	JowSdxG0mopNUZCdo7D2q
0hrQAdv-ZSSt4vFfMWGrB	U5ITaYMjhhAkurK6AsFeL
NXgvz4jDKfrEifJT6U6zm	bIPO6jv3jqjfupj0u0b3t
-XXQJQH2QZmNeoStrCqKv	Yr5vYaVATcHUhN0fqCxrv
WB3e4Lw8_uHRtmBPct5I_	wdYughD_iLLyu1odLZ-tz
Kb3bSLlmogWuj9dxQIt2-	sUd6FY2IqjjBngk772YXx
STOH5L2a1GAAOIqzD4flI	UgJN-j4X_5TqWhe_qNiSC
kWA0fPaZsTYelJrjsmw54	RR9rO7nenJeHO9nzBryiL
Xr2DG96eCesYj6CbeJRPI	2AX76cEDkkCEdD5sQxOAb
TbOTlviCAg_aydN4g_Nw0	cpEWUD1zddLKfYhuCpHIH
SDXePMW5CLhEavcJu8SO4	cwdDFoZnXTaQgrJ3OXf7G
2oSAE55ybgvklIuz9tyU-	9rm1lJn3qzlJQ3Kh_D-_P
zD9VggK6BK_yPRoe4mpGe	YSaKmsBTLBfZdAGbugYtS
b6lY_Q5Ooiwhnt8lXfqp3	IXytX04XP2kjAOeksWR4u
DPqpsO-f5Xn0Sd0EXaqsV	9Wu3M_HmjUiYBZnAC0mXW
dFgF-OJWG3TxmrRS_NE6d	f0SKj_mj6J4dU6Ntxhqvc
EVUieFdqw-tdjYZbpj7tA	Cnb67nhXGsyB-lC4muAQ6
UecA0lsgs4MfsKUspmTXG	2jdrGhZddVfQZGbqioNWe
bxUmqGXYNbJNsUjC7x_lz	w-Ltb4L_Afq8m0DYWWPn-
iPErNrc070AIGHWM5v-L7	kXJhtxtZyG3NdpcN-qbeV
mjqGmqjSW4A0-Ep0Uu1_1	0qV9gklPOt2NsSTThsmHo
woUYtfeKDDDP9rMOU5N00	_qjMYS7ra2iFP_Mg0yzWQ
hTBBeMQPDnBenBvHnw0ii	NL4bNvd7A9BLdwZCuHufV
-CFbkdRcURKdVOjrLUJx9	iQs_XUNt8UhVhay-YZl2K
Cam7xzvFjl3SvHLOx5oEv	dAkxzvImlIetoiyGUxCmY
Ej7WEmYuQYBlYSBXBFvdA	FQh99z17O6ECqi4HoIUJc
f8gqC7W8XWhbVjvMYXNmG	H49IuaCrxYEIP_P3sB9Of
XfRVfvnOcpZt5MW5CJFpn	D6S8Ytn4Tzy3HEGF1uayL
_6qXgSFAqLDWc7HONDRB6	lfjlmWGSi8XnC43OMmzQG
DVo_TNjg5who4HgI-2Zud	gAE4E3AQRWfjuc1gZL0tD
_staYYIPRFdrPytEYjPR4	qE_yNk1LRfYonDOAsF_Iw
ePJhPv7abpQnDzZTIlKVA	ISeBUfsnYyT5gzQseEvOB
-cg1y9j0qRrSah_1O3ZsJ	11ExOZ2h4gyUnG2S9Dpg8
UDjJgC3bfbMfpUdTxiDdt	fH0LjRADsXgDGhDsECEd6
seVzrO7M1VwDUZKh3YeWu	ytOlX5nafXfP-Ad50E6Ro
UIrrKVIlkjDXaWfDO8aTO	dxeL06hsyWfpIOPIQ8eY7
KdBG4xtazafHqJ9mHzwMF	ZP39HS4cplsLRrxasuYyu
bGc0d8XqeWUi2G-W1sSQV	AT5L6cxxXXR9SACTAytV2
0a3HdSxD6gJJrZ1V_d1ny	sEBFfIF1WSo5UcGw6a2cT
aM5O4HkBaj3LQcVzeASEe	N5ym1aXpvpSeINghOuQPt
8tYlrW76mItRincjRI5-2	hyesfSvsSvEfHR3CyZLsq
89LJE-xewrUYK6UykCSrj	BUkSj_4daqUd4rEfwcaAH
El8D_fnta4fRMTCcdIwYD	AuK5il_R6CqUpci6Pz4_Q
Af_xhEH-w4oh-8mNII6ml	wUh2_muJZI8Y4uauXisCF
ndL1DHgeaaCjTN8RtrQ9S	fgbfJKhRp7ouJTWr-6_bf
JUws0qhYyaidNKTZCBBQP	8bY4M8_d0KMUZtnRHAnpX
vBV47jcbiomT8ZOaGA16k	nJAo66LdTyMfUPKRD6f2d
mq9znd0d0U4Lz_oNRx5Rc	5LYalkrYvpDBeNEIPtUaE
6aW4wuwCzB4TCKN5uvvCT	6zCDtgSsSfUYgBYwzC6iZ
jeLIkF8ng7C-CEkx5qUO7	dKm1_Z9RgMyH2Y5wv-saR
JljVHt61gMmIt-9k0S2zi	C2M5Y3iGnBr5WAFmX_KjO
PzuGdErwYJjgVb-tiNwNJ	gEYHc_ZQ9wuC9nKRLv9uB
CIPYxBm1jLwue1iCFX9BA	13A0mR2k88dr-AxKTKTCK
bUXAWDeLIpXsRCZUaBaTu	6eTM-ABdNxBsbJietKBZu
9JuIfwCQSkGlHEbO2xi_K	06J33aHoWjXZPGDC6Dnhi
1wNUiByRERoYMJjrhzhqk	xbtGXdJTC3E89HTLV0S0A
jYcasqpd9Uqv6GOGv5r4Y	F-LLdSXakLRRuBRdPPXXg
9lH2MxAfDorT-Bj_52IKb	0ryXSrhDGchd-3YlpGq8l
Rw49gQGGyPSFLy7tqWdj8	2LOtKWz4pVZ4TR1KaG6Eh
JJKN3jdlt32rSeJ1AphOb	0ZC6DFY4_T9zrC2STrhXW
xq-V5AMQpEVc9mWkAker3	3ZD45_sEuyYg6ox4M2sps
XmUu9isiAhmW32xZH4ZZk	Vdv5_O5OZDeLZLcT3XmyU
CLTeqQb13pUifhxKoS8xu	cKJhM_OmP5wBrjzDn09XF
a2JyLo1XT8U4sj41J-Qxu	sP9lFU3SS7aoOFNzCV0DR
LDxHYT8J79qUcsqYh1XIE	uAPThIwoxe7IDYpeWbUCn
0UpZuQ59LuhpDVaAkyXKN	7GeD3huFE_pbFCGSZ8XXb
T_gUz4pDq1h0QwzmLOk6M	TXXezitgNSLF4V_c3KSFl
QK9JsgH58DcjKMfBd3amT	Zsa3KM1bzy-hXTnbP6gsx
PDutvax019TIxfo26I1IN	xOK-zJlIQALkFOHPOj2EM
XYGZJmkyhQ_gXWC4aC1m_	_oEss9quITfXPwZJaqwUK
iFY-_dF-qeg49wbA3ehga	n-xnhQ23tz-i_hTU7ulAv
wRLgglC5vuSvkzdfmvJGC	F1JbFHxMBibvck0tneN2W
ebE-lDixF4g0BSiOojFic	JMcClHbIpErr1ey8NAy9B
2BF-SOEZmuZoYEO00D-O5	odz_4bfiOKQPG2mzM7wNV
UZf-IoceM8S-JShMD9k9z	QyN9skTnkqFwMP6Ppue9E
bqCEmwlKkuPvyw_BG_o23	EndYbQ4xg_onpfnLa_S8_
yOmdvzuc0gq2eZqFXgAWv	xG1JkqHkm0luWWT0nZtvl
ypDXYfNEFG50Dw2gYO5aZ	AlLFxFEMHrDhAsLU0fH1S
Se9j6dgcU8ztfkGNEGsuA	nt9c6p7-l3XZ8SEKzeSwa
uZAzuAEYOtQsUkGwyBx3M	h7_4vRg5N9Q9DyjyB0Fks
eJDiaGgcBEF7oo_waiTrv	wce1wXsKGEiibh0z4Z0oD
lxHVm4mR19FlJQrnAda9C	dMtP89q0b3UpGxLgVVVUl
YdySePJge4-KnZk6G0zOQ	FsimaHkfBrI2GQJKjhc1M
rp5drsdIYnZ0-5_dc4e45	df9RzwyxkzXQ2KKVY5nlI
y_CR6-fRGBJyOjA6iK1QU	4XcE7zzTVYRoAdr6hy_Ai
3mcuaFEos_8fkcQ01bGJ8	6oSLlmJbfmptmaIxWgw2J
wc9izHte2q2m60Ig5K6St	rlE2OlWVSgV_LR69SFCU6
CchQ8H0S9NVdnVHtoRr-d	RbFWzu8FYL2JoLMdg7ZtD
_PxGjoNhr_JVCbrR4OshX	PEy0A1dV1XNVkL_kZHspn
TbroWkkhGNI9ohebhZUVy	4MvVAwy4LyUOoOnOIIMhF
lYgnnJ2vt5Z1jICs5a851	2eGHTIWop7m2L7x1Fosx9
hfsURvFDxaGJDjGhSt-4H	5yyrVcD2QUr_0w2JZstVV
f8PRB83eToLUM2IOl1Frz	TzI4k0rJCxDbwFTKimldE
AC0lF6uy27QJWwv28PCAR	Z4eTxufnOGfEBfJYu0hH0
ggoajYtC_Ep6XZ3uUkB4U	-50WBwRSFUGe-pk-0bBCA
4d8KAh4jq_eb_gghsG_Z8	Sm8KaMv7l1wxtDzpfEtL2
iY8GqXzNJ9k0CYa6CIjd_	qFjkr-nLLEm3Vfc31zw38
JA1AakV9nIJBbBpNo_Xmb	YOrxUCH7l30tSyIIhBvBH
VMUQqQ0gmb0QRzejh3Tq8	DM7OSGikU7QeRemCrIxUj
vgtI4Nw6SrWDtdCnAz4RD	Gv4sULz36o95TQIWz7YmJ
ZI3ZaEJPZcKWCCdYeqarQ	UUga1y9KayChRMOvi1cow
hfuyfTwc3egGJE0pEz3h0	8FgdRClW59QjRzXsN42jo
RYZFEnhqdqOvE7IOQkeL7	sE4ugGBYYv8DneKWQZ6iP
wHp_clEZEs28dUCuLv72c	JSvAk3cQCXDFeR7L2jt_m
bBUngx7oAupi_cBInbLm-	jY7l1JmJu2LhdOKdQWody
ytjwR7Wj67ThXy1zQKqr0	fR68TyYO2v4d8bOY-D5ad
RIsZgMg6JktdC-hsDV5qn	TFtBApgBJMf_juTXyIUy3
WtsUu45cytRzZu8j7aJMr	2gT-soAOdyBm-toNEO-PQ
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.announcements (id, title, slug, description, created_at, crop_type_id, field_id, is_published, owner_id, quantity_available, updated_at, images) FROM stdin;
HKS6fCzi-MOL2-XDXXz1e	Glanage de Fraises à Waimes	SvjN_e	297 kg de Fraises de bonne qualité disponibles pour le glanage. Illo fuga beatae quae placeat assumenda aperiam optio.	2025-02-22 14:12:43.089	Hsd7_4oJ994yGzAHQ3BXT	QVWQAWGDyqGgaZdv8KMj6	t	71Ow35rP5LZtrCl_9edNW	790	2025-02-22 14:12:43.089	{}
LeyqVixhNtsb2_lmKzziX	Récolte solidaire de Poivrons à YvoirNord	guWSL_	275 kg de Poivrons de satisfaisante qualité disponibles pour le glanage. Officia laboriosam optio officiis atque molestiae occaecati consectetur temporibus.	2025-02-22 14:12:43.089	wfQ4P8W3pmReXejYJpAsb	XbBAk-uYjGQ_zYD_oJPn0	t	JwAPJpRCZ-fJAGXkWKL7Z	506	2025-02-22 14:12:43.089	{}
vmNxqd4jGgV1YGpQgQAIv	Récolte solidaire de Cerises à Fontaine-l'Evêque	YVIAeu	284 kg de Cerises de excellente qualité disponibles pour le glanage. Nisi vel accusantium molestiae.	2025-02-22 14:12:43.089	K6WaRBvMDjctbFMntkM7b	4T7etdFLQjcMpfH9BpSRq	t	oGxVLS_M1DwYi8FazDcal	884	2025-02-22 14:12:43.089	{}
Q_BFkCEJAPxYsrQk5uB3R	Récolte solidaire de Choux-fleurs à Merbes-le-Château	uiy9oe	282 kg de Choux-fleurs de bonne qualité disponibles pour le glanage. Nemo labore neque.	2025-02-22 14:12:43.089	FyXCWu5iojd28394U0qld	MbJfo9JGcBKBMI53Gx52l	t	71Ow35rP5LZtrCl_9edNW	392	2025-02-22 14:12:43.089	{}
r1UjwKdgeV8YjUUDNr8kl	Récolte solidaire de Haricots verts à Stavelot	24Pdl1	257 kg de Haricots verts de satisfaisante qualité disponibles pour le glanage. Harum laboriosam exercitationem provident totam amet porro.	2025-02-22 14:12:43.089	J3Ee9SwlCuJa9zPb6P0MM	KeWra5wOx_hxcOtfeMEzC	t	rJYwsLLmhM4lNPTyGsLot	939	2025-02-22 14:12:43.089	{}
moy7jq0XMWj8GZZYfQLwS	Récolte solidaire de Carottes à Lierneuxcentre	H0R66T	142 kg de Carottes de bonne qualité disponibles pour le glanage. Iure inventore neque aut voluptatibus itaque labore ea consectetur vero.	2025-02-22 14:12:43.089	NM5e2trpKlZJ_O6tev2nr	97gN9zrVWEAetH2LSzoft	t	rJYwsLLmhM4lNPTyGsLot	945	2025-02-22 14:12:43.089	{}
gE54sw2rRxiKQtkGVvCJ8	Cueillette de Pommes à Lens	DAQ7x3	294 kg de Pommes de satisfaisante qualité disponibles pour le glanage. Ex molestiae cupiditate fugiat delectus.	2025-02-22 14:12:43.088	3LwZFJrIJfoX-Ktv2614W	EWiZG2ebIC8GiML6yDIQj	t	lV0pUs3J0Kkpf7N8XXyGt	799	2025-02-22 14:12:43.088	{}
ppQZ0EBN8iVxOEjo7cNVp	Récolte solidaire de Haricots verts à Florenville	9VCWRI	341 kg de Haricots verts de excellente qualité disponibles pour le glanage. Ratione error ullam corrupti.	2025-02-22 14:12:43.09	J3Ee9SwlCuJa9zPb6P0MM	UKXhJ6gHVOfZZeTE1vREF	t	s5IuZ0KU1iWf5rGIwzNc3	470	2025-02-22 14:12:43.09	{}
2phuQfXKz4nl_mM5muiDN	Cueillette de Carottes à Sainte-Ode	Ghrpq6	370 kg de Carottes de excellente qualité disponibles pour le glanage. Magni ipsum officiis nulla.	2025-02-22 14:12:43.089	NM5e2trpKlZJ_O6tev2nr	S8uBsYznnHDfgYWbRzfId	t	oGxVLS_M1DwYi8FazDcal	997	2025-02-22 14:12:43.089	{}
iRnhK3ZUexr0HPTRATD2K	Glanage de Pommes à Erquelinnes	WrBE05	251 kg de Pommes de satisfaisante qualité disponibles pour le glanage. Ea vel perferendis aliquam voluptatibus atque.	2025-02-22 14:12:43.089	3LwZFJrIJfoX-Ktv2614W	GwbDq9yKS06Cc1XKpD0gg	t	1ek9fQCkFVKKqE700NmEr	617	2025-02-22 14:12:43.089	{}
UNesA6JeouCfaD6g75bUk	Récolte solidaire de Framboises à QuaregnonSud	uaz6FT	471 kg de Framboises de excellente qualité disponibles pour le glanage. Provident quo incidunt perferendis nihil occaecati dolorem est placeat.	2025-02-22 14:12:43.089	wmJRwPm8XHPJVfWLzF_ek	v2d7GNgWbpJZpUgW5ZPPt	t	71Ow35rP5LZtrCl_9edNW	63	2025-02-22 14:12:43.089	{}
2mJV3Zz3M2i_APe2WKGoA	Glanage de Citrouilles à Comines-Warneton	5c1prG	171 kg de Citrouilles de satisfaisante qualité disponibles pour le glanage. Nisi rerum vero autem libero sequi.	2025-02-22 14:12:43.088	wMC-dRrH0DlFZ44Ac-XDJ	5e-Ytn8k06JgNxpl3kzRN	t	lV0pUs3J0Kkpf7N8XXyGt	848	2025-02-22 14:12:43.088	{}
e6r8LuJgaWcjU42lwS5eU	Glanage de Oignons à Seraing	kbZaPL	185 kg de Oignons de bonne qualité disponibles pour le glanage. Perferendis quia saepe ut in eos temporibus.	2025-02-22 14:12:43.089	BOVjSpn9LbSWw2TKBz7cL	WwTJgw6rG8eNQxZyCgDTa	t	JwAPJpRCZ-fJAGXkWKL7Z	361	2025-02-22 14:12:43.089	{}
LRQBM9v5m0N0z-kORmBym	Cueillette de Haricots verts à Sombreffe	fJOmU8	333 kg de Haricots verts de excellente qualité disponibles pour le glanage. Dolorum fugit aperiam error explicabo blanditiis eveniet nesciunt.	2025-02-22 14:12:43.088	J3Ee9SwlCuJa9zPb6P0MM	IRTy4cJOdc57Eqc34qcBj	t	lV0pUs3J0Kkpf7N8XXyGt	211	2025-02-22 14:12:43.088	{}
zwD0zc74Y7HIWaW4xbfeS	Récolte solidaire de Maïs à Wavreplage	mFDyDU	181 kg de Maïs de excellente qualité disponibles pour le glanage. Alias autem nostrum dignissimos unde recusandae ab minus ipsum maxime.	2025-02-22 14:12:43.089	n66iRTQgdLFKmZGD199NR	I-ohskQEUWpxogJ-BoWQl	t	oGxVLS_M1DwYi8FazDcal	883	2025-02-22 14:12:43.089	{}
qkPrIOzHNfjHTeBOLVWIS	Récolte solidaire de Brocolis à Pont-à-celles	s0HmrG	89 kg de Brocolis de bonne qualité disponibles pour le glanage. Assumenda voluptatibus enim inventore omnis alias nihil itaque earum.	2025-02-22 14:12:43.089	s-1VEetXxifPenKuni0Es	o_irxJee5ECrgqgpkW058	t	FcKuqR_ga5aYHkIemUfD-	107	2025-02-22 14:12:43.089	{}
hDlmu5xi6ucPuMMaPg6lZ	Cueillette de Haricots verts à Rochefort	gzENed	58 kg de Haricots verts de excellente qualité disponibles pour le glanage. Facilis architecto ullam enim ad iusto ipsum itaque.	2025-02-22 14:12:43.089	J3Ee9SwlCuJa9zPb6P0MM	J5MAWjmfp0-BiOGjvXeS6	t	kDw998LpxYkswGqfBwhVK	375	2025-02-22 14:12:43.089	{}
5fpSdMQ12zDUA30v8hxHy	Cueillette de Poires à VielsalmNord	mDa_U_	241 kg de Poires de bonne qualité disponibles pour le glanage. Veniam architecto expedita eum.	2025-02-22 14:12:43.09	Izw9ye-VB_NHoqxJX5d-u	McN6NpjvGWSAOTsyQOimg	t	rgVT7JF1blWKZkHHXu5hv	190	2025-02-22 14:12:43.09	{}
RbURtIE6B-a1AkuKenD6Y	Glanage de Poivrons à ArlonNord	uyDY6b	93 kg de Poivrons de satisfaisante qualité disponibles pour le glanage. Nihil porro minus repudiandae illo.	2025-02-22 14:12:43.09	wfQ4P8W3pmReXejYJpAsb	QrpEFs-x9v0bT9Oc-SBSL	t	ohWe6fKIBDEBVBmPMlrxP	191	2025-02-22 14:12:43.09	{}
fzVGDzQMEj6SuoZ2SwbZj	Cueillette de Concombres à Florenvillecentre	kzf2ba	53 kg de Concombres de satisfaisante qualité disponibles pour le glanage. Voluptatum aperiam perferendis accusantium distinctio veritatis.	2025-02-22 14:12:43.09	tFMr5xvKV1eyeppsRpFQz	RAIptixI0Oe915-LafYp6	t	zINn-Tc0weellTesCUD8w	382	2025-02-22 14:12:43.09	{}
Z9IWUFemRgdlAUA2exU9w	Cueillette de Courgettes à LégliseSud	hqkBlS	236 kg de Courgettes de bonne qualité disponibles pour le glanage. Ratione culpa et incidunt quis tempora.	2025-02-22 14:12:43.09	bgHTxYvS43U8MCchXGI6u	ds9W1PKaAjmaJmn2nZaZP	t	qkZp1bGNi99kS6dH0i9aJ	823	2025-02-22 14:12:43.09	{}
0hrQAdv-ZSSt4vFfMWGrB	Récolte solidaire de Pommes de terre à Hamoirplage	Sky_wP	464 kg de Pommes de terre de satisfaisante qualité disponibles pour le glanage. Id at voluptas nostrum quaerat blanditiis.	2025-02-22 14:12:43.09	AcYKjZK7Bwx5Sae2PkM3O	wWY7AeJQ9qSWbNwsiMhDo	t	ohWe6fKIBDEBVBmPMlrxP	335	2025-02-22 14:12:43.09	{}
NXgvz4jDKfrEifJT6U6zm	Récolte solidaire de Piments à ProfondevilleSud	sqfJmx	474 kg de Piments de excellente qualité disponibles pour le glanage. Culpa aliquid deserunt corporis.	2025-02-22 14:12:43.09	8HLo1CywSD1SlNGX_1A2n	LrrnNZ2FImiNxdC_DVbJs	t	i2CHfTHszwJCe_3zFZa2R	755	2025-02-22 14:12:43.09	{}
_sRAuMKiqFb82KP6NWkp5	Récolte solidaire de Asperges à Eupen	H6yl5A	383 kg de Asperges de bonne qualité disponibles pour le glanage. Perspiciatis rem voluptatum ex non.	2025-02-22 14:12:43.09	wOVQYTEjlYWzaLgLRqDwK	X3dsl5oHptTpTrEUWgzvX	t	parLefUsPQPvgIKscFuPY	316	2025-02-22 14:12:43.09	{}
TbOTlviCAg_aydN4g_Nw0	Cueillette de Betteraves à Comblain-au-PontSud	ju-BMK	243 kg de Betteraves de excellente qualité disponibles pour le glanage. Quidem architecto veritatis excepturi maiores placeat fuga rem nihil est.	2025-02-22 14:12:43.09	M40RGgpJoOLEKUIibepGl	3uIVibC0wCtw_deEi2vhB	t	dTaLyNXl7V2K55YGbLHvB	175	2025-02-22 14:12:43.09	{}
dFgF-OJWG3TxmrRS_NE6d	Récolte solidaire de Cerises à Chaumont-Gistouxcentre	k_Jadm	83 kg de Cerises de satisfaisante qualité disponibles pour le glanage. Temporibus sequi laboriosam nihil rem.	2025-02-22 14:12:43.09	K6WaRBvMDjctbFMntkM7b	3YeSjX9clyLePpedPNg3t	t	URBfjrmCALpLD3arTBAJS	94	2025-02-22 14:12:43.09	{}
_staYYIPRFdrPytEYjPR4	Glanage de Raisins à Gemblouxcentre	H7kkN1	191 kg de Raisins de excellente qualité disponibles pour le glanage. Sint quibusdam eos dicta iusto sequi.	2025-02-22 14:12:43.09	uP_oPzHBLI_sCWGJcdQjf	nFjbBRh5UPMwRIkTVyoTO	t	i-Je7_EXJ1058I-TMNiav	84	2025-02-22 14:12:43.09	{}
xq-V5AMQpEVc9mWkAker3	Cueillette de Mûres à Le Roeulx	mYF1IQ	54 kg de Mûres de excellente qualité disponibles pour le glanage. Neque amet temporibus.	2025-02-22 14:12:43.09	Md6Lng_5df3846_hxFzin	IrgUkVshZgADm3rWYog60	t	zXPTmsW-T2N3idsEc6fos	400	2025-02-22 14:12:43.09	{}
ebE-lDixF4g0BSiOojFic	Cueillette de Raisins à Jemeppe-sur-SambreSud	9Pty8C	499 kg de Raisins de excellente qualité disponibles pour le glanage. Inventore ipsam ea perspiciatis quisquam iusto iure.	2025-02-22 14:12:43.091	uP_oPzHBLI_sCWGJcdQjf	jZNfL6UdtWfZa7MjeDBux	t	wfmDD0c9hBfJvty4WZwGk	197	2025-02-22 14:12:43.091	{}
lYgnnJ2vt5Z1jICs5a851	Cueillette de Maïs à Anthisnes	98DvA7	224 kg de Maïs de satisfaisante qualité disponibles pour le glanage. Inventore magnam itaque quos recusandae.	2025-02-22 14:12:43.091	n66iRTQgdLFKmZGD199NR	a-fUiC7HgKrfYMkypOfA-	t	px9HOKI_UpBFAfUTlV6Q2	885	2025-02-22 14:12:43.091	{}
hfsURvFDxaGJDjGhSt-4H	Récolte solidaire de Mûres à Le Roeulx	o2-_Wi	61 kg de Mûres de satisfaisante qualité disponibles pour le glanage. A repellat consectetur ipsum eveniet.	2025-02-22 14:12:43.091	Md6Lng_5df3846_hxFzin	BOpg03Wk_nAJQ-NaWMaCE	t	TRC71SAKv_J3g_OLcaR81	357	2025-02-22 14:12:43.091	{}
Xr2DG96eCesYj6CbeJRPI	Cueillette de Piments à Charleroicentre	be5Zwu	135 kg de Piments de bonne qualité disponibles pour le glanage. Officiis recusandae id aperiam soluta odit rerum.	2025-02-22 14:12:43.09	8HLo1CywSD1SlNGX_1A2n	70_Da5DbjlczNlxcq6tf5	t	vB9iiQwHG5E2UIGL_A3_2	660	2025-02-22 14:12:43.09	{}
mjqGmqjSW4A0-Ep0Uu1_1	Récolte solidaire de Poivrons à Vaux-sur-Sûre	K7E_gi	136 kg de Poivrons de bonne qualité disponibles pour le glanage. Reiciendis soluta rem nesciunt nobis eaque repellendus aut veritatis voluptas.	2025-02-22 14:12:43.09	wfQ4P8W3pmReXejYJpAsb	Y6qpiSkIGybn0wtd1ddw1	t	D8wtot51RwOm5xWlSiNIK	224	2025-02-22 14:12:43.09	{}
ePJhPv7abpQnDzZTIlKVA	Récolte solidaire de Framboises à Comines-Warnetoncentre	odNj6-	299 kg de Framboises de excellente qualité disponibles pour le glanage. Maxime temporibus laborum ipsa excepturi recusandae ut.	2025-02-22 14:12:43.09	wmJRwPm8XHPJVfWLzF_ek	DYOMpvsvCfZxftZ-wUGRf	t	3Tf6Zl9FLxW2K32Foi7IN	204	2025-02-22 14:12:43.09	{}
XmUu9isiAhmW32xZH4ZZk	Cueillette de Pommes à Leuze-en-Hainaut	3RpIrV	496 kg de Pommes de satisfaisante qualité disponibles pour le glanage. Incidunt labore fugit.	2025-02-22 14:12:43.09	3LwZFJrIJfoX-Ktv2614W	5CBGs8uA3-50Sh8Yt6H0T	t	9NwU2_sA-mig4BRap4WZs	905	2025-02-22 14:12:43.09	{}
2BF-SOEZmuZoYEO00D-O5	Glanage de Maïs à Raerenplage	ZITycX	423 kg de Maïs de satisfaisante qualité disponibles pour le glanage. Quaerat ducimus quisquam fuga expedita.	2025-02-22 14:12:43.091	n66iRTQgdLFKmZGD199NR	wc80BnjXaGE61R4lEiC1N	t	7lvYzovKiZ5AO6uZl11ws	360	2025-02-22 14:12:43.091	{}
4d8KAh4jq_eb_gghsG_Z8	Glanage de Poivrons à Charleroicentre	BgqRYY	158 kg de Poivrons de satisfaisante qualité disponibles pour le glanage. A dolores quas beatae adipisci commodi sunt.	2025-02-22 14:12:43.091	wfQ4P8W3pmReXejYJpAsb	dfXarJXdM7KUYExw19SsB	t	qpOxI3xxaWghTx_AhHJFf	532	2025-02-22 14:12:43.091	{}
WB3e4Lw8_uHRtmBPct5I_	Glanage de Concombres à Dinant	YeE0iz	348 kg de Concombres de bonne qualité disponibles pour le glanage. Quae et aliquam beatae labore.	2025-02-22 14:12:43.09	tFMr5xvKV1eyeppsRpFQz	JMfK4az7iLT48B5yT73gf	t	i2CHfTHszwJCe_3zFZa2R	581	2025-02-22 14:12:43.09	{}
UecA0lsgs4MfsKUspmTXG	Récolte solidaire de Poivrons à Seraing	I1IBwE	158 kg de Poivrons de excellente qualité disponibles pour le glanage. Cupiditate exercitationem officiis impedit rem quisquam.	2025-02-22 14:12:43.09	wfQ4P8W3pmReXejYJpAsb	mTVbJMFgxS6muVcMNacoq	t	vB9iiQwHG5E2UIGL_A3_2	988	2025-02-22 14:12:43.09	{}
Af_xhEH-w4oh-8mNII6ml	Glanage de Haricots verts à Braives	ysQpkv	186 kg de Haricots verts de bonne qualité disponibles pour le glanage. Officia beatae sequi sapiente at cumque sed molestiae non nulla.	2025-02-22 14:12:43.09	J3Ee9SwlCuJa9zPb6P0MM	2xZHhKQ6aoDtmtqYlSKTy	t	XyPJvusDvggrs3XJUhQ_9	442	2025-02-22 14:12:43.09	{}
9lH2MxAfDorT-Bj_52IKb	Cueillette de Fraises à Eupen	L51NpE	180 kg de Fraises de satisfaisante qualité disponibles pour le glanage. Omnis nesciunt dolorem rerum.	2025-02-22 14:12:43.09	Hsd7_4oJ994yGzAHQ3BXT	iynGBTHajJFsEuWvlrUbw	t	GIJQxS94O41YSHBKKRIgp	382	2025-02-22 14:12:43.09	{}
PDutvax019TIxfo26I1IN	Glanage de Courgettes à La Louvièreplage	gQlw-V	450 kg de Courgettes de bonne qualité disponibles pour le glanage. Rerum fugit quibusdam soluta doloremque laborum voluptatum repudiandae dolorem.	2025-02-22 14:12:43.091	bgHTxYvS43U8MCchXGI6u	J4B9MymLids6LC28TIn_N	t	F0JxUXRuxdUVVlj0sLoF2	290	2025-02-22 14:12:43.091	{}
lxHVm4mR19FlJQrnAda9C	Cueillette de Pommes de terre à Aywaille	Xtv5b0	442 kg de Pommes de terre de excellente qualité disponibles pour le glanage. Quae animi dicta occaecati labore suscipit mollitia.	2025-02-22 14:12:43.091	AcYKjZK7Bwx5Sae2PkM3O	Ed4LIh9TdZMCe9zY3BFtQ	t	Ezl9RkmBFPOFHKKD-ozIV	454	2025-02-22 14:12:43.091	{}
hfuyfTwc3egGJE0pEz3h0	Cueillette de Aubergines à Anderluescentre	1toK6i	207 kg de Aubergines de bonne qualité disponibles pour le glanage. Excepturi tempora consectetur molestiae dicta ipsam accusantium repudiandae.	2025-02-22 14:12:43.091	lTC2NG4MW6EAj9Ld-ZGHQ	7lEucAm4sziqgWMdwdOGT	t	P72hU5H8q9cZ7f1ghTHbL	454	2025-02-22 14:12:43.091	{}
STOH5L2a1GAAOIqzD4flI	Cueillette de Épinards à Chastreplage	9CMpsg	134 kg de Épinards de satisfaisante qualité disponibles pour le glanage. Atque eligendi at.	2025-02-22 14:12:43.09	bMPL6Qm_jFXo7stCjsrL6	9u2WnVff0XeBH1pt-IDK9	t	JwAPJpRCZ-fJAGXkWKL7Z	144	2025-02-22 14:12:43.09	{}
f8gqC7W8XWhbVjvMYXNmG	Glanage de Cerises à Vielsalm	v7zrGg	261 kg de Cerises de bonne qualité disponibles pour le glanage. At vero consequatur earum consequatur culpa sed iste corporis aspernatur.	2025-02-22 14:12:43.09	K6WaRBvMDjctbFMntkM7b	hKA0lIlOmlxQ5ZRRjCCCi	t	qkZp1bGNi99kS6dH0i9aJ	692	2025-02-22 14:12:43.09	{}
0a3HdSxD6gJJrZ1V_d1ny	Récolte solidaire de Brocolis à Morlanwelz	8K8XAP	342 kg de Brocolis de excellente qualité disponibles pour le glanage. Sapiente fuga doloremque atque.	2025-02-22 14:12:43.09	s-1VEetXxifPenKuni0Es	bPH6GGEx5u_mEC8rRd9be	t	lVbXOcsEkm4f2cvPqNBkk	989	2025-02-22 14:12:43.09	{}
JljVHt61gMmIt-9k0S2zi	Cueillette de Poivrons à Lessinescentre	bzzBn2	433 kg de Poivrons de satisfaisante qualité disponibles pour le glanage. Ipsum aliquam iste reiciendis.	2025-02-22 14:12:43.09	wfQ4P8W3pmReXejYJpAsb	VUnJlfJ0C2LKCHECC9-9t	t	G8SSJTwWK5vhwrjLXPi97	353	2025-02-22 14:12:43.09	{}
T_gUz4pDq1h0QwzmLOk6M	Récolte solidaire de Poivrons à HamoisSud	W7kJfH	481 kg de Poivrons de satisfaisante qualité disponibles pour le glanage. Odio magnam facilis consectetur impedit.	2025-02-22 14:12:43.09	wfQ4P8W3pmReXejYJpAsb	rfKV_WrgGKx_uiB1dq2pP	t	F0JxUXRuxdUVVlj0sLoF2	189	2025-02-22 14:12:43.09	{}
_PxGjoNhr_JVCbrR4OshX	Cueillette de Épinards à HonnellesNord	J18gye	500 kg de Épinards de bonne qualité disponibles pour le glanage. Aliquam maxime ullam modi veniam ratione praesentium.	2025-02-22 14:12:43.091	bMPL6Qm_jFXo7stCjsrL6	0yFIrzfjUcEKUap-jLmt9	t	c9qiER6Tva0mqYJEjFQ4-	376	2025-02-22 14:12:43.091	{}
TbroWkkhGNI9ohebhZUVy	Cueillette de Choux-fleurs à Tintignyplage	ssqawm	330 kg de Choux-fleurs de excellente qualité disponibles pour le glanage. Libero voluptatibus quidem tempore nam accusantium voluptas saepe non.	2025-02-22 14:12:43.091	FyXCWu5iojd28394U0qld	ZWma3qJbFDo3G07Mi6Gh7	t	kADWqIx_xfv-eaghFqbDC	767	2025-02-22 14:12:43.091	{}
Kb3bSLlmogWuj9dxQIt2-	Glanage de Cerises à Fauvillers	NE8XLH	481 kg de Cerises de satisfaisante qualité disponibles pour le glanage. Dicta ipsum ullam fugit illo amet facere vel ullam.	2025-02-22 14:12:43.09	K6WaRBvMDjctbFMntkM7b	6tp4uI9B2cwYtX3SlJXm_	t	pqmZINdePlg38vTQ2WAAA	345	2025-02-22 14:12:43.09	{}
iPErNrc070AIGHWM5v-L7	Glanage de Poires à Estaimpuisplage	Q9JBRU	479 kg de Poires de bonne qualité disponibles pour le glanage. Dignissimos sed neque ex doloremque.	2025-02-22 14:12:43.09	Izw9ye-VB_NHoqxJX5d-u	XNU-DSArghWOq145JUaIX	t	7M3Xgz_SkCK_FWuWXv69A	840	2025-02-22 14:12:43.09	{}
-cg1y9j0qRrSah_1O3ZsJ	Glanage de Tomates à FlorennesNord	AAtjEm	301 kg de Tomates de bonne qualité disponibles pour le glanage. Minima exercitationem repellat doloribus sed accusantium hic placeat nemo.	2025-02-22 14:12:43.09	8NnSiSvOIDFBzQyYS8aBt	ClnKc4041mRBYye-WJjzt	t	2zZNda28L4ZJ8KDFPJBvZ	335	2025-02-22 14:12:43.09	{}
Rw49gQGGyPSFLy7tqWdj8	Cueillette de Maïs à Aywailleplage	YqccT5	426 kg de Maïs de satisfaisante qualité disponibles pour le glanage. Nisi excepturi magnam maxime consectetur eius enim repudiandae sed perspiciatis.	2025-02-22 14:12:43.09	n66iRTQgdLFKmZGD199NR	PlWOiUQhqo4oYaq_LzLvU	t	9NwU2_sA-mig4BRap4WZs	539	2025-02-22 14:12:43.09	{}
iFY-_dF-qeg49wbA3ehga	Récolte solidaire de Piments à Péruwelzcentre	BwlDag	468 kg de Piments de excellente qualité disponibles pour le glanage. Et optio omnis eos consectetur.	2025-02-22 14:12:43.091	8HLo1CywSD1SlNGX_1A2n	YkSt75diZaWRczXN7UfSu	t	-kiPtRC9MnrNrFzVDqsGU	458	2025-02-22 14:12:43.091	{}
y_CR6-fRGBJyOjA6iK1QU	Récolte solidaire de Choux-fleurs à Spa	8bAxSI	340 kg de Choux-fleurs de bonne qualité disponibles pour le glanage. Provident ratione facere quia.	2025-02-22 14:12:43.091	FyXCWu5iojd28394U0qld	sU1Ja2_DjHu-FffmR8eyd	t	qpOxI3xxaWghTx_AhHJFf	961	2025-02-22 14:12:43.091	{}
RIsZgMg6JktdC-hsDV5qn	Récolte solidaire de Oignons à PerwezNord	RDRCN_	406 kg de Oignons de satisfaisante qualité disponibles pour le glanage. Eveniet architecto libero itaque animi recusandae quibusdam.	2025-02-22 14:12:43.091	BOVjSpn9LbSWw2TKBz7cL	JILZJvXpiSDYc7gqvAnag	t	TRC71SAKv_J3g_OLcaR81	310	2025-02-22 14:12:43.091	{}
-XXQJQH2QZmNeoStrCqKv	Récolte solidaire de Maïs à DourSud	GtUPHN	284 kg de Maïs de bonne qualité disponibles pour le glanage. Amet aperiam quidem repellendus quod praesentium.	2025-02-22 14:12:43.09	n66iRTQgdLFKmZGD199NR	i3xkNAK7akxhuZwyJLqyN	t	FcKuqR_ga5aYHkIemUfD-	305	2025-02-22 14:12:43.09	{}
_6qXgSFAqLDWc7HONDRB6	Glanage de Épinards à Frasnes-lez-AnvaingSud	ipniAW	110 kg de Épinards de excellente qualité disponibles pour le glanage. Rem iusto nulla amet.	2025-02-22 14:12:43.09	bMPL6Qm_jFXo7stCjsrL6	2VVVgiG25Mm2TF9D2_CUb	t	3Tf6Zl9FLxW2K32Foi7IN	504	2025-02-22 14:12:43.09	{}
vBV47jcbiomT8ZOaGA16k	Glanage de Aubergines à Manage	brx6-s	275 kg de Aubergines de excellente qualité disponibles pour le glanage. Ratione unde eligendi dolorem nihil laborum eius ullam.	2025-02-22 14:12:43.09	lTC2NG4MW6EAj9Ld-ZGHQ	hm6GNMpfqTf84ST22X86Q	t	XyPJvusDvggrs3XJUhQ_9	256	2025-02-22 14:12:43.09	{}
CLTeqQb13pUifhxKoS8xu	Cueillette de Raisins à Momignies	9ePg54	466 kg de Raisins de excellente qualité disponibles pour le glanage. Impedit assumenda sit repudiandae nostrum sapiente adipisci.	2025-02-22 14:12:43.09	uP_oPzHBLI_sCWGJcdQjf	YXaxDaNPPnwrQlanhzca4	t	SVyHqJ5Y2dE1CsnN15ngx	238	2025-02-22 14:12:43.09	{}
uZAzuAEYOtQsUkGwyBx3M	Glanage de Citrouilles à Walcourtplage	pPeWi4	373 kg de Citrouilles de excellente qualité disponibles pour le glanage. Eligendi molestias corrupti sit numquam magni modi tempore consequatur totam.	2025-02-22 14:12:43.091	wMC-dRrH0DlFZ44Ac-XDJ	7cl-LW0aOFgabP0J5NMCZ	t	z7uypMyywv3hDHgKVVldC	800	2025-02-22 14:12:43.091	{}
RYZFEnhqdqOvE7IOQkeL7	Cueillette de Aubergines à Durbuyplage	c0VHSx	123 kg de Aubergines de satisfaisante qualité disponibles pour le glanage. Deserunt dicta natus sunt deserunt fugit molestiae blanditiis beatae praesentium.	2025-02-22 14:12:43.091	lTC2NG4MW6EAj9Ld-ZGHQ	aYBNc4G3GGqwAMVWfKkV3	t	lgm9bh82Tr9B74r7Dx8AS	418	2025-02-22 14:12:43.091	{}
kWA0fPaZsTYelJrjsmw54	Récolte solidaire de Haricots verts à Court-Saint-Etienne	a7fW09	105 kg de Haricots verts de satisfaisante qualité disponibles pour le glanage. Quia libero iure delectus atque quas nesciunt saepe est perspiciatis.	2025-02-22 14:12:43.09	J3Ee9SwlCuJa9zPb6P0MM	YuOJWxyxg_Mzq-YBN9Alf	t	qkZp1bGNi99kS6dH0i9aJ	290	2025-02-22 14:12:43.09	{}
woUYtfeKDDDP9rMOU5N00	Récolte solidaire de Piments à Rouvroy	cB6F7u	458 kg de Piments de bonne qualité disponibles pour le glanage. Culpa aut doloribus totam illo sint suscipit.	2025-02-22 14:12:43.09	8HLo1CywSD1SlNGX_1A2n	FHHeFa66iZq5z-IjwvDR3	t	3Tf6Zl9FLxW2K32Foi7IN	582	2025-02-22 14:12:43.09	{}
UDjJgC3bfbMfpUdTxiDdt	Récolte solidaire de Pommes de terre à HuySud	HzDKcw	468 kg de Pommes de terre de excellente qualité disponibles pour le glanage. Consequatur ut explicabo.	2025-02-22 14:12:43.09	AcYKjZK7Bwx5Sae2PkM3O	WZu1-2Ngml78WCKcLvDXj	t	XyPJvusDvggrs3XJUhQ_9	188	2025-02-22 14:12:43.09	{}
mq9znd0d0U4Lz_oNRx5Rc	Cueillette de Brocolis à Fernelmont	J_5KNG	448 kg de Brocolis de excellente qualité disponibles pour le glanage. Veniam alias tempora id id aliquid voluptas at.	2025-02-22 14:12:43.09	s-1VEetXxifPenKuni0Es	QzM1vx-ttidyJmR6po2im	t	s5IuZ0KU1iWf5rGIwzNc3	285	2025-02-22 14:12:43.09	{}
bqCEmwlKkuPvyw_BG_o23	Cueillette de Pommes à Bertogne	quOJdo	447 kg de Pommes de bonne qualité disponibles pour le glanage. Cumque porro maxime adipisci officia.	2025-02-22 14:12:43.091	3LwZFJrIJfoX-Ktv2614W	8aj1ggAQEvg7yHPJktqVA	t	gTi7k9rbEHJ6MboiOfLF_	423	2025-02-22 14:12:43.091	{}
iY8GqXzNJ9k0CYa6CIjd_	Glanage de Pommes de terre à Villers-la-VilleSud	Aye_vs	334 kg de Pommes de terre de bonne qualité disponibles pour le glanage. Alias esse aut distinctio quibusdam.	2025-02-22 14:12:43.091	AcYKjZK7Bwx5Sae2PkM3O	ahRBm_IE225pYiL7O3vAM	t	lgm9bh82Tr9B74r7Dx8AS	389	2025-02-22 14:12:43.091	{}
JA1AakV9nIJBbBpNo_Xmb	Glanage de Courgettes à Viroinval	QEWBhy	312 kg de Courgettes de bonne qualité disponibles pour le glanage. Doloremque odio enim adipisci dolorum officia accusantium laboriosam similique.	2025-02-22 14:12:43.091	bgHTxYvS43U8MCchXGI6u	uYUHXoVvI-oXQ1rIpjl_Y	t	hqUr9AznCFGLWEft00-6X	926	2025-02-22 14:12:43.091	{}
2oSAE55ybgvklIuz9tyU-	Glanage de Poireaux à SillySud	5ga8uE	228 kg de Poireaux de excellente qualité disponibles pour le glanage. Corrupti adipisci recusandae nostrum ut consequuntur vitae consequuntur atque.	2025-02-22 14:12:43.09	B7SmvndyIUHNnkU7J7oq_	1sjUjxS0Xy56VNBkXpW9z	t	0JktpnUT5crbm3tnY_u3e	997	2025-02-22 14:12:43.09	{}
hTBBeMQPDnBenBvHnw0ii	Récolte solidaire de Framboises à Libin	kZdeMv	480 kg de Framboises de excellente qualité disponibles pour le glanage. Occaecati sequi ratione quibusdam asperiores explicabo aliquid laudantium accusamus.	2025-02-22 14:12:43.09	wmJRwPm8XHPJVfWLzF_ek	FIqWbJsAs1ETnDDNDHiAy	t	SyqfzOLsFarxWvRtr6xZl	801	2025-02-22 14:12:43.09	{}
8tYlrW76mItRincjRI5-2	Cueillette de Aubergines à DaverdisseSud	IQe6QD	301 kg de Aubergines de bonne qualité disponibles pour le glanage. Soluta officia ad ea perferendis.	2025-02-22 14:12:43.09	lTC2NG4MW6EAj9Ld-ZGHQ	gyVLffCKzLR8xTuvebEqh	t	5saKcxS16EzHbDfZC0Avd	673	2025-02-22 14:12:43.09	{}
JJKN3jdlt32rSeJ1AphOb	Glanage de Haricots verts à Beyne-Heusay	z7n1Wz	346 kg de Haricots verts de bonne qualité disponibles pour le glanage. Expedita dicta dolor nam similique exercitationem.	2025-02-22 14:12:43.09	J3Ee9SwlCuJa9zPb6P0MM	ShPFLf--MI3QMLP9h2vA9	t	GIJQxS94O41YSHBKKRIgp	585	2025-02-22 14:12:43.09	{}
vgtI4Nw6SrWDtdCnAz4RD	Récolte solidaire de Salades à Saint-LégerNord	JvTTC6	264 kg de Salades de satisfaisante qualité disponibles pour le glanage. Numquam distinctio tenetur nemo rerum.	2025-02-22 14:12:43.091	itERaDH6dUFjWofXMCin2	2ywK70gxBoaszjsn8tAAY	t	-kiPtRC9MnrNrFzVDqsGU	768	2025-02-22 14:12:43.091	{}
zD9VggK6BK_yPRoe4mpGe	Cueillette de Courges à La HulpeSud	ErDKJR	219 kg de Courges de excellente qualité disponibles pour le glanage. Repellendus in amet eligendi ullam et sit molestiae.	2025-02-22 14:12:43.09	mUFNRejDdkIvvGJDR_fQj	l-z_QKlfuSnRChQXN9GEJ	t	93ATPOdykAl5vCfjDk9ax	782	2025-02-22 14:12:43.09	{}
DVo_TNjg5who4HgI-2Zud	Cueillette de Épinards à ManageNord	oWQ1WE	335 kg de Épinards de satisfaisante qualité disponibles pour le glanage. Quisquam omnis adipisci.	2025-02-22 14:12:43.09	bMPL6Qm_jFXo7stCjsrL6	sCGjQFkPsRQWPfW3VC6T_	t	7M3Xgz_SkCK_FWuWXv69A	351	2025-02-22 14:12:43.09	{}
JUws0qhYyaidNKTZCBBQP	Récolte solidaire de Aubergines à Brugelette	iL-uhg	257 kg de Aubergines de bonne qualité disponibles pour le glanage. Reprehenderit molestiae harum officia fuga ad delectus quisquam perspiciatis.	2025-02-22 14:12:43.09	lTC2NG4MW6EAj9Ld-ZGHQ	G3kwXHLZkFVyVAVLXsjnK	t	5saKcxS16EzHbDfZC0Avd	615	2025-02-22 14:12:43.09	{}
a2JyLo1XT8U4sj41J-Qxu	Récolte solidaire de Poireaux à LégliseSud	xXRfqj	187 kg de Poireaux de satisfaisante qualité disponibles pour le glanage. Cumque eius architecto asperiores alias ab provident adipisci tempore.	2025-02-22 14:12:43.09	B7SmvndyIUHNnkU7J7oq_	2hGa0SAKvdCceRajyCHfs	t	uJBicvPDE47w6xZK6LH-d	569	2025-02-22 14:12:43.09	{}
Se9j6dgcU8ztfkGNEGsuA	Récolte solidaire de Salades à Tintigny	85UGB-	185 kg de Salades de excellente qualité disponibles pour le glanage. Ut quasi error sequi.	2025-02-22 14:12:43.091	itERaDH6dUFjWofXMCin2	AUjP9yHx78EOmT7vWkf3c	t	z7uypMyywv3hDHgKVVldC	584	2025-02-22 14:12:43.091	{}
WtsUu45cytRzZu8j7aJMr	Cueillette de Maïs à Bertogneplage	9SITL_	224 kg de Maïs de bonne qualité disponibles pour le glanage. Ab dignissimos doloremque voluptatem hic natus dolores.	2025-02-22 14:12:43.091	n66iRTQgdLFKmZGD199NR	x36cogDJb9EK7cGXN2t8H	t	3g0eBUuFJFI8nj4t0wNn1	651	2025-02-22 14:12:43.091	{}
SDXePMW5CLhEavcJu8SO4	Récolte solidaire de Poivrons à La Calamineplage	r2C3VZ	113 kg de Poivrons de bonne qualité disponibles pour le glanage. Architecto hic sint optio maxime quisquam dolorum explicabo sunt.	2025-02-22 14:12:43.09	wfQ4P8W3pmReXejYJpAsb	jqYF13a_0Zv-d-SAy916V	t	LpvL2riLWPjTfhgcuqqeB	208	2025-02-22 14:12:43.09	{}
bxUmqGXYNbJNsUjC7x_lz	Cueillette de Poivrons à Waterlooplage	_76Ig_	482 kg de Poivrons de satisfaisante qualité disponibles pour le glanage. Quisquam perferendis facilis numquam est.	2025-02-22 14:12:43.09	wfQ4P8W3pmReXejYJpAsb	S8wOpcS1dtAKdtAIvqLqx	t	parLefUsPQPvgIKscFuPY	965	2025-02-22 14:12:43.09	{}
seVzrO7M1VwDUZKh3YeWu	Récolte solidaire de Salades à Tinlot	QIKC7K	179 kg de Salades de satisfaisante qualité disponibles pour le glanage. Maiores eum praesentium voluptatum.	2025-02-22 14:12:43.09	itERaDH6dUFjWofXMCin2	pwq9-uirdJZYbtIfeOxad	t	LpvL2riLWPjTfhgcuqqeB	193	2025-02-22 14:12:43.09	{}
PzuGdErwYJjgVb-tiNwNJ	Glanage de Piments à Geer	3hlKvx	462 kg de Piments de bonne qualité disponibles pour le glanage. Harum exercitationem alias vel natus doloribus nisi ab.	2025-02-22 14:12:43.09	8HLo1CywSD1SlNGX_1A2n	4M7zHlFF7gpMQVf5ImezC	t	9LYH4KAEavh0Z7bX_012q	607	2025-02-22 14:12:43.09	{}
0UpZuQ59LuhpDVaAkyXKN	Cueillette de Pommes à JodoigneNord	DZKs33	70 kg de Pommes de satisfaisante qualité disponibles pour le glanage. Architecto quidem quod.	2025-02-22 14:12:43.09	3LwZFJrIJfoX-Ktv2614W	veG5s6dZYCa345KsxU_3v	t	SVyHqJ5Y2dE1CsnN15ngx	262	2025-02-22 14:12:43.09	{}
rp5drsdIYnZ0-5_dc4e45	Glanage de Fraises à Gouvycentre	msdwle	81 kg de Fraises de satisfaisante qualité disponibles pour le glanage. Exercitationem eos velit nisi animi ex quod.	2025-02-22 14:12:43.091	Hsd7_4oJ994yGzAHQ3BXT	-sxgEZwE7S44FFSZgdBxL	t	qpOxI3xxaWghTx_AhHJFf	762	2025-02-22 14:12:43.091	{}
bBUngx7oAupi_cBInbLm-	Récolte solidaire de Cerises à Amblève	1ug-MS	250 kg de Cerises de satisfaisante qualité disponibles pour le glanage. Mollitia nisi laborum eos officiis architecto quos.	2025-02-22 14:12:43.091	K6WaRBvMDjctbFMntkM7b	XOxBaKZIcgufUD7ajhbNG	t	3g0eBUuFJFI8nj4t0wNn1	993	2025-02-22 14:12:43.091	{}
b6lY_Q5Ooiwhnt8lXfqp3	Glanage de Choux-fleurs à Clavier	W-X5i1	171 kg de Choux-fleurs de excellente qualité disponibles pour le glanage. Provident quibusdam fugit alias.	2025-02-22 14:12:43.09	FyXCWu5iojd28394U0qld	fd9zuzOzfHW_M0GqfEm1U	t	LpvL2riLWPjTfhgcuqqeB	1000	2025-02-22 14:12:43.09	{}
ndL1DHgeaaCjTN8RtrQ9S	Récolte solidaire de Aubergines à Sainte-Ode	_sF1Jr	380 kg de Aubergines de bonne qualité disponibles pour le glanage. Qui id et nam nihil ad consectetur debitis.	2025-02-22 14:12:43.09	lTC2NG4MW6EAj9Ld-ZGHQ	60Ef4qERctPGATdp_hMOX	t	5saKcxS16EzHbDfZC0Avd	816	2025-02-22 14:12:43.09	{}
1wNUiByRERoYMJjrhzhqk	Glanage de Mûres à Court-Saint-Etienne	g06p4x	328 kg de Mûres de bonne qualité disponibles pour le glanage. Recusandae consequuntur culpa harum odit enim doloribus possimus.	2025-02-22 14:12:43.09	Md6Lng_5df3846_hxFzin	cbQjjthUOxZfC1FwI7OJh	t	G8SSJTwWK5vhwrjLXPi97	918	2025-02-22 14:12:43.09	{}
XYGZJmkyhQ_gXWC4aC1m_	Cueillette de Courgettes à Sombreffe	kSdItb	420 kg de Courgettes de bonne qualité disponibles pour le glanage. Accusamus laudantium reiciendis consectetur aliquid quos quae quasi voluptates molestiae.	2025-02-22 14:12:43.091	bgHTxYvS43U8MCchXGI6u	kr-UNPRX4apdghbbZjcZJ	t	SVyHqJ5Y2dE1CsnN15ngx	728	2025-02-22 14:12:43.091	{}
3mcuaFEos_8fkcQ01bGJ8	Glanage de Poireaux à Chièvrescentre	sWteup	232 kg de Poireaux de excellente qualité disponibles pour le glanage. Error illum voluptatem voluptates.	2025-02-22 14:12:43.091	B7SmvndyIUHNnkU7J7oq_	M9ntsmng_Q-C5U-U78t00	t	vfResoS5rGXA2JEi2BaeU	178	2025-02-22 14:12:43.091	{}
ytjwR7Wj67ThXy1zQKqr0	Récolte solidaire de Piments à Ath	j63Bvr	184 kg de Piments de bonne qualité disponibles pour le glanage. Tempora ipsum veniam quo omnis suscipit.	2025-02-22 14:12:43.091	8HLo1CywSD1SlNGX_1A2n	jPp79ex4Ta0vuSa1lI6j4	t	TRC71SAKv_J3g_OLcaR81	884	2025-02-22 14:12:43.091	{}
DPqpsO-f5Xn0Sd0EXaqsV	Glanage de Brocolis à Burg-Reuland	8Yaq5o	216 kg de Brocolis de satisfaisante qualité disponibles pour le glanage. Numquam in quaerat quibusdam quod quis aperiam eveniet ut minus.	2025-02-22 14:12:43.09	s-1VEetXxifPenKuni0Es	NxyPzuTBZd_UkHTTRrab1	t	7M3Xgz_SkCK_FWuWXv69A	874	2025-02-22 14:12:43.09	{}
El8D_fnta4fRMTCcdIwYD	Récolte solidaire de Poires à Hensiescentre	hVVOvN	276 kg de Poires de excellente qualité disponibles pour le glanage. Ut quos quis eos facere.	2025-02-22 14:12:43.09	Izw9ye-VB_NHoqxJX5d-u	pnQSOPBJVsMH8nuqaSLrh	t	C_ylVwYqpjnkJFCJKXPkE	594	2025-02-22 14:12:43.09	{}
jYcasqpd9Uqv6GOGv5r4Y	Glanage de Choux-fleurs à Aiseau-Presles	c3Lt6N	245 kg de Choux-fleurs de excellente qualité disponibles pour le glanage. Numquam assumenda nisi alias odio deleniti dignissimos optio asperiores eius.	2025-02-22 14:12:43.09	FyXCWu5iojd28394U0qld	Tw53qMuurUUF0t7pfHPf1	t	GIJQxS94O41YSHBKKRIgp	959	2025-02-22 14:12:43.09	{}
QK9JsgH58DcjKMfBd3amT	Récolte solidaire de Mûres à Gesves	GpKyzt	253 kg de Mûres de bonne qualité disponibles pour le glanage. Magni labore non ullam accusantium voluptates est facilis.	2025-02-22 14:12:43.091	Md6Lng_5df3846_hxFzin	B5nsTvZW_M8OVe1GHdYCf	t	-kiPtRC9MnrNrFzVDqsGU	542	2025-02-22 14:12:43.091	{}
YdySePJge4-KnZk6G0zOQ	Récolte solidaire de Poires à LasneNord	fWIrRB	268 kg de Poires de bonne qualité disponibles pour le glanage. Eligendi esse id suscipit ratione mollitia tempora magnam.	2025-02-22 14:12:43.091	Izw9ye-VB_NHoqxJX5d-u	bPlpSVuBcT7UAlolNNSX6	t	Ezl9RkmBFPOFHKKD-ozIV	110	2025-02-22 14:12:43.091	{}
wHp_clEZEs28dUCuLv72c	Récolte solidaire de Aubergines à Yvoircentre	XRbd0T	349 kg de Aubergines de satisfaisante qualité disponibles pour le glanage. Nesciunt quo quos excepturi officiis praesentium vero.	2025-02-22 14:12:43.091	lTC2NG4MW6EAj9Ld-ZGHQ	uVG-jlZrq1cNv8btF-l0G	t	P72hU5H8q9cZ7f1ghTHbL	552	2025-02-22 14:12:43.091	{}
EVUieFdqw-tdjYZbpj7tA	Cueillette de Piments à Quévy	IYwq5V	266 kg de Piments de excellente qualité disponibles pour le glanage. Blanditiis qui aliquam commodi praesentium autem repellendus assumenda accusantium ab.	2025-02-22 14:12:43.09	8HLo1CywSD1SlNGX_1A2n	BVkA0-WHsaafy2L4dzfyF	t	ohWe6fKIBDEBVBmPMlrxP	514	2025-02-22 14:12:43.09	{}
bGc0d8XqeWUi2G-W1sSQV	Glanage de Fraises à AywailleSud	uHUCoG	328 kg de Fraises de excellente qualité disponibles pour le glanage. Tempore nisi magnam.	2025-02-22 14:12:43.09	Hsd7_4oJ994yGzAHQ3BXT	fUKyvm-L8OqJe80TRubhL	t	dTaLyNXl7V2K55YGbLHvB	747	2025-02-22 14:12:43.09	{}
jeLIkF8ng7C-CEkx5qUO7	Cueillette de Aubergines à Sambrevillecentre	PNzFMB	466 kg de Aubergines de excellente qualité disponibles pour le glanage. In perferendis culpa nihil eveniet quam.	2025-02-22 14:12:43.09	lTC2NG4MW6EAj9Ld-ZGHQ	DpA7PvGaKZpWTSZ0Q-9yw	t	s5IuZ0KU1iWf5rGIwzNc3	370	2025-02-22 14:12:43.09	{}
ypDXYfNEFG50Dw2gYO5aZ	Glanage de Betteraves à LincentNord	R05bTt	396 kg de Betteraves de bonne qualité disponibles pour le glanage. Quod facere vel placeat corporis magni ducimus deserunt asperiores molestias.	2025-02-22 14:12:43.091	M40RGgpJoOLEKUIibepGl	f1mc5878s1eMNWAbZ5WNu	t	Eup65cutord2omDleknSo	247	2025-02-22 14:12:43.091	{}
ggoajYtC_Ep6XZ3uUkB4U	Glanage de Pommes à Chaumont-Gistouxplage	WNNb3q	449 kg de Pommes de bonne qualité disponibles pour le glanage. Mollitia minus voluptatibus ad tenetur incidunt hic amet.	2025-02-22 14:12:43.091	3LwZFJrIJfoX-Ktv2614W	qAdH5TuuT-6Vpq_vHOHZD	t	px9HOKI_UpBFAfUTlV6Q2	476	2025-02-22 14:12:43.091	{}
Cam7xzvFjl3SvHLOx5oEv	Récolte solidaire de Citrouilles à Awans	hfESDZ	361 kg de Citrouilles de excellente qualité disponibles pour le glanage. Occaecati perspiciatis nesciunt suscipit tenetur omnis aperiam ullam excepturi iste.	2025-02-22 14:12:43.09	wMC-dRrH0DlFZ44Ac-XDJ	pqGEX_eHfU_3HD8Dyzjhc	t	C_ylVwYqpjnkJFCJKXPkE	166	2025-02-22 14:12:43.09	{}
UIrrKVIlkjDXaWfDO8aTO	Glanage de Framboises à TellinNord	1NJ9yt	230 kg de Framboises de bonne qualité disponibles pour le glanage. Voluptas illo sed officiis tenetur.	2025-02-22 14:12:43.09	wmJRwPm8XHPJVfWLzF_ek	fUtN9DUkbChz_RHlhbhLc	t	O60wJSSWwEMg7oOPDOykN	697	2025-02-22 14:12:43.09	{}
9JuIfwCQSkGlHEbO2xi_K	Glanage de Choux-fleurs à Tenneville	OcFTpJ	135 kg de Choux-fleurs de excellente qualité disponibles pour le glanage. Molestiae consequatur maxime dolorem laudantium vel.	2025-02-22 14:12:43.09	FyXCWu5iojd28394U0qld	WvlxG7yJcCadU9IOvgZs-	t	McpoM6XXIPKDUId8yw-GL	354	2025-02-22 14:12:43.09	{}
wRLgglC5vuSvkzdfmvJGC	Cueillette de Pommes de terre à EnghienNord	_mWbAz	486 kg de Pommes de terre de excellente qualité disponibles pour le glanage. Itaque aliquam tenetur dignissimos mollitia beatae enim sed optio.	2025-02-22 14:12:43.091	AcYKjZK7Bwx5Sae2PkM3O	OLH7mV0t4wwqnOcfQENqe	t	wfmDD0c9hBfJvty4WZwGk	938	2025-02-22 14:12:43.091	{}
f8PRB83eToLUM2IOl1Frz	Cueillette de Poireaux à Saint-Légercentre	sR0Clk	212 kg de Poireaux de satisfaisante qualité disponibles pour le glanage. At numquam fugit perspiciatis quis.	2025-02-22 14:12:43.091	B7SmvndyIUHNnkU7J7oq_	aSgdnxKqB27Iz5Ga9nfhy	t	c9qiER6Tva0mqYJEjFQ4-	639	2025-02-22 14:12:43.091	{}
AC0lF6uy27QJWwv28PCAR	Récolte solidaire de Citrouilles à Eupen	lmOV1s	480 kg de Citrouilles de excellente qualité disponibles pour le glanage. Soluta provident ex labore atque expedita nemo beatae.	2025-02-22 14:12:43.091	wMC-dRrH0DlFZ44Ac-XDJ	kuE1A5ltL0zYPAOoSp4sx	t	kADWqIx_xfv-eaghFqbDC	56	2025-02-22 14:12:43.091	{}
-CFbkdRcURKdVOjrLUJx9	Récolte solidaire de Brocolis à Comines-Warnetonplage	F9S-vO	333 kg de Brocolis de satisfaisante qualité disponibles pour le glanage. Consequatur eius non animi.	2025-02-22 14:12:43.09	s-1VEetXxifPenKuni0Es	HA_JvlE9WZF6cMKGQz7TT	t	SyqfzOLsFarxWvRtr6xZl	392	2025-02-22 14:12:43.09	{}
aM5O4HkBaj3LQcVzeASEe	Glanage de Haricots verts à Gemblouxcentre	rb-Ce8	246 kg de Haricots verts de excellente qualité disponibles pour le glanage. Quasi nesciunt tempore atque ducimus sit.	2025-02-22 14:12:43.09	J3Ee9SwlCuJa9zPb6P0MM	NHBKw7vAt0_QufeFnm3zZ	t	2zZNda28L4ZJ8KDFPJBvZ	543	2025-02-22 14:12:43.09	{}
bUXAWDeLIpXsRCZUaBaTu	Récolte solidaire de Asperges à OupeyeNord	wngbI4	357 kg de Asperges de excellente qualité disponibles pour le glanage. Ad itaque itaque nesciunt.	2025-02-22 14:12:43.09	wOVQYTEjlYWzaLgLRqDwK	-3pl3_AjunaIazV45A8-K	t	G8SSJTwWK5vhwrjLXPi97	598	2025-02-22 14:12:43.09	{}
UZf-IoceM8S-JShMD9k9z	Récolte solidaire de Cerises à Chiny	6zz05F	383 kg de Cerises de satisfaisante qualité disponibles pour le glanage. Voluptas asperiores et cupiditate at quis maxime vero harum iste.	2025-02-22 14:12:43.091	K6WaRBvMDjctbFMntkM7b	ucdIWEMRFitZw62xEe4CO	t	7lvYzovKiZ5AO6uZl11ws	691	2025-02-22 14:12:43.091	{}
wc9izHte2q2m60Ig5K6St	Récolte solidaire de Framboises à FlorenvilleSud	D1KhFm	83 kg de Framboises de bonne qualité disponibles pour le glanage. Impedit delectus amet cum adipisci blanditiis laboriosam nulla earum a.	2025-02-22 14:12:43.091	wmJRwPm8XHPJVfWLzF_ek	LK7kXmnPYdnGdIjUEmeYb	t	c9qiER6Tva0mqYJEjFQ4-	909	2025-02-22 14:12:43.091	{}
CchQ8H0S9NVdnVHtoRr-d	Cueillette de Haricots verts à Remicourt	h45Qz9	482 kg de Haricots verts de satisfaisante qualité disponibles pour le glanage. Accusantium eius accusantium.	2025-02-22 14:12:43.091	J3Ee9SwlCuJa9zPb6P0MM	4DPjBgVhQi095vBulkdPM	t	kADWqIx_xfv-eaghFqbDC	369	2025-02-22 14:12:43.091	{}
Ej7WEmYuQYBlYSBXBFvdA	Cueillette de Raisins à Bassenge	scXuzg	294 kg de Raisins de excellente qualité disponibles pour le glanage. Minima accusantium occaecati.	2025-02-22 14:12:43.09	uP_oPzHBLI_sCWGJcdQjf	vMiugrrYVYzQOd3eVKk5W	t	0JktpnUT5crbm3tnY_u3e	943	2025-02-22 14:12:43.09	{}
89LJE-xewrUYK6UykCSrj	Récolte solidaire de Maïs à Oupeye	qJAAlc	60 kg de Maïs de bonne qualité disponibles pour le glanage. Iure labore placeat et tenetur.	2025-02-22 14:12:43.09	n66iRTQgdLFKmZGD199NR	DOilGey8OMueABDcBEHSR	t	JC56C2tNSjOHITKlNW8ix	461	2025-02-22 14:12:43.09	{}
CIPYxBm1jLwue1iCFX9BA	Cueillette de Framboises à Flémalle	Lv0kuZ	255 kg de Framboises de bonne qualité disponibles pour le glanage. Autem officiis quis ad.	2025-02-22 14:12:43.09	wmJRwPm8XHPJVfWLzF_ek	rTFEz_TLTNdYQCdpf8XTF	t	lVbXOcsEkm4f2cvPqNBkk	569	2025-02-22 14:12:43.09	{}
yOmdvzuc0gq2eZqFXgAWv	Récolte solidaire de Pommes de terre à TheuxNord	Pm24hr	358 kg de Pommes de terre de excellente qualité disponibles pour le glanage. Veniam ex odio.	2025-02-22 14:12:43.091	AcYKjZK7Bwx5Sae2PkM3O	hR3jWpzqG2qRgqGtqQ1ly	t	7lvYzovKiZ5AO6uZl11ws	748	2025-02-22 14:12:43.091	{}
VMUQqQ0gmb0QRzejh3Tq8	Récolte solidaire de Courgettes à Braine-le-ComteSud	9gbmfR	180 kg de Courgettes de bonne qualité disponibles pour le glanage. Ad culpa amet est dolore dicta.	2025-02-22 14:12:43.091	bgHTxYvS43U8MCchXGI6u	_XU5GOK9o5RKBZrsVGjVP	t	px9HOKI_UpBFAfUTlV6Q2	743	2025-02-22 14:12:43.091	{}
XfRVfvnOcpZt5MW5CJFpn	Récolte solidaire de Haricots verts à Wasseiges	72umja	351 kg de Haricots verts de satisfaisante qualité disponibles pour le glanage. Cupiditate labore perferendis animi blanditiis.	2025-02-22 14:12:43.09	J3Ee9SwlCuJa9zPb6P0MM	n3oHdc2SrAFQnEM6N2as4	t	O60wJSSWwEMg7oOPDOykN	541	2025-02-22 14:12:43.09	{}
KdBG4xtazafHqJ9mHzwMF	Récolte solidaire de Aubergines à Herve	XfB9bF	448 kg de Aubergines de excellente qualité disponibles pour le glanage. Quia fugiat doloremque doloribus quisquam tempore.	2025-02-22 14:12:43.09	lTC2NG4MW6EAj9Ld-ZGHQ	KAfB52vHC4beqKdNWRCq9	t	2zZNda28L4ZJ8KDFPJBvZ	911	2025-02-22 14:12:43.09	{}
6aW4wuwCzB4TCKN5uvvCT	Cueillette de Haricots verts à Héron	YIFE2N	200 kg de Haricots verts de excellente qualité disponibles pour le glanage. Sapiente veritatis distinctio sapiente dolor ipsam delectus provident eveniet.	2025-02-22 14:12:43.09	J3Ee9SwlCuJa9zPb6P0MM	FE3VRKpeuXbpJOu4QrlOj	t	0JktpnUT5crbm3tnY_u3e	895	2025-02-22 14:12:43.09	{}
LDxHYT8J79qUcsqYh1XIE	Récolte solidaire de Framboises à Incourtcentre	OLqkOI	246 kg de Framboises de satisfaisante qualité disponibles pour le glanage. Magnam fuga aliquid aliquid ullam cum deserunt vel.	2025-02-22 14:12:43.09	wmJRwPm8XHPJVfWLzF_ek	GrKBDZvohUX_JF67YFHqr	t	uJBicvPDE47w6xZK6LH-d	185	2025-02-22 14:12:43.09	{}
eJDiaGgcBEF7oo_waiTrv	Glanage de Carottes à FerrièresSud	amm1mm	239 kg de Carottes de satisfaisante qualité disponibles pour le glanage. Eius culpa laudantium eligendi rerum earum harum molestiae quo error.	2025-02-22 14:12:43.091	NM5e2trpKlZJ_O6tev2nr	gkSje-Z0YBcTtCzwXNUxf	t	Ezl9RkmBFPOFHKKD-ozIV	865	2025-02-22 14:12:43.091	{}
ZI3ZaEJPZcKWCCdYeqarQ	Récolte solidaire de Navets à Saint-HubertNord	4TL9uF	394 kg de Navets de bonne qualité disponibles pour le glanage. Excepturi in accusantium beatae sit iusto vel.	2025-02-22 14:12:43.091	KJgFo9Tt4BkEnCremB2QE	IkIZBgWc5X30utMiQubB4	t	lgm9bh82Tr9B74r7Dx8AS	402	2025-02-22 14:12:43.091	{}
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.comments (id, content, announcement_id, created_at, updated_at, user_id) FROM stdin;
gOWIbbRHfFz_2X60bvCSR	Quelle est la meilleure heure pour venir ?	iRnhK3ZUexr0HPTRATD2K	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	HoNUiG2AQhcJzcxp1vtJI
EgMbdduPHxrFS8OrpfKXV	Possible de venir avec des enfants ?	zwD0zc74Y7HIWaW4xbfeS	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	y1Hx4GXVmNiq1OxpUKFxa
a07dSSy_PYIxEhlF-tYVq	Faut-il apporter son propre matériel ?	moy7jq0XMWj8GZZYfQLwS	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	kt1ydP3QW8UxdSlbAryTr
P9wAMN3AdHC0OI66r574v	Faut-il apporter son propre matériel ?	iRnhK3ZUexr0HPTRATD2K	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	YTDvLZ3zpIPxyf7NWbig-
zPZ5KeZ8hTXKWxrKQVkkD	Quelle est la meilleure heure pour venir ?	LeyqVixhNtsb2_lmKzziX	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	Oa2qVBSUXJgYNiT-NN2Iu
uM0hPvr0VsIFO6qUup0tB	Accessible en transport en commun ?	iRnhK3ZUexr0HPTRATD2K	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	N7tK6mDid3gPFfGfuphLj
JhGETz6b1whUNJ_YgIxNO	Accessible en transport en commun ?	qkPrIOzHNfjHTeBOLVWIS	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	50C6aYmQ8rb4J8nAGsf2G
51FfX1U25_588OX5UyOJw	Est-ce qu'il y a un parking à proximité ?	jeLIkF8ng7C-CEkx5qUO7	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	YQX8fsqvf-jQttEgWodPl
6IyvuroLLFISs-VyumQeh	Faut-il apporter son propre matériel ?	bxUmqGXYNbJNsUjC7x_lz	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	hEbvLiNvGJFCxlvnn1ajy
4ZFdWvcUjotCr4-1gXrXk	Faut-il apporter son propre matériel ?	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	Oa2qVBSUXJgYNiT-NN2Iu
GaBFvq4EFqZ_FkIN2AJDK	Faut-il apporter son propre matériel ?	ppQZ0EBN8iVxOEjo7cNVp	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	VtAK0bUWEuTUYufmNQ2uQ
nlzbuSVkQFHeWFRXBWRBo	Accessible en transport en commun ?	qkPrIOzHNfjHTeBOLVWIS	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	5ZsdOQRTuO0d9X5EyuXI7
RBp88IrWLED14kfpcVmp-	Y a-t-il encore beaucoup de quantité disponible ?	LeyqVixhNtsb2_lmKzziX	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	xWBJ_Lk4-5xl_S95ch4DN
wX7LpToGf2PgPzcH7yEvF	Possible de venir avec des enfants ?	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	kx7a_V0q_vcPJ4KEUOulN
JLhnhB-pIvRSZ51zpbwPT	Accessible en transport en commun ?	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	VtAK0bUWEuTUYufmNQ2uQ
L9fDiyttCUy28AeV092nt	Accessible en transport en commun ?	HKS6fCzi-MOL2-XDXXz1e	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	kt1ydP3QW8UxdSlbAryTr
4F5gWLk_bU9lAvl-AObL9	Accessible en transport en commun ?	ppQZ0EBN8iVxOEjo7cNVp	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	Y5S58eZPGtw_6sC7_WftG
slWmCwLGO_7h9dLtwju6f	Accessible en transport en commun ?	zD9VggK6BK_yPRoe4mpGe	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	WvVs9H432Rb7EPLVveQBu
-Zj9SZssUYqzb_72e8-26	Est-ce qu'il y a un parking à proximité ?	Z9IWUFemRgdlAUA2exU9w	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	6M7Jhq31GYGjqhlXnuSlS
2bOZdNZhlR5J-imTnYJnL	Y a-t-il encore beaucoup de quantité disponible ?	Kb3bSLlmogWuj9dxQIt2-	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	NZ_ctN2LDRjRX5gqzIn-h
ph1I3Ozp7PWPCP6ZSd8Fd	Possible de venir avec des enfants ?	Kb3bSLlmogWuj9dxQIt2-	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	Y5S58eZPGtw_6sC7_WftG
-52JksYmsSnzOMTQLbqp7	Faut-il apporter son propre matériel ?	mjqGmqjSW4A0-Ep0Uu1_1	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	kt1ydP3QW8UxdSlbAryTr
JV4O4O4bDP59cGDU4FvO-	Y a-t-il encore beaucoup de quantité disponible ?	qkPrIOzHNfjHTeBOLVWIS	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	ynfjsfccIOGfleSPiodgL
xaeP6owMDxBHlXAMxaihq	Quelle est la meilleure heure pour venir ?	-CFbkdRcURKdVOjrLUJx9	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	uo5LsCc99Vak-gUkgIzfX
ZvOEMeCPz8X2qCSrUQodA	Accessible en transport en commun ?	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	pGYhcMFCFLkC4zhe_PJWQ
Ti35KhQQONLjtXRIn_L-t	Quelle est la meilleure heure pour venir ?	ePJhPv7abpQnDzZTIlKVA	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	hEbvLiNvGJFCxlvnn1ajy
vkl6T_CX8Uf9l7lmEgqxK	Faut-il apporter son propre matériel ?	mjqGmqjSW4A0-Ep0Uu1_1	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	5BKwWWao8FbqQ0TqEaaTx
KMjSstJKfEJkAOA0T_DTq	Est-ce qu'il y a un parking à proximité ?	aM5O4HkBaj3LQcVzeASEe	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	kt1ydP3QW8UxdSlbAryTr
TyiX7cdtdmrkKKMZC6XBQ	Faut-il apporter son propre matériel ?	hTBBeMQPDnBenBvHnw0ii	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	68q5ldFY_xCCKOqhO2tQk
VeXNGP04r5m63JguKFhwK	Quelle est la meilleure heure pour venir ?	El8D_fnta4fRMTCcdIwYD	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	ZUyzKoj-4sITYZmn66MyV
TJSKCbVxRa8-a8vV625_i	Faut-il apporter son propre matériel ?	b6lY_Q5Ooiwhnt8lXfqp3	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	_7efse5Y4lOshKF5oF4pZ
Ut4hK1MDxxERU2FAxcVxz	Y a-t-il encore beaucoup de quantité disponible ?	hTBBeMQPDnBenBvHnw0ii	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	nRoy8jXSGQuIyMMJCnSNf
rJ3F4gex0zzSwfN9v7KmL	Faut-il apporter son propre matériel ?	b6lY_Q5Ooiwhnt8lXfqp3	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	ynfjsfccIOGfleSPiodgL
7QZRvdGhSjpl9GdzcMpe-	Quelle est la meilleure heure pour venir ?	_sRAuMKiqFb82KP6NWkp5	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	68q5ldFY_xCCKOqhO2tQk
7V4tBJx8yQs-xpon4q4UJ	Quelle est la meilleure heure pour venir ?	moy7jq0XMWj8GZZYfQLwS	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	XjjbKLVjKuDUGQnqbkk9l
U6b6WHWh7vgqWrXVI6Qup	Quelle est la meilleure heure pour venir ?	UDjJgC3bfbMfpUdTxiDdt	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	MVar0M4VbKvaTyMGHm5TX
Z86INmdSyM610TvAE669A	Y a-t-il encore beaucoup de quantité disponible ?	bxUmqGXYNbJNsUjC7x_lz	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	UsselAyV86fZ-aWUvdGbZ
r5oPxQ0h8AMUOoy59YlGE	Accessible en transport en commun ?	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	rv4tjV1X201rDa7hXOrNc
7eRVx47PWORyrsZB5daJV	Faut-il apporter son propre matériel ?	jeLIkF8ng7C-CEkx5qUO7	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	5ZsdOQRTuO0d9X5EyuXI7
lB7FCWVaUivQY7AcHHYSr	Possible de venir avec des enfants ?	LeyqVixhNtsb2_lmKzziX	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	6tAud8OtyM-8ik06LVaIY
xx_9x_uG-__r_sABji4L2	Est-ce qu'il y a un parking à proximité ?	bxUmqGXYNbJNsUjC7x_lz	2025-02-22 14:12:45.971	2025-02-22 14:12:45.971	Ex4nSdiMXZ0pxRkSveWu4
K3MqjnFLJzITIB8SYVD4-	Y a-t-il encore beaucoup de quantité disponible ?	UNesA6JeouCfaD6g75bUk	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	6tAud8OtyM-8ik06LVaIY
G3Ch8aPCs4sT7XITY5Fgd	Faut-il apporter son propre matériel ?	HKS6fCzi-MOL2-XDXXz1e	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	Vnpa0CWF6tNufHq2B0JEP
OW0-TwNQJtDzPMvb1sF9j	Est-ce qu'il y a un parking à proximité ?	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	5ZsdOQRTuO0d9X5EyuXI7
RwD5ndCrQq53a2G3ZqyAv	Y a-t-il encore beaucoup de quantité disponible ?	HKS6fCzi-MOL2-XDXXz1e	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	2QgqWIb1dXO1R8IpsQWww
aK5InmmFZa_Y_DzLDiL_p	Y a-t-il encore beaucoup de quantité disponible ?	moy7jq0XMWj8GZZYfQLwS	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	VtAK0bUWEuTUYufmNQ2uQ
rEi3hdQmkEtdWOZbikG04	Accessible en transport en commun ?	zD9VggK6BK_yPRoe4mpGe	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	_7efse5Y4lOshKF5oF4pZ
4-KZTGUYjjMOucNsEx8zA	Quelle est la meilleure heure pour venir ?	UDjJgC3bfbMfpUdTxiDdt	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	Vnpa0CWF6tNufHq2B0JEP
sfNaNhS8o1isCSB5HrPib	Possible de venir avec des enfants ?	El8D_fnta4fRMTCcdIwYD	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	NZ_ctN2LDRjRX5gqzIn-h
SWt_vXrc5N2sE92mG5qHo	Accessible en transport en commun ?	UDjJgC3bfbMfpUdTxiDdt	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	BImDoUWp0nYtVR1XBADA1
QlmxURB_PCr1VQM2qsrQx	Faut-il apporter son propre matériel ?	8tYlrW76mItRincjRI5-2	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	SgxumAVx13SBTjv0d5tj7
B4JurM6_pvhxHLQqBdMLZ	Accessible en transport en commun ?	aM5O4HkBaj3LQcVzeASEe	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	is2ySgVuj4Gt_ae787YZU
iz0S_IGsoyDK-PeB2DJtT	Faut-il apporter son propre matériel ?	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	kgaapwTlgtogyJtO0yC-U
1Os1NlJ5LDJ1VaL4SMIpj	Possible de venir avec des enfants ?	JljVHt61gMmIt-9k0S2zi	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	G68D-oGzsmHx-UKs7zfbc
6n7Es-_Cu-9rmtKENsVA0	Faut-il apporter son propre matériel ?	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	TwaN7v8EaCLjjs8adJGIQ
Qg0fRRVdXyiy2N3zKqESO	Est-ce qu'il y a un parking à proximité ?	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	ra7m_5dtZZ0fIXz2wYUwS
E1n1-kO3QXPdPcDBjn6Ev	Est-ce qu'il y a un parking à proximité ?	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	68q5ldFY_xCCKOqhO2tQk
85qurOhJ4utN3wEBw4PRQ	Possible de venir avec des enfants ?	ZI3ZaEJPZcKWCCdYeqarQ	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	VtAK0bUWEuTUYufmNQ2uQ
2g68o_UOSDZJ0ZngMRlU8	Accessible en transport en commun ?	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	hEbvLiNvGJFCxlvnn1ajy
z-VYmY9yNDEaSGz2DkrWw	Y a-t-il encore beaucoup de quantité disponible ?	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	MVar0M4VbKvaTyMGHm5TX
Qs2s-tE1Zx_GBGlIvrWQy	Accessible en transport en commun ?	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	ra7m_5dtZZ0fIXz2wYUwS
1kZ7q8B7bPGr9ytzfaKnc	Quelle est la meilleure heure pour venir ?	wRLgglC5vuSvkzdfmvJGC	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	7eSbGUXbGwrL5mz1Q2HW5
F_SwLBIwU4mOkipbNVidr	Possible de venir avec des enfants ?	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	ErlUpv2BuYhqPxW_t-BnY
wluJE3GGmLn84YInaN51l	Possible de venir avec des enfants ?	wHp_clEZEs28dUCuLv72c	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	H9mgMEsnXG8WR65ZYemRV
qRjCg-EVAcfwNMJrLDEwt	Est-ce qu'il y a un parking à proximité ?	RYZFEnhqdqOvE7IOQkeL7	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	bdjT6dtbumKCFGpF8xKCz
u1WsLEvr3eBHuOSgF_fpA	Y a-t-il encore beaucoup de quantité disponible ?	RIsZgMg6JktdC-hsDV5qn	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	Q_DrzN5SotwsTRtHfxLpc
jCiqkdzYg1004TEuJlVb7	Possible de venir avec des enfants ?	hfuyfTwc3egGJE0pEz3h0	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	Q_DrzN5SotwsTRtHfxLpc
lD0fdft8vRxXd1y2ydZ5z	Accessible en transport en commun ?	hfuyfTwc3egGJE0pEz3h0	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	kt1ydP3QW8UxdSlbAryTr
_8X0StfBPJqzBQJFJDGpn	Est-ce qu'il y a un parking à proximité ?	bqCEmwlKkuPvyw_BG_o23	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	5ZsdOQRTuO0d9X5EyuXI7
XEtDImNcHGxeErD6C98E5	Faut-il apporter son propre matériel ?	8tYlrW76mItRincjRI5-2	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	W2u_mWX7wJprusJBrO6Qy
AfrcE1yfujnNoIAdQRPNP	Possible de venir avec des enfants ?	hfuyfTwc3egGJE0pEz3h0	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	-IMaZyj9yDW7KJmrtsnR_
m18SndqCgegZRvOCFlEsI	Quelle est la meilleure heure pour venir ?	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	ynfjsfccIOGfleSPiodgL
W7JKyGT144ypTKd67wRY7	Y a-t-il encore beaucoup de quantité disponible ?	wHp_clEZEs28dUCuLv72c	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	68q5ldFY_xCCKOqhO2tQk
pZ9MGJgT_gPSucr3WDmCR	Faut-il apporter son propre matériel ?	LDxHYT8J79qUcsqYh1XIE	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	bdjT6dtbumKCFGpF8xKCz
YaXPpY8EY0nC7hdACILgY	Possible de venir avec des enfants ?	wHp_clEZEs28dUCuLv72c	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	YQX8fsqvf-jQttEgWodPl
j03GkninqlNsP5offdKr4	Y a-t-il encore beaucoup de quantité disponible ?	8tYlrW76mItRincjRI5-2	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	8WPa-GF3tVDwE42Ve7zLg
9tlcJHivs8V_T9p8SLwN0	Accessible en transport en commun ?	ZI3ZaEJPZcKWCCdYeqarQ	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	hEbvLiNvGJFCxlvnn1ajy
qpqd2R8bGi5tUCSEiv7UN	Quelle est la meilleure heure pour venir ?	RYZFEnhqdqOvE7IOQkeL7	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	D5dndkr5njKtW4Ac_tmVm
R5nCpDeI07T0ML6Alr2Pv	Y a-t-il encore beaucoup de quantité disponible ?	a2JyLo1XT8U4sj41J-Qxu	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	ZUyzKoj-4sITYZmn66MyV
un2IamfxWvai8BxtM5hzc	Accessible en transport en commun ?	ZI3ZaEJPZcKWCCdYeqarQ	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	rv4tjV1X201rDa7hXOrNc
uWV9aDD5LdrnkE_IPqQvr	Accessible en transport en commun ?	RYZFEnhqdqOvE7IOQkeL7	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	fVxGG4jJrK6J8D1T97jAE
iKAWROq-jdddvRpY79Bbx	Est-ce qu'il y a un parking à proximité ?	RIsZgMg6JktdC-hsDV5qn	2025-02-22 14:12:45.972	2025-02-22 14:12:45.972	iuxebV8O0B3-dJthQ-rD2
\.


--
-- Data for Name: crop_types; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.crop_types (id, name, season, category, created_at, updated_at) FROM stdin;
bgHTxYvS43U8MCchXGI6u	Courgettes	SUMMER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
AcYKjZK7Bwx5Sae2PkM3O	Pommes de terre	FALL	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
itERaDH6dUFjWofXMCin2	Salades	SPRING	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
K6WaRBvMDjctbFMntkM7b	Cerises	SUMMER	FRUIT	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
FyXCWu5iojd28394U0qld	Choux-fleurs	WINTER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
Md6Lng_5df3846_hxFzin	Mûres	SUMMER	FRUIT	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
J3Ee9SwlCuJa9zPb6P0MM	Haricots verts	SUMMER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
NM5e2trpKlZJ_O6tev2nr	Carottes	YEAR_ROUND	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
s-1VEetXxifPenKuni0Es	Brocolis	WINTER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
BOVjSpn9LbSWw2TKBz7cL	Oignons	YEAR_ROUND	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
Izw9ye-VB_NHoqxJX5d-u	Poires	FALL	FRUIT	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
3LwZFJrIJfoX-Ktv2614W	Pommes	FALL	FRUIT	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
wmJRwPm8XHPJVfWLzF_ek	Framboises	SUMMER	FRUIT	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
Hsd7_4oJ994yGzAHQ3BXT	Fraises	SUMMER	FRUIT	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
B7SmvndyIUHNnkU7J7oq_	Poireaux	WINTER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
wOVQYTEjlYWzaLgLRqDwK	Asperges	SPRING	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
8NnSiSvOIDFBzQyYS8aBt	Tomates	SUMMER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
KJgFo9Tt4BkEnCremB2QE	Navets	YEAR_ROUND	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
M40RGgpJoOLEKUIibepGl	Betteraves	YEAR_ROUND	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
8HLo1CywSD1SlNGX_1A2n	Piments	SUMMER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
lTC2NG4MW6EAj9Ld-ZGHQ	Aubergines	SUMMER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
tFMr5xvKV1eyeppsRpFQz	Concombres	SUMMER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
uP_oPzHBLI_sCWGJcdQjf	Raisins	FALL	FRUIT	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
mUFNRejDdkIvvGJDR_fQj	Courges	FALL	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
bMPL6Qm_jFXo7stCjsrL6	Épinards	SPRING	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
n66iRTQgdLFKmZGD199NR	Maïs	SUMMER	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
wMC-dRrH0DlFZ44Ac-XDJ	Citrouilles	SPRING	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
wfQ4P8W3pmReXejYJpAsb	Poivrons	SPRING	VEGETABLE	2025-02-22 14:12:42.184	2025-02-22 14:12:42.184
\.


--
-- Data for Name: farms; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.farms (id, name, slug, description, city, latitude, longitude, postal_code, contact_info, created_at, owner_id, updated_at) FROM stdin;
_88FbPfC934aRiwOhDVqW	Ferme de Wallonie	6ZizQJ	responsable et ferme - Exploitation agricole familiale située à Cerfontaine	Cerfontaine	50.8448	2.7449	6299	0478183045	2025-02-22 14:12:42.263	FcKuqR_ga5aYHkIemUfD-	2025-02-22 14:12:42.263
43NiaTUC8t79UA1-TH0Nr	Ferme de la Vallée	03oNne	écologique et domaine - Exploitation agricole familiale située à Cellesplage	Cellesplage	51.0156	4.7902	6501	0477144303	2025-02-22 14:12:42.263	zINn-Tc0weellTesCUD8w	2025-02-22 14:12:42.263
gU88A9UdqdZ1wH0DX1p7S	Ferme du Soleil	7DxtnO	responsable et exploitation - Exploitation agricole familiale située à Amaycentre	Amaycentre	51.4508	6.3845	8013	0473129111	2025-02-22 14:12:42.263	rgVT7JF1blWKZkHHXu5hv	2025-02-22 14:12:42.263
_UzYgbQTX6x0W7nsn8ycd	Domaine du Brabant	zNtWGE	écologique et groupe agricole - Exploitation agricole familiale située à Ottignies-Louvain-la-Neuve	Ottignies-Louvain-la-Neuve	50.0576	2.7503	3647	0474338299	2025-02-22 14:12:42.263	rJYwsLLmhM4lNPTyGsLot	2025-02-22 14:12:42.263
07JgLlEZm_hsqjXIp5Fk1	Exploitation du Bonheur	Xn6FrG	innovante et coopérative - Exploitation agricole familiale située à Beauvechaincentre	Beauvechaincentre	51.1669	5.2655	6126	0479445236	2025-02-22 14:12:42.263	kDw998LpxYkswGqfBwhVK	2025-02-22 14:12:42.263
F0QP9kSFrX0ayna0XqwKd	Domaine de Wallonie	Zud-Jo	performante et domaine - Exploitation agricole familiale située à Gedinne	Gedinne	50.0634	5.2884	2361	0470716928	2025-02-22 14:12:42.264	oGxVLS_M1DwYi8FazDcal	2025-02-22 14:12:42.264
uY62LUxcnxXrOn1hO60WI	Exploitation de Wallonie	j3qDYw	familiale et coopérative - Exploitation agricole familiale située à Welkenraedtcentre	Welkenraedtcentre	51.3356	4.6833	6034	0477309298	2025-02-22 14:12:42.263	qkZp1bGNi99kS6dH0i9aJ	2025-02-22 14:12:42.263
wEX0L4T6-_02c1ys2LY9H	Exploitation des Quatre Saisons	AAlJVG	écologique et coopérative - Exploitation agricole familiale située à Jemeppe-sur-SambreSud	Jemeppe-sur-SambreSud	50.1551	2.8245	4246	0471275289	2025-02-22 14:12:42.263	parLefUsPQPvgIKscFuPY	2025-02-22 14:12:42.263
v91n_VR_s6fQ9eCIvUP7W	Domaine du Brabant	ybXNvw	responsable et groupe agricole - Exploitation agricole familiale située à Rixensart	Rixensart	50.4824	5.1208	1602	0478399865	2025-02-22 14:12:42.263	ohWe6fKIBDEBVBmPMlrxP	2025-02-22 14:12:42.263
SPq0qfzqFBuj9JFBz9rzm	Exploitation du Bonheur	1hnYbg	responsable et exploitation - Exploitation agricole familiale située à Berloz	Berloz	50.3445	5.9279	9646	0477461166	2025-02-22 14:12:42.263	URBfjrmCALpLD3arTBAJS	2025-02-22 14:12:42.263
UCd2cl_Td02XBL7R6py0m	Domaine des Champs	Js9NUO	familiale et groupe agricole - Exploitation agricole familiale située à Juprelle	Juprelle	51.026	2.6901	7968	0479837004	2025-02-22 14:12:42.263	JwAPJpRCZ-fJAGXkWKL7Z	2025-02-22 14:12:42.263
u_o5N7aH-z37FNCNbK3O6	Exploitation du Bonheur	I6qvRO	innovante et exploitation - Exploitation agricole familiale située à Hamoir	Hamoir	49.8455	4.9236	3947	0472587044	2025-02-22 14:12:42.264	s5IuZ0KU1iWf5rGIwzNc3	2025-02-22 14:12:42.264
BSeAdnpGJeTiFhfaj2bJN	Exploitation des Champs	nOV1au	écologique et groupe agricole - Exploitation agricole familiale située à Crisnée	Crisnée	50.4277	6.0742	6712	0473504154	2025-02-22 14:12:42.263	1ek9fQCkFVKKqE700NmEr	2025-02-22 14:12:42.263
jankkkqLwtbhxZy9F0p-N	Ferme du Soleil	7-n6Mr	écologique et domaine - Exploitation agricole familiale située à Comblain-au-PontSud	Comblain-au-PontSud	50.8933	5.4492	7370	0479797392	2025-02-22 14:12:42.263	lV0pUs3J0Kkpf7N8XXyGt	2025-02-22 14:12:42.263
iS9qzBx9Ue7TFG9rw6dW3	Ferme du Soleil	1bF_V9	familiale et coopérative - Exploitation agricole familiale située à BrugeletteSud	BrugeletteSud	49.8932	4.249	9625	0472617317	2025-02-22 14:12:42.263	93ATPOdykAl5vCfjDk9ax	2025-02-22 14:12:42.263
CriacjaF7clY8TlcTtQxB	Exploitation du Bonheur	E8pU-k	écologique et exploitation - Exploitation agricole familiale située à Binche	Binche	50.4615	3.7342	4141	0470656209	2025-02-22 14:12:42.264	vB9iiQwHG5E2UIGL_A3_2	2025-02-22 14:12:42.264
IKtgwyjfWpc2z-eAQ9d1B	Exploitation du Brabant	typa7K	traditionnelle et exploitation - Exploitation agricole familiale située à Pont-à-celles	Pont-à-celles	50.3288	4.4804	1883	0472208464	2025-02-22 14:12:42.264	D8wtot51RwOm5xWlSiNIK	2025-02-22 14:12:42.264
DmGmmiPql_KDt9I2g_LUe	Domaine du Brabant	gZY6s2	responsable et plantation - Exploitation agricole familiale située à Frameriescentre	Frameriescentre	50.2483	3.2267	8761	0474613251	2025-02-22 14:12:42.264	i2CHfTHszwJCe_3zFZa2R	2025-02-22 14:12:42.264
ApKrmAfcG1py_FJDRPKI8	Domaine de Wallonie	6Ax8MS	écologique et plantation - Exploitation agricole familiale située à PhilippevilleNord	PhilippevilleNord	50.0735	6.0021	3472	0477435271	2025-02-22 14:12:42.264	pqmZINdePlg38vTQ2WAAA	2025-02-22 14:12:42.264
YJuOs2zBmtOsLUcBaae9Z	Exploitation du Brabant	NTGtEP	artisanale et coopérative - Exploitation agricole familiale située à Donceel	Donceel	49.8536	4.9539	4408	0475671572	2025-02-22 14:12:42.264	C_ylVwYqpjnkJFCJKXPkE	2025-02-22 14:12:42.264
GSOjPn64Wbzjm7nUs9oZO	Exploitation des Champs	g2u1Iy	écologique et groupe agricole - Exploitation agricole familiale située à Vervierscentre	Vervierscentre	50.0775	5.5466	1830	0477180768	2025-02-22 14:12:42.263	71Ow35rP5LZtrCl_9edNW	2025-02-22 14:12:42.263
Urp8UoNXFOqpegiypKeHQ	Ferme de la Vallée	lKFuKv	innovante et plantation - Exploitation agricole familiale située à Erquelinnes	Erquelinnes	49.7668	5.3329	2986	0471121694	2025-02-22 14:12:42.264	JC56C2tNSjOHITKlNW8ix	2025-02-22 14:12:42.264
dks4ve1Q8ueGHIESNipvi	Domaine de Wallonie	V1rYs-	familiale et coopérative - Exploitation agricole familiale située à Libin	Libin	50.9395	4.7586	3964	0478144647	2025-02-22 14:12:42.264	3Tf6Zl9FLxW2K32Foi7IN	2025-02-22 14:12:42.264
ryEjmXiiYk_GppLX2BV71	Exploitation de Wallonie	5urfxT	innovante et plantation - Exploitation agricole familiale située à Herve	Herve	50.5494	2.7239	5670	0476272422	2025-02-22 14:12:42.264	LpvL2riLWPjTfhgcuqqeB	2025-02-22 14:12:42.264
Tn94P78IPLPM1TMYn_wme	Exploitation de la Vallée	sVJohH	traditionnelle et plantation - Exploitation agricole familiale située à Onhayeplage	Onhayeplage	50.2835	3.1117	6903	0472639063	2025-02-22 14:12:42.264	dTaLyNXl7V2K55YGbLHvB	2025-02-22 14:12:42.264
ovjNk5xGFEuQhoBZEEPqa	Exploitation du Bonheur	yygx_0	responsable et domaine - Exploitation agricole familiale située à CouvinSud	CouvinSud	51.3649	6.1856	5755	0474664653	2025-02-22 14:12:42.264	2zZNda28L4ZJ8KDFPJBvZ	2025-02-22 14:12:42.264
3vB61f9htmIrdFLRBFewe	Ferme du Soleil	6Rsne5	écologique et domaine - Exploitation agricole familiale située à Quiévrain	Quiévrain	49.7034	5.4878	9101	0473482008	2025-02-22 14:12:42.264	GIJQxS94O41YSHBKKRIgp	2025-02-22 14:12:42.264
Fd_P0dwKB1AwticKNxzKW	Exploitation de la Vallée	DZzJLt	responsable et exploitation - Exploitation agricole familiale située à Dourcentre	Dourcentre	49.9123	4.7401	4344	0472304527	2025-02-22 14:12:42.264	zXPTmsW-T2N3idsEc6fos	2025-02-22 14:12:42.264
KQna4WIQbxOPEjoX5OejC	Ferme du Brabant	-KTgyX	performante et groupe agricole - Exploitation agricole familiale située à Perwez	Perwez	50.1462	2.8466	1643	0470309424	2025-02-22 14:12:42.264	G8SSJTwWK5vhwrjLXPi97	2025-02-22 14:12:42.264
l3ACiQZoeJ_KEYGCKcdah	Domaine de la Vallée	xzVxnU	traditionnelle et domaine - Exploitation agricole familiale située à OuffetSud	OuffetSud	50.6386	4.0009	3709	0470002436	2025-02-22 14:12:42.264	uJBicvPDE47w6xZK6LH-d	2025-02-22 14:12:42.264
7k1lRYcRXMFQkX_lYAE6K	Domaine du Brabant	SWUnhU	artisanale et plantation - Exploitation agricole familiale située à Les Bons Villersplage	Les Bons Villersplage	51.3658	3.6054	0896	0476362537	2025-02-22 14:12:42.264	9NwU2_sA-mig4BRap4WZs	2025-02-22 14:12:42.264
0pPbaqbG6CRY23twQBlpJ	Exploitation de Wallonie	HS5KZ8	artisanale et ferme - Exploitation agricole familiale située à Dalhemplage	Dalhemplage	49.6022	5.7148	8782	0474697396	2025-02-22 14:12:42.264	XyPJvusDvggrs3XJUhQ_9	2025-02-22 14:12:42.264
WUVRacqDI5R0umJDvUjcu	Domaine du Bonheur	Zn1vIO	performante et coopérative - Exploitation agricole familiale située à Lierneux	Lierneux	49.7853	4.7757	1865	0474174521	2025-02-22 14:12:42.264	7M3Xgz_SkCK_FWuWXv69A	2025-02-22 14:12:42.264
QxBAO9AJ3pvhaRLnVX-P-	Domaine du Soleil	c26cTU	innovante et coopérative - Exploitation agricole familiale située à BassengeSud	BassengeSud	51.0502	5.5276	2629	0471533883	2025-02-22 14:12:42.264	Ezl9RkmBFPOFHKKD-ozIV	2025-02-22 14:12:42.264
_ZSs-kB8fX3Ut3ZZdC7d5	Domaine du Brabant	Ncka4p	innovante et domaine - Exploitation agricole familiale située à Huy	Huy	49.8665	6.376	0001	0473114392	2025-02-22 14:12:42.264	lVbXOcsEkm4f2cvPqNBkk	2025-02-22 14:12:42.264
7JPxvq95H3qy9Qu5wbqVr	Ferme de la Vallée	OQesrh	traditionnelle et domaine - Exploitation agricole familiale située à Anhée	Anhée	51.188	4.5592	5332	0471389238	2025-02-22 14:12:42.264	F0JxUXRuxdUVVlj0sLoF2	2025-02-22 14:12:42.264
bgfy7ms7Chh7UXF7N2Rtj	Exploitation des Quatre Saisons	jqwfIQ	réputée et plantation - Exploitation agricole familiale située à Daverdisseplage	Daverdisseplage	49.506	3.0486	8173	0477170480	2025-02-22 14:12:42.264	Eup65cutord2omDleknSo	2025-02-22 14:12:42.264
v9r83eu8-2_TSklKMplMR	Exploitation des Quatre Saisons	02byoB	responsable et domaine - Exploitation agricole familiale située à Frameries	Frameries	49.8014	3.0107	8912	0470099360	2025-02-22 14:12:42.264	i-Je7_EXJ1058I-TMNiav	2025-02-22 14:12:42.264
2ETqJR5scP_fHcj8yKScf	Ferme de la Vallée	naiSH2	innovante et plantation - Exploitation agricole familiale située à Oupeye	Oupeye	51.115	4.0406	1650	0471027042	2025-02-22 14:12:42.264	5saKcxS16EzHbDfZC0Avd	2025-02-22 14:12:42.264
8qIkbndWa4mWGTWHR71tG	Ferme de la Vallée	wyfJud	écologique et ferme - Exploitation agricole familiale située à Vaux-sur-SûreNord	Vaux-sur-SûreNord	49.5097	2.5936	9351	0473796859	2025-02-22 14:12:42.264	9LYH4KAEavh0Z7bX_012q	2025-02-22 14:12:42.264
NwrVXGEqqKFlBJYAPBITi	Domaine des Champs	CryuFv	artisanale et coopérative - Exploitation agricole familiale située à Saint-Léger	Saint-Léger	50.9778	4.3909	0599	0477835442	2025-02-22 14:12:42.264	P72hU5H8q9cZ7f1ghTHbL	2025-02-22 14:12:42.264
WnDdcOHGFC9J52p9dSH6K	Exploitation des Quatre Saisons	G2c8ch	familiale et exploitation - Exploitation agricole familiale située à Rouvroycentre	Rouvroycentre	49.7508	2.9558	0545	0477506563	2025-02-22 14:12:42.264	z7uypMyywv3hDHgKVVldC	2025-02-22 14:12:42.264
2xFBexng2PdSJh1r3MIZe	Ferme de la Vallée	SUWj7O	traditionnelle et coopérative - Exploitation agricole familiale située à Habay	Habay	49.8328	3.7826	0809	0478849760	2025-02-22 14:12:42.264	McpoM6XXIPKDUId8yw-GL	2025-02-22 14:12:42.264
Da55zpDXlye6Uc-MSlFQt	Ferme des Quatre Saisons	0s-sKl	écologique et domaine - Exploitation agricole familiale située à Virton	Virton	49.54	6.0644	5952	0470691819	2025-02-22 14:12:42.264	O60wJSSWwEMg7oOPDOykN	2025-02-22 14:12:42.264
j7AifDS7C5TMA6EyoY9_e	Domaine de Wallonie	nexmx4	performante et groupe agricole - Exploitation agricole familiale située à RendeuxNord	RendeuxNord	50.5959	4.2332	2928	0479165600	2025-02-22 14:12:42.264	qpOxI3xxaWghTx_AhHJFf	2025-02-22 14:12:42.264
BD6HJA0YWR7D0dA3Abypd	Ferme du Brabant	Gs0EFz	familiale et plantation - Exploitation agricole familiale située à GemblouxSud	GemblouxSud	49.6159	6.0835	2053	0475969250	2025-02-22 14:12:42.264	TRC71SAKv_J3g_OLcaR81	2025-02-22 14:12:42.264
WaNOBnmGFgS_IYfc5vjH1	Ferme de Wallonie	oBKfj8	écologique et groupe agricole - Exploitation agricole familiale située à Gouvycentre	Gouvycentre	50.3312	3.4232	3601	0475987058	2025-02-22 14:12:42.264	-kiPtRC9MnrNrFzVDqsGU	2025-02-22 14:12:42.264
_WVvyxiF2pyL5km-uzY4t	Ferme des Champs	U_qw4q	innovante et plantation - Exploitation agricole familiale située à SambrevilleSud	SambrevilleSud	50.9097	5.6016	0325	0477319277	2025-02-22 14:12:42.264	3g0eBUuFJFI8nj4t0wNn1	2025-02-22 14:12:42.264
6r7AbVOJFJlapfrSdlMld	Domaine du Bonheur	2SPSpf	familiale et coopérative - Exploitation agricole familiale située à La HulpeNord	La HulpeNord	50.7763	5.9076	5892	0476251397	2025-02-22 14:12:42.264	7lvYzovKiZ5AO6uZl11ws	2025-02-22 14:12:42.264
Xr9j9SnhmQX9qlB_Ag3c2	Exploitation de la Vallée	22Zksx	innovante et coopérative - Exploitation agricole familiale située à Libincentre	Libincentre	51.4368	5.6083	9435	0474282779	2025-02-22 14:12:42.264	hqUr9AznCFGLWEft00-6X	2025-02-22 14:12:42.264
N9q3YVc-FyLz7iqit6USy	Exploitation du Soleil	RkOkfO	artisanale et coopérative - Exploitation agricole familiale située à Doische	Doische	49.5961	2.6128	2300	0474038642	2025-02-22 14:12:42.264	SVyHqJ5Y2dE1CsnN15ngx	2025-02-22 14:12:42.264
A7JLe8HAS57CUvazQAZpB	Exploitation du Soleil	FFhe8y	traditionnelle et coopérative - Exploitation agricole familiale située à Plombièresplage	Plombièresplage	50.9321	4.641	2439	0475949157	2025-02-22 14:12:42.264	wfmDD0c9hBfJvty4WZwGk	2025-02-22 14:12:42.264
EaJFVMBSvRkUsfIB0vzoX	Ferme du Bonheur	sVIinV	artisanale et plantation - Exploitation agricole familiale située à Gesves	Gesves	50.2884	4.9641	1077	0477714557	2025-02-22 14:12:42.264	0JktpnUT5crbm3tnY_u3e	2025-02-22 14:12:42.264
Vf9NyI6904NqUfjgdbday	Exploitation de la Vallée	IaAjYC	innovante et groupe agricole - Exploitation agricole familiale située à Erquelinnes	Erquelinnes	51.0064	3.2572	8939	0475509261	2025-02-22 14:12:42.264	vfResoS5rGXA2JEi2BaeU	2025-02-22 14:12:42.264
7aNAlr4OzBGNSpcOhU3-M	Exploitation de la Vallée	TyXbIR	traditionnelle et coopérative - Exploitation agricole familiale située à Geercentre	Geercentre	51.0728	4.0559	2269	0472931247	2025-02-22 14:12:42.264	lgm9bh82Tr9B74r7Dx8AS	2025-02-22 14:12:42.264
psdMG7RZLx5y2PiKQLPhM	Exploitation du Brabant	VyQptH	écologique et exploitation - Exploitation agricole familiale située à Andenneplage	Andenneplage	49.9738	5.9154	4284	0473490101	2025-02-22 14:12:42.264	gTi7k9rbEHJ6MboiOfLF_	2025-02-22 14:12:42.264
L6_cAhGhEwPTF0mFoJpj3	Domaine du Soleil	y279vM	performante et groupe agricole - Exploitation agricole familiale située à La LouvièreSud	La LouvièreSud	50.1191	4.1069	4409	0473909939	2025-02-22 14:12:42.264	SyqfzOLsFarxWvRtr6xZl	2025-02-22 14:12:42.264
ejApp9LkpJrLs9SYHJUIn	Ferme des Quatre Saisons	7kCfYN	réputée et coopérative - Exploitation agricole familiale située à BraivesNord	BraivesNord	49.9663	2.763	6907	0471174253	2025-02-22 14:12:42.264	c9qiER6Tva0mqYJEjFQ4-	2025-02-22 14:12:42.264
BeRW-DSlIqAIdm-umGDVI	Exploitation de la Vallée	BYPW-d	traditionnelle et exploitation - Exploitation agricole familiale située à Saint-VithNord	Saint-VithNord	50.0481	5.2314	4765	0476671383	2025-02-22 14:12:42.264	px9HOKI_UpBFAfUTlV6Q2	2025-02-22 14:12:42.264
YOMNKILCHuHrEle1Aj02A	Exploitation du Brabant	-n34o6	réputée et groupe agricole - Exploitation agricole familiale située à Vaux-sur-SûreSud	Vaux-sur-SûreSud	49.831	4.3925	0616	0470732147	2025-02-22 14:12:42.264	kADWqIx_xfv-eaghFqbDC	2025-02-22 14:12:42.264
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.favorites (id, announcement_id, created_at, user_id) FROM stdin;
eTgjA4D5wMMxXoMBZL8a7	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:46.471	xqaIMhPePn0LfXF-YKQLh
TSD7gqu0h_lRm9uRF-2DP	PzuGdErwYJjgVb-tiNwNJ	2025-02-22 14:12:46.471	Y5S58eZPGtw_6sC7_WftG
TsSVz1TXVjSTW1bcSMXrY	El8D_fnta4fRMTCcdIwYD	2025-02-22 14:12:46.471	2QgqWIb1dXO1R8IpsQWww
fcSS0fj9YDH2MaODvMXl_	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:46.471	kx7a_V0q_vcPJ4KEUOulN
g3oTx9dYFga9GsGecrBZA	UIrrKVIlkjDXaWfDO8aTO	2025-02-22 14:12:46.471	SgxumAVx13SBTjv0d5tj7
stHLEgbJG1nETbTYNJP3n	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:46.471	O4aJ-sLLtRhC1gk5aOx8a
Endjj5f-KmiPm7WGdPqWM	TbroWkkhGNI9ohebhZUVy	2025-02-22 14:12:46.471	Vnpa0CWF6tNufHq2B0JEP
HgCIIx9vi2IxzcBpYA_Ob	8tYlrW76mItRincjRI5-2	2025-02-22 14:12:46.471	kx7a_V0q_vcPJ4KEUOulN
KWHm3U14MSbZYxi50aUw5	RbURtIE6B-a1AkuKenD6Y	2025-02-22 14:12:46.471	xqaIMhPePn0LfXF-YKQLh
IP8GRQSn44vdCm-hRllza	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.471	Pxq28Q6QNzB72vY1-EpHc
d263T30Am9k5rDgR5R4D6	bUXAWDeLIpXsRCZUaBaTu	2025-02-22 14:12:46.471	SgxumAVx13SBTjv0d5tj7
cYPeKYWq_o8v_jzMs926Z	yOmdvzuc0gq2eZqFXgAWv	2025-02-22 14:12:46.471	O4aJ-sLLtRhC1gk5aOx8a
pVAeJs7_FkVH-nEo5ekVv	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:46.471	Y5S58eZPGtw_6sC7_WftG
-I2jjRwBzLp9UZYF4hGhI	lxHVm4mR19FlJQrnAda9C	2025-02-22 14:12:46.471	Pxq28Q6QNzB72vY1-EpHc
mF0U0yExRA8xXlDoFKlsu	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:46.471	O4aJ-sLLtRhC1gk5aOx8a
0URtozoOV-S-usowTXn0x	UZf-IoceM8S-JShMD9k9z	2025-02-22 14:12:46.471	O4aJ-sLLtRhC1gk5aOx8a
Sj4zWcG40Mb7YZTthdrno	ppQZ0EBN8iVxOEjo7cNVp	2025-02-22 14:12:46.471	kx7a_V0q_vcPJ4KEUOulN
fs_P0VGA5DACeSw0oHNYV	hTBBeMQPDnBenBvHnw0ii	2025-02-22 14:12:46.471	taknNHxsb9gYMyf3hMBlE
xk4kx74tBuwnZ_V6IPptN	CIPYxBm1jLwue1iCFX9BA	2025-02-22 14:12:46.471	WvVs9H432Rb7EPLVveQBu
ZGfOwiyQaVa7-KcFR1j9s	fzVGDzQMEj6SuoZ2SwbZj	2025-02-22 14:12:46.471	taknNHxsb9gYMyf3hMBlE
RrDPGEQCZB_UNEbliYcBP	moy7jq0XMWj8GZZYfQLwS	2025-02-22 14:12:46.471	xqaIMhPePn0LfXF-YKQLh
ma7oC6DTAWSC58NX2Ud49	Xr2DG96eCesYj6CbeJRPI	2025-02-22 14:12:46.471	Vnpa0CWF6tNufHq2B0JEP
ptltTcYV3CL7nol5cgjyD	iY8GqXzNJ9k0CYa6CIjd_	2025-02-22 14:12:46.471	Pxq28Q6QNzB72vY1-EpHc
hIwJ84kQ1Tll5QNO7Xl8A	gE54sw2rRxiKQtkGVvCJ8	2025-02-22 14:12:46.471	2QgqWIb1dXO1R8IpsQWww
U9gEaO0OVZtiWLeKF-Qzp	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.471	kx7a_V0q_vcPJ4KEUOulN
dVWSOSJ5SKB5kJDfN4TtW	CchQ8H0S9NVdnVHtoRr-d	2025-02-22 14:12:46.471	NZ_ctN2LDRjRX5gqzIn-h
aD75DRlkJ5WfEHjccocgQ	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:46.471	Y5S58eZPGtw_6sC7_WftG
5tAHyLPHsqSl3g32atRbr	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:46.471	NZ_ctN2LDRjRX5gqzIn-h
UlIpB-sK7CkCCrBtsCRt1	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:46.471	WvVs9H432Rb7EPLVveQBu
LcdemF5FHhtww1J-UQ2nn	bGc0d8XqeWUi2G-W1sSQV	2025-02-22 14:12:46.471	WvVs9H432Rb7EPLVveQBu
gEAgsPfsLNp0L0xjEMXMW	lxHVm4mR19FlJQrnAda9C	2025-02-22 14:12:46.471	CVm0n4hzIWdsDBrDJradD
PPfpFkXAcsKWIvejm2zkM	zwD0zc74Y7HIWaW4xbfeS	2025-02-22 14:12:46.471	HoNUiG2AQhcJzcxp1vtJI
qWvc-6yHvrLk2idux74lE	El8D_fnta4fRMTCcdIwYD	2025-02-22 14:12:46.471	Y5S58eZPGtw_6sC7_WftG
IVtgUJ5crnb_3FV4zW02k	qkPrIOzHNfjHTeBOLVWIS	2025-02-22 14:12:46.471	8WPa-GF3tVDwE42Ve7zLg
0E3CFNZ4TExjUsHlH84CK	Xr2DG96eCesYj6CbeJRPI	2025-02-22 14:12:46.471	CVm0n4hzIWdsDBrDJradD
PFSQdDAv8xu58pOjITGEu	bxUmqGXYNbJNsUjC7x_lz	2025-02-22 14:12:46.471	CVm0n4hzIWdsDBrDJradD
ZayzRIqj3mmLe02iANdMl	xq-V5AMQpEVc9mWkAker3	2025-02-22 14:12:46.471	CVm0n4hzIWdsDBrDJradD
N5R7zgTqUfRblS8VQheHs	WB3e4Lw8_uHRtmBPct5I_	2025-02-22 14:12:46.471	NZ_ctN2LDRjRX5gqzIn-h
qRePDxp9zhhtEdqgPaj8r	mq9znd0d0U4Lz_oNRx5Rc	2025-02-22 14:12:46.471	GDNiqcy5j67FHEG6jSaR2
jGvLIcXTHPPz3DvNygEKH	WB3e4Lw8_uHRtmBPct5I_	2025-02-22 14:12:46.471	TwaN7v8EaCLjjs8adJGIQ
-2lj5dZ6n8-ZMJWOjNZRZ	a2JyLo1XT8U4sj41J-Qxu	2025-02-22 14:12:46.471	Y5S58eZPGtw_6sC7_WftG
VwGESkxLjXCYSqE6O0HqG	eJDiaGgcBEF7oo_waiTrv	2025-02-22 14:12:46.471	TwaN7v8EaCLjjs8adJGIQ
mMgNO-l4VzxJWAkLxYhWZ	mq9znd0d0U4Lz_oNRx5Rc	2025-02-22 14:12:46.471	CVm0n4hzIWdsDBrDJradD
VxIK7cxfdpQBP02YuWUIP	El8D_fnta4fRMTCcdIwYD	2025-02-22 14:12:46.471	TwaN7v8EaCLjjs8adJGIQ
R6xdPWZKYutEEeNzUMks2	Ej7WEmYuQYBlYSBXBFvdA	2025-02-22 14:12:46.471	rv4tjV1X201rDa7hXOrNc
OVLC6AXH1RYvWksb60gzU	9lH2MxAfDorT-Bj_52IKb	2025-02-22 14:12:46.471	TwaN7v8EaCLjjs8adJGIQ
ff4MeE3dyLujBwoYCh5Pr	vmNxqd4jGgV1YGpQgQAIv	2025-02-22 14:12:46.471	2QgqWIb1dXO1R8IpsQWww
cKW7QBll6ZSPwvMAlGuiL	WB3e4Lw8_uHRtmBPct5I_	2025-02-22 14:12:46.471	xqaIMhPePn0LfXF-YKQLh
YfqVV4OaQZSehNmq7gtAT	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:46.471	GDNiqcy5j67FHEG6jSaR2
vJEmdtsdfM0UyxrTlnkUe	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.471	WvVs9H432Rb7EPLVveQBu
_miK5iyDA6bCmg5PR0hTF	ndL1DHgeaaCjTN8RtrQ9S	2025-02-22 14:12:46.471	8WPa-GF3tVDwE42Ve7zLg
uB62PD0ZUXBNJs-rgEtt2	0hrQAdv-ZSSt4vFfMWGrB	2025-02-22 14:12:46.471	TwaN7v8EaCLjjs8adJGIQ
oBvIdTdJnZQpogOP8Y7ai	CLTeqQb13pUifhxKoS8xu	2025-02-22 14:12:46.471	SgxumAVx13SBTjv0d5tj7
MHtTS7ZM1OvReT0roCjti	NXgvz4jDKfrEifJT6U6zm	2025-02-22 14:12:46.471	HoNUiG2AQhcJzcxp1vtJI
5ll3qYBKSxTML10QStr4E	eJDiaGgcBEF7oo_waiTrv	2025-02-22 14:12:46.471	Pxq28Q6QNzB72vY1-EpHc
wnSRTm5Gelqxdqw6CwFQ7	Cam7xzvFjl3SvHLOx5oEv	2025-02-22 14:12:46.471	5ZsdOQRTuO0d9X5EyuXI7
Af9XZjkBMNFBbBtuS-Y4Z	STOH5L2a1GAAOIqzD4flI	2025-02-22 14:12:46.471	GDNiqcy5j67FHEG6jSaR2
gah5ZWePkTO7lxgJvkLzP	wRLgglC5vuSvkzdfmvJGC	2025-02-22 14:12:46.471	Pxq28Q6QNzB72vY1-EpHc
c73-I5tAovm_3-3CrGo4D	9lH2MxAfDorT-Bj_52IKb	2025-02-22 14:12:46.471	xqaIMhPePn0LfXF-YKQLh
w_drn4JUoDarrH0sGVtM6	UZf-IoceM8S-JShMD9k9z	2025-02-22 14:12:46.471	rv4tjV1X201rDa7hXOrNc
ONB5vSzOORGskfUCqTkTK	iPErNrc070AIGHWM5v-L7	2025-02-22 14:12:46.471	68q5ldFY_xCCKOqhO2tQk
Chmla3A_gTy-SAek76s8y	PzuGdErwYJjgVb-tiNwNJ	2025-02-22 14:12:46.471	68q5ldFY_xCCKOqhO2tQk
smH65H11kBBlFSVovi2y4	5fpSdMQ12zDUA30v8hxHy	2025-02-22 14:12:46.471	2QgqWIb1dXO1R8IpsQWww
Dci-wK6TCN3p4cIg8Kmgs	Se9j6dgcU8ztfkGNEGsuA	2025-02-22 14:12:46.471	5ZsdOQRTuO0d9X5EyuXI7
4nDTsRUxy5JtCcjaXHO2I	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.471	68q5ldFY_xCCKOqhO2tQk
c9hVD9iZpoaf34_AtcOTb	Z9IWUFemRgdlAUA2exU9w	2025-02-22 14:12:46.471	5ZsdOQRTuO0d9X5EyuXI7
OCb50T8sxyEAMmPjFsQnb	f8gqC7W8XWhbVjvMYXNmG	2025-02-22 14:12:46.471	68q5ldFY_xCCKOqhO2tQk
jNEbhWNXGcWbL-xRAp6BP	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:46.471	68q5ldFY_xCCKOqhO2tQk
k_fwYaH1jWA2thOA_5nkh	Ej7WEmYuQYBlYSBXBFvdA	2025-02-22 14:12:46.471	N7tK6mDid3gPFfGfuphLj
YoiGLWxyw5qjLGM589jwq	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:46.472	ra7m_5dtZZ0fIXz2wYUwS
jWWjsN4CWkSCrU0sko8lc	hfuyfTwc3egGJE0pEz3h0	2025-02-22 14:12:46.472	nRoy8jXSGQuIyMMJCnSNf
Akd9KwpSjq_DecWByDUCX	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:46.471	N7tK6mDid3gPFfGfuphLj
_pav44lclRDwTXgt8Bip4	aM5O4HkBaj3LQcVzeASEe	2025-02-22 14:12:46.471	N7tK6mDid3gPFfGfuphLj
pfcvLWnsS5XabTgEqiGMq	ePJhPv7abpQnDzZTIlKVA	2025-02-22 14:12:46.472	ra7m_5dtZZ0fIXz2wYUwS
07GmfYEELF3flNeiz-yfH	zwD0zc74Y7HIWaW4xbfeS	2025-02-22 14:12:46.472	VtAK0bUWEuTUYufmNQ2uQ
RlRyMWIhIkFanBY5daeek	r1UjwKdgeV8YjUUDNr8kl	2025-02-22 14:12:46.472	_7efse5Y4lOshKF5oF4pZ
mKgHMT7nUzrea-JZzmpgA	jeLIkF8ng7C-CEkx5qUO7	2025-02-22 14:12:46.472	Q_DrzN5SotwsTRtHfxLpc
rcLjzMam2ckprl6py5gav	PzuGdErwYJjgVb-tiNwNJ	2025-02-22 14:12:46.472	dynp8GvU7NLNlEzTlFwRE
IAIubZ-45n7t1G9jWm9ya	PDutvax019TIxfo26I1IN	2025-02-22 14:12:46.472	MolqmNWVa06zm-Io5X_AL
NKpru7wIvaxUVRu8-dZu6	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:46.472	_7efse5Y4lOshKF5oF4pZ
XupZxMwQgeOPOE9roeN11	CIPYxBm1jLwue1iCFX9BA	2025-02-22 14:12:46.472	hBWjYB97bi-PTiXh6V5lL
O3EiGh6GtSzoSTRSuN5Yv	-cg1y9j0qRrSah_1O3ZsJ	2025-02-22 14:12:46.472	UsselAyV86fZ-aWUvdGbZ
Z62YIUThcUkNpVK5pjWFl	XmUu9isiAhmW32xZH4ZZk	2025-02-22 14:12:46.472	G-CIpmGST2Fn9m5H53Pn6
fu9SFgEALEwPTAU6Kq73o	bGc0d8XqeWUi2G-W1sSQV	2025-02-22 14:12:46.472	_7efse5Y4lOshKF5oF4pZ
WMPA75lnzZwVqZXi1VGCx	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:46.472	hBWjYB97bi-PTiXh6V5lL
xMrwQn3VEh9iyxgVO2Gmo	f8gqC7W8XWhbVjvMYXNmG	2025-02-22 14:12:46.472	MnoyNuzPIA932-N7FVVu9
kwZJ9_3m-t6ccHTvkZTe0	iY8GqXzNJ9k0CYa6CIjd_	2025-02-22 14:12:46.472	G-CIpmGST2Fn9m5H53Pn6
BrNPp_rT353WNS-opaIy2	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:46.472	_7efse5Y4lOshKF5oF4pZ
iPMRfMfP4F99C6Wk79ukv	CLTeqQb13pUifhxKoS8xu	2025-02-22 14:12:46.472	YQX8fsqvf-jQttEgWodPl
ueU5fMuffAvZeUelgNusy	mjqGmqjSW4A0-Ep0Uu1_1	2025-02-22 14:12:46.472	dynp8GvU7NLNlEzTlFwRE
FLjTHC8uisgnAvv2M7ouc	ytjwR7Wj67ThXy1zQKqr0	2025-02-22 14:12:46.472	dynp8GvU7NLNlEzTlFwRE
FL34Oxq_JX5lN_bnIfbTV	hTBBeMQPDnBenBvHnw0ii	2025-02-22 14:12:46.472	nRoy8jXSGQuIyMMJCnSNf
qKTfIVhjvpTyByQMQfKkb	iPErNrc070AIGHWM5v-L7	2025-02-22 14:12:46.472	hBWjYB97bi-PTiXh6V5lL
-5s_gN4RlYN-No6trNayO	fzVGDzQMEj6SuoZ2SwbZj	2025-02-22 14:12:46.472	UsselAyV86fZ-aWUvdGbZ
-4Eji625ufqvTtQcgTnGY	1wNUiByRERoYMJjrhzhqk	2025-02-22 14:12:46.472	y1Hx4GXVmNiq1OxpUKFxa
jRhfXiJ2r4QaI61g1jxtC	SDXePMW5CLhEavcJu8SO4	2025-02-22 14:12:46.472	VtAK0bUWEuTUYufmNQ2uQ
lqJiYHdnQ-RUn_GtxAolg	HKS6fCzi-MOL2-XDXXz1e	2025-02-22 14:12:46.472	5BKwWWao8FbqQ0TqEaaTx
SJfa0MRA-RBY7fqB8IMTf	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.472	010kfQ2xnGsgQEP4d6Qpq
cLG4V-bWEX5dQWWXbsNn8	iPErNrc070AIGHWM5v-L7	2025-02-22 14:12:46.472	y1Hx4GXVmNiq1OxpUKFxa
b15GotmADkiMkUX7yhYrV	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:46.472	nRoy8jXSGQuIyMMJCnSNf
_2bkh9Wpz8AEkhrJ4D7jA	ndL1DHgeaaCjTN8RtrQ9S	2025-02-22 14:12:46.472	5BKwWWao8FbqQ0TqEaaTx
_AGaVUB23cyCvaeYL2eBJ	vgtI4Nw6SrWDtdCnAz4RD	2025-02-22 14:12:46.472	nRoy8jXSGQuIyMMJCnSNf
eKx03wNHx_ynC8x868Scd	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:46.472	5BKwWWao8FbqQ0TqEaaTx
98whsIzAT_cPiVeRCR5KJ	0a3HdSxD6gJJrZ1V_d1ny	2025-02-22 14:12:46.472	7eSbGUXbGwrL5mz1Q2HW5
kCm1_kXJJjJ7h9cUP_tQV	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:46.472	y1Hx4GXVmNiq1OxpUKFxa
F9fbXpSAlVw6d48hySdJ2	2BF-SOEZmuZoYEO00D-O5	2025-02-22 14:12:46.472	XBIUrzPwMaB--z4fp4Q_Y
jL0HUwb73eQJ9JnR_li-9	Xr2DG96eCesYj6CbeJRPI	2025-02-22 14:12:46.472	_7efse5Y4lOshKF5oF4pZ
056ELbrIPC9qcSRPnl441	PDutvax019TIxfo26I1IN	2025-02-22 14:12:46.472	ZcTt5h_MdndtHtmFxIfxR
f4kzNVZqt1r9yjnSXh07n	jeLIkF8ng7C-CEkx5qUO7	2025-02-22 14:12:46.472	5BKwWWao8FbqQ0TqEaaTx
Yz9aLCExUEti4SvkBKFzW	ypDXYfNEFG50Dw2gYO5aZ	2025-02-22 14:12:46.472	5BKwWWao8FbqQ0TqEaaTx
EoVediSSjgyU1pIuGW2DC	zwD0zc74Y7HIWaW4xbfeS	2025-02-22 14:12:46.472	7eSbGUXbGwrL5mz1Q2HW5
kOL0tXt0svVqFQ4128nFW	iPErNrc070AIGHWM5v-L7	2025-02-22 14:12:46.472	G-CIpmGST2Fn9m5H53Pn6
s4DJzHQYIDhvPq7iHzzU6	SDXePMW5CLhEavcJu8SO4	2025-02-22 14:12:46.472	o12gDGrqvcIG_AaVqUrCX
tNnXilq8GUJy5VWDTe5Ac	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:46.472	MolqmNWVa06zm-Io5X_AL
IiunCiDQJcogQvBFJSgE6	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:46.472	MnoyNuzPIA932-N7FVVu9
0z2dEeAWllt1Io7PNwimt	RYZFEnhqdqOvE7IOQkeL7	2025-02-22 14:12:46.472	MnoyNuzPIA932-N7FVVu9
uAcGy8moX8duv914Fb0L0	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:46.472	FtEuhCz-sqPoB72tJwOXj
5yNhQ8E54Nsru9ZSIKshf	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.472	ZcTt5h_MdndtHtmFxIfxR
lHQjnrJgRwNUUHDWV7qKI	ePJhPv7abpQnDzZTIlKVA	2025-02-22 14:12:46.472	010kfQ2xnGsgQEP4d6Qpq
zHWWUT1rt85b2oi1_2LOT	rp5drsdIYnZ0-5_dc4e45	2025-02-22 14:12:46.472	FtEuhCz-sqPoB72tJwOXj
THoPuRVIs05tx3J82g0oj	hDlmu5xi6ucPuMMaPg6lZ	2025-02-22 14:12:46.472	Q_DrzN5SotwsTRtHfxLpc
-n7agUH8wpSzNIWMTB9eA	HKS6fCzi-MOL2-XDXXz1e	2025-02-22 14:12:46.472	dynp8GvU7NLNlEzTlFwRE
ZhYcQZpiic9nVEN3b_B2-	wRLgglC5vuSvkzdfmvJGC	2025-02-22 14:12:46.472	G-CIpmGST2Fn9m5H53Pn6
1Vvwe7d1NKhPTJqrIlv5e	ePJhPv7abpQnDzZTIlKVA	2025-02-22 14:12:46.472	YQX8fsqvf-jQttEgWodPl
1wLDR6KS4KLH0Y5FMPq0B	bGc0d8XqeWUi2G-W1sSQV	2025-02-22 14:12:46.472	010kfQ2xnGsgQEP4d6Qpq
Vp6mcmsfZlFZb0L8jl5Qx	Af_xhEH-w4oh-8mNII6ml	2025-02-22 14:12:46.472	XBIUrzPwMaB--z4fp4Q_Y
GVXQDR53GHK-LO7F8B2CZ	iY8GqXzNJ9k0CYa6CIjd_	2025-02-22 14:12:46.472	ZcTt5h_MdndtHtmFxIfxR
gURgU0Pl_UWpD_hXdz6vH	gE54sw2rRxiKQtkGVvCJ8	2025-02-22 14:12:46.472	010kfQ2xnGsgQEP4d6Qpq
-G9EeYlfEM3K4Li63_QS1	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:46.472	XBIUrzPwMaB--z4fp4Q_Y
u5zaRGTX1s0gJBdS5wY2r	kWA0fPaZsTYelJrjsmw54	2025-02-22 14:12:46.472	YQX8fsqvf-jQttEgWodPl
bPxF9ovyK6sbvkcfOzFiZ	RYZFEnhqdqOvE7IOQkeL7	2025-02-22 14:12:46.472	010kfQ2xnGsgQEP4d6Qpq
dxuOscVd3ByRe6a9jODck	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.472	XBIUrzPwMaB--z4fp4Q_Y
1cyCCf3yCzEUwD5gelBKV	ePJhPv7abpQnDzZTIlKVA	2025-02-22 14:12:46.472	ZcTt5h_MdndtHtmFxIfxR
eRQ1diUxjvfbCMKG91fLi	-cg1y9j0qRrSah_1O3ZsJ	2025-02-22 14:12:46.472	YQX8fsqvf-jQttEgWodPl
n0rAmZ6ywTF6NgFOWBGJN	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:46.472	vH-zqVd_1gwnMxgoi9TcN
FMwgDIgLaP5VDItxbTjV3	f8gqC7W8XWhbVjvMYXNmG	2025-02-22 14:12:46.472	dynp8GvU7NLNlEzTlFwRE
wKWxIHfILZ4JzGStQ9Gvv	Z9IWUFemRgdlAUA2exU9w	2025-02-22 14:12:46.472	FtEuhCz-sqPoB72tJwOXj
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.feedbacks (id, message, email, created_at, updated_at, user_id) FROM stdin;
Zy8-C4-dbQxRrqYn3HCLj	Permettre de voir la distance jusqu'au champ	Billie.Strosin97@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	lV0pUs3J0Kkpf7N8XXyGt
wOsq0XFc9qB4nP5HuqORt	Application très utile pour réduire le gaspillage alimentaire	Shelia.OConner93@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	SyqfzOLsFarxWvRtr6xZl
3ijczCUvJQBQn_GDAXad8	Super initiative pour mettre en relation agriculteurs et glaneurs	Theo_Dicki@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	9LYH4KAEavh0Z7bX_012q
Zip41u-bribrQJM0vbIg4	Interface intuitive et facile à utiliser	Sira.Lubowitz@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	qkZp1bGNi99kS6dH0i9aJ
Xhji3vXh7l21Z_Fli4rCy	Application très utile pour réduire le gaspillage alimentaire	Ephraim.Bradtke@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	G8SSJTwWK5vhwrjLXPi97
GgNmkt2hieifs7EmBXc6P	Permettre de voir la distance jusqu'au champ	Julia.Roux@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	71Ow35rP5LZtrCl_9edNW
kMIHYAF8gwVWNlG2iSG4o	Ajouter un système de covoiturage	Helena_Konopelski@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	Ezl9RkmBFPOFHKKD-ozIV
Ks9wm6NcnaTCRTvBSpVfD	Excellent moyen de découvrir l'agriculture locale	Kenny_Leannon3@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	XyPJvusDvggrs3XJUhQ_9
NMlJWW3r4QdPKyKVGPRfo	Super initiative pour mettre en relation agriculteurs et glaneurs	Arlene_Willms@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	s5IuZ0KU1iWf5rGIwzNc3
ZS7HURNRTRDomDy4L9lIm	Super initiative pour mettre en relation agriculteurs et glaneurs	Levana_Powlowski@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	2zZNda28L4ZJ8KDFPJBvZ
CBIbbzZ-XAvP0DajDcJsZ	Ajouter une fonction de messagerie entre agriculteurs et glaneurs	Leopold.Schaefer43@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	uJBicvPDE47w6xZK6LH-d
LxFMx4Vpi8NpI-J_nrAsi	Ajouter une fonction de messagerie entre agriculteurs et glaneurs	Madeleine.Bauch@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	ohWe6fKIBDEBVBmPMlrxP
ynWB_n1hNwjagx_tYsSOD	Pouvoir filtrer par type de culture	Cheick_Kunde81@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	rJYwsLLmhM4lNPTyGsLot
6laC_7th3z2jLZ8zWrPe0	Ajouter des notifications pour les nouvelles annonces	admin@glean.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	hBwrBF00fbzp9MLC-8bBD
OhLjPkK9YPfIO9Sow7TAL	Application très utile pour réduire le gaspillage alimentaire	Aurore.Davis@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	zINn-Tc0weellTesCUD8w
P7GfDo1R2BDFG4aEpOXl-	Ajouter un système de covoiturage	Violette.Gaillard80@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	kDw998LpxYkswGqfBwhVK
CffRFHIBWuB8VoHr00W4y	Application très utile pour réduire le gaspillage alimentaire	Timothee_Roussel@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	1ek9fQCkFVKKqE700NmEr
WCihv9jPGqTCMhegnOKol	Ajouter un système de covoiturage	Sue_Hirthe@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	3g0eBUuFJFI8nj4t0wNn1
-_m6p7JwS3x5DZG2gH2-H	Super initiative pour mettre en relation agriculteurs et glaneurs	Aicha.Hubert@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	M7OhCeRXSMm_xlUQrNNQH
uCoJt_W80IXEFbdEOlw0_	Application très utile pour réduire le gaspillage alimentaire	Nine.Wisoky@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	svkANm0FmRXwwvrbpPd9p
sf4bzj-N6OBDbPkGgLQlG	Ajouter des notifications pour les nouvelles annonces	Connie.Sporer89@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	c9qiER6Tva0mqYJEjFQ4-
W3p9og-es6tYqsGcefSIA	Interface intuitive et facile à utiliser	Antoinette_Bernhard@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	rv4tjV1X201rDa7hXOrNc
EdzlUWMYTxdK2XKYX7DFP	Interface intuitive et facile à utiliser	Souleyman.Marty@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	8WPa-GF3tVDwE42Ve7zLg
dlg4hLRyaH7fO2cFcO5Bg	Interface intuitive et facile à utiliser	Sally.Bahringer59@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	px9HOKI_UpBFAfUTlV6Q2
TROrrWGTYcww6YBEBf7r1	Ajouter des notifications pour les nouvelles annonces	Karine_Langworth@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	P72hU5H8q9cZ7f1ghTHbL
rc1NraMUsP0OUHJPAcebv	Ajouter des notifications pour les nouvelles annonces	Wandrille.Tremblay73@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	Pxq28Q6QNzB72vY1-EpHc
QcsXxi3mGDKv7iSr-X_ZK	Excellent moyen de découvrir l'agriculture locale	Carroll_Lakin96@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	FWIZrDngg9Qx2C6LLK0TZ
jLmv7xJWjduKfQf1XXqC2	Excellent moyen de découvrir l'agriculture locale	Eytan.Dupuy12@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	taknNHxsb9gYMyf3hMBlE
udsDIpz2GDYuwcPzBaiL_	Application très utile pour réduire le gaspillage alimentaire	Corto_Kuhn@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	TwaN7v8EaCLjjs8adJGIQ
lw1SjPR8pd9IyNusPOYPY	Pouvoir filtrer par type de culture	Charlie_Greenfelder@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	eE4mNWW5LeV8ael4lbHxF
uYlOvIgdwDYLVzEzsk26y	Application très utile pour réduire le gaspillage alimentaire	Noa.Hauck36@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	kx7a_V0q_vcPJ4KEUOulN
W-XjAB7TK6AYRLpPVFzTK	Ajouter des notifications pour les nouvelles annonces	Nawel.Zemlak60@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	6tAud8OtyM-8ik06LVaIY
xmh51OPrhTI0N5xOylKem	Ajouter des notifications pour les nouvelles annonces	Hafsa.McLaughlin@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	kt1ydP3QW8UxdSlbAryTr
LaOIqFXQtabzJOmM7tz77	Super initiative pour mettre en relation agriculteurs et glaneurs	Youssef_Franecki@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	G8j4_ZCyMVq8TZaxUvtFo
jLZ322SZ4z9kB7bcyOckx	Permettre de voir la distance jusqu'au champ	Kenan.Stoltenberg7@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	hBWjYB97bi-PTiXh6V5lL
RcGWge07a3UJ0KIxcjcPo	Ajouter une fonction de messagerie entre agriculteurs et glaneurs	Tais.Orn@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	7eSbGUXbGwrL5mz1Q2HW5
bdro3n2NtswdIL_WE45DL	Excellent moyen de découvrir l'agriculture locale	Wissem.Block73@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	-IMaZyj9yDW7KJmrtsnR_
HEs1K5pbqo7K96lJCIC0l	Pouvoir filtrer par type de culture	Gina.Kihn@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	UsselAyV86fZ-aWUvdGbZ
66EeFIr3gULam2XhXLlw3	Excellent moyen de découvrir l'agriculture locale	Wade.Robel@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	FtEuhCz-sqPoB72tJwOXj
7peObLgPFCa0iwtCAyF0h	Super initiative pour mettre en relation agriculteurs et glaneurs	Abdellah_Dickinson@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	uo5LsCc99Vak-gUkgIzfX
rQoRrHn5AsPwnbPm_nEly	Excellent moyen de découvrir l'agriculture locale	Shaun_Schultz98@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	68q5ldFY_xCCKOqhO2tQk
2NVAe_oFZQF0lkvfx0CBN	Pouvoir filtrer par type de culture	Mai.Strosin92@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	pGYhcMFCFLkC4zhe_PJWQ
4DN9GS1ap0agm_oAO_HbK	Ajouter des notifications pour les nouvelles annonces	Elise_Schmitt@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	hCTGZ3il5htDkjYnF3wXS
9Lojkie9i6synvg7MOptY	Interface intuitive et facile à utiliser	Shanon.David3@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	vH-zqVd_1gwnMxgoi9TcN
6lTIqjhBhh90Wo4fA4ofJ	Interface intuitive et facile à utiliser	Yanni_Bartoletti@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	y1Hx4GXVmNiq1OxpUKFxa
5bqEcem8Jz__0BFSKqbOH	Ajouter un système de covoiturage	Kelli_Dumas@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	Q_DrzN5SotwsTRtHfxLpc
QKfbQyzPiQiRvUYKf2XHf	Application très utile pour réduire le gaspillage alimentaire	Emilie_Kessler57@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	GIJQxS94O41YSHBKKRIgp
7VWohgPMtheMw2LT20lpO	Excellent moyen de découvrir l'agriculture locale	Lucien.Leannon38@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	G-CIpmGST2Fn9m5H53Pn6
TfUvlalc7borzkrOLnBAA	Application très utile pour réduire le gaspillage alimentaire	Craig_Corkery@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	zXPTmsW-T2N3idsEc6fos
rPMELhxCmZPkkz3-5wE4s	Interface intuitive et facile à utiliser	Russell_Medhurst25@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	z7uypMyywv3hDHgKVVldC
z27p9VcleY_KyZjAF2Ejs	Très belle initiative !	Kay91@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	\N
0A_TveQ03jd96SBskkhKs	Comment puis-je devenir glaneur ?	Amber_Flatley@example.be	2025-02-22 14:12:46.711	2025-02-22 14:12:46.711	\N
Pe_F3upgATPRPIg51yOmh	Ajouter une fonction de messagerie entre agriculteurs et glaneurs	Kristy.Goodwin31@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	lVbXOcsEkm4f2cvPqNBkk
knYBVL5Z8b_57Ha9qICiC	Je souhaite participer en tant qu'agriculteur	Houda.Langosh41@example.be	2025-02-22 14:12:46.711	2025-02-22 14:12:46.711	\N
-oN-SUOYU78tYPH0-Oq__	Très belle initiative !	Sherri.Reinger@example.be	2025-02-22 14:12:46.711	2025-02-22 14:12:46.711	\N
cNMMvC7QzpuYaQdK0ESw7	Super initiative pour mettre en relation agriculteurs et glaneurs	Vincent.Quigley87@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	iuxebV8O0B3-dJthQ-rD2
kns9Qm_525BAaQuRNBZXS	Excellent moyen de découvrir l'agriculture locale	Laetitia.Wehner@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	Ex4nSdiMXZ0pxRkSveWu4
gpQtRCzjrvfcL-82YzlAw	Très belle initiative !	Desiree_Christiansen0@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	\N
tOiBVblbm5qJBbj_eRtIW	Je souhaite participer en tant qu'agriculteur	Reginald.Marquardt@example.be	2025-02-22 14:12:46.711	2025-02-22 14:12:46.711	\N
VtlbhxyDe7yvdeM5-uI9e	Je souhaite participer en tant qu'agriculteur	Maissa.Gleichner@example.be	2025-02-22 14:12:46.711	2025-02-22 14:12:46.711	\N
xpCbkXFtp2r40mE7qi1O8	Très belle initiative !	Dounia_Martin24@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	\N
yY7bVInv5JTJUeH6tvxdy	Très belle initiative !	Leny.Olson65@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	\N
hl4L8syaEsNtiRfGRKx5F	Je souhaite participer en tant qu'agriculteur	Lino16@example.be	2025-02-22 14:12:46.71	2025-02-22 14:12:46.71	\N
\.


--
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.fields (id, name, slug, description, city, latitude, longitude, postal_code, created_at, crop_type_id, farm_id, is_available, owner_id, qr_code_url, updated_at) FROM stdin;
KeWra5wOx_hxcOtfeMEzC	Parcelle espiègle 1	xxPyvX	Terrain légèrement vallonné de 5 hectares, bien exposé. Magni nobis facilis provident omnis explicabo.	Ottignies-Louvain-la-Neuve	50.0668146888966	2.744371382350062	3647	2025-02-22 14:12:42.429	J3Ee9SwlCuJa9zPb6P0MM	_UzYgbQTX6x0W7nsn8ycd	t	\N	\N	2025-02-22 14:12:42.429
S8uBsYznnHDfgYWbRzfId	Parcelle moderne 3	9B-GbV	Terrain légèrement vallonné de 7 hectares, bien exposé. Beatae quo velit modi enim.	Gedinne	50.05795246527962	5.29562001813174	2361	2025-02-22 14:12:42.429	NM5e2trpKlZJ_O6tev2nr	F0QP9kSFrX0ayna0XqwKd	t	\N	\N	2025-02-22 14:12:42.429
WwTJgw6rG8eNQxZyCgDTa	Parcelle avare 3	avo7LN	Terrain en pente douce de 20 hectares, exposé plein sud. Explicabo debitis eaque voluptatem animi hic harum quasi debitis eveniet.	Juprelle	51.02016821537669	2.694189606509695	7968	2025-02-22 14:12:42.429	BOVjSpn9LbSWw2TKBz7cL	UCd2cl_Td02XBL7R6py0m	t	\N	\N	2025-02-22 14:12:42.429
MbJfo9JGcBKBMI53Gx52l	Parcelle perplexe 2	Ggar1s	Terrain en pente douce de 17 hectares, exposé plein sud. Quas esse mollitia.	Vervierscentre	50.07329118068933	5.538769627800614	1830	2025-02-22 14:12:42.429	FyXCWu5iojd28394U0qld	GSOjPn64Wbzjm7nUs9oZO	t	\N	\N	2025-02-22 14:12:42.429
GwbDq9yKS06Cc1XKpD0gg	Parcelle turquoise 1	hF5Smw	Terrain légèrement vallonné de 5 hectares, bien exposé. Porro laborum corrupti amet dignissimos debitis.	Crisnée	50.43190307971253	6.071047696602037	6712	2025-02-22 14:12:42.429	3LwZFJrIJfoX-Ktv2614W	BSeAdnpGJeTiFhfaj2bJN	t	\N	\N	2025-02-22 14:12:42.429
XbBAk-uYjGQ_zYD_oJPn0	Parcelle brusque 1	iliqKy	Terrain en pente douce de 17 hectares, bien exposé. Quis repellat accusantium porro quos praesentium culpa.	Juprelle	51.03429325518831	2.697155858506681	7968	2025-02-22 14:12:42.429	wfQ4P8W3pmReXejYJpAsb	UCd2cl_Td02XBL7R6py0m	t	\N	\N	2025-02-22 14:12:42.429
EWiZG2ebIC8GiML6yDIQj	Parcelle snob 1	Z02AHN	Terrain en pente douce de 2 hectares, partiellement ombragé. Nemo dicta necessitatibus accusantium similique.	Comblain-au-PontSud	50.89596704151762	5.445701384022192	7370	2025-02-22 14:12:42.429	3LwZFJrIJfoX-Ktv2614W	jankkkqLwtbhxZy9F0p-N	t	\N	\N	2025-02-22 14:12:42.429
QVWQAWGDyqGgaZdv8KMj6	Parcelle téméraire 3	EP4-bl	Terrain plat de 13 hectares, partiellement ombragé. Corrupti esse at optio aperiam.	Vervierscentre	50.08471070815114	5.543109742263877	1830	2025-02-22 14:12:42.429	Hsd7_4oJ994yGzAHQ3BXT	GSOjPn64Wbzjm7nUs9oZO	t	\N	\N	2025-02-22 14:12:42.429
I-ohskQEUWpxogJ-BoWQl	Parcelle triangulaire 2	1CZ3qR	Terrain plat de 3 hectares, bien exposé. Quam nostrum consectetur quia.	Gedinne	50.06361183085043	5.295866382884229	2361	2025-02-22 14:12:42.429	n66iRTQgdLFKmZGD199NR	F0QP9kSFrX0ayna0XqwKd	t	\N	\N	2025-02-22 14:12:42.429
9u2WnVff0XeBH1pt-IDK9	Parcelle infime 2	vfYZLN	Terrain légèrement vallonné de 4 hectares, exposé plein sud. Dolores molestias ipsa natus doloribus itaque suscipit.	Juprelle	51.01606036773563	2.700028572615399	7968	2025-02-22 14:12:42.429	bMPL6Qm_jFXo7stCjsrL6	UCd2cl_Td02XBL7R6py0m	t	\N	\N	2025-02-22 14:12:42.429
IRTy4cJOdc57Eqc34qcBj	Parcelle lunatique 3	_GT46e	Terrain légèrement vallonné de 9 hectares, partiellement ombragé. Molestias quis dolore architecto laborum dignissimos itaque.	Comblain-au-PontSud	50.88725152855219	5.452547390827006	7370	2025-02-22 14:12:42.429	J3Ee9SwlCuJa9zPb6P0MM	jankkkqLwtbhxZy9F0p-N	t	\N	\N	2025-02-22 14:12:42.429
5e-Ytn8k06JgNxpl3kzRN	Parcelle sauvage 2	rilofN	Terrain en pente douce de 8 hectares, exposé plein sud. Corporis unde mollitia ipsam atque soluta magnam.	Comblain-au-PontSud	50.89674879460283	5.439570013200594	7370	2025-02-22 14:12:42.429	wMC-dRrH0DlFZ44Ac-XDJ	jankkkqLwtbhxZy9F0p-N	t	\N	\N	2025-02-22 14:12:42.429
UKXhJ6gHVOfZZeTE1vREF	Parcelle vivace 1	_VeZqT	Terrain plat de 7 hectares, partiellement ombragé. Harum alias nostrum itaque eveniet mollitia fuga.	Hamoir	49.84998737757881	4.92208911048246	3947	2025-02-22 14:12:42.429	J3Ee9SwlCuJa9zPb6P0MM	u_o5N7aH-z37FNCNbK3O6	t	\N	\N	2025-02-22 14:12:42.429
J5MAWjmfp0-BiOGjvXeS6	Parcelle aigre 1	Pdne4f	Terrain plat de 7 hectares, bien exposé. Debitis officiis sunt recusandae.	Beauvechaincentre	51.16003889077977	5.269555696310017	6126	2025-02-22 14:12:42.429	J3Ee9SwlCuJa9zPb6P0MM	07JgLlEZm_hsqjXIp5Fk1	t	\N	\N	2025-02-22 14:12:42.429
o_irxJee5ECrgqgpkW058	Parcelle tranquille 2	3iRROc	Terrain plat de 8 hectares, exposé plein sud. Officia magnam quos eaque non.	Cerfontaine	50.85375600844141	2.746288125987457	6299	2025-02-22 14:12:42.429	s-1VEetXxifPenKuni0Es	_88FbPfC934aRiwOhDVqW	t	\N	\N	2025-02-22 14:12:42.429
4T7etdFLQjcMpfH9BpSRq	Parcelle brusque 1	NZpSYj	Terrain légèrement vallonné de 9 hectares, bien exposé. Blanditiis doloribus commodi quis eum cum veniam ipsa tenetur possimus.	Gedinne	50.07177664460254	5.292532206339718	2361	2025-02-22 14:12:42.429	K6WaRBvMDjctbFMntkM7b	F0QP9kSFrX0ayna0XqwKd	t	\N	\N	2025-02-22 14:12:42.429
97gN9zrVWEAetH2LSzoft	Parcelle super 2	eftkGZ	Terrain en pente douce de 20 hectares, bien exposé. Iusto enim blanditiis explicabo quasi.	Ottignies-Louvain-la-Neuve	50.06010275035903	2.758305500524417	3647	2025-02-22 14:12:42.429	NM5e2trpKlZJ_O6tev2nr	_UzYgbQTX6x0W7nsn8ycd	t	\N	\N	2025-02-22 14:12:42.429
1sjUjxS0Xy56VNBkXpW9z	Parcelle lunatique 2	JJaTiC	Terrain en pente douce de 1 hectares, exposé plein sud. Libero magni praesentium ipsum.	Gesves	50.29671691266854	4.959705927174701	1077	2025-02-22 14:12:42.429	B7SmvndyIUHNnkU7J7oq_	EaJFVMBSvRkUsfIB0vzoX	t	\N	\N	2025-02-22 14:12:42.429
DpA7PvGaKZpWTSZ0Q-9yw	Parcelle fade 3	UPXYpa	Terrain plat de 15 hectares, partiellement ombragé. Quasi assumenda eveniet provident quaerat.	Hamoir	49.85417615796069	4.921050870135494	3947	2025-02-22 14:12:42.429	lTC2NG4MW6EAj9Ld-ZGHQ	u_o5N7aH-z37FNCNbK3O6	t	\N	\N	2025-02-22 14:12:42.429
BVkA0-WHsaafy2L4dzfyF	Parcelle charitable 2	UWu4F2	Terrain légèrement vallonné de 10 hectares, partiellement ombragé. Harum asperiores molestiae eum expedita pariatur quae.	Rixensart	50.47780799381306	5.114922478930149	1602	2025-02-22 14:12:42.429	8HLo1CywSD1SlNGX_1A2n	v91n_VR_s6fQ9eCIvUP7W	t	\N	\N	2025-02-22 14:12:42.429
hKA0lIlOmlxQ5ZRRjCCCi	Parcelle aigre 1	pLl9KU	Terrain plat de 9 hectares, bien exposé. Placeat reprehenderit esse eaque eveniet laborum excepturi.	Welkenraedtcentre	51.33067167858582	4.689009241382956	6034	2025-02-22 14:12:42.429	K6WaRBvMDjctbFMntkM7b	uY62LUxcnxXrOn1hO60WI	t	\N	\N	2025-02-22 14:12:42.429
ds9W1PKaAjmaJmn2nZaZP	Parcelle magnifique 2	7IToSA	Terrain en pente douce de 14 hectares, partiellement ombragé. Aliquam facilis magni minus quo cum quos incidunt quisquam.	Welkenraedtcentre	51.34469546839489	4.674056711200614	6034	2025-02-22 14:12:42.429	bgHTxYvS43U8MCchXGI6u	uY62LUxcnxXrOn1hO60WI	t	\N	\N	2025-02-22 14:12:42.429
X3dsl5oHptTpTrEUWgzvX	Parcelle sauvage 2	4NFI8X	Terrain légèrement vallonné de 16 hectares, bien exposé. Natus ab inventore odit.	Jemeppe-sur-SambreSud	50.1507307404929	2.821184031944648	4246	2025-02-22 14:12:42.43	wOVQYTEjlYWzaLgLRqDwK	wEX0L4T6-_02c1ys2LY9H	t	\N	\N	2025-02-22 14:12:42.43
QrpEFs-x9v0bT9Oc-SBSL	Parcelle ferme 1	l7teC8	Terrain légèrement vallonné de 3 hectares, partiellement ombragé. Quia optio delectus modi.	Rixensart	50.47655020974705	5.113537953743038	1602	2025-02-22 14:12:42.429	wfQ4P8W3pmReXejYJpAsb	v91n_VR_s6fQ9eCIvUP7W	t	\N	\N	2025-02-22 14:12:42.429
McN6NpjvGWSAOTsyQOimg	Parcelle multiple 1	ai9Nfi	Terrain en pente douce de 13 hectares, bien exposé. Quidem veniam est incidunt ad voluptatem aut magnam iusto.	Amaycentre	51.45797362367534	6.382586602106633	8013	2025-02-22 14:12:42.429	Izw9ye-VB_NHoqxJX5d-u	gU88A9UdqdZ1wH0DX1p7S	t	\N	\N	2025-02-22 14:12:42.429
YuOJWxyxg_Mzq-YBN9Alf	Parcelle vivace 3	A-jjmq	Terrain plat de 14 hectares, bien exposé. Inventore corrupti sunt.	Welkenraedtcentre	51.33052036051911	4.689466188329229	6034	2025-02-22 14:12:42.43	J3Ee9SwlCuJa9zPb6P0MM	uY62LUxcnxXrOn1hO60WI	t	\N	\N	2025-02-22 14:12:42.43
S8wOpcS1dtAKdtAIvqLqx	Parcelle fourbe 1	vTgAXv	Terrain en pente douce de 11 hectares, partiellement ombragé. Qui sint asperiores rerum numquam aperiam rem accusamus quo laboriosam.	Jemeppe-sur-SambreSud	50.15184129604847	2.822738965724966	4246	2025-02-22 14:12:42.429	wfQ4P8W3pmReXejYJpAsb	wEX0L4T6-_02c1ys2LY9H	t	\N	\N	2025-02-22 14:12:42.429
mTVbJMFgxS6muVcMNacoq	Parcelle triangulaire 2	m77bTT	Terrain en pente douce de 16 hectares, exposé plein sud. Atque at neque earum officiis iste enim placeat.	Binche	50.45685114126037	3.73017973241412	4141	2025-02-22 14:12:42.43	wfQ4P8W3pmReXejYJpAsb	CriacjaF7clY8TlcTtQxB	t	\N	\N	2025-02-22 14:12:42.43
LrrnNZ2FImiNxdC_DVbJs	Parcelle candide 2	_IskOc	Terrain plat de 14 hectares, exposé plein sud. Sint hic consequuntur dignissimos sunt laboriosam delectus.	Frameriescentre	50.24827235731664	3.224629878384027	8761	2025-02-22 14:12:42.43	8HLo1CywSD1SlNGX_1A2n	DmGmmiPql_KDt9I2g_LUe	t	\N	\N	2025-02-22 14:12:42.43
fUKyvm-L8OqJe80TRubhL	Parcelle serviable 2	DwzLMv	Terrain en pente douce de 2 hectares, bien exposé. Deleniti delectus nobis nam dicta excepturi doloribus consequatur.	Onhayeplage	50.2902394429893	3.106619921647097	6903	2025-02-22 14:12:42.43	Hsd7_4oJ994yGzAHQ3BXT	Tn94P78IPLPM1TMYn_wme	t	\N	\N	2025-02-22 14:12:42.43
cbQjjthUOxZfC1FwI7OJh	Parcelle magnifique 1	aC6gRd	Terrain légèrement vallonné de 20 hectares, exposé plein sud. Optio sequi unde repellat eveniet voluptas fuga.	Perwez	50.14150023945665	2.851953979018367	1643	2025-02-22 14:12:42.43	Md6Lng_5df3846_hxFzin	KQna4WIQbxOPEjoX5OejC	t	\N	\N	2025-02-22 14:12:42.43
fUtN9DUkbChz_RHlhbhLc	Parcelle pauvre 2	9vz5mP	Terrain en pente douce de 10 hectares, partiellement ombragé. Non hic vel assumenda illum error impedit alias alias reprehenderit.	Virton	49.53008684294612	6.061077715719105	5952	2025-02-22 14:12:42.43	wmJRwPm8XHPJVfWLzF_ek	Da55zpDXlye6Uc-MSlFQt	t	\N	\N	2025-02-22 14:12:42.43
ShPFLf--MI3QMLP9h2vA9	Parcelle sédentaire 2	CSkNtH	Terrain en pente douce de 9 hectares, bien exposé. Commodi expedita consequatur perferendis officiis ab amet accusantium in.	Quiévrain	49.6992936042144	5.488295365662086	9101	2025-02-22 14:12:42.43	J3Ee9SwlCuJa9zPb6P0MM	3vB61f9htmIrdFLRBFewe	t	\N	\N	2025-02-22 14:12:42.43
G3kwXHLZkFVyVAVLXsjnK	Parcelle apte 3	ZgFPs4	Terrain légèrement vallonné de 14 hectares, bien exposé. Molestiae amet explicabo veniam assumenda.	Oupeye	51.10552731452649	4.042456927797378	1650	2025-02-22 14:12:42.43	lTC2NG4MW6EAj9Ld-ZGHQ	2ETqJR5scP_fHcj8yKScf	t	\N	\N	2025-02-22 14:12:42.43
IrgUkVshZgADm3rWYog60	Parcelle circulaire 1	rcvXGF	Terrain en pente douce de 2 hectares, bien exposé. Laborum aut eaque.	Dourcentre	49.90834201159474	4.742552916321149	4344	2025-02-22 14:12:42.43	Md6Lng_5df3846_hxFzin	Fd_P0dwKB1AwticKNxzKW	t	\N	\N	2025-02-22 14:12:42.43
HA_JvlE9WZF6cMKGQz7TT	Parcelle sage 2	OXHYA0	Terrain plat de 2 hectares, partiellement ombragé. Doloribus voluptatibus labore in officia.	La LouvièreSud	50.1206114279713	4.111326890851802	4409	2025-02-22 14:12:42.43	s-1VEetXxifPenKuni0Es	L6_cAhGhEwPTF0mFoJpj3	t	\N	\N	2025-02-22 14:12:42.43
WZu1-2Ngml78WCKcLvDXj	Parcelle coupable 1	W9CJn7	Terrain en pente douce de 2 hectares, partiellement ombragé. Alias laboriosam ab et laboriosam eligendi dolor architecto earum iusto.	Dalhemplage	49.59672963592462	5.714235011264574	8782	2025-02-22 14:12:42.43	AcYKjZK7Bwx5Sae2PkM3O	0pPbaqbG6CRY23twQBlpJ	t	\N	\N	2025-02-22 14:12:42.43
NHBKw7vAt0_QufeFnm3zZ	Parcelle sale 2	4bQdch	Terrain légèrement vallonné de 8 hectares, bien exposé. Ea dignissimos dolorum soluta molestias a deserunt aliquam pariatur.	CouvinSud	51.35859827697941	6.180328896485887	5755	2025-02-22 14:12:42.43	J3Ee9SwlCuJa9zPb6P0MM	ovjNk5xGFEuQhoBZEEPqa	t	\N	\N	2025-02-22 14:12:42.43
Y6qpiSkIGybn0wtd1ddw1	Parcelle charitable 1	bviHf8	Terrain plat de 16 hectares, bien exposé. Doloribus recusandae rerum.	Pont-à-celles	50.33597508613552	4.472768570132723	1883	2025-02-22 14:12:42.43	wfQ4P8W3pmReXejYJpAsb	IKtgwyjfWpc2z-eAQ9d1B	t	\N	\N	2025-02-22 14:12:42.43
iynGBTHajJFsEuWvlrUbw	Parcelle rectangulaire 3	Lui32i	Terrain en pente douce de 18 hectares, exposé plein sud. Repellat ab enim ad error omnis sequi esse aspernatur assumenda.	Quiévrain	49.69742300572329	5.487480171899248	9101	2025-02-22 14:12:42.43	Hsd7_4oJ994yGzAHQ3BXT	3vB61f9htmIrdFLRBFewe	t	\N	\N	2025-02-22 14:12:42.43
pwq9-uirdJZYbtIfeOxad	Parcelle fourbe 2	4OciWB	Terrain plat de 14 hectares, bien exposé. Amet omnis occaecati vitae dolores voluptate.	Herve	50.5490896892999	2.723991057869005	5670	2025-02-22 14:12:42.43	itERaDH6dUFjWofXMCin2	ryEjmXiiYk_GppLX2BV71	t	\N	\N	2025-02-22 14:12:42.43
jqYF13a_0Zv-d-SAy916V	Parcelle considérable 1	Fq8poh	Terrain légèrement vallonné de 20 hectares, exposé plein sud. Autem est perspiciatis nemo.	Herve	50.55076964111543	2.717968918701528	5670	2025-02-22 14:12:42.43	wfQ4P8W3pmReXejYJpAsb	ryEjmXiiYk_GppLX2BV71	t	\N	\N	2025-02-22 14:12:42.43
n3oHdc2SrAFQnEM6N2as4	Parcelle séculaire 1	3HVYGD	Terrain légèrement vallonné de 13 hectares, bien exposé. Sed vitae in tempore numquam aliquam illum.	Virton	49.54163449816828	6.060831645429618	5952	2025-02-22 14:12:42.43	J3Ee9SwlCuJa9zPb6P0MM	Da55zpDXlye6Uc-MSlFQt	t	\N	\N	2025-02-22 14:12:42.43
2VVVgiG25Mm2TF9D2_CUb	Parcelle loufoque 1	PhqfdQ	Terrain légèrement vallonné de 18 hectares, bien exposé. Blanditiis reiciendis laudantium at excepturi magni ducimus.	Libin	50.93569040644608	4.763044195371942	3964	2025-02-22 14:12:42.43	bMPL6Qm_jFXo7stCjsrL6	dks4ve1Q8ueGHIESNipvi	t	\N	\N	2025-02-22 14:12:42.43
ucdIWEMRFitZw62xEe4CO	Parcelle âcre 2	oslVFF	Terrain en pente douce de 10 hectares, partiellement ombragé. Occaecati quia perferendis saepe sequi reprehenderit quisquam doloribus quas.	La HulpeNord	50.76813549149928	5.915394769834386	5892	2025-02-22 14:12:42.43	K6WaRBvMDjctbFMntkM7b	6r7AbVOJFJlapfrSdlMld	t	\N	\N	2025-02-22 14:12:42.43
2ywK70gxBoaszjsn8tAAY	Parcelle horrible 1	3jgs6i	Terrain plat de 20 hectares, bien exposé. Voluptate laborum molestias dolor deserunt.	Gouvycentre	50.33381420559819	3.416666457980075	3601	2025-02-22 14:12:42.43	itERaDH6dUFjWofXMCin2	WaNOBnmGFgS_IYfc5vjH1	t	\N	\N	2025-02-22 14:12:42.43
f1mc5878s1eMNWAbZ5WNu	Parcelle téméraire 1	N7o8gQ	Terrain en pente douce de 4 hectares, partiellement ombragé. Aliquid cum earum odit dolorum incidunt rem.	Daverdisseplage	49.51353870169024	3.049231996742297	8173	2025-02-22 14:12:42.431	M40RGgpJoOLEKUIibepGl	bgfy7ms7Chh7UXF7N2Rtj	t	\N	\N	2025-02-22 14:12:42.431
7cl-LW0aOFgabP0J5NMCZ	Parcelle minuscule 1	hZlCl4	Terrain légèrement vallonné de 8 hectares, bien exposé. Debitis a quos debitis natus corrupti laboriosam fugit dolor repellat.	Rouvroycentre	49.74621217753107	2.949157048561871	0545	2025-02-22 14:12:42.431	wMC-dRrH0DlFZ44Ac-XDJ	WnDdcOHGFC9J52p9dSH6K	t	\N	\N	2025-02-22 14:12:42.431
bPlpSVuBcT7UAlolNNSX6	Parcelle adorable 1	3ZphoO	Terrain plat de 17 hectares, partiellement ombragé. Quo repellendus et ad quis tempore corporis ab eius aperiam.	BassengeSud	51.05658155112681	5.534128342260743	2629	2025-02-22 14:12:42.431	Izw9ye-VB_NHoqxJX5d-u	QxBAO9AJ3pvhaRLnVX-P-	t	\N	\N	2025-02-22 14:12:42.431
a-fUiC7HgKrfYMkypOfA-	Parcelle magnifique 2	ExCOct	Terrain plat de 19 hectares, partiellement ombragé. Ducimus error magni delectus nam ad itaque.	Saint-VithNord	50.05709284856322	5.229673017020647	4765	2025-02-22 14:12:42.431	n66iRTQgdLFKmZGD199NR	BeRW-DSlIqAIdm-umGDVI	t	\N	\N	2025-02-22 14:12:42.431
ahRBm_IE225pYiL7O3vAM	Parcelle fade 1	j9YT7k	Terrain légèrement vallonné de 5 hectares, partiellement ombragé. Non possimus eum ratione.	Geercentre	51.07878955669723	4.059738491831324	2269	2025-02-22 14:12:42.431	AcYKjZK7Bwx5Sae2PkM3O	7aNAlr4OzBGNSpcOhU3-M	t	\N	\N	2025-02-22 14:12:42.431
qAdH5TuuT-6Vpq_vHOHZD	Parcelle insipide 3	1hsv4r	Terrain en pente douce de 20 hectares, partiellement ombragé. Assumenda facilis sed.	Saint-VithNord	50.05674623266295	5.225278163458854	4765	2025-02-22 14:12:42.431	3LwZFJrIJfoX-Ktv2614W	BeRW-DSlIqAIdm-umGDVI	t	\N	\N	2025-02-22 14:12:42.431
aYBNc4G3GGqwAMVWfKkV3	Parcelle sédentaire 3	bN2WJ2	Terrain en pente douce de 2 hectares, exposé plein sud. Recusandae error iste blanditiis enim quibusdam quae quis voluptatum eius.	Geercentre	51.07781363510837	4.06313300043803	2269	2025-02-22 14:12:42.431	lTC2NG4MW6EAj9Ld-ZGHQ	7aNAlr4OzBGNSpcOhU3-M	t	\N	\N	2025-02-22 14:12:42.431
JILZJvXpiSDYc7gqvAnag	Parcelle égoïste 3	JqLEcc	Terrain légèrement vallonné de 5 hectares, bien exposé. Quasi praesentium aliquam est aliquam fugit.	GemblouxSud	49.6185308857785	6.085199777887772	2053	2025-02-22 14:12:42.431	BOVjSpn9LbSWw2TKBz7cL	BD6HJA0YWR7D0dA3Abypd	t	\N	\N	2025-02-22 14:12:42.431
DYOMpvsvCfZxftZ-wUGRf	Parcelle mature 2	pPuvjF	Terrain légèrement vallonné de 20 hectares, bien exposé. Et dolorum reiciendis reiciendis necessitatibus porro consequuntur odit perspiciatis.	Libin	50.93808873301767	4.755610574017963	3964	2025-02-22 14:12:42.43	wmJRwPm8XHPJVfWLzF_ek	dks4ve1Q8ueGHIESNipvi	t	\N	\N	2025-02-22 14:12:42.43
KAfB52vHC4beqKdNWRCq9	Parcelle énorme 1	7RTlrH	Terrain légèrement vallonné de 17 hectares, partiellement ombragé. Molestias voluptate sapiente sint at.	CouvinSud	51.3646070288718	6.179194696604358	5755	2025-02-22 14:12:42.43	lTC2NG4MW6EAj9Ld-ZGHQ	ovjNk5xGFEuQhoBZEEPqa	t	\N	\N	2025-02-22 14:12:42.43
4M7zHlFF7gpMQVf5ImezC	Parcelle efficace 1	2mej7Q	Terrain plat de 3 hectares, partiellement ombragé. Id sed numquam nulla ducimus ratione suscipit.	Vaux-sur-SûreNord	49.50021963173739	2.594071495409978	9351	2025-02-22 14:12:42.43	8HLo1CywSD1SlNGX_1A2n	8qIkbndWa4mWGTWHR71tG	t	\N	\N	2025-02-22 14:12:42.43
B5nsTvZW_M8OVe1GHdYCf	Parcelle vide 2	sm1y1I	Terrain plat de 7 hectares, partiellement ombragé. Eaque voluptatem molestiae voluptatibus architecto voluptatem eaque.	Gouvycentre	50.33979790596614	3.420128753714849	3601	2025-02-22 14:12:42.43	Md6Lng_5df3846_hxFzin	WaNOBnmGFgS_IYfc5vjH1	t	\N	\N	2025-02-22 14:12:42.43
gyVLffCKzLR8xTuvebEqh	Parcelle sombre 1	2sBQNV	Terrain en pente douce de 3 hectares, bien exposé. Aut suscipit tempora labore quas fuga.	Oupeye	51.12159973853058	4.035092516101876	1650	2025-02-22 14:12:42.43	lTC2NG4MW6EAj9Ld-ZGHQ	2ETqJR5scP_fHcj8yKScf	t	\N	\N	2025-02-22 14:12:42.43
Ed4LIh9TdZMCe9zY3BFtQ	Parcelle sympathique 3	cxoGWQ	Terrain en pente douce de 8 hectares, exposé plein sud. Mollitia sed rerum.	BassengeSud	51.04888060093705	5.528171397951909	2629	2025-02-22 14:12:42.431	AcYKjZK7Bwx5Sae2PkM3O	QxBAO9AJ3pvhaRLnVX-P-	t	\N	\N	2025-02-22 14:12:42.431
x36cogDJb9EK7cGXN2t8H	Parcelle magnifique 2	Rm44x_	Terrain en pente douce de 4 hectares, bien exposé. Consequatur porro molestiae maiores tempore magni.	SambrevilleSud	50.91804223306792	5.60460826187099	0325	2025-02-22 14:12:42.431	n66iRTQgdLFKmZGD199NR	_WVvyxiF2pyL5km-uzY4t	t	\N	\N	2025-02-22 14:12:42.431
3uIVibC0wCtw_deEi2vhB	Parcelle hystérique 1	W4aIj5	Terrain légèrement vallonné de 20 hectares, bien exposé. Quaerat et praesentium nulla illum accusamus vitae nulla nulla.	Onhayeplage	50.28358822575888	3.11092392297224	6903	2025-02-22 14:12:42.43	M40RGgpJoOLEKUIibepGl	Tn94P78IPLPM1TMYn_wme	t	\N	\N	2025-02-22 14:12:42.43
DOilGey8OMueABDcBEHSR	Parcelle téméraire 1	CasET2	Terrain plat de 9 hectares, partiellement ombragé. Occaecati hic dolor provident libero id cupiditate dolore.	Erquelinnes	49.76482116514335	5.334932457417489	2986	2025-02-22 14:12:42.43	n66iRTQgdLFKmZGD199NR	Urp8UoNXFOqpegiypKeHQ	t	\N	\N	2025-02-22 14:12:42.43
FIqWbJsAs1ETnDDNDHiAy	Parcelle affable 1	lQ_PjA	Terrain en pente douce de 19 hectares, exposé plein sud. Sunt quam amet.	La LouvièreSud	50.11205144088663	4.116757330186334	4409	2025-02-22 14:12:42.43	wmJRwPm8XHPJVfWLzF_ek	L6_cAhGhEwPTF0mFoJpj3	t	\N	\N	2025-02-22 14:12:42.43
ClnKc4041mRBYye-WJjzt	Parcelle snob 3	4K-Cg_	Terrain légèrement vallonné de 2 hectares, exposé plein sud. Ea est totam ducimus autem dignissimos minima.	CouvinSud	51.37190767235067	6.17592265406196	5755	2025-02-22 14:12:42.43	8NnSiSvOIDFBzQyYS8aBt	ovjNk5xGFEuQhoBZEEPqa	t	\N	\N	2025-02-22 14:12:42.43
FE3VRKpeuXbpJOu4QrlOj	Parcelle innombrable 3	IQMJK4	Terrain en pente douce de 6 hectares, exposé plein sud. Cupiditate maxime voluptates quibusdam harum.	Gesves	50.28121360914242	4.968176814038384	1077	2025-02-22 14:12:42.43	J3Ee9SwlCuJa9zPb6P0MM	EaJFVMBSvRkUsfIB0vzoX	t	\N	\N	2025-02-22 14:12:42.43
XNU-DSArghWOq145JUaIX	Parcelle charitable 3	zhWfcD	Terrain en pente douce de 4 hectares, partiellement ombragé. Officia nam occaecati aspernatur suscipit dignissimos.	Lierneux	49.78301051363787	4.781576550276392	1865	2025-02-22 14:12:42.43	Izw9ye-VB_NHoqxJX5d-u	WUVRacqDI5R0umJDvUjcu	t	\N	\N	2025-02-22 14:12:42.43
pnQSOPBJVsMH8nuqaSLrh	Parcelle lunatique 2	OSSzMW	Terrain légèrement vallonné de 1 hectares, exposé plein sud. Dolorum recusandae nam sapiente quos porro dignissimos quae.	Donceel	49.84700728468597	4.953860895807479	4408	2025-02-22 14:12:42.43	Izw9ye-VB_NHoqxJX5d-u	YJuOs2zBmtOsLUcBaae9Z	t	\N	\N	2025-02-22 14:12:42.43
fd9zuzOzfHW_M0GqfEm1U	Parcelle mature 3	3vUFeE	Terrain en pente douce de 7 hectares, partiellement ombragé. Temporibus quod quidem.	Herve	50.5409466338444	2.714529256939019	5670	2025-02-22 14:12:42.43	FyXCWu5iojd28394U0qld	ryEjmXiiYk_GppLX2BV71	t	\N	\N	2025-02-22 14:12:42.43
Tw53qMuurUUF0t7pfHPf1	Parcelle gai 1	SyuUOM	Terrain plat de 11 hectares, bien exposé. Ex inventore totam sequi nobis.	Quiévrain	49.70289657721633	5.485756635526732	9101	2025-02-22 14:12:42.43	FyXCWu5iojd28394U0qld	3vB61f9htmIrdFLRBFewe	t	\N	\N	2025-02-22 14:12:42.43
pqGEX_eHfU_3HD8Dyzjhc	Parcelle adorable 1	7qaLFH	Terrain en pente douce de 19 hectares, exposé plein sud. Facere consequuntur fugit quos porro.	Donceel	49.86215062512272	4.953742450866429	4408	2025-02-22 14:12:42.43	wMC-dRrH0DlFZ44Ac-XDJ	YJuOs2zBmtOsLUcBaae9Z	t	\N	\N	2025-02-22 14:12:42.43
v2d7GNgWbpJZpUgW5ZPPt	Parcelle délectable 1	OwkZlD	Terrain plat de 3 hectares, bien exposé. Quis dolores praesentium.	Vervierscentre	50.07699045540927	5.537970135654012	1830	2025-02-22 14:12:42.43	wmJRwPm8XHPJVfWLzF_ek	GSOjPn64Wbzjm7nUs9oZO	t	\N	\N	2025-02-22 14:12:42.43
JMfK4az7iLT48B5yT73gf	Parcelle délectable 1	BfTeMC	Terrain plat de 19 hectares, bien exposé. Illum nulla ratione nemo esse.	Frameriescentre	50.23992207887142	3.232688262238627	8761	2025-02-22 14:12:42.43	tFMr5xvKV1eyeppsRpFQz	DmGmmiPql_KDt9I2g_LUe	t	\N	\N	2025-02-22 14:12:42.43
hm6GNMpfqTf84ST22X86Q	Parcelle amorphe 3	My1SNf	Terrain plat de 15 hectares, exposé plein sud. Illum corrupti necessitatibus nostrum dicta laudantium veritatis.	Dalhemplage	49.60184382264892	5.708142809448514	8782	2025-02-22 14:12:42.43	lTC2NG4MW6EAj9Ld-ZGHQ	0pPbaqbG6CRY23twQBlpJ	t	\N	\N	2025-02-22 14:12:42.43
YXaxDaNPPnwrQlanhzca4	Parcelle multiple 1	cHSzdP	Terrain légèrement vallonné de 5 hectares, bien exposé. Alias velit dignissimos voluptatem velit.	Doische	49.58643706777216	2.612228455133281	2300	2025-02-22 14:12:42.43	uP_oPzHBLI_sCWGJcdQjf	N9q3YVc-FyLz7iqit6USy	t	\N	\N	2025-02-22 14:12:42.43
LK7kXmnPYdnGdIjUEmeYb	Parcelle vide 1	nieR0r	Terrain légèrement vallonné de 9 hectares, exposé plein sud. Minima asperiores unde.	BraivesNord	49.95791087708468	2.75533382764332	6907	2025-02-22 14:12:42.431	wmJRwPm8XHPJVfWLzF_ek	ejApp9LkpJrLs9SYHJUIn	t	\N	\N	2025-02-22 14:12:42.431
jPp79ex4Ta0vuSa1lI6j4	Parcelle énergique 1	ELb3P-	Terrain plat de 11 hectares, partiellement ombragé. Aut sint minima non vel odit veniam.	GemblouxSud	49.60596191185213	6.075066714229358	2053	2025-02-22 14:12:42.431	8HLo1CywSD1SlNGX_1A2n	BD6HJA0YWR7D0dA3Abypd	t	\N	\N	2025-02-22 14:12:42.431
-3pl3_AjunaIazV45A8-K	Parcelle multiple 2	so0aKG	Terrain plat de 11 hectares, partiellement ombragé. Ut eaque pariatur incidunt.	Perwez	50.15553274648585	2.837715353318912	1643	2025-02-22 14:12:42.43	wOVQYTEjlYWzaLgLRqDwK	KQna4WIQbxOPEjoX5OejC	t	\N	\N	2025-02-22 14:12:42.43
rfKV_WrgGKx_uiB1dq2pP	Parcelle vivace 2	owmtkh	Terrain en pente douce de 4 hectares, partiellement ombragé. Modi iure animi eligendi sint iure labore expedita.	Anhée	51.18791558045172	4.561648236306159	5332	2025-02-22 14:12:42.43	wfQ4P8W3pmReXejYJpAsb	7JPxvq95H3qy9Qu5wbqVr	t	\N	\N	2025-02-22 14:12:42.43
RAIptixI0Oe915-LafYp6	Parcelle terne 1	UKBuiS	Terrain en pente douce de 15 hectares, exposé plein sud. Voluptatem occaecati ducimus vero dolores modi ad nulla nulla.	Cellesplage	51.01488966388904	4.783830968477742	6501	2025-02-22 14:12:42.43	tFMr5xvKV1eyeppsRpFQz	43NiaTUC8t79UA1-TH0Nr	t	\N	\N	2025-02-22 14:12:42.43
hR3jWpzqG2qRgqGtqQ1ly	Parcelle souple 3	dZbEVF	Terrain plat de 15 hectares, exposé plein sud. Voluptatum laboriosam inventore modi illum.	La HulpeNord	50.78089519063268	5.910669237592193	5892	2025-02-22 14:12:42.43	AcYKjZK7Bwx5Sae2PkM3O	6r7AbVOJFJlapfrSdlMld	t	\N	\N	2025-02-22 14:12:42.43
gkSje-Z0YBcTtCzwXNUxf	Parcelle horrible 2	E5XaKh	Terrain plat de 8 hectares, exposé plein sud. Distinctio esse veniam placeat porro dicta.	BassengeSud	51.05664669010086	5.522779400765982	2629	2025-02-22 14:12:42.431	NM5e2trpKlZJ_O6tev2nr	QxBAO9AJ3pvhaRLnVX-P-	t	\N	\N	2025-02-22 14:12:42.431
sU1Ja2_DjHu-FffmR8eyd	Parcelle sombre 1	tKtwOx	Terrain plat de 7 hectares, exposé plein sud. Cupiditate praesentium laudantium porro rem.	RendeuxNord	50.59745329528248	4.242610394666688	2928	2025-02-22 14:12:42.431	FyXCWu5iojd28394U0qld	j7AifDS7C5TMA6EyoY9_e	t	\N	\N	2025-02-22 14:12:42.431
GrKBDZvohUX_JF67YFHqr	Parcelle sale 1	1E6tuj	Terrain en pente douce de 5 hectares, bien exposé. Ab perferendis nemo quisquam maxime quam culpa voluptatem voluptate.	OuffetSud	50.64159927106238	4.006947638372779	3709	2025-02-22 14:12:42.43	wmJRwPm8XHPJVfWLzF_ek	l3ACiQZoeJ_KEYGCKcdah	t	\N	\N	2025-02-22 14:12:42.43
QzM1vx-ttidyJmR6po2im	Parcelle ferme 2	DoSN02	Terrain en pente douce de 7 hectares, bien exposé. Modi nemo nostrum ex voluptas.	Hamoir	49.84135512644183	4.917383899599853	3947	2025-02-22 14:12:42.43	s-1VEetXxifPenKuni0Es	u_o5N7aH-z37FNCNbK3O6	t	\N	\N	2025-02-22 14:12:42.43
aSgdnxKqB27Iz5Ga9nfhy	Parcelle extatique 2	Ds9LKi	Terrain légèrement vallonné de 1 hectares, partiellement ombragé. Corrupti distinctio quisquam.	BraivesNord	49.96906277041519	2.772085166553146	6907	2025-02-22 14:12:42.431	B7SmvndyIUHNnkU7J7oq_	ejApp9LkpJrLs9SYHJUIn	t	\N	\N	2025-02-22 14:12:42.431
IkIZBgWc5X30utMiQubB4	Parcelle fourbe 2	i8RCOX	Terrain légèrement vallonné de 1 hectares, exposé plein sud. Molestias rem error eius libero hic quidem enim dolores repudiandae.	Geercentre	51.07850890237139	4.052287611741781	2269	2025-02-22 14:12:42.431	KJgFo9Tt4BkEnCremB2QE	7aNAlr4OzBGNSpcOhU3-M	t	\N	\N	2025-02-22 14:12:42.431
7lEucAm4sziqgWMdwdOGT	Parcelle simple 1	xePnTK	Terrain en pente douce de 5 hectares, partiellement ombragé. Nobis velit esse iste optio quae quaerat.	Saint-Léger	50.98667537613843	4.382874889809192	0599	2025-02-22 14:12:42.431	lTC2NG4MW6EAj9Ld-ZGHQ	NwrVXGEqqKFlBJYAPBITi	t	\N	\N	2025-02-22 14:12:42.431
uVG-jlZrq1cNv8btF-l0G	Parcelle tranquille 2	TUkDPe	Terrain légèrement vallonné de 8 hectares, partiellement ombragé. Vero culpa magni ut.	Saint-Léger	50.98089452359896	4.38726979169874	0599	2025-02-22 14:12:42.431	lTC2NG4MW6EAj9Ld-ZGHQ	NwrVXGEqqKFlBJYAPBITi	t	\N	\N	2025-02-22 14:12:42.431
5CBGs8uA3-50Sh8Yt6H0T	Parcelle affable 2	bvt_Tf	Terrain en pente douce de 4 hectares, exposé plein sud. Atque mollitia earum illum saepe voluptatibus accusantium asperiores enim eius.	Les Bons Villersplage	51.36808106358991	3.60116049792298	0896	2025-02-22 14:12:42.43	3LwZFJrIJfoX-Ktv2614W	7k1lRYcRXMFQkX_lYAE6K	t	\N	\N	2025-02-22 14:12:42.43
jZNfL6UdtWfZa7MjeDBux	Parcelle sédentaire 2	SSvwxd	Terrain plat de 1 hectares, bien exposé. Omnis quaerat iste adipisci cum ut quis.	Plombièresplage	50.92461304820809	4.645743499650858	2439	2025-02-22 14:12:42.43	uP_oPzHBLI_sCWGJcdQjf	A7JLe8HAS57CUvazQAZpB	t	\N	\N	2025-02-22 14:12:42.43
wc80BnjXaGE61R4lEiC1N	Parcelle hypocrite 1	S5d4xz	Terrain plat de 19 hectares, partiellement ombragé. Occaecati corrupti deserunt optio dolor dolore repellendus asperiores eligendi.	La HulpeNord	50.77179829689067	5.902154543050504	5892	2025-02-22 14:12:42.43	n66iRTQgdLFKmZGD199NR	6r7AbVOJFJlapfrSdlMld	t	\N	\N	2025-02-22 14:12:42.43
-sxgEZwE7S44FFSZgdBxL	Parcelle incalculable 3	yoJ24O	Terrain en pente douce de 8 hectares, exposé plein sud. Eligendi ad molestiae temporibus cum.	RendeuxNord	50.59309118808457	4.225019753541486	2928	2025-02-22 14:12:42.431	Hsd7_4oJ994yGzAHQ3BXT	j7AifDS7C5TMA6EyoY9_e	t	\N	\N	2025-02-22 14:12:42.431
4DPjBgVhQi095vBulkdPM	Parcelle serviable 1	2yPVYS	Terrain légèrement vallonné de 14 hectares, exposé plein sud. Dolor ratione quidem esse dolores voluptatum error.	Vaux-sur-SûreSud	49.83810575005343	4.390869774293803	0616	2025-02-22 14:12:42.431	J3Ee9SwlCuJa9zPb6P0MM	YOMNKILCHuHrEle1Aj02A	t	\N	\N	2025-02-22 14:12:42.431
J4B9MymLids6LC28TIn_N	Parcelle amorphe 1	x1eN2s	Terrain en pente douce de 11 hectares, partiellement ombragé. Quo illo temporibus aut sint quis.	Anhée	51.19144261046787	4.554868082775136	5332	2025-02-22 14:12:42.43	bgHTxYvS43U8MCchXGI6u	7JPxvq95H3qy9Qu5wbqVr	t	\N	\N	2025-02-22 14:12:42.43
OLH7mV0t4wwqnOcfQENqe	Parcelle tendre 1	cuvFam	Terrain légèrement vallonné de 1 hectares, partiellement ombragé. Incidunt expedita nobis facere voluptas et occaecati culpa.	Plombièresplage	50.93481355760787	4.634828958425828	2439	2025-02-22 14:12:42.43	AcYKjZK7Bwx5Sae2PkM3O	A7JLe8HAS57CUvazQAZpB	t	\N	\N	2025-02-22 14:12:42.43
i3xkNAK7akxhuZwyJLqyN	Parcelle mature 1	WbWw6s	Terrain plat de 14 hectares, partiellement ombragé. Voluptate quae magni tempora.	Cerfontaine	50.84069582685024	2.74677766060738	6299	2025-02-22 14:12:42.43	n66iRTQgdLFKmZGD199NR	_88FbPfC934aRiwOhDVqW	t	\N	\N	2025-02-22 14:12:42.43
2hGa0SAKvdCceRajyCHfs	Parcelle maigre 2	_PRnkQ	Terrain plat de 20 hectares, bien exposé. Repellendus earum quae eligendi illo rem atque aut.	OuffetSud	50.62937905433918	4.003022271678392	3709	2025-02-22 14:12:42.43	B7SmvndyIUHNnkU7J7oq_	l3ACiQZoeJ_KEYGCKcdah	t	\N	\N	2025-02-22 14:12:42.43
8aj1ggAQEvg7yHPJktqVA	Parcelle pauvre 1	1Ha7Wg	Terrain légèrement vallonné de 8 hectares, partiellement ombragé. Praesentium exercitationem dolores reprehenderit vel suscipit eaque.	Andenneplage	49.96983537796658	5.917128410345385	4284	2025-02-22 14:12:42.43	3LwZFJrIJfoX-Ktv2614W	psdMG7RZLx5y2PiKQLPhM	t	\N	\N	2025-02-22 14:12:42.43
AUjP9yHx78EOmT7vWkf3c	Parcelle ferme 2	UcPwUz	Terrain plat de 2 hectares, bien exposé. Et distinctio minima porro iusto recusandae enim velit nulla.	Rouvroycentre	49.74730749287139	2.949956265308294	0545	2025-02-22 14:12:42.431	itERaDH6dUFjWofXMCin2	WnDdcOHGFC9J52p9dSH6K	t	\N	\N	2025-02-22 14:12:42.431
dfXarJXdM7KUYExw19SsB	Parcelle efficace 2	_KhwnB	Terrain légèrement vallonné de 18 hectares, bien exposé. Rerum mollitia vero fugiat.	RendeuxNord	50.59839780257576	4.227330199124522	2928	2025-02-22 14:12:42.431	wfQ4P8W3pmReXejYJpAsb	j7AifDS7C5TMA6EyoY9_e	t	\N	\N	2025-02-22 14:12:42.431
uYUHXoVvI-oXQ1rIpjl_Y	Parcelle dense 1	fw8fKs	Terrain plat de 19 hectares, partiellement ombragé. Assumenda vero maxime delectus itaque.	Libincentre	51.43771461802658	5.61798800021726	9435	2025-02-22 14:12:42.431	bgHTxYvS43U8MCchXGI6u	Xr9j9SnhmQX9qlB_Ag3c2	t	\N	\N	2025-02-22 14:12:42.431
wWY7AeJQ9qSWbNwsiMhDo	Parcelle maigre 3	F-0g9O	Terrain en pente douce de 13 hectares, bien exposé. Similique saepe autem commodi.	Rixensart	50.4724509870214	5.115411021429071	1602	2025-02-22 14:12:42.43	AcYKjZK7Bwx5Sae2PkM3O	v91n_VR_s6fQ9eCIvUP7W	t	\N	\N	2025-02-22 14:12:42.43
NxyPzuTBZd_UkHTTRrab1	Parcelle large 2	8XTm_8	Terrain légèrement vallonné de 14 hectares, partiellement ombragé. Minima sequi modi ea exercitationem minus earum.	Lierneux	49.78390634648883	4.780423317030226	1865	2025-02-22 14:12:42.43	s-1VEetXxifPenKuni0Es	WUVRacqDI5R0umJDvUjcu	t	\N	\N	2025-02-22 14:12:42.43
FHHeFa66iZq5z-IjwvDR3	Parcelle rapide 3	mCN45O	Terrain plat de 12 hectares, bien exposé. Quibusdam veritatis distinctio maxime.	Libin	50.93492130715521	4.75450755660512	3964	2025-02-22 14:12:42.43	8HLo1CywSD1SlNGX_1A2n	dks4ve1Q8ueGHIESNipvi	t	\N	\N	2025-02-22 14:12:42.43
veG5s6dZYCa345KsxU_3v	Parcelle antique 2	FHK5uR	Terrain plat de 17 hectares, bien exposé. Necessitatibus fugit iste error possimus expedita suscipit deserunt.	Doische	49.60272927645907	2.608422318865331	2300	2025-02-22 14:12:42.43	3LwZFJrIJfoX-Ktv2614W	N9q3YVc-FyLz7iqit6USy	t	\N	\N	2025-02-22 14:12:42.43
_XU5GOK9o5RKBZrsVGjVP	Parcelle souple 1	MKSbN4	Terrain légèrement vallonné de 2 hectares, partiellement ombragé. Consequuntur molestiae laboriosam architecto dolorem.	Saint-VithNord	50.05367561006846	5.238387776030809	4765	2025-02-22 14:12:42.431	bgHTxYvS43U8MCchXGI6u	BeRW-DSlIqAIdm-umGDVI	t	\N	\N	2025-02-22 14:12:42.431
ZWma3qJbFDo3G07Mi6Gh7	Parcelle terne 3	JvEAof	Terrain en pente douce de 14 hectares, bien exposé. Culpa maiores sunt dicta magni veritatis accusamus.	Vaux-sur-SûreSud	49.82824559550392	4.387760335142091	0616	2025-02-22 14:12:42.431	FyXCWu5iojd28394U0qld	YOMNKILCHuHrEle1Aj02A	t	\N	\N	2025-02-22 14:12:42.431
6tp4uI9B2cwYtX3SlJXm_	Parcelle considérable 1	xUTo6d	Terrain en pente douce de 7 hectares, partiellement ombragé. Dicta esse exercitationem sunt facilis exercitationem eius libero architecto minima.	PhilippevilleNord	50.08250925645468	6.002748198093965	3472	2025-02-22 14:12:42.43	K6WaRBvMDjctbFMntkM7b	ApKrmAfcG1py_FJDRPKI8	t	\N	\N	2025-02-22 14:12:42.43
sCGjQFkPsRQWPfW3VC6T_	Parcelle insipide 1	qAoXo6	Terrain plat de 5 hectares, bien exposé. Quibusdam debitis commodi tenetur.	Lierneux	49.78825104737314	4.768195028301228	1865	2025-02-22 14:12:42.43	bMPL6Qm_jFXo7stCjsrL6	WUVRacqDI5R0umJDvUjcu	t	\N	\N	2025-02-22 14:12:42.43
bPH6GGEx5u_mEC8rRd9be	Parcelle hypocrite 1	Qv9vEd	Terrain en pente douce de 14 hectares, partiellement ombragé. Tempore debitis omnis.	Huy	49.87316487711053	6.381714000233921	0001	2025-02-22 14:12:42.43	s-1VEetXxifPenKuni0Es	_ZSs-kB8fX3Ut3ZZdC7d5	t	\N	\N	2025-02-22 14:12:42.43
kr-UNPRX4apdghbbZjcZJ	Parcelle antique 3	ziwy-V	Terrain légèrement vallonné de 1 hectares, partiellement ombragé. Totam velit soluta laudantium voluptatum numquam officiis incidunt quod.	Doische	49.58734472598668	2.615275849916223	2300	2025-02-22 14:12:42.43	bgHTxYvS43U8MCchXGI6u	N9q3YVc-FyLz7iqit6USy	t	\N	\N	2025-02-22 14:12:42.43
rTFEz_TLTNdYQCdpf8XTF	Parcelle dense 2	pftjin	Terrain plat de 6 hectares, exposé plein sud. Facere sed eaque.	Huy	49.86960738023905	6.369617781797455	0001	2025-02-22 14:12:42.43	wmJRwPm8XHPJVfWLzF_ek	_ZSs-kB8fX3Ut3ZZdC7d5	t	\N	\N	2025-02-22 14:12:42.43
M9ntsmng_Q-C5U-U78t00	Parcelle fidèle 1	R6ib2Z	Terrain en pente douce de 13 hectares, exposé plein sud. Quaerat autem perferendis dignissimos tempora ea sapiente ipsam.	Erquelinnes	51.0075725901273	3.266998009928768	8939	2025-02-22 14:12:42.431	B7SmvndyIUHNnkU7J7oq_	Vf9NyI6904NqUfjgdbday	t	\N	\N	2025-02-22 14:12:42.431
kuE1A5ltL0zYPAOoSp4sx	Parcelle incalculable 2	qcB0eP	Terrain légèrement vallonné de 4 hectares, partiellement ombragé. Dignissimos quis officiis expedita corrupti.	Vaux-sur-SûreSud	49.83038355239753	4.389928294449835	0616	2025-02-22 14:12:42.431	wMC-dRrH0DlFZ44Ac-XDJ	YOMNKILCHuHrEle1Aj02A	t	\N	\N	2025-02-22 14:12:42.431
l-z_QKlfuSnRChQXN9GEJ	Parcelle agréable 1	kes2zv	Terrain plat de 11 hectares, bien exposé. Nostrum neque sed tempore iusto eveniet sapiente est.	BrugeletteSud	49.89134827101589	4.257233484113008	9625	2025-02-22 14:12:42.43	mUFNRejDdkIvvGJDR_fQj	iS9qzBx9Ue7TFG9rw6dW3	t	\N	\N	2025-02-22 14:12:42.43
vMiugrrYVYzQOd3eVKk5W	Parcelle mélancolique 1	H1W70n	Terrain en pente douce de 5 hectares, partiellement ombragé. Optio cumque hic.	Gesves	50.29711198918665	4.968636966603012	1077	2025-02-22 14:12:42.43	uP_oPzHBLI_sCWGJcdQjf	EaJFVMBSvRkUsfIB0vzoX	t	\N	\N	2025-02-22 14:12:42.43
70_Da5DbjlczNlxcq6tf5	Parcelle extra 1	oI6_wK	Terrain en pente douce de 5 hectares, partiellement ombragé. Enim omnis autem excepturi eaque expedita ab hic debitis molestiae.	Binche	50.45150797189867	3.74162106393408	4141	2025-02-22 14:12:42.43	8HLo1CywSD1SlNGX_1A2n	CriacjaF7clY8TlcTtQxB	t	\N	\N	2025-02-22 14:12:42.43
nFjbBRh5UPMwRIkTVyoTO	Parcelle sincère 1	DwvWF_	Terrain plat de 17 hectares, partiellement ombragé. Est assumenda repellat incidunt reiciendis.	Frameries	49.80953832718608	3.018096348258051	8912	2025-02-22 14:12:42.43	uP_oPzHBLI_sCWGJcdQjf	v9r83eu8-2_TSklKMplMR	t	\N	\N	2025-02-22 14:12:42.43
VUnJlfJ0C2LKCHECC9-9t	Parcelle splendide 3	dvJSM2	Terrain en pente douce de 3 hectares, partiellement ombragé. Nemo aut eveniet quibusdam ut libero explicabo unde sint.	Perwez	50.15265574348474	2.85083090383705	1643	2025-02-22 14:12:42.43	wfQ4P8W3pmReXejYJpAsb	KQna4WIQbxOPEjoX5OejC	t	\N	\N	2025-02-22 14:12:42.43
3YeSjX9clyLePpedPNg3t	Parcelle énorme 1	axC_Na	Terrain légèrement vallonné de 2 hectares, bien exposé. Consequatur pariatur officiis.	Berloz	50.35221163611853	5.920471083229232	9646	2025-02-22 14:12:42.43	K6WaRBvMDjctbFMntkM7b	SPq0qfzqFBuj9JFBz9rzm	t	\N	\N	2025-02-22 14:12:42.43
PlWOiUQhqo4oYaq_LzLvU	Parcelle efficace 1	RHh9Fx	Terrain en pente douce de 15 hectares, partiellement ombragé. Quis excepturi molestias ex libero id iusto quis ipsa voluptas.	Les Bons Villersplage	51.37221543446569	3.605315463712286	0896	2025-02-22 14:12:42.43	n66iRTQgdLFKmZGD199NR	7k1lRYcRXMFQkX_lYAE6K	t	\N	\N	2025-02-22 14:12:42.43
WvlxG7yJcCadU9IOvgZs-	Parcelle infime 1	QfrigD	Terrain en pente douce de 7 hectares, bien exposé. Sunt laudantium excepturi excepturi ex.	Habay	49.8307210547155	3.787799101029069	0809	2025-02-22 14:12:42.43	FyXCWu5iojd28394U0qld	2xFBexng2PdSJh1r3MIZe	t	\N	\N	2025-02-22 14:12:42.43
YkSt75diZaWRczXN7UfSu	Parcelle émérite 3	u7VWIY	Terrain plat de 19 hectares, bien exposé. Aliquam rerum aliquam quisquam laborum rerum ea ab.	Gouvycentre	50.32157068354474	3.413875560123666	3601	2025-02-22 14:12:42.43	8HLo1CywSD1SlNGX_1A2n	WaNOBnmGFgS_IYfc5vjH1	t	\N	\N	2025-02-22 14:12:42.43
60Ef4qERctPGATdp_hMOX	Parcelle tendre 2	mbGNw1	Terrain légèrement vallonné de 9 hectares, exposé plein sud. Porro in distinctio.	Oupeye	51.11685019254475	4.047829375403922	1650	2025-02-22 14:12:42.43	lTC2NG4MW6EAj9Ld-ZGHQ	2ETqJR5scP_fHcj8yKScf	t	\N	\N	2025-02-22 14:12:42.43
2xZHhKQ6aoDtmtqYlSKTy	Parcelle aimable 2	5imgjQ	Terrain plat de 2 hectares, partiellement ombragé. Ea velit nulla quam.	Dalhemplage	49.605963353025	5.711077789393846	8782	2025-02-22 14:12:42.43	J3Ee9SwlCuJa9zPb6P0MM	0pPbaqbG6CRY23twQBlpJ	t	\N	\N	2025-02-22 14:12:42.43
0yFIrzfjUcEKUap-jLmt9	Parcelle candide 3	1eC5uU	Terrain plat de 19 hectares, partiellement ombragé. Nisi numquam minus autem consequatur rerum dignissimos non.	BraivesNord	49.95773210501314	2.764549713377546	6907	2025-02-22 14:12:42.431	bMPL6Qm_jFXo7stCjsrL6	ejApp9LkpJrLs9SYHJUIn	t	\N	\N	2025-02-22 14:12:42.431
XOxBaKZIcgufUD7ajhbNG	Parcelle fade 1	pEdMxs	Terrain légèrement vallonné de 20 hectares, exposé plein sud. Perferendis adipisci iure error voluptatem mollitia rerum suscipit vero.	SambrevilleSud	50.91920836436827	5.609858321614425	0325	2025-02-22 14:12:42.431	K6WaRBvMDjctbFMntkM7b	_WVvyxiF2pyL5km-uzY4t	t	\N	\N	2025-02-22 14:12:42.431
BOpg03Wk_nAJQ-NaWMaCE	Parcelle large 2	s6uISw	Terrain plat de 9 hectares, exposé plein sud. Earum soluta pariatur tempore repudiandae voluptatibus.	GemblouxSud	49.60720180932644	6.086325680478268	2053	2025-02-22 14:12:42.431	Md6Lng_5df3846_hxFzin	BD6HJA0YWR7D0dA3Abypd	t	\N	\N	2025-02-22 14:12:42.431
\.


--
-- Data for Name: gleaning_participations; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.gleaning_participations (gleaning_id, participation_id) FROM stdin;
D-VVgIfemBQrL0_LRG_Hy	YYT3T0sbD90UK0fwLDHHi
c7Xov-95fRCvdkD9Y6Mcg	Ub2msR3lJi8c4DSDb20sM
mQXnWhcogKmtSUx4SNbAJ	9dLNYf4JUqXt6pV0QOIdB
b9ts-vrchuCMb2FYmO6J1	Ax4zoW71IOfk9mtBODuC5
BYQjBA1LceJU68qTeyK6B	TUHLDfgxcm6ObBGqI9u8c
37Ks8jjD4yTlSGQ2NEFe8	sE8t7VlQLRIAN1XABdxYw
3-0e9WDuPziZOSyJBr70x	eQX6Vy5hq9TsSnPEg54Go
UJhyoPZbyHtn4VMvILBc0	Xg4q6W-K4IEVFeGdVq8IX
Pc_jK_XfurhlI7D1K1EzD	UFDXgMyFhNY1nmv5YRxRZ
206aHcsfRYc8l-VIlOPcI	oRzdAROuDZDzl70VOsCfx
ek1N36aJGduQVXPrgSaks	nC4ecC92LqryrU6TG5EZs
thKJp_MBMElaBrkE7Qrq7	6fFapeWRi9VweNKA_Kj7B
8LFwbjDAAtfbHWZj_YqZX	VuP_XzjM4l3rniqaDbhBS
Qfti5IRW7fV_bbeeMnI8d	blELariXPg-WiP5EadGjo
HGqEDFM_J8KZ1B2o34fQu	wAOzHGiOh0LT8Y6ZNrHTc
Y7darrt4Nq_KjV_EI87Kg	QffDGTZWzeJGiedHZRYR1
IkWyOTprLpoRTu2EBt26u	34hCw1eArRCpwqLesu5z-
rQU-JqptuWf_B7ERjZjpe	7lyqNxYHCSQn41Z-gEsxP
n02iRiNM13lLPeszrwjGW	hoVgQGafSf9KBwt9jCyTH
KjLrzoHY3EIY076Mc-wiH	6DMugN9E2RsRSiG_8upCK
iRBRVvtjh3E0-I6iVIEBg	6BEHNcNmP6Fq7UA8VFAC7
o6Qo8kTJYZj5--RzltINV	mAaWH8j6FuAEShc3jv6rU
42MHOYWZEngq7KjyjQPdx	gaXoMS-nrdFFjLxbnsnaz
8LPI4NgekMXH-PSV9GGFA	HpYv6lej82gEFXegu0yYz
FXDDxcBzyHvnQLVcZIjpr	2pCEiBPEieHR0GzAhEmnS
h89eeQoRpLBtux0ZF73p3	fmfs5FpWJUHSMwBd04FlO
qCiI6wABv2xUkMHThoWI3	qqJ9EYq1IWF8TvrVErOup
Anw73IqWy0jTA8TW19gA9	-ti-hsBG0zQsXjERxoQeg
quaTdmiitA9oOeTBFd7ro	ZEIDMrrDGs_vEU8jQMksP
G36Ah9N-ybCvLVyXKabfc	Xnf7-HCwONU7lXWpGAF8K
o9DXqFD-pnCLlsQtQiT3z	EbP7VPMYfAQvN7CwNCpEp
sAg-S_5wfOoBb_Oc1e5GD	YvkkySNxwYhgMyTBTWWD_
7ROYmJ3i5at42effPCnNO	_7K-naLZzK952a_Lpop0g
yhlFM_i1dmdLf0w4BsudL	2H1IgNhB0IAux3rAEYiSz
qQ1tAUWMphZrv5IeJ5AT5	FJ3lua9oWVLFe8JXG3RoK
9jgoru0OgtgLC8jdXQ4Cj	2yctDZSyrG22aUCDSyt8s
HLIriS6OXJcXDkFf3LP2U	OB8SYZSDEJHhCZHdOdV4-
VWNbBI0SKlgTj78yS96G_	JS6YSs0LpMDnqBYCjm0gJ
xXIHt10wubDGKqkm8mt2B	LgapoWekw43oTdU3yDFeS
jpTZHVGJ8hVWgyKFUfIBK	r64DUn7MdNeFguHFPhDa4
pCM_Hc1hTeuSou8-ZkV8_	xDdvZGlaVOLd7-U5FFsyv
5U-GhaoiBtYqLlz_hWAvS	SsfI-lxdGvJ1PIl0SERe0
uGny176IKQHtrikjZN72R	xi7Mn5xYgt6_5N8SA-9IO
DIaE_qzeUqM60TlHcBluY	2slYgYp_5qymAR1zUwPzw
pm83B0OLtzbS45SFryJ3L	C2CWSPIIqA0Ew-QTb-j6t
DVxPI8cI3xx_gCBcTisKA	Pmn5RLX5dZ5GiPy1fW0K7
YZTDLF0a4wzWT3DneN7PB	M31tW67VWBZblLEOvDzx5
dx_2dChP2x58k9fmCzMna	-a6mLs0ZNVLT-JVOs7psJ
LPJnsdniltMFCdBA8F6Qf	lScADkLwCS__fsjliN2Bn
FcUP0PlQ4K9kNc9K07y1P	ADCFMGly6yo0N12Z9SWfh
wYppvPkB8lQQ43bHF5cqD	LAkwJru4YQwH60VU8A0fW
QPkPf3DTKJEuGEJz50tie	FWzHAOxDs9-Ej-5cVfVye
kxxQZT4wAWkLzxLG1vnS3	QPZmCVoPXkfQFJBzkbD0s
B8tHmfOQjKLQ9bgz-J4-r	UZebTmJ7-JTyC9x72I8bq
Vzv52howbp3xGidZeHx1A	YK-m3SiL7bwg4pTCoDpJv
CB-pFXDEUrT1mpjESwmpE	hQqHYux26vH_dCx2Y6-3-
G916S1EC8VoNeVKOP_yXr	_W3pLaNujwdZA1wWLFxL5
FnLdPOmPgcVu7f6-uLgS-	jA78tBWuL-Ux4-KRVHRhM
xca0ZfkH_n0IIiA8Gdpzp	z62vzxpy_e6IrrlzcUYR0
RuYfTna36ITWHCvGeePzo	U0m9qIvLJ4NfbJ-2zzozv
dm7kkBOtn4G4OfwADPzqs	q2c4_FKrGcWRwo1-QRJZa
0peNMRKqXa-gTBQBJYZcj	3lGNmvAvTFDWwERk5Ejqn
qLpalXQq0imYSp_VCAbnn	NOUzMh57YuJKTQhvPSKXP
9NNQ0WEY9DeXNqfTKHs0X	y5Jf36NLSvDXW-7XdfEZI
m2R7bs-KKrlTABiOsx1d_	KU0iB6EObcMVCpDtADRFt
w__8UxobQ6z24s2csqKrw	a3euwVJa4WR1Cv7esrXvI
8ZV9autiQZjZv4h_x5kFn	15FpqSuaqItMi4gvySvzk
by7IbsKGeusgMZPdr5GiX	xc9_lynMNyEDPQJMZE-7r
oQN5thPUY8nbmnHsGyqNQ	ANyq2NFn2osYJLCdRLIDr
_buqP9lgvZDNhOba-nuK2	oQcUp2lF2Q2A4_HT44xAd
RGLoUbwPPUG7q2YU3_DCU	gascHBc5az1Bg0S-wChqd
rnHCBQQNo7IpXpVI5Dsux	BQx3o337cSYJZO0d4DlZw
qDOyKFsKxxfx4Tlg378yh	v8jaLCQ6krcSvSAdQTYV1
0ZSRz_CvWio2HNXcZJEKr	k2klfq5zzLthpCLAbS8fc
heWqzLsGjQD88b8Ag7Vum	Hy50XUU2xQ4h01-3J1msj
aJPS8S9AvhqguRTleQ10o	FR60YIXdmH2HStnDRg_qt
WqKQM6oiiowHstZSl9qxC	6eqVT4SAZVw2b8X4ahv91
VA7kYnRgyzktsQ9qAz2Y9	4nLyyD4izEEx3YwBCvEaE
0UyaCzCTcd5XJ46ZP6i1f	U8DCQRU8ZTSMxZo9w9h-6
\.


--
-- Data for Name: gleaning_periods; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.gleaning_periods (id, field_id, start_date, end_date, status) FROM stdin;
Dss1p4EzActMCO7hL8QJ6	5e-Ytn8k06JgNxpl3kzRN	2025-03-06 15:54:53.47	2025-03-17 15:54:53.47	AVAILABLE
gCbm1UqFHUR3WnazWxnQX	EWiZG2ebIC8GiML6yDIQj	2025-04-06 03:37:36.358	2025-04-20 03:37:36.358	AVAILABLE
Pp9c17boS5vBDCWs-DZtT	EWiZG2ebIC8GiML6yDIQj	2025-06-24 02:20:44.546	2025-07-07 02:20:44.546	AVAILABLE
RvdlC_k4C7rNPow7jfOOF	IRTy4cJOdc57Eqc34qcBj	2025-04-21 22:59:39.759	2025-05-02 22:59:39.759	AVAILABLE
DaSzYY06H5zVAlCT5_noE	GwbDq9yKS06Cc1XKpD0gg	2025-04-08 13:44:39.664	2025-04-16 13:44:39.664	AVAILABLE
Ud-HnaqLKwwQ_4IbhwTAK	4T7etdFLQjcMpfH9BpSRq	2025-08-02 23:13:59.815	2025-08-10 23:13:59.815	AVAILABLE
q1BeI5NJqLFWmlqyxIo-b	GwbDq9yKS06Cc1XKpD0gg	2025-07-04 17:39:42.054	2025-07-09 17:39:42.054	AVAILABLE
HvozADGbJ_V_GB7CeBugW	4T7etdFLQjcMpfH9BpSRq	2025-07-22 21:43:13.946	2025-08-05 21:43:13.946	AVAILABLE
cbt-yustEbXf4D40SUw-2	I-ohskQEUWpxogJ-BoWQl	2025-03-01 20:37:32.837	2025-03-02 20:37:32.837	AVAILABLE
Vjh8awKCY7sN7Ity_gSRT	GwbDq9yKS06Cc1XKpD0gg	2025-04-16 22:38:23.369	2025-04-19 22:38:23.369	AVAILABLE
RxM1wpOLGJMkk2CMoRehp	97gN9zrVWEAetH2LSzoft	2025-07-04 12:30:23.571	2025-07-18 12:30:23.571	AVAILABLE
WMc9rpRBzjxHJKox3uNE3	S8uBsYznnHDfgYWbRzfId	2025-04-28 18:46:32.491	2025-05-05 18:46:32.491	AVAILABLE
tp-OnmjJo3qPbC1YJK_Hf	IRTy4cJOdc57Eqc34qcBj	2025-04-04 15:04:00.257	2025-04-08 15:04:00.257	AVAILABLE
SQqF5oFU6aPV4p4BsyLlz	5e-Ytn8k06JgNxpl3kzRN	2025-05-11 13:27:56.811	2025-05-22 13:27:56.811	AVAILABLE
7CMrEZUhCNT6G9uJ6bYf3	XbBAk-uYjGQ_zYD_oJPn0	2025-03-15 13:35:36.453	2025-03-28 13:35:36.453	AVAILABLE
hUjvkq76TJl_BgB6I26K8	J5MAWjmfp0-BiOGjvXeS6	2025-05-13 19:28:54.056	2025-05-15 19:28:54.056	AVAILABLE
vWJ5vjdMqw932hsdNtyyR	4T7etdFLQjcMpfH9BpSRq	2025-06-24 12:27:53.691	2025-06-29 12:27:53.691	AVAILABLE
WNXXCMnNSsExiAG6KaE8i	WwTJgw6rG8eNQxZyCgDTa	2025-05-15 12:20:32.52	2025-05-16 12:20:32.52	AVAILABLE
UgJN-j4X_5TqWhe_qNiSC	9u2WnVff0XeBH1pt-IDK9	2025-07-11 13:32:50.951	2025-07-24 13:32:50.951	AVAILABLE
uHwmkcouLb6vLYTdeUYt4	KeWra5wOx_hxcOtfeMEzC	2025-05-06 05:02:18.417	2025-05-15 05:02:18.417	AVAILABLE
8x3S1xrwxqeHaDr5DGFMG	XbBAk-uYjGQ_zYD_oJPn0	2025-05-13 17:20:44.838	2025-05-27 17:20:44.838	AVAILABLE
YHebkwmXDedwzBqrtAkuy	i3xkNAK7akxhuZwyJLqyN	2025-03-01 00:16:03.869	2025-03-06 00:16:03.869	AVAILABLE
xfRkwBSCFTexvJIM617Rg	97gN9zrVWEAetH2LSzoft	2025-06-19 02:46:54.856	2025-06-25 02:46:54.856	AVAILABLE
vcNPrX9lzmZeJY987fbLn	WwTJgw6rG8eNQxZyCgDTa	2025-07-16 09:09:34.886	2025-07-22 09:09:34.886	AVAILABLE
XBSv0paQXsqKkb6iKrVwE	WwTJgw6rG8eNQxZyCgDTa	2025-07-07 18:54:55.853	2025-07-11 18:54:55.853	AVAILABLE
htYGKfXcgkj7B91gHUJN8	o_irxJee5ECrgqgpkW058	2025-04-05 13:24:47.58	2025-04-08 13:24:47.58	AVAILABLE
Ih-0gFO5_gnyT8GzDMTDC	S8uBsYznnHDfgYWbRzfId	2025-07-12 23:40:36.834	2025-07-14 23:40:36.834	AVAILABLE
Yr5vYaVATcHUhN0fqCxrv	i3xkNAK7akxhuZwyJLqyN	2025-08-19 13:15:14.783	2025-09-01 13:15:14.783	AVAILABLE
FKdrTX0iOiNmSgC7ndPsS	MbJfo9JGcBKBMI53Gx52l	2025-08-17 12:39:09.635	2025-08-25 12:39:09.635	AVAILABLE
6HtxBTHdPwuobMEbq-yAp	MbJfo9JGcBKBMI53Gx52l	2025-07-20 07:36:27.635	2025-07-21 07:36:27.635	AVAILABLE
M-0HNN7HUcny1KDjVbzSK	v2d7GNgWbpJZpUgW5ZPPt	2025-04-13 08:59:09.271	2025-04-23 08:59:09.271	AVAILABLE
zzsJHC1RZCTIAbLLTWb_m	RAIptixI0Oe915-LafYp6	2025-05-26 16:53:46.516	2025-05-27 16:53:46.516	AVAILABLE
B1e5oHiqWkveXNrxdN0I5	RAIptixI0Oe915-LafYp6	2025-03-11 08:03:57.687	2025-03-13 08:03:57.687	AVAILABLE
NK1OQai4EwR_5mL7IAbNQ	QVWQAWGDyqGgaZdv8KMj6	2025-06-22 07:09:37.191	2025-06-27 07:09:37.191	AVAILABLE
xTQ_33oSBQ8LgomPaplQ7	UKXhJ6gHVOfZZeTE1vREF	2025-05-29 07:49:23.403	2025-06-09 07:49:23.403	AVAILABLE
Kp3T_CnlSTbynqdhhvWM1	UKXhJ6gHVOfZZeTE1vREF	2025-05-31 17:46:29.802	2025-06-07 17:46:29.802	AVAILABLE
5LYalkrYvpDBeNEIPtUaE	QzM1vx-ttidyJmR6po2im	2025-06-26 01:04:46.539	2025-07-02 01:04:46.539	AVAILABLE
Ji4zYBOmgxjZNHbE2mHUh	UKXhJ6gHVOfZZeTE1vREF	2025-05-10 20:19:27.222	2025-05-15 20:19:27.222	AVAILABLE
xTVy_uJ4HUKY6XZ4plME1	MbJfo9JGcBKBMI53Gx52l	2025-05-24 17:26:24.178	2025-06-06 17:26:24.178	AVAILABLE
yNbq4fkt7RimifcXGcvM5	QzM1vx-ttidyJmR6po2im	2025-03-22 15:57:40.575	2025-03-24 15:57:40.575	AVAILABLE
kBVXsXYsAHtY8eqDVTGal	QzM1vx-ttidyJmR6po2im	2025-04-23 08:24:04.503	2025-05-05 08:24:04.503	AVAILABLE
s2ya6Gd0vui8vTN8jRMZc	XbBAk-uYjGQ_zYD_oJPn0	2025-07-29 19:33:01.715	2025-08-10 19:33:01.715	AVAILABLE
dKm1_Z9RgMyH2Y5wv-saR	DpA7PvGaKZpWTSZ0Q-9yw	2025-06-23 00:18:39.321	2025-06-26 00:18:39.321	AVAILABLE
LrmXyu0BCcXf7BDPKU8xs	RAIptixI0Oe915-LafYp6	2025-05-24 05:25:15.206	2025-05-29 05:25:15.206	AVAILABLE
YSaKmsBTLBfZdAGbugYtS	l-z_QKlfuSnRChQXN9GEJ	2025-04-20 20:01:11.476	2025-04-27 20:01:11.476	AVAILABLE
H49IuaCrxYEIP_P3sB9Of	hKA0lIlOmlxQ5ZRRjCCCi	2025-06-01 02:09:27.816	2025-06-03 02:09:27.816	AVAILABLE
8krg2W5cot-X0KT22UPeM	ds9W1PKaAjmaJmn2nZaZP	2025-06-12 10:35:13.363	2025-06-24 10:35:13.363	AVAILABLE
h606fe5rB-7xWMimIFshW	hKA0lIlOmlxQ5ZRRjCCCi	2025-05-25 05:02:24.725	2025-05-26 05:02:24.725	AVAILABLE
6zl0SfSV8wi_d1V-vcZft	hKA0lIlOmlxQ5ZRRjCCCi	2025-02-27 08:56:39.166	2025-03-11 08:56:39.166	AVAILABLE
EPGgZ4kDtMHBfRgBrOsea	l-z_QKlfuSnRChQXN9GEJ	2025-06-03 07:48:30.672	2025-06-07 07:48:30.672	AVAILABLE
RR9rO7nenJeHO9nzBryiL	YuOJWxyxg_Mzq-YBN9Alf	2025-08-12 14:41:00.481	2025-08-20 14:41:00.481	AVAILABLE
f0SKj_mj6J4dU6Ntxhqvc	3YeSjX9clyLePpedPNg3t	2025-08-20 19:36:49.07	2025-08-29 19:36:49.07	AVAILABLE
Cnb67nhXGsyB-lC4muAQ6	BVkA0-WHsaafy2L4dzfyF	2025-07-23 23:52:51.205	2025-08-05 23:52:51.205	AVAILABLE
bZm0q8TdNcOsuHdqRuwcp	McN6NpjvGWSAOTsyQOimg	2025-08-08 11:27:34.95	2025-08-20 11:27:34.95	AVAILABLE
QL42kcerWEWqNLJgrLEh9	3YeSjX9clyLePpedPNg3t	2025-05-28 07:02:11.666	2025-06-09 07:02:11.666	AVAILABLE
6dlRI4i_t2ANkBtpARwyr	QrpEFs-x9v0bT9Oc-SBSL	2025-08-18 18:37:56.302	2025-08-21 18:37:56.302	AVAILABLE
w-Ltb4L_Afq8m0DYWWPn-	S8wOpcS1dtAKdtAIvqLqx	2025-08-04 17:20:01.947	2025-08-08 17:20:01.947	AVAILABLE
U5ITaYMjhhAkurK6AsFeL	wWY7AeJQ9qSWbNwsiMhDo	2025-07-10 19:53:51.964	2025-07-18 19:53:51.964	AVAILABLE
THfZS7Qkgq6ngF0IISrBu	McN6NpjvGWSAOTsyQOimg	2025-06-01 23:36:54.413	2025-06-14 23:36:54.413	AVAILABLE
lNucHelCRTtq1RL2ZvsRO	1sjUjxS0Xy56VNBkXpW9z	2025-03-11 15:19:18.08	2025-03-23 15:19:18.08	AVAILABLE
JowSdxG0mopNUZCdo7D2q	X3dsl5oHptTpTrEUWgzvX	2025-05-16 17:29:05.898	2025-05-18 17:29:05.898	AVAILABLE
FQh99z17O6ECqi4HoIUJc	vMiugrrYVYzQOd3eVKk5W	2025-08-23 07:08:00.915	2025-08-24 07:08:00.915	AVAILABLE
PK3weKutq_ky8BmA3QIFS	vMiugrrYVYzQOd3eVKk5W	2025-08-01 20:34:12.819	2025-08-09 20:34:12.819	AVAILABLE
h2vWPM-iisihHn09yFUmf	McN6NpjvGWSAOTsyQOimg	2025-05-01 20:54:11.976	2025-05-10 20:54:11.976	AVAILABLE
9rm1lJn3qzlJQ3Kh_D-_P	1sjUjxS0Xy56VNBkXpW9z	2025-03-27 11:23:16.259	2025-04-07 10:23:16.259	AVAILABLE
6zCDtgSsSfUYgBYwzC6iZ	FE3VRKpeuXbpJOu4QrlOj	2025-05-01 22:41:12.144	2025-05-06 22:41:12.144	AVAILABLE
2AX76cEDkkCEdD5sQxOAb	70_Da5DbjlczNlxcq6tf5	2025-05-01 06:58:30.705	2025-05-10 06:58:30.705	AVAILABLE
Ll4YxwvjqDNXuGg8eo0jw	70_Da5DbjlczNlxcq6tf5	2025-04-04 03:52:29.16	2025-04-10 03:52:29.16	AVAILABLE
IFNYITXr_QVjeygb3dqjZ	FE3VRKpeuXbpJOu4QrlOj	2025-03-01 11:10:23.289	2025-03-02 11:10:23.289	AVAILABLE
wdYughD_iLLyu1odLZ-tz	JMfK4az7iLT48B5yT73gf	2025-08-22 01:14:20.046	2025-09-02 01:14:20.046	AVAILABLE
LmMv2ItzAodG7CZp2DScP	JMfK4az7iLT48B5yT73gf	2025-03-17 11:37:15.537	2025-03-18 11:37:15.537	AVAILABLE
2jdrGhZddVfQZGbqioNWe	mTVbJMFgxS6muVcMNacoq	2025-08-19 08:16:34.821	2025-08-28 08:16:34.821	AVAILABLE
msBSKv-Jjrdm7NqGj_HF8	mTVbJMFgxS6muVcMNacoq	2025-06-04 22:09:23.648	2025-06-07 22:09:23.648	AVAILABLE
cpEWUD1zddLKfYhuCpHIH	3uIVibC0wCtw_deEi2vhB	2025-05-01 05:56:14.266	2025-05-04 05:56:14.266	AVAILABLE
auoV_SY0kuFkSF4ytIiqh	fd9zuzOzfHW_M0GqfEm1U	2025-04-18 13:04:51.544	2025-04-28 13:04:51.544	AVAILABLE
AT5L6cxxXXR9SACTAytV2	fUKyvm-L8OqJe80TRubhL	2025-08-10 16:58:46.014	2025-08-11 16:58:46.014	AVAILABLE
bIPO6jv3jqjfupj0u0b3t	LrrnNZ2FImiNxdC_DVbJs	2025-07-24 22:48:17.971	2025-08-04 22:48:17.971	AVAILABLE
0LwtU-0JnC5HCHy3nk-Is	JMfK4az7iLT48B5yT73gf	2025-04-09 00:15:27.924	2025-04-13 00:15:27.924	AVAILABLE
ytOlX5nafXfP-Ad50E6Ro	pwq9-uirdJZYbtIfeOxad	2025-05-21 04:38:48.245	2025-05-30 04:38:48.245	AVAILABLE
IXytX04XP2kjAOeksWR4u	fd9zuzOzfHW_M0GqfEm1U	2025-06-12 20:10:40.485	2025-06-22 20:10:40.485	AVAILABLE
cwdDFoZnXTaQgrJ3OXf7G	jqYF13a_0Zv-d-SAy916V	2025-04-03 22:05:05.374	2025-04-16 22:05:05.374	AVAILABLE
sUd6FY2IqjjBngk772YXx	6tp4uI9B2cwYtX3SlJXm_	2025-08-16 02:17:20.932	2025-08-21 02:17:20.932	AVAILABLE
gAE4E3AQRWfjuc1gZL0tD	sCGjQFkPsRQWPfW3VC6T_	2025-08-03 15:06:34.169	2025-08-06 15:06:34.169	AVAILABLE
iQs_XUNt8UhVhay-YZl2K	HA_JvlE9WZF6cMKGQz7TT	2025-04-05 21:35:38.858	2025-04-18 21:35:38.858	AVAILABLE
D6S8Ytn4Tzy3HEGF1uayL	n3oHdc2SrAFQnEM6N2as4	2025-05-01 14:12:00.147	2025-05-11 14:12:00.147	AVAILABLE
A-76Ht7CmGDz-vKUi9I17	NHBKw7vAt0_QufeFnm3zZ	2025-07-09 12:40:52.551	2025-07-19 12:40:52.551	AVAILABLE
oOP6DNwhk3u-TENU3J4EB	2xZHhKQ6aoDtmtqYlSKTy	2025-03-15 09:51:29.747	2025-03-26 09:51:29.747	AVAILABLE
06J33aHoWjXZPGDC6Dnhi	WvlxG7yJcCadU9IOvgZs-	2025-05-16 13:39:48.73	2025-05-21 13:39:48.73	AVAILABLE
uAPThIwoxe7IDYpeWbUCn	GrKBDZvohUX_JF67YFHqr	2025-03-15 01:04:31.607	2025-03-29 01:04:31.607	AVAILABLE
qUeYlHR5Ad1hn9nOcoEg1	YkSt75diZaWRczXN7UfSu	2025-03-13 20:37:07.189	2025-03-23 20:37:07.189	AVAILABLE
6oSLlmJbfmptmaIxWgw2J	M9ntsmng_Q-C5U-U78t00	2025-07-19 11:11:54.593	2025-07-21 11:11:54.593	AVAILABLE
qFjkr-nLLEm3Vfc31zw38	ahRBm_IE225pYiL7O3vAM	2025-03-07 19:33:56.761	2025-03-14 19:33:56.761	AVAILABLE
FLOsYNBBFWCiG6JZzme68	XOxBaKZIcgufUD7ajhbNG	2025-08-06 06:58:08.054	2025-08-07 06:58:08.054	AVAILABLE
fR68TyYO2v4d8bOY-D5ad	jPp79ex4Ta0vuSa1lI6j4	2025-05-17 12:42:18.007	2025-05-31 12:42:18.007	AVAILABLE
_Z7IMkQVd4fP2ZHx7RtAb	mTVbJMFgxS6muVcMNacoq	2025-03-21 00:50:58.388	2025-03-26 00:50:58.388	AVAILABLE
2J8xdSvZvvSenqWDgfvcC	fd9zuzOzfHW_M0GqfEm1U	2025-06-06 08:00:23.183	2025-06-16 08:00:23.183	AVAILABLE
0qV9gklPOt2NsSTThsmHo	Y6qpiSkIGybn0wtd1ddw1	2025-07-20 21:44:20.223	2025-07-23 21:44:20.223	AVAILABLE
_qjMYS7ra2iFP_Mg0yzWQ	FHHeFa66iZq5z-IjwvDR3	2025-04-20 10:41:31.673	2025-05-03 10:41:31.673	AVAILABLE
54ph8JnFPktZw5nKX_jQO	hm6GNMpfqTf84ST22X86Q	2025-07-22 19:52:11.674	2025-07-25 19:52:11.674	AVAILABLE
fgbfJKhRp7ouJTWr-6_bf	60Ef4qERctPGATdp_hMOX	2025-04-29 15:18:34.366	2025-05-09 15:18:34.366	AVAILABLE
6eTM-ABdNxBsbJietKBZu	-3pl3_AjunaIazV45A8-K	2025-06-12 06:54:51.146	2025-06-17 06:54:51.146	AVAILABLE
UZzvfCfQoX4w2t_hTSagl	WvlxG7yJcCadU9IOvgZs-	2025-03-05 08:25:04.239	2025-03-06 08:25:04.239	AVAILABLE
Vdv5_O5OZDeLZLcT3XmyU	5CBGs8uA3-50Sh8Yt6H0T	2025-05-26 14:25:21.161	2025-05-29 14:25:21.161	AVAILABLE
gmgxWmxvWD5gwmzxINL6_	5CBGs8uA3-50Sh8Yt6H0T	2025-06-15 04:42:12.283	2025-06-29 04:42:12.283	AVAILABLE
F1JbFHxMBibvck0tneN2W	OLH7mV0t4wwqnOcfQENqe	2025-07-27 22:54:58.822	2025-08-07 22:54:58.822	AVAILABLE
Zsa3KM1bzy-hXTnbP6gsx	B5nsTvZW_M8OVe1GHdYCf	2025-04-03 17:39:12.984	2025-04-05 17:39:12.984	AVAILABLE
STDMcU0vjHxQyKZNn-nsu	wc80BnjXaGE61R4lEiC1N	2025-07-20 11:01:06.264	2025-07-22 11:01:06.264	AVAILABLE
QyN9skTnkqFwMP6Ppue9E	ucdIWEMRFitZw62xEe4CO	2025-07-28 23:52:45.559	2025-08-09 23:52:45.559	AVAILABLE
EndYbQ4xg_onpfnLa_S8_	8aj1ggAQEvg7yHPJktqVA	2025-08-02 23:44:24.255	2025-08-03 23:44:24.255	AVAILABLE
nt9c6p7-l3XZ8SEKzeSwa	AUjP9yHx78EOmT7vWkf3c	2025-07-01 18:47:50.928	2025-07-15 18:47:50.928	AVAILABLE
vgCWxvPzDPhRL8blMG9dL	dfXarJXdM7KUYExw19SsB	2025-07-29 10:51:46.764	2025-08-09 10:51:46.764	AVAILABLE
rlE2OlWVSgV_LR69SFCU6	LK7kXmnPYdnGdIjUEmeYb	2025-06-20 10:23:21.055	2025-07-01 10:23:21.055	AVAILABLE
wujVxCHPU0GzvqR5DqV9g	aSgdnxKqB27Iz5Ga9nfhy	2025-07-26 10:15:00.015	2025-07-31 10:15:00.015	AVAILABLE
PEy0A1dV1XNVkL_kZHspn	0yFIrzfjUcEKUap-jLmt9	2025-03-23 18:41:23.259	2025-04-04 17:41:23.259	AVAILABLE
-50WBwRSFUGe-pk-0bBCA	qAdH5TuuT-6Vpq_vHOHZD	2025-07-14 07:02:04.785	2025-07-17 07:02:04.785	AVAILABLE
w56qdoyQe0XfgM7CdzVQz	7lEucAm4sziqgWMdwdOGT	2025-04-10 04:27:04.462	2025-04-18 04:27:04.462	AVAILABLE
6gSmdZrJnuWqAVJ7GUwcW	JILZJvXpiSDYc7gqvAnag	2025-08-05 03:50:59.564	2025-08-18 03:50:59.564	AVAILABLE
4MvVAwy4LyUOoOnOIIMhF	ZWma3qJbFDo3G07Mi6Gh7	2025-08-18 17:28:54.333	2025-08-19 17:28:54.333	AVAILABLE
_hFlo8hCJhKKEIEeTCpro	XNU-DSArghWOq145JUaIX	2025-05-28 02:39:13.491	2025-05-29 02:39:13.491	AVAILABLE
k7xbiWmdTYMJwl_KiAkoo	fUtN9DUkbChz_RHlhbhLc	2025-06-15 07:56:59.946	2025-06-23 07:56:59.946	AVAILABLE
z0eo9uPBS6EW5uKze9yfM	ClnKc4041mRBYye-WJjzt	2025-07-22 17:36:53.513	2025-07-26 17:36:53.513	AVAILABLE
XdBBTAWoujBQdWspgqvgD	WZu1-2Ngml78WCKcLvDXj	2025-02-27 19:16:33.659	2025-03-12 19:16:33.659	AVAILABLE
m76zodnVU2C5qq9ihxxma	G3kwXHLZkFVyVAVLXsjnK	2025-06-15 20:52:57.398	2025-06-23 20:52:57.398	AVAILABLE
fQoVhM3QdrC0f2emR_fj7	cbQjjthUOxZfC1FwI7OJh	2025-05-09 06:42:25.892	2025-05-14 06:42:25.892	AVAILABLE
0pZ9EU_nJjDvtlrICCL0X	-3pl3_AjunaIazV45A8-K	2025-06-15 23:44:15.753	2025-06-17 23:44:15.753	AVAILABLE
JblXEvKSWiO90jk4M1LD4	GrKBDZvohUX_JF67YFHqr	2025-04-24 16:17:29.458	2025-04-28 16:17:29.458	AVAILABLE
3ZD45_sEuyYg6ox4M2sps	IrgUkVshZgADm3rWYog60	2025-07-09 10:52:01.785	2025-07-11 10:52:01.785	AVAILABLE
LWKTRj44zRmbXseKE1mpm	jZNfL6UdtWfZa7MjeDBux	2025-03-16 02:30:43.867	2025-03-28 02:30:43.867	AVAILABLE
JMcClHbIpErr1ey8NAy9B	jZNfL6UdtWfZa7MjeDBux	2025-05-21 12:42:20.486	2025-05-30 12:42:20.486	AVAILABLE
Xw321GWCtMCSTn4PnS3Ol	ucdIWEMRFitZw62xEe4CO	2025-05-26 08:18:42.544	2025-06-04 08:18:42.544	AVAILABLE
xG1JkqHkm0luWWT0nZtvl	hR3jWpzqG2qRgqGtqQ1ly	2025-07-06 15:46:02.846	2025-07-18 15:46:02.846	AVAILABLE
1r7u4ihuXNCGk2ETMFIf1	AUjP9yHx78EOmT7vWkf3c	2025-04-04 00:08:26.344	2025-04-18 00:08:26.344	AVAILABLE
ukn9oUK6bCQ8NG21JCpIF	AUjP9yHx78EOmT7vWkf3c	2025-07-25 12:58:53.3	2025-07-31 12:58:53.3	AVAILABLE
kfIfSi79kloD4_0QJhW5w	bPlpSVuBcT7UAlolNNSX6	2025-05-02 21:23:57.441	2025-05-06 21:23:57.441	AVAILABLE
dMtP89q0b3UpGxLgVVVUl	Ed4LIh9TdZMCe9zY3BFtQ	2025-02-23 18:58:27.111	2025-02-25 18:58:27.111	AVAILABLE
4XcE7zzTVYRoAdr6hy_Ai	sU1Ja2_DjHu-FffmR8eyd	2025-06-21 02:00:08.142	2025-07-03 02:00:08.142	AVAILABLE
jY7l1JmJu2LhdOKdQWody	XOxBaKZIcgufUD7ajhbNG	2025-04-19 22:38:15.053	2025-04-26 22:38:15.053	AVAILABLE
OqmGBAS68DgAMxx42dpMB	ZWma3qJbFDo3G07Mi6Gh7	2025-05-24 08:04:43.341	2025-05-30 08:04:43.341	AVAILABLE
ITvtaFZAjyrtv-8izOQ9j	pwq9-uirdJZYbtIfeOxad	2025-05-24 12:51:24.457	2025-06-03 12:51:24.457	AVAILABLE
kXJhtxtZyG3NdpcN-qbeV	XNU-DSArghWOq145JUaIX	2025-05-12 23:30:54.933	2025-05-17 23:30:54.933	AVAILABLE
qE_yNk1LRfYonDOAsF_Iw	nFjbBRh5UPMwRIkTVyoTO	2025-07-22 09:43:14.707	2025-08-02 09:43:14.707	AVAILABLE
KIQinzh280olAKgHmcfO5	FHHeFa66iZq5z-IjwvDR3	2025-07-05 02:53:09.975	2025-07-11 02:53:09.975	AVAILABLE
11ExOZ2h4gyUnG2S9Dpg8	ClnKc4041mRBYye-WJjzt	2025-06-12 10:32:01.081	2025-06-21 10:32:01.081	AVAILABLE
BUkSj_4daqUd4rEfwcaAH	DOilGey8OMueABDcBEHSR	2025-03-29 19:24:14.361	2025-04-07 18:24:14.361	AVAILABLE
amv0-BJt8VLxTT8JasJzM	ClnKc4041mRBYye-WJjzt	2025-05-30 13:46:41.633	2025-06-07 13:46:41.633	AVAILABLE
nJAo66LdTyMfUPKRD6f2d	hm6GNMpfqTf84ST22X86Q	2025-07-13 14:30:11.25	2025-07-17 14:30:11.25	AVAILABLE
bfKyhlrp0dHee6MJGySLF	PlWOiUQhqo4oYaq_LzLvU	2025-03-30 04:25:24.212	2025-03-31 04:25:24.212	AVAILABLE
xOK-zJlIQALkFOHPOj2EM	J4B9MymLids6LC28TIn_N	2025-03-21 01:09:53.649	2025-03-25 01:09:53.649	AVAILABLE
Gv4sULz36o95TQIWz7YmJ	2ywK70gxBoaszjsn8tAAY	2025-05-21 13:29:28.993	2025-05-22 13:29:28.993	AVAILABLE
BNLfAphlzf5RKVDpr9QgA	sU1Ja2_DjHu-FffmR8eyd	2025-06-09 21:44:15.809	2025-06-15 21:44:15.809	AVAILABLE
2eGHTIWop7m2L7x1Fosx9	a-fUiC7HgKrfYMkypOfA-	2025-08-01 12:13:52.583	2025-08-13 12:13:52.583	AVAILABLE
5yyrVcD2QUr_0w2JZstVV	BOpg03Wk_nAJQ-NaWMaCE	2025-04-28 20:07:58.365	2025-05-07 20:07:58.365	AVAILABLE
xFtwguYU1vPescQ1r002b	sCGjQFkPsRQWPfW3VC6T_	2025-04-08 00:53:12.812	2025-04-14 00:53:12.812	AVAILABLE
dxeL06hsyWfpIOPIQ8eY7	fUtN9DUkbChz_RHlhbhLc	2025-03-12 13:53:15.808	2025-03-22 13:53:15.808	AVAILABLE
XzBRiRT-FxtNp67wy64hg	hm6GNMpfqTf84ST22X86Q	2025-05-01 20:53:42.804	2025-05-12 20:53:42.804	AVAILABLE
8bY4M8_d0KMUZtnRHAnpX	G3kwXHLZkFVyVAVLXsjnK	2025-05-26 00:48:18.721	2025-06-06 00:48:18.721	AVAILABLE
sEBFfIF1WSo5UcGw6a2cT	bPH6GGEx5u_mEC8rRd9be	2025-04-02 08:58:00.316	2025-04-14 08:58:00.316	AVAILABLE
cVVIRV-yrS6YZ7_ciYFJl	bPH6GGEx5u_mEC8rRd9be	2025-03-23 04:25:27.821	2025-03-28 04:25:27.821	AVAILABLE
oYmTKuMM8MX8S133FwcaJ	bPH6GGEx5u_mEC8rRd9be	2025-06-23 13:48:07.35	2025-06-24 13:48:07.35	AVAILABLE
13A0mR2k88dr-AxKTKTCK	rTFEz_TLTNdYQCdpf8XTF	2025-02-26 20:27:40.163	2025-03-10 20:27:40.163	AVAILABLE
LlZxOzYpqtrYru57rEbL2	rTFEz_TLTNdYQCdpf8XTF	2025-05-25 07:50:29.784	2025-06-04 07:50:29.784	AVAILABLE
gOh02eTzsi0XBAu3a64u4	rTFEz_TLTNdYQCdpf8XTF	2025-08-12 13:23:48.459	2025-08-24 13:23:48.459	AVAILABLE
fox1ly4Sm4m_xf1nKLznI	cbQjjthUOxZfC1FwI7OJh	2025-08-19 09:03:54.997	2025-08-20 09:03:54.997	AVAILABLE
xbtGXdJTC3E89HTLV0S0A	cbQjjthUOxZfC1FwI7OJh	2025-07-03 00:43:16.732	2025-07-05 00:43:16.732	AVAILABLE
F-LLdSXakLRRuBRdPPXXg	Tw53qMuurUUF0t7pfHPf1	2025-07-22 23:27:29.815	2025-07-24 23:27:29.815	AVAILABLE
0ZC6DFY4_T9zrC2STrhXW	ShPFLf--MI3QMLP9h2vA9	2025-03-14 03:12:44.492	2025-03-24 03:12:44.492	AVAILABLE
4gduY5dqc7fRkypNwH0zX	ShPFLf--MI3QMLP9h2vA9	2025-07-07 19:51:41.575	2025-07-10 19:51:41.575	AVAILABLE
xWMyu-8QmD8G1CFstYWvJ	2hGa0SAKvdCceRajyCHfs	2025-08-01 06:56:46.73	2025-08-06 06:56:46.73	AVAILABLE
cKJhM_OmP5wBrjzDn09XF	YXaxDaNPPnwrQlanhzca4	2025-05-08 05:15:23.014	2025-05-14 05:15:23.014	AVAILABLE
GMUGsumItaN4L_pX0IlYr	kr-UNPRX4apdghbbZjcZJ	2025-03-07 05:04:36.177	2025-03-10 05:04:36.177	AVAILABLE
tdNc4PtBHrNrHohAXgdnE	2ywK70gxBoaszjsn8tAAY	2025-05-27 05:48:28.952	2025-06-05 05:48:28.952	AVAILABLE
PvmaQ9vxZEdmzg3UImnez	8aj1ggAQEvg7yHPJktqVA	2025-06-23 19:45:38.307	2025-07-04 19:45:38.307	AVAILABLE
xn_1OvI6L0avxVgx9ayY_	M9ntsmng_Q-C5U-U78t00	2025-08-11 15:45:28.578	2025-08-18 15:45:28.578	AVAILABLE
24YnlDm3QcN_3AhdyX0jp	aSgdnxKqB27Iz5Ga9nfhy	2025-06-23 11:24:18.766	2025-07-03 11:24:18.766	AVAILABLE
aV3l1JMrTF32IUz60p6nP	LK7kXmnPYdnGdIjUEmeYb	2025-08-03 04:55:58.674	2025-08-16 04:55:58.674	AVAILABLE
DM7OSGikU7QeRemCrIxUj	_XU5GOK9o5RKBZrsVGjVP	2025-08-14 10:03:53.849	2025-08-19 10:03:53.849	AVAILABLE
UUga1y9KayChRMOvi1cow	IkIZBgWc5X30utMiQubB4	2025-08-01 05:51:11.846	2025-08-09 05:51:11.846	AVAILABLE
RbFWzu8FYL2JoLMdg7ZtD	4DPjBgVhQi095vBulkdPM	2025-06-22 12:28:29.863	2025-06-29 12:28:29.863	AVAILABLE
YOrxUCH7l30tSyIIhBvBH	uYUHXoVvI-oXQ1rIpjl_Y	2025-03-05 10:24:07.768	2025-03-10 10:24:07.768	AVAILABLE
NL4bNvd7A9BLdwZCuHufV	FIqWbJsAs1ETnDDNDHiAy	2025-05-30 05:27:55.695	2025-06-03 05:27:55.695	AVAILABLE
dAkxzvImlIetoiyGUxCmY	pqGEX_eHfU_3HD8Dyzjhc	2025-06-03 19:11:16.397	2025-06-10 19:11:16.397	AVAILABLE
lfjlmWGSi8XnC43OMmzQG	2VVVgiG25Mm2TF9D2_CUb	2025-07-01 01:28:58.956	2025-07-11 01:28:58.956	AVAILABLE
X2tbhuyjFYf38kxXfy2aN	DYOMpvsvCfZxftZ-wUGRf	2025-08-04 19:51:33.113	2025-08-12 19:51:33.113	AVAILABLE
MmZw1P6ecFBv3kL2fOcN3	FHHeFa66iZq5z-IjwvDR3	2025-07-09 12:05:40.444	2025-07-18 12:05:40.444	AVAILABLE
RjPgIbZqmR23mN3PTi6Kt	n3oHdc2SrAFQnEM6N2as4	2025-07-07 01:28:14.094	2025-07-15 01:28:14.094	AVAILABLE
N5ym1aXpvpSeINghOuQPt	NHBKw7vAt0_QufeFnm3zZ	2025-04-11 21:52:59.583	2025-04-18 21:52:59.583	AVAILABLE
gEYHc_ZQ9wuC9nKRLv9uB	4M7zHlFF7gpMQVf5ImezC	2025-08-21 14:21:38.212	2025-08-29 14:21:38.212	AVAILABLE
Qn6UFJtM0tY8ocEIjOKQA	-3pl3_AjunaIazV45A8-K	2025-03-19 02:36:55.16	2025-03-30 01:36:55.16	AVAILABLE
7GeD3huFE_pbFCGSZ8XXb	veG5s6dZYCa345KsxU_3v	2025-06-17 08:45:39.917	2025-06-22 08:45:39.917	AVAILABLE
nZNq_j0vaxrgjjq8dQG1c	GrKBDZvohUX_JF67YFHqr	2025-03-21 23:46:46.415	2025-03-24 23:46:46.415	AVAILABLE
B5_as_ZRb2RsE-hxDqH47	J4B9MymLids6LC28TIn_N	2025-08-23 02:29:04.009	2025-09-01 02:29:04.009	AVAILABLE
Dba9FxTL8a7373cOUiJfM	2ywK70gxBoaszjsn8tAAY	2025-06-28 15:29:44.133	2025-07-08 15:29:44.133	AVAILABLE
mfCol-D3hy_sbAPCoFZ-w	f1mc5878s1eMNWAbZ5WNu	2025-05-07 23:14:43.465	2025-05-20 23:14:43.465	AVAILABLE
TzI4k0rJCxDbwFTKimldE	aSgdnxKqB27Iz5Ga9nfhy	2025-08-11 20:13:33.287	2025-08-16 20:13:33.287	AVAILABLE
88i6JMR3wXVONREAGDMeP	-sxgEZwE7S44FFSZgdBxL	2025-03-18 10:23:24.427	2025-03-19 10:23:24.427	AVAILABLE
gq5rJ2oVUDAK1k_VLsPo1	7lEucAm4sziqgWMdwdOGT	2025-05-14 03:52:08.272	2025-05-17 03:52:08.272	AVAILABLE
amVC8ulUR7i4cux0jIVE8	aYBNc4G3GGqwAMVWfKkV3	2025-06-29 02:06:46.313	2025-07-06 02:06:46.313	AVAILABLE
Z4eTxufnOGfEBfJYu0hH0	kuE1A5ltL0zYPAOoSp4sx	2025-02-26 13:29:40.01	2025-03-06 13:29:40.01	AVAILABLE
TFtBApgBJMf_juTXyIUy3	JILZJvXpiSDYc7gqvAnag	2025-04-21 00:41:37.734	2025-04-22 00:41:37.734	AVAILABLE
t_mLg3HmsU0lS6LPjWJj8	LrrnNZ2FImiNxdC_DVbJs	2025-07-25 00:53:42.191	2025-08-05 00:53:42.191	AVAILABLE
9Wu3M_HmjUiYBZnAC0mXW	NxyPzuTBZd_UkHTTRrab1	2025-05-14 13:47:01.205	2025-05-25 13:47:01.205	AVAILABLE
hyesfSvsSvEfHR3CyZLsq	gyVLffCKzLR8xTuvebEqh	2025-05-26 15:52:14.891	2025-05-28 15:52:14.891	AVAILABLE
FeGOCZmiLpJb6NoHHlHNF	VUnJlfJ0C2LKCHECC9-9t	2025-07-13 04:37:39.605	2025-07-20 04:37:39.605	AVAILABLE
2LOtKWz4pVZ4TR1KaG6Eh	PlWOiUQhqo4oYaq_LzLvU	2025-05-25 14:44:37.59	2025-06-08 14:44:37.59	AVAILABLE
Lm4tG_5irxCh-5r_fC7QG	J4B9MymLids6LC28TIn_N	2025-08-13 00:26:30.188	2025-08-18 00:26:30.188	AVAILABLE
AlLFxFEMHrDhAsLU0fH1S	f1mc5878s1eMNWAbZ5WNu	2025-03-05 13:32:12.462	2025-03-06 13:32:12.462	AVAILABLE
wce1wXsKGEiibh0z4Z0oD	gkSje-Z0YBcTtCzwXNUxf	2025-04-27 02:11:56.394	2025-05-10 02:11:56.394	AVAILABLE
HKZ59KhauXZkEyiZ27rY9	aYBNc4G3GGqwAMVWfKkV3	2025-04-15 01:44:15.92	2025-04-29 01:44:15.92	AVAILABLE
iMQ3t_gNuYPt6Kz2QUi4W	JILZJvXpiSDYc7gqvAnag	2025-06-06 20:52:46.888	2025-06-11 20:52:46.888	AVAILABLE
UvLzHwrrIVd4yc0ZJOFGh	XNU-DSArghWOq145JUaIX	2025-03-06 18:15:03.244	2025-03-14 18:15:03.244	AVAILABLE
83b8HcdwOa9byRYZal0Nt	pnQSOPBJVsMH8nuqaSLrh	2025-07-16 19:56:04.602	2025-07-27 19:56:04.602	AVAILABLE
AuK5il_R6CqUpci6Pz4_Q	pnQSOPBJVsMH8nuqaSLrh	2025-07-25 22:25:42.802	2025-07-27 22:25:42.802	AVAILABLE
ISeBUfsnYyT5gzQseEvOB	DYOMpvsvCfZxftZ-wUGRf	2025-06-13 08:56:01.734	2025-06-26 08:56:01.734	AVAILABLE
vexlsw8Pwyqf2JIlhWJO5	2VVVgiG25Mm2TF9D2_CUb	2025-08-04 03:42:19.26	2025-08-12 03:42:19.26	AVAILABLE
ZP39HS4cplsLRrxasuYyu	KAfB52vHC4beqKdNWRCq9	2025-04-13 17:38:29.071	2025-04-18 17:38:29.071	AVAILABLE
-UYyfrHJ5yRJpn4y9fViN	NHBKw7vAt0_QufeFnm3zZ	2025-08-14 09:10:16.741	2025-08-18 09:10:16.741	AVAILABLE
IkngPs5-z7Zw13vBjlK4f	DOilGey8OMueABDcBEHSR	2025-06-22 18:27:09.316	2025-07-05 18:27:09.316	AVAILABLE
fH0LjRADsXgDGhDsECEd6	WZu1-2Ngml78WCKcLvDXj	2025-06-24 17:02:17.831	2025-07-05 17:02:17.831	AVAILABLE
wUh2_muJZI8Y4uauXisCF	2xZHhKQ6aoDtmtqYlSKTy	2025-06-18 16:36:48.511	2025-07-02 16:36:48.511	AVAILABLE
myrRG76b2zNHUqP16nQLq	2xZHhKQ6aoDtmtqYlSKTy	2025-05-03 17:51:01.382	2025-05-16 17:51:01.382	AVAILABLE
JraCZ6U12LM5oTnmPemFp	G3kwXHLZkFVyVAVLXsjnK	2025-08-19 07:31:06.209	2025-08-31 07:31:06.209	AVAILABLE
JoaCjc9uCjxv_BcFeABT1	WvlxG7yJcCadU9IOvgZs-	2025-08-21 03:42:48.838	2025-08-25 03:42:48.838	AVAILABLE
sP9lFU3SS7aoOFNzCV0DR	2hGa0SAKvdCceRajyCHfs	2025-05-27 15:06:48.343	2025-06-03 15:06:48.343	AVAILABLE
QRIu_YtDtU9MxhywfCKfO	veG5s6dZYCa345KsxU_3v	2025-07-15 13:20:58.066	2025-07-24 13:20:58.066	AVAILABLE
xVgqVbHmPrTigcq0ObTFA	B5nsTvZW_M8OVe1GHdYCf	2025-05-27 09:27:02.893	2025-06-02 09:27:02.893	AVAILABLE
Ce4nJsZ2FqHYSlADDY4n2	YkSt75diZaWRczXN7UfSu	2025-06-07 00:59:58.176	2025-06-17 00:59:58.176	AVAILABLE
odz_4bfiOKQPG2mzM7wNV	wc80BnjXaGE61R4lEiC1N	2025-05-22 11:39:00.242	2025-06-02 11:39:00.242	AVAILABLE
b_n05dA-lMihCIKAK_9fX	wc80BnjXaGE61R4lEiC1N	2025-05-28 03:14:13.116	2025-06-10 03:14:13.116	AVAILABLE
h7_4vRg5N9Q9DyjyB0Fks	7cl-LW0aOFgabP0J5NMCZ	2025-03-04 09:43:44.041	2025-03-11 09:43:44.041	AVAILABLE
FsimaHkfBrI2GQJKjhc1M	bPlpSVuBcT7UAlolNNSX6	2025-06-25 04:58:05.869	2025-07-04 04:58:05.869	AVAILABLE
Gr5BLHfeFtSsHBuPq6APQ	bPlpSVuBcT7UAlolNNSX6	2025-03-02 13:26:40.847	2025-03-12 13:26:40.847	AVAILABLE
22pZiHpWUKzl_kMo4HHHZ	Ed4LIh9TdZMCe9zY3BFtQ	2025-03-19 11:06:26.591	2025-03-25 11:06:26.591	AVAILABLE
df9RzwyxkzXQ2KKVY5nlI	-sxgEZwE7S44FFSZgdBxL	2025-08-10 01:01:52.985	2025-08-16 01:01:52.985	AVAILABLE
8FgdRClW59QjRzXsN42jo	7lEucAm4sziqgWMdwdOGT	2025-05-18 09:25:41.099	2025-05-25 09:25:41.099	AVAILABLE
JSvAk3cQCXDFeR7L2jt_m	uVG-jlZrq1cNv8btF-l0G	2025-04-10 07:09:29.516	2025-04-22 07:09:29.516	AVAILABLE
3PClXVvtC5wqOZFgNhyrz	XOxBaKZIcgufUD7ajhbNG	2025-05-24 23:02:08.345	2025-05-31 23:02:08.345	AVAILABLE
2gT-soAOdyBm-toNEO-PQ	x36cogDJb9EK7cGXN2t8H	2025-08-21 07:14:21.068	2025-08-29 07:14:21.068	AVAILABLE
9TB4Cu_AbusbBTn8MBRNg	BOpg03Wk_nAJQ-NaWMaCE	2025-07-06 01:12:07.545	2025-07-16 01:12:07.545	AVAILABLE
poCvhqZo0JhdbBDxpbvTw	x36cogDJb9EK7cGXN2t8H	2025-04-06 23:26:59.688	2025-04-08 23:26:59.688	AVAILABLE
y5L88nOcR5lXVo2DUoXBh	gyVLffCKzLR8xTuvebEqh	2025-07-06 23:57:01.345	2025-07-08 23:57:01.345	AVAILABLE
C2M5Y3iGnBr5WAFmX_KjO	VUnJlfJ0C2LKCHECC9-9t	2025-04-18 00:01:10.842	2025-04-22 00:01:10.842	AVAILABLE
NygWCNIxY2-JtbGGqS7TM	Tw53qMuurUUF0t7pfHPf1	2025-03-18 02:35:25.973	2025-03-28 02:35:25.973	AVAILABLE
GVdsz8R7XfkSt5pANpXhe	Tw53qMuurUUF0t7pfHPf1	2025-07-29 15:33:06.648	2025-08-08 15:33:06.648	AVAILABLE
0ryXSrhDGchd-3YlpGq8l	iynGBTHajJFsEuWvlrUbw	2025-02-23 02:41:12.421	2025-03-01 02:41:12.421	AVAILABLE
wy0K49gC1jOw7mn8mqUGg	iynGBTHajJFsEuWvlrUbw	2025-06-18 12:10:11.207	2025-06-21 12:10:11.207	AVAILABLE
_oEss9quITfXPwZJaqwUK	kr-UNPRX4apdghbbZjcZJ	2025-03-09 19:07:13.394	2025-03-11 19:07:13.394	AVAILABLE
MLSxrZh6eAi8f0ld4YxqQ	kr-UNPRX4apdghbbZjcZJ	2025-05-26 08:11:51.239	2025-06-03 08:11:51.239	AVAILABLE
n-xnhQ23tz-i_hTU7ulAv	YkSt75diZaWRczXN7UfSu	2025-07-22 23:26:30.665	2025-08-02 23:26:30.665	AVAILABLE
TXXezitgNSLF4V_c3KSFl	rfKV_WrgGKx_uiB1dq2pP	2025-07-21 04:24:09.469	2025-07-28 04:24:09.469	AVAILABLE
B0YaxasKWCEvJvih1pvH1	ucdIWEMRFitZw62xEe4CO	2025-06-28 23:37:58.001	2025-07-02 23:37:58.001	AVAILABLE
I5HpVWs5B0BThQ2h-b1R4	8aj1ggAQEvg7yHPJktqVA	2025-03-22 20:14:50.019	2025-03-30 19:14:50.019	AVAILABLE
Sm8KaMv7l1wxtDzpfEtL2	dfXarJXdM7KUYExw19SsB	2025-06-02 10:13:25.472	2025-06-04 10:13:25.472	AVAILABLE
B_GIRy5lVcSnPFn_Q2Zpe	dfXarJXdM7KUYExw19SsB	2025-04-30 03:02:22.079	2025-05-10 03:02:22.079	AVAILABLE
sE4ugGBYYv8DneKWQZ6iP	aYBNc4G3GGqwAMVWfKkV3	2025-03-15 08:22:05.406	2025-03-24 08:22:05.406	AVAILABLE
_LOzVLJognHPQ9x16dp4K	_XU5GOK9o5RKBZrsVGjVP	2025-04-08 19:54:58.407	2025-04-19 19:54:58.407	AVAILABLE
AYs7xTZ1m6HOzJMc5nHiG	BOpg03Wk_nAJQ-NaWMaCE	2025-05-05 14:32:50.215	2025-05-17 14:32:50.215	AVAILABLE
z9oKxSLxgE-h3mdyRyhpd	x36cogDJb9EK7cGXN2t8H	2025-08-18 16:43:56.402	2025-08-19 16:43:56.402	AVAILABLE
\.


--
-- Data for Name: gleanings; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.gleanings (id, user_id, announcement_id, status, created_at, updated_at) FROM stdin;
mQXnWhcogKmtSUx4SNbAJ	YTDvLZ3zpIPxyf7NWbig-	hDlmu5xi6ucPuMMaPg6lZ	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
37Ks8jjD4yTlSGQ2NEFe8	is2ySgVuj4Gt_ae787YZU	2mJV3Zz3M2i_APe2WKGoA	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
D-VVgIfemBQrL0_LRG_Hy	G68D-oGzsmHx-UKs7zfbc	2phuQfXKz4nl_mM5muiDN	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
3-0e9WDuPziZOSyJBr70x	hEbvLiNvGJFCxlvnn1ajy	2mJV3Zz3M2i_APe2WKGoA	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
c7Xov-95fRCvdkD9Y6Mcg	BImDoUWp0nYtVR1XBADA1	Q_BFkCEJAPxYsrQk5uB3R	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
b9ts-vrchuCMb2FYmO6J1	Vnpa0CWF6tNufHq2B0JEP	NXgvz4jDKfrEifJT6U6zm	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
BYQjBA1LceJU68qTeyK6B	8WPa-GF3tVDwE42Ve7zLg	r1UjwKdgeV8YjUUDNr8kl	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
206aHcsfRYc8l-VIlOPcI	BImDoUWp0nYtVR1XBADA1	6aW4wuwCzB4TCKN5uvvCT	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
Pc_jK_XfurhlI7D1K1EzD	bgcNiV1FK70eotHEVXTeG	TbOTlviCAg_aydN4g_Nw0	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
UJhyoPZbyHtn4VMvILBc0	kx7a_V0q_vcPJ4KEUOulN	2phuQfXKz4nl_mM5muiDN	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
ek1N36aJGduQVXPrgSaks	-IMaZyj9yDW7KJmrtsnR_	6aW4wuwCzB4TCKN5uvvCT	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
thKJp_MBMElaBrkE7Qrq7	8WPa-GF3tVDwE42Ve7zLg	mjqGmqjSW4A0-Ep0Uu1_1	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
8LFwbjDAAtfbHWZj_YqZX	BImDoUWp0nYtVR1XBADA1	2oSAE55ybgvklIuz9tyU-	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
IkWyOTprLpoRTu2EBt26u	ILUPZhhZW3bZHegBDR2Cu	6aW4wuwCzB4TCKN5uvvCT	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
HGqEDFM_J8KZ1B2o34fQu	010kfQ2xnGsgQEP4d6Qpq	Q_BFkCEJAPxYsrQk5uB3R	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
Y7darrt4Nq_KjV_EI87Kg	SgxumAVx13SBTjv0d5tj7	RbURtIE6B-a1AkuKenD6Y	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
Qfti5IRW7fV_bbeeMnI8d	6M7Jhq31GYGjqhlXnuSlS	dFgF-OJWG3TxmrRS_NE6d	PENDING	2025-02-22 14:12:44.905	2025-02-22 14:12:44.905
n02iRiNM13lLPeszrwjGW	o12gDGrqvcIG_AaVqUrCX	ndL1DHgeaaCjTN8RtrQ9S	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
rQU-JqptuWf_B7ERjZjpe	G-CIpmGST2Fn9m5H53Pn6	89LJE-xewrUYK6UykCSrj	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
KjLrzoHY3EIY076Mc-wiH	CVm0n4hzIWdsDBrDJradD	Af_xhEH-w4oh-8mNII6ml	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
iRBRVvtjh3E0-I6iVIEBg	HoNUiG2AQhcJzcxp1vtJI	89LJE-xewrUYK6UykCSrj	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
qCiI6wABv2xUkMHThoWI3	RMC8eL7WJqBWqTMNPNJ0M	vBV47jcbiomT8ZOaGA16k	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
o6Qo8kTJYZj5--RzltINV	H9mgMEsnXG8WR65ZYemRV	jYcasqpd9Uqv6GOGv5r4Y	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
8LPI4NgekMXH-PSV9GGFA	eE4mNWW5LeV8ael4lbHxF	1wNUiByRERoYMJjrhzhqk	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
h89eeQoRpLBtux0ZF73p3	TwaN7v8EaCLjjs8adJGIQ	0a3HdSxD6gJJrZ1V_d1ny	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
FXDDxcBzyHvnQLVcZIjpr	7eSbGUXbGwrL5mz1Q2HW5	XfRVfvnOcpZt5MW5CJFpn	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
Anw73IqWy0jTA8TW19gA9	G4kuP6N_ckTd0Rop-VJa-	89LJE-xewrUYK6UykCSrj	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
sAg-S_5wfOoBb_Oc1e5GD	RMC8eL7WJqBWqTMNPNJ0M	CLTeqQb13pUifhxKoS8xu	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
G36Ah9N-ybCvLVyXKabfc	YTDvLZ3zpIPxyf7NWbig-	XmUu9isiAhmW32xZH4ZZk	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
quaTdmiitA9oOeTBFd7ro	taknNHxsb9gYMyf3hMBlE	PzuGdErwYJjgVb-tiNwNJ	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
42MHOYWZEngq7KjyjQPdx	uo5LsCc99Vak-gUkgIzfX	89LJE-xewrUYK6UykCSrj	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
yhlFM_i1dmdLf0w4BsudL	kgaapwTlgtogyJtO0yC-U	dFgF-OJWG3TxmrRS_NE6d	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
o9DXqFD-pnCLlsQtQiT3z	G-CIpmGST2Fn9m5H53Pn6	0UpZuQ59LuhpDVaAkyXKN	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
7ROYmJ3i5at42effPCnNO	qB9sSTyr1VEcIpWOfVvmE	0UpZuQ59LuhpDVaAkyXKN	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
qQ1tAUWMphZrv5IeJ5AT5	W2u_mWX7wJprusJBrO6Qy	0UpZuQ59LuhpDVaAkyXKN	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
HLIriS6OXJcXDkFf3LP2U	BImDoUWp0nYtVR1XBADA1	XYGZJmkyhQ_gXWC4aC1m_	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
VWNbBI0SKlgTj78yS96G_	D5dndkr5njKtW4Ac_tmVm	2oSAE55ybgvklIuz9tyU-	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
9jgoru0OgtgLC8jdXQ4Cj	bdjT6dtbumKCFGpF8xKCz	xq-V5AMQpEVc9mWkAker3	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
xXIHt10wubDGKqkm8mt2B	ZcTt5h_MdndtHtmFxIfxR	XYGZJmkyhQ_gXWC4aC1m_	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
5U-GhaoiBtYqLlz_hWAvS	edIBp-z6GbU6qMrFyP-on	PDutvax019TIxfo26I1IN	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
jpTZHVGJ8hVWgyKFUfIBK	ZUyzKoj-4sITYZmn66MyV	0UpZuQ59LuhpDVaAkyXKN	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
uGny176IKQHtrikjZN72R	8WPa-GF3tVDwE42Ve7zLg	vgtI4Nw6SrWDtdCnAz4RD	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
pCM_Hc1hTeuSou8-ZkV8_	edIBp-z6GbU6qMrFyP-on	T_gUz4pDq1h0QwzmLOk6M	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
DIaE_qzeUqM60TlHcBluY	FWIZrDngg9Qx2C6LLK0TZ	PDutvax019TIxfo26I1IN	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
pm83B0OLtzbS45SFryJ3L	RMC8eL7WJqBWqTMNPNJ0M	6aW4wuwCzB4TCKN5uvvCT	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
YZTDLF0a4wzWT3DneN7PB	TwaN7v8EaCLjjs8adJGIQ	QK9JsgH58DcjKMfBd3amT	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
DVxPI8cI3xx_gCBcTisKA	G-CIpmGST2Fn9m5H53Pn6	_staYYIPRFdrPytEYjPR4	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
dx_2dChP2x58k9fmCzMna	hCTGZ3il5htDkjYnF3wXS	QK9JsgH58DcjKMfBd3amT	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
wYppvPkB8lQQ43bHF5cqD	SgxumAVx13SBTjv0d5tj7	UecA0lsgs4MfsKUspmTXG	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
LPJnsdniltMFCdBA8F6Qf	FWIZrDngg9Qx2C6LLK0TZ	TbOTlviCAg_aydN4g_Nw0	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
FcUP0PlQ4K9kNc9K07y1P	YTDvLZ3zpIPxyf7NWbig-	vgtI4Nw6SrWDtdCnAz4RD	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
CB-pFXDEUrT1mpjESwmpE	kx7a_V0q_vcPJ4KEUOulN	iFY-_dF-qeg49wbA3ehga	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
G916S1EC8VoNeVKOP_yXr	Ex4nSdiMXZ0pxRkSveWu4	NXgvz4jDKfrEifJT6U6zm	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
FnLdPOmPgcVu7f6-uLgS-	ynfjsfccIOGfleSPiodgL	iFY-_dF-qeg49wbA3ehga	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
RuYfTna36ITWHCvGeePzo	MVar0M4VbKvaTyMGHm5TX	ebE-lDixF4g0BSiOojFic	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
dm7kkBOtn4G4OfwADPzqs	010kfQ2xnGsgQEP4d6Qpq	bqCEmwlKkuPvyw_BG_o23	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
0peNMRKqXa-gTBQBJYZcj	taknNHxsb9gYMyf3hMBlE	iFY-_dF-qeg49wbA3ehga	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
xca0ZfkH_n0IIiA8Gdpzp	WvVs9H432Rb7EPLVveQBu	ebE-lDixF4g0BSiOojFic	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
QPkPf3DTKJEuGEJz50tie	Vnpa0CWF6tNufHq2B0JEP	uZAzuAEYOtQsUkGwyBx3M	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
kxxQZT4wAWkLzxLG1vnS3	MnoyNuzPIA932-N7FVVu9	YdySePJge4-KnZk6G0zOQ	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
B8tHmfOQjKLQ9bgz-J4-r	HoNUiG2AQhcJzcxp1vtJI	YdySePJge4-KnZk6G0zOQ	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
Vzv52howbp3xGidZeHx1A	xqaIMhPePn0LfXF-YKQLh	YdySePJge4-KnZk6G0zOQ	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
qLpalXQq0imYSp_VCAbnn	6tAud8OtyM-8ik06LVaIY	y_CR6-fRGBJyOjA6iK1QU	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
by7IbsKGeusgMZPdr5GiX	hBWjYB97bi-PTiXh6V5lL	4d8KAh4jq_eb_gghsG_Z8	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
8ZV9autiQZjZv4h_x5kFn	y1Hx4GXVmNiq1OxpUKFxa	y_CR6-fRGBJyOjA6iK1QU	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
9NNQ0WEY9DeXNqfTKHs0X	Ex4nSdiMXZ0pxRkSveWu4	4d8KAh4jq_eb_gghsG_Z8	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
w__8UxobQ6z24s2csqKrw	8WPa-GF3tVDwE42Ve7zLg	YdySePJge4-KnZk6G0zOQ	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
m2R7bs-KKrlTABiOsx1d_	ZUyzKoj-4sITYZmn66MyV	y_CR6-fRGBJyOjA6iK1QU	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
_buqP9lgvZDNhOba-nuK2	MolqmNWVa06zm-Io5X_AL	4d8KAh4jq_eb_gghsG_Z8	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
oQN5thPUY8nbmnHsGyqNQ	xWBJ_Lk4-5xl_S95ch4DN	4d8KAh4jq_eb_gghsG_Z8	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
rnHCBQQNo7IpXpVI5Dsux	hCTGZ3il5htDkjYnF3wXS	VMUQqQ0gmb0QRzejh3Tq8	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
RGLoUbwPPUG7q2YU3_DCU	Oa2qVBSUXJgYNiT-NN2Iu	VMUQqQ0gmb0QRzejh3Tq8	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
0ZSRz_CvWio2HNXcZJEKr	BImDoUWp0nYtVR1XBADA1	iY8GqXzNJ9k0CYa6CIjd_	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
heWqzLsGjQD88b8Ag7Vum	kgaapwTlgtogyJtO0yC-U	WtsUu45cytRzZu8j7aJMr	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
VA7kYnRgyzktsQ9qAz2Y9	SgxumAVx13SBTjv0d5tj7	ZI3ZaEJPZcKWCCdYeqarQ	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
0UyaCzCTcd5XJ46ZP6i1f	XBIUrzPwMaB--z4fp4Q_Y	VMUQqQ0gmb0QRzejh3Tq8	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
qDOyKFsKxxfx4Tlg378yh	Pxq28Q6QNzB72vY1-EpHc	bBUngx7oAupi_cBInbLm-	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
aJPS8S9AvhqguRTleQ10o	edIBp-z6GbU6qMrFyP-on	TbroWkkhGNI9ohebhZUVy	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
WqKQM6oiiowHstZSl9qxC	RMC8eL7WJqBWqTMNPNJ0M	lYgnnJ2vt5Z1jICs5a851	PENDING	2025-02-22 14:12:44.906	2025-02-22 14:12:44.906
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.likes (id, announcement_id, created_at, user_id) FROM stdin;
BwQqWCqvvWglova9GFPif	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:46.149	td-mNc-efjT5ef4L84gdT
jqAdbFA1umJUGxkLmd7dB	LRQBM9v5m0N0z-kORmBym	2025-02-22 14:12:46.149	yWDQEXEK77u54toG9glVs
y3u9hzQWMklWBMm0650kU	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.149	ra7m_5dtZZ0fIXz2wYUwS
SOKuB4d9S7awSxW0Po02b	hDlmu5xi6ucPuMMaPg6lZ	2025-02-22 14:12:46.149	H8GOQDSpJmLwUI-Xd3Ac8
olI6xl4bClXtekXiD3Qly	hDlmu5xi6ucPuMMaPg6lZ	2025-02-22 14:12:46.149	YQX8fsqvf-jQttEgWodPl
wzU90MWj7kBPSMnGC-54y	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:46.149	O4aJ-sLLtRhC1gk5aOx8a
nbLKADXmiuBRIxM-68bNu	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.149	Y5S58eZPGtw_6sC7_WftG
Qh5iH_qahCvmuZx-V54dM	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:46.149	EfSXJZLX_jwTzh4MI9q76
ca0ENOD9rSDjyIIVLop2O	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:46.149	svkANm0FmRXwwvrbpPd9p
UYvPEoD0nOKw2Xu4p0I9-	hDlmu5xi6ucPuMMaPg6lZ	2025-02-22 14:12:46.149	TwaN7v8EaCLjjs8adJGIQ
zXrWCK6xI4CpjEmSCGKKj	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:46.149	o12gDGrqvcIG_AaVqUrCX
hIXF3vuK0QCzinGFHHeAg	LeyqVixhNtsb2_lmKzziX	2025-02-22 14:12:46.149	H8GOQDSpJmLwUI-Xd3Ac8
Y_K16713WeNSbB-C05049	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.149	CVm0n4hzIWdsDBrDJradD
I0k-gDtBTFMd2d4Xm0kzM	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:46.149	y1Hx4GXVmNiq1OxpUKFxa
pKVBROXMA-AFbkYABn6i4	LRQBM9v5m0N0z-kORmBym	2025-02-22 14:12:46.149	vH-zqVd_1gwnMxgoi9TcN
wEPe1YWbOgF7EWsbF0Ak7	hDlmu5xi6ucPuMMaPg6lZ	2025-02-22 14:12:46.149	010kfQ2xnGsgQEP4d6Qpq
pvr99wxdrLlV5yD6YVz4e	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.149	ErlUpv2BuYhqPxW_t-BnY
Pa11CoYiT7Yzw0OWKxo3z	STOH5L2a1GAAOIqzD4flI	2025-02-22 14:12:46.149	G-CIpmGST2Fn9m5H53Pn6
WVgua2fRwqjirjDqCMCAB	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.149	G68D-oGzsmHx-UKs7zfbc
KzWjoXn4PoorBU9BAJv7L	zwD0zc74Y7HIWaW4xbfeS	2025-02-22 14:12:46.149	XBIUrzPwMaB--z4fp4Q_Y
Oxg2e1xhR39vvHPmitTiz	LeyqVixhNtsb2_lmKzziX	2025-02-22 14:12:46.149	EfSXJZLX_jwTzh4MI9q76
nh2WAacDATuxydhvkoZm8	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:46.149	kgaapwTlgtogyJtO0yC-U
eWjlZNB92eitPPR-lU35V	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:46.149	010kfQ2xnGsgQEP4d6Qpq
eIt9I3Ca052twyIWtD69W	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:46.149	bdjT6dtbumKCFGpF8xKCz
045hlS2OriwMYkaasEJqU	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:46.149	bgcNiV1FK70eotHEVXTeG
q19ZvhhY9DW4GS--vsTF_	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:46.149	BImDoUWp0nYtVR1XBADA1
HogZvIP_bYS-2dbHA4t4d	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:46.149	td-mNc-efjT5ef4L84gdT
EmAETMpP9q-D-0IjEpzBs	zwD0zc74Y7HIWaW4xbfeS	2025-02-22 14:12:46.149	0ixnSDCfRSqCEyjspqFfG
mzDCaM0SLk5HHmzy3AMVX	qkPrIOzHNfjHTeBOLVWIS	2025-02-22 14:12:46.149	68q5ldFY_xCCKOqhO2tQk
S_MGHl5SED7JDwuqN3R-4	qkPrIOzHNfjHTeBOLVWIS	2025-02-22 14:12:46.149	XBIUrzPwMaB--z4fp4Q_Y
7NEZMhu6P8I2qe6bPXJBo	qkPrIOzHNfjHTeBOLVWIS	2025-02-22 14:12:46.149	Q_DrzN5SotwsTRtHfxLpc
pfFu5cRqAKJ4G2gqHfD7z	mq9znd0d0U4Lz_oNRx5Rc	2025-02-22 14:12:46.149	rv4tjV1X201rDa7hXOrNc
5IpqDpNHv9dHf4aEZd8hY	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:46.149	hEbvLiNvGJFCxlvnn1ajy
knaMmxQwwYe1HELB3RbyW	zwD0zc74Y7HIWaW4xbfeS	2025-02-22 14:12:46.149	D5dndkr5njKtW4Ac_tmVm
CfabIz8oMhVLuc0nFEIiQ	STOH5L2a1GAAOIqzD4flI	2025-02-22 14:12:46.149	D5dndkr5njKtW4Ac_tmVm
rRKROtAK2YECVKLYJJNg2	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.149	o12gDGrqvcIG_AaVqUrCX
mcrHQ5va5ym63liIRfppW	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:46.149	td-mNc-efjT5ef4L84gdT
hfaKAPZkrdZVjNdOdTHmq	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:46.149	WvVs9H432Rb7EPLVveQBu
XrQ9K_lYkSjGxcoHO_Mzf	STOH5L2a1GAAOIqzD4flI	2025-02-22 14:12:46.149	y1Hx4GXVmNiq1OxpUKFxa
yTxYvCEQ8pjgcHWtb2DAR	mq9znd0d0U4Lz_oNRx5Rc	2025-02-22 14:12:46.149	dynp8GvU7NLNlEzTlFwRE
OpQUlJLmmse4w6gF99mgJ	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:46.149	6tAud8OtyM-8ik06LVaIY
957y05-dIDhLTxF8B4NC3	mq9znd0d0U4Lz_oNRx5Rc	2025-02-22 14:12:46.149	BImDoUWp0nYtVR1XBADA1
rtVoLf9FHPH82S3R3QNyf	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:46.149	Q_DrzN5SotwsTRtHfxLpc
OllSp2ceFV06krzfwn60K	STOH5L2a1GAAOIqzD4flI	2025-02-22 14:12:46.149	Vnpa0CWF6tNufHq2B0JEP
cBaK9W9AzmkJP5TfKTMuV	UNesA6JeouCfaD6g75bUk	2025-02-22 14:12:46.149	iuxebV8O0B3-dJthQ-rD2
Kud_3_nxzXymCtBW1PJFF	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:46.149	da4m6AGKw1WY5L68yhaXJ
fzZRP6uHn86euhzSkqeQI	EVUieFdqw-tdjYZbpj7tA	2025-02-22 14:12:46.149	N7tK6mDid3gPFfGfuphLj
YUKaaXVYukAK-HFxlqMU3	mq9znd0d0U4Lz_oNRx5Rc	2025-02-22 14:12:46.149	pGYhcMFCFLkC4zhe_PJWQ
4aVH4C-xNDb9oLkGLtZ7q	EVUieFdqw-tdjYZbpj7tA	2025-02-22 14:12:46.149	V3R9xnhUJt5CEK56jPDUU
TW6WPVuOO0G0Px8-DTJgx	EVUieFdqw-tdjYZbpj7tA	2025-02-22 14:12:46.149	Ex4nSdiMXZ0pxRkSveWu4
Qf1WrsAUDYU_5BA92G35o	EVUieFdqw-tdjYZbpj7tA	2025-02-22 14:12:46.149	Vnpa0CWF6tNufHq2B0JEP
57h0ukij2EPdMiG04Ouok	EVUieFdqw-tdjYZbpj7tA	2025-02-22 14:12:46.149	0ixnSDCfRSqCEyjspqFfG
Oy-NvGe7wE1HupHL0oZ3e	_sRAuMKiqFb82KP6NWkp5	2025-02-22 14:12:46.149	MVar0M4VbKvaTyMGHm5TX
HlHGktKrFBkTX-MyW5yPg	Ej7WEmYuQYBlYSBXBFvdA	2025-02-22 14:12:46.15	hCTGZ3il5htDkjYnF3wXS
e5pdM_eQvQqdLYaSG60VO	Xr2DG96eCesYj6CbeJRPI	2025-02-22 14:12:46.15	5BKwWWao8FbqQ0TqEaaTx
Hh_oSrEiTUuWPIl2MqVVY	_sRAuMKiqFb82KP6NWkp5	2025-02-22 14:12:46.149	BImDoUWp0nYtVR1XBADA1
4CGj5vO6fQhHEC0lDQVYy	0hrQAdv-ZSSt4vFfMWGrB	2025-02-22 14:12:46.149	D5dndkr5njKtW4Ac_tmVm
gamuMSuZUzPJFgQibZeSg	0hrQAdv-ZSSt4vFfMWGrB	2025-02-22 14:12:46.149	pGYhcMFCFLkC4zhe_PJWQ
3O7XZKFVNa0O4nXhLudO2	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:46.15	M7OhCeRXSMm_xlUQrNNQH
MtTXVzYgF8IQ0ume6TScI	_sRAuMKiqFb82KP6NWkp5	2025-02-22 14:12:46.149	50C6aYmQ8rb4J8nAGsf2G
39NqQzxT0e6RbfEDK4MUL	_sRAuMKiqFb82KP6NWkp5	2025-02-22 14:12:46.149	Q_DrzN5SotwsTRtHfxLpc
bG6FcAcoJ8Kcps0g-83J_	Xr2DG96eCesYj6CbeJRPI	2025-02-22 14:12:46.15	Q_DrzN5SotwsTRtHfxLpc
ycLiyhIhEy2f5CNnBe7Aa	Ej7WEmYuQYBlYSBXBFvdA	2025-02-22 14:12:46.149	fVxGG4jJrK6J8D1T97jAE
dJbAlp-E_UDsWe8Q88joG	Ej7WEmYuQYBlYSBXBFvdA	2025-02-22 14:12:46.15	H8GOQDSpJmLwUI-Xd3Ac8
iXbB_FC2TKi0TXsk5j_TQ	Xr2DG96eCesYj6CbeJRPI	2025-02-22 14:12:46.15	Pxq28Q6QNzB72vY1-EpHc
dAsLMXFz5jQRi47llRQP1	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:46.15	YTDvLZ3zpIPxyf7NWbig-
6wzFSF5WTc4-AFRobtDdo	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:46.15	V3R9xnhUJt5CEK56jPDUU
f02eXRFpYFB2kCS2RFGIC	Ej7WEmYuQYBlYSBXBFvdA	2025-02-22 14:12:46.15	bdjT6dtbumKCFGpF8xKCz
NVNuHBbNWcEs9l5hmQxD0	NXgvz4jDKfrEifJT6U6zm	2025-02-22 14:12:46.15	FtEuhCz-sqPoB72tJwOXj
sT34wYiVfz6O3D1up-wMz	WB3e4Lw8_uHRtmBPct5I_	2025-02-22 14:12:46.15	7eSbGUXbGwrL5mz1Q2HW5
4hKOENit82Y1i_879HZQh	WB3e4Lw8_uHRtmBPct5I_	2025-02-22 14:12:46.15	68q5ldFY_xCCKOqhO2tQk
qfjMWyHCmQ_GLIb0GMFXO	Kb3bSLlmogWuj9dxQIt2-	2025-02-22 14:12:46.15	0ixnSDCfRSqCEyjspqFfG
X36aAMizavVUpPEzXOPS4	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:46.15	x-zByfzhKyJj31DwjAvV7
gcTdgg2J81a1Fga0fDu1H	WB3e4Lw8_uHRtmBPct5I_	2025-02-22 14:12:46.15	yWDQEXEK77u54toG9glVs
j_nOoFV8NsTc0HLh9li8x	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:46.15	kt1ydP3QW8UxdSlbAryTr
nhwY7yp-haHXx_D_ltW4P	DPqpsO-f5Xn0Sd0EXaqsV	2025-02-22 14:12:46.15	G8j4_ZCyMVq8TZaxUvtFo
9rGHuKbVxGz7m08OMbj3Z	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.15	kt1ydP3QW8UxdSlbAryTr
rVQxLK4ocag5v4K4Ra9GJ	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.15	pGYhcMFCFLkC4zhe_PJWQ
MY49030sv1DoHZHAQYS0k	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:46.15	2QgqWIb1dXO1R8IpsQWww
-qkeQ9ZCH3Iw_zo9UPaPE	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.151	hEbvLiNvGJFCxlvnn1ajy
6gZno4QeIQO76Q8T9oSdT	Kb3bSLlmogWuj9dxQIt2-	2025-02-22 14:12:46.15	D5dndkr5njKtW4Ac_tmVm
Bs-Q2Te9WWKcxQAISYPPs	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.15	8WPa-GF3tVDwE42Ve7zLg
3MBW1AaDhOZbxbQol8FY3	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.15	td-mNc-efjT5ef4L84gdT
ttaT_2-jgApaWA454RMvZ	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:46.15	da4m6AGKw1WY5L68yhaXJ
m3Okn3aomC4xkU5fB6azn	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:46.151	y1Hx4GXVmNiq1OxpUKFxa
6ajvQEiqlvahWwFylTH8u	SDXePMW5CLhEavcJu8SO4	2025-02-22 14:12:46.15	ra7m_5dtZZ0fIXz2wYUwS
qC_Owb5NHbvXfB3ROlx7s	DPqpsO-f5Xn0Sd0EXaqsV	2025-02-22 14:12:46.15	x-zByfzhKyJj31DwjAvV7
Eni8Mw8eniMAYVEy3fmtm	_6qXgSFAqLDWc7HONDRB6	2025-02-22 14:12:46.15	TwaN7v8EaCLjjs8adJGIQ
G_2R77FmXvLPjznoqhw3L	bUXAWDeLIpXsRCZUaBaTu	2025-02-22 14:12:46.15	yWDQEXEK77u54toG9glVs
R5v4YlrLAsaROBJ3a4ctA	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:46.15	Ex4nSdiMXZ0pxRkSveWu4
uTfL2QZ-umGpmMLR4HwPh	JJKN3jdlt32rSeJ1AphOb	2025-02-22 14:12:46.15	ZUyzKoj-4sITYZmn66MyV
_WxS6PwDn2HFyIo_7M_lO	LDxHYT8J79qUcsqYh1XIE	2025-02-22 14:12:46.15	UsselAyV86fZ-aWUvdGbZ
nJ7zp94htI1k9QRSFpjDQ	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:46.15	RMC8eL7WJqBWqTMNPNJ0M
mYtdhxZCzKVMMJ8ml3r4e	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:46.15	ILUPZhhZW3bZHegBDR2Cu
JYiouk7-wPKddVB_jBKqX	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:46.15	BImDoUWp0nYtVR1XBADA1
WZ8lT3zVFFxIE62G_jxd_	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:46.15	bdjT6dtbumKCFGpF8xKCz
NglZsshhYAz0qT8fBPoTv	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:46.151	68q5ldFY_xCCKOqhO2tQk
6YJTr91M3BSnfGu3YaIjv	Kb3bSLlmogWuj9dxQIt2-	2025-02-22 14:12:46.15	O4aJ-sLLtRhC1gk5aOx8a
XfmcKHs908B2TooOOcMYj	DPqpsO-f5Xn0Sd0EXaqsV	2025-02-22 14:12:46.15	nmzdiwm2gCQChflP80NMh
IG1fnlGrs84vtb0MajNJN	_6qXgSFAqLDWc7HONDRB6	2025-02-22 14:12:46.15	td-mNc-efjT5ef4L84gdT
5T3jYwQ6y2_0YI5Eg4Hn9	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:46.15	D5dndkr5njKtW4Ac_tmVm
jHmBdjrm0nrTf_W0AByrg	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.151	eE4mNWW5LeV8ael4lbHxF
Spqr-3hu3M5sK5yUssh8H	SDXePMW5CLhEavcJu8SO4	2025-02-22 14:12:46.15	o12gDGrqvcIG_AaVqUrCX
7xqE2zPf-TE3xbZEh59Jl	iPErNrc070AIGHWM5v-L7	2025-02-22 14:12:46.15	nRoy8jXSGQuIyMMJCnSNf
dgIyJf6STvJJnb1lVDVMS	_6qXgSFAqLDWc7HONDRB6	2025-02-22 14:12:46.15	NZ_ctN2LDRjRX5gqzIn-h
5MqXnnONGwjpYqalA4Ssu	bUXAWDeLIpXsRCZUaBaTu	2025-02-22 14:12:46.15	5ZsdOQRTuO0d9X5EyuXI7
Z5t3mt2QwFk3a8ipi4XUI	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:46.15	eE4mNWW5LeV8ael4lbHxF
XJgPwvPCq--GyJLG8NIYX	JJKN3jdlt32rSeJ1AphOb	2025-02-22 14:12:46.15	bgcNiV1FK70eotHEVXTeG
2GG-bSzGZnP0zIhxGzVhC	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:46.15	MnoyNuzPIA932-N7FVVu9
FJhqvFSyXRsLGsZzwhwx-	wRLgglC5vuSvkzdfmvJGC	2025-02-22 14:12:46.15	qB9sSTyr1VEcIpWOfVvmE
VbjHTLCN0-z1_WhbYnK7z	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:46.15	7eSbGUXbGwrL5mz1Q2HW5
PEAvwC_EcbBxDJsxBy3Qw	2BF-SOEZmuZoYEO00D-O5	2025-02-22 14:12:46.151	0ixnSDCfRSqCEyjspqFfG
-oFLn5_7Zu8MLOJY1BcF_	yOmdvzuc0gq2eZqFXgAWv	2025-02-22 14:12:46.151	XjjbKLVjKuDUGQnqbkk9l
Ol8kD-K573CR1FaxRUIbd	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:46.151	UsselAyV86fZ-aWUvdGbZ
yGnomla7n70VeJ-GHx-R5	yOmdvzuc0gq2eZqFXgAWv	2025-02-22 14:12:46.151	Pxq28Q6QNzB72vY1-EpHc
lEhYFlJZ48_9B7ANxkFFL	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.151	YQX8fsqvf-jQttEgWodPl
XiqBSF07TniZqNAUIfB5g	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.151	W2u_mWX7wJprusJBrO6Qy
tie1BjaXzarM3iz5BJW2H	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.151	MolqmNWVa06zm-Io5X_AL
1Ql1Xc4faBlkNA6AjOnBn	wHp_clEZEs28dUCuLv72c	2025-02-22 14:12:46.151	V3R9xnhUJt5CEK56jPDUU
HFzU42eOF3111Z-p1bKsS	b6lY_Q5Ooiwhnt8lXfqp3	2025-02-22 14:12:46.15	hBWjYB97bi-PTiXh6V5lL
78bCj3yUfKHqrOmzWaE9j	woUYtfeKDDDP9rMOU5N00	2025-02-22 14:12:46.15	edIBp-z6GbU6qMrFyP-on
NKJFg0NI2_2phQB7LeUXq	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:46.15	G8j4_ZCyMVq8TZaxUvtFo
J0uuNlPDJvW2YbzxB6mKY	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:46.151	FtEuhCz-sqPoB72tJwOXj
Y2h9GLPWCyISVgmcmCaSh	NXgvz4jDKfrEifJT6U6zm	2025-02-22 14:12:46.15	MnoyNuzPIA932-N7FVVu9
iphCXwtOx-AAuYZvNOEcC	_staYYIPRFdrPytEYjPR4	2025-02-22 14:12:46.15	7eSbGUXbGwrL5mz1Q2HW5
Rp0TL50sYGpcHvU8-KKIV	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:46.15	V3R9xnhUJt5CEK56jPDUU
hqc4Jf3gAZRAARtkyZsfE	LDxHYT8J79qUcsqYh1XIE	2025-02-22 14:12:46.15	nmzdiwm2gCQChflP80NMh
HX-6qofp7ZoACKR9nH0Tl	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:46.15	GDNiqcy5j67FHEG6jSaR2
Erud0vam5NKmqmYWyKK-k	wRLgglC5vuSvkzdfmvJGC	2025-02-22 14:12:46.15	YTDvLZ3zpIPxyf7NWbig-
ono4C_bzhQtAIycUL26eM	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:46.15	ynfjsfccIOGfleSPiodgL
pZTRW1b5aLx5H5DmFHxvs	eJDiaGgcBEF7oo_waiTrv	2025-02-22 14:12:46.151	0ixnSDCfRSqCEyjspqFfG
RVdvJm_7EtHHFVwdywxQZ	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.151	hEbvLiNvGJFCxlvnn1ajy
xyvhzM8-c81uUR6G-ZjH-	eJDiaGgcBEF7oo_waiTrv	2025-02-22 14:12:46.151	fVxGG4jJrK6J8D1T97jAE
OGMgIaZpE3Va9bL6__inP	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.151	G4kuP6N_ckTd0Rop-VJa-
37cAQUFxDLRUpKvK3h4nx	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.151	NZ_ctN2LDRjRX5gqzIn-h
_Uq2vkjdPS20eWznsevdQ	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.151	ZcTt5h_MdndtHtmFxIfxR
23Uf9KeG2q-i581PHvdeV	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.151	uo5LsCc99Vak-gUkgIzfX
aCNCPWwLXkgu6FyXyfENl	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.151	O4aJ-sLLtRhC1gk5aOx8a
dRuIxVl6Jtqqv-n3SMUSS	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:46.151	MnoyNuzPIA932-N7FVVu9
p_pKQ00p3iUDb0cjQ8O5f	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:46.15	TwaN7v8EaCLjjs8adJGIQ
AlKE2nWWllE_VgDWia6JC	woUYtfeKDDDP9rMOU5N00	2025-02-22 14:12:46.15	YQX8fsqvf-jQttEgWodPl
RPfKP-FO8ple-oFsQl8pc	ndL1DHgeaaCjTN8RtrQ9S	2025-02-22 14:12:46.15	rv4tjV1X201rDa7hXOrNc
8zQea9Jjp1dY8lhfTA_0M	JJKN3jdlt32rSeJ1AphOb	2025-02-22 14:12:46.15	td-mNc-efjT5ef4L84gdT
iRHOWUo1pOmuF5xf_mT4U	LDxHYT8J79qUcsqYh1XIE	2025-02-22 14:12:46.15	ra7m_5dtZZ0fIXz2wYUwS
OMGsX3k0xc2TjZV_OOu9M	LDxHYT8J79qUcsqYh1XIE	2025-02-22 14:12:46.15	G-CIpmGST2Fn9m5H53Pn6
9JkZ2swaYB-6hEil0_SKN	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:46.15	yWDQEXEK77u54toG9glVs
iOQ05cHXiapuSlIElaYij	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:46.15	HW1Y8VMUa8x6Rq-lyICAu
SZS_S_nfGnUFzo-eNA7ow	yOmdvzuc0gq2eZqFXgAWv	2025-02-22 14:12:46.151	HW1Y8VMUa8x6Rq-lyICAu
m651fht6Vwhm77zsQ88IJ	yOmdvzuc0gq2eZqFXgAWv	2025-02-22 14:12:46.151	MolqmNWVa06zm-Io5X_AL
OTFzyVVItc8wnV6QjQLAg	yOmdvzuc0gq2eZqFXgAWv	2025-02-22 14:12:46.151	XBIUrzPwMaB--z4fp4Q_Y
u8Q25oMZI4xvhcdfnCV5_	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.151	rv4tjV1X201rDa7hXOrNc
ZiJFVKKmcvBUnz9-5rwst	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.151	kt1ydP3QW8UxdSlbAryTr
67aCKutdiIRUZOj66e8uU	3mcuaFEos_8fkcQ01bGJ8	2025-02-22 14:12:46.151	YTDvLZ3zpIPxyf7NWbig-
T6eA0BL2QWHnegaxROUNr	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.151	BImDoUWp0nYtVR1XBADA1
V97TLbmbkexnBq9CqN4uB	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.151	da4m6AGKw1WY5L68yhaXJ
Kx1n5EceBRXnoA7icT5-C	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.151	FWIZrDngg9Qx2C6LLK0TZ
6d5B3mXVLG-C3-hr2I-In	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.151	6tAud8OtyM-8ik06LVaIY
LwkuuAlIs-yA1NistQZh0	ytjwR7Wj67ThXy1zQKqr0	2025-02-22 14:12:46.151	fVxGG4jJrK6J8D1T97jAE
YmlLPWkedVqkV_uDQpgQ1	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:46.15	NZ_ctN2LDRjRX5gqzIn-h
pNiNjjMGeFI3vbROpdM6l	woUYtfeKDDDP9rMOU5N00	2025-02-22 14:12:46.15	ynfjsfccIOGfleSPiodgL
tNBUG8tHR9FTAEWluMTXd	bUXAWDeLIpXsRCZUaBaTu	2025-02-22 14:12:46.15	edIBp-z6GbU6qMrFyP-on
D7sib4aa8d9PWGYv-ZhLv	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:46.15	7eSbGUXbGwrL5mz1Q2HW5
MV58ndQAtOZ-FVnFHuF3r	JJKN3jdlt32rSeJ1AphOb	2025-02-22 14:12:46.15	O4aJ-sLLtRhC1gk5aOx8a
-i3MF8_QCBtEvueedQKtk	JJKN3jdlt32rSeJ1AphOb	2025-02-22 14:12:46.15	68q5ldFY_xCCKOqhO2tQk
kF4lnCtNHFmjDUZ_HwlP1	JJKN3jdlt32rSeJ1AphOb	2025-02-22 14:12:46.15	BImDoUWp0nYtVR1XBADA1
_uTkcpU87CCsmx91fKMYd	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:46.15	G-CIpmGST2Fn9m5H53Pn6
QG3ZDG18hD3D98wZNPOus	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:46.15	ErlUpv2BuYhqPxW_t-BnY
SXQXjIkBPcD_FHYEa-Lxz	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:46.15	ILUPZhhZW3bZHegBDR2Cu
2G_sEwoNhEBLPSv_LyUA6	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:46.15	CVm0n4hzIWdsDBrDJradD
u41Cl2UtrKbPdUHQVXwAo	yOmdvzuc0gq2eZqFXgAWv	2025-02-22 14:12:46.151	-IMaZyj9yDW7KJmrtsnR_
mrXiEZ6E-WqpEY0t0fVV4	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.151	Q_DrzN5SotwsTRtHfxLpc
tcRCV-sxBOsZK2pdtRLaS	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.151	6M7Jhq31GYGjqhlXnuSlS
QkT4px_bEAGDVPR3woPHV	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:46.151	_7efse5Y4lOshKF5oF4pZ
dms_wkp3FkpWib7KgMRgH	WB3e4Lw8_uHRtmBPct5I_	2025-02-22 14:12:46.15	G8j4_ZCyMVq8TZaxUvtFo
sUuIXNkch98UHlfbTpYCW	DPqpsO-f5Xn0Sd0EXaqsV	2025-02-22 14:12:46.15	XBIUrzPwMaB--z4fp4Q_Y
9l7Qfb_6F9VygCqGNrcve	DPqpsO-f5Xn0Sd0EXaqsV	2025-02-22 14:12:46.15	SgxumAVx13SBTjv0d5tj7
szpyTfsM1Hs6AU3L59j4R	_6qXgSFAqLDWc7HONDRB6	2025-02-22 14:12:46.15	6M7Jhq31GYGjqhlXnuSlS
QqW1xr6WHBbI4VjjF18Tx	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:46.15	kgaapwTlgtogyJtO0yC-U
KafYH__p8EMgwD2ugw3tm	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:46.15	V3R9xnhUJt5CEK56jPDUU
L2-BS5mkdDHKDdHW7l443	LDxHYT8J79qUcsqYh1XIE	2025-02-22 14:12:46.15	WvVs9H432Rb7EPLVveQBu
A0KMYmHyJBi4Dr6EyKDuQ	LDxHYT8J79qUcsqYh1XIE	2025-02-22 14:12:46.15	ErlUpv2BuYhqPxW_t-BnY
CtZ2T07TOj5qg4Q_zWdwr	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:46.15	N7tK6mDid3gPFfGfuphLj
O2W15uLphJIb8FJCWe1Rx	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:46.15	UsselAyV86fZ-aWUvdGbZ
vUbuWJfAGal2XUN-xEBSw	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:46.15	eE4mNWW5LeV8ael4lbHxF
0jcPmfUYHHT4pmsWwlGFb	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:46.151	UsselAyV86fZ-aWUvdGbZ
xbAnlfng2bu59e81G2CMM	lxHVm4mR19FlJQrnAda9C	2025-02-22 14:12:46.151	FWIZrDngg9Qx2C6LLK0TZ
rU0gCqp9p4w3MNSxZRltc	3mcuaFEos_8fkcQ01bGJ8	2025-02-22 14:12:46.151	da4m6AGKw1WY5L68yhaXJ
oLQxOud3txesBzeASjDG7	_PxGjoNhr_JVCbrR4OshX	2025-02-22 14:12:46.151	XjjbKLVjKuDUGQnqbkk9l
JmT1Bw0W0FQ115kF5ex5l	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:46.151	VtAK0bUWEuTUYufmNQ2uQ
FcieQrMuTd_u3THVdBm-9	ytjwR7Wj67ThXy1zQKqr0	2025-02-22 14:12:46.151	Ex4nSdiMXZ0pxRkSveWu4
A53AB5HAGAcztrCytKy7s	woUYtfeKDDDP9rMOU5N00	2025-02-22 14:12:46.15	fVxGG4jJrK6J8D1T97jAE
j64M9-f6FDkqthNZm-Z2n	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.15	rv4tjV1X201rDa7hXOrNc
_4fjDWSdj9-jFCtftXj3j	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.15	EfSXJZLX_jwTzh4MI9q76
ZPDJLSnGYsUKqjcCbUfo3	ndL1DHgeaaCjTN8RtrQ9S	2025-02-22 14:12:46.15	eE4mNWW5LeV8ael4lbHxF
bkbM41HrlhbuuAa3xxAz3	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.151	FWIZrDngg9Qx2C6LLK0TZ
C76eZ0q2f_ZpLM0qAPtNi	woUYtfeKDDDP9rMOU5N00	2025-02-22 14:12:46.15	2QgqWIb1dXO1R8IpsQWww
TPdT9J_y8KVIqfaprIPAK	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:46.15	V3R9xnhUJt5CEK56jPDUU
1aW7hMNN4F7aO6n7VmhtO	JUws0qhYyaidNKTZCBBQP	2025-02-22 14:12:46.15	7eSbGUXbGwrL5mz1Q2HW5
u-Ltc63U0P3IzBVN_yW6x	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.151	G4kuP6N_ckTd0Rop-VJa-
mHSfydMXV98tLChh6wM54	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.151	2QgqWIb1dXO1R8IpsQWww
XjAid4nu9OUYe6dn4BdR2	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.151	O4aJ-sLLtRhC1gk5aOx8a
JcxAl3OwWg41bS2u6Recm	TbroWkkhGNI9ohebhZUVy	2025-02-22 14:12:46.151	UsselAyV86fZ-aWUvdGbZ
lEas0SLR68BHEJSG8YC9o	hfsURvFDxaGJDjGhSt-4H	2025-02-22 14:12:46.151	010kfQ2xnGsgQEP4d6Qpq
GEA9ddhkRSlH7aeqAdTZK	AC0lF6uy27QJWwv28PCAR	2025-02-22 14:12:46.151	uo5LsCc99Vak-gUkgIzfX
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.notifications (id, type, message, agenda_id, created_at, is_read, updated_at, user_id) FROM stdin;
gZoNW7gzxV3SFFrGOi4dx	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	bdjT6dtbumKCFGpF8xKCz
zasmwSeyQRNL59aF7RKTk	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	SgxumAVx13SBTjv0d5tj7
tLvkRLW3ktxD5l2Q2SWJ0	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	Vnpa0CWF6tNufHq2B0JEP
kSYfxRuvatPbT6h1MKv6t	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	Y5S58eZPGtw_6sC7_WftG
DhzM2VWWit9sy4iuWzvCs	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	Y5S58eZPGtw_6sC7_WftG
S4I21O8_H-AvRp61a5LbG	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Maïs près de Trois-PontsNord	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	Vnpa0CWF6tNufHq2B0JEP
6TxCZMEuNYUogjlys8a__	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	Vnpa0CWF6tNufHq2B0JEP
czeYPfYzRd3Ym_6lxrbHJ	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	Y5S58eZPGtw_6sC7_WftG
VyGyqlTNzvd88ig1i0WX6	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	50C6aYmQ8rb4J8nAGsf2G
bLh7FuiNfycrR2Z_w_wKa	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	M7OhCeRXSMm_xlUQrNNQH
WXQt9CmsDRzwaiH-eWAV5	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	O4aJ-sLLtRhC1gk5aOx8a
-D_DhTDj9aQqAvmS5Q0NP	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	Vnpa0CWF6tNufHq2B0JEP
V5NRdCQA9aitCgLHh_WmQ	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	V3R9xnhUJt5CEK56jPDUU
9ecCNWx5Fy-4a8mQLsGgx	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	O4aJ-sLLtRhC1gk5aOx8a
QijWwBrqHGERLc0WzfojM	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	Vnpa0CWF6tNufHq2B0JEP
lyy0B-tdsd1TwQYdqq2eq	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Piments près de Montigny-le-Tilleul	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	Y5S58eZPGtw_6sC7_WftG
kUITDpSFgXeNT0oarBiQM	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	V3R9xnhUJt5CEK56jPDUU
SqFvalfe6Va6ornRR81Iq	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	50C6aYmQ8rb4J8nAGsf2G
vYG1zsWwMkML3RcmBn2MA	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	0ixnSDCfRSqCEyjspqFfG
4--muUCt5J9MKw__6bfj9	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Maïs près de WalcourtSud	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	50C6aYmQ8rb4J8nAGsf2G
9k6jUS7P-M0QpPIzoKxh1	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	2QgqWIb1dXO1R8IpsQWww
meYVwHLH-AelN-J6N2Yxz	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	50C6aYmQ8rb4J8nAGsf2G
5oTwEjHxHNjlzIq3s3PUO	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	6tAud8OtyM-8ik06LVaIY
PvApaHySFwU6fNc_mVSAF	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	2QgqWIb1dXO1R8IpsQWww
-zEOOvAPIqk42bp_gcs_R	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	50C6aYmQ8rb4J8nAGsf2G
4GVvBvmpJNiQJIm79EPsS	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	2QgqWIb1dXO1R8IpsQWww
1fbDUCufak1mndoiatFsB	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	0ixnSDCfRSqCEyjspqFfG
e3qe1RMDYrVyEIFBxXJht	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Courges près de Thimister-Clermont	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	6M7Jhq31GYGjqhlXnuSlS
Oo-Wauoh77SyL9Rb2NuUg	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Épinards près de Philippevilleplage	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	6M7Jhq31GYGjqhlXnuSlS
GEX0NOvs_1ZICYAUvkV-g	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	ILUPZhhZW3bZHegBDR2Cu
YIK0aMJCJwi5Ph48fnP7K	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Framboises près de Daverdisse	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	2QgqWIb1dXO1R8IpsQWww
mLjxpXq6KZS1mxGlmcyfr	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Betteraves près de Chièvres	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	ILUPZhhZW3bZHegBDR2Cu
VlHrTKtct0LTWH_Mnh-TG	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Piments près de ModaveSud	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	ILUPZhhZW3bZHegBDR2Cu
nu4rVvjkFZ1MV5es46lCL	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes de terre près de Merbes-le-Châteauplage	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	fVxGG4jJrK6J8D1T97jAE
RnNIoVQSlCJSX9_GjM0PT	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	fVxGG4jJrK6J8D1T97jAE
i0EzKbukBMg1vKhZeRNWz	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Cerises près de Comblain-au-PontNord	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	WvVs9H432Rb7EPLVveQBu
4qefnYRi7XlSbgvq0bqAM	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	SgxumAVx13SBTjv0d5tj7
D0UYFT2JbA81f7F-mHgdD	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	6M7Jhq31GYGjqhlXnuSlS
wilgLt3vNIxrr3zfzb3Po	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Maïs près de Florenville	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	svkANm0FmRXwwvrbpPd9p
x80_C5Uq81RFoo2yrCSdg	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	svkANm0FmRXwwvrbpPd9p
TEheYns2Przp5lVhNnSze	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	0ixnSDCfRSqCEyjspqFfG
GM-U2BC7uT75aEubrJ4yb	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	Y5S58eZPGtw_6sC7_WftG
z7YEyKy1UjtgQ0fnYZH68	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	FWIZrDngg9Qx2C6LLK0TZ
FflBCWRtpC9gkibwe2Xdv	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Tomates près de Lessines	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	svkANm0FmRXwwvrbpPd9p
Z9Wf3tLipkP-ZpH802Drq	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Brocolis près de Dalhemcentre	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	XjjbKLVjKuDUGQnqbkk9l
8kNCAf7LLu_FgtsOE585v	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Asperges près de Herstalcentre	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	svkANm0FmRXwwvrbpPd9p
HjDlGztV0gOC5fLp9pn_s	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	t	2025-02-22 14:12:47.056	NZ_ctN2LDRjRX5gqzIn-h
jn-xnKWNYxQy9uhPXdGVx	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	FWIZrDngg9Qx2C6LLK0TZ
ttzW0ZYgXR54HgOmNC2TA	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	NZ_ctN2LDRjRX5gqzIn-h
6h2S_ZpFV296-n1bwNako	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Citrouilles près de Wasseiges	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	NZ_ctN2LDRjRX5gqzIn-h
TGUpMx-7bbf11zH_ZkO-a	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	HoNUiG2AQhcJzcxp1vtJI
DWXgahAeGWHWGcwo8KDRF	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	HoNUiG2AQhcJzcxp1vtJI
Vry0Ch9y6rsGUHjJdR8mx	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	TwaN7v8EaCLjjs8adJGIQ
6smCvpoDGXPpNBWc3KNqx	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	N7tK6mDid3gPFfGfuphLj
79O4Wg6D5v0jeFuWgUm6c	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Choux-fleurs près de HerstalSud	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	YTDvLZ3zpIPxyf7NWbig-
YSI9oJMwytOToWtnGrIIX	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	YTDvLZ3zpIPxyf7NWbig-
ox7DDKP5vqREbwmrzAh72	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	ynfjsfccIOGfleSPiodgL
uhAwdZ_ItK9bGtgyYGxCQ	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	010kfQ2xnGsgQEP4d6Qpq
46sayniaJ1y0jEBwtQFV3	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	010kfQ2xnGsgQEP4d6Qpq
yam80kRb1jyFrwtRiymcF	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Choux-fleurs près de Nassogneplage	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	FtEuhCz-sqPoB72tJwOXj
W_nppszawf50ChNG9drqV	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Asperges près de YvoirSud	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	G-CIpmGST2Fn9m5H53Pn6
Z--ZFjiEa8jWeFXuHIawh	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Carottes près de Bullangecentre	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	G-CIpmGST2Fn9m5H53Pn6
vvQ_V5zMbROUtNR_l-np_	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	0JktpnUT5crbm3tnY_u3e
F6Tb2cP1fHwGN0lrz4wMV	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	pqmZINdePlg38vTQ2WAAA
GebJUM5sWDlC-lob6KHk6	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	t	2025-02-22 14:12:47.059	P72hU5H8q9cZ7f1ghTHbL
ZMCXVlgBhsuqbAaHsF0J_	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes près de Sainte-Odecentre	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	HoNUiG2AQhcJzcxp1vtJI
oyF2pQiPkzOXzz4TInRVq	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	N7tK6mDid3gPFfGfuphLj
riR7bB3R_So3p10uMz7y9	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	YTDvLZ3zpIPxyf7NWbig-
QNG-VLRk5jWyGxuBnZfJO	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Poireaux près de Remicourt	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	010kfQ2xnGsgQEP4d6Qpq
5Pm-lvL7CfXAzDd5LDGRv	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	dynp8GvU7NLNlEzTlFwRE
AWyhbKdCAqkwmoDlv9V4q	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Carottes près de SeraingNord	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	is2ySgVuj4Gt_ae787YZU
6CkBFhgFKXyBA9R9Q8A3n	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	oGxVLS_M1DwYi8FazDcal
JVMhJoGOu2Njl94B0mfHW	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	pqmZINdePlg38vTQ2WAAA
m4b3t-76_grbUy4dE3OYv	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	z7uypMyywv3hDHgKVVldC
yh9-Ic8-xa26s66hV5V_c	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	HoNUiG2AQhcJzcxp1vtJI
cD5ayRlFG5zuSeWdysvrJ	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Asperges près de ErquelinnesSud	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	N7tK6mDid3gPFfGfuphLj
F_LcIadDYt8KOK-S-ldCQ	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	N7tK6mDid3gPFfGfuphLj
Pne6nEXeIJDeOL07odvJX	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Poivrons près de Stoumont	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	ynfjsfccIOGfleSPiodgL
XW75fpwieHfd_XpQP_Oo3	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Citrouilles près de AwansSud	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	UsselAyV86fZ-aWUvdGbZ
26hlA5Kly_jEfKsa1yfv1	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	is2ySgVuj4Gt_ae787YZU
t4QbbrWlZXNEo_1xmmcmU	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	kDw998LpxYkswGqfBwhVK
xUjkynsbRvULPct8PmDMG	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	D8wtot51RwOm5xWlSiNIK
ClUOQZsfQtnuNw7yGtYF_	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	f	2025-02-22 14:12:47.059	qpOxI3xxaWghTx_AhHJFf
YQK4Dh_tt_AwFe-LrO-8k	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	pGYhcMFCFLkC4zhe_PJWQ
TniFRcHJB_yI6Cd0dtq6O	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	hEbvLiNvGJFCxlvnn1ajy
Eus7UbyuZH6d4HWalC7q2	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Navets près de Tintigny	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	YTDvLZ3zpIPxyf7NWbig-
n0mCMJLxbGJNuGxpmPr1H	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	YQX8fsqvf-jQttEgWodPl
37RL7VtewBX-Viu2kO_j6	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes de terre près de WanzeSud	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	UsselAyV86fZ-aWUvdGbZ
Wv2wZIVE30zKMIllHGdBf	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	is2ySgVuj4Gt_ae787YZU
ugtG8aFOGqOA-yTPNgeU_	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Mûres près de Juprelle	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	XBIUrzPwMaB--z4fp4Q_Y
Q8uPJhjyl74zHKy8CsDW4	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	GIJQxS94O41YSHBKKRIgp
jq8OdpSGG2O9ivKIqGwgL	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	Ezl9RkmBFPOFHKKD-ozIV
dShxRqJi2bXcput4pjdu1	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Betteraves près de Erquelinnes	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	yWDQEXEK77u54toG9glVs
tzts52a06ElFy_TIg_Exh	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	hCTGZ3il5htDkjYnF3wXS
oAgTW2NfrCd1bLrooHw_f	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	eE4mNWW5LeV8ael4lbHxF
O-miusCudl5HFDqUbIsTb	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	o12gDGrqvcIG_AaVqUrCX
3zt-rphi7C8hsBh_JGL7z	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	ZUyzKoj-4sITYZmn66MyV
auJRnNomodNPcNsL1i9yq	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Oignons près de Estinnescentre	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	-IMaZyj9yDW7KJmrtsnR_
J8-wb1FoQUx5dpyr7qtWe	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	FcKuqR_ga5aYHkIemUfD-
vZtOtc7puOJUxc_8UtYu3	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	vB9iiQwHG5E2UIGL_A3_2
mpykepmAqiqWTsQKS6LrR	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	yWDQEXEK77u54toG9glVs
OQ787QOHaKGIVYGRBTC3c	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	hCTGZ3il5htDkjYnF3wXS
NPM-4YVbEaqfSnFnI4y-6	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	G4kuP6N_ckTd0Rop-VJa-
h2atIUmGWRUx-bK703b6i	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	kt1ydP3QW8UxdSlbAryTr
tTBfqa7DHQM6qwkJ7gghj	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	UsselAyV86fZ-aWUvdGbZ
GQI7tKg6JWN-uQGTI-V_z	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	FtEuhCz-sqPoB72tJwOXj
hkJHCdI3BvtOOweFWCKsb	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Courges près de Châtelet	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	G-CIpmGST2Fn9m5H53Pn6
PXoQ1rGZFj6cn5_QMXcug	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	GIJQxS94O41YSHBKKRIgp
nFhP8y8n9tXOHFC3hfXuG	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	gTi7k9rbEHJ6MboiOfLF_
9h8uHdIJztb-ubMYwXdrr	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	z7uypMyywv3hDHgKVVldC
n4xYRKfuKeTkaVttjPyU3	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	yWDQEXEK77u54toG9glVs
LM9Y-_IITa50fChe9VccY	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	hEbvLiNvGJFCxlvnn1ajy
e2Msc-rWpKZzx1kIA1PrU	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	VtAK0bUWEuTUYufmNQ2uQ
i98dxrPUXVupcO3SfBQ12	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	G68D-oGzsmHx-UKs7zfbc
0zktw2hN8Acs2keUoHRKF	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	x-zByfzhKyJj31DwjAvV7
RUVGpWnPkHnY3ONeHORI6	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	x-zByfzhKyJj31DwjAvV7
IG8JajIMPdmWLM-YBZAg9	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	XyPJvusDvggrs3XJUhQ_9
5RSVk1eQxz0eu3ndVceba	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	gTi7k9rbEHJ6MboiOfLF_
XPSbWEp05-ouFQVHk-Zbm	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Poivrons près de Pont-à-cellesSud	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	TwaN7v8EaCLjjs8adJGIQ
R7jVDqYNtIaiyZLr7Si6Y	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	kgaapwTlgtogyJtO0yC-U
NxPfAum3gKbYLltfwiyTs	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	eE4mNWW5LeV8ael4lbHxF
okOA4qspwg32CqDNZyAbn	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes de terre près de Profondeville	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	EfSXJZLX_jwTzh4MI9q76
l46yZ4hVO3xsqRD7dCy5v	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	UsselAyV86fZ-aWUvdGbZ
QMfKrcx3iKVT6__ny5qO7	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	MolqmNWVa06zm-Io5X_AL
eRnjn-AFnfukpat6wSBq7	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	71Ow35rP5LZtrCl_9edNW
TYvqcLUb-McRB1msaJxsK	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	pqmZINdePlg38vTQ2WAAA
BRF_iOw0Leq-OCHOb9o5h	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	t	2025-02-22 14:12:47.059	vfResoS5rGXA2JEi2BaeU
dzq4kKfo2N9dlXfjxMJwD	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	pGYhcMFCFLkC4zhe_PJWQ
j9j6MvMKEKnzhSmxGwox6	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Carottes près de Merbes-le-Châteaucentre	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	hCTGZ3il5htDkjYnF3wXS
vQ8WtJpmcY3d5HDWScJfz	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	G4kuP6N_ckTd0Rop-VJa-
hL8jCSgJ5hFfmp6-id-sH	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	ynfjsfccIOGfleSPiodgL
B3xKm7FfwroIAquXWowVf	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	ZUyzKoj-4sITYZmn66MyV
_K5RbObA5ae5awcbX72UI	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	7eSbGUXbGwrL5mz1Q2HW5
Jc6hPTSHqFfpmBcmBO8h6	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	H8GOQDSpJmLwUI-Xd3Ac8
4-URNETfSNIWE78grS5p3	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	parLefUsPQPvgIKscFuPY
LITrFZRuearNeOtgJUONs	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	0JktpnUT5crbm3tnY_u3e
wARg4nJW7abK7qSNb3bQg	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	f	2025-02-22 14:12:47.059	kADWqIx_xfv-eaghFqbDC
NBZybHlVYHxPS-2gxjJ9b	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	t	2025-02-22 14:12:47.059	px9HOKI_UpBFAfUTlV6Q2
vSe_5lOAKJoNgdijEFHsm	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Asperges près de Bièvrecentre	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	TwaN7v8EaCLjjs8adJGIQ
QHoa9h46DXjezNkiF_C7a	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	kgaapwTlgtogyJtO0yC-U
oxstyBllOd_JPOu-70EuF	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Courges près de Eupen	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	BImDoUWp0nYtVR1XBADA1
E3AvS1SA0jN0iKDcvNFnh	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	BImDoUWp0nYtVR1XBADA1
dWRbw6Jp2GELahhZxdbvc	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	Q_DrzN5SotwsTRtHfxLpc
g8lqQ8sqj61cy9iW9v8vW	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Navets près de Braine-l'Alleud	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	x-zByfzhKyJj31DwjAvV7
fMejSTqipZev8r54nf1gK	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Poires près de Wellin	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	7eSbGUXbGwrL5mz1Q2HW5
y-EHIDmKvAmEzNgFhNl7R	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	71Ow35rP5LZtrCl_9edNW
Sw85kEOe47JNJ7zBd5xOO	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	0JktpnUT5crbm3tnY_u3e
EYLNfGiYIeVEiO34BZt2m	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	vB9iiQwHG5E2UIGL_A3_2
zxAKp4lBPXJU1i5IfFsuz	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	t	2025-02-22 14:12:47.059	kADWqIx_xfv-eaghFqbDC
1E_Ovg2efLOJ2M-uuWmSf	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Piments près de Blégnycentre	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	pGYhcMFCFLkC4zhe_PJWQ
oZ_HnWTpOjjBaTKesjvm7	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	hEbvLiNvGJFCxlvnn1ajy
CcazUD_JMfiufptAfznlR	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes près de LiègeNord	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	5BKwWWao8FbqQ0TqEaaTx
J_jknsj1jdh29XQJUMj9S	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	o12gDGrqvcIG_AaVqUrCX
OfEQqEvv5YgupUEQvSvud	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	dynp8GvU7NLNlEzTlFwRE
tj0SRNEKJwMLR-9Ywik3I	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	7eSbGUXbGwrL5mz1Q2HW5
NWEIpTbomqz82wZbupC73	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	FcKuqR_ga5aYHkIemUfD-
fl0_KQ7vgkG6U_gtAf4my	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	XyPJvusDvggrs3XJUhQ_9
CgahS4old4vDLoR4tqOTS	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	f	2025-02-22 14:12:47.059	px9HOKI_UpBFAfUTlV6Q2
_nZk-rEKDw1NI_y-hK6_T	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Piments près de Amblève	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	68q5ldFY_xCCKOqhO2tQk
b4Q6SIcmTXk3erXtdjEWI	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	hCTGZ3il5htDkjYnF3wXS
0Gsn3G05ENguQqfe-_XXK	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	G4kuP6N_ckTd0Rop-VJa-
g_EZ2h6eqYI30fFr1J2zC	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes près de BeauraingNord	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	Q_DrzN5SotwsTRtHfxLpc
URPsc7SyvQ7LnJCslfdPd	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	7eSbGUXbGwrL5mz1Q2HW5
A0Dm_8ACM25nccH0XRjae	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	7eSbGUXbGwrL5mz1Q2HW5
BU49AyJbes2rYFM7EL-Sa	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	parLefUsPQPvgIKscFuPY
c9OrNIKcdY101zS-YFr40	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	D8wtot51RwOm5xWlSiNIK
RcnnuXOBFG-GSftZm3Rj-	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	t	2025-02-22 14:12:47.059	P72hU5H8q9cZ7f1ghTHbL
mXtmOgLTpgaF774rPeTql	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	pGYhcMFCFLkC4zhe_PJWQ
ryQanUnLPlwzEQAZvfvqZ	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Navets près de BeaumontSud	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	td-mNc-efjT5ef4L84gdT
ips0vqRnjEjRw77_-QEbF	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Piments près de Estaimpuis	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	eE4mNWW5LeV8ael4lbHxF
PlekZLeTTs0cJPCZMcji5	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	o12gDGrqvcIG_AaVqUrCX
hfhjXDORTsPqqk5ekrTAw	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	dynp8GvU7NLNlEzTlFwRE
xKAwk5PGS8G8NYW7lELYX	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes près de Pepinster	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	is2ySgVuj4Gt_ae787YZU
54VYn6hTCDs4AS8bDvld7	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Poivrons près de BullangeSud	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	XBIUrzPwMaB--z4fp4Q_Y
zuP7aGdFghQZhxLa-mcvS	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	LpvL2riLWPjTfhgcuqqeB
ayQJMBArd9wwlk58OnXPw	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.059	t	2025-02-22 14:12:47.059	vfResoS5rGXA2JEi2BaeU
_KjfFYxCca4UZ7M42rhjE	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Betteraves près de Martelange	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	pGYhcMFCFLkC4zhe_PJWQ
tM9-ISF1eER_A57yIDmZq	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Raisins près de Comines-WarnetonNord	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	hCTGZ3il5htDkjYnF3wXS
k4WFfxjg3vmMGJpR-iXrV	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	BImDoUWp0nYtVR1XBADA1
kYRilTDpqzXYE49rIAE7S	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	Q_DrzN5SotwsTRtHfxLpc
Lfw5x5413J0ZWjT5DbG8L	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Haricots verts près de CharleroiSud	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	UsselAyV86fZ-aWUvdGbZ
aj6RCHDxCpMPiXnOV3jjQ	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	iuxebV8O0B3-dJthQ-rD2
292uleDZvcymEIXM90-t2	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Aubergines près de AubangeNord	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	XBIUrzPwMaB--z4fp4Q_Y
ecyOd9Q9jPDHYmsSQzxvW	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	t	2025-02-22 14:12:47.058	3Tf6Zl9FLxW2K32Foi7IN
j3BhJXlAB6g65wZeAoUNV	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	Ezl9RkmBFPOFHKKD-ozIV
dlgL1vnzSFwAc1q3cHMc1	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.056	f	2025-02-22 14:12:47.056	HoNUiG2AQhcJzcxp1vtJI
vbp7BscJZQ7ovq4xG3nR3	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Brocolis près de ChaudfontaineNord	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	G8j4_ZCyMVq8TZaxUvtFo
_CxP3koMfVQ2F6Niceb0c	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	G8j4_ZCyMVq8TZaxUvtFo
N_qTzY8YHtMNT5gCJNO3V	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	G8j4_ZCyMVq8TZaxUvtFo
kO4Z8BMeL-KWdYayR3HK8	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	G8j4_ZCyMVq8TZaxUvtFo
9AnI9mhSOPTgqDkzwR-37	NEW_ANNOUNCEMENT	Nouvelle opportunité de glanage de Pommes près de EllezellesNord	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	G4kuP6N_ckTd0Rop-VJa-
I0gFPr-9UpQKgdRl0aIsS	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	G4kuP6N_ckTd0Rop-VJa-
1ODCFF6OqOzAm1WJ0fJ0V	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	Q_DrzN5SotwsTRtHfxLpc
etlkiWXC-RH7nsh3v8RMj	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	t	2025-02-22 14:12:47.057	010kfQ2xnGsgQEP4d6Qpq
hBR4w5vjvpBojFKUaVK3a	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	ZUyzKoj-4sITYZmn66MyV
6_LGbELhsOk5P2pOFbUyK	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.057	f	2025-02-22 14:12:47.057	ZUyzKoj-4sITYZmn66MyV
vh_cfRMUNPE1pXAl6cW2Z	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	iuxebV8O0B3-dJthQ-rD2
sqJxCxSr_LILgwfzAqF_9	GLEANING_CANCELLED	Une session de glanage a été annulée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	G-CIpmGST2Fn9m5H53Pn6
1AsSq1cShJ1J92sxXN2yj	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	XBIUrzPwMaB--z4fp4Q_Y
Osq-Wblx6p8apxdBnNmu1	GLEANING_ACCEPTED	Votre demande de participation a été acceptée	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	G-CIpmGST2Fn9m5H53Pn6
GrpwxBA_Qp6FBEKtB50n8	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	D8wtot51RwOm5xWlSiNIK
5Dv1y4FYUw6naevpxQojv	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	JC56C2tNSjOHITKlNW8ix
VIXfhOed53aAPcTAaeHsB	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	gTi7k9rbEHJ6MboiOfLF_
WFlsbbT8Qshs0In3MOHqT	RESERVATION_REQUEST	Nouvelle demande de participation à votre annonce	\N	2025-02-22 14:12:47.058	f	2025-02-22 14:12:47.058	vfResoS5rGXA2JEi2BaeU
\.


--
-- Data for Name: participations; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.participations (id, status, announcement_id, created_at, user_id) FROM stdin;
YV_xeedf1wSYTkgmGlJuz	CONFIRMED	gE54sw2rRxiKQtkGVvCJ8	2025-02-22 14:12:44.64	edIBp-z6GbU6qMrFyP-on
I6r-9EC05EraWHiyp1A7a	CONFIRMED	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:44.64	edIBp-z6GbU6qMrFyP-on
tV0MvqXwwKCMzRuT8cAiX	CONFIRMED	r1UjwKdgeV8YjUUDNr8kl	2025-02-22 14:12:44.64	ErlUpv2BuYhqPxW_t-BnY
Xg4q6W-K4IEVFeGdVq8IX	CONFIRMED	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:44.64	kx7a_V0q_vcPJ4KEUOulN
5yGIpmskkOTOBkATpyFlb	CONFIRMED	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:44.64	YQX8fsqvf-jQttEgWodPl
Bt375GdWpxzrz5cpRpdu0	CONFIRMED	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:44.64	-IMaZyj9yDW7KJmrtsnR_
Gkv1msXsRhl_yIix7jdSD	CONFIRMED	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:44.64	G4kuP6N_ckTd0Rop-VJa-
sE8t7VlQLRIAN1XABdxYw	CONFIRMED	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:44.64	is2ySgVuj4Gt_ae787YZU
EL6rB0c5vO_9Akc-EZ66q	CONFIRMED	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:44.64	V3R9xnhUJt5CEK56jPDUU
eQX6Vy5hq9TsSnPEg54Go	CONFIRMED	2mJV3Zz3M2i_APe2WKGoA	2025-02-22 14:12:44.64	hEbvLiNvGJFCxlvnn1ajy
fAk80OCMPVfjYgDgxBSdQ	CONFIRMED	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:44.64	vH-zqVd_1gwnMxgoi9TcN
wAOzHGiOh0LT8Y6ZNrHTc	CONFIRMED	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:44.64	010kfQ2xnGsgQEP4d6Qpq
NNpE2oLUGGCOWYJqM-0OP	CONFIRMED	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:44.64	TwaN7v8EaCLjjs8adJGIQ
4Bv0Z-mqPG52kl6ecgHzk	CONFIRMED	gE54sw2rRxiKQtkGVvCJ8	2025-02-22 14:12:44.64	HW1Y8VMUa8x6Rq-lyICAu
blELariXPg-WiP5EadGjo	CONFIRMED	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:44.64	6M7Jhq31GYGjqhlXnuSlS
TUHLDfgxcm6ObBGqI9u8c	CONFIRMED	r1UjwKdgeV8YjUUDNr8kl	2025-02-22 14:12:44.64	8WPa-GF3tVDwE42Ve7zLg
14rge0xFUmWDoUOiRCvsb	CONFIRMED	e6r8LuJgaWcjU42lwS5eU	2025-02-22 14:12:44.64	o12gDGrqvcIG_AaVqUrCX
p_xpOGQSGmYr7mtTwO4aV	CONFIRMED	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:44.64	dynp8GvU7NLNlEzTlFwRE
R18ESt94bKVJfzz8mqNpJ	CONFIRMED	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:44.64	ynfjsfccIOGfleSPiodgL
hN91gwcscpskx2MZLcAx9	CONFIRMED	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:44.64	kx7a_V0q_vcPJ4KEUOulN
QffDGTZWzeJGiedHZRYR1	CONFIRMED	RbURtIE6B-a1AkuKenD6Y	2025-02-22 14:12:44.64	SgxumAVx13SBTjv0d5tj7
r_vCKuDxe4gAUZWsI22T3	CONFIRMED	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:44.64	ZcTt5h_MdndtHtmFxIfxR
VuP_XzjM4l3rniqaDbhBS	CONFIRMED	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:44.64	BImDoUWp0nYtVR1XBADA1
0gpN3i5vIj-ONXdKM9s5G	CONFIRMED	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:44.64	Oa2qVBSUXJgYNiT-NN2Iu
_W3pLaNujwdZA1wWLFxL5	CONFIRMED	NXgvz4jDKfrEifJT6U6zm	2025-02-22 14:12:44.64	Ex4nSdiMXZ0pxRkSveWu4
9dLNYf4JUqXt6pV0QOIdB	CONFIRMED	hDlmu5xi6ucPuMMaPg6lZ	2025-02-22 14:12:44.64	YTDvLZ3zpIPxyf7NWbig-
Lo1VsCBot_QJt_TkNfnoc	CONFIRMED	RbURtIE6B-a1AkuKenD6Y	2025-02-22 14:12:44.64	VtAK0bUWEuTUYufmNQ2uQ
LAkwJru4YQwH60VU8A0fW	CONFIRMED	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:44.64	SgxumAVx13SBTjv0d5tj7
C2CWSPIIqA0Ew-QTb-j6t	CONFIRMED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:44.64	RMC8eL7WJqBWqTMNPNJ0M
3IeyL7KKlMB5HmysqIrD6	CONFIRMED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:44.64	bdjT6dtbumKCFGpF8xKCz
oRzdAROuDZDzl70VOsCfx	CONFIRMED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:44.64	BImDoUWp0nYtVR1XBADA1
34hCw1eArRCpwqLesu5z-	CONFIRMED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:44.64	ILUPZhhZW3bZHegBDR2Cu
nC4ecC92LqryrU6TG5EZs	CONFIRMED	6aW4wuwCzB4TCKN5uvvCT	2025-02-22 14:12:44.64	-IMaZyj9yDW7KJmrtsnR_
wX-B45r1WmppS3g70EcRo	CONFIRMED	UecA0lsgs4MfsKUspmTXG	2025-02-22 14:12:44.64	pGYhcMFCFLkC4zhe_PJWQ
Ax4zoW71IOfk9mtBODuC5	CONFIRMED	NXgvz4jDKfrEifJT6U6zm	2025-02-22 14:12:44.64	Vnpa0CWF6tNufHq2B0JEP
JS6YSs0LpMDnqBYCjm0gJ	CONFIRMED	2oSAE55ybgvklIuz9tyU-	2025-02-22 14:12:44.64	D5dndkr5njKtW4Ac_tmVm
lScADkLwCS__fsjliN2Bn	CONFIRMED	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:44.64	FWIZrDngg9Qx2C6LLK0TZ
UFDXgMyFhNY1nmv5YRxRZ	CONFIRMED	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:44.64	bgcNiV1FK70eotHEVXTeG
l4sOWMK4PbsyT7lXFE7lc	CONFIRMED	r1UjwKdgeV8YjUUDNr8kl	2025-02-22 14:12:44.64	Oa2qVBSUXJgYNiT-NN2Iu
v2XVaL2S6bcYdi7qi1XJI	CONFIRMED	bGc0d8XqeWUi2G-W1sSQV	2025-02-22 14:12:44.64	edIBp-z6GbU6qMrFyP-on
lbgfmtu0_gMNdDx58lR1A	CONFIRMED	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:44.64	XjjbKLVjKuDUGQnqbkk9l
JxaBSBnz5JrjvtSzjxQG_	CONFIRMED	fzVGDzQMEj6SuoZ2SwbZj	2025-02-22 14:12:44.64	XBIUrzPwMaB--z4fp4Q_Y
7LqwbQ4KxzaGn3I0YncY3	CONFIRMED	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:44.64	G8j4_ZCyMVq8TZaxUvtFo
zaRcjCQXWkyMCcLHz9WT3	CONFIRMED	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:44.64	CVm0n4hzIWdsDBrDJradD
VRYIWhnj96Iov3ZpcWhgW	CONFIRMED	DVo_TNjg5who4HgI-2Zud	2025-02-22 14:12:44.64	VtAK0bUWEuTUYufmNQ2uQ
Ub2msR3lJi8c4DSDb20sM	CONFIRMED	Q_BFkCEJAPxYsrQk5uB3R	2025-02-22 14:12:44.64	BImDoUWp0nYtVR1XBADA1
2H1IgNhB0IAux3rAEYiSz	CONFIRMED	dFgF-OJWG3TxmrRS_NE6d	2025-02-22 14:12:44.64	kgaapwTlgtogyJtO0yC-U
Pmn5RLX5dZ5GiPy1fW0K7	CONFIRMED	_staYYIPRFdrPytEYjPR4	2025-02-22 14:12:44.64	G-CIpmGST2Fn9m5H53Pn6
YYT3T0sbD90UK0fwLDHHi	CONFIRMED	2phuQfXKz4nl_mM5muiDN	2025-02-22 14:12:44.64	G68D-oGzsmHx-UKs7zfbc
6fFapeWRi9VweNKA_Kj7B	CONFIRMED	mjqGmqjSW4A0-Ep0Uu1_1	2025-02-22 14:12:44.64	8WPa-GF3tVDwE42Ve7zLg
8O9UmsQAWvqNiStxtWOSd	CONFIRMED	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:44.64	SgxumAVx13SBTjv0d5tj7
YiVyeb0GinufYQX4H2J_Z	CONFIRMED	SDXePMW5CLhEavcJu8SO4	2025-02-22 14:12:44.64	G8j4_ZCyMVq8TZaxUvtFo
6eE2Aev8lHMgDq71-ePJm	CONFIRMED	_staYYIPRFdrPytEYjPR4	2025-02-22 14:12:44.64	taknNHxsb9gYMyf3hMBlE
WL9ycaKge_o7qSDDpRckH	CONFIRMED	SDXePMW5CLhEavcJu8SO4	2025-02-22 14:12:44.64	qB9sSTyr1VEcIpWOfVvmE
4fLwJG3kaZFvGxODtJRar	CONFIRMED	TbOTlviCAg_aydN4g_Nw0	2025-02-22 14:12:44.64	svkANm0FmRXwwvrbpPd9p
J3PQxnqSZd_VoYkFvQu3-	CONFIRMED	ePJhPv7abpQnDzZTIlKVA	2025-02-22 14:12:44.64	Oa2qVBSUXJgYNiT-NN2Iu
JAuObqs-ULpnJUbhBrdFL	CONFIRMED	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:44.641	ZcTt5h_MdndtHtmFxIfxR
TaN_phXh3mbq3NMQmnjr4	CONFIRMED	woUYtfeKDDDP9rMOU5N00	2025-02-22 14:12:44.64	FtEuhCz-sqPoB72tJwOXj
2pCEiBPEieHR0GzAhEmnS	CONFIRMED	XfRVfvnOcpZt5MW5CJFpn	2025-02-22 14:12:44.641	7eSbGUXbGwrL5mz1Q2HW5
7lyqNxYHCSQn41Z-gEsxP	CONFIRMED	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:44.641	G-CIpmGST2Fn9m5H53Pn6
-ti-hsBG0zQsXjERxoQeg	CONFIRMED	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:44.641	G4kuP6N_ckTd0Rop-VJa-
jDJMNi05z_lIE6yHoO4NC	CONFIRMED	-cg1y9j0qRrSah_1O3ZsJ	2025-02-22 14:12:44.641	y1Hx4GXVmNiq1OxpUKFxa
_-lHRuGz5vF0DLzhvFY1F	CONFIRMED	UDjJgC3bfbMfpUdTxiDdt	2025-02-22 14:12:44.641	xWBJ_Lk4-5xl_S95ch4DN
gaXoMS-nrdFFjLxbnsnaz	CONFIRMED	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:44.641	uo5LsCc99Vak-gUkgIzfX
7XPpeSK35E0H3URE9XDpj	CONFIRMED	woUYtfeKDDDP9rMOU5N00	2025-02-22 14:12:44.641	D5dndkr5njKtW4Ac_tmVm
gaAQdey1ADSVxzi_ch_T8	CONFIRMED	Af_xhEH-w4oh-8mNII6ml	2025-02-22 14:12:44.641	VtAK0bUWEuTUYufmNQ2uQ
ZgrWvmB9M7CsFp1Axdcv0	CONFIRMED	UDjJgC3bfbMfpUdTxiDdt	2025-02-22 14:12:44.641	Q_DrzN5SotwsTRtHfxLpc
6BEHNcNmP6Fq7UA8VFAC7	CONFIRMED	89LJE-xewrUYK6UykCSrj	2025-02-22 14:12:44.641	HoNUiG2AQhcJzcxp1vtJI
6DMugN9E2RsRSiG_8upCK	CONFIRMED	Af_xhEH-w4oh-8mNII6ml	2025-02-22 14:12:44.641	CVm0n4hzIWdsDBrDJradD
iyFT9hGzMsXajO2mulx8b	CONFIRMED	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:44.641	G4kuP6N_ckTd0Rop-VJa-
HpYv6lej82gEFXegu0yYz	CONFIRMED	1wNUiByRERoYMJjrhzhqk	2025-02-22 14:12:44.641	eE4mNWW5LeV8ael4lbHxF
gr6dSuGOEHzQy2iun_Ijy	CONFIRMED	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:44.641	FWIZrDngg9Qx2C6LLK0TZ
Xnf7-HCwONU7lXWpGAF8K	CONFIRMED	XmUu9isiAhmW32xZH4ZZk	2025-02-22 14:12:44.641	YTDvLZ3zpIPxyf7NWbig-
LgapoWekw43oTdU3yDFeS	CONFIRMED	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:44.641	ZcTt5h_MdndtHtmFxIfxR
AFYTsEJBPuPL1rQk5wMZC	CONFIRMED	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:44.641	uo5LsCc99Vak-gUkgIzfX
7KUB2NgZKeYHKhZq6hUeN	CONFIRMED	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:44.641	MVar0M4VbKvaTyMGHm5TX
H-_pn1mFYFg4XSB9DYdXU	CONFIRMED	PDutvax019TIxfo26I1IN	2025-02-22 14:12:44.641	qB9sSTyr1VEcIpWOfVvmE
xDdvZGlaVOLd7-U5FFsyv	CONFIRMED	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:44.641	edIBp-z6GbU6qMrFyP-on
bEIj1-bEMs0-HnSjRT1vW	CONFIRMED	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:44.641	MVar0M4VbKvaTyMGHm5TX
8oZfVbkEuHH2e3kpIJ5Ft	CONFIRMED	ndL1DHgeaaCjTN8RtrQ9S	2025-02-22 14:12:44.641	nmzdiwm2gCQChflP80NMh
I6WS7cjuTOXbqdE2_JEch	CONFIRMED	PDutvax019TIxfo26I1IN	2025-02-22 14:12:44.641	ErlUpv2BuYhqPxW_t-BnY
0mymsWzfFHjlHcaWvPLWz	CONFIRMED	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:44.641	bdjT6dtbumKCFGpF8xKCz
MBft25l3pxnKyjoECXh_6	CONFIRMED	vgtI4Nw6SrWDtdCnAz4RD	2025-02-22 14:12:44.641	O4aJ-sLLtRhC1gk5aOx8a
qqJ9EYq1IWF8TvrVErOup	CONFIRMED	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:44.641	RMC8eL7WJqBWqTMNPNJ0M
SsfI-lxdGvJ1PIl0SERe0	CONFIRMED	PDutvax019TIxfo26I1IN	2025-02-22 14:12:44.641	edIBp-z6GbU6qMrFyP-on
ADCFMGly6yo0N12Z9SWfh	CONFIRMED	vgtI4Nw6SrWDtdCnAz4RD	2025-02-22 14:12:44.641	YTDvLZ3zpIPxyf7NWbig-
QPZmCVoPXkfQFJBzkbD0s	CONFIRMED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:44.641	MnoyNuzPIA932-N7FVVu9
YK-m3SiL7bwg4pTCoDpJv	CONFIRMED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:44.641	xqaIMhPePn0LfXF-YKQLh
xc9_lynMNyEDPQJMZE-7r	CONFIRMED	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:44.641	hBWjYB97bi-PTiXh6V5lL
0SNy059iKAeHegM7DMiuE	CONFIRMED	lYgnnJ2vt5Z1jICs5a851	2025-02-22 14:12:44.642	5BKwWWao8FbqQ0TqEaaTx
6eqVT4SAZVw2b8X4ahv91	CONFIRMED	lYgnnJ2vt5Z1jICs5a851	2025-02-22 14:12:44.642	RMC8eL7WJqBWqTMNPNJ0M
juBzsr-Ak7r1QqEaHvhel	CONFIRMED	lYgnnJ2vt5Z1jICs5a851	2025-02-22 14:12:44.642	bdjT6dtbumKCFGpF8xKCz
Hy50XUU2xQ4h01-3J1msj	CONFIRMED	WtsUu45cytRzZu8j7aJMr	2025-02-22 14:12:44.642	kgaapwTlgtogyJtO0yC-U
fmfs5FpWJUHSMwBd04FlO	CONFIRMED	0a3HdSxD6gJJrZ1V_d1ny	2025-02-22 14:12:44.641	TwaN7v8EaCLjjs8adJGIQ
2slYgYp_5qymAR1zUwPzw	CONFIRMED	PDutvax019TIxfo26I1IN	2025-02-22 14:12:44.641	FWIZrDngg9Qx2C6LLK0TZ
seHfTn3zpBiWOdoMm4B26	CONFIRMED	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:44.641	ra7m_5dtZZ0fIXz2wYUwS
hLWNPj3Zodhzbce_EW--l	CONFIRMED	0a3HdSxD6gJJrZ1V_d1ny	2025-02-22 14:12:44.641	iuxebV8O0B3-dJthQ-rD2
FJ3lua9oWVLFe8JXG3RoK	CONFIRMED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:44.641	W2u_mWX7wJprusJBrO6Qy
XEm81Q2yKoOz6xYuH5vvg	CONFIRMED	T_gUz4pDq1h0QwzmLOk6M	2025-02-22 14:12:44.641	ZcTt5h_MdndtHtmFxIfxR
xi7Mn5xYgt6_5N8SA-9IO	CONFIRMED	vgtI4Nw6SrWDtdCnAz4RD	2025-02-22 14:12:44.641	8WPa-GF3tVDwE42Ve7zLg
XLVOZgvwrI2EB7FQNjBkR	CONFIRMED	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:44.641	5ZsdOQRTuO0d9X5EyuXI7
r64DUn7MdNeFguHFPhDa4	CONFIRMED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:44.641	ZUyzKoj-4sITYZmn66MyV
nnirh4FyJSbuGL0lIl8rc	CONFIRMED	vgtI4Nw6SrWDtdCnAz4RD	2025-02-22 14:12:44.641	pGYhcMFCFLkC4zhe_PJWQ
cApRwewihRnmZMhOsAu3v	CONFIRMED	xq-V5AMQpEVc9mWkAker3	2025-02-22 14:12:44.641	Oa2qVBSUXJgYNiT-NN2Iu
EbP7VPMYfAQvN7CwNCpEp	CONFIRMED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:44.641	G-CIpmGST2Fn9m5H53Pn6
bZSd6-0M8cAxvfgrv8TWL	CONFIRMED	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:44.641	N7tK6mDid3gPFfGfuphLj
U0m9qIvLJ4NfbJ-2zzozv	CONFIRMED	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:44.641	MVar0M4VbKvaTyMGHm5TX
FWzHAOxDs9-Ej-5cVfVye	CONFIRMED	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:44.641	Vnpa0CWF6tNufHq2B0JEP
15FpqSuaqItMi4gvySvzk	CONFIRMED	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:44.641	y1Hx4GXVmNiq1OxpUKFxa
ANyq2NFn2osYJLCdRLIDr	CONFIRMED	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:44.641	xWBJ_Lk4-5xl_S95ch4DN
k2klfq5zzLthpCLAbS8fc	CONFIRMED	iY8GqXzNJ9k0CYa6CIjd_	2025-02-22 14:12:44.642	BImDoUWp0nYtVR1XBADA1
4nLyyD4izEEx3YwBCvEaE	CONFIRMED	ZI3ZaEJPZcKWCCdYeqarQ	2025-02-22 14:12:44.642	SgxumAVx13SBTjv0d5tj7
v8jaLCQ6krcSvSAdQTYV1	CONFIRMED	bBUngx7oAupi_cBInbLm-	2025-02-22 14:12:44.642	Pxq28Q6QNzB72vY1-EpHc
sjK3H3ce6cqECgGjz72BQ	CONFIRMED	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:44.641	taknNHxsb9gYMyf3hMBlE
yFD6EclX4bSHq18ZjbdD9	CONFIRMED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:44.641	bdjT6dtbumKCFGpF8xKCz
3lGNmvAvTFDWwERk5Ejqn	CONFIRMED	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:44.641	taknNHxsb9gYMyf3hMBlE
a3euwVJa4WR1Cv7esrXvI	CONFIRMED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:44.641	8WPa-GF3tVDwE42Ve7zLg
qZEfHjL0yB8LwOPXvV9m6	CONFIRMED	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:44.642	xWBJ_Lk4-5xl_S95ch4DN
OJn_L1Iw0D0iN16jU7SDz	CONFIRMED	ggoajYtC_Ep6XZ3uUkB4U	2025-02-22 14:12:44.642	RMC8eL7WJqBWqTMNPNJ0M
_6W1XJJyxPS0ZzbzO0MfW	CONFIRMED	iY8GqXzNJ9k0CYa6CIjd_	2025-02-22 14:12:44.642	bgcNiV1FK70eotHEVXTeG
h8fN8xnGF2MGXWrXeDGfQ	CONFIRMED	hfuyfTwc3egGJE0pEz3h0	2025-02-22 14:12:44.642	V3R9xnhUJt5CEK56jPDUU
mKQWPUUd1fBuFwx8lBCI-	CONFIRMED	WtsUu45cytRzZu8j7aJMr	2025-02-22 14:12:44.642	8WPa-GF3tVDwE42Ve7zLg
ZEIDMrrDGs_vEU8jQMksP	CONFIRMED	PzuGdErwYJjgVb-tiNwNJ	2025-02-22 14:12:44.641	taknNHxsb9gYMyf3hMBlE
_7K-naLZzK952a_Lpop0g	CONFIRMED	0UpZuQ59LuhpDVaAkyXKN	2025-02-22 14:12:44.641	qB9sSTyr1VEcIpWOfVvmE
M31tW67VWBZblLEOvDzx5	CONFIRMED	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:44.641	TwaN7v8EaCLjjs8adJGIQ
pk5SaGnsxeCNEKLILtoaW	CONFIRMED	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:44.641	G8j4_ZCyMVq8TZaxUvtFo
PqAv-9-4craLfgmeHFVcN	CONFIRMED	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:44.641	Oa2qVBSUXJgYNiT-NN2Iu
KU0iB6EObcMVCpDtADRFt	CONFIRMED	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:44.641	ZUyzKoj-4sITYZmn66MyV
dSve98tzsUb_ZnY6YedjI	CONFIRMED	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:44.641	da4m6AGKw1WY5L68yhaXJ
BQx3o337cSYJZO0d4DlZw	CONFIRMED	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:44.641	hCTGZ3il5htDkjYnF3wXS
N1-JUyEQcJL3T5-v_z-x_	CONFIRMED	vBV47jcbiomT8ZOaGA16k	2025-02-22 14:12:44.641	6M7Jhq31GYGjqhlXnuSlS
n2fRDyIFwox0GqYByHykI	CONFIRMED	CLTeqQb13pUifhxKoS8xu	2025-02-22 14:12:44.641	D5dndkr5njKtW4Ac_tmVm
jA78tBWuL-Ux4-KRVHRhM	CONFIRMED	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:44.641	ynfjsfccIOGfleSPiodgL
UZebTmJ7-JTyC9x72I8bq	CONFIRMED	YdySePJge4-KnZk6G0zOQ	2025-02-22 14:12:44.641	HoNUiG2AQhcJzcxp1vtJI
NOUzMh57YuJKTQhvPSKXP	CONFIRMED	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:44.641	6tAud8OtyM-8ik06LVaIY
gascHBc5az1Bg0S-wChqd	CONFIRMED	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:44.641	Oa2qVBSUXJgYNiT-NN2Iu
IP8aDQB3c-LLJuoIPL8Pk	CONFIRMED	iY8GqXzNJ9k0CYa6CIjd_	2025-02-22 14:12:44.642	68q5ldFY_xCCKOqhO2tQk
msR_hzuLNuNMDjBy-yyls	CONFIRMED	bBUngx7oAupi_cBInbLm-	2025-02-22 14:12:44.642	68q5ldFY_xCCKOqhO2tQk
mAaWH8j6FuAEShc3jv6rU	CONFIRMED	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:44.641	H9mgMEsnXG8WR65ZYemRV
IF3Bt7A0KPRpkxSsf0EDv	CONFIRMED	a2JyLo1XT8U4sj41J-Qxu	2025-02-22 14:12:44.641	hCTGZ3il5htDkjYnF3wXS
RcGzO_AWyAx_TWsWY0ngh	CONFIRMED	PDutvax019TIxfo26I1IN	2025-02-22 14:12:44.641	H9mgMEsnXG8WR65ZYemRV
hQqHYux26vH_dCx2Y6-3-	CONFIRMED	iFY-_dF-qeg49wbA3ehga	2025-02-22 14:12:44.641	kx7a_V0q_vcPJ4KEUOulN
ETFhUBWni8_dYsxwiyFtn	CONFIRMED	uZAzuAEYOtQsUkGwyBx3M	2025-02-22 14:12:44.641	MVar0M4VbKvaTyMGHm5TX
y5Jf36NLSvDXW-7XdfEZI	CONFIRMED	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:44.641	Ex4nSdiMXZ0pxRkSveWu4
oQcUp2lF2Q2A4_HT44xAd	CONFIRMED	4d8KAh4jq_eb_gghsG_Z8	2025-02-22 14:12:44.641	MolqmNWVa06zm-Io5X_AL
YDTGaTQs_I9RyHFyT6pkb	CONFIRMED	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:44.641	ZUyzKoj-4sITYZmn66MyV
FR60YIXdmH2HStnDRg_qt	CONFIRMED	TbroWkkhGNI9ohebhZUVy	2025-02-22 14:12:44.642	edIBp-z6GbU6qMrFyP-on
lfIVkrmmHeWpMqg3pobMi	CONFIRMED	jYcasqpd9Uqv6GOGv5r4Y	2025-02-22 14:12:44.641	O4aJ-sLLtRhC1gk5aOx8a
YvkkySNxwYhgMyTBTWWD_	CONFIRMED	CLTeqQb13pUifhxKoS8xu	2025-02-22 14:12:44.641	RMC8eL7WJqBWqTMNPNJ0M
-a6mLs0ZNVLT-JVOs7psJ	CONFIRMED	QK9JsgH58DcjKMfBd3amT	2025-02-22 14:12:44.641	hCTGZ3il5htDkjYnF3wXS
RyifKpCArSRrzdpyFiavX	CONFIRMED	3mcuaFEos_8fkcQ01bGJ8	2025-02-22 14:12:44.641	010kfQ2xnGsgQEP4d6Qpq
Q0NJ4uZ3wRNaSUn1ytwIS	CONFIRMED	y_CR6-fRGBJyOjA6iK1QU	2025-02-22 14:12:44.641	fVxGG4jJrK6J8D1T97jAE
U8DCQRU8ZTSMxZo9w9h-6	CONFIRMED	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:44.641	XBIUrzPwMaB--z4fp4Q_Y
K6mQ2iCE817DiK60QjxmS	CONFIRMED	VMUQqQ0gmb0QRzejh3Tq8	2025-02-22 14:12:44.641	x-zByfzhKyJj31DwjAvV7
hoVgQGafSf9KBwt9jCyTH	CONFIRMED	ndL1DHgeaaCjTN8RtrQ9S	2025-02-22 14:12:44.641	o12gDGrqvcIG_AaVqUrCX
2yctDZSyrG22aUCDSyt8s	CONFIRMED	xq-V5AMQpEVc9mWkAker3	2025-02-22 14:12:44.641	bdjT6dtbumKCFGpF8xKCz
OB8SYZSDEJHhCZHdOdV4-	CONFIRMED	XYGZJmkyhQ_gXWC4aC1m_	2025-02-22 14:12:44.641	BImDoUWp0nYtVR1XBADA1
z62vzxpy_e6IrrlzcUYR0	CONFIRMED	ebE-lDixF4g0BSiOojFic	2025-02-22 14:12:44.641	WvVs9H432Rb7EPLVveQBu
q2c4_FKrGcWRwo1-QRJZa	CONFIRMED	bqCEmwlKkuPvyw_BG_o23	2025-02-22 14:12:44.641	010kfQ2xnGsgQEP4d6Qpq
eXHfeguoy3hDsKfeG_UUr	CONFIRMED	UZf-IoceM8S-JShMD9k9z	2025-02-22 14:12:44.641	N7tK6mDid3gPFfGfuphLj
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.reviews (id, rating, content, created_at, gleaning_id, updated_at, user_id, images) FROM stdin;
yHQnM4zdS2Ez8hSyQdXQJ	4	Super accueil par l'agriculteur Ab asperiores quis labore.	2025-02-22 14:12:45.595	BYQjBA1LceJU68qTeyK6B	2025-02-22 14:12:45.595	8WPa-GF3tVDwE42Ve7zLg	{}
nNpD9XiOX5823BwEQ0i22	5	Super accueil par l'agriculteur Doloribus eveniet ipsa tempore provident facilis temporibus est culpa.	2025-02-22 14:12:45.594	37Ks8jjD4yTlSGQ2NEFe8	2025-02-22 14:12:45.594	is2ySgVuj4Gt_ae787YZU	{}
5K67srXFzcz11BSnPbNED	2	Manque d'organisation Iure saepe dolorem deleniti commodi suscipit.	2025-02-22 14:12:45.595	iRBRVvtjh3E0-I6iVIEBg	2025-02-22 14:12:45.595	HoNUiG2AQhcJzcxp1vtJI	{}
lzCW1mZFSjJa04dZq4YHV	4	Belle initiative contre le gaspillage Dignissimos et aut est dolores officia sed.	2025-02-22 14:12:45.595	8LFwbjDAAtfbHWZj_YqZX	2025-02-22 14:12:45.595	BImDoUWp0nYtVR1XBADA1	{}
QcDMNDtDjypztNANivsbu	3	Manque d'organisation Officiis impedit praesentium.	2025-02-22 14:12:45.595	quaTdmiitA9oOeTBFd7ro	2025-02-22 14:12:45.595	taknNHxsb9gYMyf3hMBlE	{}
bcUVgLgsItgifFVFkQoC5	4	Belle initiative contre le gaspillage Sapiente corrupti optio a ex.	2025-02-22 14:12:45.594	ek1N36aJGduQVXPrgSaks	2025-02-22 14:12:45.594	-IMaZyj9yDW7KJmrtsnR_	{}
FsgaGhB-sy496Kjn2K6cU	3	Accès au champ difficile Eligendi mollitia blanditiis.	2025-02-22 14:12:45.594	G916S1EC8VoNeVKOP_yXr	2025-02-22 14:12:45.594	Ex4nSdiMXZ0pxRkSveWu4	{}
uKmJko76BNP9Upu51n9ss	4	Produits de qualité Atque quisquam accusamus autem suscipit nemo non.	2025-02-22 14:12:45.594	UJhyoPZbyHtn4VMvILBc0	2025-02-22 14:12:45.594	kx7a_V0q_vcPJ4KEUOulN	{}
WLAhuRayxiqZfTrc1DKD3	4	Belle initiative contre le gaspillage Facilis autem similique perferendis.	2025-02-22 14:12:45.595	FXDDxcBzyHvnQLVcZIjpr	2025-02-22 14:12:45.595	7eSbGUXbGwrL5mz1Q2HW5	{}
8YxXD-hWol2x64-37Ga-I	3	Manque d'organisation Vitae quod ab tenetur.	2025-02-22 14:12:45.594	LPJnsdniltMFCdBA8F6Qf	2025-02-22 14:12:45.594	FWIZrDngg9Qx2C6LLK0TZ	{}
jEqzM2roOhJ1n_ZI13yZi	4	Excellente expérience de glanage ! Ab et eaque quos animi ad.	2025-02-22 14:12:45.594	Y7darrt4Nq_KjV_EI87Kg	2025-02-22 14:12:45.594	SgxumAVx13SBTjv0d5tj7	{}
h0oGMwnMJp2C3P-1oiCH2	5	Belle initiative contre le gaspillage Ea eligendi placeat a eveniet hic.	2025-02-22 14:12:45.594	c7Xov-95fRCvdkD9Y6Mcg	2025-02-22 14:12:45.594	BImDoUWp0nYtVR1XBADA1	{}
pMPbEgXyDZv3ezBG6QaTL	4	Belle initiative contre le gaspillage Ex vel ipsam repellat.	2025-02-22 14:12:45.595	42MHOYWZEngq7KjyjQPdx	2025-02-22 14:12:45.595	uo5LsCc99Vak-gUkgIzfX	{}
X5zzpNcHcYSBQAK3cOOlv	5	Produits de qualité Quisquam voluptate quisquam dolore rem explicabo ea facilis.	2025-02-22 14:12:45.594	Qfti5IRW7fV_bbeeMnI8d	2025-02-22 14:12:45.594	6M7Jhq31GYGjqhlXnuSlS	{}
oL9_cVPDPmEuRnYSnNh6G	4	Excellente expérience de glanage ! Dolore in ex fugiat harum eveniet nobis nostrum.	2025-02-22 14:12:45.594	3-0e9WDuPziZOSyJBr70x	2025-02-22 14:12:45.594	hEbvLiNvGJFCxlvnn1ajy	{}
RobU0dfBgI-PNaPsquDGp	4	Excellente expérience de glanage ! In amet odio vel et cupiditate nesciunt.	2025-02-22 14:12:45.594	IkWyOTprLpoRTu2EBt26u	2025-02-22 14:12:45.594	ILUPZhhZW3bZHegBDR2Cu	{}
0FYVLit2HEbLNIl8UtafD	4	Belle initiative contre le gaspillage Laboriosam libero minus alias perspiciatis.	2025-02-22 14:12:45.594	pm83B0OLtzbS45SFryJ3L	2025-02-22 14:12:45.594	RMC8eL7WJqBWqTMNPNJ0M	{}
klnO0sVHqdEODF7emsgvy	3	Manque d'organisation Aliquid nobis cupiditate sequi consectetur officiis vero aliquam.	2025-02-22 14:12:45.595	7ROYmJ3i5at42effPCnNO	2025-02-22 14:12:45.595	qB9sSTyr1VEcIpWOfVvmE	{}
hGZ5XrTXdyUR5GuujN9hI	5	Produits de qualité Voluptatibus commodi vel quisquam distinctio assumenda asperiores deleniti.	2025-02-22 14:12:45.595	n02iRiNM13lLPeszrwjGW	2025-02-22 14:12:45.595	o12gDGrqvcIG_AaVqUrCX	{}
en-0mucOAWuMz00n-ZQ4T	3	Manque d'organisation Fuga ullam eaque unde maxime consectetur id praesentium nisi incidunt.	2025-02-22 14:12:45.595	8LPI4NgekMXH-PSV9GGFA	2025-02-22 14:12:45.595	eE4mNWW5LeV8ael4lbHxF	{}
5Wvm-vXsDrJ7TdMHZVUhD	5	Super accueil par l'agriculteur Perspiciatis quam porro voluptas reprehenderit mollitia labore repellendus dolor.	2025-02-22 14:12:45.595	HLIriS6OXJcXDkFf3LP2U	2025-02-22 14:12:45.595	BImDoUWp0nYtVR1XBADA1	{}
LOYOIEtwc7KdIXjhPkJRU	4	Super accueil par l'agriculteur Aliquam odio esse similique placeat et.	2025-02-22 14:12:45.595	9jgoru0OgtgLC8jdXQ4Cj	2025-02-22 14:12:45.595	bdjT6dtbumKCFGpF8xKCz	{}
mYMXNYPy731wVH4GnM2XT	4	Belle initiative contre le gaspillage Possimus alias cum ut ducimus eveniet ex similique facilis error.	2025-02-22 14:12:45.595	qQ1tAUWMphZrv5IeJ5AT5	2025-02-22 14:12:45.595	W2u_mWX7wJprusJBrO6Qy	{}
ws1EususX6TK0AWSKJq9Y	5	Produits de qualité Eum consectetur error inventore distinctio facilis.	2025-02-22 14:12:45.595	sAg-S_5wfOoBb_Oc1e5GD	2025-02-22 14:12:45.595	RMC8eL7WJqBWqTMNPNJ0M	{}
seyUmDOrDDpZQKCcyHuaQ	5	Produits de qualité Eveniet in tenetur ipsum.	2025-02-22 14:12:45.595	206aHcsfRYc8l-VIlOPcI	2025-02-22 14:12:45.595	BImDoUWp0nYtVR1XBADA1	{}
0Ou54jo4H8TDai1PKPTWQ	2	Manque d'organisation Odit accusamus non aspernatur.	2025-02-22 14:12:45.595	xXIHt10wubDGKqkm8mt2B	2025-02-22 14:12:45.595	ZcTt5h_MdndtHtmFxIfxR	{}
TUTn9DcCaEcNVDDhrkb_J	4	Excellente expérience de glanage ! Numquam veniam autem recusandae dolorum velit consectetur.	2025-02-22 14:12:45.595	qCiI6wABv2xUkMHThoWI3	2025-02-22 14:12:45.595	RMC8eL7WJqBWqTMNPNJ0M	{}
pCwbsq4T0syP2WbyQqeDe	4	Produits de qualité Aliquid blanditiis officia.	2025-02-22 14:12:45.595	jpTZHVGJ8hVWgyKFUfIBK	2025-02-22 14:12:45.595	ZUyzKoj-4sITYZmn66MyV	{}
JpwjbL7PY7ytTdYyp907i	5	Produits de qualité Omnis natus dolores soluta hic distinctio iusto.	2025-02-22 14:12:45.595	h89eeQoRpLBtux0ZF73p3	2025-02-22 14:12:45.595	TwaN7v8EaCLjjs8adJGIQ	{}
Xm8kKXTUYRyTRP6QSJKt5	5	Très bien organisé Quaerat quasi repellendus accusantium animi enim accusamus magnam id ea.	2025-02-22 14:12:45.595	CB-pFXDEUrT1mpjESwmpE	2025-02-22 14:12:45.595	kx7a_V0q_vcPJ4KEUOulN	{}
NQjZd6O2ODzGmQh2CKkHo	5	Super accueil par l'agriculteur Blanditiis omnis dignissimos eius magni architecto maxime sit occaecati.	2025-02-22 14:12:45.595	wYppvPkB8lQQ43bHF5cqD	2025-02-22 14:12:45.595	SgxumAVx13SBTjv0d5tj7	{}
Gs7RLM3a4LN5H4_BL_2Uy	5	Super accueil par l'agriculteur Odio impedit libero voluptatum quia optio rem mollitia.	2025-02-22 14:12:45.595	qLpalXQq0imYSp_VCAbnn	2025-02-22 14:12:45.595	6tAud8OtyM-8ik06LVaIY	{}
Cc7KZtTfXqTbK_pKUX93f	5	Belle initiative contre le gaspillage Unde eius dolore libero cumque impedit exercitationem nihil.	2025-02-22 14:12:45.595	5U-GhaoiBtYqLlz_hWAvS	2025-02-22 14:12:45.595	edIBp-z6GbU6qMrFyP-on	{}
FqymKDVpiB4TtB8HncLy7	4	Produits de qualité Eos dignissimos cupiditate iusto praesentium ipsum laborum.	2025-02-22 14:12:45.595	kxxQZT4wAWkLzxLG1vnS3	2025-02-22 14:12:45.595	MnoyNuzPIA932-N7FVVu9	{}
0PUFxUN3LLL6lxnBBJba8	5	Produits de qualité Deleniti ipsum maiores dignissimos magnam earum voluptatibus nisi distinctio.	2025-02-22 14:12:45.595	w__8UxobQ6z24s2csqKrw	2025-02-22 14:12:45.595	8WPa-GF3tVDwE42Ve7zLg	{}
L8PNwSLswfe9KOC428PsJ	4	Produits de qualité Illum quidem voluptates dolorum doloremque ullam nostrum.	2025-02-22 14:12:45.595	8ZV9autiQZjZv4h_x5kFn	2025-02-22 14:12:45.595	y1Hx4GXVmNiq1OxpUKFxa	{}
OklIxLr06CeB1fIw4Wqb-	5	Super accueil par l'agriculteur Sed quas ex temporibus alias velit accusantium.	2025-02-22 14:12:45.595	RuYfTna36ITWHCvGeePzo	2025-02-22 14:12:45.595	MVar0M4VbKvaTyMGHm5TX	{}
17eHzofROzQLr8O1j2o3o	4	Belle initiative contre le gaspillage Recusandae necessitatibus quae commodi explicabo aspernatur.	2025-02-22 14:12:45.595	oQN5thPUY8nbmnHsGyqNQ	2025-02-22 14:12:45.595	xWBJ_Lk4-5xl_S95ch4DN	{}
4jW72xPHQSlzxti3tFtTE	4	Excellente expérience de glanage ! Voluptatum excepturi aliquid.	2025-02-22 14:12:45.595	VA7kYnRgyzktsQ9qAz2Y9	2025-02-22 14:12:45.595	SgxumAVx13SBTjv0d5tj7	{}
X8-z5I-ZX0hO8F_6U4MSF	5	Belle initiative contre le gaspillage Dolores necessitatibus numquam vel totam vitae libero doloremque.	2025-02-22 14:12:45.595	Anw73IqWy0jTA8TW19gA9	2025-02-22 14:12:45.595	G4kuP6N_ckTd0Rop-VJa-	{}
S-K6K9ptY6fDz1OkNYHKV	4	Super accueil par l'agriculteur Tempora corrupti inventore.	2025-02-22 14:12:45.595	rQU-JqptuWf_B7ERjZjpe	2025-02-22 14:12:45.595	G-CIpmGST2Fn9m5H53Pn6	{}
MVRVwuiNWAULE0KUyCC24	5	Excellente expérience de glanage ! Error quam quidem quidem saepe qui earum non.	2025-02-22 14:12:45.595	B8tHmfOQjKLQ9bgz-J4-r	2025-02-22 14:12:45.595	HoNUiG2AQhcJzcxp1vtJI	{}
laM3MZSmp53dCxizZlUSs	5	Très bien organisé Nulla voluptatem reprehenderit iusto quae ut magnam omnis earum.	2025-02-22 14:12:45.595	0UyaCzCTcd5XJ46ZP6i1f	2025-02-22 14:12:45.595	XBIUrzPwMaB--z4fp4Q_Y	{}
DisJVqql-M3v_wYXY1lBb	5	Super accueil par l'agriculteur Cumque libero est ad dignissimos tempore vitae.	2025-02-22 14:12:45.595	Vzv52howbp3xGidZeHx1A	2025-02-22 14:12:45.595	xqaIMhPePn0LfXF-YKQLh	{}
nQe9jPYe13EFDXHYVvd12	5	Très bien organisé Sunt corporis consectetur eaque iusto porro ab.	2025-02-22 14:12:45.595	qDOyKFsKxxfx4Tlg378yh	2025-02-22 14:12:45.595	Pxq28Q6QNzB72vY1-EpHc	{}
GiKlyJy9gBTEdKcVUA_dQ	5	Produits de qualité Aliquam magnam quibusdam error cum iste eos at pariatur error.	2025-02-22 14:12:45.595	heWqzLsGjQD88b8Ag7Vum	2025-02-22 14:12:45.595	kgaapwTlgtogyJtO0yC-U	{}
SUsAx4xf3PuoIR46H8Dea	4	Produits de qualité Omnis magnam dolorem iste quibusdam nihil dolorum adipisci maiores repellendus.	2025-02-22 14:12:45.595	0peNMRKqXa-gTBQBJYZcj	2025-02-22 14:12:45.595	taknNHxsb9gYMyf3hMBlE	{}
W-8KIxncmorrv9AGI2iwr	5	Super accueil par l'agriculteur Quo nisi fugiat officia assumenda voluptas dolore.	2025-02-22 14:12:45.595	aJPS8S9AvhqguRTleQ10o	2025-02-22 14:12:45.595	edIBp-z6GbU6qMrFyP-on	{}
ESXaeZYUyUTXEV5UDMUI1	4	Super accueil par l'agriculteur Labore in quidem quaerat itaque eos consequatur.	2025-02-22 14:12:45.595	dx_2dChP2x58k9fmCzMna	2025-02-22 14:12:45.595	hCTGZ3il5htDkjYnF3wXS	{}
nZptLJOchSufX_RuR2CEt	2	Manque d'organisation A culpa quasi quam corporis vitae magni.	2025-02-22 14:12:45.595	_buqP9lgvZDNhOba-nuK2	2025-02-22 14:12:45.595	MolqmNWVa06zm-Io5X_AL	{}
F-vgBymgCNOG86WKaVRe3	5	Produits de qualité Odit ducimus debitis voluptate.	2025-02-22 14:12:45.595	yhlFM_i1dmdLf0w4BsudL	2025-02-22 14:12:45.595	kgaapwTlgtogyJtO0yC-U	{}
7iIz8IbJojjDTPcp0zHDE	5	Produits de qualité Laudantium quas esse quo placeat qui veritatis quia.	2025-02-22 14:12:45.595	HGqEDFM_J8KZ1B2o34fQu	2025-02-22 14:12:45.595	010kfQ2xnGsgQEP4d6Qpq	{}
nzAmu_PsMU4Lg2tHCglUh	5	Super accueil par l'agriculteur Rem explicabo minus nostrum.	2025-02-22 14:12:45.595	0ZSRz_CvWio2HNXcZJEKr	2025-02-22 14:12:45.595	BImDoUWp0nYtVR1XBADA1	{}
I_5sx5zDthsuli20s4wLD	5	Super accueil par l'agriculteur Cumque quia possimus magnam consequuntur commodi dolor explicabo in quo.	2025-02-22 14:12:45.595	DVxPI8cI3xx_gCBcTisKA	2025-02-22 14:12:45.595	G-CIpmGST2Fn9m5H53Pn6	{}
ql7ZM4D-OvjhVV_16fSMj	3	Accès au champ difficile Ipsa incidunt ipsam.	2025-02-22 14:12:45.595	FnLdPOmPgcVu7f6-uLgS-	2025-02-22 14:12:45.595	ynfjsfccIOGfleSPiodgL	{}
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.sessions (id, session_token, user_id, expires, created_at) FROM stdin;
TT84HqjfkQ-uRgnruDjJE	T-YzKrQm29cGHHyQ3HDB3	-kiPtRC9MnrNrFzVDqsGU	2025-03-24 14:19:08.63	2025-02-22 14:19:08.291
\.


--
-- Data for Name: statistics; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.statistics (id, last_updated, total_announcements, total_fields, total_food_saved, user_id, total_gleanings) FROM stdin;
pAbW_TYqzpH2AuCgDmA6d	2025-02-22 14:12:45.728	1	0	0	1ek9fQCkFVKKqE700NmEr	0
PVopjEdQWIxNEKgvRirUM	2025-02-22 14:12:45.728	3	0	0	qkZp1bGNi99kS6dH0i9aJ	0
h1jjF7z_jLEgjQBkz7n5r	2025-02-22 14:12:45.728	1	0	0	zINn-Tc0weellTesCUD8w	0
J0-TICWsiBURy3M6VPiyu	2025-02-22 14:12:45.728	3	0	0	JwAPJpRCZ-fJAGXkWKL7Z	0
GGHkS92gX4lhPlf_9vrZT	2025-02-22 14:12:45.728	1	0	0	kDw998LpxYkswGqfBwhVK	0
j8xpAKnoTAbSGxtYhJQrM	2025-02-22 14:12:45.728	0	0	0	hBwrBF00fbzp9MLC-8bBD	0
pCNaapJflDdE9JBRFwdP7	2025-02-22 14:12:45.728	3	0	0	lV0pUs3J0Kkpf7N8XXyGt	0
snTuFzB_aXMBGTQaAT_Ev	2025-02-22 14:12:45.728	2	0	0	rJYwsLLmhM4lNPTyGsLot	0
yysY7lvJANXUoM_b17AfQ	2025-02-22 14:12:45.728	3	0	0	7M3Xgz_SkCK_FWuWXv69A	0
U3LDR_RO-tp7gKQFNlQOt	2025-02-22 14:12:45.728	1	0	0	D8wtot51RwOm5xWlSiNIK	0
yln1o3CFyuSnIsAIzI6fZ	2025-02-22 14:12:45.728	1	0	0	93ATPOdykAl5vCfjDk9ax	0
4TeiBbRT9kGvctgXacP_7	2025-02-22 14:12:45.728	1	0	0	rgVT7JF1blWKZkHHXu5hv	0
KB2upoiPUWy_sdJaLJ0bx	2025-02-22 14:12:45.728	1	0	0	URBfjrmCALpLD3arTBAJS	0
bMbYqyP6HRbof1v3tH5iv	2025-02-22 14:12:45.728	3	0	0	0JktpnUT5crbm3tnY_u3e	0
XR5Us-0ZPvUjbcEY0WUAr	2025-02-22 14:12:45.728	2	0	0	SyqfzOLsFarxWvRtr6xZl	0
UlaAWBBKgT4Yt57u24PWf	2025-02-22 14:12:45.728	2	0	0	i2CHfTHszwJCe_3zFZa2R	0
XSTi-kZ2vbqo_Sh_wRWyI	2025-02-22 14:12:45.728	2	0	0	FcKuqR_ga5aYHkIemUfD-	0
eD-QjxaWLCRS9FmNmFvZV	2025-02-22 14:12:45.728	1	0	0	JC56C2tNSjOHITKlNW8ix	0
kDXKlYdRdKZOGW8gu0fGX	2025-02-22 14:12:45.728	3	0	0	G8SSJTwWK5vhwrjLXPi97	0
mvM8_QKPoW4MA6n15-mQG	2025-02-22 14:12:45.728	3	0	0	XyPJvusDvggrs3XJUhQ_9	0
go6VjB8orXYOCBaLURoRN	2025-02-22 14:12:45.728	2	0	0	O60wJSSWwEMg7oOPDOykN	0
FttfeI7fe4olTGHaoTRpA	2025-02-22 14:12:45.728	3	0	0	LpvL2riLWPjTfhgcuqqeB	0
Mtzsg6_yvP4-jpTShZqYQ	2025-02-22 14:12:45.728	1	0	0	McpoM6XXIPKDUId8yw-GL	0
6AHQPrAsVZZWFp-GugDHX	2025-02-22 14:12:45.728	2	0	0	vB9iiQwHG5E2UIGL_A3_2	0
BfuhbEqGOrWnwaGd21kyO	2025-02-22 14:12:45.728	3	0	0	3Tf6Zl9FLxW2K32Foi7IN	0
WIfNyg0NkfTHC6STFZ9Oa	2025-02-22 14:12:45.728	3	0	0	s5IuZ0KU1iWf5rGIwzNc3	0
RGIXENVnGuQ_ope7kWHQh	2025-02-22 14:12:45.728	3	0	0	5saKcxS16EzHbDfZC0Avd	0
M6kNgxP4wuP_YgGCjK3A1	2025-02-22 14:12:45.728	3	0	0	2zZNda28L4ZJ8KDFPJBvZ	0
9xFuuLbiDJQT1J6QLZuNu	2025-02-22 14:12:45.728	1	0	0	zXPTmsW-T2N3idsEc6fos	0
8yrxZfE4RRkGdcxK3jQgy	2025-02-22 14:12:45.728	3	0	0	GIJQxS94O41YSHBKKRIgp	0
Lf1X-mlTcX6GsmWT6nY0h	2025-02-22 14:12:45.728	3	0	0	SVyHqJ5Y2dE1CsnN15ngx	0
pENriOfqcTolL3aKRJVz3	2025-02-22 14:12:45.728	2	0	0	9NwU2_sA-mig4BRap4WZs	0
NgeJvXEEl0Lhb7wL7hdxE	2025-02-22 14:12:45.728	3	0	0	-kiPtRC9MnrNrFzVDqsGU	0
TSbgGFE2kGdXa9ftcT8wH	2025-02-22 14:12:45.728	1	0	0	i-Je7_EXJ1058I-TMNiav	0
TvgkqD3ntB-VEHZpuveRf	2025-02-22 14:12:45.729	1	0	0	9LYH4KAEavh0Z7bX_012q	0
vypvuBm0KpqbfTxnvf9Ms	2025-02-22 14:12:45.728	2	0	0	uJBicvPDE47w6xZK6LH-d	0
mjZOTAI42R92HlJkmQA_j	2025-02-22 14:12:45.729	2	0	0	wfmDD0c9hBfJvty4WZwGk	0
ZondgF3aECkrWE1LXwSEj	2025-02-22 14:12:45.729	2	0	0	C_ylVwYqpjnkJFCJKXPkE	0
PuCniCcpLpK1QKMp9-6Hl	2025-02-22 14:12:45.729	1	0	0	gTi7k9rbEHJ6MboiOfLF_	0
662p0RzQ5pic9fEHVB5oq	2025-02-22 14:12:45.729	2	0	0	lVbXOcsEkm4f2cvPqNBkk	0
PqeSfwS0rcJO9u5IXmqjM	2025-02-22 14:12:45.729	2	0	0	parLefUsPQPvgIKscFuPY	0
QWb08I6pAOmaf3isW7guM	2025-02-22 14:12:45.729	3	0	0	qpOxI3xxaWghTx_AhHJFf	0
_nihj2WnLOY18d74nbl0J	2025-02-22 14:12:45.729	2	0	0	z7uypMyywv3hDHgKVVldC	0
tUCXRF9Qy_x7vXR7qh_wA	2025-02-22 14:12:45.729	1	0	0	vfResoS5rGXA2JEi2BaeU	0
MOKw4SeAENteu36ky0maV	2025-02-22 14:12:45.729	3	0	0	px9HOKI_UpBFAfUTlV6Q2	0
xUbtroJQ9sj8AssFBFjPo	2025-02-22 14:12:45.729	2	0	0	P72hU5H8q9cZ7f1ghTHbL	0
h2iNEFdT5N-WOj0501hpx	2025-02-22 14:12:45.729	3	0	0	Ezl9RkmBFPOFHKKD-ozIV	0
77LA_Dv66qr2nxHFv576I	2025-02-22 14:12:45.729	3	0	0	c9qiER6Tva0mqYJEjFQ4-	0
_m5-ZUWuzdqedkUWJ5rV8	2025-02-22 14:12:45.729	3	0	0	ohWe6fKIBDEBVBmPMlrxP	0
6o5-nX6LUNZTfAeUdeqXQ	2025-02-22 14:12:45.729	3	0	0	TRC71SAKv_J3g_OLcaR81	0
6jkfz3Y7JYZ-BnTRPACud	2025-02-22 14:12:45.729	2	0	0	3g0eBUuFJFI8nj4t0wNn1	0
KAewhUxHWd_UjPCRSXg-v	2025-02-22 14:12:45.729	1	0	0	hqUr9AznCFGLWEft00-6X	0
IuujXH-zFNtIoaFY0_sg-	2025-02-22 14:12:45.729	3	0	0	71Ow35rP5LZtrCl_9edNW	0
-IPkCkrM-x62tYhtHTqgq	2025-02-22 14:12:45.729	3	0	0	lgm9bh82Tr9B74r7Dx8AS	0
TNu51Zwk8yVYRMWeULbgb	2025-02-22 14:12:45.729	2	0	0	F0JxUXRuxdUVVlj0sLoF2	0
KdOM--uDGtWsuA0a9L3sk	2025-02-22 14:12:45.729	3	0	0	7lvYzovKiZ5AO6uZl11ws	0
_nK-azhsGSf8YgK6dqsiI	2025-02-22 14:12:45.729	3	0	0	oGxVLS_M1DwYi8FazDcal	0
EYnEsY5Hu7c2_gLA6ltT0	2025-02-22 14:12:45.729	2	0	0	dTaLyNXl7V2K55YGbLHvB	0
pJAZGIdK3hKf5cJIkpUM0	2025-02-22 14:12:45.729	1	0	0	Eup65cutord2omDleknSo	0
WuFvdNs69ZAj_WBKbYTBq	2025-02-22 14:12:45.729	1	0	0	pqmZINdePlg38vTQ2WAAA	0
SIEcNQr0JOXiPKeSoEywd	2025-02-22 14:12:45.729	3	0	0	kADWqIx_xfv-eaghFqbDC	0
7T4GtgqbwahoTk_aggzBV	2025-02-22 14:12:45.729	0	0	0	V3R9xnhUJt5CEK56jPDUU	0
3tficZ0OeMEcxd4MZTh3I	2025-02-22 14:12:45.729	0	0	1181	Vnpa0CWF6tNufHq2B0JEP	2
301ZNFLYEoMmGApdHzU5r	2025-02-22 14:12:45.729	0	0	198	qB9sSTyr1VEcIpWOfVvmE	1
Vi0SN-g5ygZbnQMQgAfQP	2025-02-22 14:12:45.729	0	0	627	D5dndkr5njKtW4Ac_tmVm	1
yrqub95UQKG-CgnhBsdMl	2025-02-22 14:12:45.729	0	0	0	O4aJ-sLLtRhC1gk5aOx8a	0
uv0Qv3uJftb3Pdl9zQ0WZ	2025-02-22 14:12:45.729	0	0	247	bdjT6dtbumKCFGpF8xKCz	1
duquTVZDaQk3yfNg0ULor	2025-02-22 14:12:45.729	0	0	93	xqaIMhPePn0LfXF-YKQLh	1
eRRv0xKqxJ2jFD_Y0AeWL	2025-02-22 14:12:45.729	0	0	1116	kx7a_V0q_vcPJ4KEUOulN	2
aqsko_xU_8oPlml0g3hjj	2025-02-22 14:12:45.729	0	0	647	Pxq28Q6QNzB72vY1-EpHc	1
66ZfUzSlqK02SigtvRAD0	2025-02-22 14:12:45.729	0	0	1222	SgxumAVx13SBTjv0d5tj7	3
HnhSwZGEHYJmmxBvmcyDd	2025-02-22 14:12:45.729	0	0	0	50C6aYmQ8rb4J8nAGsf2G	0
TeaSGz3m8_2ZjYSs-Tmj6	2025-02-22 14:12:45.729	0	0	390	FWIZrDngg9Qx2C6LLK0TZ	2
pPIAdZ_SmZ1sJ-Rf8aR0f	2025-02-22 14:12:45.729	0	0	0	N7tK6mDid3gPFfGfuphLj	0
ip0YpiFbUzz8XrB4PNRhj	2025-02-22 14:12:45.729	0	0	0	nRoy8jXSGQuIyMMJCnSNf	0
bRJYKwv5YqcazlSqN8pTd	2025-02-22 14:12:45.729	0	0	0	5BKwWWao8FbqQ0TqEaaTx	0
mi6DPbVWdD5hACY12k7ho	2025-02-22 14:12:45.729	0	0	0	0ixnSDCfRSqCEyjspqFfG	0
O3XbKc6k8VMJ9niChwb9O	2025-02-22 14:12:45.729	0	0	647	ILUPZhhZW3bZHegBDR2Cu	1
eFILoLxLtX8FcrsFZZHvk	2025-02-22 14:12:45.729	0	0	0	svkANm0FmRXwwvrbpPd9p	0
qbxRP5EaCoO5zcTgpa9MO	2025-02-22 14:12:45.729	0	0	817	taknNHxsb9gYMyf3hMBlE	2
s-RWoQbUBynOb7-4ScFSu	2025-02-22 14:12:45.729	0	0	369	CVm0n4hzIWdsDBrDJradD	1
Kv9xPRkgF38zxBPkKIuSe	2025-02-22 14:12:45.729	0	0	456	HoNUiG2AQhcJzcxp1vtJI	2
YVvoXNuyByb-h4eK9f8ak	2025-02-22 14:12:45.729	0	0	0	yWDQEXEK77u54toG9glVs	0
HOUJb9Fix7KbdYXt07MzA	2025-02-22 14:12:45.729	0	0	998	hCTGZ3il5htDkjYnF3wXS	2
F0VFvmpO637VmhnD2R4vK	2025-02-22 14:12:45.729	0	0	0	G8j4_ZCyMVq8TZaxUvtFo	0
H5hcflWo5FgOYnXHuo9Ok	2025-02-22 14:12:45.729	0	0	0	ra7m_5dtZZ0fIXz2wYUwS	0
pXPcbUJecxKeN7WQzuBr7	2025-02-22 14:12:45.729	0	0	1505	YTDvLZ3zpIPxyf7NWbig-	3
qJYIg9Gn3HjmW4yu6Os1p	2025-02-22 14:12:45.729	0	0	486	ZcTt5h_MdndtHtmFxIfxR	1
F8G8Rk6x-h5yGxwbl9mut	2025-02-22 14:12:45.729	0	0	0	_7efse5Y4lOshKF5oF4pZ	0
AI_cpA0U_Xbi8KemuL9Js	2025-02-22 14:12:45.73	0	0	941	Ex4nSdiMXZ0pxRkSveWu4	2
H0Sa83kF7QfB674RkNw4z	2025-02-22 14:12:45.729	0	0	0	M7OhCeRXSMm_xlUQrNNQH	0
p0AkboQPwtA2DGfc0qtqF	2025-02-22 14:12:45.729	0	0	0	rv4tjV1X201rDa7hXOrNc	0
N2MvaBeoKX83-YSGSLXjt	2025-02-22 14:12:45.729	0	0	0	XjjbKLVjKuDUGQnqbkk9l	0
yNv-ooVm8a9D5kSTCEkht	2025-02-22 14:12:45.729	0	0	1515	8WPa-GF3tVDwE42Ve7zLg	4
V3ROVw_Hh3LQRLLpXA_MP	2025-02-22 14:12:45.729	0	0	1083	TwaN7v8EaCLjjs8adJGIQ	2
9c7oFrgaSzR2P6Icaucjo	2025-02-22 14:12:45.729	0	0	0	pGYhcMFCFLkC4zhe_PJWQ	0
uWRAsyFUHRreCxPLPX-cv	2025-02-22 14:12:45.729	0	0	0	td-mNc-efjT5ef4L84gdT	0
f3MnEBXRBRl3-Y7_stuKr	2025-02-22 14:12:45.729	0	0	743	hEbvLiNvGJFCxlvnn1ajy	1
_aMxugspjvl9sOOm_SlD1	2025-02-22 14:12:45.729	0	0	1780	RMC8eL7WJqBWqTMNPNJ0M	4
Po9JigXhSZQhAy8GfJzht	2025-02-22 14:12:45.729	0	0	139	bgcNiV1FK70eotHEVXTeG	1
F2o981pQ_jC_LcHJrVVEL	2025-02-22 14:12:45.729	0	0	698	G68D-oGzsmHx-UKs7zfbc	1
8tIijYHNI3djAiSnfWmwd	2025-02-22 14:12:45.729	0	0	344	G4kuP6N_ckTd0Rop-VJa-	1
OerV8-NQN_0LAN27UTkqo	2025-02-22 14:12:45.729	0	0	0	fVxGG4jJrK6J8D1T97jAE	0
E8i6jE9XTwlyY7iEVDCRR	2025-02-22 14:12:45.729	0	0	70	6M7Jhq31GYGjqhlXnuSlS	1
QlV9qoRn7WHbor_cZPttJ	2025-02-22 14:12:45.729	0	0	0	2QgqWIb1dXO1R8IpsQWww	0
W1-4hmTx44PvrhO7Kfk_9	2025-02-22 14:12:45.729	0	0	0	nmzdiwm2gCQChflP80NMh	0
zy1vAFKogp2styexoMHr7	2025-02-22 14:12:45.729	0	0	0	5ZsdOQRTuO0d9X5EyuXI7	0
T-yXQdcsJd5F7_Q0HWjEm	2025-02-22 14:12:45.729	0	0	0	da4m6AGKw1WY5L68yhaXJ	0
5SPXtJ3UBrtQkXYlnMJJN	2025-02-22 14:12:45.729	0	0	0	Q_DrzN5SotwsTRtHfxLpc	0
16aQnzrCqwQDLEAYGze2G	2025-02-22 14:12:45.729	0	0	668	Oa2qVBSUXJgYNiT-NN2Iu	1
wzNUZaOxOGGhxU40SD1dT	2025-02-22 14:12:45.729	0	0	585	010kfQ2xnGsgQEP4d6Qpq	2
1B9H2pl31S6TqnM-_vhd8	2025-02-22 14:12:45.73	0	0	431	7eSbGUXbGwrL5mz1Q2HW5	1
vOjAQOKhaqv8cR4RpCPh2	2025-02-22 14:12:45.73	0	0	478	xWBJ_Lk4-5xl_S95ch4DN	1
rpJ-nuEgs5Z85aj3XXQ-s	2025-02-22 14:12:45.73	0	0	0	HW1Y8VMUa8x6Rq-lyICAu	0
DuQvn3eNDqxAZ_WH50UDP	2025-02-22 14:12:45.73	0	0	589	is2ySgVuj4Gt_ae787YZU	1
wYJpL7LKwiZsk88WdF3-D	2025-02-22 14:12:45.73	0	0	503	XBIUrzPwMaB--z4fp4Q_Y	1
9gM4ltL774PrdwJTqiorh	2025-02-22 14:12:45.729	0	0	0	VtAK0bUWEuTUYufmNQ2uQ	0
t4o9pYeewfg_u65Ebs28Q	2025-02-22 14:12:45.729	0	0	287	ynfjsfccIOGfleSPiodgL	1
tjbd2wdlMmc5Y1H87cvlF	2025-02-22 14:12:45.729	0	0	882	ZUyzKoj-4sITYZmn66MyV	2
2FXgykXz3XZ6kpy7hD3b_	2025-02-22 14:12:45.73	0	0	0	ErlUpv2BuYhqPxW_t-BnY	0
xjaYikQfSShHGD8WEJghi	2025-02-22 14:12:45.73	0	0	0	UsselAyV86fZ-aWUvdGbZ	0
bVAm6ywuVR1ysJYXFES1s	2025-02-22 14:12:45.73	0	0	76	MnoyNuzPIA932-N7FVVu9	1
DNqBNatj_2xjXOt9oARNS	2025-02-22 14:12:45.73	0	0	816	y1Hx4GXVmNiq1OxpUKFxa	1
7SQtTrhP4BTjt_hkq-bzM	2025-02-22 14:12:45.729	0	0	336	hBWjYB97bi-PTiXh6V5lL	1
GrZgcmW4pPw8gxsNiTonA	2025-02-22 14:12:45.729	0	0	0	EfSXJZLX_jwTzh4MI9q76	0
ZxJFL8Jx6JoQgtuA30m6y	2025-02-22 14:12:45.729	0	0	0	YQX8fsqvf-jQttEgWodPl	0
-WTUFGr0qnoRFTrgq0ZHb	2025-02-22 14:12:45.73	0	0	0	dynp8GvU7NLNlEzTlFwRE	0
sUyfb4YMzqNj2LWVbiF_5	2025-02-22 14:12:45.73	0	0	537	G-CIpmGST2Fn9m5H53Pn6	3
oRabzgCP9_SdIfyk9Uu2n	2025-02-22 14:12:45.729	0	0	204	W2u_mWX7wJprusJBrO6Qy	1
kuDEgvHKPeR7recMnITvm	2025-02-22 14:12:45.729	0	0	0	Y5S58eZPGtw_6sC7_WftG	0
ZheZwPjRpbFAoVmh7-307	2025-02-22 14:12:45.729	0	0	589	6tAud8OtyM-8ik06LVaIY	1
pUaVFHqmtVAzNpHS0ULgo	2025-02-22 14:12:45.729	0	0	147	WvVs9H432Rb7EPLVveQBu	1
hhE6ex6_IXoAZhzKxbXqh	2025-02-22 14:12:45.729	0	0	0	NZ_ctN2LDRjRX5gqzIn-h	0
00RvaVKX-rzrY3LwfdRfu	2025-02-22 14:12:45.729	0	0	0	GDNiqcy5j67FHEG6jSaR2	0
gyk0Jll22BVxgZrOsXGOx	2025-02-22 14:12:45.729	0	0	0	68q5ldFY_xCCKOqhO2tQk	0
pxphx6NWAQUPk94f1U9DL	2025-02-22 14:12:45.729	0	0	174	MVar0M4VbKvaTyMGHm5TX	1
mlAf8JarTZc5Xny0yCpyQ	2025-02-22 14:12:45.729	0	0	559	kgaapwTlgtogyJtO0yC-U	2
PrW9RKwTikzSXXctPHpkS	2025-02-22 14:12:45.729	0	0	619	eE4mNWW5LeV8ael4lbHxF	1
fUdy1seC_TFQ3NBxkFl40	2025-02-22 14:12:45.73	0	0	0	x-zByfzhKyJj31DwjAvV7	0
KjOdhQLkTGg1bU2bNwLwd	2025-02-22 14:12:45.73	0	0	463	MolqmNWVa06zm-Io5X_AL	1
jL1XssoNvYwzxwxvLNYhd	2025-02-22 14:12:45.729	0	0	599	H9mgMEsnXG8WR65ZYemRV	1
Kx7S_9jnQb4AvoBFEQ_3F	2025-02-22 14:12:45.73	0	0	0	H8GOQDSpJmLwUI-Xd3Ac8	0
uc5YYCavb3MeQh9ucPlHk	2025-02-22 14:12:45.73	0	0	704	-IMaZyj9yDW7KJmrtsnR_	1
OZPF07z4ld_5VIejYwmuG	2025-02-22 14:12:45.73	0	0	377	uo5LsCc99Vak-gUkgIzfX	1
P90N2_f9nFQn860fQUj4s	2025-02-22 14:12:45.73	0	0	0	FtEuhCz-sqPoB72tJwOXj	0
gN7dqKhN2dBCDB7cmechc	2025-02-22 14:12:45.729	0	0	2431	BImDoUWp0nYtVR1XBADA1	5
pEmThOuboXonBbKm5KMjH	2025-02-22 14:12:45.729	0	0	0	kt1ydP3QW8UxdSlbAryTr	0
Mzd5TRapy_WjHshz6wgRk	2025-02-22 14:12:45.729	0	0	580	o12gDGrqvcIG_AaVqUrCX	1
1bQ6K1LbD8XJawFhFf6ac	2025-02-22 14:12:45.729	0	0	1099	edIBp-z6GbU6qMrFyP-on	3
V7kww-wZTpDeBFNVmwKRE	2025-02-22 14:12:45.729	0	0	0	vH-zqVd_1gwnMxgoi9TcN	0
v11UH8c69a71P-wWFi2lM	2025-02-22 14:12:45.73	0	0	0	iuxebV8O0B3-dJthQ-rD2	0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Field4u_owner
--

COPY public.users (id, name, email, image, bio, plan, role, language, created_at, deleted_at, email_verified, password_hash, resend_contact_id, stripe_customer_id, updated_at, "onboardingCompleted", accepted_rules) FROM stdin;
lV0pUs3J0Kkpf7N8XXyGt	Billie Strosin	Billie.Strosin97@example.be	\N	Agriculteur·rice passionné·e de la région de Yvoirplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
oGxVLS_M1DwYi8FazDcal	Jason Schroeder	Jason.Schroeder7@example.be	\N	Agriculteur·rice passionné·e de la région de Rixensart	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
URBfjrmCALpLD3arTBAJS	Lyne Perrin	Lyne_Perrin@example.be	\N	Agriculteur·rice passionné·e de la région de Bernissartplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
i2CHfTHszwJCe_3zFZa2R	Milan Frami	Milan_Frami@example.be	\N	Agriculteur·rice passionné·e de la région de Jodoigne	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
dTaLyNXl7V2K55YGbLHvB	Salvador Welch	Salvador_Welch@example.be	\N	Agriculteur·rice passionné·e de la région de WalhainNord	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
pqmZINdePlg38vTQ2WAAA	Carolina Carter	Carolina_Carter@example.be	\N	Agriculteur·rice passionné·e de la région de StoumontSud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
LpvL2riLWPjTfhgcuqqeB	Mike Aufderhar	Mike.Aufderhar83@example.be	\N	Agriculteur·rice passionné·e de la région de Saint-Vithplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
qkZp1bGNi99kS6dH0i9aJ	Sira Lubowitz	Sira.Lubowitz@example.be	\N	Agriculteur·rice passionné·e de la région de Bassenge	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
93ATPOdykAl5vCfjDk9ax	Robinson Reinger	Robinson_Reinger@example.be	\N	Agriculteur·rice passionné·e de la région de Ittreplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	f	f
zINn-Tc0weellTesCUD8w	Aurore Davis	Aurore.Davis@example.be	\N	Agriculteur·rice passionné·e de la région de Frasnes-lez-Anvaing	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
71Ow35rP5LZtrCl_9edNW	Julia Roux	Julia.Roux@example.be	\N	Agriculteur·rice passionné·e de la région de OlneSud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
rJYwsLLmhM4lNPTyGsLot	Cheick Kunde	Cheick_Kunde81@example.be	\N	Agriculteur·rice passionné·e de la région de Ham-sur-Heure-Nalinnes	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
1ek9fQCkFVKKqE700NmEr	Timothee Roussel	Timothee_Roussel@example.be	\N	Agriculteur·rice passionné·e de la région de La Calaminecentre	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
i-Je7_EXJ1058I-TMNiav	Guillaume Raynor	Guillaume_Raynor44@example.be	\N	Agriculteur·rice passionné·e de la région de Arlon	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
0JktpnUT5crbm3tnY_u3e	Ilona Daugherty	Ilona_Daugherty5@example.be	\N	Agriculteur·rice passionné·e de la région de Hastièrecentre	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
SyqfzOLsFarxWvRtr6xZl	Shelia O'Conner	Shelia.OConner93@example.be	\N	Agriculteur·rice passionné·e de la région de Daverdisse	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
s5IuZ0KU1iWf5rGIwzNc3	Arlene Willms	Arlene_Willms@example.be	\N	Agriculteur·rice passionné·e de la région de Rumes	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
JwAPJpRCZ-fJAGXkWKL7Z	Lamar Romaguera	Lamar_Romaguera58@example.be	\N	Agriculteur·rice passionné·e de la région de Saint-Vith	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
parLefUsPQPvgIKscFuPY	Zohra Bartoletti	Zohra_Bartoletti24@example.be	\N	Agriculteur·rice passionné·e de la région de Juprellecentre	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
kDw998LpxYkswGqfBwhVK	Violette Gaillard	Violette.Gaillard80@example.be	\N	Agriculteur·rice passionné·e de la région de Marche-en-Famenne	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
ohWe6fKIBDEBVBmPMlrxP	Madeleine Bauch	Madeleine.Bauch@example.be	\N	Agriculteur·rice passionné·e de la région de Fernelmont	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
2zZNda28L4ZJ8KDFPJBvZ	Levana Powlowski	Levana_Powlowski@example.be	\N	Agriculteur·rice passionné·e de la région de Havelange	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
3Tf6Zl9FLxW2K32Foi7IN	Mayane Adams	Mayane_Adams32@example.be	\N	Agriculteur·rice passionné·e de la région de Libinplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
D8wtot51RwOm5xWlSiNIK	Theophane Kertzmann	Theophane_Kertzmann80@example.be	\N	Agriculteur·rice passionné·e de la région de HannutNord	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
C_ylVwYqpjnkJFCJKXPkE	Ismaïl Tromp	Ismail_Tromp40@example.be	\N	Agriculteur·rice passionné·e de la région de MessancySud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
O60wJSSWwEMg7oOPDOykN	Traci Hilll	Traci_Hilll44@example.be	\N	Agriculteur·rice passionné·e de la région de Soumagne	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
G8SSJTwWK5vhwrjLXPi97	Ephraïm Bradtke	Ephraim.Bradtke@example.be	\N	Agriculteur·rice passionné·e de la région de Chaudfontaine	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
9LYH4KAEavh0Z7bX_012q	Théo Dicki	Theo_Dicki@example.be	\N	Agriculteur·rice passionné·e de la région de GerpinnesSud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
GIJQxS94O41YSHBKKRIgp	Emilie Kessler	Emilie_Kessler57@example.be	\N	Agriculteur·rice passionné·e de la région de Clavier	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	f	f
XyPJvusDvggrs3XJUhQ_9	Kenny Leannon	Kenny_Leannon3@example.be	\N	Agriculteur·rice passionné·e de la région de Gerpinnesplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
hBwrBF00fbzp9MLC-8bBD	Admin User	admin@glean.be	\N	\N	FREE	ADMIN	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
lVbXOcsEkm4f2cvPqNBkk	Kristy Goodwin	Kristy.Goodwin31@example.be	\N	Agriculteur·rice passionné·e de la région de Beyne-HeusaySud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
SVyHqJ5Y2dE1CsnN15ngx	Cyril Blanc	Cyril_Blanc@example.be	\N	Agriculteur·rice passionné·e de la région de Chimay	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
vB9iiQwHG5E2UIGL_A3_2	Tiguida Gislason	Tiguida.Gislason87@example.be	\N	Agriculteur·rice passionné·e de la région de Fosses-la-VilleSud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	f	f
rgVT7JF1blWKZkHHXu5hv	Yse Benoit	Yse.Benoit61@example.be	\N	Agriculteur·rice passionné·e de la région de CharleroiSud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
F0JxUXRuxdUVVlj0sLoF2	Amelia MacGyver	Amelia.MacGyver95@example.be	\N	Agriculteur·rice passionné·e de la région de Vielsalm	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
5saKcxS16EzHbDfZC0Avd	Fode Hodkiewicz	Fode.Hodkiewicz86@example.be	\N	Agriculteur·rice passionné·e de la région de MouscronNord	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
zXPTmsW-T2N3idsEc6fos	Craig Corkery	Craig_Corkery@example.be	\N	Agriculteur·rice passionné·e de la région de Stoumontplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
JC56C2tNSjOHITKlNW8ix	June Kiehn	June.Kiehn@example.be	\N	Agriculteur·rice passionné·e de la région de Wasseiges	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
c9qiER6Tva0mqYJEjFQ4-	Connie Sporer	Connie.Sporer89@example.be	\N	Agriculteur·rice passionné·e de la région de Bouillonplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
Eup65cutord2omDleknSo	Kimberly Henry	Kimberly.Henry@example.be	\N	Agriculteur·rice passionné·e de la région de Durbuy	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
vfResoS5rGXA2JEi2BaeU	Louca David	Louca_David89@example.be	\N	Agriculteur·rice passionné·e de la région de Houffalize	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
px9HOKI_UpBFAfUTlV6Q2	Sally Bahringer	Sally.Bahringer59@example.be	\N	Agriculteur·rice passionné·e de la région de Dinant	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
3g0eBUuFJFI8nj4t0wNn1	Sue Hirthe	Sue_Hirthe@example.be	\N	Agriculteur·rice passionné·e de la région de Villers-la-VilleNord	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
Ezl9RkmBFPOFHKKD-ozIV	Helèna Konopelski	Helena_Konopelski@example.be	\N	Agriculteur·rice passionné·e de la région de Modave	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
kADWqIx_xfv-eaghFqbDC	Jessie Stehr	Jessie_Stehr@example.be	\N	Agriculteur·rice passionné·e de la région de SeneffeSud	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
xqaIMhPePn0LfXF-YKQLh	Otto Dumas	Otto_Dumas@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
kx7a_V0q_vcPJ4KEUOulN	Noa Hauck	Noa.Hauck36@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
50C6aYmQ8rb4J8nAGsf2G	Agnès Gerhold	Agnes_Gerhold16@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
ILUPZhhZW3bZHegBDR2Cu	Eugene Cronin	Eugene_Cronin@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
WvVs9H432Rb7EPLVveQBu	Rahma Medhurst	Rahma.Medhurst@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
svkANm0FmRXwwvrbpPd9p	Nine Wisoky	Nine.Wisoky@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
6M7Jhq31GYGjqhlXnuSlS	Aïssa Russel	Aissa.Russel@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
XjjbKLVjKuDUGQnqbkk9l	Divine Bednar	Divine.Bednar57@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
HoNUiG2AQhcJzcxp1vtJI	Issiaka Jean	Issiaka.Jean@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
CVm0n4hzIWdsDBrDJradD	Clayton Noel	Clayton.Noel@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
yWDQEXEK77u54toG9glVs	Joakim Padberg	Joakim.Padberg14@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
hCTGZ3il5htDkjYnF3wXS	Elise Schmitt	Elise_Schmitt@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
MVar0M4VbKvaTyMGHm5TX	Matteo Hansen	Matteo_Hansen66@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
hEbvLiNvGJFCxlvnn1ajy	Beverly Perrot	Beverly.Perrot@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
eE4mNWW5LeV8ael4lbHxF	Charlie Greenfelder	Charlie_Greenfelder@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
G4kuP6N_ckTd0Rop-VJa-	Anya Hoppe	Anya.Hoppe28@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
9NwU2_sA-mig4BRap4WZs	Bonnie Kub	Bonnie.Kub79@example.be	\N	Agriculteur·rice passionné·e de la région de Saint-Ghislain	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	f	f
gTi7k9rbEHJ6MboiOfLF_	Claude Vidal	Claude.Vidal@example.be	\N	Agriculteur·rice passionné·e de la région de Brugelettecentre	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
hqUr9AznCFGLWEft00-6X	Caleb Schamberger	Caleb_Schamberger47@example.be	\N	Agriculteur·rice passionné·e de la région de Yvoir	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
D5dndkr5njKtW4Ac_tmVm	Rebecca Bailey	Rebecca.Bailey34@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
Vnpa0CWF6tNufHq2B0JEP	Adrien Nitzsche	Adrien_Nitzsche84@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
V3R9xnhUJt5CEK56jPDUU	Mahault Altenwerth	Mahault.Altenwerth@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
fVxGG4jJrK6J8D1T97jAE	Yoël Stark	Yoel.Stark31@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
W2u_mWX7wJprusJBrO6Qy	Noemie Steuber	Noemie.Steuber@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
M7OhCeRXSMm_xlUQrNNQH	Aïcha Hubert	Aicha.Hubert@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
Pxq28Q6QNzB72vY1-EpHc	Wandrille Tremblay	Wandrille.Tremblay73@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
2QgqWIb1dXO1R8IpsQWww	Viola Bins	Viola.Bins@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
FWIZrDngg9Qx2C6LLK0TZ	Carroll Lakin	Carroll_Lakin96@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
rv4tjV1X201rDa7hXOrNc	Antoinette Bernhard	Antoinette_Bernhard@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	f	f
nmzdiwm2gCQChflP80NMh	Nolann Bednar	Nolann_Bednar10@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
NZ_ctN2LDRjRX5gqzIn-h	Irina Harber	Irina_Harber@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
kgaapwTlgtogyJtO0yC-U	Florence Trantow	Florence_Trantow70@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
N7tK6mDid3gPFfGfuphLj	Emir Bailey	Emir.Bailey@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	f	f
VtAK0bUWEuTUYufmNQ2uQ	Mindy Green	Mindy_Green50@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	f	f
BImDoUWp0nYtVR1XBADA1	Michel Greenholt	Michel.Greenholt18@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
o12gDGrqvcIG_AaVqUrCX	Sonia Schaden	Sonia.Schaden36@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
ErlUpv2BuYhqPxW_t-BnY	Meriam Pfeffer	Meriam_Pfeffer@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	f	f
G-CIpmGST2Fn9m5H53Pn6	Lucien Leannon	Lucien.Leannon38@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
FcKuqR_ga5aYHkIemUfD-	Penelope Gerhold	Penelope_Gerhold@example.be	\N	Agriculteur·rice passionné·e de la région de Jurbise	FREE	FARMER	FRENCH	2025-02-22 14:12:41.755	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.755	t	f
-kiPtRC9MnrNrFzVDqsGU	Rami Barton	Rami_Barton@example.be	\N	Agriculteur·rice passionné·e de la région de AndenneNord	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
TwaN7v8EaCLjjs8adJGIQ	Corto Kuhn	Corto_Kuhn@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
68q5ldFY_xCCKOqhO2tQk	Shaun Schultz	Shaun_Schultz98@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
G8j4_ZCyMVq8TZaxUvtFo	Youssef Franecki	Youssef_Franecki@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
_7efse5Y4lOshKF5oF4pZ	Alberta Altenwerth	Alberta_Altenwerth@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
ZUyzKoj-4sITYZmn66MyV	Pierre-Louis Pfannerstill	Pierre-Louis_Pfannerstill@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
Oa2qVBSUXJgYNiT-NN2Iu	Don Goldner	Don_Goldner25@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
7M3Xgz_SkCK_FWuWXv69A	Klara Roussel	Klara_Roussel69@example.be	\N	Agriculteur·rice passionné·e de la région de Manage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
wfmDD0c9hBfJvty4WZwGk	Nada Dupuis	Nada.Dupuis30@example.be	\N	Agriculteur·rice passionné·e de la région de Blégny	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
7lvYzovKiZ5AO6uZl11ws	Thaïs Connelly	Thais_Connelly@example.be	\N	Agriculteur·rice passionné·e de la région de Court-Saint-Etienneplage	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
qpOxI3xxaWghTx_AhHJFf	Aden Collins	Aden.Collins82@example.be	\N	Agriculteur·rice passionné·e de la région de Lontzencentre	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
P72hU5H8q9cZ7f1ghTHbL	Karine Langworth	Karine_Langworth@example.be	\N	Agriculteur·rice passionné·e de la région de Gouvy	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
z7uypMyywv3hDHgKVVldC	Russell Medhurst	Russell_Medhurst25@example.be	\N	Agriculteur·rice passionné·e de la région de Saint-Ghislain	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
McpoM6XXIPKDUId8yw-GL	Bastian Rodriguez	Bastian.Rodriguez51@example.be	\N	Agriculteur·rice passionné·e de la région de Fernelmont	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
uJBicvPDE47w6xZK6LH-d	Léopold Schaefer	Leopold.Schaefer43@example.be	\N	Agriculteur·rice passionné·e de la région de Hastièrecentre	FREE	FARMER	FRENCH	2025-02-22 14:12:41.756	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.756	t	f
TRC71SAKv_J3g_OLcaR81	Gauthier Lakin	Gauthier.Lakin@example.be	\N	Agriculteur·rice passionné·e de la région de Mettet	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
lgm9bh82Tr9B74r7Dx8AS	Ayaan Rohan	Ayaan_Rohan@example.be	\N	Agriculteur·rice passionné·e de la région de Le Roeulxcentre	FREE	FARMER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
O4aJ-sLLtRhC1gk5aOx8a	Rogelio Kris	Rogelio_Kris33@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	f	f
bdjT6dtbumKCFGpF8xKCz	Pat Ward	Pat_Ward@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	f	f
qB9sSTyr1VEcIpWOfVvmE	Eli MacGyver	Eli.MacGyver84@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
SgxumAVx13SBTjv0d5tj7	Sabrina Hills	Sabrina.Hills95@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	f	f
6tAud8OtyM-8ik06LVaIY	Nawel Zemlak	Nawel.Zemlak60@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
Y5S58eZPGtw_6sC7_WftG	Cyprien Aubry	Cyprien.Aubry@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
0ixnSDCfRSqCEyjspqFfG	Harry Emmerich	Harry.Emmerich@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
taknNHxsb9gYMyf3hMBlE	Eytan Dupuy	Eytan.Dupuy12@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.757	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.757	t	f
GDNiqcy5j67FHEG6jSaR2	Leny Jenkins	Leny_Jenkins@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
5ZsdOQRTuO0d9X5EyuXI7	César White	Cesar_White67@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
RMC8eL7WJqBWqTMNPNJ0M	Eunice Bashirian	Eunice_Bashirian13@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	f	f
pGYhcMFCFLkC4zhe_PJWQ	Mai Strosin	Mai.Strosin92@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
bgcNiV1FK70eotHEVXTeG	Avril Raynor	Avril.Raynor@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
da4m6AGKw1WY5L68yhaXJ	Maelle Lehner	Maelle.Lehner@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
8WPa-GF3tVDwE42Ve7zLg	Souleyman Marty	Souleyman.Marty@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	f	f
nRoy8jXSGQuIyMMJCnSNf	Eddy Menard	Eddy_Menard@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
YTDvLZ3zpIPxyf7NWbig-	Maëlle Rippin	Maelle_Rippin@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
ra7m_5dtZZ0fIXz2wYUwS	Meriem Greenholt	Meriem.Greenholt13@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
5BKwWWao8FbqQ0TqEaaTx	Casey Fritsch	Casey.Fritsch92@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
ZcTt5h_MdndtHtmFxIfxR	Julio Petit	Julio_Petit21@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
td-mNc-efjT5ef4L84gdT	Lounis McClure	Lounis.McClure9@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
G68D-oGzsmHx-UKs7zfbc	Kawtar Rolfson	Kawtar.Rolfson@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
Q_DrzN5SotwsTRtHfxLpc	Kelli Dumas	Kelli_Dumas@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
kt1ydP3QW8UxdSlbAryTr	Hafsa McLaughlin	Hafsa.McLaughlin@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
H9mgMEsnXG8WR65ZYemRV	Tessa Mann	Tessa_Mann76@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
dynp8GvU7NLNlEzTlFwRE	Vladimir Kertzmann	Vladimir.Kertzmann2@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
MolqmNWVa06zm-Io5X_AL	Jared Altenwerth	Jared.Altenwerth85@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
-IMaZyj9yDW7KJmrtsnR_	Wissem Block	Wissem.Block73@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
MnoyNuzPIA932-N7FVVu9	Darin Hubert	Darin.Hubert@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
XBIUrzPwMaB--z4fp4Q_Y	Izia Towne	Izia.Towne52@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
hBWjYB97bi-PTiXh6V5lL	Kenan Stoltenberg	Kenan.Stoltenberg7@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	f	f
EfSXJZLX_jwTzh4MI9q76	Ilyane Dumont	Ilyane.Dumont@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
edIBp-z6GbU6qMrFyP-on	Darine Stanton	Darine_Stanton@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
ynfjsfccIOGfleSPiodgL	Siméon Aubry	Simeon.Aubry66@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	f	f
x-zByfzhKyJj31DwjAvV7	Islam Morel	Islam.Morel@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
YQX8fsqvf-jQttEgWodPl	Domingo Predovic	Domingo_Predovic@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
7eSbGUXbGwrL5mz1Q2HW5	Taïs Orn	Tais.Orn@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
xWBJ_Lk4-5xl_S95ch4DN	Lela Mueller	Lela.Mueller@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	f	f
HW1Y8VMUa8x6Rq-lyICAu	Luka Guillaume	Luka.Guillaume@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
uo5LsCc99Vak-gUkgIzfX	Abdellah Dickinson	Abdellah_Dickinson@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
iuxebV8O0B3-dJthQ-rD2	Vincent Quigley	Vincent.Quigley87@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
vH-zqVd_1gwnMxgoi9TcN	Shanon David	Shanon.David3@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
H8GOQDSpJmLwUI-Xd3Ac8	Hakim Littel	Hakim.Littel@example.be	\N	Membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
010kfQ2xnGsgQEP4d6Qpq	Wendell Ledner	Wendell_Ledner60@example.be	\N	À la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
is2ySgVuj4Gt_ae787YZU	Emilio Jakubowski	Emilio_Jakubowski@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
Ex4nSdiMXZ0pxRkSveWu4	Laetitia Wehner	Laetitia.Wehner@example.be	\N	Engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	f	f
UsselAyV86fZ-aWUvdGbZ	Gina Kihn	Gina.Kihn@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.758	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.758	t	f
FtEuhCz-sqPoB72tJwOXj	Wade Robel	Wade.Robel@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	f	f
y1Hx4GXVmNiq1OxpUKFxa	Yanni Bartoletti	Yanni_Bartoletti@example.be	\N	Passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-02-22 14:12:41.759	\N	\N	$2b$10$4b4012qSqTWyqg1h0HKEJ.q6jfoHW.tpwVl7gYWxpGosseKHBSmL2	\N	\N	2025-02-22 14:12:41.759	t	f
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
-- Name: announcement_gleaning_periods_announcement_id_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX announcement_gleaning_periods_announcement_id_idx ON public.announcement_gleaning_periods USING btree (announcement_id);


--
-- Name: announcement_gleaning_periods_gleaning_period_id_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX announcement_gleaning_periods_gleaning_period_id_idx ON public.announcement_gleaning_periods USING btree (gleaning_period_id);


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
-- Name: farms_city_postal_code_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX farms_city_postal_code_idx ON public.farms USING btree (city, postal_code);


--
-- Name: farms_slug_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX farms_slug_idx ON public.farms USING btree (slug);


--
-- Name: farms_slug_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX farms_slug_key ON public.farms USING btree (slug);


--
-- Name: fields_latitude_longitude_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX fields_latitude_longitude_idx ON public.fields USING btree (latitude, longitude);


--
-- Name: fields_slug_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX fields_slug_idx ON public.fields USING btree (slug);


--
-- Name: fields_slug_key; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE UNIQUE INDEX fields_slug_key ON public.fields USING btree (slug);


--
-- Name: gleaning_participations_gleaning_id_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX gleaning_participations_gleaning_id_idx ON public.gleaning_participations USING btree (gleaning_id);


--
-- Name: gleaning_participations_participation_id_idx; Type: INDEX; Schema: public; Owner: Field4u_owner
--

CREATE INDEX gleaning_participations_participation_id_idx ON public.gleaning_participations USING btree (participation_id);


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
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


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
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

