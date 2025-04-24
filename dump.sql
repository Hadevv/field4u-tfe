--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
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
-- Name: public; Type: SCHEMA; Schema: -; Owner: field4u_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO field4u_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: field4u_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: CropCategory; Type: TYPE; Schema: public; Owner: field4u_owner
--

CREATE TYPE public."CropCategory" AS ENUM (
    'VEGETABLE',
    'FRUIT'
);


ALTER TYPE public."CropCategory" OWNER TO field4u_owner;

--
-- Name: CropSeason; Type: TYPE; Schema: public; Owner: field4u_owner
--

CREATE TYPE public."CropSeason" AS ENUM (
    'SPRING',
    'SUMMER',
    'FALL',
    'WINTER',
    'YEAR_ROUND'
);


ALTER TYPE public."CropSeason" OWNER TO field4u_owner;

--
-- Name: GleaningStatus; Type: TYPE; Schema: public; Owner: field4u_owner
--

CREATE TYPE public."GleaningStatus" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."GleaningStatus" OWNER TO field4u_owner;

--
-- Name: Language; Type: TYPE; Schema: public; Owner: field4u_owner
--

CREATE TYPE public."Language" AS ENUM (
    'ENGLISH',
    'FRENCH',
    'DUTCH'
);


ALTER TYPE public."Language" OWNER TO field4u_owner;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: field4u_owner
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


ALTER TYPE public."NotificationType" OWNER TO field4u_owner;

--
-- Name: UserPlan; Type: TYPE; Schema: public; Owner: field4u_owner
--

CREATE TYPE public."UserPlan" AS ENUM (
    'FREE',
    'PREMIUM'
);


ALTER TYPE public."UserPlan" OWNER TO field4u_owner;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: field4u_owner
--

CREATE TYPE public."UserRole" AS ENUM (
    'FARMER',
    'GLEANER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO field4u_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: field4u_owner
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


ALTER TABLE public._prisma_migrations OWNER TO field4u_owner;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: field4u_owner
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


ALTER TABLE public.accounts OWNER TO field4u_owner;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.announcements (
    id character(21) NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(100) NOT NULL,
    description character varying(2000) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    crop_type_id character(21) NOT NULL,
    field_id character(21) NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    owner_id character(21) NOT NULL,
    quantity_available integer,
    updated_at timestamp(3) without time zone NOT NULL,
    images character varying(255)[] DEFAULT ARRAY[]::text[],
    qr_code_url character varying(255),
    end_date timestamp(3) without time zone,
    start_date timestamp(3) without time zone,
    CONSTRAINT quantity_non_negative CHECK ((quantity_available >= 0))
);


ALTER TABLE public.announcements OWNER TO field4u_owner;

--
-- Name: crop_types; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.crop_types (
    id character(21) NOT NULL,
    name character varying(100) NOT NULL,
    season public."CropSeason" NOT NULL,
    category public."CropCategory" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.crop_types OWNER TO field4u_owner;

--
-- Name: farms; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.farms (
    id character(21) NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(100) NOT NULL,
    description character varying(500),
    city character varying(100),
    postal_code character varying(10),
    contact_info character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    owner_id character(21) NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    latitude double precision,
    longitude double precision
);


ALTER TABLE public.farms OWNER TO field4u_owner;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.favorites (
    id character(21) NOT NULL,
    announcement_id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.favorites OWNER TO field4u_owner;

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.feedbacks (
    id character(21) NOT NULL,
    message character varying(1000) NOT NULL,
    email character varying(254),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21)
);


ALTER TABLE public.feedbacks OWNER TO field4u_owner;

--
-- Name: fields; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.fields (
    id character(21) NOT NULL,
    name character varying(100),
    city character varying(100) NOT NULL,
    postal_code character varying(10) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    farm_id character(21),
    owner_id character(21),
    updated_at timestamp(3) without time zone NOT NULL,
    surface double precision,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    CONSTRAINT ownership_check CHECK ((((farm_id IS NOT NULL) AND (owner_id IS NULL)) OR ((farm_id IS NULL) AND (owner_id IS NOT NULL))))
);


ALTER TABLE public.fields OWNER TO field4u_owner;

--
-- Name: gleanings; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.gleanings (
    id character(21) NOT NULL,
    announcement_id character(21) NOT NULL,
    status public."GleaningStatus" DEFAULT 'NOT_STARTED'::public."GleaningStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.gleanings OWNER TO field4u_owner;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.likes (
    id character(21) NOT NULL,
    announcement_id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.likes OWNER TO field4u_owner;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.notifications (
    id character(21) NOT NULL,
    type public."NotificationType" NOT NULL,
    message character varying(255) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21) NOT NULL
);


ALTER TABLE public.notifications OWNER TO field4u_owner;

--
-- Name: participations; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.participations (
    id character(21) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id character(21) NOT NULL,
    gleaning_id character(21) NOT NULL
);


ALTER TABLE public.participations OWNER TO field4u_owner;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.reviews (
    id character(21) NOT NULL,
    rating smallint NOT NULL,
    content character varying(500),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gleaning_id character(21) NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id character(21) NOT NULL,
    images character varying(255)[] DEFAULT ARRAY[]::text[],
    CONSTRAINT rating_range CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO field4u_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.sessions (
    id character(21) NOT NULL,
    session_token text NOT NULL,
    user_id character(21) NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessions OWNER TO field4u_owner;

--
-- Name: statistics; Type: TABLE; Schema: public; Owner: field4u_owner
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


ALTER TABLE public.statistics OWNER TO field4u_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: field4u_owner
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
    onboarding_completed boolean DEFAULT false NOT NULL,
    accept_geolocation boolean DEFAULT false NOT NULL,
    city character varying(50),
    postal_code character varying(10),
    rules_accepted_at timestamp(3) without time zone,
    terms_accepted_at timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO field4u_owner;

--
-- Name: verificationtokens; Type: TABLE; Schema: public; Owner: field4u_owner
--

CREATE TABLE public.verificationtokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verificationtokens OWNER TO field4u_owner;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
24245c18-6fd1-4f43-a4b3-c6221e42119c	eab72b484569e09d0e53ef34f2c54832ea0f524e079eab3cf19e6ff01fdc2ec2	2025-04-12 12:52:28.476776+00	20250325135745_make_city_postalcode_optional	\N	\N	2025-04-12 12:52:28.375139+00	1
5e6c45b3-82b7-47fa-937e-ba8ec185e8e7	260d96aa75e4c54be2ff6a0b736d96e33dc6c2e206c3d262d264cd099019120b	2025-04-12 12:52:26.08135+00	20250109202716_init_field4u_db	\N	\N	2025-04-12 12:52:25.86478+00	1
a07180db-118a-44ae-b8eb-c64262ede941	70f7d302d28eb9f997b50f7e7449cd424663ac2a622e82a155e26bd3d8edd562	2025-04-12 12:52:26.302292+00	20250204095520_db_normalization_update	\N	\N	2025-04-12 12:52:26.124795+00	1
1c4da35b-775d-4ac0-8dfb-1bc2a0f2c9e3	149657631abfba6735851044b80d5b0c9e683b12ecdc585dca0ea7f903a39eca	2025-04-12 12:52:26.44998+00	20250204124608_remove_password_unique	\N	\N	2025-04-12 12:52:26.344379+00	1
77cd4d6c-bcf1-4270-90c5-09639f6bc5cd	734df3ec37acdcb3899648970893cb27f6c7a5e70cdb06ef9a4ca7762a2a6028	2025-04-12 12:52:28.634455+00	20250410094728_update_slug_fields_to_use_titles	\N	\N	2025-04-12 12:52:28.517764+00	1
dc3af48a-96cf-4fdd-acb0-3ae8fdf2d06f	4f3031223547b2c9da53b8584c427e3d24f850e5653279a23e3973fda1451428	2025-04-12 12:52:26.594992+00	20250208211635_image_field_addition	\N	\N	2025-04-12 12:52:26.490741+00	1
60877272-c0b1-44a6-bfd8-e519a621d3aa	15877006e4b4052a7229567fc1943b8e551d4f40262f948a5e0485232ed54a23	2025-04-12 12:52:26.858719+00	20250220195930_optimize_column_types	\N	\N	2025-04-12 12:52:26.637194+00	1
e3c375af-3134-4c76-85db-f0394ee415d8	9d0c8fd273c5017032beeb4896e4828630e663fd447a672a84f7f725b4102f3d	2025-04-12 12:52:27.010272+00	20250220201051_add_check_constraints	\N	\N	2025-04-12 12:52:26.899548+00	1
0d001340-739c-48b4-b031-c4987407ecdc	479e7e58e06f56b8a3180d0092147e1c43de1cdabaa09a6ca5e2ae6ee5e92415	2025-04-12 12:52:28.783199+00	20250412124234_update_gleaning_status_and_remove_participation_status	\N	\N	2025-04-12 12:52:28.675019+00	1
fc562ca2-a9e1-4f7a-bef7-d40c00c38605	571a292ce3d6a0327e940cdad7c6df131861121d1cc7558c336fc06cfc4187cd	2025-04-12 12:52:27.154734+00	20250221225607_add_gleaning_cancelled	\N	\N	2025-04-12 12:52:27.050214+00	1
cc406e61-ae85-4a58-adf1-2c314fd7088c	080b1d2c62577e7b2d9d5e18c3897aa8dd9014fbdad740a5a52eaee46e63b06a	2025-04-12 12:52:27.297982+00	20250222204811_update_onboarding_completed_mapping	\N	\N	2025-04-12 12:52:27.195482+00	1
e26f0935-6331-4142-a00f-117c7f12531e	16feb7ab2dd9db4ce9300ff1968f7edea1080335c3036aaca688d146f443e563	2025-04-12 12:52:27.896221+00	20250318094133_cleanup_and_add_postgis	\N	\N	2025-04-12 12:52:27.338791+00	1
fa49d7d9-7f52-4c4e-9744-3a8879a3abda	9ad9a6447935d129c9a0b9928cb725f7cdf41bb9d2a04a9e568468b9459a17fd	2025-04-12 14:30:32.83089+00	20250412143032_remove_periode_gleaning_from_field	\N	\N	2025-04-12 14:30:32.650845+00	1
9f3eb47c-e91b-400b-89e6-fa5fc529cd03	f4f38d215407862e0f853d574e0de2b4efd8199a8f7162fae5dd26601bedb1f0	2025-04-12 12:52:28.040737+00	20250318125819_add_postgis_extension	\N	\N	2025-04-12 12:52:27.937573+00	1
f5c44d04-b58a-4fa0-9bd4-18a17b8fc87e	5aa2b8955c41a27fd32f12d5438a2dfe574ca2cd7f624dc08237420e4c279283	2025-04-12 12:52:28.190905+00	20250320142042_remove_postgis_unsupported	\N	\N	2025-04-12 12:52:28.082168+00	1
df476ba4-b88a-4cbf-b60c-eeea63060990	f79091dde954830a60ee1060438cb957e92b28b563dce3b42efd0c7705d058a9	2025-04-12 12:52:28.334974+00	20250325105957_add_terms_geolocation_rules_city_postalcode	\N	\N	2025-04-12 12:52:28.232363+00	1
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", "refreshTokenExpiresIn", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
shjUPeKUMCwKAMddAGCIj	jInZEbVLlz3JJC0j-3wod	oauth	github	91534880	\N	\N	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	\N	bearer	read:user,user:email	\N	\N
wyz1O7PhOThCNJp4oYWi7	jInZEbVLlz3JJC0j-3wod	oidc	google	108933391095075972059	\N	\N	ya29.a0AZYkNZiiYgkjAyJ-6hJ0BlXddLCj8OAx4XeH_14MoRfufoLLkgC-VI7LJ707k7qqqgaU8I1-eJptfyv6DuRtHclsLVGNrWxOmHf23uA2Rus6lUlkmeMKkZrCD4kX7MogbDeQVhxVemSVX6zPz-3Rr8d1_fRbxtc6GrZeAudGeVcaCgYKAaASARISFQHGX2Miu-iO3RDQt22JCg7po8K1Ww0178	1744662174	bearer	https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile	eyJhbGciOiJSUzI1NiIsImtpZCI6ImM3ZTA0NDY1NjQ5ZmZhNjA2NTU3NjUwYzdlNjVmMGE4N2FlMDBmZTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTc1OTUwMDMxOTgtZTFpNXFsdDNlbHRwdDcwYWc3c2pnOWNzdWFka2toYWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTc1OTUwMDMxOTgtZTFpNXFsdDNlbHRwdDcwYWc3c2pnOWNzdWFka2toYWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5MzMzOTEwOTUwNzU5NzIwNTkiLCJlbWFpbCI6ImFkZW1ldXJlMjlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJWRGtjaExIS3kwV01ITzB4YVgxdFRnIiwibmFtZSI6IkFudG9pbmUgRGVtZXVyZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJMVFtbVRfVmg2RXZCUDJOcjRfMy1mR0M3SnpMd3lSV1NnejJQOEVMQTctdmw0cWc9czk2LWMiLCJnaXZlbl9uYW1lIjoiQW50b2luZSIsImZhbWlseV9uYW1lIjoiRGVtZXVyZSIsImlhdCI6MTc0NDY1ODU3NSwiZXhwIjoxNzQ0NjYyMTc1fQ.ULG57gDYOxWq4gj8TCHf0AsmwoImLQInFevtOgqRVwz4I4BAPVIPM0NX5cRrdKEHiQbL7sZLgdRa1rWQG7DZr9jGK3LjWqCGlWWChNKVFIDremduUpVe_1_RrnHvLiwdLj3LlI21zZiijrefVDn3GnU4SUwtXaFD2caeuTCfytp9V8fH2oV70MfzdTmMZW-bBzQkDiBJZsOrITcz9RulR-1pIoxzSAifyn1bfd7NLDc5PJkc_LMq75jBLhIyN9s4AQCK8mqH8gi_e81DCJxMS_uC_ZPfL8PQAIY8LcnP4EK9D7Y9d3l1xd0wywspl6FwhCKD2oYiNGbLtsrxDpjceg	\N
WGHHs9OMmY8NpqyBwcak5	0li55hX02UbQ57rBGG9WH	credentials	credentials	0li55hX02UbQ57rBGG9WH	\N	\N	\N	\N	\N	\N	\N	\N
9ADXWwNyCpLUSGHiwT8nf	-Isst8wgpee6oZtXGNX9l	credentials	credentials	-Isst8wgpee6oZtXGNX9l	\N	\N	\N	\N	\N	\N	\N	\N
J55XIMDI4gsS0mje-Lykg	RBsNUdyISMH0Ce17M40Ak	credentials	credentials	RBsNUdyISMH0Ce17M40Ak	\N	\N	\N	\N	\N	\N	\N	\N
g0c8cgrHWAR_ZOmm3bY86	r84Bjxp2mvsBNjFrp7CIe	credentials	credentials	r84Bjxp2mvsBNjFrp7CIe	\N	\N	\N	\N	\N	\N	\N	\N
2_CnX4lGFh4lFwRf19dkZ	jInZEbVLlz3JJC0j-3wod	email	resend	ademeure29@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N
sWy86uhYeyS-nFaaIWyZa	FTV1zsy-89HQQB7F92a_a	email	resend	admin@glean.be	\N	\N	\N	\N	\N	\N	\N	\N
8XfNS6tJMkH7e_SPaGeaF	8CT4TnF2gofBALff2GU_h	credentials	credentials	8CT4TnF2gofBALff2GU_h	\N	\N	\N	\N	\N	\N	\N	\N
uL5M4AK6aDcI-Yx6vcKag	CGvKZKzZWDSNs6uNh2QQd	oidc	google	109936981117472759162	\N	\N	ya29.a0AZYkNZhFeHs8HOXhM_3_5HZeJR5UgfwvdNJHhoV8mRn8HzMoIuCDYccFEn80Q3NuhY2YnzMq6WnjYbzAw8kf7RXiQ_bN18hRKno0ByyyjJtaTSD5nMvAL-k_hO3aZ4kvT0iYsUYOtN7aK5OkLllGs0-E8OnK2oS2uBYtdTj_lQgaCgYKAVcSARYSFQHGX2MiLpwpEVvqTV3RYgSj4hQ1qw0178	1745423376	bearer	https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid	eyJhbGciOiJSUzI1NiIsImtpZCI6IjIzZjdhMzU4Mzc5NmY5NzEyOWU1NDE4ZjliMjEzNmZjYzBhOTY0NjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTc1OTUwMDMxOTgtZTFpNXFsdDNlbHRwdDcwYWc3c2pnOWNzdWFka2toYWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTc1OTUwMDMxOTgtZTFpNXFsdDNlbHRwdDcwYWc3c2pnOWNzdWFka2toYWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk5MzY5ODExMTc0NzI3NTkxNjIiLCJlbWFpbCI6ImJ5ZWJ5dXJhemFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJPZy1TXzM0aEFjb282amFRQnhueld3IiwibmFtZSI6IkJ5VXJhemEgQnllIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pjUEo4TkRGWFpTOXZqbXZfT1JQdDlWRmZrWEZvMVhMeHNldWxPX1lZUllKemRFdz1zOTYtYyIsImdpdmVuX25hbWUiOiJCeVVyYXphIiwiZmFtaWx5X25hbWUiOiJCeWUiLCJpYXQiOjE3NDU0MTk3NzksImV4cCI6MTc0NTQyMzM3OX0.LS-tbDob0GQBBonHpX2nAoey_0nag1udEwH2xGICQieCchXJWWskKz5sjNW6Jxx0Ujwa-HxRKP_8O7K5eL6BbfpDpsun1QZvHqZhEOGUzrZ1tkn8QArHVla4UNuHRYKwWD4IuKiCfCBnYkpUPjYKUekUnJY51NqFon6_e-8_GOjpyLJP34RYxfFUM8QaYYU-WG0GOwXerVw2JFKqfhgKPGc8S0ztfwgc6XPN7olsG-Y1xE8mW7rDh9ksbob1mmMAWyDrGalV83ZjiVKhluS6bnlEJboVB_Ep9d6f98DKaZ3Ohkp35Ew8ERGgOaTVysFEQDW_cPHb8E5LHmoYUzMLNQ	\N
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.announcements (id, title, slug, description, created_at, crop_type_id, field_id, is_published, owner_id, quantity_available, updated_at, images, qr_code_url, end_date, start_date) FROM stdin;
Lu-DJdawkjRB2BC3P5Fi6	Glanage de Courgettes à Arlon	glanage-de-courgettes-a-arlon-a5c1b7	493 kg de Courgettes de bonne qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.356	0mWi_qYZ6S0tFOzwN8Htk	oHe1k4OPq0n2IfdZ2OwI4	t	uAY0QPhcaukvovPdqKyvY	365	2025-04-12 14:50:37.356	{}	\N	2025-04-24 18:24:56.145	2025-04-21 18:24:56.145
t2OIph_jPE1gEx1yx4tN6	Récolte solidaire de Carottes à Saint-Trond	recolte-solidaire-de-carottes-a-saint-trond-9a2c35	339 kg de Carottes de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.425	SHORSyP7VEKfzq3RCa7tB	oHe1k4OPq0n2IfdZ2OwI4	t	uAY0QPhcaukvovPdqKyvY	111	2025-04-12 14:50:37.425	{}	\N	2025-04-25 09:35:31.191	2025-04-24 09:35:31.191
AgQzbzTYDqQlwkgw9rpLW	Récolte anti-gaspi de Courgettes à Genk	recolte-anti-gaspi-de-courgettes-a-genk-eb3cac	217 kg de Courgettes de satisfaisante qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.472	0mWi_qYZ6S0tFOzwN8Htk	sFLESrhAu_EZgZ5KAqWYN	t	uAY0QPhcaukvovPdqKyvY	424	2025-04-12 14:50:37.472	{}	\N	2025-05-16 21:48:33.736	2025-05-15 21:48:33.736
m6k0-cdG8a4S9BU9pTem7	Récolte anti-gaspi de Rhubarbe à Eupen	recolte-anti-gaspi-de-rhubarbe-a-eupen-892f59	306 kg de Rhubarbe de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.516	ILl3PoVoA8oFtUGT-n1Us	sFLESrhAu_EZgZ5KAqWYN	t	uAY0QPhcaukvovPdqKyvY	388	2025-04-12 14:50:37.516	{}	\N	2025-03-21 05:10:52.576	2025-03-19 05:10:52.576
593TH-YvT1IEIUlv8Av0-	Ramassage participatif de Asperges à Courtrai	ramassage-participatif-de-asperges-a-courtrai-22ce93	152 kg de Asperges de excellente qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.56	77Kwj1yC3VeYR72lN3-o2	xvtOBYyWBPoEN9K_433Yi	t	uAY0QPhcaukvovPdqKyvY	281	2025-04-12 14:50:37.56	{}	\N	2025-03-21 17:11:20.725	2025-03-17 17:11:20.725
ZZmBO1NemY6n27xKeLx5h	Récolte solidaire de Prunes à Ypres	recolte-solidaire-de-prunes-a-ypres-5d870d	457 kg de Prunes de satisfaisante qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.605	5Oou_kyoDdim1JyW8B8Q_	xvtOBYyWBPoEN9K_433Yi	t	uAY0QPhcaukvovPdqKyvY	486	2025-04-12 14:50:37.605	{}	\N	2025-06-10 13:23:57.194	2025-06-08 13:23:57.194
eBddg-f7UKBOlfIlNrXAQ	Récolte solidaire de Tomates à Arlon	recolte-solidaire-de-tomates-a-arlon-102d76	427 kg de Tomates de satisfaisante qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.649	wnpZJ-peX7W1yFvpA-c54	POWl8Avqv9PruZX10--ei	t	wJudEuLCaw0RY2TvgexG8	272	2025-04-12 14:50:37.649	{}	\N	2025-06-24 13:45:38.808	2025-06-18 13:45:38.808
836uzBS5yUDlTSzneBM3k	Récolte solidaire de Rhubarbe à Ostende	recolte-solidaire-de-rhubarbe-a-ostende-2af860	143 kg de Rhubarbe de bio qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.695	ILl3PoVoA8oFtUGT-n1Us	8C6-wpj_Tu7QzEec969WT	f	wJudEuLCaw0RY2TvgexG8	368	2025-04-12 14:50:37.695	{}	\N	2025-06-29 19:50:24.956	2025-06-19 19:50:24.956
SA3UQrYL-kkTy2Hn7QTXt	Cueillette de Prunes à Chimay	cueillette-de-prunes-a-chimay-94b9fd	82 kg de Prunes de satisfaisante qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.74	5Oou_kyoDdim1JyW8B8Q_	hSb0NNT6dA5jL94X5Kyb7	t	wJudEuLCaw0RY2TvgexG8	216	2025-04-12 14:50:37.74	{}	\N	2025-05-29 15:06:21.816	2025-05-27 15:06:21.816
xV-GX31bRUoAYBI_yHBJG	Récolte solidaire de Potirons à Chimay	recolte-solidaire-de-potirons-a-chimay-c596a0	337 kg de Potirons de bonne qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.785	yzYFrc_RK7n47b7luuf9d	hSb0NNT6dA5jL94X5Kyb7	t	wJudEuLCaw0RY2TvgexG8	186	2025-04-12 14:50:37.785	{}	\N	2025-07-07 17:07:33.768	2025-07-03 17:07:33.768
ZsXZvXjDkQ6dfy8J8pOvM	Ramassage participatif de Cerises à Silly	ramassage-participatif-de-cerises-a-silly-cf247a	144 kg de Cerises de non traitée qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.83	oCakglg-rv_6Tgqq1SH6B	b16vtZpm8KfElPbIfudm7	t	adVuTpEep2u30gLn5c35x	281	2025-04-12 14:50:37.83	{}	\N	2025-03-23 14:49:17.358	2025-03-19 14:49:17.358
WkgNP-aGoyggpCJb-Lsh_	Récolte solidaire de Tomates à Gand	recolte-solidaire-de-tomates-a-gand-fe2d95	104 kg de Tomates de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.875	wnpZJ-peX7W1yFvpA-c54	b16vtZpm8KfElPbIfudm7	t	adVuTpEep2u30gLn5c35x	128	2025-04-12 14:50:37.875	{}	\N	2025-05-22 07:05:09.065	2025-05-15 07:05:09.065
lC13n180G25luBWssT10w	Récolte anti-gaspi de Céleris à Couvin	recolte-anti-gaspi-de-celeris-a-couvin-b8f8c8	417 kg de Céleris de bonne qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.92	3_oOFeItt1UXHdSMmZjH6	3g97_uUpNTrij4_CMPDCs	t	adVuTpEep2u30gLn5c35x	133	2025-04-12 14:50:37.92	{}	\N	2025-04-24 02:05:30.544	2025-04-15 02:05:30.544
sgms5Mqayn9-TSiIHMjrW	Récolte solidaire de Noix à Alost	recolte-solidaire-de-noix-a-alost-8cd620	365 kg de Noix de non traitée qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:37.963	fpPDu1uQp47qE8hgXhVH1	2BNDij3on8gVDX-Us9vig	t	adVuTpEep2u30gLn5c35x	221	2025-04-12 14:50:37.963	{}	\N	2025-04-02 04:13:20.707	2025-03-29 05:13:20.707
-QjJcna60mmqjtvXuJ0Pa	Récolte solidaire de Choux de Bruxelles à Turnhout	recolte-solidaire-de-choux-de-bruxelles-a-turnhout-6ce138	426 kg de Choux de Bruxelles de satisfaisante qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.007	1JfPk-lG5646wXi1SNleK	wTjPYFCA2j6xivU6K1sfQ	t	adVuTpEep2u30gLn5c35x	128	2025-04-12 14:50:38.007	{}	\N	2025-06-09 15:13:12.441	2025-06-01 15:13:12.441
LjPDpNxT4sXvJHkWn8Rt_	Récolte anti-gaspi de Potirons à Ciney	recolte-anti-gaspi-de-potirons-a-ciney-6ab516	281 kg de Potirons de bonne qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.053	yzYFrc_RK7n47b7luuf9d	wTjPYFCA2j6xivU6K1sfQ	t	adVuTpEep2u30gLn5c35x	210	2025-04-12 14:50:38.053	{}	\N	2025-05-04 16:50:37.512	2025-04-26 16:50:37.512
hpCO_WzCbnfohAfzR-4kj	Récolte solidaire de Cassis à Ciney	recolte-solidaire-de-cassis-a-ciney-d5b2ef	395 kg de Cassis de bonne qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.097	suFyEBMZV8WdlVpcg9h9V	1thcqPqw6aIbnQAhWuXtH	t	dfVRDm9ISI4zTpCXjwSso	366	2025-04-12 14:50:38.097	{}	\N	2025-05-08 19:15:08.231	2025-05-04 19:15:08.231
n6sUvfV9UTR4-IRMZdvrl	Récolte anti-gaspi de Courgettes à Genk	recolte-anti-gaspi-de-courgettes-a-genk-8563ff	463 kg de Courgettes de satisfaisante qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.143	0mWi_qYZ6S0tFOzwN8Htk	1thcqPqw6aIbnQAhWuXtH	t	dfVRDm9ISI4zTpCXjwSso	312	2025-04-12 14:50:38.143	{}	\N	2025-06-18 12:32:07.886	2025-06-10 12:32:07.886
PKi9tQNJq30PXQCen9WG_	Ramassage participatif de Courges à Saint-Nicolas	ramassage-participatif-de-courges-a-saint-nicolas-9a43bd	225 kg de Courges de non traitée qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.186	Qq5bGdkSxD8lDzes3T7VZ	hOOj3R04IQTFy2qE2rYWe	t	dfVRDm9ISI4zTpCXjwSso	119	2025-04-12 14:50:38.186	{}	\N	2025-03-26 13:59:40.51	2025-03-21 13:59:40.51
zRDkgZiOHFFRBykHBtMGE	Cueillette de Endives à Wezembeek-Oppem	cueillette-de-endives-a-wezembeek-oppem-1fce65	329 kg de Endives de bonne qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.23	dTN0gkYdDfAYcw8KGsg_K	PzyOLGVdzRdqnoBSowZww	t	dfVRDm9ISI4zTpCXjwSso	469	2025-04-12 14:50:38.23	{}	\N	2025-07-21 13:12:14.143	2025-07-11 13:12:14.143
_Fw3OAAU-JoAVu8LUXKym	Cueillette de Poireaux à Coxyde	cueillette-de-poireaux-a-coxyde-7432f9	104 kg de Poireaux de excellente qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.274	B1aubdY8KWr4K7Avu_RyF	PzyOLGVdzRdqnoBSowZww	t	dfVRDm9ISI4zTpCXjwSso	209	2025-04-12 14:50:38.274	{}	\N	2025-06-27 06:29:36.905	2025-06-24 06:29:36.905
X9qozYxZEOaSZ9_I-GJfB	Cueillette de Raisins à Gembloux	cueillette-de-raisins-a-gembloux-8db14a	343 kg de Raisins de satisfaisante qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.318	HokuM3phCWU_CTFbSy-Ei	KgpU_VIvrO-kC87ulRIa3	t	-Isst8wgpee6oZtXGNX9l	454	2025-04-12 14:50:38.318	{}	\N	2025-05-16 07:55:10.869	2025-05-15 07:55:10.869
4d2QBIX32HQEfNG4PlcOp	Ramassage participatif de Asperges à Liège	ramassage-participatif-de-asperges-a-liege-4d9564	194 kg de Asperges de non traitée qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.363	77Kwj1yC3VeYR72lN3-o2	k9oYcj9E5CC0BtG-qG_me	t	-Isst8wgpee6oZtXGNX9l	421	2025-04-12 14:50:38.363	{}	\N	2025-04-23 21:49:25.106	2025-04-14 21:49:25.106
zsEYCJoJWPsChp-W5KLa5	Récolte anti-gaspi de Betteraves à La Louvière	recolte-anti-gaspi-de-betteraves-a-la-louviere-36e9ad	211 kg de Betteraves de non traitée qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.537	ZxexKoDPrFS-7tZ-FBhLc	KTGICrMmcv7x9yO-ojqqK	t	LiiAlgc2thux_6-mZrjv8	220	2025-04-12 14:50:38.537	{}	\N	2025-05-19 03:08:14.62	2025-05-13 03:08:14.62
epkQ_T677Vq_e5yMCUQ3N	Ramassage participatif de Raisins à Chimay	ramassage-participatif-de-raisins-a-chimay-bef5fe	353 kg de Raisins de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.583	HokuM3phCWU_CTFbSy-Ei	KTGICrMmcv7x9yO-ojqqK	f	LiiAlgc2thux_6-mZrjv8	218	2025-04-12 14:50:38.583	{}	\N	2025-07-03 05:59:31.76	2025-06-24 05:59:31.76
pxpdXs9mXPHOfxo1jwyai	Glanage de Prunes à Ath	glanage-de-prunes-a-ath-48de98	124 kg de Prunes de bio qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.626	5Oou_kyoDdim1JyW8B8Q_	sVuNhNWchjEFGCpjutoGL	t	LiiAlgc2thux_6-mZrjv8	437	2025-04-12 14:50:38.626	{}	\N	2025-07-03 22:13:30.761	2025-07-01 22:13:30.761
I718Lc9SJj8zTMuYquPtF	Récolte solidaire de Chicons à Saint-Vith	recolte-solidaire-de-chicons-a-saint-vith-19015a	81 kg de Chicons de excellente qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.67	uAoOuFeRwbV7xzBzmq6w3	iyyyYkGQeLB4WFvb2Byyk	t	LiiAlgc2thux_6-mZrjv8	242	2025-04-12 14:50:38.67	{}	\N	2025-04-06 07:54:45.906	2025-03-30 07:54:45.906
VbR_ED8TreHOcaGwg3lAZ	Récolte anti-gaspi de Chicons à Visé	recolte-anti-gaspi-de-chicons-a-vise-6e6c56	180 kg de Chicons de satisfaisante qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.717	uAoOuFeRwbV7xzBzmq6w3	FbKU8Otj3YhTHgst66m-o	t	OV8W1uNd5UWFiTqoNdQhw	401	2025-04-12 14:50:38.717	{}	\N	2025-05-13 06:37:12.525	2025-05-08 06:37:12.525
nym2RjK2Z_9K1Hz84aH9x	Glanage de Pommes de terre à Thuin	glanage-de-pommes-de-terre-a-thuin-4a0b98	212 kg de Pommes de terre de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.761	cLxx_yCYqXplo5VOoPBfL	FbKU8Otj3YhTHgst66m-o	t	OV8W1uNd5UWFiTqoNdQhw	27	2025-04-12 14:50:38.761	{}	\N	2025-04-05 18:33:43.007	2025-03-28 19:33:43.007
ZI3xjBg8zX1OhPHhPqtx-	Cueillette de Haricots verts à Tournai	cueillette-de-haricots-verts-a-tournai-331de9	302 kg de Haricots verts de satisfaisante qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.406	tY5WNkmvuWUaUVrquE12v	fjYs09CMy6-dFIRl2lKou	t	-Isst8wgpee6oZtXGNX9l	134	2025-04-16 09:38:37.118	{}	\N	2025-04-26 08:50:55.84	2025-04-20 08:50:55.84
KTIjtoqx2WTQ8A1RWQeHI	Ramassage participatif de Prunes à Turnhout	ramassage-participatif-de-prunes-a-turnhout-197ba5	81 kg de Prunes de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.451	5Oou_kyoDdim1JyW8B8Q_	_hhLcNWTf2fFfYOzWLczX	t	-Isst8wgpee6oZtXGNX9l	30	2025-04-16 09:38:34.086	{}	\N	2025-05-07 05:12:31.992	2025-05-03 05:12:31.992
KmdoiBOY_GgI0ONHXrpmk	Cueillette de Oignons à Verviers	cueillette-de-oignons-a-verviers-d27f72	290 kg de Oignons de bonne qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.804	LtrQe7aaCSIXjIC3Sx4je	wpvAp4ajCSzGK0Vf7bcsf	t	OV8W1uNd5UWFiTqoNdQhw	256	2025-04-12 14:50:38.804	{}	\N	2025-05-19 07:10:05.347	2025-05-17 07:10:05.347
usmcTDdFH37Ge3n_Se5bt	Cueillette de Raisins à Houffalize	cueillette-de-raisins-a-houffalize-78a635	444 kg de Raisins de excellente qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.846	HokuM3phCWU_CTFbSy-Ei	wpvAp4ajCSzGK0Vf7bcsf	t	OV8W1uNd5UWFiTqoNdQhw	38	2025-04-12 14:50:38.846	{}	\N	2025-03-19 18:17:21.003	2025-03-16 18:17:21.003
9p4v9LAGAGkmjmimevgc8	Glanage de Chicorée à Neufchâteau	glanage-de-chicoree-a-neufchateau-7f23f1	53 kg de Chicorée de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.933	Y1q_o2aIVBWyxz3nf5onF	jgON-E7kLlVUwQTzHZaFI	t	brluTeh5h2KzkDkUZUrUV	455	2025-04-12 14:50:38.933	{}	\N	2025-05-12 11:05:19.415	2025-05-07 11:05:19.415
bTNSmiafvRM3f53pBvNMy	Récolte anti-gaspi de Chicons à Liège	recolte-anti-gaspi-de-chicons-a-liege-ad7fe2	476 kg de Chicons de non traitée qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.978	uAoOuFeRwbV7xzBzmq6w3	jgON-E7kLlVUwQTzHZaFI	t	brluTeh5h2KzkDkUZUrUV	10	2025-04-12 14:50:38.978	{}	\N	2025-06-12 22:33:22.972	2025-06-11 22:33:22.972
525tzQm8k1vMUS_YHFeqf	Cueillette de Chicons à Silly	cueillette-de-chicons-a-silly-6ea402	201 kg de Chicons de bio qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.024	uAoOuFeRwbV7xzBzmq6w3	V2inAw0XvEViSUGoP9zIB	t	brluTeh5h2KzkDkUZUrUV	452	2025-04-12 14:50:39.024	{}	\N	2025-05-27 18:26:19.321	2025-05-25 18:26:19.321
Im3ksyiZXOMQzrE9ebzJl	Récolte anti-gaspi de Cassis à Ostende	recolte-anti-gaspi-de-cassis-a-ostende-8338d5	363 kg de Cassis de satisfaisante qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.068	suFyEBMZV8WdlVpcg9h9V	V2inAw0XvEViSUGoP9zIB	t	brluTeh5h2KzkDkUZUrUV	113	2025-04-12 14:50:39.068	{}	\N	2025-05-26 07:17:27.76	2025-05-24 07:17:27.76
xzrv_uVWSgCJQhmQU2g-L	Ramassage participatif de Pommes de terre à Bruges	ramassage-participatif-de-pommes-de-terre-a-bruges-144de4	259 kg de Pommes de terre de bio qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.111	cLxx_yCYqXplo5VOoPBfL	qm4drY4QY6GKnVGyYtEay	t	brluTeh5h2KzkDkUZUrUV	254	2025-04-12 14:50:39.111	{}	\N	2025-06-26 17:25:54.766	2025-06-20 17:25:54.766
QWNusjxFMjHgyQao24kEF	Ramassage participatif de Tomates à Courtrai	ramassage-participatif-de-tomates-a-courtrai-a56261	223 kg de Tomates de bio qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.154	wnpZJ-peX7W1yFvpA-c54	W8PzARVGmkPoHuQ4FEIjl	f	kglH5LayaWyV45SD6vMmA	50	2025-04-12 14:50:39.154	{}	\N	2025-04-29 09:59:26.898	2025-04-21 09:59:26.898
5-SS6fZ0rWuUTYfDQG5Fw	Cueillette de Rhubarbe à Malines	cueillette-de-rhubarbe-a-malines-e43584	94 kg de Rhubarbe de bonne qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.199	ILl3PoVoA8oFtUGT-n1Us	W8PzARVGmkPoHuQ4FEIjl	t	kglH5LayaWyV45SD6vMmA	322	2025-04-12 14:50:39.199	{}	\N	2025-03-29 06:20:29.545	2025-03-21 06:20:29.545
SuSAe5WzIPbo7URmFEgn_	Récolte solidaire de Framboises à Seraing	recolte-solidaire-de-framboises-a-seraing-bd47a5	368 kg de Framboises de bonne qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.246	eATPuZLRM1sjRrCC2ttmV	T-dyjJtjwYoqLCw0t-7aC	t	kglH5LayaWyV45SD6vMmA	331	2025-04-12 14:50:39.246	{}	\N	2025-04-04 10:22:30.436	2025-03-29 11:22:30.436
0LHyvXcJ-PEJmM7Q5CDls	Glanage de Cerises à Verviers	glanage-de-cerises-a-verviers-3f9b79	497 kg de Cerises de satisfaisante qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.291	oCakglg-rv_6Tgqq1SH6B	29LrD99RZ_JFxDx4jfnuT	t	AnLmj3jGslAKpgOAdei2g	116	2025-04-12 14:50:39.291	{}	\N	2025-05-01 06:38:14.575	2025-04-26 06:38:14.575
FUsBqXgIFBS7TLstR0TSE	Ramassage participatif de Navets à Waterloo	ramassage-participatif-de-navets-a-waterloo-d2b6a5	164 kg de Navets de satisfaisante qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.338	PUs03dBRxlSE0K6qwHwFM	BLiz1C374xhdABDrrC8ut	t	AnLmj3jGslAKpgOAdei2g	165	2025-04-12 14:50:39.338	{}	\N	2025-06-17 08:02:34.496	2025-06-12 08:02:34.496
aBx1QNULRD7NtUyqL456y	Cueillette de Radis à Bruges	cueillette-de-radis-a-bruges-94477e	212 kg de Radis de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.381	KU-HmCYEyNqkR3fuZjKUZ	BLiz1C374xhdABDrrC8ut	t	AnLmj3jGslAKpgOAdei2g	12	2025-04-12 14:50:39.381	{}	\N	2025-03-16 14:55:55.667	2025-03-14 14:55:55.667
YwFvzpx0Eve9YinspVpdm	Ramassage participatif de Betteraves à Turnhout	ramassage-participatif-de-betteraves-a-turnhout-630787	156 kg de Betteraves de non traitée qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.438	ZxexKoDPrFS-7tZ-FBhLc	DgemIn-gNwzpLQBmZDBFi	f	5rh3uTfhPuhks_59YjBnE	96	2025-04-12 14:50:39.438	{}	\N	2025-05-18 01:40:46.96	2025-05-09 01:40:46.96
tz2YENwQmp89yI4ktbvm5	Récolte anti-gaspi de Choux de Bruxelles à Waremme	recolte-anti-gaspi-de-choux-de-bruxelles-a-waremme-71c4bc	244 kg de Choux de Bruxelles de bio qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.483	1JfPk-lG5646wXi1SNleK	3B1s7Wx4_nKkENbKd3kdX	t	5rh3uTfhPuhks_59YjBnE	447	2025-04-12 14:50:39.483	{}	\N	2025-05-01 06:27:05.183	2025-04-23 06:27:05.183
Uu1BSM3RBS9zX5GZsVB3H	Récolte solidaire de Courgettes à Libramont	recolte-solidaire-de-courgettes-a-libramont-6ed15c	254 kg de Courgettes de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.528	0mWi_qYZ6S0tFOzwN8Htk	3B1s7Wx4_nKkENbKd3kdX	t	5rh3uTfhPuhks_59YjBnE	234	2025-04-12 14:50:39.528	{}	\N	2025-04-06 23:25:41.043	2025-03-30 23:25:41.043
8xCBz9ABnztbwzuxEjq_q	Récolte anti-gaspi de Poires à Houffalize	recolte-anti-gaspi-de-poires-a-houffalize-fefdef	150 kg de Poires de non traitée qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.571	CtLpj4LcOvxPFO_INWlHm	452vFHgc8p_mi5SkUBa7R	t	5rh3uTfhPuhks_59YjBnE	343	2025-04-12 14:50:39.571	{}	\N	2025-06-04 02:55:43.274	2025-05-25 02:55:43.274
kCvlW0iXqYsKhrubalwDG	Ramassage participatif de Radis à Marche-en-Famenne	ramassage-participatif-de-radis-a-marche-en-famenn-d78bd0	347 kg de Radis de bonne qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.614	KU-HmCYEyNqkR3fuZjKUZ	452vFHgc8p_mi5SkUBa7R	t	5rh3uTfhPuhks_59YjBnE	281	2025-04-12 14:50:39.614	{}	\N	2025-04-02 13:43:40.193	2025-03-27 14:43:40.193
HMqHLNTxFYvqUYUVKkiVV	Glanage de Fraises à Bruxelles	glanage-de-fraises-a-bruxelles-2c0256	75 kg de Fraises de excellente qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.656	wO6Y24XyO7i9rylyyfX1A	fcyWRKxu_pPuxpD0HPOt5	t	VqtNokSNeEYGxdr4Y6o6o	356	2025-04-12 14:50:39.656	{}	\N	2025-06-12 17:42:02.135	2025-06-06 17:42:02.135
gAzjBkkyUUB7o-04IrEAi	Ramassage participatif de Fraises à Alost	ramassage-participatif-de-fraises-a-alost-1a1464	283 kg de Fraises de satisfaisante qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.699	wO6Y24XyO7i9rylyyfX1A	fcyWRKxu_pPuxpD0HPOt5	t	VqtNokSNeEYGxdr4Y6o6o	446	2025-04-12 14:50:39.699	{}	\N	2025-05-13 17:50:55.495	2025-05-07 17:50:55.495
ahwBRaAbrcM9vOvLYMpIG	Récolte anti-gaspi de Rhubarbe à Ostende	recolte-anti-gaspi-de-rhubarbe-a-ostende-0dd2aa	184 kg de Rhubarbe de bonne qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.742	ILl3PoVoA8oFtUGT-n1Us	1fwKWx08ur6M0D5KpeCee	t	VqtNokSNeEYGxdr4Y6o6o	265	2025-04-12 14:50:39.742	{}	\N	2025-03-28 12:48:13.849	2025-03-23 12:48:13.849
P_gQ4i93gqMLQ97toYkH6	Ramassage participatif de Tomates à Thuin	ramassage-participatif-de-tomates-a-thuin-3f939b	419 kg de Tomates de bonne qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.786	wnpZJ-peX7W1yFvpA-c54	1fwKWx08ur6M0D5KpeCee	f	VqtNokSNeEYGxdr4Y6o6o	340	2025-04-12 14:50:39.786	{}	\N	2025-06-04 06:49:51.335	2025-06-01 06:49:51.335
Dci2hKGD0_S3SSvE8aVX_	Glanage de Cerises à Couvin	glanage-de-cerises-a-couvin-3ef44a	393 kg de Cerises de bio qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.83	oCakglg-rv_6Tgqq1SH6B	Y6vJB4FN8ErL6rQRJTAJC	t	VqtNokSNeEYGxdr4Y6o6o	101	2025-04-12 14:50:39.83	{}	\N	2025-05-19 09:42:04.485	2025-05-17 09:42:04.485
GAHNmIyCo50KaiCJ_Pah8	Ramassage participatif de Myrtilles à Tournai	ramassage-participatif-de-myrtilles-a-tournai-383fcf	313 kg de Myrtilles de excellente qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.873	9rgVvKbwsWvePahmQ8BEy	p6hlv5fWqflPL8k-rzlDf	t	VqtNokSNeEYGxdr4Y6o6o	272	2025-04-12 14:50:39.873	{}	\N	2025-04-30 17:19:24.984	2025-04-26 17:19:24.984
Lc4Ks35JIk-CELNd16QBr	Cueillette de Navets à Arlon	cueillette-de-navets-a-arlon-899fb6	55 kg de Navets de bio qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.916	PUs03dBRxlSE0K6qwHwFM	KLpY0xyshcVv0OEw2vdv8	t	cafS6eupem4x1ME6mtG8Y	224	2025-04-12 14:50:39.916	{}	\N	2025-04-30 08:45:22.612	2025-04-21 08:45:22.612
9mX_-dftzzBD-0qOnTlXh	Récolte anti-gaspi de Oignons à Binche	recolte-anti-gaspi-de-oignons-a-binche-80af3e	209 kg de Oignons de satisfaisante qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:39.961	LtrQe7aaCSIXjIC3Sx4je	KLpY0xyshcVv0OEw2vdv8	f	cafS6eupem4x1ME6mtG8Y	159	2025-04-12 14:50:39.961	{}	\N	2025-07-12 11:18:57.602	2025-07-04 11:18:57.602
04mPC0BuXDh53x3qzOl-a	Récolte anti-gaspi de Myrtilles à Braine-l'Alleud	recolte-anti-gaspi-de-myrtilles-a-braine-l-alleud-021f2b	321 kg de Myrtilles de non traitée qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.004	9rgVvKbwsWvePahmQ8BEy	jNZ2kd4n4yGP-Nd7Iq_Y8	t	cafS6eupem4x1ME6mtG8Y	304	2025-04-12 14:50:40.004	{}	\N	2025-04-25 01:04:42.018	2025-04-18 01:04:42.018
P0L4zaZQuFG4tEmPTYRv2	Cueillette de Groseilles à Marche-en-Famenne	cueillette-de-groseilles-a-marche-en-famenne-5739c0	406 kg de Groseilles de bonne qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.049	hJxSZ1kFfuyHEVHJQpa9J	7ArE__q3LwdF84mWgj4JD	t	cafS6eupem4x1ME6mtG8Y	445	2025-04-12 14:50:40.049	{}	\N	2025-04-05 10:22:40.931	2025-03-27 11:22:40.931
Fed4NV-kbfFoZMR9FJABR	Récolte anti-gaspi de Chicorée à Marche-en-Famenne	recolte-anti-gaspi-de-chicoree-a-marche-en-famenne-5b1703	107 kg de Chicorée de satisfaisante qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.098	Y1q_o2aIVBWyxz3nf5onF	7ArE__q3LwdF84mWgj4JD	t	cafS6eupem4x1ME6mtG8Y	489	2025-04-12 14:50:40.098	{}	\N	2025-05-03 09:11:50.21	2025-05-01 09:11:50.21
KfOhSRCQuZlpyQxl2_vjS	Ramassage participatif de Groseilles à Philippeville	ramassage-participatif-de-groseilles-a-philippevil-dc1a18	194 kg de Groseilles de excellente qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.145	hJxSZ1kFfuyHEVHJQpa9J	th9K-dkVM-3AXISd4xPv2	t	cafS6eupem4x1ME6mtG8Y	88	2025-04-12 14:50:40.145	{}	\N	2025-04-01 21:25:57.338	2025-03-28 22:25:57.338
bt6PFML9EM6YePQXcH9Lt	Ramassage participatif de Framboises à Saint-Trond	ramassage-participatif-de-framboises-a-saint-trond-7e625e	236 kg de Framboises de excellente qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.193	eATPuZLRM1sjRrCC2ttmV	th9K-dkVM-3AXISd4xPv2	t	cafS6eupem4x1ME6mtG8Y	179	2025-04-12 14:50:40.193	{}	\N	2025-05-28 02:03:16.077	2025-05-23 02:03:16.077
62plegVooFU0OJCzjlaZQ	Glanage de Cerises à Waremme	glanage-de-cerises-a-waremme-c500c4	108 kg de Cerises de excellente qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.245	oCakglg-rv_6Tgqq1SH6B	bR8sxSfiQ_ZoTKOIHC_dp	t	W5b-TE3dj_d6S1TDiswah	178	2025-04-12 14:50:40.245	{}	\N	2025-06-11 10:23:59.731	2025-06-10 10:23:59.731
6usBJhZbPfi0nX86fd4pO	Glanage de Rhubarbe à Nivelles	glanage-de-rhubarbe-a-nivelles-9163f2	220 kg de Rhubarbe de excellente qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.292	ILl3PoVoA8oFtUGT-n1Us	HyoKtLi8PT6zhoMduEJlc	t	W5b-TE3dj_d6S1TDiswah	89	2025-04-12 14:50:40.292	{}	\N	2025-05-01 07:45:12.392	2025-04-25 07:45:12.392
FT_qdXhL2LlsBggpPYF81	Récolte solidaire de Cerises à La Louvière	recolte-solidaire-de-cerises-a-la-louviere-2890e6	430 kg de Cerises de non traitée qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.34	oCakglg-rv_6Tgqq1SH6B	HyoKtLi8PT6zhoMduEJlc	f	W5b-TE3dj_d6S1TDiswah	273	2025-04-12 14:50:40.34	{}	\N	2025-07-10 17:28:43.017	2025-06-30 17:28:43.017
-3bh40tVHmlCPPO3nu56O	Glanage de Framboises à Braine-l'Alleud	glanage-de-framboises-a-braine-l-alleud-a0904f	142 kg de Framboises de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.39	eATPuZLRM1sjRrCC2ttmV	bb2MXqa0LcloFrH_wyoxB	t	W5b-TE3dj_d6S1TDiswah	257	2025-04-12 14:50:40.39	{}	\N	2025-05-24 01:47:30.413	2025-05-19 01:47:30.413
lLtm3a29rmdZQdW0IcQdV	Cueillette de Chicons à Tournai	cueillette-de-chicons-a-tournai-4c5770	239 kg de Chicons de excellente qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.485	uAoOuFeRwbV7xzBzmq6w3	VSt0V-wF_vLUJBCfPY7fp	t	2j3fd180ij2-wc7d_kKcr	173	2025-04-12 14:50:40.485	{}	\N	2025-07-10 12:03:35.654	2025-07-09 12:03:35.654
tTo9uwY5oyhZfXJUnWC2A	Récolte anti-gaspi de Fraises à Coxyde	recolte-anti-gaspi-de-fraises-a-coxyde-72dbdb	493 kg de Fraises de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.539	wO6Y24XyO7i9rylyyfX1A	YCf9xuOErqPfOBGZ6zmVA	t	2j3fd180ij2-wc7d_kKcr	55	2025-04-12 14:50:40.539	{}	\N	2025-05-14 13:20:47.281	2025-05-12 13:20:47.281
xfcjDdMqlmmJOMDp38d8i	Glanage de Oignons à Courtrai	glanage-de-oignons-a-courtrai-843ec6	401 kg de Oignons de non traitée qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.592	LtrQe7aaCSIXjIC3Sx4je	8uOtGqPHFEjd39y8cMmTZ	t	2j3fd180ij2-wc7d_kKcr	14	2025-04-12 14:50:40.592	{}	\N	2025-05-17 00:05:01.095	2025-05-07 00:05:01.095
UiSiMWqRw0ERWr6gElVuC	Cueillette de Raisins à Hal	cueillette-de-raisins-a-hal-0ae1bb	67 kg de Raisins de satisfaisante qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.637	HokuM3phCWU_CTFbSy-Ei	an3fq0dhR1d7tpK_-UUO4	t	2j3fd180ij2-wc7d_kKcr	284	2025-04-12 14:50:40.637	{}	\N	2025-05-08 20:48:48.178	2025-05-03 20:48:48.178
KC-Aln_heLTOmXDvE7QC_	Glanage de Oignons à La Louvière	glanage-de-oignons-a-la-louviere-5f7abe	51 kg de Oignons de bonne qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.681	LtrQe7aaCSIXjIC3Sx4je	an3fq0dhR1d7tpK_-UUO4	t	2j3fd180ij2-wc7d_kKcr	275	2025-04-12 14:50:40.681	{}	\N	2025-06-30 09:05:46.511	2025-06-22 09:05:46.511
sWQUxDUpbW12VKGNaHr05	Récolte anti-gaspi de Pommes de terre à Seraing	recolte-anti-gaspi-de-pommes-de-terre-a-seraing-c90093	70 kg de Pommes de terre de bio qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.73	cLxx_yCYqXplo5VOoPBfL	CUpCwNJupUF1_jetEg3i7	t	T0V7DyP0r_Mgd-HCqO-d3	426	2025-04-12 14:50:40.73	{}	\N	2025-05-03 08:37:25.696	2025-04-30 08:37:25.696
R5kgKHB7pTN1AnHJLBsUw	Cueillette de Myrtilles à Spa	cueillette-de-myrtilles-a-spa-8fdced	114 kg de Myrtilles de satisfaisante qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.774	9rgVvKbwsWvePahmQ8BEy	Hx0UknLf-G6LH721vLZVT	t	T0V7DyP0r_Mgd-HCqO-d3	369	2025-04-12 14:50:40.774	{}	\N	2025-05-10 21:16:59.182	2025-05-07 21:16:59.182
ECeMz_g9O7a_KMu_658WS	Cueillette de Courgettes à Ciney	cueillette-de-courgettes-a-ciney-15a0d0	454 kg de Courgettes de bonne qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.816	0mWi_qYZ6S0tFOzwN8Htk	Hx0UknLf-G6LH721vLZVT	t	T0V7DyP0r_Mgd-HCqO-d3	486	2025-04-12 14:50:40.816	{}	\N	2025-06-03 10:56:39.671	2025-06-02 10:56:39.671
MaGsglMcr2-9hlHADTw2G	Cueillette de Courges à Ciney	cueillette-de-courges-a-ciney-95412e	442 kg de Courges de satisfaisante qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.859	Qq5bGdkSxD8lDzes3T7VZ	IYLtuyKVlVglihqHsYvvT	t	T0V7DyP0r_Mgd-HCqO-d3	113	2025-04-12 14:50:40.859	{}	\N	2025-06-14 22:14:39.398	2025-06-10 22:14:39.398
NSHN_J-pDAKJCp64W74vp	Glanage de Rhubarbe à Bruxelles	glanage-de-rhubarbe-a-bruxelles-20b20d	499 kg de Rhubarbe de bio qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.902	ILl3PoVoA8oFtUGT-n1Us	IYLtuyKVlVglihqHsYvvT	f	T0V7DyP0r_Mgd-HCqO-d3	255	2025-04-12 14:50:40.902	{}	\N	2025-06-19 23:15:11.224	2025-06-15 23:15:11.224
S189ydOzlu1afgW5pqCpr	Ramassage participatif de Épinards à Beauraing	ramassage-participatif-de-epinards-a-beauraing-e35a11	447 kg de Épinards de non traitée qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.945	20_8X0VnDkDKOUGXuK_NP	dNEAnZ8GOiPu-p7UxVd0w	t	T0V7DyP0r_Mgd-HCqO-d3	323	2025-04-12 14:50:40.945	{}	\N	2025-06-26 07:28:53.187	2025-06-17 07:28:53.187
mfymaEusE92IaHgtXr2oK	Ramassage participatif de Pommes de terre à Charleroi	ramassage-participatif-de-pommes-de-terre-a-charle-b89a24	437 kg de Pommes de terre de bio qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.989	cLxx_yCYqXplo5VOoPBfL	dNEAnZ8GOiPu-p7UxVd0w	f	T0V7DyP0r_Mgd-HCqO-d3	187	2025-04-12 14:50:40.989	{}	\N	2025-04-23 16:19:40.449	2025-04-18 16:19:40.449
6c9cyeVPQZbgGTvkDJaRk	Récolte solidaire de Betteraves à Saint-Trond	recolte-solidaire-de-betteraves-a-saint-trond-bbc2bd	261 kg de Betteraves de excellente qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.032	ZxexKoDPrFS-7tZ-FBhLc	P84jFqn7cVrLpACYLViIY	t	HTAwwq918Sv1oOx78H0II	499	2025-04-12 14:50:41.032	{}	\N	2025-05-27 06:12:18.842	2025-05-22 06:12:18.842
ymPNaq0_yWBETS10YUtrs	Ramassage participatif de Fraises à Courtrai	ramassage-participatif-de-fraises-a-courtrai-ec71ef	126 kg de Fraises de bonne qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.075	wO6Y24XyO7i9rylyyfX1A	GpdZe3d2QspVjZbq8Pl3R	t	HTAwwq918Sv1oOx78H0II	46	2025-04-12 14:50:41.075	{}	\N	2025-07-15 21:26:39.827	2025-07-09 21:26:39.827
LP2dZpy6pAj_j2V3hUTd6	Récolte solidaire de Noix à Ostende	recolte-solidaire-de-noix-a-ostende-31ba2b	400 kg de Noix de bonne qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.119	fpPDu1uQp47qE8hgXhVH1	GpdZe3d2QspVjZbq8Pl3R	t	HTAwwq918Sv1oOx78H0II	460	2025-04-12 14:50:41.119	{}	\N	2025-07-06 20:39:47.242	2025-07-04 20:39:47.242
tCJD6hlnsDYGXLIXw9w7B	Récolte solidaire de Chicorée à Soignies	recolte-solidaire-de-chicoree-a-soignies-f5d2b1	218 kg de Chicorée de bio qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.164	Y1q_o2aIVBWyxz3nf5onF	OFIS-8bt9JoWM4qyzvn2N	t	HTAwwq918Sv1oOx78H0II	455	2025-04-12 14:50:41.164	{}	\N	2025-06-27 15:03:07.574	2025-06-25 15:03:07.574
uotfae8idDWLWACN03p-7	Ramassage participatif de Navets à Genk	ramassage-participatif-de-navets-a-genk-bbedf6	226 kg de Navets de non traitée qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.209	PUs03dBRxlSE0K6qwHwFM	2OPMkZr-bn512BJSYKzxW	t	HTAwwq918Sv1oOx78H0II	102	2025-04-12 14:50:41.209	{}	\N	2025-05-20 19:42:18.359	2025-05-18 19:42:18.359
yBTHA1JtOIsYucUegHg-u	Récolte solidaire de Asperges à Libramont	recolte-solidaire-de-asperges-a-libramont-567f58	438 kg de Asperges de non traitée qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.253	77Kwj1yC3VeYR72lN3-o2	2OPMkZr-bn512BJSYKzxW	f	HTAwwq918Sv1oOx78H0II	129	2025-04-12 14:50:41.253	{}	\N	2025-05-24 14:09:59.198	2025-05-20 14:09:59.198
Q7SXstU1VO_OPrPp9oGwX	Récolte solidaire de Cassis à Chimay	recolte-solidaire-de-cassis-a-chimay-89bbcf	480 kg de Cassis de bonne qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.295	suFyEBMZV8WdlVpcg9h9V	lX_JsRM5clkGq7KQlBIFz	t	ydfUeRgq9gXlm0erlo5SK	400	2025-04-12 14:50:41.295	{}	\N	2025-05-10 10:16:51.73	2025-05-04 10:16:51.73
AuE9xGs-DNLgenwGym8b5	Récolte anti-gaspi de Fraises à Hasselt	recolte-anti-gaspi-de-fraises-a-hasselt-f50547	180 kg de Fraises de satisfaisante qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.34	wO6Y24XyO7i9rylyyfX1A	vgtfZgGfZFx9WMxTY8V6o	t	ydfUeRgq9gXlm0erlo5SK	273	2025-04-12 14:50:41.34	{}	\N	2025-06-08 04:46:33.02	2025-05-31 04:46:33.02
SIHhmyk-b7E4itiVS4e1G	Récolte solidaire de Courgettes à Ottignies	recolte-solidaire-de-courgettes-a-ottignies-a15d38	431 kg de Courgettes de bio qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.544	0mWi_qYZ6S0tFOzwN8Htk	uOvKNGNbuLivwCk1FydkF	t	ydfUeRgq9gXlm0erlo5SK	93	2025-04-12 14:50:41.544	{}	\N	2025-05-07 19:53:27.648	2025-05-01 19:53:27.648
2QQYH9pOqsQZkIgZrmvsq	Cueillette de Fraises à Saint-Nicolas	cueillette-de-fraises-a-saint-nicolas-05f92b	146 kg de Fraises de non traitée qualité disponibles pour le glanage. Accès facile au champ. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.587	wO6Y24XyO7i9rylyyfX1A	uOvKNGNbuLivwCk1FydkF	t	ydfUeRgq9gXlm0erlo5SK	99	2025-04-12 14:50:41.587	{}	\N	2025-06-16 04:58:28.564	2025-06-08 04:58:28.564
ROi_kHvgpvRdMhBsFW3q8	Récolte anti-gaspi de Courges à Eupen	recolte-anti-gaspi-de-courges-a-eupen-ca8c80	129 kg de Courges de non traitée qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.631	Qq5bGdkSxD8lDzes3T7VZ	VG8LyzRBhmc6B45_txlLW	t	ydfUeRgq9gXlm0erlo5SK	188	2025-04-12 14:50:41.631	{}	\N	2025-04-08 14:55:18.616	2025-04-02 14:55:18.616
6cR0X3NyFOfX35n7CWZ6T	Glanage de Chicorée à Namur	glanage-de-chicoree-a-namur-c78a46	83 kg de Chicorée de bonne qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.676	Y1q_o2aIVBWyxz3nf5onF	IZYFHyy5eTXRSkIwjrKn9	t	yJvh2OhJ9qOdigVHh3Dj1	115	2025-04-12 14:50:41.676	{}	\N	2025-06-15 23:00:48.363	2025-06-09 23:00:48.363
Yp8x6lrDWnqYXBb6AHDhH	Cueillette de Fraises à Bruges	cueillette-de-fraises-a-bruges-31d480	257 kg de Fraises de excellente qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.722	wO6Y24XyO7i9rylyyfX1A	IZYFHyy5eTXRSkIwjrKn9	t	yJvh2OhJ9qOdigVHh3Dj1	444	2025-04-12 14:50:41.722	{}	\N	2025-05-17 16:50:26.701	2025-05-14 16:50:26.701
-PjWs5jUSW8GqI7XEDO4W	Ramassage participatif de Myrtilles à Couvin	ramassage-participatif-de-myrtilles-a-couvin-dbc9aa	289 kg de Myrtilles de bio qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.767	9rgVvKbwsWvePahmQ8BEy	GSyBAjCltdvW4lg_iQyMh	t	yJvh2OhJ9qOdigVHh3Dj1	321	2025-04-12 14:50:41.767	{}	\N	2025-04-05 16:55:25.896	2025-03-31 16:55:25.896
aisiXB7R-jywjhkgFsVW-	Ramassage participatif de Carottes à Wezembeek-Oppem	ramassage-participatif-de-carottes-a-wezembeek-opp-c90de0	135 kg de Carottes de bonne qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.811	SHORSyP7VEKfzq3RCa7tB	zEJdfduCVwGSmdpKFMuJD	f	yJvh2OhJ9qOdigVHh3Dj1	285	2025-04-12 14:50:41.811	{}	\N	2025-05-12 13:22:45.93	2025-05-04 13:22:45.93
wP4-dEUo5dbzLnmCJ6dTR	Glanage de Courges à Courtrai	glanage-de-courges-a-courtrai-6c6920	221 kg de Courges de non traitée qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.855	Qq5bGdkSxD8lDzes3T7VZ	zEJdfduCVwGSmdpKFMuJD	t	yJvh2OhJ9qOdigVHh3Dj1	270	2025-04-12 14:50:41.855	{}	\N	2025-04-01 04:27:01.629	2025-03-28 05:27:01.629
xxrIRaW93etErxxT18HEv	Ramassage participatif de Pommes à Dinant	ramassage-participatif-de-pommes-a-dinant-8a276e	273 kg de Pommes de excellente qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.901	bakvssNk7cpyi5ryAG29N	wNUBnEEFOmN1vP2-i3gUg	t	bZ8I3fgbY7O3S_QDy2R5-	157	2025-04-12 14:50:41.901	{}	\N	2025-06-24 14:21:31.239	2025-06-16 14:21:31.239
NkfmXfmZXUs5L36ykg3wy	Ramassage participatif de Haricots verts à Mouscron	ramassage-participatif-de-haricots-verts-a-mouscro-c5c6a4	400 kg de Haricots verts de non traitée qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.945	tY5WNkmvuWUaUVrquE12v	wNUBnEEFOmN1vP2-i3gUg	t	bZ8I3fgbY7O3S_QDy2R5-	416	2025-04-12 14:50:41.945	{}	\N	2025-04-30 06:09:31.205	2025-04-24 06:09:31.205
15aU29tJgs6R0-qGFonUx	Cueillette de Noix à Saint-Trond	cueillette-de-noix-a-saint-trond-5a1dad	425 kg de Noix de excellente qualité disponibles pour le glanage. Prévoir une tenue adaptée. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:41.989	fpPDu1uQp47qE8hgXhVH1	QFpE1EMybvJp3SxE8_sOK	t	bZ8I3fgbY7O3S_QDy2R5-	497	2025-04-12 14:50:41.989	{}	\N	2025-04-30 18:10:41.49	2025-04-22 18:10:41.49
srqHdGSSOESiyQWW5SAA8	Récolte anti-gaspi de Poires à Nivelles	recolte-anti-gaspi-de-poires-a-nivelles-798ca6	284 kg de Poires de bio qualité disponibles pour le glanage. Parking à proximité. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:40.437	CtLpj4LcOvxPFO_INWlHm	Gej5k9H9awIOKwGHF0SGo	t	W5b-TE3dj_d6S1TDiswah	141	2025-04-12 15:54:59.807	{}	\N	2025-03-14 13:03:41.875	2025-03-10 13:03:41.875
fmnfMhkfwQLBLIdaWnb1P	Récolte anti-gaspi de Chicorée à Saint-Vith	recolte-anti-gaspi-de-chicoree-a-saint-vith-c9ebea	150 kg de Chicorée de excellente qualité disponibles pour le glanage. Terrain accessible en voiture. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.89	Y1q_o2aIVBWyxz3nf5onF	bSHEc2TDsVaPfScvnWHXH	t	OV8W1uNd5UWFiTqoNdQhw	462	2025-04-15 16:58:00.618	{https://yzrv5nd8tn.ufs.sh/f/sSftFC6thVwkROnkPEpqOcTvXYxPe9iQZLrh5pME4KCtB217}	\N	2025-04-25 22:58:47.972	2025-04-17 22:58:47.972
xXs54eC9o2LiUxT8ID1Di	Ramassage participatif de Groseilles à Louvain	ramassage-participatif-de-groseilles-a-louvain-89b019	333 kg de Groseilles de excellente qualité disponibles pour le glanage. Prévoyez de bonnes chaussures. Venez participer à cette action citoyenne contre le gaspillage alimentaire. Convient à tous les âges, ambiance conviviale assurée.	2025-04-12 14:50:38.494	hJxSZ1kFfuyHEVHJQpa9J	_hhLcNWTf2fFfYOzWLczX	t	-Isst8wgpee6oZtXGNX9l	197	2025-04-16 09:38:32.792	{}	\N	2025-03-31 00:22:56.733	2025-03-25 01:22:56.733
\.


--
-- Data for Name: crop_types; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.crop_types (id, name, season, category, created_at, updated_at) FROM stdin;
cLxx_yCYqXplo5VOoPBfL	Pommes de terre	FALL	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
SHORSyP7VEKfzq3RCa7tB	Carottes	YEAR_ROUND	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
bakvssNk7cpyi5ryAG29N	Pommes	FALL	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
CtLpj4LcOvxPFO_INWlHm	Poires	FALL	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
wnpZJ-peX7W1yFvpA-c54	Tomates	SUMMER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
0mWi_qYZ6S0tFOzwN8Htk	Courgettes	SUMMER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
tY5WNkmvuWUaUVrquE12v	Haricots verts	SUMMER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
wO6Y24XyO7i9rylyyfX1A	Fraises	SUMMER	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
LtrQe7aaCSIXjIC3Sx4je	Oignons	YEAR_ROUND	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
B1aubdY8KWr4K7Avu_RyF	Poireaux	WINTER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
uAoOuFeRwbV7xzBzmq6w3	Chicons	WINTER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
dTN0gkYdDfAYcw8KGsg_K	Endives	WINTER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
1JfPk-lG5646wXi1SNleK	Choux de Bruxelles	WINTER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
ZxexKoDPrFS-7tZ-FBhLc	Betteraves	FALL	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
3_oOFeItt1UXHdSMmZjH6	Céleris	FALL	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
PUs03dBRxlSE0K6qwHwFM	Navets	WINTER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
20_8X0VnDkDKOUGXuK_NP	Épinards	SPRING	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
KU-HmCYEyNqkR3fuZjKUZ	Radis	SPRING	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
77Kwj1yC3VeYR72lN3-o2	Asperges	SPRING	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
ILl3PoVoA8oFtUGT-n1Us	Rhubarbe	SPRING	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
oCakglg-rv_6Tgqq1SH6B	Cerises	SUMMER	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
eATPuZLRM1sjRrCC2ttmV	Framboises	SUMMER	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
hJxSZ1kFfuyHEVHJQpa9J	Groseilles	SUMMER	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
suFyEBMZV8WdlVpcg9h9V	Cassis	SUMMER	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
9rgVvKbwsWvePahmQ8BEy	Myrtilles	SUMMER	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
5Oou_kyoDdim1JyW8B8Q_	Prunes	SUMMER	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
HokuM3phCWU_CTFbSy-Ei	Raisins	FALL	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
fpPDu1uQp47qE8hgXhVH1	Noix	FALL	FRUIT	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
Qq5bGdkSxD8lDzes3T7VZ	Courges	FALL	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
yzYFrc_RK7n47b7luuf9d	Potirons	FALL	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
Y1q_o2aIVBWyxz3nf5onF	Chicorée	WINTER	VEGETABLE	2025-04-12 14:50:36.809	2025-04-12 14:50:36.809
\.


--
-- Data for Name: farms; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.farms (id, name, slug, description, city, postal_code, contact_info, created_at, owner_id, updated_at, latitude, longitude) FROM stdin;
tjeL3GBhQ9n--fTNUPUHe	du Brabant Laurent	exploitation-dubois-dc0ca2	Production locale au cœur de nos terroirs	Couvin	5660	0484/12 86 75	2025-04-12 14:50:36.969	uAY0QPhcaukvovPdqKyvY	2025-04-12 14:50:36.969	50.05443734788578	4.481273740500612
YQPDyv0o-5cC6RGRBi5D_	des Quatre Saisons Hermans	champs-de-boer-b422f1	Tradition agricole au service du goût	Nivelles	1400	0470/40 51 83	2025-04-12 14:50:36.969	wJudEuLCaw0RY2TvgexG8	2025-04-12 14:50:36.969	50.59357332916731	4.325137270758053
c_DzC4iQI9mTRdLh_Nw89	de Hesbaye Le Jardinier	champs-bogaert-38987e	Agriculture durable respectueuse de l'environnement	Visé	4600	012/65 39 38	2025-04-12 14:50:36.969	adVuTpEep2u30gLn5c35x	2025-04-12 14:50:36.969	50.74856559354087	5.706412506813006
YsCOI0rssdA0UktReOxsx	Ferme De Smet	potager-de-l-ourthe-b34e45	Agriculture durable au service du goût	Courtrai	8500	0473/78 97 58	2025-04-12 14:50:36.969	dfVRDm9ISI4zTpCXjwSso	2025-04-12 14:50:36.969	50.83512858924924	3.26327823202752
gUIxGbN9i1muj1FMwXhrI	Domaine Saint-Michel	notre-dame-jacobs-d470af	Méthodes écologiques depuis plus de 30 ans	Saint-Trond	3800	012/93 59 83	2025-04-12 14:50:36.969	-Isst8wgpee6oZtXGNX9l	2025-04-12 14:50:36.969	50.81811322413733	5.189288729467645
fQyLi-UrEvD4d4KICB63-	Potager Saint-Michel	verger-des-quatre-saisons-aafdaa	Méthodes écologiques et produits de qualité	Bruxelles	1000	0474/75 71 41	2025-04-12 14:50:36.969	LiiAlgc2thux_6-mZrjv8	2025-04-12 14:50:36.969	50.84439201244655	4.343624872104009
leyUIM7dxbaff62_3uht2	Domaine Bogaert	potager-legrand-ef84db	Culture respectueuse au service du goût	Ypres	8900	0483/74 71 21	2025-04-12 14:50:36.969	OV8W1uNd5UWFiTqoNdQhw	2025-04-12 14:50:36.969	50.84580436167227	2.892024305679778
cEhIyOnj5j_UeFt5yEw0i	Exploitation de la Meuse	champs-saint-michel-ede81a	Exploitation familiale pour des aliments savoureux	Hal	1500	013/88 52 09	2025-04-12 14:50:36.969	brluTeh5h2KzkDkUZUrUV	2025-04-12 14:50:36.969	50.73784672206241	4.225674850304018
r0BlxEp38qv1NHYFqEFdQ	Domaine De Smet	champs-du-brabant-30474d	Agriculture durable au cœur de nos terroirs	Malines	2800	0480/68 72 41	2025-04-12 14:50:36.969	kglH5LayaWyV45SD6vMmA	2025-04-12 14:50:36.969	51.03200090848006	4.47288372896151
MBcFgpfDKnXmGz0K6yGRq	Exploitation des Ardennes	ferme-leroy-24534d	Savoir-faire ancestral en circuit court	Namur	5000	0475/96 39 07	2025-04-12 14:50:36.969	AnLmj3jGslAKpgOAdei2g	2025-04-12 14:50:36.969	50.46300268099458	4.880389155545483
FAMZZfVyLIHM2PYJ7vhKD	Champs des Polders	champs-dupont-fe9b01	Production locale au service du goût	Binche	7130	012/90 88 95	2025-04-12 14:50:36.969	5rh3uTfhPuhks_59YjBnE	2025-04-12 14:50:36.969	50.40547541024404	4.165692472430299
zvNp9b6PnNIZeD--5Z9ll	Ferme Jacobs	domaine-vandenberghe-aad1f0	Agriculture durable pour des aliments savoureux	Verviers	4800	015/29 51 02	2025-04-12 14:50:36.969	VqtNokSNeEYGxdr4Y6o6o	2025-04-12 14:50:36.969	50.59188921981469	5.859918926098645
iF1Oj8kHOwqBgAhnFKehB	Verger du Terroir	ferme-deschamps-816608	Terroir belge respectueuse de l'environnement	Waterloo	1410	016/56 80 42	2025-04-12 14:50:36.969	cafS6eupem4x1ME6mtG8Y	2025-04-12 14:50:36.969	50.7066818106415	4.404177981053345
MP7octWq0nu5MR0er4YLK	du Limbourg Dubois	domaine-leroy-182052	Culture respectueuse pour des aliments savoureux	Waremme	4300	013/57 71 30	2025-04-12 14:50:36.969	W5b-TE3dj_d6S1TDiswah	2025-04-12 14:50:36.969	50.68623454251469	5.262000921359466
XUMqJAeC_lx2-92ivoeGz	Exploitation Dumont	de-l-ourthe-deschamps-775b16	Terroir belge au cœur de nos terroirs	Hal	1500	011/77 70 58	2025-04-12 14:50:36.969	2j3fd180ij2-wc7d_kKcr	2025-04-12 14:50:36.969	50.73635036612571	4.228787196783617
pceTXsRnASDnRvPE7GRU6	Potager des Quatre Saisons	de-la-vallee-renard-2574c1	Méthodes écologiques entre tradition et innovation	Tervuren	3080	0476/38 32 89	2025-04-12 14:50:36.969	T0V7DyP0r_Mgd-HCqO-d3	2025-04-12 14:50:36.969	50.83083412024695	4.509171710813963
sx42u79y3-RMcrcu-W1EK	Domaine De Boer	ferme-de-l-escaut-7da665	Production locale pour des aliments savoureux	Mouscron	7700	010/20 05 71	2025-04-12 14:50:36.969	HTAwwq918Sv1oOx78H0II	2025-04-12 14:50:36.969	50.74017995910796	3.222584449274234
V2nlDOTnYDXbwByTCcQfm	Ferme Maes	ferme-de-la-meuse-67312b	Terroir belge au cœur de nos terroirs	Waterloo	1410	012/34 98 33	2025-04-12 14:50:36.969	ydfUeRgq9gXlm0erlo5SK	2025-04-12 14:50:36.969	50.70881041914999	4.405138244417598
lth_axCFjRAni3_eGm5YP	Champs de la Vallée	domaine-du-bonheur-004bae	Tradition agricole en circuit court	Louvain	3000	02/85 91 067	2025-04-12 14:50:36.969	yJvh2OhJ9qOdigVHh3Dj1	2025-04-12 14:50:36.969	50.87626530548455	4.700842798481031
z2u45DHKI5NsZ3OBGHIMh	de Hesbaye Deschamps	verger-legrand-9cf9d8	Savoir-faire ancestral au cœur de nos terroirs	Charleroi	6000	0477/82 77 02	2025-04-12 14:50:36.969	bZ8I3fgbY7O3S_QDy2R5-	2025-04-12 14:50:36.969	50.40661571963449	4.447243776980876
43Qo4seZqDKrUXlFzPZWN	Champs Dupont	verger-renard-05c728	Agriculture durable pour des aliments savoureux	Durbuy	6940	011/47 34 93	2025-04-12 14:50:36.969	vvVHV7ZkDaZ2PJOepW1zZ	2025-04-12 14:50:36.969	50.35437603640302	5.447456454151085
qEdZXK4mRM5u-FswMjUHg	Potager Bogaert	domaine-mertens-1b39e4	Agriculture durable au service du goût	Verviers	4800	0477/59 67 11	2025-04-12 14:50:36.969	Vz1jBXrgAW88nLQ92NseR	2025-04-12 14:50:36.969	50.595049780564	5.873226196142133
_K8gF9cl9d7olfCltQtrH	de Wallonie Legrand	de-la-vallee-wouters-f255b4	Terroir belge entre tradition et innovation	Tervuren	3080	03/90 87 520	2025-04-12 14:50:36.969	yLmHSXTXS-FhegcK8B1tQ	2025-04-12 14:50:36.969	50.82183096909429	4.514738657966901
oV-UkmJaBOptLUDR1clTk	Potager du Condroz	exploitation-laurent-243461	Production locale au cœur de nos terroirs	Huy	4500	0479/87 62 38	2025-04-12 14:50:36.969	bxw52YkAf3kya9uiRd8yE	2025-04-12 14:50:36.969	50.52466949075002	5.240737929449343
TxaOI0xqHuXKzACpRk5oB	Champs Claes	potager-janssens-5c0b42	Savoir-faire ancestral au service du goût	La Louvière	7100	012/88 09 46	2025-04-12 14:50:36.969	Lu842AREolk1Iapw5cqVH	2025-04-12 14:50:36.969	50.47978929657433	4.180600654796246
MCx1wS4smMu7pfOyeQBQB	des Ardennes Mertens	ferme-dumont-41a0ae	Savoir-faire ancestral au service du goût	Tournai	7500	0474/53 45 12	2025-04-12 14:50:36.969	rmRBt9_48yR7ofyN2KNr7	2025-04-12 14:50:36.969	50.61195008902992	3.395047356203148
p9Fe_5WtWOW2mlo4gcfgR	Exploitation des Polders	ferme-de-pauw-03478c	Production locale et produits de qualité	Mons	7000	0480/64 45 45	2025-04-12 14:50:36.969	vVh5wAlS2cVRW6vRjwJp8	2025-04-12 14:50:36.969	50.44463988710619	3.948262566393049
Mcooobkf_KSdQC4ZRxbGZ	de la Meuse Janssens	potager-lambert-895d7f	Exploitation familiale entre tradition et innovation	Silly	7830	014/90 18 12	2025-04-12 14:50:36.969	vylxmUrAw0uflJ260rgc9	2025-04-12 14:50:36.969	50.64646769246157	3.918449709671164
29RS2XL-Y9dywDxhlHV1s	de Hesbaye Maes	ferme-de-la-meuse-c0601e	Méthodes écologiques au cœur de nos terroirs	Ath	7800	016/03 07 50	2025-04-12 14:50:36.969	0mqpTYdGz_2LSZFVQg9Ho	2025-04-12 14:50:36.969	50.63269636435716	3.770276674278659
8w3MlQ7sblzXtXLqoMZPc	Verger du Hainaut	potager-de-pauw-69fdda	Production locale et produits de qualité	Nivelles	1400	03/79 17 683	2025-04-12 14:50:36.969	pnXe3wEkXY6CScPUeE_zo	2025-04-12 14:50:36.969	50.59456878532845	4.329793698668095
FYdG7yJHfhHsHzgA08xGM	Champs Delcourt	ferme-bogaert-1f58f5	Culture respectueuse au service du goût	Couvin	5660	09/19 80 719	2025-04-12 14:50:36.969	QXpx5jbDmsR7KYq7BLaZs	2025-04-12 14:50:36.969	50.04615581429983	4.480091361869384
ffm_RTt6FHnn8a-3-FYbm	Ferme du Bonheur	ferme-de-boer-935b16	Production locale pour des aliments savoureux	Bastogne	6600	0488/94 46 68	2025-04-12 14:50:36.969	86gSxFnM0G0YmdYAGUOyZ	2025-04-12 14:50:36.969	50.00533185813979	5.709981263270599
pAM5gKGJj7WhpenC2OHM9	Domaine De Boer	ferme-du-soleil-813c4e	Tradition agricole au service du goût	Neufchâteau	6840	0484/63 69 80	2025-04-12 14:50:36.969	tahXVGsywRvWz6anZZUpO	2025-04-12 14:50:36.969	49.83391507466995	5.444458861855543
IkXfR1oW76oceo7Nf_De_	Domaine des Champs	potager-bogaert-3e6e8f	Exploitation familiale en circuit court	Thuin	6530	013/40 24 40	2025-04-12 14:50:36.969	NsFT9ATiUfMzoM5Gxrlla	2025-04-12 14:50:36.969	50.34827273472712	4.301897516848107
n58irKwczw5ByTr0VzBJH	Domaine Renard	exploitation-des-polders-52b7d0	Culture respectueuse depuis plus de 30 ans	Ath	7800	02/53 40 985	2025-04-12 14:50:36.969	KoLEp8twy5jdMVjxuaE2f	2025-04-12 14:50:36.969	50.64165644036778	3.778487480931827
2pKjdrY11rFSC2M-dmFSZ	Verger Bogaert	verger-du-bonheur-4eb5ef	Méthodes écologiques pour des aliments savoureux	Liège	4000	0477/82 72 22	2025-04-12 14:50:36.969	ox43gqffBk_84FZTc8vBC	2025-04-12 14:50:36.969	50.63868796749821	5.577731590352875
Bx1Sz03iwlJDDSdU2ulUy	Domaine Bio	de-wallonie-maes-8306ba	Production locale au service du goût	Nivelles	1400	016/12 48 63	2025-04-12 14:50:36.969	SR8dgc5xm0DucI8_HCoaX	2025-04-12 14:50:36.969	50.59614158412632	4.327697545950989
Z2mBMBpi3wRn0L_cLHuFZ	Ferme Renard	potager-notre-dame-4eb7d9	Savoir-faire ancestral depuis plus de 30 ans	Binche	7130	0485/51 44 90	2025-04-12 14:50:36.969	RbE1kYFdajC7rTQR6Cj2Z	2025-04-12 14:50:36.969	50.40440581054117	4.16549379408354
zdnhlTzlFXa7dRLGvsKsv	Exploitation Van den Akker	champs-de-flandre-a96e2f	Méthodes écologiques et produits de qualité	La Louvière	7100	010/55 03 75	2025-04-12 14:50:36.969	RbDbMA8ak4jRDPW3i4N-h	2025-04-12 14:50:36.969	50.48772811972734	4.17713189175913
JMIWN5E0kEFCsIhtiKa1B	de l'Ourthe Wouters	champs-delcourt-9465c6	Terroir belge respectueuse de l'environnement	Genk	3600	0475/93 15 69	2025-04-12 14:50:36.969	4YidRAUq2nDPoEWigTQBu	2025-04-12 14:50:36.969	50.95827860127461	5.514365497796216
1Q8s7_F7ZDziM5o6ahH8P	Potager Vermeulen	du-bonheur-vandenberghe-091d8d	Production locale au cœur de nos terroirs	Bastogne	6600	0476/15 50 46	2025-04-12 14:50:36.969	foKvn5K0VRZMRmuHLFWcc	2025-04-12 14:50:36.969	50.00370991238605	5.71653108449779
cVO8qCnrAfJUriv5PADy6	Champs de la Dyle	exploitation-leclercq-41f7fb	Agriculture durable pour des aliments savoureux	Dinant	5500	0488/45 46 00	2025-04-12 14:50:36.969	YOUOqWeVx3wIW_mOLvqqo	2025-04-12 14:50:36.969	50.26736227144524	4.916662795292319
Ip2TODmVnAXAlnE8mnEWT	Potager du Soleil	domaine-jacobs-d4a849	Production locale et produits de qualité	Neufchâteau	6840	0483/62 69 95	2025-04-12 14:50:36.969	N3hmqsQgEA2pQN9mCI1YG	2025-04-12 14:50:36.969	49.84845619777854	5.442796914437078
TXySQSj6g89x1XZS5ZOSC	Ferme du Bonheur	domaine-du-brabant-0dc6c1	Terroir belge et produits de qualité	Houffalize	6660	0485/94 54 80	2025-04-12 14:50:36.969	_BVbk1M-eGph8GpaSqmGg	2025-04-12 14:50:36.969	50.14592547771005	5.781685714065492
dWs2qFizss2zd-ie2gVLK	Exploitation Dubois	bio-martin-3af74b	Exploitation familiale depuis plus de 30 ans	Huy	4500	0485/96 09 65	2025-04-12 14:50:36.969	ZBt4I58AWyPwIO026bZiS	2025-04-12 14:50:36.969	50.51768446553402	5.234002643240568
tYjYGe7dTHZYuTz4dP2CV	Champs Dupont	verger-de-la-vallee-d71cae	Agriculture durable entre tradition et innovation	Malines	2800	0488/29 50 59	2025-04-12 14:50:36.969	uYTjplE72kKR9lYtTN2Nc	2025-04-12 14:50:36.969	51.03341867688607	4.470550649139641
u6L6CgTQCD7jtW62p914i	Exploitation Willems	de-l-ourthe-lambert-b2824f	Terroir belge et produits de qualité	Ciney	5590	0478/73 34 72	2025-04-12 14:50:36.969	8iD8DXBPxidpo10n4qDgH	2025-04-12 14:50:36.969	50.30137246816285	5.100225160497072
HW1wbynWKjc8FH6JbZ8FI	Domaine des Champs	du-terroir-de-pauw-cf2bf2	Méthodes écologiques et produits de qualité	La Louvière	7100	0480/48 18 07	2025-04-12 14:50:36.969	RuuNJuI8FLGjG3FWhKkAf	2025-04-12 14:50:36.969	50.47406019942537	4.181793445248852
J5uK9XD027O7lWktbp0UV	de l'Escaut Simon	domaine-janssens-f1e247	Savoir-faire ancestral respectueuse de l'environnement	Soignies	7060	09/32 38 452	2025-04-12 14:50:36.969	yuVMRMM0cxqLGMixUojJM	2025-04-12 14:50:36.969	50.5735237364959	4.073971742023395
0e2a83vStscFV9QTJDBT_	Saint-Michel Janssens	champs-du-limbourg-3146e2	Exploitation familiale au cœur de nos terroirs	Saint-Trond	3800	09/44 25 098	2025-04-12 14:50:36.969	CqqyfXQ25KQBoULzkCVVy	2025-04-12 14:50:36.969	50.81603339030401	5.178706345508563
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.favorites (id, announcement_id, created_at, user_id) FROM stdin;
eMEY78iNw0GHGqnq_5syj	uotfae8idDWLWACN03p-7	2025-04-12 14:50:43.018	L6cIque1qSZrk3fUf1zIc
y1LQYuRstfWqUefTQACLZ	fmnfMhkfwQLBLIdaWnb1P	2025-04-12 14:50:43.018	L6cIque1qSZrk3fUf1zIc
y-sKjLbeqP_CRfaPCP8zI	15aU29tJgs6R0-qGFonUx	2025-04-12 14:50:43.018	L6cIque1qSZrk3fUf1zIc
fOIJA0aeq3OQSiicpxHPQ	Fed4NV-kbfFoZMR9FJABR	2025-04-12 14:50:43.018	L6cIque1qSZrk3fUf1zIc
igXh9m_o3V0yY-HnsZJdu	aBx1QNULRD7NtUyqL456y	2025-04-12 14:50:43.018	43lHPQsRU1hCqsgsP5h5N
9vWYFQSQtoLBujLXkFCOk	aisiXB7R-jywjhkgFsVW-	2025-04-12 14:50:43.018	43lHPQsRU1hCqsgsP5h5N
gpq-TmDDBuzrFdjiQfOQ1	R5kgKHB7pTN1AnHJLBsUw	2025-04-12 14:50:43.018	5DAjUr1HTKBuxAC-xTBt_
Tb2Fv9am1QxrCFo_wtqmy	NkfmXfmZXUs5L36ykg3wy	2025-04-12 14:50:43.018	5DAjUr1HTKBuxAC-xTBt_
uangbHojf4_vBPXqZpGry	KTIjtoqx2WTQ8A1RWQeHI	2025-04-12 14:50:43.018	5DAjUr1HTKBuxAC-xTBt_
VtiXjLRzTOb1I47Dox-M7	QWNusjxFMjHgyQao24kEF	2025-04-12 14:50:43.018	5DAjUr1HTKBuxAC-xTBt_
U0FGfa5Jd4mB6TcmY6_NQ	n6sUvfV9UTR4-IRMZdvrl	2025-04-12 14:50:43.018	kGpS5LvZWpjy1kiAJxNSw
G98CJIMSH4UPVogXiwVmq	yBTHA1JtOIsYucUegHg-u	2025-04-12 14:50:43.018	kGpS5LvZWpjy1kiAJxNSw
hZ7TennYdOuwyqBmQBZO9	t2OIph_jPE1gEx1yx4tN6	2025-04-12 14:50:43.018	kGpS5LvZWpjy1kiAJxNSw
UucIN0k1yYvfFbRmicVgH	aBx1QNULRD7NtUyqL456y	2025-04-12 14:50:43.018	kGpS5LvZWpjy1kiAJxNSw
rplMWy2mnI4MMm6CGDNXD	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:43.018	kGpS5LvZWpjy1kiAJxNSw
gGpOldwPED2ncnK3NiEQM	P0L4zaZQuFG4tEmPTYRv2	2025-04-12 14:50:43.018	bB585VEfv8KcxbJZNmsx4
XkCSzsBpldmHJ2EDDjaKs	MaGsglMcr2-9hlHADTw2G	2025-04-12 14:50:43.018	bB585VEfv8KcxbJZNmsx4
GhBRHpMlaPUyuWMZsh5EB	-QjJcna60mmqjtvXuJ0Pa	2025-04-12 14:50:43.018	bB585VEfv8KcxbJZNmsx4
zrP3BBO6Sm2_2vU6OMDah	6c9cyeVPQZbgGTvkDJaRk	2025-04-12 14:50:43.018	GakIGuCKhnGdpU5jkPiK8
WfnosvaeUVSjiGS4Hw4eH	HMqHLNTxFYvqUYUVKkiVV	2025-04-12 14:50:43.018	5a5xhw4O0SvpIzLDNjz8Q
tgun0uQW0WpCaqhrbY1Aj	MaGsglMcr2-9hlHADTw2G	2025-04-12 14:50:43.018	5a5xhw4O0SvpIzLDNjz8Q
zVYvfZ-zkkrl9G9L4GMj6	Yp8x6lrDWnqYXBb6AHDhH	2025-04-12 14:50:43.018	5a5xhw4O0SvpIzLDNjz8Q
QT4DRMy2mnBqY2xk3ihdI	SA3UQrYL-kkTy2Hn7QTXt	2025-04-12 14:50:43.018	5a5xhw4O0SvpIzLDNjz8Q
n-AKGQkHiii74fBtcxbqW	usmcTDdFH37Ge3n_Se5bt	2025-04-12 14:50:43.018	5a5xhw4O0SvpIzLDNjz8Q
Y0zyy5u_VnkzWbCBpBGNX	gAzjBkkyUUB7o-04IrEAi	2025-04-12 14:50:43.018	FMbASdqKjJwWsOXC3UfAw
DWNSaK6cYxEufaB-OQPkW	8xCBz9ABnztbwzuxEjq_q	2025-04-12 14:50:43.018	FMbASdqKjJwWsOXC3UfAw
7k0UDZ0JCpz7RNUk8_qNu	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:43.018	FMbASdqKjJwWsOXC3UfAw
Gq7TEBuWf9siJUf8tn6Uc	6usBJhZbPfi0nX86fd4pO	2025-04-12 14:50:43.018	FMbASdqKjJwWsOXC3UfAw
URD-DfqLykF8XCQgaV0Jz	525tzQm8k1vMUS_YHFeqf	2025-04-12 14:50:43.018	FMbASdqKjJwWsOXC3UfAw
kcCvWU_U1nEbsjdydg0lt	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:43.018	gmT92fxxkOJ4ptSVBFZ_x
Lg_fywseSaFHBlJkBvjBU	-PjWs5jUSW8GqI7XEDO4W	2025-04-12 14:50:43.018	VVv1O-EU2pP2W0IJydmWE
iEiJRderMuZZLIUFH2s0U	525tzQm8k1vMUS_YHFeqf	2025-04-12 14:50:43.018	VVv1O-EU2pP2W0IJydmWE
6RY77qkilz4E5-jq1Z91B	xxrIRaW93etErxxT18HEv	2025-04-12 14:50:43.018	VVv1O-EU2pP2W0IJydmWE
e4OVQNhu1f2HKeLa1cwkS	PKi9tQNJq30PXQCen9WG_	2025-04-12 14:50:43.018	VVv1O-EU2pP2W0IJydmWE
5qARMnnPWeq6ikadqUcPQ	836uzBS5yUDlTSzneBM3k	2025-04-12 14:50:43.018	VVv1O-EU2pP2W0IJydmWE
DziB-LCmcUJ9MW9p0aT6K	-QjJcna60mmqjtvXuJ0Pa	2025-04-12 14:50:43.018	q3E_VbrVuB743Stxvndaf
v9dI3WieOvcixdgsjFyV2	6usBJhZbPfi0nX86fd4pO	2025-04-12 14:50:43.018	q3E_VbrVuB743Stxvndaf
Za32ZSm7FTvcJd3nCEmtl	gAzjBkkyUUB7o-04IrEAi	2025-04-12 14:50:43.018	q3E_VbrVuB743Stxvndaf
gKDoD6bgTnYYrmLSHyPwn	WkgNP-aGoyggpCJb-Lsh_	2025-04-12 14:50:43.018	mOxIDeAei1AJGDa_ckloW
ISLvWt_AIooN-BzE1b0dy	t2OIph_jPE1gEx1yx4tN6	2025-04-12 14:50:43.018	SZKRhX1Q5FaYJCiCQlTr_
2hFaqLamilj5LPs7zTvzs	VbR_ED8TreHOcaGwg3lAZ	2025-04-12 14:50:43.018	p4apbNOlKXv1puswb6rz-
DYEPMAGgzqkBHKPd1TvGj	ROi_kHvgpvRdMhBsFW3q8	2025-04-12 14:50:43.018	4U7lIf2tjVj9zLreYPbew
L7o1qAkh5u-mfo9arf2VM	SIHhmyk-b7E4itiVS4e1G	2025-04-12 14:50:43.018	d1fHsboAEUT5pmvhc-kQ-
J2CP3V9a1rosq1HsJ6sGP	bt6PFML9EM6YePQXcH9Lt	2025-04-12 14:50:43.018	d1fHsboAEUT5pmvhc-kQ-
pkBY59qvrFyisttYF1AkX	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:43.018	d1fHsboAEUT5pmvhc-kQ-
6P5WU3sb0LcPjn1VM-wqj	8xCBz9ABnztbwzuxEjq_q	2025-04-12 14:50:43.018	d1fHsboAEUT5pmvhc-kQ-
eaAbe8MX3T2sR_mB7D-8j	04mPC0BuXDh53x3qzOl-a	2025-04-12 14:50:43.018	RBsNUdyISMH0Ce17M40Ak
e6nK0fh2a53eMOI1G5iJ_	62plegVooFU0OJCzjlaZQ	2025-04-12 14:50:43.018	X6CtufPuMUtb02Lk91f2G
cv9VOJdn_FF2vUOd4WwmZ	R5kgKHB7pTN1AnHJLBsUw	2025-04-12 14:50:43.018	X6CtufPuMUtb02Lk91f2G
ZUg15Vo6CkA28DUHwxbjy	GAHNmIyCo50KaiCJ_Pah8	2025-04-12 14:50:43.018	Yb6WEOiSN4Cv1c-YV35HR
pGEnsemcIFIXhhvIsiOlu	ROi_kHvgpvRdMhBsFW3q8	2025-04-12 14:50:43.018	Yb6WEOiSN4Cv1c-YV35HR
9lz3vq0SFMfPYjipX5K0r	bTNSmiafvRM3f53pBvNMy	2025-04-12 14:50:43.018	Yb6WEOiSN4Cv1c-YV35HR
ztzM4w08pddC-pcRlMoUi	pxpdXs9mXPHOfxo1jwyai	2025-04-12 14:50:43.018	Uhp31eJtQ5CudpUdiOFDB
CGJEfo_CceCLw3cI9UsjU	KmdoiBOY_GgI0ONHXrpmk	2025-04-12 14:50:43.018	Uhp31eJtQ5CudpUdiOFDB
ag3midG55Qaee3_qpqU08	Lu-DJdawkjRB2BC3P5Fi6	2025-04-12 14:50:43.018	Uhp31eJtQ5CudpUdiOFDB
WGdKaVZWeB8LVg2pZt5Gq	GAHNmIyCo50KaiCJ_Pah8	2025-04-12 14:50:43.018	Uhp31eJtQ5CudpUdiOFDB
6WBGpPxbqis_LqPxCLRM1	fmnfMhkfwQLBLIdaWnb1P	2025-04-14 13:48:17.03	273wt6tMXl-Ca5ynLoV0v
IS9pGB6N0NiB8SZpc2Aw_	fmnfMhkfwQLBLIdaWnb1P	2025-04-14 19:45:06.294	0li55hX02UbQ57rBGG9WH
A3xUB8ivqPiDLEYOqADr2	fmnfMhkfwQLBLIdaWnb1P	2025-04-14 20:15:17.818	jInZEbVLlz3JJC0j-3wod
Xmd1Em1lEtNcVYIq00Ql7	fmnfMhkfwQLBLIdaWnb1P	2025-04-15 16:47:59.441	RBsNUdyISMH0Ce17M40Ak
LvlHw_FUo6C44v3QwC_wY	lC13n180G25luBWssT10w	2025-04-20 16:36:09.137	r84Bjxp2mvsBNjFrp7CIe
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.feedbacks (id, message, email, created_at, updated_at, user_id) FROM stdin;
E3WZN5bdNcIly2UkM6KQa	ajouter un système de covoiturage	françois29@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	dfVRDm9ISI4zTpCXjwSso
NGh7zbs2WrmXT-q_u-TC7	ajouter une fonction de messagerie entre agriculteurs et glaneurs	céline.de smet@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	cafS6eupem4x1ME6mtG8Y
ogZTCGLBsJqgdv99uC70z	super initiative pour mettre en relation agriculteurs et glaneurs	emma.wouters@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	yJvh2OhJ9qOdigVHh3Dj1
WJEk14ykByZXb-GCFMZxA	une option pour partager les annonces sur les réseaux sociaux serait un plus	anne21@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	bZ8I3fgbY7O3S_QDy2R5-
k_-4VLn1RFmby-9QN2ygj	une option pour partager les annonces sur les réseaux sociaux serait un plus	julie.maes@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	Vz1jBXrgAW88nLQ92NseR
UZhAvp2tzCRR4I7rpk3ga	ajouter un système de covoiturage	julien56@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	yLmHSXTXS-FhegcK8B1tQ
d0FTqpiOaq3bk2wBnCq1s	ajouter une fonction de messagerie entre agriculteurs et glaneurs	maarten.vandenberghe@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	vylxmUrAw0uflJ260rgc9
e4e1sivZ-66XOfDnxFTUM	il serait utile d'avoir une notification quand une annonce est publiée près de chez moi	janssenst@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	NsFT9ATiUfMzoM5Gxrlla
zcPnhGbnBZdZ7-ksHPUh1	application très utile pour réduire le gaspillage alimentaire	eline.jacobs@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	SR8dgc5xm0DucI8_HCoaX
4BTgv5W83rkmigxhedrCY	une option pour partager les annonces sur les réseaux sociaux serait un plus	laura.lambert@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	RbDbMA8ak4jRDPW3i4N-h
62EcjT8ZDoIfMQ9M2cdQb	les descriptions des champs pourraient être plus détaillées	isabelle.leroy@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	4YidRAUq2nDPoEWigTQBu
pSvmyjHp8e1kLHfG8PxAy	j'aimerais pouvoir télécharger un certificat après avoir participé	claire.deschamps@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	YOUOqWeVx3wIW_mOLvqqo
iTasAZ-cTrZDduksjxNUY	permettre de voir la distance jusqu'au champ	eva.verstraete@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	8iD8DXBPxidpo10n4qDgH
grc9pQw6ZiBJKfDJZDLno	pouvoir filtrer par type de culture	catherine95@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	yuVMRMM0cxqLGMixUojJM
ajqXQrb_v7UjcuxDRfFXr	une option pour partager les annonces sur les réseaux sociaux serait un plus	catherine95@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	01yWC_Lwl2tOgCaJW9UOJ
HawAOt5Q9sW8OW0x77uLJ	il serait utile d'avoir une notification quand une annonce est publiée près de chez moi	leroyj@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	Y52HSKpDMBEQf-K3Ee8tx
tXhJ1RG9eTES1lKzIiIBH	j'aimerais pouvoir télécharger un certificat après avoir participé	koen12@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	k8Yaa6OCjDEViWJs3LG4I
HpHhkHpOusyb-3vc_XZOv	super initiative pour mettre en relation agriculteurs et glaneurs	laurentt@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	jjLNpjyIGLcsK-73OTWFv
MHMoTwUVGDXpELnydZttN	pourrait-on prévoir un système de récompense pour les glaneurs réguliers?	emma.hermans@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	Fa15qoJmWrl6KmnTI-jMB
LCE3emh3beKyMTTCjlE4a	une option pour partager les annonces sur les réseaux sociaux serait un plus	anne75@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	ZpZbacewrLB30ngCbnK0Z
9t2HOlBYsQL3Xj02ASPvp	permettre de voir la distance jusqu'au champ	catherine.willems@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	3LEh25p5i6R3i3c1iYkjU
FNzuJb77Qtvkc0DpND57X	permettre de voir la distance jusqu'au champ	hermanss@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	kGpS5LvZWpjy1kiAJxNSw
_OxIf1swFefpKbXnI9hzu	une option pour partager les annonces sur les réseaux sociaux serait un plus	leroys@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	lLNPH9f1ygnfuTM_cr-Lr
X_gyxdpT_96KokjLFQgG6	pourrait-on prévoir un système de récompense pour les glaneurs réguliers?	janssenss@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	YMXwZNNWxO6hcnh9fdENU
I45SRBQe1yVBl352aHeJi	pouvoir filtrer par type de culture	catherine.renard@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	bB585VEfv8KcxbJZNmsx4
aTnPLWnJf2dB_3rE9Dtzw	ajouter un système de covoiturage	willemsw@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	YrrRZiqhaeatZgSt_gVCm
zxAOb3beoQQLhR-7YINE4	ajouter un système de covoiturage	nathalie.hermans@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	5a5xhw4O0SvpIzLDNjz8Q
JaJHP9JgxbW8Wt2C9aFAv	super initiative pour mettre en relation agriculteurs et glaneurs	charlotte3@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	FMbASdqKjJwWsOXC3UfAw
TDL9iRltdpToPG2zzTKCS	application très utile pour réduire le gaspillage alimentaire	verstraeten@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	VVv1O-EU2pP2W0IJydmWE
ESuEuv0782k3TpuspgzYk	pouvoir filtrer par type de culture	maese@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	Uhp31eJtQ5CudpUdiOFDB
y_aq_JGun0tfzQUw-_EIj	ajouter une fonction de messagerie entre agriculteurs et glaneurs	nathalie60@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	30eFtilsOe7FLfDD_FWtD
8QxVnxSLxQscNg7HFgf2W	y a-t-il un moyen de contacter directement un agriculteur?	claire53@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
-EpvutWkhLvHHTvX1iast	comment puis-je devenir glaneur ?	laurentj@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
PHDPYqYBBBQEQ45awfwDC	existe-t-il des formations pour apprendre à glaner correctement?	goossenss@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
fbZcLMgIOEUUNVCawjA0Z	je souhaite participer en tant qu'agriculteur	françois95@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
1IMBh9hdhBkVEJ5LDIVr6	je souhaite participer en tant qu'agriculteur	elise.janssens@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
ca-GXbHZwcmcVPDxKIV-L	comment puis-je devenir glaneur ?	stijn33@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
KsLvRtO88qtxmY76UZLer	y a-t-il un moyen de contacter directement un agriculteur?	lisa.bogaert@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
NdWpVIWNwQyNKUmexEtjx	très belle initiative !	céline.janssens@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
kd49upCC6hIJSO5P26CIS	y a-t-il un moyen de contacter directement un agriculteur?	elise.leclercq@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
PLRu7Kp1AH4UwjjDCPSIi	est-ce que l'application est disponible dans toute la belgique ?	claire24@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
-3OhXim_p4wOH13N7nwO7	je souhaite participer en tant qu'agriculteur	tom93@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
_9F7HtsFRkCCirJk3QQc1	existe-t-il des formations pour apprendre à glaner correctement?	vermeulend@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
_OFE8YSEIL3k3wU6hUXCQ	existe-t-il des formations pour apprendre à glaner correctement?	claesj@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
m2hdu6GmBMNCjr3NM0dQX	pourriez-vous ajouter plus d'informations sur le processus de glanage?	bart69@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
eGh0ubPRkh3g35P3xH5db	pourriez-vous ajouter plus d'informations sur le processus de glanage?	françois38@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
AJqJXTYHT-6vd8e7ubqDy	très belle initiative !	elise6@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
7rBt1kAtFqHnsjHT6a97U	existe-t-il des formations pour apprendre à glaner correctement?	pierre.dubois@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
2EtrjDW4V-c5C8LRrF7OH	très belle initiative !	deschampss@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
td9AeBOg9PYw7nCgyUQR1	pourriez-vous ajouter plus d'informations sur le processus de glanage?	vermeulene@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
JZkjQNNaaqEKm3ovMT_56	comment puis-je devenir glaneur ?	sophie.bogaert@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
YJzEL3VrqHvLNZD9HnUPx	très belle initiative !	tom65@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
pdpzIkpVka0h_sa0W32bx	j'aimerais organiser un groupe de glaneurs dans ma région	dumonts@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
G4WBH4avsk8dzhAZqE412	comment puis-je devenir glaneur ?	pierre.dupont@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
oEkKBKQMSCEDIbR4C1YMj	existe-t-il des formations pour apprendre à glaner correctement?	mertensw@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
WTIGpncFA24g6Fad1SfGm	pourriez-vous ajouter plus d'informations sur le processus de glanage?	bogaertl@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
eTk5k_S4Rw1WXXcW7Us_t	je souhaite participer en tant qu'agriculteur	thomas.peeters@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
fQSS6sxcGNq9nAwSZBJKK	existe-t-il des formations pour apprendre à glaner correctement?	willemse@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
87Ve1zci0SxcY4Yhyty55	pourriez-vous ajouter plus d'informations sur le processus de glanage?	leclercqv@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
qTBe4-ILKk47YUIevZnXn	pourriez-vous ajouter plus d'informations sur le processus de glanage?	sarah39@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
cugT2BDSiaZyNevQPU6JA	j'aimerais organiser un groupe de glaneurs dans ma région	legrandc@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
vacyuLQ4dVtJCwHxUTsGB	comment puis-je devenir glaneur ?	lisa.vermeulen@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
T7tKeA5-o1gndhLqxNXJZ	j'aimerais organiser un groupe de glaneurs dans ma région	jan.laurent@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
F7w3X5zn5ZxOtPAj1nD8e	comment puis-je devenir glaneur ?	bart.janssens@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
PKxjkIGn2MhnFI1ashZmt	est-ce que l'application est disponible dans toute la belgique ?	julien.martin@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
uuGoQY-bqBSGxQt-U5jmI	est-ce que l'application est disponible dans toute la belgique ?	bart.martin@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
k4VPrxpXa6Ba2vD0qowfd	j'aimerais organiser un groupe de glaneurs dans ma région	catherine8@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
cZQX_SmfQGXegj7g6Dugp	est-ce que l'application est disponible dans toute la belgique ?	sofie.de smet@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
GGHT1CXLPo36BJUh1325T	très belle initiative !	tom.dumont@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
QSOcS1wGWpFIDdgjoef0J	existe-t-il des formations pour apprendre à glaner correctement?	hermansj@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
x2fDR82PxkptQ5NaJ8RCj	j'aimerais organiser un groupe de glaneurs dans ma région	delcourtc@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
k2iqWxekv8Rb5emN_mya5	je souhaite participer en tant qu'agriculteur	julien78@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
qgWOy54wqbcJmVcy9OC7Q	pourriez-vous ajouter plus d'informations sur le processus de glanage?	julie41@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
QoJVhIj2mQTK4jutzdpoc	existe-t-il des formations pour apprendre à glaner correctement?	maess@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
Y-avd1scT8sBc3uYIhPNC	existe-t-il des formations pour apprendre à glaner correctement?	deschampsn@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
Kn1O7Vjs8t3B9RvKoehez	comment puis-je devenir glaneur ?	pieter33@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
J4kLPFzCWBSh8aQKfKg5K	comment puis-je devenir glaneur ?	nathalie70@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
9-_2JYYUMd5nl-ScwhzHI	pourriez-vous ajouter plus d'informations sur le processus de glanage?	delcourtm@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
_oNN5ULgp0OF550wFH2N-	comment puis-je devenir glaneur ?	lisa1@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
cFoFqFwVVQ0uvxM9NRVJv	y a-t-il un moyen de contacter directement un agriculteur?	bogaertt@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
LI3FiSnzmTbmzMNgXLmd4	est-ce que l'application est disponible dans toute la belgique ?	ruben.hermans@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
eUKXbjLYkpi0ydiAeO-4Z	y a-t-il un moyen de contacter directement un agriculteur?	jean.deschamps@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
VwXbCVthcIETZhQqBJAqu	pourriez-vous ajouter plus d'informations sur le processus de glanage?	vandenberghek@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
RUW8T4rFMMQzzH9b1cBig	y a-t-il un moyen de contacter directement un agriculteur?	françois.hermans@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
hUtKrHBSZ-xOwFfNt1fcl	j'aimerais organiser un groupe de glaneurs dans ma région	koen70@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
XNdYth5zOfVKOU1zlTTDs	j'aimerais organiser un groupe de glaneurs dans ma région	stijn.willems@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
V-c7N3yPmsECYW-Ruwnjw	très belle initiative !	eline.vandenberghe@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
rcoJGuBoQGrvt8ZCGg7AI	je souhaite participer en tant qu'agriculteur	laura.leroy@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
71uEQfoIYndToRe8Kqb8g	je souhaite participer en tant qu'agriculteur	stijn40@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
WKVHSBVH7G5BSnSOMWXJB	je souhaite participer en tant qu'agriculteur	jan.lejeune@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
YLoelkrIDaa97cRKo5l_v	je souhaite participer en tant qu'agriculteur	wim.hermans@outlook.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
ucEv8j_mgKz_QxSLumSr_	y a-t-il un moyen de contacter directement un agriculteur?	dumontr@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
4ijm8or8Xg_4BAd17jtCM	y a-t-il un moyen de contacter directement un agriculteur?	valérie.verstraete@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
i0ATs94reBmYYDA1UALo8	comment puis-je devenir glaneur ?	laurenti@gmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
dUUgU-7AKNFtnEPmjD8I7	comment puis-je devenir glaneur ?	dumonts@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
ts1Ivaamo-6do5rqoMoop	existe-t-il des formations pour apprendre à glaner correctement?	peeterss@telenet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
XF7RNobi81EavkwQuTrrr	pourriez-vous ajouter plus d'informations sur le processus de glanage?	eline53@hotmail.com	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
yjAsx6e5Bza3H7npLuInA	j'aimerais organiser un groupe de glaneurs dans ma région	pierre.lambert@voo.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
c4mGdLAIgYthIyXgYhj-x	pourriez-vous ajouter plus d'informations sur le processus de glanage?	joris44@proximus.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
YtyaVkZhmfZSQojxb8HwC	je souhaite participer en tant qu'agriculteur	marc16@skynet.be	2025-04-12 14:50:43.156	2025-04-12 14:50:43.156	\N
\.


--
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.fields (id, name, city, postal_code, created_at, farm_id, owner_id, updated_at, surface, latitude, longitude) FROM stdin;
oHe1k4OPq0n2IfdZ2OwI4	parcelle raide 1	Couvin	5660	2025-04-12 14:50:37.119	tjeL3GBhQ9n--fTNUPUHe	\N	2025-04-12 14:50:37.119	0.8	50.05872812875607	4.482780659236742
sFLESrhAu_EZgZ5KAqWYN	parcelle super 2	Couvin	5660	2025-04-12 14:50:37.119	tjeL3GBhQ9n--fTNUPUHe	\N	2025-04-12 14:50:37.119	7.3	50.05294934662599	4.485385726764494
xvtOBYyWBPoEN9K_433Yi	parcelle magenta 3	Couvin	5660	2025-04-12 14:50:37.119	tjeL3GBhQ9n--fTNUPUHe	\N	2025-04-12 14:50:37.119	5.8	50.05900298889178	4.484444970815591
POWl8Avqv9PruZX10--ei	parcelle adorable 1	Nivelles	1400	2025-04-12 14:50:37.119	YQPDyv0o-5cC6RGRBi5D_	\N	2025-04-12 14:50:37.119	5.7	50.59368291904488	4.32832072802564
8C6-wpj_Tu7QzEec969WT	parcelle mince 2	Nivelles	1400	2025-04-12 14:50:37.119	YQPDyv0o-5cC6RGRBi5D_	\N	2025-04-12 14:50:37.119	5	50.59402087880456	4.320611520283889
hSb0NNT6dA5jL94X5Kyb7	parcelle pourpre 3	Nivelles	1400	2025-04-12 14:50:37.119	YQPDyv0o-5cC6RGRBi5D_	\N	2025-04-12 14:50:37.119	10.8	50.59036273769192	4.321839853643045
b16vtZpm8KfElPbIfudm7	parcelle espiègle 1	Visé	4600	2025-04-12 14:50:37.119	c_DzC4iQI9mTRdLh_Nw89	\N	2025-04-12 14:50:37.119	3.4	50.74830521601015	5.707625759123643
3g97_uUpNTrij4_CMPDCs	parcelle simple 2	Visé	4600	2025-04-12 14:50:37.119	c_DzC4iQI9mTRdLh_Nw89	\N	2025-04-12 14:50:37.119	1.7	50.75135053250711	5.71031285325054
2BNDij3on8gVDX-Us9vig	parcelle turquoise 3	Visé	4600	2025-04-12 14:50:37.119	c_DzC4iQI9mTRdLh_Nw89	\N	2025-04-12 14:50:37.119	3.2	50.75011184473276	5.710176863951776
wTjPYFCA2j6xivU6K1sfQ	parcelle spécialiste 4	Visé	4600	2025-04-12 14:50:37.119	c_DzC4iQI9mTRdLh_Nw89	\N	2025-04-12 14:50:37.119	1.4	50.74592350975626	5.705613443031445
1thcqPqw6aIbnQAhWuXtH	parcelle efficace 1	Courtrai	8500	2025-04-12 14:50:37.119	YsCOI0rssdA0UktReOxsx	\N	2025-04-12 14:50:37.119	9.2	50.83547298115693	3.268037391443289
hOOj3R04IQTFy2qE2rYWe	parcelle rectangulaire 2	Courtrai	8500	2025-04-12 14:50:37.119	YsCOI0rssdA0UktReOxsx	\N	2025-04-12 14:50:37.119	12.7	50.83738911232793	3.258416976457786
PzyOLGVdzRdqnoBSowZww	parcelle rectangulaire 3	Courtrai	8500	2025-04-12 14:50:37.119	YsCOI0rssdA0UktReOxsx	\N	2025-04-12 14:50:37.119	11.2	50.83171265846991	3.266176286006975
KgpU_VIvrO-kC87ulRIa3	parcelle candide 1	Saint-Trond	3800	2025-04-12 14:50:37.119	gUIxGbN9i1muj1FMwXhrI	\N	2025-04-12 14:50:37.119	9	50.81479768333204	5.190649149772859
k9oYcj9E5CC0BtG-qG_me	parcelle propre 2	Saint-Trond	3800	2025-04-12 14:50:37.119	gUIxGbN9i1muj1FMwXhrI	\N	2025-04-12 14:50:37.119	4.1	50.81742003273359	5.191236780311655
fjYs09CMy6-dFIRl2lKou	parcelle rose 3	Saint-Trond	3800	2025-04-12 14:50:37.119	gUIxGbN9i1muj1FMwXhrI	\N	2025-04-12 14:50:37.119	2.8	50.81701275280232	5.184306030099894
_hhLcNWTf2fFfYOzWLczX	parcelle turquoise 4	Saint-Trond	3800	2025-04-12 14:50:37.119	gUIxGbN9i1muj1FMwXhrI	\N	2025-04-12 14:50:37.119	6.8	50.81380974189941	5.18731778787649
KTGICrMmcv7x9yO-ojqqK	parcelle hebdomadaire 1	Bruxelles	1000	2025-04-12 14:50:37.119	fQyLi-UrEvD4d4KICB63-	\N	2025-04-12 14:50:37.119	8.7	50.84705587824578	4.339225474166677
sVuNhNWchjEFGCpjutoGL	parcelle habile 2	Bruxelles	1000	2025-04-12 14:50:37.119	fQyLi-UrEvD4d4KICB63-	\N	2025-04-12 14:50:37.119	8.5	50.84826548604084	4.344644926280131
iyyyYkGQeLB4WFvb2Byyk	parcelle vaste 3	Bruxelles	1000	2025-04-12 14:50:37.119	fQyLi-UrEvD4d4KICB63-	\N	2025-04-12 14:50:37.119	4.6	50.84162923017294	4.34182072050627
FbKU8Otj3YhTHgst66m-o	parcelle terne 1	Ypres	8900	2025-04-12 14:50:37.119	leyUIM7dxbaff62_3uht2	\N	2025-04-12 14:50:37.119	6.4	50.84286982516892	2.894631295605284
wpvAp4ajCSzGK0Vf7bcsf	parcelle mélancolique 2	Ypres	8900	2025-04-12 14:50:37.119	leyUIM7dxbaff62_3uht2	\N	2025-04-12 14:50:37.119	13.6	50.84616081592309	2.891070382421018
bSHEc2TDsVaPfScvnWHXH	parcelle super 3	Ypres	8900	2025-04-12 14:50:37.119	leyUIM7dxbaff62_3uht2	\N	2025-04-12 14:50:37.119	2.1	50.84406572606235	2.891792691934723
jgON-E7kLlVUwQTzHZaFI	parcelle horrible 1	Hal	1500	2025-04-12 14:50:37.119	cEhIyOnj5j_UeFt5yEw0i	\N	2025-04-12 14:50:37.119	13.1	50.73539956206527	4.225345319230655
V2inAw0XvEViSUGoP9zIB	parcelle énorme 2	Hal	1500	2025-04-12 14:50:37.119	cEhIyOnj5j_UeFt5yEw0i	\N	2025-04-12 14:50:37.119	11.1	50.74146011169177	4.220872072155504
qm4drY4QY6GKnVGyYtEay	parcelle jeune 3	Hal	1500	2025-04-12 14:50:37.119	cEhIyOnj5j_UeFt5yEw0i	\N	2025-04-12 14:50:37.119	3.2	50.73871233327121	4.224501120346205
W8PzARVGmkPoHuQ4FEIjl	parcelle émérite 1	Malines	2800	2025-04-12 14:50:37.119	r0BlxEp38qv1NHYFqEFdQ	\N	2025-04-12 14:50:37.119	2.7	51.03241563102921	4.475686318109874
T-dyjJtjwYoqLCw0t-7aC	parcelle orange 2	Malines	2800	2025-04-12 14:50:37.119	r0BlxEp38qv1NHYFqEFdQ	\N	2025-04-12 14:50:37.119	1.9	51.03381017872906	4.473092514405598
29LrD99RZ_JFxDx4jfnuT	parcelle propre 1	Namur	5000	2025-04-12 14:50:37.119	MBcFgpfDKnXmGz0K6yGRq	\N	2025-04-12 14:50:37.119	14.9	50.46462876664598	4.878483526375408
BLiz1C374xhdABDrrC8ut	parcelle âcre 2	Namur	5000	2025-04-12 14:50:37.119	MBcFgpfDKnXmGz0K6yGRq	\N	2025-04-12 14:50:37.119	12.9	50.46577168525225	4.878457912338894
DgemIn-gNwzpLQBmZDBFi	parcelle triste 1	Binche	7130	2025-04-12 14:50:37.119	FAMZZfVyLIHM2PYJ7vhKD	\N	2025-04-12 14:50:37.119	10.8	50.40937279157421	4.167996125304041
3B1s7Wx4_nKkENbKd3kdX	parcelle serviable 2	Binche	7130	2025-04-12 14:50:37.119	FAMZZfVyLIHM2PYJ7vhKD	\N	2025-04-12 14:50:37.119	2.1	50.40588188152701	4.169318151354731
452vFHgc8p_mi5SkUBa7R	parcelle sale 3	Binche	7130	2025-04-12 14:50:37.119	FAMZZfVyLIHM2PYJ7vhKD	\N	2025-04-12 14:50:37.119	5	50.40563528757144	4.167525386736932
fcyWRKxu_pPuxpD0HPOt5	parcelle hypocrite 1	Verviers	4800	2025-04-12 14:50:37.119	zvNp9b6PnNIZeD--5Z9ll	\N	2025-04-12 14:50:37.119	7.9	50.58702899766801	5.864175631449368
1fwKWx08ur6M0D5KpeCee	parcelle minuscule 2	Verviers	4800	2025-04-12 14:50:37.119	zvNp9b6PnNIZeD--5Z9ll	\N	2025-04-12 14:50:37.119	13.1	50.59060747997004	5.857915343379789
Y6vJB4FN8ErL6rQRJTAJC	parcelle tendre 3	Verviers	4800	2025-04-12 14:50:37.119	zvNp9b6PnNIZeD--5Z9ll	\N	2025-04-12 14:50:37.119	9.5	50.58959592674284	5.861279209793698
p6hlv5fWqflPL8k-rzlDf	parcelle minuscule 4	Verviers	4800	2025-04-12 14:50:37.119	zvNp9b6PnNIZeD--5Z9ll	\N	2025-04-12 14:50:37.119	15	50.59276327239313	5.864812425459794
KLpY0xyshcVv0OEw2vdv8	parcelle insolite 1	Waterloo	1410	2025-04-12 14:50:37.119	iF1Oj8kHOwqBgAhnFKehB	\N	2025-04-12 14:50:37.119	1.7	50.70445508980664	4.399358934492199
jNZ2kd4n4yGP-Nd7Iq_Y8	parcelle aimable 2	Waterloo	1410	2025-04-12 14:50:37.119	iF1Oj8kHOwqBgAhnFKehB	\N	2025-04-12 14:50:37.119	11.9	50.70700776792687	4.400503586774975
7ArE__q3LwdF84mWgj4JD	parcelle amorphe 3	Waterloo	1410	2025-04-12 14:50:37.119	iF1Oj8kHOwqBgAhnFKehB	\N	2025-04-12 14:50:37.119	8.9	50.71107754155228	4.399640247086579
th9K-dkVM-3AXISd4xPv2	parcelle énorme 4	Waterloo	1410	2025-04-12 14:50:37.119	iF1Oj8kHOwqBgAhnFKehB	\N	2025-04-12 14:50:37.119	4.2	50.70249670142643	4.40112570013015
bR8sxSfiQ_ZoTKOIHC_dp	parcelle sympathique 1	Waremme	4300	2025-04-12 14:50:37.119	MP7octWq0nu5MR0er4YLK	\N	2025-04-12 14:50:37.119	2.3	50.68319477845676	5.266003453003047
HyoKtLi8PT6zhoMduEJlc	parcelle sombre 2	Waremme	4300	2025-04-12 14:50:37.119	MP7octWq0nu5MR0er4YLK	\N	2025-04-12 14:50:37.119	4.7	50.68496660812818	5.258744791507052
bb2MXqa0LcloFrH_wyoxB	parcelle avare 3	Waremme	4300	2025-04-12 14:50:37.119	MP7octWq0nu5MR0er4YLK	\N	2025-04-12 14:50:37.119	5.3	50.68263387557153	5.257799705979683
Gej5k9H9awIOKwGHF0SGo	parcelle habile 4	Waremme	4300	2025-04-12 14:50:37.119	MP7octWq0nu5MR0er4YLK	\N	2025-04-12 14:50:37.119	6.4	50.68884921464891	5.260918637741707
VSt0V-wF_vLUJBCfPY7fp	parcelle immense 1	Hal	1500	2025-04-12 14:50:37.119	XUMqJAeC_lx2-92ivoeGz	\N	2025-04-12 14:50:37.119	14.2	50.73991464698212	4.228358648675056
YCf9xuOErqPfOBGZ6zmVA	parcelle dynamique 2	Hal	1500	2025-04-12 14:50:37.119	XUMqJAeC_lx2-92ivoeGz	\N	2025-04-12 14:50:37.119	4.4	50.735770028925	4.232918098989623
8uOtGqPHFEjd39y8cMmTZ	parcelle hypocrite 3	Hal	1500	2025-04-12 14:50:37.119	XUMqJAeC_lx2-92ivoeGz	\N	2025-04-12 14:50:37.119	1.7	50.73509795783301	4.224276043955046
an3fq0dhR1d7tpK_-UUO4	parcelle maigre 4	Hal	1500	2025-04-12 14:50:37.119	XUMqJAeC_lx2-92ivoeGz	\N	2025-04-12 14:50:37.119	0.7	50.73470388321226	4.231309464602983
CUpCwNJupUF1_jetEg3i7	parcelle énergique 1	Tervuren	3080	2025-04-12 14:50:37.119	pceTXsRnASDnRvPE7GRU6	\N	2025-04-12 14:50:37.119	2	50.82786322644821	4.508305895656472
Hx0UknLf-G6LH721vLZVT	parcelle multiple 2	Tervuren	3080	2025-04-12 14:50:37.119	pceTXsRnASDnRvPE7GRU6	\N	2025-04-12 14:50:37.119	2.8	50.8291846189972	4.512348606106745
IYLtuyKVlVglihqHsYvvT	parcelle sympathique 3	Tervuren	3080	2025-04-12 14:50:37.119	pceTXsRnASDnRvPE7GRU6	\N	2025-04-12 14:50:37.119	6.3	50.82831496776154	4.510595816328907
dNEAnZ8GOiPu-p7UxVd0w	parcelle circulaire 4	Tervuren	3080	2025-04-12 14:50:37.119	pceTXsRnASDnRvPE7GRU6	\N	2025-04-12 14:50:37.119	4.6	50.82831908752906	4.513071521688063
P84jFqn7cVrLpACYLViIY	parcelle immense 1	Mouscron	7700	2025-04-12 14:50:37.119	sx42u79y3-RMcrcu-W1EK	\N	2025-04-12 14:50:37.119	1.2	50.74080968849595	3.223252006854942
GpdZe3d2QspVjZbq8Pl3R	parcelle neutre 2	Mouscron	7700	2025-04-12 14:50:37.119	sx42u79y3-RMcrcu-W1EK	\N	2025-04-12 14:50:37.119	1.2	50.74018433707415	3.219417309087847
OFIS-8bt9JoWM4qyzvn2N	parcelle lâche 3	Mouscron	7700	2025-04-12 14:50:37.119	sx42u79y3-RMcrcu-W1EK	\N	2025-04-12 14:50:37.119	2.1	50.73673729560024	3.219670336748837
2OPMkZr-bn512BJSYKzxW	parcelle hebdomadaire 4	Mouscron	7700	2025-04-12 14:50:37.119	sx42u79y3-RMcrcu-W1EK	\N	2025-04-12 14:50:37.119	2	50.73590578990216	3.222432224207834
lX_JsRM5clkGq7KQlBIFz	parcelle magenta 1	Waterloo	1410	2025-04-12 14:50:37.119	V2nlDOTnYDXbwByTCcQfm	\N	2025-04-12 14:50:37.119	9.4	50.71313834399886	4.403514371623093
vgtfZgGfZFx9WMxTY8V6o	parcelle lunatique 2	Waterloo	1410	2025-04-12 14:50:37.119	V2nlDOTnYDXbwByTCcQfm	\N	2025-04-12 14:50:37.119	2.2	50.70776463642379	4.403788003031363
uOvKNGNbuLivwCk1FydkF	parcelle charitable 3	Waterloo	1410	2025-04-12 14:50:37.119	V2nlDOTnYDXbwByTCcQfm	\N	2025-04-12 14:50:37.119	5.1	50.70609172733437	4.400211866169898
VG8LyzRBhmc6B45_txlLW	parcelle terne 4	Waterloo	1410	2025-04-12 14:50:37.119	V2nlDOTnYDXbwByTCcQfm	\N	2025-04-12 14:50:37.119	4.9	50.70762628747072	4.404978909409936
IZYFHyy5eTXRSkIwjrKn9	parcelle infime 1	Louvain	3000	2025-04-12 14:50:37.119	lth_axCFjRAni3_eGm5YP	\N	2025-04-12 14:50:37.119	11	50.87484350255527	4.703235603835656
GSyBAjCltdvW4lg_iQyMh	parcelle vivace 2	Louvain	3000	2025-04-12 14:50:37.119	lth_axCFjRAni3_eGm5YP	\N	2025-04-12 14:50:37.119	1.2	50.87528733214344	4.696763760334808
zEJdfduCVwGSmdpKFMuJD	parcelle infime 3	Louvain	3000	2025-04-12 14:50:37.119	lth_axCFjRAni3_eGm5YP	\N	2025-04-12 14:50:37.119	9.5	50.87729173432533	4.702075409507441
wNUBnEEFOmN1vP2-i3gUg	parcelle délectable 1	Charleroi	6000	2025-04-12 14:50:37.119	z2u45DHKI5NsZ3OBGHIMh	\N	2025-04-12 14:50:37.119	1.3	50.40907261204282	4.447176542192659
QFpE1EMybvJp3SxE8_sOK	parcelle blême 2	Charleroi	6000	2025-04-12 14:50:37.119	z2u45DHKI5NsZ3OBGHIMh	\N	2025-04-12 14:50:37.119	14.1	50.40812798531522	4.44472571069882
3rDUdoFSc1uotbYOWsliO	parcelle téméraire 3	Charleroi	6000	2025-04-12 14:50:37.119	z2u45DHKI5NsZ3OBGHIMh	\N	2025-04-12 14:50:37.119	11.9	50.40948694846701	4.44920683362475
ED7J3KF4hGJFh2rKAcIkg	parcelle novice 1	Durbuy	6940	2025-04-12 14:50:37.119	43Qo4seZqDKrUXlFzPZWN	\N	2025-04-12 14:50:37.119	5.8	50.35578033833789	5.444302932429673
MroIkjgYjCOFlaLuM7d3Z	parcelle hirsute 2	Durbuy	6940	2025-04-12 14:50:37.119	43Qo4seZqDKrUXlFzPZWN	\N	2025-04-12 14:50:37.119	4.1	50.35283729222618	5.450022492178634
-A4iAEfMLwrTdc7BQSW_L	parcelle ferme 3	Durbuy	6940	2025-04-12 14:50:37.119	43Qo4seZqDKrUXlFzPZWN	\N	2025-04-12 14:50:37.119	10.9	50.35601778936119	5.447870128123457
yclgFVQ5THz-1tA3o7dVB	parcelle géométrique 1	Verviers	4800	2025-04-12 14:50:37.119	qEdZXK4mRM5u-FswMjUHg	\N	2025-04-12 14:50:37.119	13.4	50.59335810591861	5.871267336672327
m-X8OPOWSH6f8Ka1rdXog	parcelle affable 2	Verviers	4800	2025-04-12 14:50:37.119	qEdZXK4mRM5u-FswMjUHg	\N	2025-04-12 14:50:37.119	6.2	50.59136824510706	5.875652220603332
Cnl9OQpp6TGsWXwS1vmPm	parcelle amorphe 1	Tervuren	3080	2025-04-12 14:50:37.119	_K8gF9cl9d7olfCltQtrH	\N	2025-04-12 14:50:37.119	12.9	50.82306057357988	4.518966175574261
RZlrTVih59jZTBizeR8Ma	parcelle insipide 2	Tervuren	3080	2025-04-12 14:50:37.119	_K8gF9cl9d7olfCltQtrH	\N	2025-04-12 14:50:37.119	8.8	50.82039251250884	4.517755167353504
XzJ_J4xJILOymy-UQ6sw-	parcelle perplexe 3	Tervuren	3080	2025-04-12 14:50:37.119	_K8gF9cl9d7olfCltQtrH	\N	2025-04-12 14:50:37.119	14.6	50.82131200443783	4.516093109072052
kRpf9UTJ5RbBKPs8S4YEE	parcelle gigantesque 1	Huy	4500	2025-04-12 14:50:37.119	oV-UkmJaBOptLUDR1clTk	\N	2025-04-12 14:50:37.119	5	50.52444601762784	5.238496285327932
TjPhdDFfO6jxGiaz1uNlW	parcelle immense 2	Huy	4500	2025-04-12 14:50:37.119	oV-UkmJaBOptLUDR1clTk	\N	2025-04-12 14:50:37.119	9.1	50.52560647060241	5.240642462687194
1SDPSzxLMRcIfiULUXolH	parcelle sage 3	Huy	4500	2025-04-12 14:50:37.119	oV-UkmJaBOptLUDR1clTk	\N	2025-04-12 14:50:37.119	1.8	50.52150148453003	5.24525893415983
UdW3vQKZQaMZvCdRm8X4f	parcelle habile 1	La Louvière	7100	2025-04-12 14:50:37.119	TxaOI0xqHuXKzACpRk5oB	\N	2025-04-12 14:50:37.119	13.3	50.47628100530848	4.183248808205024
Ig7VVAbI2Fo89hqwurT-q	parcelle émérite 2	La Louvière	7100	2025-04-12 14:50:37.119	TxaOI0xqHuXKzACpRk5oB	\N	2025-04-12 14:50:37.119	3.5	50.47903227292593	4.180407421103001
1uxOzwfNuPunVVChkPgcH	parcelle rapide 3	La Louvière	7100	2025-04-12 14:50:37.119	TxaOI0xqHuXKzACpRk5oB	\N	2025-04-12 14:50:37.119	12.4	50.47888678509435	4.184173193629426
5anlYN-ef1gYAr-V7y7Tj	parcelle adorable 4	La Louvière	7100	2025-04-12 14:50:37.119	TxaOI0xqHuXKzACpRk5oB	\N	2025-04-12 14:50:37.119	3.7	50.47731785548407	4.185418843198085
7zGFJmK058Dy6S8wUt9gI	parcelle spécialiste 1	Tournai	7500	2025-04-12 14:50:37.119	MCx1wS4smMu7pfOyeQBQB	\N	2025-04-12 14:50:37.119	4.7	50.61185332538928	3.396177097993903
Cqj2U93dlq0xGekvapGml	parcelle orange 2	Tournai	7500	2025-04-12 14:50:37.119	MCx1wS4smMu7pfOyeQBQB	\N	2025-04-12 14:50:37.119	11.1	50.61538574392444	3.395553000024998
D2bzp4j-zYZnXFVWSbaWS	parcelle infime 1	Mons	7000	2025-04-12 14:50:37.119	p9Fe_5WtWOW2mlo4gcfgR	\N	2025-04-12 14:50:37.119	10.5	50.44388677075803	3.950990367175884
KD8Vxdn3uZqtqQnlR38SF	parcelle brusque 2	Mons	7000	2025-04-12 14:50:37.119	p9Fe_5WtWOW2mlo4gcfgR	\N	2025-04-12 14:50:37.119	2	50.44882254322716	3.950008836465008
yjA9CSCLNrqqDX6RD0XCd	parcelle brave 3	Mons	7000	2025-04-12 14:50:37.119	p9Fe_5WtWOW2mlo4gcfgR	\N	2025-04-12 14:50:37.119	2.1	50.44491567154214	3.943530531205988
JshjlErCxTWpwqZhdenyO	parcelle sédentaire 4	Mons	7000	2025-04-12 14:50:37.119	p9Fe_5WtWOW2mlo4gcfgR	\N	2025-04-12 14:50:37.119	4.6	50.44111555224749	3.950126010899622
0c7hjCT3kHrssY0UCol45	parcelle désagréable 1	Silly	7830	2025-04-12 14:50:37.119	Mcooobkf_KSdQC4ZRxbGZ	\N	2025-04-12 14:50:37.119	8.2	50.65138102667351	3.920766742378898
GO_-fIceobMhKeXF3v2A1	parcelle maigre 2	Silly	7830	2025-04-12 14:50:37.119	Mcooobkf_KSdQC4ZRxbGZ	\N	2025-04-12 14:50:37.119	3.2	50.64785897560963	3.915384226293352
n3MFyjMImatsZptzKrvdk	parcelle âcre 3	Silly	7830	2025-04-12 14:50:37.119	Mcooobkf_KSdQC4ZRxbGZ	\N	2025-04-12 14:50:37.119	2.5	50.65108926423118	3.921491339509356
tiSx17fI49ZFM2ZnTgLNx	parcelle aigre 1	Ath	7800	2025-04-12 14:50:37.119	29RS2XL-Y9dywDxhlHV1s	\N	2025-04-12 14:50:37.119	2	50.6371145548259	3.7676392843838
7OdtZ4aNnX5iTxGmQXs1U	parcelle vétuste 2	Ath	7800	2025-04-12 14:50:37.119	29RS2XL-Y9dywDxhlHV1s	\N	2025-04-12 14:50:37.119	5.9	50.62954851418104	3.771221401394206
YLMQwhRIJ8DFZLWLR1B7T	parcelle mélancolique 3	Ath	7800	2025-04-12 14:50:37.119	29RS2XL-Y9dywDxhlHV1s	\N	2025-04-12 14:50:37.119	7.8	50.63571393828413	3.767760132101534
LKoJeYBfqR1rlVViPcSu2	parcelle infime 1	Nivelles	1400	2025-04-12 14:50:37.119	8w3MlQ7sblzXtXLqoMZPc	\N	2025-04-12 14:50:37.119	13.4	50.5917235382643	4.333518972090538
pwXRi5d92JXtagxCKYAUI	parcelle mature 2	Nivelles	1400	2025-04-12 14:50:37.119	8w3MlQ7sblzXtXLqoMZPc	\N	2025-04-12 14:50:37.119	12.6	50.59719503651241	4.331723254413015
muygLO4EVtLrY-eLyiNeK	parcelle terne 1	Couvin	5660	2025-04-12 14:50:37.119	FYdG7yJHfhHsHzgA08xGM	\N	2025-04-12 14:50:37.119	14.2	50.04595423858348	4.475967992254595
hiQ3PIj33cELxFAoeOrJ2	parcelle placide 2	Couvin	5660	2025-04-12 14:50:37.119	FYdG7yJHfhHsHzgA08xGM	\N	2025-04-12 14:50:37.119	5.7	50.04871847389332	4.478464084145577
TinWLCw2SLqvletYw5bly	parcelle énergique 3	Couvin	5660	2025-04-12 14:50:37.119	FYdG7yJHfhHsHzgA08xGM	\N	2025-04-12 14:50:37.119	3	50.04965850903328	4.484819826311399
60w3zgiZM1eNS8W4Xug6v	parcelle fade 4	Couvin	5660	2025-04-12 14:50:37.119	FYdG7yJHfhHsHzgA08xGM	\N	2025-04-12 14:50:37.119	1.4	50.04216578547094	4.480955435460608
MYIFO8FnpDOq883agVsXA	parcelle vorace 1	Bastogne	6600	2025-04-12 14:50:37.119	ffm_RTt6FHnn8a-3-FYbm	\N	2025-04-12 14:50:37.119	2	50.00719912875864	5.714956949077077
g6oD9qefOqS0HtmY5Apzw	parcelle orange 2	Bastogne	6600	2025-04-12 14:50:37.119	ffm_RTt6FHnn8a-3-FYbm	\N	2025-04-12 14:50:37.119	4.8	50.00094410080403	5.712110165081452
ZsnAX82iLayS3AdbIRT3q	parcelle apte 1	Neufchâteau	6840	2025-04-12 14:50:37.119	pAM5gKGJj7WhpenC2OHM9	\N	2025-04-12 14:50:37.119	5	49.83677593721252	5.445941542717931
YW_Y0eRpKBWMD0YdgNLfi	parcelle aimable 2	Neufchâteau	6840	2025-04-12 14:50:37.119	pAM5gKGJj7WhpenC2OHM9	\N	2025-04-12 14:50:37.119	14.1	49.83573599747278	5.448994161392561
e6gzAlMUn4XKoB6LarYj2	parcelle sage 3	Neufchâteau	6840	2025-04-12 14:50:37.119	pAM5gKGJj7WhpenC2OHM9	\N	2025-04-12 14:50:37.119	12	49.83622752851412	5.444138254696653
FaoHrJPRlEKGf8YB9ibbr	parcelle innombrable 4	Neufchâteau	6840	2025-04-12 14:50:37.119	pAM5gKGJj7WhpenC2OHM9	\N	2025-04-12 14:50:37.119	5.3	49.83096745805763	5.447292220555846
YHnD7vfGnoqIt5-1y6g3Z	parcelle dynamique 1	Thuin	6530	2025-04-12 14:50:37.119	IkXfR1oW76oceo7Nf_De_	\N	2025-04-12 14:50:37.119	12.6	50.34994052077533	4.306882368587607
IilUUSh_t6GGZ1xGiCcbp	parcelle perplexe 2	Thuin	6530	2025-04-12 14:50:37.119	IkXfR1oW76oceo7Nf_De_	\N	2025-04-12 14:50:37.119	5.5	50.34570455724619	4.299155732953847
LImu23zGn-F09qow5vGPf	parcelle aigre 3	Thuin	6530	2025-04-12 14:50:37.119	IkXfR1oW76oceo7Nf_De_	\N	2025-04-12 14:50:37.119	7.7	50.34690899279746	4.298101628992486
XJnApdhPYkcNvryLFfoSW	parcelle large 4	Thuin	6530	2025-04-12 14:50:37.119	IkXfR1oW76oceo7Nf_De_	\N	2025-04-12 14:50:37.119	13.1	50.34724272134464	4.304113347847508
evO6_nCxScosCjsbXFHyw	parcelle extra 1	Ath	7800	2025-04-12 14:50:37.119	n58irKwczw5ByTr0VzBJH	\N	2025-04-12 14:50:37.119	14.5	50.63927923382543	3.776527079053607
Nd-6VPgY2lPeL6JdwnUg3	parcelle mince 2	Ath	7800	2025-04-12 14:50:37.119	n58irKwczw5ByTr0VzBJH	\N	2025-04-12 14:50:37.119	7.5	50.64132385297633	3.779278914603933
XAUDRHy1Xyknk2U_cEkuv	parcelle sombre 1	Liège	4000	2025-04-12 14:50:37.119	2pKjdrY11rFSC2M-dmFSZ	\N	2025-04-12 14:50:37.119	7.6	50.63930840824981	5.578628776813507
Q1K-L2edZorGrz7tzY6JY	parcelle pauvre 2	Liège	4000	2025-04-12 14:50:37.119	2pKjdrY11rFSC2M-dmFSZ	\N	2025-04-12 14:50:37.119	3.9	50.63517391993105	5.573950104421851
KV3z2tq75nWg4Rn6h1nc0	parcelle candide 3	Liège	4000	2025-04-12 14:50:37.119	2pKjdrY11rFSC2M-dmFSZ	\N	2025-04-12 14:50:37.119	4.2	50.63672162153874	5.574608702008452
9tyknVeoXs1R0Tj-eP8e1	parcelle aigre 4	Liège	4000	2025-04-12 14:50:37.119	2pKjdrY11rFSC2M-dmFSZ	\N	2025-04-12 14:50:37.119	12.5	50.63983657389152	5.574411833994072
X5F_HZkhi_ua3qssGBATy	parcelle pourpre 1	Nivelles	1400	2025-04-12 14:50:37.119	Bx1Sz03iwlJDDSdU2ulUy	\N	2025-04-12 14:50:37.119	0.8	50.59605390425796	4.327180235022493
7XWeddCXfYggueqvfWSTT	parcelle candide 2	Nivelles	1400	2025-04-12 14:50:37.119	Bx1Sz03iwlJDDSdU2ulUy	\N	2025-04-12 14:50:37.119	11.7	50.59833114372316	4.327910268146978
2KV3U_P66ER_NXUbMJ9zt	parcelle turquoise 3	Nivelles	1400	2025-04-12 14:50:37.119	Bx1Sz03iwlJDDSdU2ulUy	\N	2025-04-12 14:50:37.119	13.9	50.5923070851577	4.332515019112803
Y7AtlVhQc0UdV4asrQ453	parcelle tranquille 4	Nivelles	1400	2025-04-12 14:50:37.119	Bx1Sz03iwlJDDSdU2ulUy	\N	2025-04-12 14:50:37.119	1.8	50.59440759644615	4.33034144279233
MF_3u0GutjyQHxStVs_9t	parcelle âcre 1	Binche	7130	2025-04-12 14:50:37.119	Z2mBMBpi3wRn0L_cLHuFZ	\N	2025-04-12 14:50:37.119	6.2	50.40498941287445	4.169698347034762
ZqW8j4kba5Pnm9uoqcrTI	parcelle débile 2	Binche	7130	2025-04-12 14:50:37.119	Z2mBMBpi3wRn0L_cLHuFZ	\N	2025-04-12 14:50:37.119	0.6	50.40896836677081	4.162115951436101
gruQ0zdHdewMIrvy8Orus	parcelle minuscule 1	La Louvière	7100	2025-04-12 14:50:37.119	zdnhlTzlFXa7dRLGvsKsv	\N	2025-04-12 14:50:37.119	5.7	50.48420844038533	4.175038299203027
MSwpbT3gItKLHz5qSRRtu	parcelle marron 2	La Louvière	7100	2025-04-12 14:50:37.119	zdnhlTzlFXa7dRLGvsKsv	\N	2025-04-12 14:50:37.119	2.8	50.48861921390393	4.176812173243026
laFYSdTD9skI9ZanQQ5tT	parcelle émérite 3	La Louvière	7100	2025-04-12 14:50:37.119	zdnhlTzlFXa7dRLGvsKsv	\N	2025-04-12 14:50:37.119	9.5	50.48958461881162	4.173727813203609
i13Z62ryjFZNxzHTrM-oX	parcelle tranquille 4	La Louvière	7100	2025-04-12 14:50:37.119	zdnhlTzlFXa7dRLGvsKsv	\N	2025-04-12 14:50:37.119	14.9	50.49077695367738	4.180548979783811
haPPhGK8GO-Ov6s_01hvz	parcelle orange 1	Genk	3600	2025-04-12 14:50:37.119	JMIWN5E0kEFCsIhtiKa1B	\N	2025-04-12 14:50:37.119	15	50.95747468415959	5.510267115404354
cNcH2SE089Kg3V8IUFRh8	parcelle intrépide 2	Genk	3600	2025-04-12 14:50:37.119	JMIWN5E0kEFCsIhtiKa1B	\N	2025-04-12 14:50:37.119	4.4	50.95726830743681	5.516688774542823
cBq9TbyX9D0q0CWpUP_yC	parcelle cyan 3	Genk	3600	2025-04-12 14:50:37.119	JMIWN5E0kEFCsIhtiKa1B	\N	2025-04-12 14:50:37.119	1.1	50.96304858951752	5.510868024082631
lP-q5LdTNudE3IZ3zkazE	parcelle immense 1	Bastogne	6600	2025-04-12 14:50:37.119	1Q8s7_F7ZDziM5o6ahH8P	\N	2025-04-12 14:50:37.119	11.3	50.00070079923174	5.718643107893117
1bFhBup7C1yM1SV_qkL5G	parcelle rectangulaire 2	Bastogne	6600	2025-04-12 14:50:37.119	1Q8s7_F7ZDziM5o6ahH8P	\N	2025-04-12 14:50:37.119	7	50.00104067184849	5.720649928045748
08SD1N0TqV_1nTFiP-5-g	parcelle antique 3	Bastogne	6600	2025-04-12 14:50:37.119	1Q8s7_F7ZDziM5o6ahH8P	\N	2025-04-12 14:50:37.119	14.6	50.00339075173957	5.713528576427143
mDJvGNZ5qepXMsFcfGBav	parcelle magenta 1	Dinant	5500	2025-04-12 14:50:37.119	cVO8qCnrAfJUriv5PADy6	\N	2025-04-12 14:50:37.119	11.1	50.26783792698262	4.920839089303843
1kTMjk4bswXoFBJiv2Lbd	parcelle hebdomadaire 2	Dinant	5500	2025-04-12 14:50:37.119	cVO8qCnrAfJUriv5PADy6	\N	2025-04-12 14:50:37.119	3.7	50.26452355889438	4.913178252901343
GQ4paS63GQuJ9EJz3Swfm	parcelle loufoque 3	Dinant	5500	2025-04-12 14:50:37.119	cVO8qCnrAfJUriv5PADy6	\N	2025-04-12 14:50:37.119	7.2	50.26635922596736	4.914266351220523
jyNEsKMhKD2NaYVWHuMFN	parcelle timide 1	Neufchâteau	6840	2025-04-12 14:50:37.119	Ip2TODmVnAXAlnE8mnEWT	\N	2025-04-12 14:50:37.119	12.8	49.85326337064271	5.442313426341914
PlgcnS53FSCXdfXkkDX0M	parcelle magenta 2	Neufchâteau	6840	2025-04-12 14:50:37.119	Ip2TODmVnAXAlnE8mnEWT	\N	2025-04-12 14:50:37.119	7.4	49.85134854089414	5.440558348749732
0TL0mlX10paqSepL9CFGv	parcelle vaste 3	Neufchâteau	6840	2025-04-12 14:50:37.119	Ip2TODmVnAXAlnE8mnEWT	\N	2025-04-12 14:50:37.119	12.6	49.85100787894464	5.444129976069617
eUj-b3q-BL88vH91YF1eB	parcelle loufoque 4	Neufchâteau	6840	2025-04-12 14:50:37.119	Ip2TODmVnAXAlnE8mnEWT	\N	2025-04-12 14:50:37.119	6.5	49.85285143424444	5.440447083114628
RmBESCbFRAfu5Fcil1kkB	parcelle délectable 1	Houffalize	6660	2025-04-12 14:50:37.119	TXySQSj6g89x1XZS5ZOSC	\N	2025-04-12 14:50:37.119	4.4	50.14811319567572	5.780805504348899
KV5NWlhgWPoXwwEfROb1S	parcelle sage 2	Houffalize	6660	2025-04-12 14:50:37.119	TXySQSj6g89x1XZS5ZOSC	\N	2025-04-12 14:50:37.119	0.6	50.14521923745754	5.785855135178244
_Lcw_dsXX7r_FgGGV-sOC	parcelle sauvage 1	Huy	4500	2025-04-12 14:50:37.119	dWs2qFizss2zd-ie2gVLK	\N	2025-04-12 14:50:37.119	1.3	50.51955607660365	5.236011517611372
NKnCg111j2Ni5NBf7drva	parcelle fourbe 2	Huy	4500	2025-04-12 14:50:37.119	dWs2qFizss2zd-ie2gVLK	\N	2025-04-12 14:50:37.119	8	50.52245797730288	5.234543718431693
yXKD-cJLQgJK_XvG2PPIr	parcelle mince 3	Huy	4500	2025-04-12 14:50:37.119	dWs2qFizss2zd-ie2gVLK	\N	2025-04-12 14:50:37.119	3.7	50.51962720475211	5.231649793397819
OXEWDbstc4BYujXJU90ID	parcelle sale 1	Malines	2800	2025-04-12 14:50:37.119	tYjYGe7dTHZYuTz4dP2CV	\N	2025-04-12 14:50:37.119	9.2	51.03779367689771	4.473387767624633
FTJdkBQ4D_aub1i3Lo2la	parcelle altruiste 2	Malines	2800	2025-04-12 14:50:37.119	tYjYGe7dTHZYuTz4dP2CV	\N	2025-04-12 14:50:37.119	3.8	51.03643314479201	4.465728111245313
mV7qBcn-fe1uCfa5Vwcv6	parcelle magenta 3	Malines	2800	2025-04-12 14:50:37.119	tYjYGe7dTHZYuTz4dP2CV	\N	2025-04-12 14:50:37.119	6.2	51.03176939801997	4.473177616057755
l_KrDnickFxH3Vew-M_Xb	parcelle vaste 1	Ciney	5590	2025-04-12 14:50:37.119	u6L6CgTQCD7jtW62p914i	\N	2025-04-12 14:50:37.119	2.3	50.30591085806664	5.098094638356342
14_m0TUoeIwTXEWBMbKA2	parcelle rapide 2	Ciney	5590	2025-04-12 14:50:37.119	u6L6CgTQCD7jtW62p914i	\N	2025-04-12 14:50:37.119	7.4	50.29855523858426	5.099324061158316
yr7WRNGBQahCwGZeCQZHd	parcelle énorme 1	La Louvière	7100	2025-04-12 14:50:37.119	HW1wbynWKjc8FH6JbZ8FI	\N	2025-04-12 14:50:37.119	13.8	50.47821692090836	4.176895769139041
a7wrxCNV2qiZYkbZFjnR-	parcelle circulaire 2	La Louvière	7100	2025-04-12 14:50:37.119	HW1wbynWKjc8FH6JbZ8FI	\N	2025-04-12 14:50:37.119	11.7	50.47758119384847	4.179427172571273
lFS81U8hTP1tzaxp5PGuk	parcelle extra 1	Soignies	7060	2025-04-12 14:50:37.119	J5uK9XD027O7lWktbp0UV	\N	2025-04-12 14:50:37.119	2.4	50.57555791210309	4.073937554626304
gnO6PLlKGJrar3FqK8Qxv	parcelle amorphe 2	Soignies	7060	2025-04-12 14:50:37.119	J5uK9XD027O7lWktbp0UV	\N	2025-04-12 14:50:37.119	1.8	50.5763288765738	4.07724280251357
QJxqiZW2qQcBLfFdhnG5P	parcelle innombrable 1	Saint-Trond	3800	2025-04-12 14:50:37.119	0e2a83vStscFV9QTJDBT_	\N	2025-04-12 14:50:37.119	10.7	50.81132312380281	5.180796080040779
6MxaS2PLwlKVq4ZFL5zRB	parcelle snob 2	Saint-Trond	3800	2025-04-12 14:50:37.119	0e2a83vStscFV9QTJDBT_	\N	2025-04-12 14:50:37.119	8.4	50.81962693575726	5.175221653271664
odFNppnikNfBzaBhvxNFP	parcelle sage 3	Saint-Trond	3800	2025-04-12 14:50:37.119	0e2a83vStscFV9QTJDBT_	\N	2025-04-12 14:50:37.119	3.8	50.81569652814564	5.174300375375767
HEwb8wUMbD4op9eYKu4IT	parcelle fidèle 4	Saint-Trond	3800	2025-04-12 14:50:37.119	0e2a83vStscFV9QTJDBT_	\N	2025-04-12 14:50:37.119	6.6	50.8130825435096	5.181602111937154
\.


--
-- Data for Name: gleanings; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.gleanings (id, announcement_id, status, created_at, updated_at) FROM stdin;
J6twKdCWxwDj38C1zZgzA	t2OIph_jPE1gEx1yx4tN6	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
pPmv8U0zAgbag3Ol82xTO	AgQzbzTYDqQlwkgw9rpLW	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
vtoHveytwd8nnzAE4GTFu	m6k0-cdG8a4S9BU9pTem7	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
hRo4eCy717ssKc3cQFvd_	593TH-YvT1IEIUlv8Av0-	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
fNBm95ZFRNAEoRwtjdgnK	ZZmBO1NemY6n27xKeLx5h	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
WQqc7H41m8UEZ20EWTiLG	SA3UQrYL-kkTy2Hn7QTXt	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
7aoDWsJUn0oTmi-qLe0-9	xV-GX31bRUoAYBI_yHBJG	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
zzYXjC-od9NF93WY440BW	ZsXZvXjDkQ6dfy8J8pOvM	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
oOWXWFJj3HzGTvWYTSBpW	WkgNP-aGoyggpCJb-Lsh_	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
_xzxp-0y44OC6aerZeJFK	lC13n180G25luBWssT10w	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
x37VYlQA-RT6xSzGlq4Ay	sgms5Mqayn9-TSiIHMjrW	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
PCVZAEC97W-Hg5xqPrLwh	LjPDpNxT4sXvJHkWn8Rt_	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
BnV-kuJ6jxCMzhVvQRDF-	hpCO_WzCbnfohAfzR-4kj	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
AR8lmKJzPSphwfj8illFG	n6sUvfV9UTR4-IRMZdvrl	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
tuCke_reGK8SrqIp6iuVk	zRDkgZiOHFFRBykHBtMGE	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
Ph2Xazqrz2TM6_NtNl-U4	X9qozYxZEOaSZ9_I-GJfB	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
YOa5LvBb9CCf5d5a4gHKx	KTIjtoqx2WTQ8A1RWQeHI	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
997CDGquJfGvgk_tFGooe	xXs54eC9o2LiUxT8ID1Di	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
zXuhMWdKLHGpyyWaRPM7V	zsEYCJoJWPsChp-W5KLa5	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
_hkNRztq77DpDmhSWdbvr	epkQ_T677Vq_e5yMCUQ3N	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
9c5VC3xlL6UJTFr_Ej20y	I718Lc9SJj8zTMuYquPtF	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
MNWY1NEdaaUEVDCm4a_3i	VbR_ED8TreHOcaGwg3lAZ	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
DHd8YaOr7BK7P3_yEYaBz	nym2RjK2Z_9K1Hz84aH9x	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
nwlA-81c1KltSNYBMVynH	525tzQm8k1vMUS_YHFeqf	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
If3TciPjbDwwpn5xhSjFb	Im3ksyiZXOMQzrE9ebzJl	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
Q4h4xITVX-TZaLFjrF2Id	QWNusjxFMjHgyQao24kEF	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
8a7tfT4i8XP2ZfuzAl2St	5-SS6fZ0rWuUTYfDQG5Fw	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
6HYGUUp5wlMb3yqIw4z89	0LHyvXcJ-PEJmM7Q5CDls	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
AnxJd1gceN2RwniOOhyax	YwFvzpx0Eve9YinspVpdm	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
3v_5UI-6XRPjH_BMrtVTc	tz2YENwQmp89yI4ktbvm5	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
SVQkMHPnP4S-p66XA6wy1	Uu1BSM3RBS9zX5GZsVB3H	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
fvsGk_xPAKsbzv_G4GEvg	kCvlW0iXqYsKhrubalwDG	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
YE64h3hJza0DmO5pWax8c	HMqHLNTxFYvqUYUVKkiVV	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
VqO8lJeIvjJgk01dioaDF	gAzjBkkyUUB7o-04IrEAi	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
9THQYhFi4Xt7ajyjsyn1J	P_gQ4i93gqMLQ97toYkH6	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
2o4-NlPWjlHrsd0v02GDK	Dci2hKGD0_S3SSvE8aVX_	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
mDN4naihrqxeSGc2A0shQ	P0L4zaZQuFG4tEmPTYRv2	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
R8xLe8NihrSmaax3eE2BH	Fed4NV-kbfFoZMR9FJABR	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
DO-JSwwGiQbmlJ_PqPRbk	KfOhSRCQuZlpyQxl2_vjS	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
QMmf4SKyhvawxPTnx74zl	62plegVooFU0OJCzjlaZQ	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
EqaDJ_HXMXGsT9Orlglfs	6usBJhZbPfi0nX86fd4pO	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
_U4ALuKQwRhAcpOBZbmGs	FT_qdXhL2LlsBggpPYF81	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
r3-BPNpxO2zlPLlCe1pDb	-3bh40tVHmlCPPO3nu56O	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
otpmeu0bK5rYbtH_FcGRb	srqHdGSSOESiyQWW5SAA8	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
W9GyBPJXdV2OJPxkn3C4c	UiSiMWqRw0ERWr6gElVuC	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
H-4v-_HW0k_AifafsUALm	KC-Aln_heLTOmXDvE7QC_	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
IcfXq5kc3WledKESO_HDc	ECeMz_g9O7a_KMu_658WS	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
0KiqbFdf4QboWzY3BasoK	MaGsglMcr2-9hlHADTw2G	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
RaFtqrJ5wBFX-dPHLTKJN	NSHN_J-pDAKJCp64W74vp	COMPLETED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
y3sw8h2H1FIRRjSPTkT1N	S189ydOzlu1afgW5pqCpr	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
DGoIYlGD3uoglmxh0eMAz	6c9cyeVPQZbgGTvkDJaRk	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
LAmnD790Wkk_u3oMlfg2e	ymPNaq0_yWBETS10YUtrs	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
9dompA0yOgGc38bBxw2K4	LP2dZpy6pAj_j2V3hUTd6	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
wIiptqkT4-aH3kwBzTF4W	tCJD6hlnsDYGXLIXw9w7B	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
E8ER3W7WnuR9ee7pyMVSZ	uotfae8idDWLWACN03p-7	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
uKutkiJQNC0hwENdOdRmD	yBTHA1JtOIsYucUegHg-u	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
TsfWl0LTaCFfzMb_ivTBh	AuE9xGs-DNLgenwGym8b5	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
M854s1c-vu7zrPyeiK3SY	SIHhmyk-b7E4itiVS4e1G	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
PRc7JPOca6k3ZMSe6M7Pg	6cR0X3NyFOfX35n7CWZ6T	CANCELLED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
1saclf2ZkfHY1n3XtBMGH	Yp8x6lrDWnqYXBb6AHDhH	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
D6O2eLr_U43iCw8C2viKN	-PjWs5jUSW8GqI7XEDO4W	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
G5rIR83EnmsK_4plJuKUh	aisiXB7R-jywjhkgFsVW-	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
w2J22aX-BnlbQWHqwgWaF	xxrIRaW93etErxxT18HEv	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-12 14:50:42.061
-0YSW8Vn5FiS_hlDKxTHi	Lc4Ks35JIk-CELNd16QBr	NOT_STARTED	2025-04-20 14:32:48.12	2025-04-20 14:32:48.12
DT_dFTOgo5nHXVGv5fvm6	04mPC0BuXDh53x3qzOl-a	NOT_STARTED	2025-04-13 17:21:28.098	2025-04-13 17:21:28.098
WAFfYQ49UcoP_QCnWJs6q	9p4v9LAGAGkmjmimevgc8	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-14 13:47:25.32
eFZQHtM9_6Q5hmmnc-Cki	15aU29tJgs6R0-qGFonUx	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-14 14:53:51.773
CE5E9E0w9sw-Q53q2WQh4	ZI3xjBg8zX1OhPHhPqtx-	IN_PROGRESS	2025-04-19 15:56:36.225	2025-04-20 14:52:36.664
P-LOoF7HzXyvP2JkwGGo6	9mX_-dftzzBD-0qOnTlXh	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-22 20:14:53.349
LPcgXzHKlskhXSXGvhwC1	xzrv_uVWSgCJQhmQU2g-L	NOT_STARTED	2025-04-12 14:50:42.061	2025-04-15 12:07:13.885
knllj1ooxLWIHIUTtyyza	usmcTDdFH37Ge3n_Se5bt	COMPLETED	2025-04-12 14:50:42.061	2025-04-15 12:07:37.276
o0_fjlDwHoIgWxKTZRcwN	4d2QBIX32HQEfNG4PlcOp	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-16 11:04:31.892
7_p08w_iyOZ4TsywVMvP7	fmnfMhkfwQLBLIdaWnb1P	IN_PROGRESS	2025-04-12 14:50:42.061	2025-04-18 09:09:29.041
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.likes (id, announcement_id, created_at, user_id) FROM stdin;
rj2_I_jddgxV9XU4GTPu4	AgQzbzTYDqQlwkgw9rpLW	2025-04-12 14:50:42.869	1giTvQvHezi8aZ3F9DfvD
NBHA24OrH8jv7ODoHyFO7	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	L6cIque1qSZrk3fUf1zIc
lejwkk4VMm1z9Qq40S6QD	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	uRotKVVYm7YzvjaBsRTZF
D1BGDlxGmw-hNFg4tVY53	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	ukaJfuwXj0obGcVJKId3h
cPu386cZUD07YBkOF4vMw	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	OCJ-A8cxn25KrMA6NPLjR
HNFiDdJTNBKa04uKl7cTO	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	RBsNUdyISMH0Ce17M40Ak
IgegZQpcL1s4KoKe2j46S	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	yvj8NMsyZOgZsMtLDe9XU
jDDFgIyL66wFpN8xZtPe3	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	43lHPQsRU1hCqsgsP5h5N
OlK6REbgQZjGyfQl27hNj	m6k0-cdG8a4S9BU9pTem7	2025-04-12 14:50:42.869	p4apbNOlKXv1puswb6rz-
bXXaIq6U7LWKhm0KyzoDv	ZZmBO1NemY6n27xKeLx5h	2025-04-12 14:50:42.869	5DAjUr1HTKBuxAC-xTBt_
J0m899Zzmzc-RKg883DC0	ZZmBO1NemY6n27xKeLx5h	2025-04-12 14:50:42.869	y626PjSfwi_LHi-B3Ve4q
qSdOYh7foBTTx_9VvPAnb	eBddg-f7UKBOlfIlNrXAQ	2025-04-12 14:50:42.869	gFf5j5LiuvirJqfrArqAo
5u6vhBo64T_upTKODTj_T	eBddg-f7UKBOlfIlNrXAQ	2025-04-12 14:50:42.869	mOxIDeAei1AJGDa_ckloW
Wced33LJ8s9hGYmbLux6q	836uzBS5yUDlTSzneBM3k	2025-04-12 14:50:42.869	jjLNpjyIGLcsK-73OTWFv
78DDikkJxYaim-1U_EL-a	836uzBS5yUDlTSzneBM3k	2025-04-12 14:50:42.869	01yWC_Lwl2tOgCaJW9UOJ
PUnEWUX_Nf0f83LLLD-p0	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:42.869	lLNPH9f1ygnfuTM_cr-Lr
IA-zwSXwdDiTX7I2ppv_R	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:42.869	43lHPQsRU1hCqsgsP5h5N
C-4I4mwn3FqtSOHbJUkkd	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:42.869	KumP-w8qbx6WFxpUf2JKA
shtlGkscfXvvA0wIWWskI	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:42.869	yvj8NMsyZOgZsMtLDe9XU
XrkFT1pJ9Mg5QRcfXJ5We	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:42.869	kGpS5LvZWpjy1kiAJxNSw
7fBCMsSPm_98lTGaXvPyF	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:42.869	YMXwZNNWxO6hcnh9fdENU
E0RNDI-SHpasW5fZ2mNjJ	xV-GX31bRUoAYBI_yHBJG	2025-04-12 14:50:42.869	gmT92fxxkOJ4ptSVBFZ_x
qpFOBihTmevxl7iL3rBNQ	ZsXZvXjDkQ6dfy8J8pOvM	2025-04-12 14:50:42.869	q3E_VbrVuB743Stxvndaf
mjXJPJhl9L37idx6JAFNZ	sgms5Mqayn9-TSiIHMjrW	2025-04-12 14:50:42.869	1giTvQvHezi8aZ3F9DfvD
7QXjsKaeFZRLXBOHefQj_	sgms5Mqayn9-TSiIHMjrW	2025-04-12 14:50:42.869	q3E_VbrVuB743Stxvndaf
FJZ5QeTIJ6LM6hTzY8a4t	-QjJcna60mmqjtvXuJ0Pa	2025-04-12 14:50:42.869	gNIx-RR8qV4__W7LM6WNp
w2J39ToD7ogfiwhAy-H2P	-QjJcna60mmqjtvXuJ0Pa	2025-04-12 14:50:42.869	jjLNpjyIGLcsK-73OTWFv
knTFRS73RTLHwx5yD51Xb	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	YrrRZiqhaeatZgSt_gVCm
EyTu4VDUOGrMbhS5SLgYn	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	d1fHsboAEUT5pmvhc-kQ-
tRDvHSNWWslgPTSmtcyQ3	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	45zVddPrHs2hg7TU6_ILk
Beoz8ViNUlPGTUgAlPnfY	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	gFf5j5LiuvirJqfrArqAo
hdofj4zSsF5jw9zRd5D-6	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	Fa15qoJmWrl6KmnTI-jMB
akxxEqcEpFxGDmMeOcT2L	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	y626PjSfwi_LHi-B3Ve4q
xpCo67_bFPjXge8O1MGNq	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	YMXwZNNWxO6hcnh9fdENU
MYskdvJZEq-tkgEEHE5HY	LjPDpNxT4sXvJHkWn8Rt_	2025-04-12 14:50:42.869	Y52HSKpDMBEQf-K3Ee8tx
NMHAjfpyUGu00zgUQFY05	n6sUvfV9UTR4-IRMZdvrl	2025-04-12 14:50:42.869	SZKRhX1Q5FaYJCiCQlTr_
beund2QOB-DFcAhk_LYuG	n6sUvfV9UTR4-IRMZdvrl	2025-04-12 14:50:42.869	FMbASdqKjJwWsOXC3UfAw
Vk_Owf9jn69Ce-zwKTYn1	PKi9tQNJq30PXQCen9WG_	2025-04-12 14:50:42.869	k8Yaa6OCjDEViWJs3LG4I
q-q2FQ7oZHMRJxf6SQCfV	zRDkgZiOHFFRBykHBtMGE	2025-04-12 14:50:42.869	q3E_VbrVuB743Stxvndaf
Gwql2KcZD7bRe8X8qLiAC	zRDkgZiOHFFRBykHBtMGE	2025-04-12 14:50:42.869	3LEh25p5i6R3i3c1iYkjU
w9LpPwcpZ5GF0ebfkPSii	zRDkgZiOHFFRBykHBtMGE	2025-04-12 14:50:42.869	d1fHsboAEUT5pmvhc-kQ-
cihdlwjGoVxDs_MSS2lvG	_Fw3OAAU-JoAVu8LUXKym	2025-04-12 14:50:42.869	q3E_VbrVuB743Stxvndaf
YAXw6fZzOe86jsS3DddlK	_Fw3OAAU-JoAVu8LUXKym	2025-04-12 14:50:42.869	_p0GiRzZUf-PKMJTDknEW
mWXoLxOx5VdXR1mPS_FZG	X9qozYxZEOaSZ9_I-GJfB	2025-04-12 14:50:42.869	FMbASdqKjJwWsOXC3UfAw
w2LCuryoFoM4lGN9RtP6b	X9qozYxZEOaSZ9_I-GJfB	2025-04-12 14:50:42.869	Yb6WEOiSN4Cv1c-YV35HR
ErH5vg20qQOV97S4pvtgc	X9qozYxZEOaSZ9_I-GJfB	2025-04-12 14:50:42.869	1giTvQvHezi8aZ3F9DfvD
b8CjDrmYikDAx2gTVyBch	X9qozYxZEOaSZ9_I-GJfB	2025-04-12 14:50:42.869	uRotKVVYm7YzvjaBsRTZF
IOjmwcl1PybdnfHVmef0c	X9qozYxZEOaSZ9_I-GJfB	2025-04-12 14:50:42.869	273wt6tMXl-Ca5ynLoV0v
pKWO9lUkTB0KwRjGsY1Gi	X9qozYxZEOaSZ9_I-GJfB	2025-04-12 14:50:42.869	q3E_VbrVuB743Stxvndaf
OFaaIiED7zveT2llGdAUS	X9qozYxZEOaSZ9_I-GJfB	2025-04-12 14:50:42.869	YMXwZNNWxO6hcnh9fdENU
XmVB3DLQvuGk62ixw-UaX	4d2QBIX32HQEfNG4PlcOp	2025-04-12 14:50:42.869	lLNPH9f1ygnfuTM_cr-Lr
z-ARYdMAvI_xgIC5o2rpD	ZI3xjBg8zX1OhPHhPqtx-	2025-04-12 14:50:42.869	FMbASdqKjJwWsOXC3UfAw
Gr0Ka9HeXT_YTVKZs2vKV	ZI3xjBg8zX1OhPHhPqtx-	2025-04-12 14:50:42.869	4U7lIf2tjVj9zLreYPbew
HzD0Pt4KePsCXVJAB7JVD	ZI3xjBg8zX1OhPHhPqtx-	2025-04-12 14:50:42.869	5a5xhw4O0SvpIzLDNjz8Q
HQxjhkUIWro2sQU9geVVt	zsEYCJoJWPsChp-W5KLa5	2025-04-12 14:50:42.869	Yb6WEOiSN4Cv1c-YV35HR
2ki4e8-MEFXHvQj6wwS1c	zsEYCJoJWPsChp-W5KLa5	2025-04-12 14:50:42.869	5a5xhw4O0SvpIzLDNjz8Q
8U1xo-DRn004kU9SzwfYh	zsEYCJoJWPsChp-W5KLa5	2025-04-12 14:50:42.869	pTNnWqDYFYi6yDNoLDLUE
LvhlEGf1YIgJ6MOA51ZLZ	zsEYCJoJWPsChp-W5KLa5	2025-04-12 14:50:42.869	mOxIDeAei1AJGDa_ckloW
iPoSSCRwWovlvMC57nc2X	zsEYCJoJWPsChp-W5KLa5	2025-04-12 14:50:42.869	SZKRhX1Q5FaYJCiCQlTr_
VPlCWX5558kQ9Ky9Yw6fy	zsEYCJoJWPsChp-W5KLa5	2025-04-12 14:50:42.869	lLNPH9f1ygnfuTM_cr-Lr
PCH58-VaO8rTQ-89Soj_z	zsEYCJoJWPsChp-W5KLa5	2025-04-12 14:50:42.869	4Ncn2f_PWAGO4m7RenDoB
PXHgocVqxf1zGH9T2r-2j	I718Lc9SJj8zTMuYquPtF	2025-04-12 14:50:42.869	X6CtufPuMUtb02Lk91f2G
ahzWKx2W1UXBxZdZZoIoW	I718Lc9SJj8zTMuYquPtF	2025-04-12 14:50:42.869	VVv1O-EU2pP2W0IJydmWE
5e3DrLwkuJGUwSAAgLdtp	I718Lc9SJj8zTMuYquPtF	2025-04-12 14:50:42.869	SZKRhX1Q5FaYJCiCQlTr_
egMsGhtoZpg-a_uJQOP-2	I718Lc9SJj8zTMuYquPtF	2025-04-12 14:50:42.869	43lHPQsRU1hCqsgsP5h5N
kcoONyK4Gn7ai-GAeEq4F	I718Lc9SJj8zTMuYquPtF	2025-04-12 14:50:42.869	d1fHsboAEUT5pmvhc-kQ-
lv-U41KN28sphfz7om20F	I718Lc9SJj8zTMuYquPtF	2025-04-12 14:50:42.869	pTNnWqDYFYi6yDNoLDLUE
78XQ8KxJVxTm4hYvoS7cQ	VbR_ED8TreHOcaGwg3lAZ	2025-04-12 14:50:42.869	gFf5j5LiuvirJqfrArqAo
SzmgtSxf_1hbST0WGUjGs	KmdoiBOY_GgI0ONHXrpmk	2025-04-12 14:50:42.869	45zVddPrHs2hg7TU6_ILk
zv_mK-xWAUS2-Swn_xHgb	KmdoiBOY_GgI0ONHXrpmk	2025-04-12 14:50:42.869	KumP-w8qbx6WFxpUf2JKA
yHslfXzat34uPbbx63e_g	KmdoiBOY_GgI0ONHXrpmk	2025-04-12 14:50:42.869	YMXwZNNWxO6hcnh9fdENU
6rxp8MXpqeY2DC1j5_pTR	KmdoiBOY_GgI0ONHXrpmk	2025-04-12 14:50:42.869	Y52HSKpDMBEQf-K3Ee8tx
DEBaDQXD_LyTCj362JklV	usmcTDdFH37Ge3n_Se5bt	2025-04-12 14:50:42.869	Uhp31eJtQ5CudpUdiOFDB
utOERhTl618AxKjAbXWyt	usmcTDdFH37Ge3n_Se5bt	2025-04-12 14:50:42.869	_p0GiRzZUf-PKMJTDknEW
9dgtvj_wt0wFNWfPwpjre	usmcTDdFH37Ge3n_Se5bt	2025-04-12 14:50:42.869	43lHPQsRU1hCqsgsP5h5N
ogxVuJ8pKJ6duVcjC_z0f	usmcTDdFH37Ge3n_Se5bt	2025-04-12 14:50:42.869	X6CtufPuMUtb02Lk91f2G
gdDVr_6Xc0HTgj2KKP-0_	usmcTDdFH37Ge3n_Se5bt	2025-04-12 14:50:42.869	uRotKVVYm7YzvjaBsRTZF
gdpPHq2zVblFQw5bP4XGs	9p4v9LAGAGkmjmimevgc8	2025-04-12 14:50:42.869	Z8CIpYeuWww5cwXfBL_98
l0tahSgtkcbWwmP0cooLj	9p4v9LAGAGkmjmimevgc8	2025-04-12 14:50:42.869	4U7lIf2tjVj9zLreYPbew
9bsISAgOYLU0DaDLUEKsJ	9p4v9LAGAGkmjmimevgc8	2025-04-12 14:50:42.869	KumP-w8qbx6WFxpUf2JKA
vfWh9U315Dd3rvYbx6IkN	9p4v9LAGAGkmjmimevgc8	2025-04-12 14:50:42.869	jjLNpjyIGLcsK-73OTWFv
cxgDGeVcdEUp2szKizA5W	9p4v9LAGAGkmjmimevgc8	2025-04-12 14:50:42.869	gFf5j5LiuvirJqfrArqAo
mNPuLSj6tZVnMVcu6kQkg	9p4v9LAGAGkmjmimevgc8	2025-04-12 14:50:42.869	_p0GiRzZUf-PKMJTDknEW
wnHW1U3NgQ_krZevzC2Ph	9p4v9LAGAGkmjmimevgc8	2025-04-12 14:50:42.869	43lHPQsRU1hCqsgsP5h5N
kdXncjGnE_NXztocbphkf	bTNSmiafvRM3f53pBvNMy	2025-04-12 14:50:42.869	GakIGuCKhnGdpU5jkPiK8
G4ZM7nucw6XOhohjThvb4	bTNSmiafvRM3f53pBvNMy	2025-04-12 14:50:42.869	1giTvQvHezi8aZ3F9DfvD
iaaj2bVYUixGcGsGivCGn	bTNSmiafvRM3f53pBvNMy	2025-04-12 14:50:42.869	ukaJfuwXj0obGcVJKId3h
6WQcpwa6ExPsVNN_z56zj	525tzQm8k1vMUS_YHFeqf	2025-04-12 14:50:42.869	X6CtufPuMUtb02Lk91f2G
jcj8R448RuXKl3eXd6fM2	525tzQm8k1vMUS_YHFeqf	2025-04-12 14:50:42.869	Z8CIpYeuWww5cwXfBL_98
yEr9jhSFAcVTUADIU2I2C	Im3ksyiZXOMQzrE9ebzJl	2025-04-12 14:50:42.869	gFf5j5LiuvirJqfrArqAo
HEOB1ljAuusfcBMdV42F-	Im3ksyiZXOMQzrE9ebzJl	2025-04-12 14:50:42.869	d1fHsboAEUT5pmvhc-kQ-
iYzVR_UDpZIxTD4TseLDC	Im3ksyiZXOMQzrE9ebzJl	2025-04-12 14:50:42.869	y626PjSfwi_LHi-B3Ve4q
K0K3OnSgGtiX7YzUJV5jO	Im3ksyiZXOMQzrE9ebzJl	2025-04-12 14:50:42.869	p4apbNOlKXv1puswb6rz-
5Eq6AlQDVCumpkN8VukBz	Im3ksyiZXOMQzrE9ebzJl	2025-04-12 14:50:42.869	5DAjUr1HTKBuxAC-xTBt_
_LnJrmBdYPEy6kVg59tYb	Im3ksyiZXOMQzrE9ebzJl	2025-04-12 14:50:42.869	q3E_VbrVuB743Stxvndaf
Hhwqb7XieLbAJnpSIryP8	Im3ksyiZXOMQzrE9ebzJl	2025-04-12 14:50:42.869	OCJ-A8cxn25KrMA6NPLjR
wnuXydMn83m3QOK6ktw8O	xzrv_uVWSgCJQhmQU2g-L	2025-04-12 14:50:42.869	SZKRhX1Q5FaYJCiCQlTr_
bvQhVrH-QGkVW8LoViqjy	xzrv_uVWSgCJQhmQU2g-L	2025-04-12 14:50:42.869	KumP-w8qbx6WFxpUf2JKA
O3H2rBvwneH5DP6R9LhPY	xzrv_uVWSgCJQhmQU2g-L	2025-04-12 14:50:42.869	YrrRZiqhaeatZgSt_gVCm
XLECAbiRyfx0dZl535YGL	xzrv_uVWSgCJQhmQU2g-L	2025-04-12 14:50:42.869	gmT92fxxkOJ4ptSVBFZ_x
Wj6qjh7b0OqxNsrogJMz9	fmnfMhkfwQLBLIdaWnb1P	2025-04-14 09:55:49.842	273wt6tMXl-Ca5ynLoV0v
kaNO9lVcjFLcwgbw_x3qF	fmnfMhkfwQLBLIdaWnb1P	2025-04-14 19:45:03.771	0li55hX02UbQ57rBGG9WH
GNUvmO96X4weiIrDc2M8V	fmnfMhkfwQLBLIdaWnb1P	2025-04-14 20:15:16.605	jInZEbVLlz3JJC0j-3wod
gOoQfkrqfnJCdVQpK3fpG	fmnfMhkfwQLBLIdaWnb1P	2025-04-15 16:47:53.206	RBsNUdyISMH0Ce17M40Ak
KHaHH3yjoYpFWYyX7bpBs	t2OIph_jPE1gEx1yx4tN6	2025-04-16 20:17:58.159	r84Bjxp2mvsBNjFrp7CIe
lUgePg7uF2AnNnehXWuJY	lC13n180G25luBWssT10w	2025-04-20 16:36:00.108	r84Bjxp2mvsBNjFrp7CIe
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.notifications (id, type, message, created_at, is_read, updated_at, user_id) FROM stdin;
_np3_eSvGbEW2jFIfw2gm	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	uAY0QPhcaukvovPdqKyvY
5O7BWKY__GQTIv0KlS0zK	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	uAY0QPhcaukvovPdqKyvY
mzqSep2JczfwZGA0tBWtI	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Coxyde	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	uAY0QPhcaukvovPdqKyvY
6v6dUO8p9TGpTrCvZzf8D	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	uAY0QPhcaukvovPdqKyvY
xuhRMsFwvsyMp0DyMb9I7	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	uAY0QPhcaukvovPdqKyvY
bEsAVmj1PQy8etdB6Nvif	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	uAY0QPhcaukvovPdqKyvY
U8fFXx83lhsxM9OJrGiZg	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	uAY0QPhcaukvovPdqKyvY
IC6PnNRsg60-2y7haQGlk	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	wJudEuLCaw0RY2TvgexG8
Ua25M-uittZ69X3tnDEhh	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	wJudEuLCaw0RY2TvgexG8
l1Yf0vAWqpfjCZTa6Wy_2	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	wJudEuLCaw0RY2TvgexG8
tr1fugjGY09HUhry7T917	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	wJudEuLCaw0RY2TvgexG8
6HFiyzrbzC9uJ_u6BgTQj	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	wJudEuLCaw0RY2TvgexG8
OcEpe5Ys-MsSG8h7kMyz-	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	wJudEuLCaw0RY2TvgexG8
Q8zezUaYS-g8NN10SDj-p	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	adVuTpEep2u30gLn5c35x
in3Mz0dqREt0ZlB8MAD6s	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	adVuTpEep2u30gLn5c35x
WauASIZw4k16OvhtC24k4	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	adVuTpEep2u30gLn5c35x
pXljZXuWs6rZ_V65chYEc	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	adVuTpEep2u30gLn5c35x
Nu1HaV_Ra3aPHeSwy3EH4	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	adVuTpEep2u30gLn5c35x
KIOn0l2722V2IntmTT2pO	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	dfVRDm9ISI4zTpCXjwSso
iKBwtcEKegomMQe0iU-dD	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	dfVRDm9ISI4zTpCXjwSso
sK1dc-YcLeYw-e1Qhe9u8	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Wavre	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	dfVRDm9ISI4zTpCXjwSso
EwgIe2Xqequp76Of9JiLB	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	dfVRDm9ISI4zTpCXjwSso
WfWNuX_73YtriRUV4AXCg	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	dfVRDm9ISI4zTpCXjwSso
sLUH_gIz4XC-NT6SKtGZe	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	dfVRDm9ISI4zTpCXjwSso
TftRZofQgcxCBCnJ-UvCy	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Braine-l'Alleud	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	dfVRDm9ISI4zTpCXjwSso
IZMiHBhkzYbD_lpdxVd9Y	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	-Isst8wgpee6oZtXGNX9l
FL3636zh2Jf1cu7N0ou9K	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	-Isst8wgpee6oZtXGNX9l
tCZ0XX-lrfuGVfoCcHbSG	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	-Isst8wgpee6oZtXGNX9l
7qJs7qD43uiKMG6-N25eh	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	-Isst8wgpee6oZtXGNX9l
01Q1GSAji3L6Hv6kuuskE	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	-Isst8wgpee6oZtXGNX9l
slDMAcyiDTS5YfmUZuLtv	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	-Isst8wgpee6oZtXGNX9l
KbTSc6IzhbdWzqTSWQSu4	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	LiiAlgc2thux_6-mZrjv8
3tnQM4FRvKJxJ7yIv96iG	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	LiiAlgc2thux_6-mZrjv8
0jgTnniuAfZcyvUOoyTQ7	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	LiiAlgc2thux_6-mZrjv8
paGD5Km-Ho6uJrt0X5pdx	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	LiiAlgc2thux_6-mZrjv8
BcvrtU9RhYXdDbq6bHuvT	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	LiiAlgc2thux_6-mZrjv8
0a79wYEIU0uH47NgI5uCW	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	OV8W1uNd5UWFiTqoNdQhw
tIPnAkrdvktZibiAeTVa0	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	OV8W1uNd5UWFiTqoNdQhw
YTUC7Ub2h5Zqy4eJmQg1C	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	OV8W1uNd5UWFiTqoNdQhw
l5FydBMwi4JLkDG_VWQhb	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	OV8W1uNd5UWFiTqoNdQhw
MR1Dx4oTU8orxlL9Dz8nn	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	OV8W1uNd5UWFiTqoNdQhw
7ATPGoRfIer0pnYX0wWJR	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	OV8W1uNd5UWFiTqoNdQhw
MBdLH4uCL-V0uONXxUhiX	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	brluTeh5h2KzkDkUZUrUV
525XQ27bA_8dYV1gpLMLt	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	brluTeh5h2KzkDkUZUrUV
dcJ_njWMogFBMvpIhcKtY	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	brluTeh5h2KzkDkUZUrUV
aQl1EYKgDOdBjSGoxTc0B	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	kglH5LayaWyV45SD6vMmA
mTnFIMo3AeNe6DSje1GVL	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	kglH5LayaWyV45SD6vMmA
k80dqjemmdpRubD4wFBMX	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	kglH5LayaWyV45SD6vMmA
OeYMGDhl-V6J1JiYx3XHy	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	kglH5LayaWyV45SD6vMmA
lyhCDRGqN6pG8J8xC0F4C	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	kglH5LayaWyV45SD6vMmA
-snQ3w01EVXt141JqLHyU	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	kglH5LayaWyV45SD6vMmA
j21f9oHr7u4O6LEaQBeM3	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Namur	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	AnLmj3jGslAKpgOAdei2g
jJ0imkhM_Vca89GP8cjHe	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	AnLmj3jGslAKpgOAdei2g
GHhuvy_-LQe-LoYw21TF8	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	AnLmj3jGslAKpgOAdei2g
-o2w5CBdt_FuvVgn4NxZv	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	5rh3uTfhPuhks_59YjBnE
qyr4lzOQyehIMyKU6QKNy	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Ottignies	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	VqtNokSNeEYGxdr4Y6o6o
LRgCJr0OxQQybK_zt2Kav	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	VqtNokSNeEYGxdr4Y6o6o
EdpAAh5pr-LQJQg9qMzpW	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	VqtNokSNeEYGxdr4Y6o6o
Z19cP6EyJWAikgVGnc-ff	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	VqtNokSNeEYGxdr4Y6o6o
AKQRsAYbUZ1vCE2p-tzLk	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	VqtNokSNeEYGxdr4Y6o6o
WJHjp0ypIUZ-QZYNoMDJo	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
9fGareVZCsFzFF_SVgr1e	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
CbsPH-3HG7SgVQNJcgvTa	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
mepoY2oQ-gqfidsnd0g02	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
Wbtq9D0TWCRczCyTelEM2	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
vRW8OfKOBamaoILoWtAsn	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
mQCFw0uTa1DhfL9aQttWc	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
Pti3llObjk7wNWt7JhTJK	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	cafS6eupem4x1ME6mtG8Y
gFfYLjaFdR59fZbvY9IeH	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	W5b-TE3dj_d6S1TDiswah
k15fJoyh2pr5_v3wwRHNJ	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	W5b-TE3dj_d6S1TDiswah
tA5OHXS0PvrM7Cga4Oh-n	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	W5b-TE3dj_d6S1TDiswah
kZBUSe5LaKbbRmlPWKdNU	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	W5b-TE3dj_d6S1TDiswah
mBCJoRDwJLiC78TUCcjbO	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
4wAn0K3t4xZYr9lQ_M1f2	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
6A5BrWtH5mPBwFFfSqVBi	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
ngo5RSgZyTYibyFnZWLty	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
zjsXB9MloM60Xs8MKqdVJ	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
QVRJSZAfHUHsMT5TJ9lBh	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Anvers	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
zFE65IaSPEk09ZHw4mS3Y	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
BkpQuEUj_MQE7n39p4gm5	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	2j3fd180ij2-wc7d_kKcr
TPzr8w1XupGUIyi8Q8Ha7	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	T0V7DyP0r_Mgd-HCqO-d3
ulEgmPzmuXIJfcfD2gT_W	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Bastogne	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	T0V7DyP0r_Mgd-HCqO-d3
H5ApEikSAOfjU2KRopbNn	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	T0V7DyP0r_Mgd-HCqO-d3
9ZHv5dvOsTGZYy59rIoew	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	T0V7DyP0r_Mgd-HCqO-d3
RwFgsToY-v81dWPUG0fSW	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Liège	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	T0V7DyP0r_Mgd-HCqO-d3
Y974vNoAzu9FhaqdaSl5k	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	T0V7DyP0r_Mgd-HCqO-d3
7NRpM-OHvAiAhzxUIFL6g	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	HTAwwq918Sv1oOx78H0II
auGkSfJDWrcQFlkkaDSiV	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	HTAwwq918Sv1oOx78H0II
L699MhgGNoMCXSfzUVrrd	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	HTAwwq918Sv1oOx78H0II
lPFK32n4GBjnRDdWEDaU5	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	HTAwwq918Sv1oOx78H0II
AqXLH4M7KrMdH913xj0qj	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	HTAwwq918Sv1oOx78H0II
au1FnXXPIrFK97duFpXeg	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	HTAwwq918Sv1oOx78H0II
7CL9iJrt50GEByy8d5AHZ	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	ydfUeRgq9gXlm0erlo5SK
XMtNLPRphVtRuYNqNzAtS	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	ydfUeRgq9gXlm0erlo5SK
Zbe2x99x29LRPCnb-zKzg	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	ydfUeRgq9gXlm0erlo5SK
7t49G1UlTlyN3BzsuDJE1	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bZ8I3fgbY7O3S_QDy2R5-
Os-jAyZDW8RvPXrolZ8AM	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bZ8I3fgbY7O3S_QDy2R5-
r8rKZlSdYgOhJciz46ybr	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	bZ8I3fgbY7O3S_QDy2R5-
T_G2BLz86nxU9i0pIMpNC	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bZ8I3fgbY7O3S_QDy2R5-
kotVSjkOS2Mmt7uILgK19	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bZ8I3fgbY7O3S_QDy2R5-
3TScn-uzrXkyzgpFAuQA1	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	bZ8I3fgbY7O3S_QDy2R5-
ynnVj3BXFb0iRiCiR0MKQ	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	bZ8I3fgbY7O3S_QDy2R5-
ohsjDbihs113SBxJrPpXR	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	vvVHV7ZkDaZ2PJOepW1zZ
Qoe4QFje34OFkIc4hBqgC	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	vvVHV7ZkDaZ2PJOepW1zZ
MFzHHE4qZczNCNQ3Cw_1s	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	vvVHV7ZkDaZ2PJOepW1zZ
6irfkiP8wII0niDbGnzdp	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	Vz1jBXrgAW88nLQ92NseR
l-cx17twZ8RVRP6ytT_GC	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	Vz1jBXrgAW88nLQ92NseR
VI_JfwqLBpdR870jir8gC	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Malmedy	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	Vz1jBXrgAW88nLQ92NseR
EZbu12PjXgiv37H3tdSj-	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	Vz1jBXrgAW88nLQ92NseR
H6yLI24Jd4OxKLRrodyaN	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	yLmHSXTXS-FhegcK8B1tQ
hYddEC9yUKSjN1ikdpqiB	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	yLmHSXTXS-FhegcK8B1tQ
iMklOLhgR4ocPGf1odCZ2	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	yLmHSXTXS-FhegcK8B1tQ
MnzLIoZ1GQA1FfDv1Nli5	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bxw52YkAf3kya9uiRd8yE
JhZ5dzWUJodP_Bc7IhcgC	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bxw52YkAf3kya9uiRd8yE
DDW-ZP3rrAxDlitCUR9JH	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bxw52YkAf3kya9uiRd8yE
ywHT557gLl078w8XRfZ7E	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	bxw52YkAf3kya9uiRd8yE
MmWIdTd8u-tPr61xuErZy	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
MWL2lo7p1WByv6UD3KFxo	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
Ai3BJd1_fInGgL7k_qijB	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
6muaZeHdOCn2mVFDGBe4H	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
7hYt-DHEhILPJ4hXhE918	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
GXkZbDOChJ05qwsYlOeBb	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
Shtugp2xCmv-oWbApwGWA	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
kGXt6PjtoJzVnLsKRD4mT	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	Lu842AREolk1Iapw5cqVH
-Buz2VNqy8ZshlahnKTcY	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Chimay	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	vVh5wAlS2cVRW6vRjwJp8
vk9lp81UXm3lu7zz6Bcxt	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	vVh5wAlS2cVRW6vRjwJp8
qZpHz0DWyapoytZ7TyV5X	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	vVh5wAlS2cVRW6vRjwJp8
lz32pcAmjfvLzId1eSw0R	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	vVh5wAlS2cVRW6vRjwJp8
qmGz4pu8K1SojZ7ULV4SQ	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	vVh5wAlS2cVRW6vRjwJp8
mi3beMGxwo2BdMacpUNOU	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	vylxmUrAw0uflJ260rgc9
Z4SFZyA7B8fsm_dzpz4Ps	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	0mqpTYdGz_2LSZFVQg9Ho
l32TvqwCx1l-9HTBPOsAT	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	pnXe3wEkXY6CScPUeE_zo
Ug46SUtHYjRw3kgxwcZaj	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	pnXe3wEkXY6CScPUeE_zo
FXc7N06HiuHGykW8EHjXX	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	pnXe3wEkXY6CScPUeE_zo
0mC_q5EoyBBk2RV75FUKl	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	pnXe3wEkXY6CScPUeE_zo
mgblAWD202GAAVLBCQbH3	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	QXpx5jbDmsR7KYq7BLaZs
05s9aIZ8t67OH88iNMTCB	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	QXpx5jbDmsR7KYq7BLaZs
mAybIyjp-g9LC2p6IL84k	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	QXpx5jbDmsR7KYq7BLaZs
tjgCHzHS-u3X-scj8VEK5	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	QXpx5jbDmsR7KYq7BLaZs
y_ITIhMcklJRT6F2RICZu	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	QXpx5jbDmsR7KYq7BLaZs
NqbMbB32wEMGdWvOMj27b	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	QXpx5jbDmsR7KYq7BLaZs
dhlSayGszf7vGBtNpOWiS	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Bruxelles	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	86gSxFnM0G0YmdYAGUOyZ
AQgVz18m96-ybhccDMrve	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	tahXVGsywRvWz6anZZUpO
TOk-gSGp4ua3_ZP0EuRq7	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	NsFT9ATiUfMzoM5Gxrlla
H9ba51SCI2kLHPxHBgmYT	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	NsFT9ATiUfMzoM5Gxrlla
HrUi8zlRnK1r_x4XyTGMf	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	NsFT9ATiUfMzoM5Gxrlla
PYyvvyjsZOI1eTaduekEi	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	NsFT9ATiUfMzoM5Gxrlla
-1CMngdBLL140nT6ZMIQi	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	KoLEp8twy5jdMVjxuaE2f
2-bV5DGTpBJoYqicdXCMy	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	KoLEp8twy5jdMVjxuaE2f
6WVjSuSUm44YWaJSSzvmh	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	KoLEp8twy5jdMVjxuaE2f
W7OruzUdcdL-aC6mfFddy	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	KoLEp8twy5jdMVjxuaE2f
v9uHAOyxSKesI4BC73uam	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	ox43gqffBk_84FZTc8vBC
5xO76FKytPRla3eDrttKo	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	ox43gqffBk_84FZTc8vBC
Cx227gUtvPx7ndGIdOOrO	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	ox43gqffBk_84FZTc8vBC
i_aHV5f8U4uiY9NAhN4B-	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	ox43gqffBk_84FZTc8vBC
iPGj2Cg-_eq90cLnAOLxF	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	SR8dgc5xm0DucI8_HCoaX
KT9tz1f0Y6k05Vp1iVV3U	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	SR8dgc5xm0DucI8_HCoaX
jpyO4WIUjaouIfjCnwUEB	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	SR8dgc5xm0DucI8_HCoaX
JqGoF0jXn1BxdWdgReolZ	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	SR8dgc5xm0DucI8_HCoaX
5MceznFoo76LIMaQvsHaF	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	SR8dgc5xm0DucI8_HCoaX
0Z5NI6ihtm71k5oZYBdB0	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	SR8dgc5xm0DucI8_HCoaX
qlrQ73qlL_c7RZ8smTmDL	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	SR8dgc5xm0DucI8_HCoaX
K9887HaADKHA1evlt32Os	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	RbE1kYFdajC7rTQR6Cj2Z
cv7Pfja1eJyC3gh8ciAOS	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	RbE1kYFdajC7rTQR6Cj2Z
sYYwLbkTG0GgwszLPFUoE	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	RbE1kYFdajC7rTQR6Cj2Z
hlHKArb_1-NChe2W8nTUX	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	RbDbMA8ak4jRDPW3i4N-h
xLRqun68NDsDC4sEzXffc	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Tervuren	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	RbDbMA8ak4jRDPW3i4N-h
4vNJBH55-EriOC5N9oDk2	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	RbDbMA8ak4jRDPW3i4N-h
LFLxpbrJSVXVTQzT-7O9u	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	RbDbMA8ak4jRDPW3i4N-h
N32JuUUDsu5IlHEiUaPrT	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	RbDbMA8ak4jRDPW3i4N-h
W4RI8GQ5_MnWmF_MUCu6e	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Visé	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	4YidRAUq2nDPoEWigTQBu
IDW6jzjwrL07Rv5v0C4SJ	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	4YidRAUq2nDPoEWigTQBu
LqWpyMou7cvNB4-SELU76	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	4YidRAUq2nDPoEWigTQBu
9HXyUS9ko3bfp7-mpzJ--	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	4YidRAUq2nDPoEWigTQBu
Y_KhLtxr9ucblBsMAF5yX	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	4YidRAUq2nDPoEWigTQBu
MHqmLYHXHgcN92WsIXpV_	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	4YidRAUq2nDPoEWigTQBu
UdAv4ZMFQhE-5lUnvlGU_	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	4YidRAUq2nDPoEWigTQBu
Fz3LAgUNSaekXrCejo44R	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	foKvn5K0VRZMRmuHLFWcc
Ggpw0Jn8F5rz8pSE0Bvia	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	foKvn5K0VRZMRmuHLFWcc
tdFGli86EKFzcINZ438Ih	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Tournai	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	foKvn5K0VRZMRmuHLFWcc
Nb55kFzxKNJqtAkEY4jHN	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	foKvn5K0VRZMRmuHLFWcc
Rvt7t8d3iIpqhMX4Ydreo	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	foKvn5K0VRZMRmuHLFWcc
aW5Dy4Tq2ilxZv5hYc8mT	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	YOUOqWeVx3wIW_mOLvqqo
FD9ZKlJCjO3Ax_eXJz0ww	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	YOUOqWeVx3wIW_mOLvqqo
FmGs-L-HIQhncO3eH-8sY	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	YOUOqWeVx3wIW_mOLvqqo
H9Ghk4IryKXXY52t7RMaA	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	YOUOqWeVx3wIW_mOLvqqo
t_pPMJ5FjuykqKa6SdPwy	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	YOUOqWeVx3wIW_mOLvqqo
nPM-RT3d_Tczsd2O7vGf8	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	YOUOqWeVx3wIW_mOLvqqo
EAl8-0FmD2dNTBqdDao2M	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	YOUOqWeVx3wIW_mOLvqqo
AbmKf8pCT11AD9NKxlwFB	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	N3hmqsQgEA2pQN9mCI1YG
e674BBzHUH0sGikTYlIFF	GLEANING_CANCELLED	une session de glanage a été annulée	2025-04-12 14:50:43.286	f	2025-04-12 14:50:43.286	N3hmqsQgEA2pQN9mCI1YG
XZGDN2sbrnBRf34Xrke2u	GLEANING_REMINDER	rappel : vous avez une session de glanage demain	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	N3hmqsQgEA2pQN9mCI1YG
6rTfgjiYJLg_lq7n6INK5	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	N3hmqsQgEA2pQN9mCI1YG
0HuFndjrQTZt7Jf5M4hP7	NEW_REVIEW	un glaneur a laissé un avis sur votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	N3hmqsQgEA2pQN9mCI1YG
VbJfq4r01p_FbW4PfwmMp	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	N3hmqsQgEA2pQN9mCI1YG
0tewHurqFAfJFSh6wF_IZ	RESERVATION_REQUEST	nouvelle demande de participation à votre annonce	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	_BVbk1M-eGph8GpaSqmGg
E9rofwlMHlU7aeg9WivIJ	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	ZBt4I58AWyPwIO026bZiS
ZFwAjpjI9lWSa7r_Vzj8b	FIELD_UPDATED	un champ que vous suivez a été mis à jour	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	ZBt4I58AWyPwIO026bZiS
9GTeD7_OMhrbu0icnv1z4	NEW_ANNOUNCEMENT	nouvelle opportunité de glanage près de Philippeville	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	ZBt4I58AWyPwIO026bZiS
TwiolwkrfVl5aeOrkouG9	GLEANING_ACCEPTED	votre demande de participation a été acceptée	2025-04-12 14:50:43.286	t	2025-04-12 14:50:43.286	CqqyfXQ25KQBoULzkCVVy
\.


--
-- Data for Name: participations; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.participations (id, created_at, user_id, gleaning_id) FROM stdin;
8JeU-lwANDFEHBKTsu8zh	2025-04-12 14:50:42.223	VmpgLYbHw0Ts4zzA0yoVJ	J6twKdCWxwDj38C1zZgzA
QJvC0v5mKW1D5qT0ekoQQ	2025-04-12 14:50:42.223	Fa15qoJmWrl6KmnTI-jMB	J6twKdCWxwDj38C1zZgzA
GVco8o3aZbK-vQjgPzJeE	2025-04-12 14:50:42.223	5a5xhw4O0SvpIzLDNjz8Q	J6twKdCWxwDj38C1zZgzA
VOyClbBOyW21fSH2qPjTq	2025-04-12 14:50:42.223	gmT92fxxkOJ4ptSVBFZ_x	J6twKdCWxwDj38C1zZgzA
71vyYPIcjGKgj-zTYWcgP	2025-04-12 14:50:42.223	mOxIDeAei1AJGDa_ckloW	pPmv8U0zAgbag3Ol82xTO
WMs1uB6iyDdsAjsmRti7d	2025-04-12 14:50:42.223	273wt6tMXl-Ca5ynLoV0v	vtoHveytwd8nnzAE4GTFu
yXv4ln-mP-_dTq132Nx2R	2025-04-12 14:50:42.223	01yWC_Lwl2tOgCaJW9UOJ	vtoHveytwd8nnzAE4GTFu
DsdkZsmnyCgTMGoqEnYdk	2025-04-12 14:50:42.223	q3E_VbrVuB743Stxvndaf	vtoHveytwd8nnzAE4GTFu
cq1FuVsuSosDRqMYVMh1z	2025-04-12 14:50:42.223	KumP-w8qbx6WFxpUf2JKA	vtoHveytwd8nnzAE4GTFu
EBg8QdhMF4KFoJhqExdbb	2025-04-12 14:50:42.223	HlMUoNCUSGcioecjNUSmC	hRo4eCy717ssKc3cQFvd_
rtgN8WGh4de-oaB4putcZ	2025-04-12 14:50:42.223	43lHPQsRU1hCqsgsP5h5N	fNBm95ZFRNAEoRwtjdgnK
gXdz9Iim80j7rS3D1RL3j	2025-04-12 14:50:42.223	01yWC_Lwl2tOgCaJW9UOJ	fNBm95ZFRNAEoRwtjdgnK
7GCEfG3H1u5mzAR-FSGte	2025-04-12 14:50:42.223	FMbASdqKjJwWsOXC3UfAw	fNBm95ZFRNAEoRwtjdgnK
0nVIvoN1oOIHlOIPjSplK	2025-04-12 14:50:42.223	kGpS5LvZWpjy1kiAJxNSw	fNBm95ZFRNAEoRwtjdgnK
jMYYu42UpjZeMClZOue36	2025-04-12 14:50:42.223	_p0GiRzZUf-PKMJTDknEW	fNBm95ZFRNAEoRwtjdgnK
XH4OjPHIrC2vVBEdkNO4r	2025-04-12 14:50:42.223	SZKRhX1Q5FaYJCiCQlTr_	WQqc7H41m8UEZ20EWTiLG
R3L149CJEf2wQBVu2JZaz	2025-04-12 14:50:42.223	k8Yaa6OCjDEViWJs3LG4I	WQqc7H41m8UEZ20EWTiLG
WbwlwkLaHzqdVII-BCqAb	2025-04-12 14:50:42.223	Z8CIpYeuWww5cwXfBL_98	WQqc7H41m8UEZ20EWTiLG
IUHTxrVlsueKeh1MCu5fz	2025-04-12 14:50:42.223	ukaJfuwXj0obGcVJKId3h	WQqc7H41m8UEZ20EWTiLG
ew4XRN-FGp3Zbn1ERoCW5	2025-04-12 14:50:42.223	gmT92fxxkOJ4ptSVBFZ_x	7aoDWsJUn0oTmi-qLe0-9
IPQOSsuw_-DHeW05xpory	2025-04-12 14:50:42.223	X6CtufPuMUtb02Lk91f2G	7aoDWsJUn0oTmi-qLe0-9
ocjLAmUh_AZQc9BUQ0ng9	2025-04-12 14:50:42.223	4Ncn2f_PWAGO4m7RenDoB	7aoDWsJUn0oTmi-qLe0-9
U2EJaFRbsHktGwrRGeFk0	2025-04-12 14:50:42.223	5a5xhw4O0SvpIzLDNjz8Q	7aoDWsJUn0oTmi-qLe0-9
oCI1qrLQwq0CJWepkHK33	2025-04-12 14:50:42.223	5DAjUr1HTKBuxAC-xTBt_	zzYXjC-od9NF93WY440BW
lfhkm1z9nhP4rIx2-1mmo	2025-04-12 14:50:42.223	4Ncn2f_PWAGO4m7RenDoB	zzYXjC-od9NF93WY440BW
X7Ar0LJICtMMJrLL-1B_w	2025-04-12 14:50:42.223	Th5W58hZQTGVSoKIsnBuU	oOWXWFJj3HzGTvWYTSBpW
tC95Pyo9ZIseu7Qjz0ebQ	2025-04-12 14:50:42.223	Yb6WEOiSN4Cv1c-YV35HR	oOWXWFJj3HzGTvWYTSBpW
yiaUN4jowhuc8KXc-rn-B	2025-04-12 14:50:42.223	YMXwZNNWxO6hcnh9fdENU	oOWXWFJj3HzGTvWYTSBpW
I7ftBNZu5JqWYjYFUQrIM	2025-04-12 14:50:42.223	bB585VEfv8KcxbJZNmsx4	oOWXWFJj3HzGTvWYTSBpW
6cW-FQNFR9Pq_8nSQ-t36	2025-04-12 14:50:42.223	VVv1O-EU2pP2W0IJydmWE	_xzxp-0y44OC6aerZeJFK
wahYgazFlG873VouSHqp3	2025-04-12 14:50:42.223	gNIx-RR8qV4__W7LM6WNp	_xzxp-0y44OC6aerZeJFK
3H_CI-FO1fWMXrCLtwsOw	2025-04-12 14:50:42.223	Yb6WEOiSN4Cv1c-YV35HR	_xzxp-0y44OC6aerZeJFK
EXXosE0iDL-gR-YfR5fHR	2025-04-12 14:50:42.223	KumP-w8qbx6WFxpUf2JKA	x37VYlQA-RT6xSzGlq4Ay
4_Ozo-DehXvZwCKUL2Xdb	2025-04-12 14:50:42.223	gFf5j5LiuvirJqfrArqAo	x37VYlQA-RT6xSzGlq4Ay
dICVB6XjA38gT353Z_zzv	2025-04-12 14:50:42.223	bB585VEfv8KcxbJZNmsx4	x37VYlQA-RT6xSzGlq4Ay
s3YVwpsf6__4w-fYbXakg	2025-04-12 14:50:42.223	YrrRZiqhaeatZgSt_gVCm	x37VYlQA-RT6xSzGlq4Ay
8_Uve1eXf9F9d1DuaPJbo	2025-04-12 14:50:42.223	ZpZbacewrLB30ngCbnK0Z	x37VYlQA-RT6xSzGlq4Ay
7C4DFAjH9LtVpSkxz9NCp	2025-04-12 14:50:42.223	d1fHsboAEUT5pmvhc-kQ-	PCVZAEC97W-Hg5xqPrLwh
E3gYewakQEM1XpBMyOwVs	2025-04-12 14:50:42.223	1giTvQvHezi8aZ3F9DfvD	PCVZAEC97W-Hg5xqPrLwh
m5rFuLXXEnsTfIw7NdPSb	2025-04-12 14:50:42.223	Z8CIpYeuWww5cwXfBL_98	PCVZAEC97W-Hg5xqPrLwh
PgBWMyUcVJBPu9KgBU1PT	2025-04-12 14:50:42.223	X6CtufPuMUtb02Lk91f2G	BnV-kuJ6jxCMzhVvQRDF-
NupJbeeQ0kMM4qjgZZKPb	2025-04-12 14:50:42.223	GakIGuCKhnGdpU5jkPiK8	BnV-kuJ6jxCMzhVvQRDF-
pyqJq2r6j2LP1_oFmklR7	2025-04-12 14:50:42.223	3LEh25p5i6R3i3c1iYkjU	BnV-kuJ6jxCMzhVvQRDF-
shKzyIOQH8bTQB2D5NFU6	2025-04-12 14:50:42.223	VVv1O-EU2pP2W0IJydmWE	BnV-kuJ6jxCMzhVvQRDF-
_W5Eub3nofJ3BBHLetBvT	2025-04-12 14:50:42.223	YrrRZiqhaeatZgSt_gVCm	AR8lmKJzPSphwfj8illFG
JAnj93h9F1tYYTabg-7ol	2025-04-12 14:50:42.223	Y52HSKpDMBEQf-K3Ee8tx	tuCke_reGK8SrqIp6iuVk
MbLF0VcUNi2d7zsaO0inU	2025-04-12 14:50:42.223	kGpS5LvZWpjy1kiAJxNSw	tuCke_reGK8SrqIp6iuVk
NLO4hcpdfrLGwBoz6qss4	2025-04-12 14:50:42.223	4U7lIf2tjVj9zLreYPbew	Ph2Xazqrz2TM6_NtNl-U4
UMnMchs8jfNiFASOdgrGk	2025-04-12 14:50:42.223	Y52HSKpDMBEQf-K3Ee8tx	Ph2Xazqrz2TM6_NtNl-U4
SiK9CGK7Gqx9D4lihNqoQ	2025-04-12 14:50:42.223	273wt6tMXl-Ca5ynLoV0v	Ph2Xazqrz2TM6_NtNl-U4
knIRFaiTs5wA7uPJp_puM	2025-04-12 14:50:42.223	k8Yaa6OCjDEViWJs3LG4I	o0_fjlDwHoIgWxKTZRcwN
uAiWqrhTnLLnTCWZwWyaq	2025-04-12 14:50:42.223	q3E_VbrVuB743Stxvndaf	o0_fjlDwHoIgWxKTZRcwN
xdodTFzvuzlJcgp0O2UJ3	2025-04-12 14:50:42.223	uRotKVVYm7YzvjaBsRTZF	o0_fjlDwHoIgWxKTZRcwN
iu6NOGFgAQL7ldqX3KpZo	2025-04-12 14:50:42.223	_p0GiRzZUf-PKMJTDknEW	o0_fjlDwHoIgWxKTZRcwN
GyIqIeq96wiCez1MnhzkO	2025-04-12 14:50:42.223	VmpgLYbHw0Ts4zzA0yoVJ	YOa5LvBb9CCf5d5a4gHKx
WXn2D-wnFvd7nJxqMQBef	2025-04-12 14:50:42.223	GakIGuCKhnGdpU5jkPiK8	YOa5LvBb9CCf5d5a4gHKx
4iZAaA5WfsrZZ_vrx1ejO	2025-04-12 14:50:42.223	OCJ-A8cxn25KrMA6NPLjR	YOa5LvBb9CCf5d5a4gHKx
vmQwUbpGXFt4n8dxQpRFg	2025-04-12 14:50:42.223	d1fHsboAEUT5pmvhc-kQ-	997CDGquJfGvgk_tFGooe
oqd_gKD6XVm0RIdHUBJOz	2025-04-12 14:50:42.223	lLNPH9f1ygnfuTM_cr-Lr	997CDGquJfGvgk_tFGooe
n2znQo4CqLUfGua9SoQLx	2025-04-12 14:50:42.223	30eFtilsOe7FLfDD_FWtD	997CDGquJfGvgk_tFGooe
FV14EfnHD27Ewmbs_4qzD	2025-04-12 14:50:42.223	SZKRhX1Q5FaYJCiCQlTr_	997CDGquJfGvgk_tFGooe
YrYKtSZaAkTWaEO49x5Mb	2025-04-12 14:50:42.223	4Ncn2f_PWAGO4m7RenDoB	997CDGquJfGvgk_tFGooe
ghwai9hKxv5EgC_M2_xUQ	2025-04-12 14:50:42.223	GakIGuCKhnGdpU5jkPiK8	zXuhMWdKLHGpyyWaRPM7V
esa5lR9CTCNqShkj1NoAj	2025-04-12 14:50:42.223	273wt6tMXl-Ca5ynLoV0v	zXuhMWdKLHGpyyWaRPM7V
l47-g08hM15Zh6fmMe8GK	2025-04-12 14:50:42.223	5DAjUr1HTKBuxAC-xTBt_	zXuhMWdKLHGpyyWaRPM7V
jnsHyvjnlvw7SU1sjHN7h	2025-04-12 14:50:42.223	3LEh25p5i6R3i3c1iYkjU	zXuhMWdKLHGpyyWaRPM7V
FKwspsi1nm4yUt0S83GaP	2025-04-12 14:50:42.223	bB585VEfv8KcxbJZNmsx4	zXuhMWdKLHGpyyWaRPM7V
PJYab5UnHsbgzd4YTPNRK	2025-04-12 14:50:42.223	SZKRhX1Q5FaYJCiCQlTr_	_hkNRztq77DpDmhSWdbvr
hZ32XEdgo1mlFbNqkiz0P	2025-04-12 14:50:42.223	Uhp31eJtQ5CudpUdiOFDB	_hkNRztq77DpDmhSWdbvr
P_FNZ3q8KgU1Ay8UpeJ1j	2025-04-12 14:50:42.223	gFf5j5LiuvirJqfrArqAo	9c5VC3xlL6UJTFr_Ej20y
x8dvnuBnO_gwEnNAnuTgw	2025-04-12 14:50:42.223	273wt6tMXl-Ca5ynLoV0v	9c5VC3xlL6UJTFr_Ej20y
UQ86_epz1O3GOueOIvNkw	2025-04-12 14:50:42.223	OCJ-A8cxn25KrMA6NPLjR	9c5VC3xlL6UJTFr_Ej20y
r8v_xB_wSYTnArNG7FA-H	2025-04-12 14:50:42.223	Th5W58hZQTGVSoKIsnBuU	MNWY1NEdaaUEVDCm4a_3i
3PcHEjF5IbH__XbI7cT54	2025-04-12 14:50:42.223	ZpZbacewrLB30ngCbnK0Z	DHd8YaOr7BK7P3_yEYaBz
g-8Yo4z11TPRbwNcjeDu9	2025-04-12 14:50:42.223	uRotKVVYm7YzvjaBsRTZF	knllj1ooxLWIHIUTtyyza
OwsC3KOWuJRr-rNJI8vuK	2025-04-12 14:50:42.223	30eFtilsOe7FLfDD_FWtD	knllj1ooxLWIHIUTtyyza
dqJlwUzvBbEWOHx3Mns8G	2025-04-12 14:50:42.223	RBsNUdyISMH0Ce17M40Ak	knllj1ooxLWIHIUTtyyza
mf5nusSh2wmPeSOY4inP0	2025-04-12 14:50:42.223	45zVddPrHs2hg7TU6_ILk	knllj1ooxLWIHIUTtyyza
oeLclI1ojAjlh2y3b1GWC	2025-04-12 14:50:42.223	Th5W58hZQTGVSoKIsnBuU	7_p08w_iyOZ4TsywVMvP7
Nf8QjKemNhAwTZphM7xKd	2025-04-12 14:50:42.223	Yb6WEOiSN4Cv1c-YV35HR	WAFfYQ49UcoP_QCnWJs6q
Hi6nQWovTxaodRRUp8PtT	2025-04-12 14:50:42.223	kGpS5LvZWpjy1kiAJxNSw	WAFfYQ49UcoP_QCnWJs6q
j3Kb8RlteETwCgY9G_qme	2025-04-12 14:50:42.223	GakIGuCKhnGdpU5jkPiK8	nwlA-81c1KltSNYBMVynH
h3cpx6KWGqUFqqkwWXnc2	2025-04-12 14:50:42.223	kpJhCAmEsaZlOYlkuQusI	If3TciPjbDwwpn5xhSjFb
LTIf0vdaWh2LLsiwwxejU	2025-04-12 14:50:42.223	Z8CIpYeuWww5cwXfBL_98	If3TciPjbDwwpn5xhSjFb
ROqyCvBq1h7fnaM84pcJ1	2025-04-12 14:50:42.223	4U7lIf2tjVj9zLreYPbew	If3TciPjbDwwpn5xhSjFb
rKrA2HqVDaQYKKveZJq0S	2025-04-12 14:50:42.223	Z8CIpYeuWww5cwXfBL_98	LPcgXzHKlskhXSXGvhwC1
Xg7x5afAA1qt_9vt_qF7i	2025-04-12 14:50:42.223	RBsNUdyISMH0Ce17M40Ak	LPcgXzHKlskhXSXGvhwC1
H0HxBNKaR9SB1fpRder_b	2025-04-12 14:50:42.223	45zVddPrHs2hg7TU6_ILk	LPcgXzHKlskhXSXGvhwC1
geP_5cqj0uep2QNo_LZL7	2025-04-12 14:50:42.223	k8Yaa6OCjDEViWJs3LG4I	LPcgXzHKlskhXSXGvhwC1
oQbNDaqc4KEW-wr46BFYL	2025-04-12 14:50:42.223	YMXwZNNWxO6hcnh9fdENU	Q4h4xITVX-TZaLFjrF2Id
iEbRqHI-lGogg2jy6Dk_n	2025-04-12 14:50:42.223	pTNnWqDYFYi6yDNoLDLUE	Q4h4xITVX-TZaLFjrF2Id
xfVfG6lkSQmqz1aBpCQVr	2025-04-12 14:50:42.223	KumP-w8qbx6WFxpUf2JKA	Q4h4xITVX-TZaLFjrF2Id
5R14hFXsQh7weV42UPzMu	2025-04-12 14:50:42.223	YrrRZiqhaeatZgSt_gVCm	Q4h4xITVX-TZaLFjrF2Id
pzhdyYV7RtHZAosjoqa2U	2025-04-12 14:50:42.223	ukaJfuwXj0obGcVJKId3h	Q4h4xITVX-TZaLFjrF2Id
44W2ihu8zqwpAUBv8pd9T	2025-04-12 14:50:42.223	pTNnWqDYFYi6yDNoLDLUE	8a7tfT4i8XP2ZfuzAl2St
FgH94HmeDoIT4Q4zB4UeU	2025-04-12 14:50:42.223	q3E_VbrVuB743Stxvndaf	8a7tfT4i8XP2ZfuzAl2St
RIzO4FomRZgcM_BHUXCbI	2025-04-12 14:50:42.223	1giTvQvHezi8aZ3F9DfvD	6HYGUUp5wlMb3yqIw4z89
Z9pqCkR3sXD6yuz0Ldf6Z	2025-04-12 14:50:42.223	3LEh25p5i6R3i3c1iYkjU	6HYGUUp5wlMb3yqIw4z89
5vabjgAjqYcOI8OWvCUNI	2025-04-12 14:50:42.223	4U7lIf2tjVj9zLreYPbew	AnxJd1gceN2RwniOOhyax
UgxRciTWwN1ineBvDH8sH	2025-04-12 14:50:42.223	4Ncn2f_PWAGO4m7RenDoB	3v_5UI-6XRPjH_BMrtVTc
r32vk1RS_zcCAIdihqlho	2025-04-13 22:22:41.225	273wt6tMXl-Ca5ynLoV0v	DT_dFTOgo5nHXVGv5fvm6
kcwd2_UxNp0IMcYOvkJ8r	2025-04-14 08:57:30.87	273wt6tMXl-Ca5ynLoV0v	7_p08w_iyOZ4TsywVMvP7
OGxuehaGbH17_aetfe_M8	2025-04-14 10:42:09.447	273wt6tMXl-Ca5ynLoV0v	3v_5UI-6XRPjH_BMrtVTc
HiVJT4HTw9VznYANgEQ3d	2025-04-14 13:47:24.804	273wt6tMXl-Ca5ynLoV0v	WAFfYQ49UcoP_QCnWJs6q
9Urzw6enQMXSYvsp_hCXy	2025-04-14 14:53:51.365	273wt6tMXl-Ca5ynLoV0v	eFZQHtM9_6Q5hmmnc-Cki
cutNp9ueVtLHSok4oPLH9	2025-04-14 19:37:28.52	jInZEbVLlz3JJC0j-3wod	7_p08w_iyOZ4TsywVMvP7
dTm7Sz4EwC9wZjKfFjVCd	2025-04-14 19:45:35.61	0li55hX02UbQ57rBGG9WH	7_p08w_iyOZ4TsywVMvP7
saInfkXBdBQKXK-woSAoQ	2025-04-15 09:31:18.992	-Isst8wgpee6oZtXGNX9l	7_p08w_iyOZ4TsywVMvP7
InBmhV_nvKbCXnLkSTXP-	2025-04-15 15:16:51.032	RBsNUdyISMH0Ce17M40Ak	7_p08w_iyOZ4TsywVMvP7
0yTNvoNCkg7CEfsdIlYuq	2025-04-16 19:47:26.427	r84Bjxp2mvsBNjFrp7CIe	o0_fjlDwHoIgWxKTZRcwN
bTR2A3kVF3a0Wgip9FqG5	2025-04-18 09:39:24.441	r84Bjxp2mvsBNjFrp7CIe	_xzxp-0y44OC6aerZeJFK
LdHfD2vxi39pTBku130ts	2025-04-19 15:56:36.323	r84Bjxp2mvsBNjFrp7CIe	CE5E9E0w9sw-Q53q2WQh4
xtC4285ZgqKoB5aX_9fAn	2025-04-20 14:32:48.249	r84Bjxp2mvsBNjFrp7CIe	-0YSW8Vn5FiS_hlDKxTHi
6ngQHj9sfmw8jlJ_qSf5b	2025-04-22 20:14:52.186	8CT4TnF2gofBALff2GU_h	P-LOoF7HzXyvP2JkwGGo6
JxcnJjdP6PDuNMRDqsevN	2025-04-23 12:35:51.857	8CT4TnF2gofBALff2GU_h	_xzxp-0y44OC6aerZeJFK
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.reviews (id, rating, content, created_at, gleaning_id, updated_at, user_id, images) FROM stdin;
3TVHdMyrqFGfrcWqFu7gH	4	Très bonne organisation! C'est bon pour la planète et pour le moral. Je recommande vivement.	2025-04-12 14:50:42.726	vtoHveytwd8nnzAE4GTFu	2025-04-12 14:50:42.726	01yWC_Lwl2tOgCaJW9UOJ	{https://picsum.photos/seed/S6s6M18/268/2074,https://picsum.photos/seed/4EbmU9qqX/3466/1553,https://loremflickr.com/456/3706?lock=5656230844020014}
YgymyScLrveKyYtQI50Jm	4	Accueil chaleureux! Parfait pour une activité en famille. À refaire sans hésiter!	2025-04-12 14:50:42.726	vtoHveytwd8nnzAE4GTFu	2025-04-12 14:50:42.726	KumP-w8qbx6WFxpUf2JKA	{}
tbAIyTRtx-ATb_65zIVli	5	Super expérience! Les agriculteurs sont très sympathiques. Une belle expérience anti-gaspi.	2025-04-12 14:50:42.726	tuCke_reGK8SrqIp6iuVk	2025-04-12 14:50:42.726	kGpS5LvZWpjy1kiAJxNSw	{https://loremflickr.com/704/2894?lock=896745438678308,https://picsum.photos/seed/5qmeiD/480/476}
Kx8Q2pcCY4ZXJo4etFj5W	5	Super expérience! On reviendra avec plaisir. Je recommande vivement.	2025-04-12 14:50:42.726	YOa5LvBb9CCf5d5a4gHKx	2025-04-12 14:50:42.726	GakIGuCKhnGdpU5jkPiK8	{https://picsum.photos/seed/OM2WrmKMmF/426/3825}
-w169o6UjhHvYhI4Q_L6X	5	Très bonne organisation! On reviendra avec plaisir. À refaire sans hésiter!	2025-04-12 14:50:42.726	YOa5LvBb9CCf5d5a4gHKx	2025-04-12 14:50:42.726	OCJ-A8cxn25KrMA6NPLjR	{}
l73TsjMVx7WVUcM1Gv_by	4	Magnifique échange! Une journée riche en découvertes. Je recommande vivement.	2025-04-12 14:50:42.726	YOa5LvBb9CCf5d5a4gHKx	2025-04-12 14:50:42.726	VmpgLYbHw0Ts4zzA0yoVJ	{}
FL0klbRL89hf-UJZcQVnP	5	Très bonne organisation! Le lieu est facilement accessible. Une belle façon de découvrir le métier d'agriculteur.	2025-04-12 14:50:42.726	_hkNRztq77DpDmhSWdbvr	2025-04-12 14:50:42.726	SZKRhX1Q5FaYJCiCQlTr_	{}
9WnY_wxyVkseNdPoeebWv	5	Excellente initiative! On reviendra avec plaisir. Une belle façon de découvrir le métier d'agriculteur.	2025-04-12 14:50:42.726	_hkNRztq77DpDmhSWdbvr	2025-04-12 14:50:42.726	Uhp31eJtQ5CudpUdiOFDB	{}
6DxHlevDffXu5Q6oDRICo	3	Belle découverte! Les agriculteurs sont très sympathiques. Une belle expérience anti-gaspi.	2025-04-12 14:50:42.726	DHd8YaOr7BK7P3_yEYaBz	2025-04-12 14:50:42.726	ZpZbacewrLB30ngCbnK0Z	{}
BP1pphDR-hgxXpTxME6LU	4	Très bonne organisation! J'ai appris beaucoup sur l'agriculture locale. Une belle façon de découvrir le métier d'agriculteur.	2025-04-12 14:50:42.726	LPcgXzHKlskhXSXGvhwC1	2025-04-12 14:50:42.726	Z8CIpYeuWww5cwXfBL_98	{}
m7W5jtI1jv9lv46n-_XKb	4	Activité très agréable! C'est bon pour la planète et pour le moral. Une belle façon de découvrir le métier d'agriculteur.	2025-04-12 14:50:42.726	LPcgXzHKlskhXSXGvhwC1	2025-04-12 14:50:42.726	RBsNUdyISMH0Ce17M40Ak	{}
bpg2SBJTc-6XOBZp9l2RT	4	Magnifique échange! Parfait pour une activité en famille. Je recommande vivement.	2025-04-12 14:50:42.726	LPcgXzHKlskhXSXGvhwC1	2025-04-12 14:50:42.726	45zVddPrHs2hg7TU6_ILk	{}
l8c5t4K-ZuGshDrwFXJne	4	Accueil chaleureux! On reviendra avec plaisir. Une belle expérience anti-gaspi.	2025-04-12 14:50:42.726	LPcgXzHKlskhXSXGvhwC1	2025-04-12 14:50:42.726	k8Yaa6OCjDEViWJs3LG4I	{}
qBU3yONFcvpVQfppffHHD	2	vraiment nul car pas de parking	2025-04-15 17:31:46.25	knllj1ooxLWIHIUTtyyza	2025-04-15 17:31:46.25	RBsNUdyISMH0Ce17M40Ak	{https://yzrv5nd8tn.ufs.sh/f/sSftFC6thVwkKXka7TGs2oT95gGRePVljMdpvyfanxJiu3B6}
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.sessions (id, session_token, user_id, expires, created_at) FROM stdin;
7z3bw4r5UShsmpWWjVS8o	0aaa5baa-0281-46c4-877c-eeedb1baf161	jInZEbVLlz3JJC0j-3wod	2025-05-14 18:47:33.476	2025-04-14 18:47:33.482
579bmkS5amfCnjC1tR434	5fd0e4a4-d49e-4119-8c27-855032431ca5	CGvKZKzZWDSNs6uNh2QQd	2025-05-23 14:49:40.42	2025-04-23 14:49:40.422
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: cloud_admin
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: statistics; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.statistics (id, last_updated, total_announcements, total_fields, total_food_saved, user_id, total_gleanings) FROM stdin;
ohSvYhxIB-JVIGqwH0Ydh	2025-04-12 14:50:49.934	0	0	0	8CT4TnF2gofBALff2GU_h	0
8GF_esPT1RgEOFbcn0Feq	2025-04-12 14:50:49.934	6	3	0	uAY0QPhcaukvovPdqKyvY	0
TNPgSAqd_znW4Rl2T48Tj	2025-04-12 14:50:49.934	4	3	0	wJudEuLCaw0RY2TvgexG8	0
mQGSkxSuAvZXliiCOxpLd	2025-04-12 14:50:49.934	6	4	0	adVuTpEep2u30gLn5c35x	0
xJBNUnUlD0JPcJFpVUJ0I	2025-04-12 14:50:49.934	5	3	0	dfVRDm9ISI4zTpCXjwSso	0
ZOMSFu3ljSvUDuMt0LeIZ	2025-04-12 14:50:49.934	5	4	0	-Isst8wgpee6oZtXGNX9l	0
NASF99djGAEqN0DcHDQ9Q	2025-04-12 14:50:49.934	4	3	0	LiiAlgc2thux_6-mZrjv8	0
pMrxUO5a4w6b66zzASAnP	2025-04-12 14:50:49.934	5	3	0	OV8W1uNd5UWFiTqoNdQhw	0
t0NSx979gWRXc1LgPKJtT	2025-04-12 14:50:49.934	5	3	0	brluTeh5h2KzkDkUZUrUV	0
Mz6ZvjDMooNUoKkGUmpUH	2025-04-12 14:50:49.934	3	2	0	kglH5LayaWyV45SD6vMmA	0
jLe7i-AIKo94WoB6jZ5JT	2025-04-12 14:50:49.934	3	2	0	AnLmj3jGslAKpgOAdei2g	0
_HgUTBWMTHCvip0LgatKj	2025-04-12 14:50:49.934	5	3	0	5rh3uTfhPuhks_59YjBnE	0
AsdU_KaN1lIf-GR2ZQ4Ya	2025-04-12 14:50:49.934	6	4	0	VqtNokSNeEYGxdr4Y6o6o	0
YiddLUEYnU6kp-URAhrFN	2025-04-12 14:50:49.934	7	4	0	cafS6eupem4x1ME6mtG8Y	0
V9X0GAqUDl7haahp51vEk	2025-04-12 14:50:49.934	5	4	0	W5b-TE3dj_d6S1TDiswah	0
s7kcYP35l1R7xMlpVklYo	2025-04-12 14:50:49.934	5	4	0	2j3fd180ij2-wc7d_kKcr	0
k8hzDfDE4gIBWI0Fn3z-d	2025-04-12 14:50:49.934	7	4	0	T0V7DyP0r_Mgd-HCqO-d3	0
tuTj0I4kwbw5T1cGhvcpf	2025-04-12 14:50:49.934	6	4	0	HTAwwq918Sv1oOx78H0II	0
nmOCtflWNHsqrmD7IvBMA	2025-04-12 14:50:49.934	5	4	0	ydfUeRgq9gXlm0erlo5SK	0
PutBxSkPP5-330t7YZE2U	2025-04-12 14:50:49.934	5	3	0	yJvh2OhJ9qOdigVHh3Dj1	0
LwkPOCQXY0BT1EJ-CHGz3	2025-04-12 14:50:49.934	3	3	0	bZ8I3fgbY7O3S_QDy2R5-	0
Dr-nXRgpNswuxFHl1r3IC	2025-04-12 14:50:49.934	0	3	0	vvVHV7ZkDaZ2PJOepW1zZ	0
H5_ntwy0oqokgyctf6E5H	2025-04-12 14:50:49.934	0	2	0	Vz1jBXrgAW88nLQ92NseR	0
9_hdrx-rMt88nInKbvFPT	2025-04-12 14:50:49.934	0	3	0	yLmHSXTXS-FhegcK8B1tQ	0
gOQZdxqmM9P1c3f797ngr	2025-04-12 14:50:49.934	0	3	0	bxw52YkAf3kya9uiRd8yE	0
XjDN-BnPejJdJn46oHNLX	2025-04-12 14:50:49.934	0	4	0	Lu842AREolk1Iapw5cqVH	0
c9w1-aD2S145vAtG0VwMR	2025-04-12 14:50:49.934	0	2	0	rmRBt9_48yR7ofyN2KNr7	0
jHjhlNk5qkdu2aSxJfCIf	2025-04-12 14:50:49.934	0	4	0	vVh5wAlS2cVRW6vRjwJp8	0
ODfflHR5hPfeZ9Itp4mdV	2025-04-12 14:50:49.934	0	3	0	vylxmUrAw0uflJ260rgc9	0
sfd9GXz8kcIPRkpp5Neh_	2025-04-12 14:50:49.934	0	3	0	0mqpTYdGz_2LSZFVQg9Ho	0
9rjEhcgxq5lty6sNSHhzV	2025-04-12 14:50:49.934	0	2	0	pnXe3wEkXY6CScPUeE_zo	0
Dv-st9wvmJGFeQWS4U3DB	2025-04-12 14:50:49.934	0	4	0	QXpx5jbDmsR7KYq7BLaZs	0
cV62viwyndi9S5TpapVXT	2025-04-12 14:50:49.934	0	2	0	86gSxFnM0G0YmdYAGUOyZ	0
wl52rRZNU7cFCgcpN1Stq	2025-04-12 14:50:49.934	0	4	0	tahXVGsywRvWz6anZZUpO	0
ji_P07mIg65b_y4bzqj4t	2025-04-12 14:50:49.934	0	4	0	NsFT9ATiUfMzoM5Gxrlla	0
9LyihfpeK13hlnThka8VJ	2025-04-12 14:50:49.934	0	2	0	KoLEp8twy5jdMVjxuaE2f	0
QxbIUMDtAQWdAisJhqfm3	2025-04-12 14:50:49.934	0	4	0	ox43gqffBk_84FZTc8vBC	0
f-2mG0Tz8FiiGPsdkvnP6	2025-04-12 14:50:49.934	0	4	0	SR8dgc5xm0DucI8_HCoaX	0
-CHc3yf6FNfs_YulPzNHq	2025-04-12 14:50:49.934	0	2	0	RbE1kYFdajC7rTQR6Cj2Z	0
_80J6wl7DOMsGTE5aaB4x	2025-04-12 14:50:49.934	0	4	0	RbDbMA8ak4jRDPW3i4N-h	0
MSyi5t7qoV3MgKBXqMXtl	2025-04-12 14:50:49.934	0	3	0	4YidRAUq2nDPoEWigTQBu	0
JHvvdqbs4zPhlyX1sxU7X	2025-04-12 14:50:49.934	0	3	0	foKvn5K0VRZMRmuHLFWcc	0
GdzilQYDVsPzQyBn4zcZw	2025-04-12 14:50:49.934	0	3	0	YOUOqWeVx3wIW_mOLvqqo	0
ZssGkjU4bc56gmkrj8UXd	2025-04-12 14:50:49.934	0	4	0	N3hmqsQgEA2pQN9mCI1YG	0
blHFrSZ2UDR7vlXrhtK1Q	2025-04-12 14:50:49.934	0	2	0	_BVbk1M-eGph8GpaSqmGg	0
SkaC--Oj-fw0Udoatij9_	2025-04-12 14:50:49.934	0	3	0	ZBt4I58AWyPwIO026bZiS	0
IiCRblhtBEVOjpj9NiHJb	2025-04-12 14:50:49.934	0	3	0	uYTjplE72kKR9lYtTN2Nc	0
UrPndkYYaiDIkneTUWSu_	2025-04-12 14:50:49.934	0	2	0	8iD8DXBPxidpo10n4qDgH	0
UEx5wWq3z5wNJCNTHpiWL	2025-04-12 14:50:49.934	0	2	0	RuuNJuI8FLGjG3FWhKkAf	0
wtz8mmasvm56Tj2N-tF_Q	2025-04-12 14:50:49.934	0	2	0	yuVMRMM0cxqLGMixUojJM	0
RP1rhAfIFevdGEHq01k1d	2025-04-12 14:50:49.934	0	4	0	CqqyfXQ25KQBoULzkCVVy	0
QZs7D17uwDICG2Z227D15	2025-04-12 14:50:49.934	0	0	0	yvj8NMsyZOgZsMtLDe9XU	0
6ugiE7X_82X55By1Pu-9A	2025-04-12 14:50:49.934	0	0	21.6	01yWC_Lwl2tOgCaJW9UOJ	2
UAAjI3vg5GIAaFWpysuqy	2025-04-12 14:50:49.934	0	0	16.8	45zVddPrHs2hg7TU6_ILk	2
mE-qzTBaOiYYT5DmMzuyp	2025-04-12 14:50:49.934	0	0	31.2	Y52HSKpDMBEQf-K3Ee8tx	2
uZwx_xbaV5SlPaoocePEm	2025-04-12 14:50:49.934	0	0	18	k8Yaa6OCjDEViWJs3LG4I	3
zlYvo0DWfJnuruX0QFzYa	2025-04-12 14:50:49.934	0	0	0	jjLNpjyIGLcsK-73OTWFv	0
uMpNDFl6e4IkAlomHEr8V	2025-04-12 14:50:49.934	0	0	0	L6cIque1qSZrk3fUf1zIc	0
F1FKsZ6MhrI5Qeg7xHncE	2025-04-12 14:50:49.934	0	0	45.2	4Ncn2f_PWAGO4m7RenDoB	4
U4ua-88AIMzTwtQQd7job	2025-04-12 14:50:49.934	0	0	8.2	Fa15qoJmWrl6KmnTI-jMB	1
uhBg9h_96mIE4Ut_iqwUI	2025-04-12 14:50:49.934	0	0	30.8	gFf5j5LiuvirJqfrArqAo	2
EqRHCaCm0jCbMatlLkmiI	2025-04-12 14:50:49.934	0	0	39.6	ZpZbacewrLB30ngCbnK0Z	2
WggCDgVn_HzYLdAs3WqDD	2025-04-12 14:50:49.934	0	0	25.2	OCJ-A8cxn25KrMA6NPLjR	2
KoIUl7lIAWHXGt9gEbCVU	2025-04-12 14:50:49.934	0	0	6.2	43lHPQsRU1hCqsgsP5h5N	1
YqFMiwYeHPUL7MLAjRB-k	2025-04-12 14:50:49.934	0	0	32.7	3LEh25p5i6R3i3c1iYkjU	3
LoihyXINx-YQBTzj0G0fe	2025-04-12 14:50:49.934	0	0	24.6	5DAjUr1HTKBuxAC-xTBt_	2
IHTOI9LK3iHmawyfRUvMS	2025-04-12 14:50:49.934	0	0	22.2	kGpS5LvZWpjy1kiAJxNSw	3
ykfRjG2s9mLj8RF9nz-Ij	2025-04-12 14:50:49.934	0	0	7.7	lLNPH9f1ygnfuTM_cr-Lr	1
6rmQFwreUpKqGbOUhfTJl	2025-04-12 14:50:49.934	0	0	24	Th5W58hZQTGVSoKIsnBuU	3
-3w6XUnBgJq153PaKL6E2	2025-04-12 14:50:49.934	0	0	33	YMXwZNNWxO6hcnh9fdENU	2
MOEmRpsHf746Is-ocCWiZ	2025-04-12 14:50:49.934	0	0	17.2	VmpgLYbHw0Ts4zzA0yoVJ	2
L8GnaO0SH-WhpxlXLYHLf	2025-04-12 14:50:49.934	0	0	42	bB585VEfv8KcxbJZNmsx4	3
eYD6pQwxGccQ3AFf6Kw-1	2025-04-12 14:50:49.934	0	0	77.2	GakIGuCKhnGdpU5jkPiK8	4
XTxFv3Xs9i6BlyPlXRZoR	2025-04-12 14:50:49.934	0	0	62.4	273wt6tMXl-Ca5ynLoV0v	4
8fT6AQUG6Ux13jqHfMckS	2025-04-12 14:50:49.934	0	0	57.59999999999999	YrrRZiqhaeatZgSt_gVCm	3
Xf6sIP_vUxiH5f2wliZEt	2025-04-12 14:50:49.934	0	0	21.6	ukaJfuwXj0obGcVJKId3h	2
Jxn7a5WUPgaqKjD1P9dvj	2025-04-12 14:50:49.934	0	0	30.8	5a5xhw4O0SvpIzLDNjz8Q	2
Te_bMkPH5wqTQpANZH9rs	2025-04-12 14:50:49.934	0	0	18.8	FMbASdqKjJwWsOXC3UfAw	1
hWtcJyyyAF7S57qpJIHTO	2025-04-12 14:50:49.934	0	0	0	y626PjSfwi_LHi-B3Ve4q	0
ukpRao55A1TSnJZp9cBfE	2025-04-12 14:50:49.934	0	0	27.4	gmT92fxxkOJ4ptSVBFZ_x	2
LT7LIRYQpcUNwdxT4LUUZ	2025-04-12 14:50:49.934	0	0	25.6	VVv1O-EU2pP2W0IJydmWE	2
ektmxkW61YhqM3Q5ywhco	2025-04-12 14:50:49.934	0	0	7.1	gNIx-RR8qV4__W7LM6WNp	1
khj_BZky2Cwt6NG53-Okg	2025-04-12 14:50:49.934	0	0	18.6	q3E_VbrVuB743Stxvndaf	3
UpfjHjqowwhMEbnXtklWt	2025-04-12 14:50:49.934	0	0	17.9	mOxIDeAei1AJGDa_ckloW	1
Ok9eZOSQ2tCDk42dAJo50	2025-04-12 14:50:49.934	0	0	56.09999999999999	SZKRhX1Q5FaYJCiCQlTr_	3
seZMA9vaESFhDwMBIT7FC	2025-04-12 14:50:49.934	0	0	31.6	_p0GiRzZUf-PKMJTDknEW	2
rpMlga05fc4vG99jMlbS2	2025-04-12 14:50:49.934	0	0	69.6	Z8CIpYeuWww5cwXfBL_98	4
z2m64h5LWP5N8gqdl27QX	2025-04-12 14:50:49.934	0	0	16.2	HlMUoNCUSGcioecjNUSmC	1
JNOvfb7yMO9qUz5hfNi9X	2025-04-12 14:50:49.934	0	0	0	p4apbNOlKXv1puswb6rz-	0
to3U31-AK4pZBXiApx7Sz	2025-04-12 14:50:49.934	0	0	17.1	KumP-w8qbx6WFxpUf2JKA	3
tlEvpEYlLncSvlXS1JAU_	2025-04-12 14:50:49.934	0	0	30.3	4U7lIf2tjVj9zLreYPbew	3
M-sjIA95DkyaKeEWp3Fjb	2025-04-12 14:50:49.934	0	0	26.4	uRotKVVYm7YzvjaBsRTZF	2
Yl8NViQTwNqQ9DIPqlb1d	2025-04-12 14:50:49.934	0	0	29.2	d1fHsboAEUT5pmvhc-kQ-	2
j86okra1fNm3vDQdoiP6c	2025-04-12 14:50:49.934	0	0	29.2	1giTvQvHezi8aZ3F9DfvD	2
IknYu1CH--7G_KDLd083Z	2025-04-12 14:50:49.934	0	0	17.2	RBsNUdyISMH0Ce17M40Ak	2
vg96-m9PbW0PUpr_D7RwN	2025-04-12 14:50:49.934	0	0	28.8	X6CtufPuMUtb02Lk91f2G	2
t6Jp_bfTD3QocBUYg9__h	2025-04-12 14:50:49.934	0	0	35	pTNnWqDYFYi6yDNoLDLUE	2
kkerjYBn4pTuojSZ2eZql	2025-04-12 14:50:49.934	0	0	22.5	Yb6WEOiSN4Cv1c-YV35HR	3
0VBUOkeTjppLRmNv2IWwT	2025-04-12 14:50:49.934	0	0	5.5	Uhp31eJtQ5CudpUdiOFDB	1
adwSPmXpSgifCg8VeVSwj	2025-04-12 14:50:49.934	0	0	16.6	30eFtilsOe7FLfDD_FWtD	2
Hd3IbldZbpAhuGh5VzZ3p	2025-04-12 14:50:49.934	0	0	17.4	kpJhCAmEsaZlOYlkuQusI	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.users (id, name, email, image, bio, plan, role, language, created_at, deleted_at, email_verified, password_hash, resend_contact_id, stripe_customer_id, updated_at, onboarding_completed, accept_geolocation, city, postal_code, rules_accepted_at, terms_accepted_at) FROM stdin;
8CT4TnF2gofBALff2GU_h	Admin Field4u	admin@field4u.be	\N	administrateur de la plateforme Field4u	PREMIUM	ADMIN	FRENCH	2025-04-12 14:50:36.621	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.621	t	t	Bruxelles	1000	2025-04-12 14:50:36.618	2025-04-12 14:50:36.618
uAY0QPhcaukvovPdqKyvY	Michel Vermeulen	michel70@skynet.be	\N	agriculteur·rice passionné·e de la région de Wavre	PREMIUM	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Wavre	1300	2025-04-12 14:50:36.676	2025-04-12 14:50:36.676
wJudEuLCaw0RY2TvgexG8	Claire Jacobs	jacobsc@skynet.be	\N	agriculteur·rice passionné·e de la région de Ath	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Ath	7800	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
adVuTpEep2u30gLn5c35x	Koen Lambert	koen.lambert@proximus.be	\N	agriculteur·rice passionné·e de la région de Malines	PREMIUM	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Malines	2800	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
dfVRDm9ISI4zTpCXjwSso	François De Vos	françois29@proximus.be	\N	agriculteur·rice passionné·e de la région de Philippeville	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Philippeville	5600	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
-Isst8wgpee6oZtXGNX9l	Anne Verstraete	verstraetea@proximus.be	\N	agriculteur·rice passionné·e de la région de Couvin	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Couvin	5660	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
LiiAlgc2thux_6-mZrjv8	Lisa Jacobs	lisa76@telenet.be	\N	agriculteur·rice passionné·e de la région de Eupen	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Eupen	4700	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
OV8W1uNd5UWFiTqoNdQhw	Bart Vermeulen	vermeulenb@hotmail.com	\N	agriculteur·rice passionné·e de la région de Anvers	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Anvers	2000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
brluTeh5h2KzkDkUZUrUV	Eline Dubois	eline.dubois@skynet.be	\N	agriculteur·rice passionné·e de la région de Rochefort	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Rochefort	5580	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
kglH5LayaWyV45SD6vMmA	Pieter Dumont	pieter.dumont@telenet.be	\N	agriculteur·rice passionné·e de la région de Thuin	PREMIUM	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Thuin	6530	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
AnLmj3jGslAKpgOAdei2g	Eline De Vos	de vose@skynet.be	\N	agriculteur·rice passionné·e de la région de Hasselt	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Hasselt	3500	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
5rh3uTfhPuhks_59YjBnE	Luc Dumont	luc.dumont@skynet.be	\N	agriculteur·rice passionné·e de la région de Hasselt	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Hasselt	3500	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
VqtNokSNeEYGxdr4Y6o6o	Tom Verstraete	tom.verstraete@gmail.com	\N	agriculteur·rice passionné·e de la région de Tongres	PREMIUM	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	f	Tongres	3700	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
cafS6eupem4x1ME6mtG8Y	Céline De Smet	céline.de smet@proximus.be	\N	agriculteur·rice passionné·e de la région de Tongres	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Tongres	3700	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
W5b-TE3dj_d6S1TDiswah	Pierre Legrand	pierre86@skynet.be	\N	agriculteur·rice passionné·e de la région de Saint-Vith	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Saint-Vith	4780	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
2j3fd180ij2-wc7d_kKcr	Marc Lambert	marc78@skynet.be	\N	agriculteur·rice passionné·e de la région de Braine-l'Alleud	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Braine-l'Alleud	1420	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
T0V7DyP0r_Mgd-HCqO-d3	Isabelle Leclercq	isabelle.leclercq@voo.be	\N	agriculteur·rice passionné·e de la région de Waterloo	PREMIUM	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Waterloo	1410	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
HTAwwq918Sv1oOx78H0II	Maarten Legrand	maarten7@proximus.be	\N	agriculteur·rice passionné·e de la région de Eupen	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Eupen	4700	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
ydfUeRgq9gXlm0erlo5SK	Charlotte Dumont	charlotte.dumont@skynet.be	\N	agriculteur·rice passionné·e de la région de Wavre	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Wavre	1300	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
yJvh2OhJ9qOdigVHh3Dj1	Emma Wouters	emma.wouters@gmail.com	\N	agriculteur·rice passionné·e de la région de Gembloux	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Gembloux	5030	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
bZ8I3fgbY7O3S_QDy2R5-	Anne Verstraete	anne21@telenet.be	\N	agriculteur·rice passionné·e de la région de Malines	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Malines	2800	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
vvVHV7ZkDaZ2PJOepW1zZ	Luc Delcourt	luc.delcourt@telenet.be	\N	agriculteur·rice passionné·e de la région de Louvain	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Louvain	3000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
Vz1jBXrgAW88nLQ92NseR	Julie Maes	julie.maes@gmail.com	\N	agriculteur·rice passionné·e de la région de Saint-Trond	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Saint-Trond	3800	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
yLmHSXTXS-FhegcK8B1tQ	Julien Dupont	julien56@voo.be	\N	agriculteur·rice passionné·e de la région de Anvers	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Anvers	2000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
bxw52YkAf3kya9uiRd8yE	Sarah Bogaert	bogaerts@outlook.be	\N	agriculteur·rice passionné·e de la région de Ostende	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Ostende	8400	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
Lu842AREolk1Iapw5cqVH	Sophie Peeters	sophie.peeters@proximus.be	\N	agriculteur·rice passionné·e de la région de Ciney	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Ciney	5590	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
rmRBt9_48yR7ofyN2KNr7	Valérie Deschamps	deschampsv@hotmail.com	\N	agriculteur·rice passionné·e de la région de Spa	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Spa	4900	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
vVh5wAlS2cVRW6vRjwJp8	Lotte Deschamps	lotte78@outlook.be	\N	agriculteur·rice passionné·e de la région de Saint-Vith	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Saint-Vith	4780	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
vylxmUrAw0uflJ260rgc9	Maarten Vandenberghe	maarten.vandenberghe@outlook.be	\N	agriculteur·rice passionné·e de la région de Binche	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Binche	7130	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
0mqpTYdGz_2LSZFVQg9Ho	Claire Laurent	claire.laurent@telenet.be	\N	agriculteur·rice passionné·e de la région de Libramont	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Libramont	6800	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
pnXe3wEkXY6CScPUeE_zo	Elise Dupont	duponte@gmail.com	\N	agriculteur·rice passionné·e de la région de Visé	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Visé	4600	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
QXpx5jbDmsR7KYq7BLaZs	Elise De Smet	de smete@hotmail.com	\N	agriculteur·rice passionné·e de la région de Courtrai	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Courtrai	8500	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
86gSxFnM0G0YmdYAGUOyZ	Stijn De Vos	de voss@gmail.com	\N	agriculteur·rice passionné·e de la région de Neufchâteau	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Neufchâteau	6840	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
tahXVGsywRvWz6anZZUpO	Joris Wouters	joris.wouters@skynet.be	\N	agriculteur·rice passionné·e de la région de Charleroi	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Charleroi	6000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
NsFT9ATiUfMzoM5Gxrlla	Tom Janssens	janssenst@voo.be	\N	agriculteur·rice passionné·e de la région de Malines	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Malines	2800	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
KoLEp8twy5jdMVjxuaE2f	Catherine Maes	catherine.maes@gmail.com	\N	agriculteur·rice passionné·e de la région de Saint-Nicolas	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Saint-Nicolas	9100	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
ox43gqffBk_84FZTc8vBC	Julie Leclercq	julie61@voo.be	\N	agriculteur·rice passionné·e de la région de Namur	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Namur	5000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
SR8dgc5xm0DucI8_HCoaX	Eline Jacobs	eline.jacobs@hotmail.com	\N	agriculteur·rice passionné·e de la région de Namur	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Namur	5000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
RbE1kYFdajC7rTQR6Cj2Z	Julien Verstraete	verstraetej@proximus.be	\N	agriculteur·rice passionné·e de la région de Durbuy	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Durbuy	6940	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
RbDbMA8ak4jRDPW3i4N-h	Laura Lambert	laura.lambert@voo.be	\N	agriculteur·rice passionné·e de la région de Bruxelles	PREMIUM	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Bruxelles	1000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
4YidRAUq2nDPoEWigTQBu	Isabelle Leroy	isabelle.leroy@telenet.be	\N	agriculteur·rice passionné·e de la région de Liège	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Liège	4000	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
foKvn5K0VRZMRmuHLFWcc	Sofie Leroy	sofie87@outlook.be	\N	agriculteur·rice passionné·e de la région de Ath	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Ath	7800	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
YOUOqWeVx3wIW_mOLvqqo	Claire Deschamps	claire.deschamps@voo.be	\N	agriculteur·rice passionné·e de la région de Arlon	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Arlon	6700	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
N3hmqsQgEA2pQN9mCI1YG	Eline Mertens	eline.mertens@outlook.be	\N	agriculteur·rice passionné·e de la région de La Louvière	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	La Louvière	7100	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
_BVbk1M-eGph8GpaSqmGg	Céline Deschamps	deschampsc@telenet.be	\N	agriculteur·rice passionné·e de la région de Spa	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Spa	4900	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
ZBt4I58AWyPwIO026bZiS	Jean Lambert	jean20@skynet.be	\N	agriculteur·rice passionné·e de la région de Waremme	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Waremme	4300	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
uYTjplE72kKR9lYtTN2Nc	Claire De Vos	claire.de vos@proximus.be	\N	agriculteur·rice passionné·e de la région de Binche	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Binche	7130	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
8iD8DXBPxidpo10n4qDgH	Eva Verstraete	eva.verstraete@proximus.be	\N	agriculteur·rice passionné·e de la région de Huy	FREE	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Huy	4500	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
RuuNJuI8FLGjG3FWhKkAf	Charlotte Renard	renardc@outlook.be	\N	agriculteur·rice passionné·e de la région de Saint-Nicolas	PREMIUM	FARMER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Saint-Nicolas	9100	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
yuVMRMM0cxqLGMixUojJM	Catherine Wouters	catherine95@skynet.be	\N	agriculteur·rice passionné·e de la région de Saint-Vith	FREE	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Saint-Vith	4780	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
CqqyfXQ25KQBoULzkCVVy	Claire Vandenberghe	claire70@proximus.be	\N	agriculteur·rice passionné·e de la région de Tournai	PREMIUM	FARMER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Tournai	7500	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
yvj8NMsyZOgZsMtLDe9XU	David Leclercq	david28@proximus.be	\N	membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Braine-l'Alleud	1420	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
01yWC_Lwl2tOgCaJW9UOJ	Catherine Dupont	catherine95@outlook.be	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Hasselt	3500	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
45zVddPrHs2hg7TU6_ILk	Marc Deschamps	marc.deschamps@telenet.be	\N	j'aime découvrir le travail des agriculteurs locaux	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Tervuren	3080	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
Y52HSKpDMBEQf-K3Ee8tx	Julien Leroy	leroyj@hotmail.com	\N	passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Gembloux	5030	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
k8Yaa6OCjDEViWJs3LG4I	Koen Wouters	koen12@outlook.be	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Ottignies	1340	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
jjLNpjyIGLcsK-73OTWFv	Tom Laurent	laurentt@gmail.com	\N	passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Bastogne	6600	2025-04-12 14:50:36.677	2025-04-12 14:50:36.677
L6cIque1qSZrk3fUf1zIc	Pierre Vandenberghe	vandenberghep@skynet.be	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Bruxelles	1000	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
4Ncn2f_PWAGO4m7RenDoB	Pieter Wouters	woutersp@hotmail.com	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Saint-Vith	4780	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
Fa15qoJmWrl6KmnTI-jMB	Emma Hermans	emma.hermans@skynet.be	\N	j'aime découvrir le travail des agriculteurs locaux	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Hasselt	3500	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
gFf5j5LiuvirJqfrArqAo	Joris Martin	joris.martin@outlook.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Alost	9300	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
ZpZbacewrLB30ngCbnK0Z	Anne Renard	anne75@voo.be	\N	à la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Durbuy	6940	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
OCJ-A8cxn25KrMA6NPLjR	Michel Dubois	michel.dubois@voo.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Malines	2800	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
43lHPQsRU1hCqsgsP5h5N	Julien Renard	julien.renard@hotmail.com	\N	à la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Hasselt	3500	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
3LEh25p5i6R3i3c1iYkjU	Catherine Willems	catherine.willems@hotmail.com	\N	sensible aux questions environnementales	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Anvers	2000	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
5DAjUr1HTKBuxAC-xTBt_	Koen Simon	simonk@gmail.com	\N	j'aime découvrir le travail des agriculteurs locaux	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Binche	7130	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
kGpS5LvZWpjy1kiAJxNSw	Sophie Hermans	hermanss@voo.be	\N	j'aime découvrir le travail des agriculteurs locaux	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Waremme	4300	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
lLNPH9f1ygnfuTM_cr-Lr	Stijn Leroy	leroys@proximus.be	\N	membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Courtrai	8500	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
Th5W58hZQTGVSoKIsnBuU	Julie Deschamps	julie.deschamps@proximus.be	\N	à la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Gand	9000	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
YMXwZNNWxO6hcnh9fdENU	Stijn Janssens	janssenss@telenet.be	\N	sensible aux questions environnementales	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Braine-l'Alleud	1420	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
VmpgLYbHw0Ts4zzA0yoVJ	Luc Bogaert	luc.bogaert@outlook.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Waremme	4300	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
bB585VEfv8KcxbJZNmsx4	Catherine Renard	catherine.renard@voo.be	\N	sensible aux questions environnementales	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Philippeville	5600	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
GakIGuCKhnGdpU5jkPiK8	Stijn Maes	stijn14@gmail.com	\N	sensible aux questions environnementales	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Silly	7830	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
YrrRZiqhaeatZgSt_gVCm	Wim Willems	willemsw@skynet.be	\N	sensible aux questions environnementales	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Silly	7830	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
ukaJfuwXj0obGcVJKId3h	Koen Renard	koen.renard@skynet.be	\N	j'aime découvrir le travail des agriculteurs locaux	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Houffalize	6660	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
5a5xhw4O0SvpIzLDNjz8Q	Nathalie Hermans	nathalie.hermans@outlook.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Louvain	3000	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
FMbASdqKjJwWsOXC3UfAw	Charlotte De Vos	charlotte3@telenet.be	\N	membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Ciney	5590	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
y626PjSfwi_LHi-B3Ve4q	Michel Goossens	goossensm@proximus.be	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Liège	4000	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
gmT92fxxkOJ4ptSVBFZ_x	Marc Vermeulen	marc87@skynet.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Dinant	5500	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
VVv1O-EU2pP2W0IJydmWE	Nathalie Verstraete	verstraeten@skynet.be	\N	passionné·e par l'agriculture locale et durable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Ostende	8400	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
gNIx-RR8qV4__W7LM6WNp	Marc Bogaert	bogaertm@gmail.com	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Silly	7830	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
q3E_VbrVuB743Stxvndaf	Michel Maes	michel42@proximus.be	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	t	Braine-l'Alleud	1420	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
mOxIDeAei1AJGDa_ckloW	Sofie Lambert	sofie44@proximus.be	\N	passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Malines	2800	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
SZKRhX1Q5FaYJCiCQlTr_	Luc Dumont	luc80@gmail.com	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Arlon	6700	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
_p0GiRzZUf-PKMJTDknEW	Isabelle Hermans	isabelle77@proximus.be	\N	passionné·e par l'agriculture locale et durable	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Verviers	4800	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
Z8CIpYeuWww5cwXfBL_98	Wim Renard	renardw@skynet.be	\N	à la recherche d'une alimentation plus responsable	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Silly	7830	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
HlMUoNCUSGcioecjNUSmC	Joris Dumont	joris34@voo.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Marche-en-Famenne	6900	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
p4apbNOlKXv1puswb6rz-	Eline Renard	renarde@proximus.be	\N	à la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Coxyde	8670	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
KumP-w8qbx6WFxpUf2JKA	David Renard	david43@outlook.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Braine-l'Alleud	1420	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
4U7lIf2tjVj9zLreYPbew	Luc Bogaert	luc48@gmail.com	\N	sensible aux questions environnementales	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Chimay	6460	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
uRotKVVYm7YzvjaBsRTZF	Claire Janssens	janssensc@gmail.com	\N	j'aime découvrir le travail des agriculteurs locaux	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	f	f	Turnhout	2300	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
d1fHsboAEUT5pmvhc-kQ-	Catherine Maes	catherine.maes@skynet.be	\N	membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Wavre	1300	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
1giTvQvHezi8aZ3F9DfvD	Valérie Deschamps	valérie.deschamps@gmail.com	\N	je cherche à favoriser les circuits courts	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Bruges	8000	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
RBsNUdyISMH0Ce17M40Ak	Jean Martin	martinj@telenet.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Nivelles	1400	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
X6CtufPuMUtb02Lk91f2G	Joris Deschamps	joris.deschamps@outlook.be	\N	engagé·e dans la lutte contre le gaspillage alimentaire	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Genk	3600	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
pTNnWqDYFYi6yDNoLDLUE	David Martin	david.martin@telenet.be	\N	membre actif·ve de la communauté anti-gaspi	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Ottignies	1340	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
Yb6WEOiSN4Cv1c-YV35HR	Julie Vandenberghe	julie.vandenberghe@outlook.be	\N	sensible aux questions environnementales	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Arlon	6700	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
Uhp31eJtQ5CudpUdiOFDB	Eva Maes	maese@telenet.be	\N	j'aime découvrir le travail des agriculteurs locaux	FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Malines	2800	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
30eFtilsOe7FLfDD_FWtD	Nathalie Maes	nathalie60@proximus.be	\N	à la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	f	Namur	5000	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
kpJhCAmEsaZlOYlkuQusI	Sophie Verstraete	verstraetes@gmail.com	\N	à la recherche d'une alimentation plus responsable	FREE	GLEANER	FRENCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 14:50:36.682	t	t	Tournai	7500	2025-04-12 14:50:36.678	2025-04-12 14:50:36.678
273wt6tMXl-Ca5ynLoV0v	Wim Delcourt	delcourtw@voo.be	\N		FREE	GLEANER	DUTCH	2025-04-12 14:50:36.682	\N	\N	$2b$10$Ax9A3QSsioHqYhgp2FcmMulDMYCibC02r3gWCd07rSh4Wdeupumq.	\N	\N	2025-04-12 16:38:47.019	t	t	Woluwe-Saint-Pierre	1150	2025-04-12 16:38:47.018	2025-04-12 16:38:43.761
fUjKJ2TkRxbLOjHCbh-dW	juline	jjjjjjjjjjjjjjjjjjjjjjjjjj@gmail.com	\N	\N	FREE	GLEANER	FRENCH	2025-04-21 15:08:26.642	\N	2025-04-21 15:08:26.64	\N	fd892db9-8978-40a2-b8ee-c95e881626ba	cus_SAhMGbpKFzDXAa	2025-04-21 15:16:01.481	f	f	\N	\N	\N	\N
0li55hX02UbQ57rBGG9WH	lucas	dqsdsqdqsd@gmail.com	\N	dsqdsqdqs	FREE	GLEANER	FRENCH	2025-04-14 19:43:25.395	\N	\N	$2b$10$cQ5.W.kVNbihkrX4BYvmC.YtoGb2rcDZYLPBUIdYXkaKxeLfoY23q	67c18926-6f32-4b8b-ab70-789c804889ba	cus_S89Dwv1ShTNGZR	2025-04-14 19:48:20.86	t	t	Woluwe-Saint-Pierre	1150	2025-04-14 19:44:20.413	2025-04-14 19:44:12.258
75xhe2xeADgLf754213rO	dsddsdsd	dsdsqqqqqqqqqq@gmail.com	\N	\N	FREE	GLEANER	FRENCH	2025-04-20 19:37:40.94	\N	2025-04-20 19:37:40.939	\N	ceabc920-f7d4-4b73-b9b8-f523175c2b33	cus_SAOTQgscP1h0KT	2025-04-20 19:42:29.937	f	f	\N	\N	\N	\N
r84Bjxp2mvsBNjFrp7CIe	ezaaaaaaaaaaaa	ezaeeddddd@gmail.com	\N	dqsssssssssd	FREE	GLEANER	FRENCH	2025-04-16 19:45:26.519	\N	\N	$2b$10$JrBIfmeDqokxq/tFRCxFJeiIOPtWNj8mXleA/yA5E1MyATWmCNPke	093bbd6e-3b42-4819-b083-d30c4fa19814	cus_S8thJV3OTVdlbk	2025-04-16 19:46:25.857	t	t	Woluwe-Saint-Pierre	1150	2025-04-16 19:46:25.855	2025-04-16 19:46:15.081
PmyWcDN1TIyKHyfGuuKaO	jean marque	dsqdqs@gmail.com	\N	\N	FREE	GLEANER	FRENCH	2025-04-20 19:35:37.631	\N	2025-04-20 19:35:37.629	\N	662e9b44-04fb-44e8-80c7-04e9a93710fa	cus_SAORdBQ2u7I9Yg	2025-04-20 19:36:49.183	f	f	\N	\N	\N	\N
jInZEbVLlz3JJC0j-3wod	Antoine D	ademeure29@gmail.com	https://avatars.githubusercontent.com/u/91534880?v=4		FREE	GLEANER	ENGLISH	2025-04-14 18:47:32.147	\N	\N	\N	ba4d50d7-6f46-497d-a607-e0c6db6bf662	cus_S88Jjb5C2g7b7T	2025-04-22 12:43:31.249	f	f			\N	\N
FTV1zsy-89HQQB7F92a_a	admin	admin@glean.be	\N	\N	FREE	GLEANER	FRENCH	2025-04-20 20:21:33.239	\N	2025-04-20 20:21:33.235	\N	671b0146-4382-45a1-b8f4-d364836f2ce4	cus_SAPBm9q6J61FUU	2025-04-20 20:21:55.699	f	f	\N	\N	\N	\N
Iv86UTFrZs2X4QzBG0LdZ	ezaille	ezaaaaaaaaaaaaaaa@gmail.com	\N	\N	FREE	GLEANER	FRENCH	2025-04-21 15:18:42.057	\N	2025-04-21 15:18:42.056	\N	cb9dbe4f-b9e8-48af-ac76-975de7a645ff	cus_SAhWcGnzWYEqa5	2025-04-21 15:18:51.049	f	f	\N	\N	\N	\N
ZFgLKJX8bViEHNzO2pkoZ	antoine	antoine@gmail.com	\N	\N	FREE	GLEANER	FRENCH	2025-04-20 21:34:16.907	\N	2025-04-20 21:34:16.905	\N	3eb68d08-3bf7-4b22-960f-39e9e53a58fe	cus_SAQLEDJn3Z3Xx2	2025-04-20 21:34:57.726	f	f	\N	\N	\N	\N
Qq1yq4AOh58jpcMPIxLG_	\N	ezaz. student@gmail.com	\N	\N	FREE	GLEANER	FRENCH	2025-04-21 13:57:21.059	\N	2025-04-21 14:27:44.042	\N	28c761ee-ffd1-41b4-95d8-420805f318fe	cus_SAgD0HB9668wAN	2025-04-21 14:27:44.045	f	f	\N	\N	\N	\N
U4_kqEGN52r5bTUhro2T0	\N	dsdqdsds@gmail.com	\N	\N	FREE	GLEANER	FRENCH	2025-04-21 15:39:04.813	\N	2025-04-21 15:39:04.811	\N	57344ea1-f2fc-4acf-bc2c-dec48cfbbecb	cus_SAhqkx2LgKfK4r	2025-04-21 15:39:05.901	f	f	\N	\N	\N	\N
CGvKZKzZWDSNs6uNh2QQd	ByUraza Bye	byebyuraza@gmail.com	https://lh3.googleusercontent.com/a/ACg8ocJcPJ8NDFXZS9vjmv_ORPt9VFfkXFo1XLxseulO_YYRYJzdEw=s96-c	\N	FREE	GLEANER	FRENCH	2025-04-23 14:49:39.109	\N	\N	\N	40e13bed-a945-4cbb-83bb-4bface9cb6ad	cus_SBRVaLR3ZkENA4	2025-04-23 14:49:40.302	f	f	\N	\N	\N	\N
\.


--
-- Data for Name: verificationtokens; Type: TABLE DATA; Schema: public; Owner: field4u_owner
--

COPY public.verificationtokens (identifier, token, expires) FROM stdin;
ademeure29@gmail.com	F9yrl8YH0RNEXKk28SnXRvztO0XcRd-a	2025-04-15 19:38:08.086
ademeure29@gmail.com	BSKV009CrizLvAsjzrnAmhFPtWauiSoP	2025-04-15 19:38:10.777
verstraetea@proximus.be	ODwaOqIJ6YUC6oBF9AyTK3pdOYv7Fmeu	2025-04-16 10:15:11.213
ademeure29@gmail.com	432e8dd5716b43a90a38278cbe4d0f7487f775bd0853e29f5de3db0804286735	2025-04-21 19:18:58.248
ademeure29@gmail.com	1850301f2fbf34ea8a5bfd0742d6fd204a697585f7eaf45d96dfefb66a99dc13	2025-04-21 19:22:52.354
antoine@gmail.com	70c260d2714fc60d61eee778dc75416c23105866c1045d49c2bf29606530d314	2025-04-21 19:48:16.647
atoiness@gmail.com	185a5b514bbb74d417761ce174a6877494fca04664cdf73f6e40d7e60eef2ddb	2025-04-21 20:33:53.73
dddddddddddd@gmail.com	f42cff28b6efcccb8977e60c22cd85a4bede8e82710f8af84dee239237e24575	2025-04-21 20:34:04.572
dddddddddddd@gmail.com	6e8e51335eb088f655bf0dc839b84b2988c252f6541cb3c3d4754d38ffce6421	2025-04-21 20:34:29.706
fdsssssssssssss@gmail.com	4de8efb0408f8b4db21d0a5426a3c8a54fced9fc3e3342c8e591f28d385d5a73	2025-04-21 21:54:26.406
add@gmail.com	22b3903ff8a3f24266b27d35811e4f818390b7d0257c75aae4c14f602b82b9ce	2025-04-22 13:41:45.817
ezeez@gmail.com	eb558d02e447391f03895b74ebf1219972dc7a98f98e17d147299b83f8fdf6fa	2025-04-22 13:44:46.698
admin@glean.be	10e60b36ed093db12aa80936a8f9ac3137695e2697e1b00f7ccb4699951e51b1	2025-04-22 13:50:08.491
antoineddddd@gmail.com	9b8a039577d93abfaedaada057e7801ee2f738ba27b40c66e69cdc32933cc249	2025-04-22 15:25:20.587
lllllllllllllllll@gmail.com	e79cebe71cd11fdc72a1be7257cf7ebf3eb7b6fae127bf9b481325a15e483e65	2025-04-22 15:48:09.021
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: crop_types crop_types_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.crop_types
    ADD CONSTRAINT crop_types_pkey PRIMARY KEY (id);


--
-- Name: farms farms_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT farms_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: fields fields_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_pkey PRIMARY KEY (id);


--
-- Name: gleanings gleanings_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.gleanings
    ADD CONSTRAINT gleanings_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: participations participations_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- Name: announcements_field_id_crop_type_id_idx; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE INDEX announcements_field_id_crop_type_id_idx ON public.announcements USING btree (field_id, crop_type_id);


--
-- Name: announcements_slug_idx; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE INDEX announcements_slug_idx ON public.announcements USING btree (slug);


--
-- Name: announcements_slug_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX announcements_slug_key ON public.announcements USING btree (slug);


--
-- Name: crop_types_name_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX crop_types_name_key ON public.crop_types USING btree (name);


--
-- Name: farms_city_postal_code_idx; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE INDEX farms_city_postal_code_idx ON public.farms USING btree (city, postal_code);


--
-- Name: farms_slug_idx; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE INDEX farms_slug_idx ON public.farms USING btree (slug);


--
-- Name: farms_slug_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX farms_slug_key ON public.farms USING btree (slug);


--
-- Name: fields_latitude_longitude_idx; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE INDEX fields_latitude_longitude_idx ON public.fields USING btree (latitude, longitude);


--
-- Name: gleanings_announcement_id_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX gleanings_announcement_id_key ON public.gleanings USING btree (announcement_id);


--
-- Name: participations_user_id_gleaning_id_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX participations_user_id_gleaning_id_key ON public.participations USING btree (user_id, gleaning_id);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verificationtokens_identifier_token_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX verificationtokens_identifier_token_key ON public.verificationtokens USING btree (identifier, token);


--
-- Name: verificationtokens_token_key; Type: INDEX; Schema: public; Owner: field4u_owner
--

CREATE UNIQUE INDEX verificationtokens_token_key ON public.verificationtokens USING btree (token);


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_crop_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_crop_type_id_fkey FOREIGN KEY (crop_type_id) REFERENCES public.crop_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: announcements announcements_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: announcements announcements_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: farms farms_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT farms_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fields fields_farm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fields fields_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gleanings gleanings_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.gleanings
    ADD CONSTRAINT gleanings_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: likes likes_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: participations participations_gleaning_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_gleaning_id_fkey FOREIGN KEY (gleaning_id) REFERENCES public.gleanings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: participations participations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_gleaning_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_gleaning_id_fkey FOREIGN KEY (gleaning_id) REFERENCES public.gleanings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: statistics statistics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: field4u_owner
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: field4u_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

