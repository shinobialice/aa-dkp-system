--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Homebrew)
-- Dumped by pg_dump version 17.0

-- Started on 2025-05-07 19:33:38 EEST

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
system % ;2Cpsql postgresql://postgres:pppp1111@localhost:5432/DKP < blyat.sql
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 238 (class 1259 OID 16881)
-- Name: Expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expense" (
    id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    amount integer NOT NULL,
    target text NOT NULL,
    source text NOT NULL,
    comment text
);


ALTER TABLE public."Expense" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16880)
-- Name: Expense_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Expense_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Expense_id_seq" OWNER TO postgres;

--
-- TOC entry 4007 (class 0 OID 0)
-- Dependencies: 237
-- Name: Expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Expense_id_seq" OWNED BY public."Expense".id;


--
-- TOC entry 240 (class 1259 OID 16893)
-- Name: GuildFunds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GuildFunds" (
    id integer NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    "totalIncome" integer NOT NULL,
    "totalExpenses" integer NOT NULL,
    profit integer NOT NULL,
    "salaryBudget" integer NOT NULL,
    "treasuryLeft" integer NOT NULL
);


ALTER TABLE public."GuildFunds" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16892)
-- Name: GuildFunds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GuildFunds_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GuildFunds_id_seq" OWNER TO postgres;

--
-- TOC entry 4008 (class 0 OID 0)
-- Dependencies: 239
-- Name: GuildFunds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GuildFunds_id_seq" OWNED BY public."GuildFunds".id;


--
-- TOC entry 248 (class 1259 OID 17006)
-- Name: News; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."News" (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."News" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17005)
-- Name: News_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."News_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."News_id_seq" OWNER TO postgres;

--
-- TOC entry 4009 (class 0 OID 0)
-- Dependencies: 247
-- Name: News_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."News_id_seq" OWNED BY public."News".id;


--
-- TOC entry 242 (class 1259 OID 16900)
-- Name: Salary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Salary" (
    id integer NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    "userId" integer NOT NULL,
    amount integer NOT NULL,
    bonus integer,
    total integer NOT NULL
);


ALTER TABLE public."Salary" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16899)
-- Name: Salary_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Salary_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Salary_id_seq" OWNER TO postgres;

--
-- TOC entry 4010 (class 0 OID 0)
-- Dependencies: 241
-- Name: Salary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Salary_id_seq" OWNED BY public."Salary".id;


--
-- TOC entry 228 (class 1259 OID 16772)
-- Name: boss; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boss (
    id integer NOT NULL,
    boss_name text NOT NULL,
    dkp_points integer NOT NULL,
    category text
);


ALTER TABLE public.boss OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16771)
-- Name: boss_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.boss_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boss_id_seq OWNER TO postgres;

--
-- TOC entry 4011 (class 0 OID 0)
-- Dependencies: 227
-- Name: boss_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.boss_id_seq OWNED BY public.boss.id;


--
-- TOC entry 236 (class 1259 OID 16858)
-- Name: givenawayloot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.givenawayloot (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    date date NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    status text
);


ALTER TABLE public.givenawayloot OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16857)
-- Name: givenawayloot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.givenawayloot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.givenawayloot_id_seq OWNER TO postgres;

--
-- TOC entry 4012 (class 0 OID 0)
-- Dependencies: 235
-- Name: givenawayloot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.givenawayloot_id_seq OWNED BY public.givenawayloot.id;


--
-- TOC entry 232 (class 1259 OID 16803)
-- Name: item_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_type (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price double precision
);


ALTER TABLE public.item_type OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16802)
-- Name: item_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_type_id_seq OWNER TO postgres;

--
-- TOC entry 4013 (class 0 OID 0)
-- Dependencies: 231
-- Name: item_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_type_id_seq OWNED BY public.item_type.id;


--
-- TOC entry 246 (class 1259 OID 16947)
-- Name: link_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.link_token (
    id integer NOT NULL,
    token character varying NOT NULL,
    "userId" integer NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.link_token OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16946)
-- Name: link_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.link_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.link_token_id_seq OWNER TO postgres;

--
-- TOC entry 4014 (class 0 OID 0)
-- Dependencies: 245
-- Name: link_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.link_token_id_seq OWNED BY public.link_token.id;


--
-- TOC entry 219 (class 1259 OID 16623)
-- Name: loot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loot (
    id integer NOT NULL,
    status text,
    sold_at timestamp(3) without time zone,
    sold_to text,
    comment text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    source character varying(255),
    acquired_at timestamp without time zone,
    item_type_id integer NOT NULL,
    sold_to_user_id integer,
    quantity integer DEFAULT 1 NOT NULL,
    price integer,
    group_id integer
);


ALTER TABLE public.loot OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16800)
-- Name: loot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.loot ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.loot_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 16824)
-- Name: loot_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loot_queue (
    id integer NOT NULL,
    item_type_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    status text DEFAULT 'ожидание'::text,
    synth_target text,
    remaining integer,
    required integer DEFAULT 1 NOT NULL,
    delivered integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.loot_queue OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16823)
-- Name: loot_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loot_queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loot_queue_id_seq OWNER TO postgres;

--
-- TOC entry 4015 (class 0 OID 0)
-- Dependencies: 233
-- Name: loot_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loot_queue_id_seq OWNED BY public.loot_queue.id;


--
-- TOC entry 217 (class 1259 OID 16611)
-- Name: raid; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raid (
    id integer NOT NULL,
    type text,
    start_date timestamp(3) without time zone,
    created_at timestamp(3) without time zone NOT NULL,
    is_pvp boolean DEFAULT false,
    is_pvp_long boolean DEFAULT false,
    dkp_summary integer DEFAULT 0
);


ALTER TABLE public.raid OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16618)
-- Name: raid_attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raid_attendance (
    id integer NOT NULL,
    user_id integer NOT NULL,
    raid_id integer NOT NULL,
    created_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.raid_attendance OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16748)
-- Name: raid_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.raid_attendance ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.raid_attendance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 16783)
-- Name: raid_boss; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raid_boss (
    raid_id integer NOT NULL,
    boss_id integer NOT NULL
);


ALTER TABLE public.raid_boss OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16753)
-- Name: raid_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.raid ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.raid_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16637)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16604)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer DEFAULT nextval('public.tasks_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    name text,
    completed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16630)
-- Name: tasks_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks_user (
    tasks_user_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.tasks_user OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16590)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username text NOT NULL,
    class text,
    secondary_class text,
    class_gear_score integer,
    secondary_class_gear_score integer,
    vk_name text,
    active boolean NOT NULL,
    is_eligible_for_salary boolean NOT NULL,
    joined_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone NOT NULL,
    "salaryBonus" integer DEFAULT 0,
    google_id character varying,
    vk_id character varying
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16597)
-- Name: user_inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_inventory (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text,
    name text,
    quality text,
    created_at timestamp(3) without time zone NOT NULL,
    quantity integer DEFAULT 1
);


ALTER TABLE public.user_inventory OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16686)
-- Name: user_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_inventory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_inventory_id_seq OWNER TO postgres;

--
-- TOC entry 4016 (class 0 OID 0)
-- Dependencies: 224
-- Name: user_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_inventory_id_seq OWNED BY public.user_inventory.id;


--
-- TOC entry 244 (class 1259 OID 16914)
-- Name: user_salary_bonus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_salary_bonus (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    reason text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_salary_bonus OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16913)
-- Name: user_salary_bonus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_salary_bonus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_salary_bonus_id_seq OWNER TO postgres;

--
-- TOC entry 4017 (class 0 OID 0)
-- Dependencies: 243
-- Name: user_salary_bonus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_salary_bonus_id_seq OWNED BY public.user_salary_bonus.id;


--
-- TOC entry 222 (class 1259 OID 16640)
-- Name: user_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tags (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tag text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_tags OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16655)
-- Name: user_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_tags ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3750 (class 2604 OID 16884)
-- Name: Expense id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense" ALTER COLUMN id SET DEFAULT nextval('public."Expense_id_seq"'::regclass);


--
-- TOC entry 3751 (class 2604 OID 16896)
-- Name: GuildFunds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuildFunds" ALTER COLUMN id SET DEFAULT nextval('public."GuildFunds_id_seq"'::regclass);


--
-- TOC entry 3757 (class 2604 OID 17009)
-- Name: News id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News" ALTER COLUMN id SET DEFAULT nextval('public."News_id_seq"'::regclass);


--
-- TOC entry 3752 (class 2604 OID 16903)
-- Name: Salary id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salary" ALTER COLUMN id SET DEFAULT nextval('public."Salary_id_seq"'::regclass);


--
-- TOC entry 3741 (class 2604 OID 16775)
-- Name: boss id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss ALTER COLUMN id SET DEFAULT nextval('public.boss_id_seq'::regclass);


--
-- TOC entry 3748 (class 2604 OID 16861)
-- Name: givenawayloot id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.givenawayloot ALTER COLUMN id SET DEFAULT nextval('public.givenawayloot_id_seq'::regclass);


--
-- TOC entry 3742 (class 2604 OID 16806)
-- Name: item_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_type ALTER COLUMN id SET DEFAULT nextval('public.item_type_id_seq'::regclass);


--
-- TOC entry 3755 (class 2604 OID 16950)
-- Name: link_token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_token ALTER COLUMN id SET DEFAULT nextval('public.link_token_id_seq'::regclass);


--
-- TOC entry 3743 (class 2604 OID 16827)
-- Name: loot_queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loot_queue ALTER COLUMN id SET DEFAULT nextval('public.loot_queue_id_seq'::regclass);


--
-- TOC entry 3732 (class 2604 OID 16745)
-- Name: user_inventory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_inventory ALTER COLUMN id SET DEFAULT nextval('public.user_inventory_id_seq'::regclass);


--
-- TOC entry 3753 (class 2604 OID 16917)
-- Name: user_salary_bonus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_salary_bonus ALTER COLUMN id SET DEFAULT nextval('public.user_salary_bonus_id_seq'::regclass);


--
-- TOC entry 3991 (class 0 OID 16881)
-- Dependencies: 238
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Expense" (id, date, amount, target, source, comment) FROM stdin;
1	2025-05-04 00:00:00	12000	Коллекция Боевых	Прыгайкиска	
2	2025-05-05 00:00:00	21000	тест	какашка	пуп
3	2025-05-05 00:00:00	25000	на покушать	Прыгайкиска	
\.


--
-- TOC entry 3993 (class 0 OID 16893)
-- Dependencies: 240
-- Data for Name: GuildFunds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GuildFunds" (id, year, month, "totalIncome", "totalExpenses", profit, "salaryBudget", "treasuryLeft") FROM stdin;
57	2025	6	0	0	0	0	0
58	2025	5	91000	58000	33000	23100	9900
37	2025	4	0	0	0	0	0
\.


--
-- TOC entry 4001 (class 0 OID 17006)
-- Dependencies: 248
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."News" (id, title, content, date, "createdAt", "updatedAt") FROM stdin;
1	пук	кака	2025-05-07 09:53:24.234	2025-05-07 09:53:24.234	2025-05-07 09:53:24.234
2	adasd	asdasd	2025-05-07 09:55:43.766	2025-05-07 09:55:43.766	2025-05-07 09:55:43.766
3	asdasd	asdasd	2025-05-07 09:56:38.084	2025-05-07 09:56:38.084	2025-05-07 09:56:38.084
\.


--
-- TOC entry 3995 (class 0 OID 16900)
-- Dependencies: 242
-- Data for Name: Salary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Salary" (id, year, month, "userId", amount, bonus, total) FROM stdin;
2230	2025	5	5	4456	0	4456
2231	2025	5	6	4456	0	4456
2232	2025	5	7	4456	0	4456
2233	2025	5	8	4456	0	4456
2234	2025	5	9	4456	0	4456
2235	2025	5	10	4456	0	4456
2236	2025	5	11	4456	0	4456
2237	2025	5	12	4456	0	4456
2238	2025	5	13	4456	0	4456
2239	2025	5	15	4456	0	4456
2240	2025	5	16	4456	0	4456
2241	2025	5	17	4456	0	4456
2242	2025	5	18	4456	0	4456
2243	2025	5	22	4456	0	4456
2244	2025	5	26	4456	0	4456
2245	2025	5	27	4456	0	4456
2246	2025	5	28	4456	0	4456
2247	2025	5	29	4456	0	4456
2248	2025	5	30	4456	0	4456
2249	2025	5	31	4456	0	4456
2250	2025	5	32	4456	0	4456
2251	2025	5	33	4456	0	4456
2252	2025	5	36	4456	0	4456
2253	2025	5	37	4456	0	4456
2254	2025	5	38	4456	0	4456
2255	2025	5	39	4456	0	4456
2256	2025	5	40	4456	0	4456
2257	2025	5	42	4456	0	4456
2258	2025	5	45	4456	0	4456
2259	2025	5	46	4456	0	4456
2260	2025	5	47	4456	0	4456
2261	2025	5	48	4456	0	4456
2262	2025	5	49	4456	0	4456
2263	2025	5	50	4456	0	4456
2264	2025	5	51	4456	0	4456
2265	2025	5	52	4456	0	4456
2266	2025	5	53	4456	0	4456
2267	2025	5	54	4456	0	4456
2268	2025	5	55	4456	0	4456
2269	2025	5	56	4456	0	4456
2270	2025	5	57	4456	0	4456
2271	2025	5	58	4456	0	4456
2272	2025	5	59	4456	0	4456
2273	2025	5	60	4456	0	4456
2274	2025	5	61	4456	0	4456
2275	2025	5	62	4456	0	4456
2276	2025	5	63	4456	0	4456
2277	2025	5	64	4456	0	4456
2278	2025	5	65	4456	0	4456
2279	2025	5	4	4456	0	4456
2280	2025	5	3	4456	0	4456
2281	2025	5	23	4456	0	4456
2282	2025	5	21	4456	0	4456
2283	2025	5	25	4456	0	4456
2284	2025	5	44	4456	0	4456
2285	2025	5	41	4456	0	4456
2286	2025	5	43	4456	0	4456
2287	2025	5	1	4456	0	4456
2288	2025	5	24	4456	0	4456
2289	2025	5	2	4456	0	4456
\.


--
-- TOC entry 3981 (class 0 OID 16772)
-- Dependencies: 228
-- Data for Name: boss; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.boss (id, boss_name, dkp_points, category) FROM stdin;
1	Кракен	7	Прайм
2	Ксанатос	7	Прайм
3	Калидис	7	Прайм
4	Левиафан	7	Прайм
5	Дельфиец	2	Прайм
6	Осада	3	Прайм
7	Анталлон	5	Прайм
8	Калеиль	3	Прайм
9	Корвус	3	Прайм
12	Марли	0	АГЛ
18	Гленн и Лорея	0	АГЛ
13	Марли Прок	1	АГЛ
14	Кошка	1	АГЛ
15	Ашьяра Прок	1	АГЛ
16	Ашьяра	0	АГЛ
17	Гленн и Лорея Прок	1	АГЛ
11	Морф	1	АГЛ
\.


--
-- TOC entry 3989 (class 0 OID 16858)
-- Dependencies: 236
-- Data for Name: givenawayloot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.givenawayloot (id, user_id, name, date, comment, created_at, status) FROM stdin;
1	43	Глайдер охотника на драконов	2025-05-04		2025-05-04 23:14:14.435793	Выдано
3	5	Фрегат	2025-05-04		2025-05-05 00:08:25.869933	Выдано
4	5	Глайдер охотника на драконов	2025-05-04		2025-05-05 00:11:18.27017	Выдано
5	6	Фрегат	2025-05-04		2025-05-05 00:12:40.120635	Выдано
6	6	Глайдер охотника на драконов	2025-05-04		2025-05-05 00:13:32.529364	Выдано
7	11	Анд'хакар, Чернильная тьма	2025-05-04		2025-05-05 01:02:26.942406	В наличии
8	11	Ро'кана, Безумие морей	2025-05-05		2025-05-05 01:02:37.890546	Выдано
9	5	Ро'кана, Безумие морей	2025-05-05		2025-05-05 05:46:39.802	В наличии
\.


--
-- TOC entry 3985 (class 0 OID 16803)
-- Dependencies: 232
-- Data for Name: item_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_type (id, name, price) FROM stdin;
16	Капюшон иферийского советника	10500
17	Мантия иферийского советника	10500
18	Перчатки иферийского советника	10500
19	Поножи иферийского советника	10500
20	Сапоги иферийского советника	10500
21	Средоточие безумия	\N
22	Фрагмент чешуи Ашьяры	\N
23	Ташш, змеиное жало	7000
24	Нирах, искушающий	7000
25	Ишхар, грань измерений	28000
26	Гирра, пробивающий брешь	28000
27	Джераб, слуга смерти	15000
28	Нерхал, бронзовая чешуя	28000
29	Шлем любимца Изы	31500
30	Доспех любимца Изы	31500
31	Перчатки любимца Изы	31500
32	Поножи любимца Изы	31500
33	Сапоги любимца Изы	31500
34	Плащ проклятой души	35000
35	Средоточие ярости	\N
36	Клык Калидиса	7000
37	Лоскут кожи Калидиса	3500
38	Аст'аджал, Длань судьбы	\N
39	Анд'хакар, Чернильная тьма	28000
40	Ро'кана, Безумие морей	35000
41	Глайдер охотника на драконов	35000
42	Эссенция ужаса	210
43	Дра'кордис, Сердце дракона	49000
44	Рави’мар, Драконья ярость	11500
45	Мор’гур, Смерть драконов	49000
46	Вул’данор, Клеймитель драконов	49000
47	Дра'орис, Дыхание дракона	49000
48	Иг'нис, Пламя возмездия	49000
51	Генетический материал дракона	56000
52	Эссенция гнева	210
53	Средоточие сумрака	\N
54	Шлем властелина морей	7400
55	Бригантина властелина морей	7400
56	Перчатки властелина морей	7400
57	Поножи властелина морей	7400
58	Сапоги властелина морей	7400
59	Эссенция кошмара	350
60	Средоточие морей	35000
61	Глаз Левиафана	700
62	Каменное сердце Морфеоса	3500
64	Трофейная эссенция стихий	500
65	Свиток пробудившихся мифов	35000
66	Свиток пробуждения драконоборца	4000
67	Акхиумная сфера	3225
68	Акхиумный раствор	1.68
69	Эссенция звездного акхиума	28
70	Кристалл властелина морей	2500
14	Глайдер «Крылья небесного стража»	90000
50	Глайдер «Рассекатель небес»	35000
49	Драго’ран, Гнев Гартарейн	50000
15	Аметистовая гравировка северной звезды	21000
63	Эссенция ярости	0.23
\.


--
-- TOC entry 3999 (class 0 OID 16947)
-- Dependencies: 246
-- Data for Name: link_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.link_token (id, token, "userId", "expiresAt", used) FROM stdin;
41	83b11e09-8ed0-470f-af6f-42b05d9baf5b	1	2025-05-07 06:22:55.452	t
42	dadf3f70-f32d-407c-865d-3a0a24488c10	56	2025-05-07 06:23:18.604	t
43	8520a868-fd22-479f-aab7-0e6b394f23c4	15	2025-05-08 14:34:31.908	t
\.


--
-- TOC entry 3972 (class 0 OID 16623)
-- Dependencies: 219
-- Data for Name: loot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loot (id, status, sold_at, sold_to, comment, created_at, source, acquired_at, item_type_id, sold_to_user_id, quantity, price, group_id) FROM stdin;
3	В наличии	\N	\N	\N	2025-05-05 19:41:05.262	Ксанатос	2025-05-05 00:00:00	65	\N	9	\N	3
9	В наличии	\N	\N	\N	2025-05-06 01:42:18.785	Калидис	2025-05-06 00:00:00	36	\N	12	\N	\N
10	Продано	2025-05-06 02:17:59.403	Reykow		2025-05-06 02:17:59.404	Калидис	2025-05-05 00:00:00	36	11	8	91000	\N
8	В наличии	\N	\N	\N	2025-05-05 21:04:30.672		2025-05-05 00:00:00	36	\N	2	\N	8
11	Продано	2025-05-06 02:17:59.415	Reykow		2025-05-06 02:17:59.416		2025-05-05 00:00:00	36	11	5	91000	\N
12	В наличии	\N	\N	\N	2025-05-07 15:59:48.547	АГЛ	2025-05-07 00:00:00	63	\N	1	\N	\N
\.


--
-- TOC entry 3987 (class 0 OID 16824)
-- Dependencies: 234
-- Data for Name: loot_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loot_queue (id, item_type_id, user_id, created_at, status, synth_target, remaining, required, delivered) FROM stdin;
2	19	7	2025-05-04 13:41:10.159	ожидание	\N	10500	1	0
28	63	22	2025-05-04 18:05:11.718	ожидание		\N	1	0
30	16	26	2025-05-04 18:05:28.49	ожидание		\N	1	0
33	18	29	2025-05-05 02:34:31.235	ожидание		\N	1	0
34	63	6	2025-05-05 02:34:37.764	ожидание		\N	1	0
35	64	2	2025-05-06 20:50:12.594	ожидание		\N	1	0
36	64	1	2025-05-06 20:50:14.528	ожидание		\N	1	0
\.


--
-- TOC entry 3970 (class 0 OID 16611)
-- Dependencies: 217
-- Data for Name: raid; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raid (id, type, start_date, created_at, is_pvp, is_pvp_long, dkp_summary) FROM stdin;
19	Прайм	2025-04-16 01:36:04	2025-05-02 01:36:23.235	t	f	8
20	АГЛ	2025-04-16 01:37:07	2025-05-02 01:37:27.191	t	f	2
21	Прайм	2025-05-14 01:37:29	2025-05-02 01:37:51.099	f	f	2
22	АГЛ	2025-04-15 01:38:08	2025-05-02 01:38:24.754	f	t	3
25	Прайм	2025-03-05 00:00:00	2025-05-02 04:58:46.491	f	t	3
26	АГЛ	2025-03-12 00:00:00	2025-05-02 04:58:46.491	t	f	2
27	Прайм	2025-03-18 00:00:00	2025-05-02 04:59:20.134	f	f	1
28	АГЛ	2025-03-28 00:00:00	2025-05-02 04:59:20.134	f	f	4
29	Прайм	2025-04-01 00:00:00	2025-05-02 04:59:20.134	t	t	2
30	АГЛ	2025-04-09 00:00:00	2025-05-02 04:59:20.134	f	t	3
31	Прайм	2025-04-15 00:00:00	2025-05-02 04:59:20.134	t	f	4
32	АГЛ	2025-04-19 00:00:00	2025-05-02 04:59:20.134	f	f	1
33	Прайм	2025-04-22 00:00:00	2025-05-02 04:59:20.134	f	f	3
34	АГЛ	2025-04-28 00:00:00	2025-05-02 04:59:20.134	t	t	2
35	Прайм	2025-10-23 03:12:16	2025-05-02 03:12:32.831	f	f	7
36	АГЛ	2025-05-08 14:02:33	2025-05-07 14:02:45.338	t	f	1
37	Прайм	2025-05-06 14:14:55	2025-05-07 14:15:24.337	t	f	8
38	АГЛ	2025-05-02 14:19:27	2025-05-07 14:19:46.304	f	t	4
39	Прайм	2025-05-05 14:19:53	2025-05-07 14:20:03.708	t	f	8
40	Прайм	2025-05-06 14:20:30	2025-05-07 14:20:41.635	f	f	7
\.


--
-- TOC entry 3971 (class 0 OID 16618)
-- Dependencies: 218
-- Data for Name: raid_attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raid_attendance (id, user_id, raid_id, created_at) FROM stdin;
160	7	19	2025-05-02 01:36:23.235
161	11	19	2025-05-02 01:36:23.235
162	14	19	2025-05-02 01:36:23.235
163	16	19	2025-05-02 01:36:23.235
164	18	19	2025-05-02 01:36:23.235
165	27	19	2025-05-02 01:36:23.235
166	1	20	2025-05-02 01:37:27.191
167	2	20	2025-05-02 01:37:27.191
168	64	21	2025-05-02 01:37:51.099
169	1	21	2025-05-02 01:37:51.099
170	1	22	2025-05-02 01:38:24.754
171	1	25	2025-05-02 04:58:46.491
172	2	26	2025-05-02 04:58:46.491
173	1	27	2025-05-02 04:59:20.134
174	2	28	2025-05-02 04:59:20.134
175	1	29	2025-05-02 04:59:20.134
176	2	30	2025-05-02 04:59:20.134
177	1	31	2025-05-02 04:59:20.134
178	2	32	2025-05-02 04:59:20.134
179	1	33	2025-05-02 04:59:20.134
180	2	34	2025-05-02 04:59:20.134
181	1	35	2025-05-02 03:12:32.831
182	1	36	2025-05-07 14:02:45.339
183	1	37	2025-05-07 14:15:24.338
184	1	38	2025-05-07 14:19:46.304
185	8	39	2025-05-07 14:20:03.708
186	1	40	2025-05-07 14:20:41.635
\.


--
-- TOC entry 3982 (class 0 OID 16783)
-- Dependencies: 229
-- Data for Name: raid_boss; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raid_boss (raid_id, boss_id) FROM stdin;
19	3
20	11
20	12
21	5
22	18
25	1
25	2
25	5
26	11
26	13
27	3
27	8
27	9
28	16
28	17
29	6
29	7
30	12
30	15
31	4
31	1
31	2
32	14
32	18
33	5
33	6
33	7
34	11
34	13
34	17
35	2
36	16
37	2
38	14
39	1
40	3
\.


--
-- TOC entry 3969 (class 0 OID 16604)
-- Dependencies: 216
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, user_id, name, completed_at, created_at) FROM stdin;
1	1	Не скамить	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
2	1	ККЛ	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
3	1	Поспать	\N	2025-04-28 21:04:11.465
4	1	Дизбанд №3	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
9	3	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
10	3	Рб Шмот	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
11	3	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
12	4	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
13	4	Спек Тактика	\N	2025-04-28 21:04:11.465
14	4	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
15	5	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
16	6	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
17	8	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
18	9	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
19	10	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
20	10	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
21	10	Скачать доту	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
22	10	Удалить доту	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
23	12	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
24	13	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
25	14	ККЛ	\N	2025-04-28 21:04:11.465
26	14	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
27	15	ККЛ	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
28	15	Глайдер "Рассекатель небес"	\N	2025-04-28 21:04:11.465
29	15	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
30	16	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
31	17	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
32	20	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
33	20	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
34	20	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
35	20	Второй спек	\N	2025-04-28 21:04:11.465
36	21	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
37	22	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
38	22	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
39	22	ККЛ	\N	2025-04-28 21:04:11.465
40	22	Глайдер "Рассекатель небес"	\N	2025-04-28 21:04:11.465
41	23	Рб Пушка	\N	2025-04-28 21:04:11.465
42	23	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
43	23	Т2 Коллекция глайдеров	\N	2025-04-28 21:04:11.465
44	24	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
45	24	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
46	25	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
47	26	Спек тактика	\N	2025-04-28 21:04:11.465
48	26	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
49	27	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
50	28	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
51	29	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
52	29	Спек барда	\N	2025-04-28 21:04:11.465
53	29	Т2 Коллекция глайдеров	\N	2025-04-28 21:04:11.465
54	31	ККЛ	\N	2025-04-28 21:04:11.465
55	35	Спек Стража	\N	2025-04-28 21:04:11.465
56	35	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
57	36	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
58	36	ККЛ	\N	2025-04-28 21:04:11.465
59	36	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
60	39	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
61	39	Булава с Ксанатоса	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
62	39	Щит с Кснатоса/Эфен	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
63	39	Фрига	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
64	40	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
65	40	ККЛ	\N	2025-04-28 21:04:11.465
66	40	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
67	40	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
68	41	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
69	42	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
70	42	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
71	42	Щит с Ксанатоса	\N	2025-04-28 21:04:11.465
72	42	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
73	43	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
74	43	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
75	43	ККЛ	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
76	43	Булава с Ксанатоса	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
77	44	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
78	44	Фрига	\N	2025-04-28 21:04:11.465
79	44	Эфен Щит	\N	2025-04-28 21:04:11.465
80	44	Булава с Ксанатоса	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
81	45	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
82	45	ККЛ	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
83	45	Щит с Ксанатоса	\N	2025-04-28 21:04:11.465
84	45	Найти богатого мужика для Ги	\N	2025-04-28 21:04:11.465
85	46	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
86	46	Т2 Коллекция глайдеров	\N	2025-04-28 21:04:11.465
87	47	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
88	47	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
89	47	ККЛ	\N	2025-04-28 21:04:11.465
90	48	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
91	49	Т2 Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
5	2	Коллекция боевых питомцев	2025-04-28 21:04:11.464	2025-04-28 21:04:11.464
6	2	Глайдер "Рассекатель небесс"	\N	2025-04-28 21:04:11.464
7	2	Рб Пушка срочно	2025-04-28 21:04:11.464	2025-04-28 21:04:11.464
92	49	Т2 Коллекция глайдеров	\N	2025-04-28 21:04:11.465
93	50	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
94	50	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
95	51	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
96	52	Спек танцора	\N	2025-04-28 21:04:11.465
97	52	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
98	53	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
99	53	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
100	54	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
101	54	Глайдер "Рассекатель небес"	\N	2025-04-28 21:04:11.465
102	54	Эфен Щит/Щит с Ксанатоса	\N	2025-04-28 21:04:11.465
103	54	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
104	55	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
105	56	Щит с Ксанатоса	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
106	56	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
107	57	Булава с Ксанатоса	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
108	57	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
109	57	Эфен Бижа	\N	2025-04-28 21:04:11.465
110	58	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
111	58	ККЛ	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
112	58	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
113	58	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
114	59	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
115	60	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
116	61	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
117	62	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
118	63	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
119	64	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
120	65	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
121	65	Т2 Коллекция глайдеров	\N	2025-04-28 21:04:11.465
122	65	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
123	67	ККЛ	\N	2025-04-28 21:04:11.465
124	67	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
129	72	ККЛ	\N	2025-04-28 21:04:11.465
130	78	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
131	80	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
132	81	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
133	82	ККЛ	\N	2025-04-28 21:04:11.465
134	82	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
135	83	Рб Пушка	\N	2025-04-28 21:04:11.465
136	83	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
137	83	Глайдер "Рассекатель небес"	\N	2025-04-28 21:04:11.465
138	84	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
139	85	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
140	85	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
141	95	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
142	95	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
143	95	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
144	95	ККЛ	\N	2025-04-28 21:04:11.465
145	96	Фрига	\N	2025-04-28 21:04:11.465
146	97	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
147	97	Фрига	\N	2025-04-28 21:04:11.465
148	98	Коллекция глайдеров	\N	2025-04-28 21:04:11.465
149	98	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
150	98	Эфен пушка	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
151	98	ККЛ	\N	2025-04-28 21:04:11.465
152	99	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
153	99	Спек Тактика	\N	2025-04-28 21:04:11.465
154	100	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
155	101	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
156	101	РБ Пушка	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
157	101	Глайдер "Рассекатель небес"	\N	2025-04-28 21:04:11.465
158	102	Коллекция глайдеров	\N	2025-04-28 21:04:11.465
159	107	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
160	108	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
161	111	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
162	114	Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
163	114	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
164	115	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
165	115	Булава с Ксанатоса	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
166	115	Щит с Ксанатоса	\N	2025-04-28 21:04:11.465
167	116	Коллекция глайдеров	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
168	116	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
169	116	ККЛ	\N	2025-04-28 21:04:11.465
170	116	Булава с Ксанатоса	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
171	117	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
172	117	Щит с Ксанатоса	\N	2025-04-28 21:04:11.465
173	118	ККЛ	\N	2025-04-28 21:04:11.465
174	118	Глайдер "Рассекатель небес"	\N	2025-04-28 21:04:11.465
175	118	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
176	120	Глайдер "Рассекатель небес"	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
177	120	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
178	122	ККЛ	\N	2025-04-28 21:04:11.465
179	122	Коллекция боевых питомцев	2025-04-28 21:04:11.465	2025-04-28 21:04:11.465
180	122	Коллекция глайдеров	\N	2025-04-28 21:04:11.465
181	122	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
182	126	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
183	136	ККЛ	\N	2025-04-28 21:04:11.465
184	136	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
185	138	Т2 Коллекция боевых питомцев	\N	2025-04-28 21:04:11.465
186	139	ККЛ	\N	2025-04-28 21:04:11.465
187	139	Булава с Ксанатоса	\N	2025-04-28 21:04:11.465
215	44	ger	\N	2025-04-29 23:41:10.762
216	44	asdasd	\N	2025-04-29 23:42:53.391
217	44	zxcc	\N	2025-04-29 23:42:55.301
218	2	пукпук	\N	2025-04-30 12:33:33.035
\.


--
-- TOC entry 3973 (class 0 OID 16630)
-- Dependencies: 220
-- Data for Name: tasks_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks_user (tasks_user_id, user_id) FROM stdin;
\.


--
-- TOC entry 3967 (class 0 OID 16590)
-- Dependencies: 214
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, class, secondary_class, class_gear_score, secondary_class_gear_score, vk_name, active, is_eligible_for_salary, joined_at, created_at, "salaryBonus", google_id, vk_id) FROM stdin;
6	Кияяяяяяя	Бард	\N	19306	\N	\N	t	t	2023-07-12 00:00:00	2025-04-26 19:31:44	0	\N	\N
134	Sxddsxadsda	Хил	\N	19169	\N	Ксюша Флегонтова	f	t	2024-07-26 00:00:00	2025-04-26 19:31:44	0	\N	\N
135	Totheright	Хил	\N	1899	\N	Валерия Царюк	f	t	2024-11-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
136	Swiftfox 	Хил	Тактик	19392	180	Анна Носова	f	t	2025-02-17 00:00:00	2025-04-26 19:31:44	0	\N	\N
137	Kitfox	Хил	\N	19994	\N	Александр Орлов	f	t	2025-02-17 00:00:00	2025-04-26 19:31:44	0	\N	\N
138	Палкаисцелялка 	Хил	\N	19794	\N	Ирина Гурьева	f	t	2025-02-20 00:00:00	2025-04-26 19:31:44	0	\N	\N
139	Палкахилялка 	Хил	\N	2037	\N	Лера Комарова	f	t	2025-02-20 00:00:00	2025-04-26 19:31:44	0	\N	\N
140	Arania	Хил	\N	18697	\N	Ирина Ярославская	f	t	2025-03-02 00:00:00	2025-04-26 19:31:44	0	\N	\N
2	Dimonishx	Тактик	Маг	18776	123123123	romanov.egor_835	t	t	2025-04-17 00:00:00	2025-04-26 19:31:44	0	\N	\N
1	Прыгайкиска	Хил	Милик	21259	\N	alicebut	t	t	2022-10-07 00:00:00	2025-04-26 19:31:44	0	111616906439099901042	\N
7	Куникулёр	Бард	\N	199	\N	Виктор Дублинский	t	t	2024-12-14 00:00:00	2025-04-26 19:31:44	0	\N	\N
8	Goruyshko 	Бард	\N	17661	\N	Oleg Kolesnik	t	t	2025-03-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
43	Annesh	Хил	\N	19919	\N	id508145467	t	t	2018-11-30 00:00:00	2025-04-26 19:31:44	0	\N	\N
10	Чхоль	Лук	\N	2075	\N	Иван Игонин	t	t	2023-05-25 00:00:00	2025-04-26 19:31:44	0	\N	\N
11	Reykow	Лук	Тактик	2113	15158	Рома Косарев	t	t	2023-06-30 00:00:00	2025-04-26 19:31:44	0	\N	\N
12	Хромиум	Лук	\N	22108	\N	Дмитрий Шмелев	t	t	2023-07-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
13	Трезво	Лук	\N	21487	\N	Валерий Филиппов	t	t	2024-02-18 00:00:00	2025-04-26 19:31:44	0	\N	\N
14	Flugegehaimen	Лук	\N	20891	\N	Дмитрий Метелица	t	f	2024-09-27 00:00:00	2025-04-26 19:31:44	0	\N	\N
16	Ленинь	Лук	\N	19287	\N	Иван Уколов	t	t	2024-11-04 00:00:00	2025-04-26 19:31:44	0	\N	\N
17	Таксебелук	Лук	\N	20067	\N	Андрей Исаев	t	t	2024-11-05 00:00:00	2025-04-26 19:31:44	0	\N	\N
19	Sergun	Лук	Танцор	20515	156	Сергей Смоленцев	t	f	2025-04-14 00:00:00	2025-04-26 19:31:44	0	\N	\N
20	Dumka 	Лук	\N	20925	\N	Дмитрий Кобзев	t	f	2025-04-26 00:00:00	2025-04-26 19:31:44	0	\N	\N
22	Бульониш	Маг	\N	19502	\N	Гриша Мелешенков	t	t	2023-11-22 00:00:00	2025-04-26 19:31:44	0	\N	\N
26	Nadsod	Милик	\N	19957	\N	Александр Маркин	t	t	2023-05-14 00:00:00	2025-04-26 19:31:44	0	\N	\N
27	Avarise	Милик	\N	20216	\N	Илья Томашевич	t	t	2023-11-05 00:00:00	2025-04-26 19:31:44	0	\N	\N
28	Инс	Милик	\N	192	\N	Антон Богатов	t	t	2023-12-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
29	Kaqp	Милик	\N	18688	\N	Максим Ерёмин	t	t	2024-11-23 00:00:00	2025-04-26 19:31:44	0	\N	\N
30	Pusya	Милик	\N	19606	\N	Александр Ионов	t	t	2025-01-18 00:00:00	2025-04-26 19:31:44	0	\N	\N
31	Damvey 	Милик	\N	1947	\N	Роман Ершов 	t	t	2025-03-08 00:00:00	2025-04-26 19:31:44	0	\N	\N
32	Wvvooow	Милик	Бард	18137	175	Александр Двинских	t	t	2025-03-08 00:00:00	2025-04-26 19:31:44	0	\N	\N
33	Panibrat 	Милик	Бард	183	175	Григорий Панибратец	t	t	2025-03-10 00:00:00	2025-04-26 19:31:44	0	\N	\N
34	Xaaaaaaa	Милик	Бард	19616	18126	Алексей Овчаренко	t	f	2025-04-22 00:00:00	2025-04-26 19:31:44	0	\N	\N
35	Gutallin	Тактик	\N	17906	\N	Кирилл Вяткин	t	f	2022-04-16 00:00:00	2025-04-26 19:31:44	0	\N	\N
36	Кладо	Тактик	Маг	1752	18558	Heal Tank	t	t	2023-09-22 00:00:00	2025-04-26 19:31:44	0	\N	\N
37	Пельмониш	Тактик	\N	175	\N	Oxinion Sinister	t	t	2023-11-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
38	Lekontant	Тактик	Танцор	21062	\N	Даниил Воронец	t	t	2025-02-16 00:00:00	2025-04-26 19:31:44	0	\N	\N
39	Wwooovv	Тактик	\N	17506	\N	Aibar Mukatai	t	t	2025-03-08 00:00:00	2025-04-26 19:31:44	0	\N	\N
42	Ricardothebest	Танцор	Маг	19027	17222	Рома Просто---Рома	t	t	2024-11-04 00:00:00	2025-04-26 19:31:44	0	\N	\N
45	Садюша	Хил	\N	21428	\N	Екатерина Ивановна	t	t	2022-08-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
46	Bellatricee	Хил	\N	201	\N	Anastasiya Akulenko	t	t	2022-08-18 00:00:00	2025-04-26 19:31:44	0	\N	\N
47	Kaktus	Хил	\N	20254	\N	Ирина Плотникова	t	t	2022-12-12 00:00:00	2025-04-26 19:31:44	0	\N	\N
48	Yd	Хил	\N	19536	\N	Katya Petrova	t	t	2023-01-29 00:00:00	2025-04-26 19:31:44	0	\N	\N
50	Ляяяяяяя	Хил	\N	19844	\N	Райан Йонои	t	t	2023-05-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
51	Мдяяяяяяя	Хил	Бард	20016	\N	Нюрка Котёнкина	t	t	2023-05-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
52	Мяяяяяяя	Хил	\N	20814	\N	Юлия Халаева	t	t	2023-05-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
53	Moonflare	Хил	Танцор	20132	20207	Евгений Бондарь	t	t	2023-05-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
54	Чхуня	Хил	\N	20477	\N	Df Kj	t	t	2023-06-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
55	Makemefeel	Хил	\N	20188	\N	Алиночка Воронина	t	t	2023-09-17 00:00:00	2025-04-26 19:31:44	0	\N	\N
57	Loraiine	Хил	\N	20026	\N	Lena Paymeeva	t	t	2023-10-25 00:00:00	2025-04-26 19:31:44	0	\N	\N
58	Alinia	Хил	\N	20105	\N	\N	t	t	2023-10-30 00:00:00	2025-04-26 19:31:44	0	\N	\N
59	Gst	Хил	\N	21103	\N	Алёна Балтаева	t	t	2023-12-07 00:00:00	2025-04-26 19:31:44	0	\N	\N
60	Felanza	Хил	\N	20539	\N	Ксения Ксения	t	t	2024-10-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
61	Inariokami	Хил	\N	20058	\N	Гульнара Жалялова	t	t	2024-11-04 00:00:00	2025-04-26 19:31:44	0	\N	\N
62	Арасака	Хил	\N	20352	\N	Urinoby Arasaka	t	t	2024-12-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
63	Таэръ	Хил	\N	20941	\N	Мила Милявская	t	t	2024-12-14 00:00:00	2025-04-26 19:31:44	0	\N	\N
64	Невидимаисвободна	Хил	\N	19209	\N	Оксана Швецова	t	t	2025-01-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
65	Wwooow	Хил	\N	20242	\N	Маргарита Белова	t	t	2025-03-08 00:00:00	2025-04-26 19:31:44	0	\N	\N
66	Alvilda 	Хил	\N	20696	\N	Галина .	t	f	2025-04-22 00:00:00	2025-04-26 19:31:44	0	\N	\N
67	Melanta 	Хил	\N	21328	\N	Melanta Fox	t	f	2025-04-22 00:00:00	2025-04-26 19:31:44	0	\N	\N
72	Luckyboo	Лук	\N	19451	\N	Артик Мацуткевич	f	t	2022-11-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
73	Какойтокрип	Лук	\N	19526	\N	Дмитрий Челиков	f	t	2023-07-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
4	Дутахе	Бард	Тактик	1738	1738	id508145467	t	t	2022-08-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
3	Guantanamo	Бард	Маг	17589	21048	Laska Nemovа	t	t	2025-04-05 00:00:00	2025-04-26 19:31:44	0	\N	\N
23	Dragons	Милик	Лук	19989	1232	Александр Какичев	t	t	2021-10-01 00:00:00	2025-04-26 19:31:44	0	\N	\N
21	Батюшка	Маг	Милик	19606	123123123	Никита Филиппов	t	t	2023-10-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
25	Sarinn	Милик		20182	0	\N	t	t	2025-04-08 00:00:00	2025-04-26 19:31:44	0	\N	\N
44	Атпутитеуменялапки	Хил	\N	21016	\N	Диана Мельникова	t	t	2021-07-18 00:00:00	2025-04-26 19:31:44	0	\N	\N
41	Кряяяяяяя	Танцор	Тактик	17512	\N	Даня Нилов	t	t	2023-05-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
56	Бобр	Хил	Тактик	21152	18705	Иван Завгороднев	t	t	2023-10-21 00:00:00	2025-04-26 19:31:44	0	106762078539708183440	\N
15	Банановыйкот	Лук	\N	21003	\N	Савелий Овчинников	t	t	2024-10-05 00:00:00	2025-04-26 19:31:44	0	112698106999373159125	\N
49	Вишнёваякиса	Хил	\N	219	\N	Yanina Melifareast	f	f	2023-05-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
40	Toffiiffee	Танцор	Хил	16000	20078	Нюта Спивак	t	t	2025-04-17 00:00:00	2025-04-26 19:31:44	0	\N	\N
9	Няяяяяяя	Лук	\N	21014	\N	Амир Урумбаев	t	t	2023-05-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
94	Nonsummortuus	Маг	\N	5000	\N	Tristis Fabula	f	f	2025-04-12 00:00:00	2025-04-26 19:31:44	0	\N	\N
24	Mn	Милик	\N	20441	\N	id508145467	t	t	2022-04-17 00:00:00	2025-04-26 19:31:44	0	\N	\N
5	Raivent	Бард	Тактик	1737	170	Юрий Макаров	t	t	2022-08-07 00:00:00	2025-04-26 19:31:44	0	\N	\N
18	Такамура	Лук	\N	20529	\N	Ярослав Хлебутин	t	t	2024-12-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
74	Хаски	Лук	\N	19774	\N	Хаски Хахаски	f	t	2024-04-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
75	Sqxdwuokj	Лук	\N	19607	\N	Никита Фабирже	f	t	2024-07-26 00:00:00	2025-04-26 19:31:44	0	\N	\N
76	Amylyubimmyod	Лук	\N	2018	\N	\N	f	t	2024-10-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
77	Профессорсквирта	Лук	\N	1913	\N	Cheza Tip	f	t	2024-10-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
78	Qtsq	Лук	\N	20543	\N	Никита Прокопенко	f	t	2024-11-15 00:00:00	2025-04-26 19:31:44	0	\N	\N
79	Totheleft	Лук	\N	18185	\N	Владимир Перегримов	f	f	2024-11-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
80	Offkoss	Лук	\N	19583	\N	Konstantin Sergiev	f	t	2025-01-07 00:00:00	2025-04-26 19:31:44	0	\N	\N
81	Страханет	Лук	Бард	20022	182	Александр Беляков	f	t	2025-01-27 00:00:00	2025-04-26 19:31:44	0	\N	\N
82	Палкаразрывалка 	Лук	\N	2111	\N	Сергей Барабохин	f	t	2025-02-20 00:00:00	2025-04-26 19:31:44	0	\N	\N
83	Norid	Маг	\N	16388	\N	Александр Будилин	f	t	2019-10-16 00:00:00	2025-04-26 19:31:44	0	\N	\N
84	Fntzer	Маг	\N	18938	\N	Royal Mukhtarov	f	t	2022-03-11 00:00:00	2025-04-26 19:31:44	0	\N	\N
85	Цемангуст	Маг	\N	180	\N	Виктор Сазонов	f	t	2022-08-07 00:00:00	2025-04-26 19:31:44	0	\N	\N
86	Чарующийкрип	Маг	Бард	18097	\N	Федор Ященко	f	t	2023-02-10 00:00:00	2025-04-26 19:31:44	0	\N	\N
87	Эчпочмаг	Маг	\N	18879	\N	Lisman Archeage	f	t	2023-05-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
88	Tnds	Маг	\N	180	\N	Владислав Пименов	f	t	2023-10-25 00:00:00	2025-04-26 19:31:44	0	\N	\N
89	Цемедок	Маг	\N	18604	\N	Влад Юраш	f	t	2023-10-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
90	Отчаянныйкрип	Маг	\N	180	\N	Евгений Фончиков	f	t	2023-12-01 00:00:00	2025-04-26 19:31:44	0	\N	\N
91	Eziooss	Маг	\N	18788	\N	Алексей Макаров	f	t	2024-01-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
92	Qsx	Маг	\N	19031	\N	Матвей Гудиев	f	t	2024-07-25 00:00:00	2025-04-26 19:31:44	0	\N	\N
93	Typchelovod	Маг	\N	18447	\N	Константин Червонцев	f	t	2024-10-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
95	Эльстан	Милик	\N	18302	\N	Роман Пеклов	f	t	2022-01-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
96	Khallddrogo	Милик	\N	18707	\N	Виталий Киллер	f	t	2022-06-02 00:00:00	2025-04-26 19:31:44	0	\N	\N
97	Sallvatrucha	Милик	\N	18155	\N	Михаил Юрьевич	f	t	2022-08-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
98	Meefis	Милик	Бард	17634	165	Mustafa Selimov	f	t	2022-08-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
99	Цежёсткиелапки	Милик	\N	18163	\N	Валентин Надвиничный	f	t	2022-08-10 00:00:00	2025-04-26 19:31:44	0	\N	\N
100	Qybee	Милик	\N	18471	\N	Vlad Qybee	f	t	2022-10-07 00:00:00	2025-04-26 19:31:44	0	\N	\N
101	Killjoy	Милик	\N	18754	\N	Вячеслав Косторев	f	t	2023-02-01 00:00:00	2025-04-26 19:31:44	0	\N	\N
102	Saveyounow	Милик	\N	18003	\N	Виталий Кирчак	f	t	2023-04-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
103	Gaanss	Милик	\N	19003	\N	Михаил Терентьев	f	t	2023-08-27 00:00:00	2025-04-26 19:31:44	0	\N	\N
104	Япесокинефертити	Милик	Бард	18473	17075	Алексей Соколов	f	t	2023-09-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
105	Wearedeeaplysorry	Милик	\N	\N	\N	\N	f	t	2023-10-05 00:00:00	2025-04-26 19:31:44	0	\N	\N
106	Snegr	Милик	\N	1855	\N	Се Рко	f	t	2024-04-03 00:00:00	2025-04-26 19:31:44	0	\N	\N
107	Kvjlns	Милик	Бард	18896	18795	Vikir Van Baskerville	f	t	2025-01-01 00:00:00	2025-04-26 19:31:44	0	\N	\N
108	Sechuronfox	Милик	\N	19147	\N	Вова Сумкин	f	t	2025-02-17 00:00:00	2025-04-26 19:31:44	0	\N	\N
109	Палкарешалка 	Милик	\N	19393	\N	\N	f	t	2025-02-20 00:00:00	2025-04-26 19:31:44	0	\N	\N
110	Matillda 	Тактик	\N	17596	\N	\N	f	t	2023-06-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
111	Tyriionlannister	Тактик	\N	130	\N	Nazgull Wer	f	f	2025-01-20 00:00:00	2025-04-26 19:31:44	0	\N	\N
112	Vitguard	Тактик	\N	17321	\N	Torttuga Best	f	t	2025-02-20 00:00:00	2025-04-26 19:31:44	0	\N	\N
113	Балдежныйкрип	Танцор	Хил	1774	19528	Никита Хмелев	f	t	2023-05-25 00:00:00	2025-04-26 19:31:44	0	\N	\N
114	Pandorkka	Хил	\N	18819	\N	Наташа Порох	f	t	2018-10-19 00:00:00	2025-04-26 19:31:44	0	\N	\N
115	Веривел	Хил	\N	20122	\N	Елизавета Матушкина	f	t	2021-11-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
116	Alinary	Хил	\N	19018	\N	Мария Пеклова	f	t	2022-01-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
117	Трусикиибусики	Хил	\N	19505	\N	Анна Поморцева	f	t	2022-11-05 00:00:00	2025-04-26 19:31:44	0	\N	\N
118	Avocaboo	Хил	\N	19415	\N	Нармина Аббасова	f	t	2022-11-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
119	Bean	Хил	\N	18401	\N	Иван Морозов	f	t	2023-01-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
120	Сказочныйкрип	Хил	Танцор	19757	\N	Лидия Софрина	f	t	2023-02-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
121	Tytutyta	Хил	Танцор	1953	\N	Yunni Kim	f	t	2023-02-07 00:00:00	2025-04-26 19:31:44	0	\N	\N
122	Yuumi	Хил	\N	19037	\N	Аня Шебунина	f	t	2023-06-26 00:00:00	2025-04-26 19:31:44	0	\N	\N
123	Помятыйхил	Хил	\N	19429	\N	Алёна Андреева	f	t	2023-09-06 00:00:00	2025-04-26 19:31:44	0	\N	\N
124	Polnalyubvi	Хил	\N	1956	\N	Lana Lavrinyuk	f	t	2023-10-28 00:00:00	2025-04-26 19:31:44	0	\N	\N
125	Хихи	Хил	\N	1967	\N	Алия Алексеевна	f	t	2023-11-22 00:00:00	2025-04-26 19:31:44	0	\N	\N
126	Insiik	Хил	\N	19374	\N	Натали Инес	f	t	2023-12-07 00:00:00	2025-04-26 19:31:44	0	\N	\N
127	Snvs	Хил	\N	19318	\N	Злата Симонова	f	t	2024-01-09 00:00:00	2025-04-26 19:31:44	0	\N	\N
128	Valua	Хил	\N	19672	\N	Ольга Назарова	f	t	2024-02-04 00:00:00	2025-04-26 19:31:44	0	\N	\N
129	Бейбисайз 	Хил	\N	17411	\N	Лена Головач	f	t	2024-02-18 00:00:00	2025-04-26 19:31:44	0	\N	\N
130	Deliveryheal 	Хил	\N	18462	\N	Виктор Гусев	f	f	2024-02-22 00:00:00	2025-04-26 19:31:44	0	\N	\N
131	Modnavosh 	Хил	\N	19535	\N	Вошь Модная	f	f	2024-02-23 00:00:00	2025-04-26 19:31:44	0	\N	\N
132	Meomeo	Хил	\N	19412	\N	Милана Чистякова	f	f	2024-03-10 00:00:00	2025-04-26 19:31:44	0	\N	\N
133	Xsq	Хил	\N	194	\N	Ника Гудиева 	f	t	2024-07-25 00:00:00	2025-04-26 19:31:44	0	\N	\N
\.


--
-- TOC entry 3968 (class 0 OID 16597)
-- Dependencies: 215
-- Data for Name: user_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_inventory (id, user_id, type, name, quality, created_at, quantity) FROM stdin;
1088	5	Лут	Эссенция ярости	\N	2025-05-04 15:27:02.293	1
1089	17	Лут	Эссенция ярости	\N	2025-05-04 15:28:19.414	1
1114	5	Выдано	Глайдер охотника на драконов	\N	2025-05-04 00:00:00	1
1115	6	Выдано	Фрегат	\N	2025-05-04 00:00:00	1
1116	6	Выдано	Глайдер охотника на драконов	\N	2025-05-04 00:00:00	1
1135	11	Выдано	Эссенция ярости	\N	2025-05-05 05:47:26.853	10
1	1	Техника	Фрегат	\N	2025-04-26 19:38:37	1
2	1	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
3	1	Техника	Танк	\N	2025-04-26 19:38:37	1
4	1	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
5	1	Техника	Бафалка	3	2025-04-26 19:38:37	1
6	1	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
7	1	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
1090	22	Лут	Эссенция ярости	\N	2025-05-04 16:42:15.494	1
1091	6	Лут	Эссенция ярости	\N	2025-05-04 16:42:34.159	1
1092	16	Лут	Эссенция ярости	\N	2025-05-04 16:42:42.696	1
1117	11	Выдано	Ро'кана, Безумие морей	\N	2025-05-05 00:00:00	1
1136	13	Выдано	Глайдер «Крылья небесного стража»	\N	2025-05-05 17:35:58.167	11
1137	46	Выдано	Глайдер «Крылья небесного стража»	\N	2025-05-05 17:36:06.71	1
1138	5	Куплено	Эссенция ярости	\N	2025-05-05 17:37:22.852	10000
1139	6	Выдано	Эссенция ярости	\N	2025-05-05 17:37:50.966	45000
93	11	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
1093	35	Лут	Эссенция ярости	\N	2025-05-04 16:50:43.459	1
1118	6	Куплено	Перчатки иферийского советника	\N	2025-05-05 02:16:08.244	1
1140	34	Куплено	Эссенция ярости	\N	2025-05-05 17:38:02.484	15000
1141	19	Куплено	Эссенция ярости	\N	2025-05-05 17:38:23.369	15000
1142	48	Выдано	Эссенция ярости	\N	2025-05-05 17:38:37.155	4
1143	5	Куплено	Эссенция ярости	\N	2025-05-05 17:40:34.674	40000
1144	10	Выдано	Эссенция ярости	\N	2025-05-05 17:41:32.288	20000
1145	7	Куплено	Эссенция ярости	\N	2025-05-05 17:42:41.2	15000
1094	2	Лут	Эссенция ярости	\N	2025-05-04 17:15:31.207	1
1095	33	Лут	Эссенция ярости	\N	2025-05-04 17:19:49.159	1
1119	1	Куплено	Аметистовая гравировка северной звезды	\N	2025-05-05 03:36:59.57	1
1146	5	Куплено	Аметистовая гравировка северной звезды	\N	2025-05-05 17:48:22.817	40000
1147	7	Выдано	Аметистовая гравировка северной звезды	\N	2025-05-05 17:48:31.132	20000
1148	15	Куплено	Аметистовая гравировка северной звезды	\N	2025-05-05 17:48:44.291	15000
274	36	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
275	36	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
276	36	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
277	36	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
278	37	Техника	Фрегат	\N	2025-04-26 19:38:37	1
279	37	Техника	Танк	\N	2025-04-26 19:38:37	1
280	37	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
281	37	Техника	Бафалка	3	2025-04-26 19:38:37	1
1096	6	Лут	Эссенция ярости	\N	2025-05-04 17:21:48.11	1
1097	38	Лут	Эссенция ярости	\N	2025-05-04 17:22:10.428	1
1098	58	Лут	Эссенция ярости	\N	2025-05-04 17:25:49.013	1
1120	1	Куплено	Эссенция ярости	\N	2025-05-05 04:04:29.499	1
1149	11	Куплено	Свиток пробудившихся мифов	\N	2025-05-05 19:41:26.872	1
1150	11	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 19:42:10.209	1
1099	52	Лут	Эссенция ярости	\N	2025-05-04 17:28:40.96	800
1100	45	Лут	Эссенция ярости	\N	2025-05-04 17:29:31.542	7000
1101	37	Лут	Эссенция ярости	\N	2025-05-04 17:30:51.514	900
1121	1	Куплено	Эссенция ярости	\N	2025-05-05 04:11:48.722	100
1122	1	Куплено	Эссенция ярости	\N	2025-05-05 04:12:15.143	20
1151	22	Куплено	Клык Калидиса	\N	2025-05-05 21:03:10.776	2
1152	28	Выдано	Свиток пробудившихся мифов	\N	2025-05-05 21:03:26.731	1
1102	67	blyat	Эссенция ярости	\N	2025-05-04 17:36:30.553	90
1103	1	blyat	Эссенция ярости	\N	2025-05-04 17:37:44.198	80
1104	24	Лут	Эссенция ярости	\N	2025-05-04 17:38:18.906	130
1123	1	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 04:22:49.073	1
1105	30	Лут	Эссенция ярости	\N	2025-05-04 17:44:55.429	7000
1106	30	Лут	Поножи любимца Изы	\N	2025-05-04 17:45:07.56	0
1124	1	Куплено	Ишхар, грань измерений	\N	2025-05-05 04:30:40.531	1
1125	1	Куплено	Гирра, пробивающий брешь	\N	2025-05-05 04:32:19.475	1
1156	11	Куплено	Клык Калидиса	\N	2025-05-06 02:17:59.405	8
1157	11	Куплено	Клык Калидиса	\N	2025-05-06 02:17:59.416	5
636	88	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
637	88	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
638	89	Техника	Танк	\N	2025-04-26 19:38:37	1
1107	7	Лут	Аметистовая гравировка северной звезды	\N	2025-05-04 17:51:52.653	0
1126	5	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 04:37:40.799	1
1127	9	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 04:37:56.394	1
1128	29	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 04:38:10.414	1
1129	11	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 04:38:20.574	12
1108	62	Лут	Клык Калидиса	\N	2025-05-04 18:01:54.977	0
1109	62	Лут	Глайдер «Крылья небесного стража»	\N	2025-05-04 18:06:22.185	1
1130	5	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 04:48:08.451	1
1110	62	Лут	Эссенция ярости	\N	2025-05-04 18:06:44.309	9000
1131	6	Куплено	Глайдер «Крылья небесного стража»	\N	2025-05-05 04:52:21.199	1
909	128	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
910	128	Техника	Бафалка	4	2025-04-26 19:38:37	1
911	128	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
915	129	Техника	Фрегат	\N	2025-04-26 19:38:37	1
1111	43	Выдано	Глайдер охотника на драконов	\N	2025-05-04 00:00:00	1
1132	10	Выдано	Дра'кордис, Сердце дракона	\N	2025-05-05 05:17:57.857	1
8	1	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
9	1	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
1133	9	Выдано	Эссенция ярости	\N	2025-05-05 05:19:38.554	100
10	1	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
11	1	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
12	1	Петы	Дракон	\N	2025-04-26 19:38:37	1
15	2	Техника	Танк	\N	2025-04-26 19:38:37	1
21	2	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
24	3	Техника	Фрегат	\N	2025-04-26 19:38:37	1
25	3	Техника	Танк	\N	2025-04-26 19:38:37	1
26	3	Техника	Бафалка	3	2025-04-26 19:38:37	1
27	3	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
28	3	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
29	3	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
30	3	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
31	3	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
32	4	Техника	Фрегат	\N	2025-04-26 19:38:37	1
33	4	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
34	4	Техника	Танк	\N	2025-04-26 19:38:37	1
35	4	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
36	4	Техника	Бафалка	3	2025-04-26 19:38:37	1
37	4	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
38	4	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
39	4	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
40	4	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
41	5	Техника	Танк	\N	2025-04-26 19:38:37	1
42	5	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
43	5	Техника	Бафалка	3	2025-04-26 19:38:37	1
44	5	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
45	5	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
46	5	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
47	5	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
48	6	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
49	6	Техника	Танк	\N	2025-04-26 19:38:37	1
50	6	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
51	6	Техника	Бафалка	4	2025-04-26 19:38:37	1
52	6	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
53	6	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
54	6	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
55	6	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
56	6	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
57	7	Техника	Танк	\N	2025-04-26 19:38:37	1
58	7	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
59	7	Техника	Бафалка	3	2025-04-26 19:38:37	1
60	7	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
61	7	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
62	7	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
63	8	Техника	Танк	\N	2025-04-26 19:38:37	1
64	8	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
65	8	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
66	8	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
67	8	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
68	8	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
69	9	Техника	Фрегат	\N	2025-04-26 19:38:37	1
70	9	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
71	9	Техника	Танк	\N	2025-04-26 19:38:37	1
72	9	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
73	9	Техника	Бафалка	3	2025-04-26 19:38:37	1
74	9	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
75	9	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
76	9	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
77	9	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
78	9	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
79	10	Техника	Танк	\N	2025-04-26 19:38:37	1
80	10	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
81	10	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
82	10	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
83	10	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
84	10	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
85	10	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
86	11	Техника	Фрегат	\N	2025-04-26 19:38:37	1
87	11	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
88	11	Техника	Танк	\N	2025-04-26 19:38:37	1
89	11	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
90	11	Техника	Бафалка	4	2025-04-26 19:38:37	1
91	11	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
92	11	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
94	11	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
95	11	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
96	11	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
97	12	Техника	Фрегат	\N	2025-04-26 19:38:37	1
98	12	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
99	12	Техника	Танк	\N	2025-04-26 19:38:37	1
100	12	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
101	12	Техника	Бафалка	3	2025-04-26 19:38:37	1
102	12	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
103	12	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
104	12	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
105	12	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
106	12	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
107	13	Техника	Танк	\N	2025-04-26 19:38:37	1
108	13	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
109	13	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
110	13	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
111	13	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
112	13	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
113	14	Техника	Фрегат	\N	2025-04-26 19:38:37	1
114	14	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
115	14	Техника	Танк	\N	2025-04-26 19:38:37	1
116	14	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
117	14	Техника	Бафалка	3	2025-04-26 19:38:37	1
118	14	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
119	14	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
120	14	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
121	15	Техника	Фрегат	\N	2025-04-26 19:38:37	1
122	15	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
123	15	Техника	Танк	\N	2025-04-26 19:38:37	1
124	15	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
125	15	Техника	Бафалка	3	2025-04-26 19:38:37	1
126	15	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
127	15	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
128	15	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
129	15	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
130	16	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
131	16	Техника	Танк	\N	2025-04-26 19:38:37	1
132	16	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
133	16	Техника	Бафалка	4	2025-04-26 19:38:37	1
134	16	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
135	16	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
136	16	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
137	16	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
138	17	Техника	Фрегат	\N	2025-04-26 19:38:37	1
139	17	Техника	Танк	\N	2025-04-26 19:38:37	1
140	17	Техника	Бафалка	3	2025-04-26 19:38:37	1
141	17	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
142	17	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
143	17	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
144	17	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
145	17	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
146	19	Техника	Фрегат	\N	2025-04-26 19:38:37	1
147	19	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
148	19	Техника	Танк	\N	2025-04-26 19:38:37	1
149	19	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
150	19	Техника	Бафалка	3	2025-04-26 19:38:37	1
151	19	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
152	19	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
153	19	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
154	20	Техника	Фрегат	\N	2025-04-26 19:38:37	1
155	20	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
156	20	Техника	Танк	\N	2025-04-26 19:38:37	1
157	20	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
158	20	Техника	Бафалка	3	2025-04-26 19:38:37	1
159	20	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
160	20	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
161	20	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
162	20	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
163	21	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
164	21	Техника	Танк	\N	2025-04-26 19:38:37	1
165	21	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
166	21	Техника	Бафалка	3	2025-04-26 19:38:37	1
688	96	Техника	Бафалка	4	2025-04-26 19:38:37	1
168	21	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
169	21	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
170	22	Техника	Фрегат	\N	2025-04-26 19:38:37	1
171	22	Техника	Танк	\N	2025-04-26 19:38:37	1
172	22	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
173	22	Техника	Бафалка	3	2025-04-26 19:38:37	1
174	22	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
175	22	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
176	22	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
177	23	Техника	Фрегат	\N	2025-04-26 19:38:37	1
178	23	Техника	Танк	\N	2025-04-26 19:38:37	1
179	23	Техника	Бафалка	3	2025-04-26 19:38:37	1
180	23	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
181	23	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
182	23	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
183	23	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
184	23	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
185	24	Техника	Фрегат	\N	2025-04-26 19:38:37	1
186	24	Техника	Танк	\N	2025-04-26 19:38:37	1
187	24	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
188	24	Техника	Бафалка	3	2025-04-26 19:38:37	1
189	24	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
190	24	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
191	24	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
192	24	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
193	24	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
194	24	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
195	25	Техника	Танк	\N	2025-04-26 19:38:37	1
196	25	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
197	25	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
198	25	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
199	26	Техника	Фрегат	\N	2025-04-26 19:38:37	1
200	26	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
201	26	Техника	Танк	\N	2025-04-26 19:38:37	1
202	26	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
203	26	Техника	Бафалка	3	2025-04-26 19:38:37	1
204	26	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
205	26	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
206	26	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
207	26	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
208	27	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
209	27	Техника	Танк	\N	2025-04-26 19:38:37	1
210	27	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
211	27	Техника	Бафалка	3	2025-04-26 19:38:37	1
212	27	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
213	27	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
214	27	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
215	28	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
216	28	Техника	Танк	\N	2025-04-26 19:38:37	1
217	28	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
218	28	Техника	Бафалка	3	2025-04-26 19:38:37	1
219	28	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
220	28	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
221	29	Техника	Танк	\N	2025-04-26 19:38:37	1
222	29	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
223	29	Техника	Бафалка	3	2025-04-26 19:38:37	1
224	29	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
225	29	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
226	29	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
227	29	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
228	30	Техника	Танк	\N	2025-04-26 19:38:37	1
229	30	Техника	Бафалка	3	2025-04-26 19:38:37	1
230	30	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
231	30	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
232	30	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
233	31	Техника	Танк	\N	2025-04-26 19:38:37	1
234	31	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
235	31	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
236	31	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
237	32	Техника	Танк	\N	2025-04-26 19:38:37	1
238	32	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
239	32	Техника	Бафалка	3	2025-04-26 19:38:37	1
240	32	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
241	32	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
242	32	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
243	33	Техника	Фрегат	\N	2025-04-26 19:38:37	1
244	33	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
245	33	Техника	Танк	\N	2025-04-26 19:38:37	1
246	33	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
247	33	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
248	33	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
249	33	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
250	33	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
251	34	Техника	Фрегат	\N	2025-04-26 19:38:37	1
252	34	Техника	Танк	\N	2025-04-26 19:38:37	1
253	34	Техника	Бафалка	3	2025-04-26 19:38:37	1
254	34	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
255	34	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
256	34	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
257	35	Техника	Фрегат	\N	2025-04-26 19:38:37	1
258	35	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
259	35	Техника	Танк	\N	2025-04-26 19:38:37	1
260	35	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
261	35	Техника	Бафалка	3	2025-04-26 19:38:37	1
262	35	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
263	35	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
264	35	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
265	35	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
266	35	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
267	35	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
268	35	Петы	Дракон	\N	2025-04-26 19:38:37	1
269	36	Техника	Фрегат	\N	2025-04-26 19:38:37	1
270	36	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
271	36	Техника	Танк	\N	2025-04-26 19:38:37	1
272	36	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
273	36	Техника	Бафалка	3	2025-04-26 19:38:37	1
282	37	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
283	37	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
284	37	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
285	37	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
286	37	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
287	37	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
288	37	Петы	Дракон	\N	2025-04-26 19:38:37	1
289	38	Техника	Фрегат	\N	2025-04-26 19:38:37	1
290	38	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
291	38	Техника	Танк	\N	2025-04-26 19:38:37	1
292	38	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
293	38	Техника	Бафалка	3	2025-04-26 19:38:37	1
294	38	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
295	38	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
296	38	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
297	39	Техника	Фрегат	\N	2025-04-26 19:38:37	1
298	39	Техника	Танк	\N	2025-04-26 19:38:37	1
299	39	Техника	Бафалка	4	2025-04-26 19:38:37	1
300	39	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
301	39	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
302	39	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
303	39	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
304	39	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
305	40	Техника	Танк	\N	2025-04-26 19:38:37	1
306	40	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
307	40	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
308	41	Техника	Фрегат	\N	2025-04-26 19:38:37	1
309	41	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
310	41	Техника	Танк	\N	2025-04-26 19:38:37	1
311	41	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
312	41	Техника	Бафалка	3	2025-04-26 19:38:37	1
313	41	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
314	41	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
315	42	Техника	Танк	\N	2025-04-26 19:38:37	1
316	42	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
317	42	Техника	Бафалка	3	2025-04-26 19:38:37	1
318	42	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
319	42	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
320	42	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
321	43	Техника	Фрегат	\N	2025-04-26 19:38:37	1
322	43	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
323	43	Техника	Танк	\N	2025-04-26 19:38:37	1
324	43	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
326	43	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
327	43	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
328	43	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
329	43	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
337	44	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
340	45	Техника	Танк	\N	2025-04-26 19:38:37	1
341	45	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
342	45	Техника	Бафалка	4	2025-04-26 19:38:37	1
343	45	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
344	45	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
345	45	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
346	45	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
347	46	Техника	Фрегат	\N	2025-04-26 19:38:37	1
348	46	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
349	46	Техника	Танк	\N	2025-04-26 19:38:37	1
350	46	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
351	46	Техника	Бафалка	4	2025-04-26 19:38:37	1
772	109	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
352	46	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
353	46	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
354	46	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
355	46	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
356	46	Петы	Дракон	\N	2025-04-26 19:38:37	1
357	47	Техника	Фрегат	\N	2025-04-26 19:38:37	1
358	47	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
359	47	Техника	Танк	\N	2025-04-26 19:38:37	1
360	47	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
361	47	Техника	Бафалка	3	2025-04-26 19:38:37	1
362	47	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
363	47	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
364	47	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
333	44	Техника	Бафалка	5	2025-04-26 19:38:37	1
365	48	Техника	Фрегат	\N	2025-04-26 19:38:37	1
366	48	Техника	Танк	\N	2025-04-26 19:38:37	1
367	48	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
368	48	Техника	Бафалка	3	2025-04-26 19:38:37	1
369	48	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
370	48	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
371	48	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
372	48	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
373	48	Петы	Дракон	\N	2025-04-26 19:38:37	1
374	49	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
375	49	Техника	Танк	\N	2025-04-26 19:38:37	1
376	49	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
377	49	Техника	Бафалка	4	2025-04-26 19:38:37	1
378	49	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
379	49	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
380	49	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
381	49	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
382	49	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
383	50	Техника	Фрегат	\N	2025-04-26 19:38:37	1
384	50	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
385	50	Техника	Танк	\N	2025-04-26 19:38:37	1
386	50	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
387	50	Техника	Бафалка	3	2025-04-26 19:38:37	1
388	50	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
389	50	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
390	50	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
391	50	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
392	51	Техника	Танк	\N	2025-04-26 19:38:37	1
393	51	Техника	Бафалка	4	2025-04-26 19:38:37	1
394	51	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
395	51	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
396	51	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
397	51	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
398	51	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
399	51	Петы	Дракон	\N	2025-04-26 19:38:37	1
400	52	Техника	Танк	\N	2025-04-26 19:38:37	1
401	52	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
402	52	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
403	52	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
404	52	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
405	53	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
406	53	Техника	Танк	\N	2025-04-26 19:38:37	1
407	53	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
408	53	Техника	Бафалка	3	2025-04-26 19:38:37	1
409	53	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
410	53	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
411	53	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
412	53	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
413	53	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
414	54	Техника	Танк	\N	2025-04-26 19:38:37	1
415	54	Техника	Бафалка	4	2025-04-26 19:38:37	1
416	54	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
417	54	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
418	54	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
419	54	Петы	Дракон	\N	2025-04-26 19:38:37	1
420	55	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
421	55	Техника	Танк	\N	2025-04-26 19:38:37	1
422	55	Техника	Бафалка	4	2025-04-26 19:38:37	1
423	55	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
424	55	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
425	55	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
426	55	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
427	55	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
428	56	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
429	56	Техника	Танк	\N	2025-04-26 19:38:37	1
430	56	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
431	56	Техника	Бафалка	4	2025-04-26 19:38:37	1
432	56	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
433	56	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
434	56	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
435	56	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
436	56	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
437	56	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
438	56	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
439	57	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
440	57	Техника	Танк	\N	2025-04-26 19:38:37	1
441	57	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
442	57	Техника	Бафалка	4	2025-04-26 19:38:37	1
443	57	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
444	57	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
445	57	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
446	57	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
447	57	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
448	58	Техника	Фрегат	\N	2025-04-26 19:38:37	1
449	58	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
450	58	Техника	Танк	\N	2025-04-26 19:38:37	1
451	58	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
452	58	Техника	Бафалка	3	2025-04-26 19:38:37	1
453	58	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
454	58	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
455	58	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
456	58	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
457	59	Техника	Фрегат	\N	2025-04-26 19:38:37	1
458	59	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
459	59	Техника	Танк	\N	2025-04-26 19:38:37	1
460	59	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
461	59	Техника	Бафалка	4	2025-04-26 19:38:37	1
462	59	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
463	59	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
464	59	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
465	59	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
466	59	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
467	60	Техника	Танк	\N	2025-04-26 19:38:37	1
468	60	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
469	60	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
470	60	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
471	61	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
472	61	Техника	Танк	\N	2025-04-26 19:38:37	1
473	61	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
474	61	Техника	Бафалка	4	2025-04-26 19:38:37	1
475	61	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
476	61	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
477	61	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
478	61	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
479	62	Техника	Фрегат	\N	2025-04-26 19:38:37	1
480	62	Техника	Танк	\N	2025-04-26 19:38:37	1
481	62	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
482	62	Техника	Бафалка	3	2025-04-26 19:38:37	1
483	62	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
484	62	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
485	62	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
486	63	Техника	Фрегат	\N	2025-04-26 19:38:37	1
487	63	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
488	63	Техника	Танк	\N	2025-04-26 19:38:37	1
489	63	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
490	63	Техника	Бафалка	4	2025-04-26 19:38:37	1
491	63	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
492	63	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
493	63	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
494	63	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
495	63	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
496	64	Техника	Танк	\N	2025-04-26 19:38:37	1
497	64	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
498	64	Техника	Бафалка	3	2025-04-26 19:38:37	1
499	64	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
500	64	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
501	64	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
502	65	Техника	Танк	\N	2025-04-26 19:38:37	1
503	65	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
504	65	Техника	Бафалка	4	2025-04-26 19:38:37	1
505	65	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
506	65	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
507	65	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
508	66	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
509	66	Техника	Танк	\N	2025-04-26 19:38:37	1
510	66	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
511	66	Техника	Бафалка	4	2025-04-26 19:38:37	1
512	66	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
513	66	Глайдеры	Коллеционный глайдер т2	4	2025-04-26 19:38:37	1
514	66	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
515	66	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
773	109	Техника	Бафалка	3	2025-04-26 19:38:37	1
516	66	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
517	67	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
518	67	Техника	Танк	\N	2025-04-26 19:38:37	1
519	67	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
520	67	Техника	Бафалка	3	2025-04-26 19:38:37	1
521	67	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
522	67	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
523	67	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
524	67	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
525	72	Техника	Танк	\N	2025-04-26 19:38:37	1
526	72	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
527	72	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
528	72	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
529	72	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
530	73	Техника	Фрегат	\N	2025-04-26 19:38:37	1
531	73	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
532	73	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
533	73	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
534	73	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
535	74	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
536	74	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
537	74	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
538	75	Техника	Фрегат	\N	2025-04-26 19:38:37	1
539	75	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
540	75	Техника	Танк	\N	2025-04-26 19:38:37	1
541	75	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
542	75	Техника	Бафалка	4	2025-04-26 19:38:37	1
543	75	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
544	75	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
545	75	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
546	75	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
547	75	Петы	Дракон	\N	2025-04-26 19:38:37	1
548	76	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
549	76	Техника	Танк	\N	2025-04-26 19:38:37	1
550	76	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
551	76	Техника	Бафалка	3	2025-04-26 19:38:37	1
552	76	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
553	76	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
554	76	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
555	77	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
556	77	Техника	Бафалка	3	2025-04-26 19:38:37	1
557	77	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
558	77	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
559	77	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
560	78	Техника	Фрегат	\N	2025-04-26 19:38:37	1
561	78	Техника	Танк	\N	2025-04-26 19:38:37	1
562	78	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
563	78	Техника	Бафалка	3	2025-04-26 19:38:37	1
564	78	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
565	78	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
566	78	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
567	78	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
568	79	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
569	79	Техника	Танк	\N	2025-04-26 19:38:37	1
570	79	Техника	Бафалка	3	2025-04-26 19:38:37	1
571	79	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
572	79	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
573	79	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
574	80	Техника	Танк	\N	2025-04-26 19:38:37	1
575	80	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
576	80	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
577	80	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
578	80	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
579	81	Техника	Фрегат	\N	2025-04-26 19:38:37	1
580	81	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
581	81	Техника	Танк	\N	2025-04-26 19:38:37	1
582	81	Техника	Бафалка	3	2025-04-26 19:38:37	1
583	81	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
584	81	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
585	81	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
586	82	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
587	82	Техника	Танк	\N	2025-04-26 19:38:37	1
588	82	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
589	82	Техника	Бафалка	3	2025-04-26 19:38:37	1
590	82	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
591	82	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
592	82	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
593	82	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
594	83	Техника	Танк	\N	2025-04-26 19:38:37	1
595	83	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
596	83	Техника	Бафалка	3	2025-04-26 19:38:37	1
597	83	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
598	83	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
599	84	Техника	Фрегат	\N	2025-04-26 19:38:37	1
600	84	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
601	84	Техника	Танк	\N	2025-04-26 19:38:37	1
602	84	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
603	84	Техника	Бафалка	3	2025-04-26 19:38:37	1
604	84	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
605	84	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
606	84	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
607	84	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
608	84	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
609	85	Техника	Фрегат	\N	2025-04-26 19:38:37	1
610	85	Техника	Танк	\N	2025-04-26 19:38:37	1
611	85	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
612	85	Техника	Бафалка	3	2025-04-26 19:38:37	1
613	85	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
614	85	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
615	85	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
616	86	Техника	Фрегат	\N	2025-04-26 19:38:37	1
617	86	Техника	Танк	\N	2025-04-26 19:38:37	1
618	86	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
619	86	Техника	Бафалка	4	2025-04-26 19:38:37	1
620	86	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
621	86	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
622	86	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
623	86	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
624	86	Петы	Дракон	\N	2025-04-26 19:38:37	1
625	87	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
626	87	Техника	Танк	\N	2025-04-26 19:38:37	1
627	87	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
628	87	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
629	87	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
630	87	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
631	87	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
632	88	Техника	Танк	\N	2025-04-26 19:38:37	1
633	88	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
634	88	Техника	Бафалка	3	2025-04-26 19:38:37	1
635	88	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
639	89	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
640	89	Техника	Бафалка	3	2025-04-26 19:38:37	1
641	89	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
642	89	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
643	89	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
644	89	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
645	90	Техника	Фрегат	\N	2025-04-26 19:38:37	1
646	90	Техника	Танк	\N	2025-04-26 19:38:37	1
647	90	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
648	90	Техника	Бафалка	3	2025-04-26 19:38:37	1
649	90	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
650	90	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
651	91	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
652	91	Техника	Танк	\N	2025-04-26 19:38:37	1
653	91	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
654	91	Техника	Бафалка	4	2025-04-26 19:38:37	1
655	91	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
656	91	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
657	91	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
658	92	Техника	Фрегат	\N	2025-04-26 19:38:37	1
659	92	Техника	Танк	\N	2025-04-26 19:38:37	1
660	92	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
661	92	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
662	92	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
663	92	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
664	92	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
665	93	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
666	93	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
667	93	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
668	93	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
669	94	Техника	Фрегат	\N	2025-04-26 19:38:37	1
670	94	Техника	Танк	\N	2025-04-26 19:38:37	1
673	94	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
674	94	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
676	95	Техника	Фрегат	\N	2025-04-26 19:38:37	1
677	95	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
678	95	Техника	Танк	\N	2025-04-26 19:38:37	1
679	95	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
680	95	Техника	Бафалка	3	2025-04-26 19:38:37	1
681	95	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
682	95	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
683	95	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
684	95	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
685	95	Петы	Дракон	\N	2025-04-26 19:38:37	1
686	96	Техника	Фрегат	\N	2025-04-26 19:38:37	1
687	96	Техника	Танк	\N	2025-04-26 19:38:37	1
689	96	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
690	96	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
691	96	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
692	97	Техника	Фрегат	\N	2025-04-26 19:38:37	1
693	97	Техника	Танк	\N	2025-04-26 19:38:37	1
694	97	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
695	97	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
696	97	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
697	97	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
698	98	Техника	Фрегат	\N	2025-04-26 19:38:37	1
699	98	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
700	98	Техника	Танк	\N	2025-04-26 19:38:37	1
701	98	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
702	98	Техника	Бафалка	3	2025-04-26 19:38:37	1
703	98	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
704	98	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
705	99	Техника	Фрегат	\N	2025-04-26 19:38:37	1
706	99	Техника	Танк	\N	2025-04-26 19:38:37	1
707	99	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
708	99	Техника	Бафалка	4	2025-04-26 19:38:37	1
709	99	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
710	99	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
711	99	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
712	99	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
713	99	Петы	Дракон	\N	2025-04-26 19:38:37	1
714	100	Техника	Танк	\N	2025-04-26 19:38:37	1
715	100	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
716	100	Техника	Бафалка	3	2025-04-26 19:38:37	1
717	100	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
718	100	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
719	100	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
720	100	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
721	101	Техника	Фрегат	\N	2025-04-26 19:38:37	1
722	101	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
723	101	Техника	Танк	\N	2025-04-26 19:38:37	1
724	101	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
725	101	Техника	Бафалка	4	2025-04-26 19:38:37	1
726	101	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
727	101	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
728	101	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
729	101	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
730	102	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
731	102	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
732	102	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
733	103	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
734	103	Техника	Танк	\N	2025-04-26 19:38:37	1
735	103	Техника	Бафалка	5	2025-04-26 19:38:37	1
736	103	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
737	103	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
738	103	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
739	103	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
740	104	Техника	Фрегат	\N	2025-04-26 19:38:37	1
741	104	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
742	104	Техника	Танк	\N	2025-04-26 19:38:37	1
743	104	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
744	104	Техника	Бафалка	3	2025-04-26 19:38:37	1
745	104	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
746	104	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
747	104	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
748	105	Техника	Танк	\N	2025-04-26 19:38:37	1
749	105	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
750	105	Техника	Бафалка	3	2025-04-26 19:38:37	1
751	105	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
752	105	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
753	105	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
754	106	Техника	Танк	\N	2025-04-26 19:38:37	1
755	106	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
756	106	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
757	106	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
758	106	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
759	107	Техника	Танк	\N	2025-04-26 19:38:37	1
760	107	Техника	Бафалка	3	2025-04-26 19:38:37	1
761	107	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
762	107	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
763	107	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
764	107	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
765	108	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
766	108	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
767	108	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
768	108	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
769	108	Петы	Коллекционный фамильяр т2	4	2025-04-26 19:38:37	1
770	109	Техника	Фрегат	\N	2025-04-26 19:38:37	1
771	109	Техника	Танк	\N	2025-04-26 19:38:37	1
774	109	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
775	109	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
776	110	Техника	Танк	\N	2025-04-26 19:38:37	1
777	110	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
778	110	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
779	110	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
780	111	Техника	Фрегат	\N	2025-04-26 19:38:37	1
781	111	Техника	Танк	\N	2025-04-26 19:38:37	1
782	111	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
783	111	Техника	Бафалка	4	2025-04-26 19:38:37	1
784	111	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
785	111	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
786	111	Глайдеры	Авиара	\N	2025-04-26 19:38:37	1
787	111	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
788	112	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
789	112	Техника	Танк	\N	2025-04-26 19:38:37	1
790	112	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
791	112	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
792	112	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
793	112	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
794	112	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
795	113	Техника	Фрегат	\N	2025-04-26 19:38:37	1
796	113	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
797	113	Техника	Танк	\N	2025-04-26 19:38:37	1
798	113	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
799	113	Техника	Бафалка	3	2025-04-26 19:38:37	1
800	113	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
801	113	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
802	113	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
803	113	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
804	114	Техника	Танк	\N	2025-04-26 19:38:37	1
805	114	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
806	114	Техника	Бафалка	3	2025-04-26 19:38:37	1
807	114	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
808	114	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
809	114	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
810	115	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
811	115	Техника	Танк	\N	2025-04-26 19:38:37	1
812	115	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
813	115	Техника	Бафалка	3	2025-04-26 19:38:37	1
814	115	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
815	115	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
816	115	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
817	115	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
818	116	Техника	Фрегат	\N	2025-04-26 19:38:37	1
819	116	Техника	Танк	\N	2025-04-26 19:38:37	1
820	116	Техника	Бафалка	3	2025-04-26 19:38:37	1
821	116	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
822	116	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
823	116	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
824	117	Техника	Фрегат	\N	2025-04-26 19:38:37	1
825	117	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
826	117	Техника	Танк	\N	2025-04-26 19:38:37	1
827	117	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
828	117	Техника	Бафалка	4	2025-04-26 19:38:37	1
829	117	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
830	117	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
831	117	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
832	117	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
833	118	Техника	Танк	\N	2025-04-26 19:38:37	1
834	118	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
835	118	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
836	118	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
837	119	Техника	Фрегат	\N	2025-04-26 19:38:37	1
838	119	Техника	Танк	\N	2025-04-26 19:38:37	1
839	119	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
840	119	Техника	Бафалка	3	2025-04-26 19:38:37	1
841	119	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
842	119	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
843	119	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
844	119	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
845	120	Техника	Фрегат	\N	2025-04-26 19:38:37	1
846	120	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
847	120	Техника	Танк	\N	2025-04-26 19:38:37	1
848	120	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
849	120	Техника	Бафалка	4	2025-04-26 19:38:37	1
850	120	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
851	120	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
852	120	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
853	120	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
854	121	Техника	Фрегат	\N	2025-04-26 19:38:37	1
855	121	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
856	121	Техника	Танк	\N	2025-04-26 19:38:37	1
857	121	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
858	121	Техника	Бафалка	4	2025-04-26 19:38:37	1
859	121	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
860	121	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
861	121	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
862	121	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
863	122	Техника	Танк	\N	2025-04-26 19:38:37	1
864	122	Техника	Бафалка	3	2025-04-26 19:38:37	1
865	122	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
866	122	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
867	123	Техника	Фрегат	\N	2025-04-26 19:38:37	1
868	123	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
869	123	Техника	Танк	\N	2025-04-26 19:38:37	1
870	123	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
871	123	Техника	Бафалка	3	2025-04-26 19:38:37	1
872	123	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
873	123	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
874	123	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
875	123	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
876	123	Петы	Дракон	\N	2025-04-26 19:38:37	1
877	124	Техника	Фрегат	\N	2025-04-26 19:38:37	1
878	124	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
879	124	Техника	Танк	\N	2025-04-26 19:38:37	1
880	124	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
881	124	Техника	Бафалка	3	2025-04-26 19:38:37	1
882	124	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
883	124	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
884	124	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
885	124	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
886	125	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
887	125	Техника	Танк	\N	2025-04-26 19:38:37	1
888	125	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
889	125	Техника	Бафалка	4	2025-04-26 19:38:37	1
890	125	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
891	125	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
892	125	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
893	126	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
894	126	Техника	Танк	\N	2025-04-26 19:38:37	1
895	126	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
896	126	Техника	Бафалка	4	2025-04-26 19:38:37	1
897	126	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
898	126	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
899	126	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
900	126	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
901	127	Техника	Танк	\N	2025-04-26 19:38:37	1
902	127	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
903	127	Техника	Бафалка	4	2025-04-26 19:38:37	1
904	127	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
905	127	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
906	127	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
907	128	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
908	128	Техника	Танк	\N	2025-04-26 19:38:37	1
912	128	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
913	128	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
914	128	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
916	129	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
917	129	Техника	Танк	\N	2025-04-26 19:38:37	1
918	129	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
919	129	Техника	Бафалка	3	2025-04-26 19:38:37	1
920	129	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
921	130	Техника	Фрегат	\N	2025-04-26 19:38:37	1
922	130	Техника	Танк	\N	2025-04-26 19:38:37	1
923	130	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
924	130	Техника	Бафалка	3	2025-04-26 19:38:37	1
925	130	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
926	130	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
927	130	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
928	131	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
929	131	Техника	Танк	\N	2025-04-26 19:38:37	1
930	131	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
931	131	Техника	Бафалка	4	2025-04-26 19:38:37	1
932	131	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
933	131	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
934	132	Техника	Фрегат	\N	2025-04-26 19:38:37	1
935	132	Техника	Танк	\N	2025-04-26 19:38:37	1
936	132	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
937	132	Техника	Бафалка	3	2025-04-26 19:38:37	1
938	132	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
939	132	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
940	132	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
941	133	Техника	Фрегат	\N	2025-04-26 19:38:37	1
942	133	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
943	133	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
944	133	Техника	Бафалка	3	2025-04-26 19:38:37	1
945	133	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
946	133	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
947	133	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
948	133	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
949	133	Петы	Дракон	\N	2025-04-26 19:38:37	1
950	134	Техника	Фрегат	\N	2025-04-26 19:38:37	1
951	134	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
952	134	Техника	Танк	\N	2025-04-26 19:38:37	1
953	134	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
954	134	Техника	Бафалка	4	2025-04-26 19:38:37	1
955	134	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
956	134	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
957	134	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
958	134	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
959	135	Техника	Танк	\N	2025-04-26 19:38:37	1
960	135	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
961	135	Техника	Бафалка	3	2025-04-26 19:38:37	1
962	135	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
963	136	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
964	136	Техника	Танк	\N	2025-04-26 19:38:37	1
965	136	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
966	136	Техника	Бафалка	3	2025-04-26 19:38:37	1
967	136	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
968	136	Глайдеры	Глайдер дракон	\N	2025-04-26 19:38:37	1
969	136	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
970	137	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
971	137	Техника	Танк	\N	2025-04-26 19:38:37	1
972	137	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
973	137	Техника	Бафалка	3	2025-04-26 19:38:37	1
974	137	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
975	137	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
976	137	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
977	138	Техника	Кобуксон	\N	2025-04-26 19:38:37	1
978	138	Техника	Танк	\N	2025-04-26 19:38:37	1
979	138	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
980	138	Техника	Бафалка	3	2025-04-26 19:38:37	1
981	138	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
982	138	Глайдеры	Крылья кровавого легиона	\N	2025-04-26 19:38:37	1
983	138	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
984	139	Техника	Танк	\N	2025-04-26 19:38:37	1
985	139	Техника	Канонёрка	\N	2025-04-26 19:38:37	1
986	139	Техника	Бафалка	3	2025-04-26 19:38:37	1
987	139	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
988	139	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
989	140	Глайдеры	Коллеционный глайдер	3	2025-04-26 19:38:37	1
990	140	Петы	Коллекционный фамильяр	3	2025-04-26 19:38:37	1
994	2	Техника	Кобуксон	\N	2025-04-29 13:30:45.153	1
1002	2	Техника	Канонёрка	\N	2025-04-29 13:34:10.208	1
1011	2	Глайдеры	Коллеционный глайдер	4	2025-04-29 14:06:23.264	1
1005	2	Глайдеры	Авиара	\N	2025-04-29 13:38:41.854	1
1012	24	Техника	Кобуксон	\N	2025-04-29 15:36:57.637	1
325	43	Техника	Бафалка	4	2025-04-26 19:38:37	1
1087	7	Лут	Эссенция ярости	\N	2025-05-04 15:18:19.802	1
1015	94	Петы	Коллекционный фамильяр	3	2025-04-29 20:47:59.334	1
1016	94	Глайдеры	Коллеционный глайдер	3	2025-04-29 20:48:01.33	1
1017	94	Техника	Бафалка	4	2025-04-29 20:48:14.673	1
1018	94	Техника	Бафалка	4	2025-04-29 20:48:36.52	1
1021	44	Глайдеры	Авиара	\N	2025-04-29 21:51:18.192	1
1028	44	Техника	Танк	\N	2025-04-29 22:14:08.614	1
1034	44	Техника	Кобуксон	\N	2025-04-29 22:52:47.993	1
1035	44	Техника	Канонёрка	\N	2025-04-29 22:52:56.798	1
1036	44	Глайдеры	Крылья кровавого легиона	\N	2025-04-29 22:53:12.794	1
1042	21	Глайдеры	Коллеционный глайдер	4	2025-04-30 09:38:48.658	1
1067	2	Петы	Коллекционный фамильяр	4	2025-04-30 10:06:08.712	1
1077	5	Петы	Зеленый Дракон	\N	2025-04-30 10:12:58.179	1
1082	2	Петы	Красный Дракон	\N	2025-04-30 10:25:51.546	1
1085	24	Петы	Зеленый Дракон	\N	2025-05-01 17:49:49.165	1
1086	2	Лут	Поножи иферийского советника	\N	2025-05-04 13:41:11.689	1
1112	5	Выдано	Фрегат	\N	2025-05-04 00:00:00	1
1113	5	Выдано	Фрегат	\N	2025-05-04 00:00:00	1
1134	5	Куплено	Эссенция ярости	\N	2025-05-05 05:44:55.071	100
\.


--
-- TOC entry 3997 (class 0 OID 16914)
-- Dependencies: 244
-- Data for Name: user_salary_bonus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_salary_bonus (id, user_id, amount, reason, created_at) FROM stdin;
2	43	2	w	2025-05-05 05:39:41.096
3	43	1	w	2025-05-05 05:39:49.615
\.


--
-- TOC entry 3975 (class 0 OID 16640)
-- Dependencies: 222
-- Data for Name: user_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tags (id, user_id, tag, created_at) FROM stdin;
250	2	Модератор	2025-04-29 04:01:11.028
251	4	Крит	2025-04-29 04:01:11.028
252	4	Сноровка	2025-04-29 04:01:11.028
253	5	Двурук	2025-04-29 04:01:11.028
254	5	Крит	2025-04-29 04:01:11.028
255	5	Каст	2025-04-29 04:01:11.028
256	6	Сноровка	2025-04-29 04:01:11.028
257	7	Двурук	2025-04-29 04:01:11.028
258	7	Крит	2025-04-29 04:01:11.028
259	7	Сноровка	2025-04-29 04:01:11.028
260	8	Деф	2025-04-29 04:01:11.028
261	9	Сноровка	2025-04-29 04:01:11.028
262	10	Деф	2025-04-29 04:01:11.028
263	11	Крит	2025-04-29 04:01:11.028
264	11	Сноровка	2025-04-29 04:01:11.028
265	12	Крит	2025-04-29 04:01:11.028
266	12	Сноровка	2025-04-29 04:01:11.028
267	13	Крит	2025-04-29 04:01:11.028
268	13	Сноровка	2025-04-29 04:01:11.028
269	14	Крит	2025-04-29 04:01:11.028
270	14	Сноровка	2025-04-29 04:01:11.028
271	15	Крит	2025-04-29 04:01:11.028
272	15	Сноровка	2025-04-29 04:01:11.028
273	16	Крит	2025-04-29 04:01:11.028
274	16	Сноровка	2025-04-29 04:01:11.028
275	17	Крит	2025-04-29 04:01:11.028
276	17	Сноровка	2025-04-29 04:01:11.028
277	17	ДВ	2025-04-29 04:01:11.028
278	18	Крит	2025-04-29 04:01:11.028
279	18	Сноровка	2025-04-29 04:01:11.028
280	19	Крит	2025-04-29 04:01:11.028
281	19	Сноровка	2025-04-29 04:01:11.028
282	20	Крит	2025-04-29 04:01:11.028
283	20	Сноровка	2025-04-29 04:01:11.028
284	21	Крит	2025-04-29 04:01:11.028
285	21	Сноровка	2025-04-29 04:01:11.028
286	22	Сноровка	2025-04-29 04:01:11.028
287	23	Двурук	2025-04-29 04:01:11.028
288	23	Крит	2025-04-29 04:01:11.028
289	23	Каст	2025-04-29 04:01:11.028
290	23	ДВ	2025-04-29 04:01:11.028
291	24	Двурук	2025-04-29 04:01:11.028
292	24	Каст	2025-04-29 04:01:11.028
293	25	Двурук	2025-04-29 04:01:11.028
294	25	Сноровка	2025-04-29 04:01:11.028
295	26	Двурук	2025-04-29 04:01:11.028
296	26	Сноровка	2025-04-29 04:01:11.028
297	27	Двурук	2025-04-29 04:01:11.028
298	27	Сноровка	2025-04-29 04:01:11.028
299	28	Двурук	2025-04-29 04:01:11.028
300	28	Сноровка	2025-04-29 04:01:11.028
301	29	Двурук	2025-04-29 04:01:11.028
302	29	Сноровка	2025-04-29 04:01:11.028
303	30	Двурук	2025-04-29 04:01:11.028
304	30	Сноровка	2025-04-29 04:01:11.028
305	31	Двурук	2025-04-29 04:01:11.028
306	31	Сноровка	2025-04-29 04:01:11.028
307	32	Двурук	2025-04-29 04:01:11.028
308	32	Сноровка	2025-04-29 04:01:11.028
309	33	Двурук	2025-04-29 04:01:11.028
310	33	Сноровка	2025-04-29 04:01:11.028
311	33	ДВ	2025-04-29 04:01:11.028
312	34	Сноровка	2025-04-29 04:01:11.028
313	35	Двурук	2025-04-29 04:01:11.028
314	35	Сноровка	2025-04-29 04:01:11.028
315	36	Двурук	2025-04-29 04:01:11.028
316	36	Сноровка	2025-04-29 04:01:11.028
317	37	Сноровка	2025-04-29 04:01:11.028
318	38	Двурук	2025-04-29 04:01:11.028
319	38	Крит	2025-04-29 04:01:11.028
320	38	Сноровка	2025-04-29 04:01:11.028
321	39	Сноровка	2025-04-29 04:01:11.028
322	40	Сноровка	2025-04-29 04:01:11.028
323	41	Сноровка	2025-04-29 04:01:11.028
324	42	Крит	2025-04-29 04:01:11.028
325	42	Каст	2025-04-29 04:01:11.028
327	44	Двурук	2025-04-29 04:01:11.028
328	44	Крит	2025-04-29 04:01:11.028
329	44	Каст	2025-04-29 04:01:11.028
330	45	Каст	2025-04-29 04:01:11.028
331	46	Каст	2025-04-29 04:01:11.028
332	46	ДВ	2025-04-29 04:01:11.028
333	47	Каст	2025-04-29 04:01:11.028
334	48	Каст	2025-04-29 04:01:11.028
335	48	ДВ	2025-04-29 04:01:11.028
336	49	Каст	2025-04-29 04:01:11.028
337	50	Крит	2025-04-29 04:01:11.028
338	50	Каст	2025-04-29 04:01:11.028
339	51	Каст	2025-04-29 04:01:11.028
340	52	Каст	2025-04-29 04:01:11.028
341	52	ДВ	2025-04-29 04:01:11.028
342	53	Каст	2025-04-29 04:01:11.028
343	54	Каст	2025-04-29 04:01:11.028
344	55	Каст	2025-04-29 04:01:11.028
345	56	Каст	2025-04-29 04:01:11.028
346	57	Каст	2025-04-29 04:01:11.028
347	58	Каст	2025-04-29 04:01:11.028
348	59	Каст	2025-04-29 04:01:11.028
349	60	Каст	2025-04-29 04:01:11.028
350	61	Каст	2025-04-29 04:01:11.028
351	62	Каст	2025-04-29 04:01:11.028
352	63	Каст	2025-04-29 04:01:11.028
353	64	Каст	2025-04-29 04:01:11.028
354	65	Каст	2025-04-29 04:01:11.028
355	66	Каст	2025-04-29 04:01:11.028
356	67	Каст	2025-04-29 04:01:11.028
363	75	Двурук	2025-04-29 04:01:11.028
364	75	Крит	2025-04-29 04:01:11.028
365	75	Сноровка	2025-04-29 04:01:11.028
366	76	Крит	2025-04-29 04:01:11.028
367	76	Сноровка	2025-04-29 04:01:11.028
368	77	Крит	2025-04-29 04:01:11.028
369	77	Сноровка	2025-04-29 04:01:11.028
370	78	Крит	2025-04-29 04:01:11.028
371	78	Сноровка	2025-04-29 04:01:11.028
372	79	Крит	2025-04-29 04:01:11.028
373	79	Сноровка	2025-04-29 04:01:11.028
374	80	Крит	2025-04-29 04:01:11.028
375	80	Сноровка	2025-04-29 04:01:11.028
376	81	Двурук	2025-04-29 04:01:11.028
377	81	Крит	2025-04-29 04:01:11.028
378	81	Сноровка	2025-04-29 04:01:11.028
379	82	Крит	2025-04-29 04:01:11.028
380	82	Сноровка	2025-04-29 04:01:11.028
381	83	Крит	2025-04-29 04:01:11.028
382	83	Сноровка	2025-04-29 04:01:11.028
383	84	Крит	2025-04-29 04:01:11.028
384	84	Сноровка	2025-04-29 04:01:11.028
385	85	Крит	2025-04-29 04:01:11.028
386	85	Сноровка	2025-04-29 04:01:11.028
387	86	Двурук	2025-04-29 04:01:11.028
388	86	Крит	2025-04-29 04:01:11.028
389	86	Сноровка	2025-04-29 04:01:11.028
390	86	ДВ	2025-04-29 04:01:11.028
391	87	Двурук	2025-04-29 04:01:11.028
392	87	Сноровка	2025-04-29 04:01:11.028
393	88	Двурук	2025-04-29 04:01:11.028
394	88	Каст	2025-04-29 04:01:11.028
395	89	Двурук	2025-04-29 04:01:11.028
396	89	Сноровка	2025-04-29 04:01:11.028
397	90	Двурук	2025-04-29 04:01:11.028
398	90	Каст	2025-04-29 04:01:11.028
399	91	Двурук	2025-04-29 04:01:11.028
400	91	Крит	2025-04-29 04:01:11.028
401	91	Сноровка	2025-04-29 04:01:11.028
402	92	Двурук	2025-04-29 04:01:11.028
403	92	Крит	2025-04-29 04:01:11.028
404	92	Сноровка	2025-04-29 04:01:11.028
405	93	Двурук	2025-04-29 04:01:11.028
406	93	Сноровка	2025-04-29 04:01:11.028
411	95	Двурук	2025-04-29 04:01:11.028
412	95	Крит	2025-04-29 04:01:11.028
413	95	Сноровка	2025-04-29 04:01:11.028
414	96	Двурук	2025-04-29 04:01:11.028
415	96	Крит	2025-04-29 04:01:11.028
416	96	Каст	2025-04-29 04:01:11.028
417	97	Двурук	2025-04-29 04:01:11.028
418	97	Сноровка	2025-04-29 04:01:11.028
419	97	ДВ	2025-04-29 04:01:11.028
420	98	Двурук	2025-04-29 04:01:11.028
421	98	Крит	2025-04-29 04:01:11.028
422	98	Сноровка	2025-04-29 04:01:11.028
423	99	Двурук	2025-04-29 04:01:11.028
424	99	Крит	2025-04-29 04:01:11.028
425	99	Сноровка	2025-04-29 04:01:11.028
426	100	Двурук	2025-04-29 04:01:11.028
427	100	Крит	2025-04-29 04:01:11.028
428	100	Сноровка	2025-04-29 04:01:11.028
429	101	Крит	2025-04-29 04:01:11.028
430	101	Сноровка	2025-04-29 04:01:11.028
431	102	Двурук	2025-04-29 04:01:11.028
432	102	Крит	2025-04-29 04:01:11.028
433	102	Сноровка	2025-04-29 04:01:11.028
434	103	Двурук	2025-04-29 04:01:11.028
435	103	Крит	2025-04-29 04:01:11.028
436	103	Сноровка	2025-04-29 04:01:11.028
437	103	ДВ	2025-04-29 04:01:11.028
438	104	Двурук	2025-04-29 04:01:11.028
439	104	Крит	2025-04-29 04:01:11.028
440	104	Сноровка	2025-04-29 04:01:11.028
441	105	Двурук	2025-04-29 04:01:11.028
442	105	Крит	2025-04-29 04:01:11.028
443	105	Сноровка	2025-04-29 04:01:11.028
444	106	Двурук	2025-04-29 04:01:11.028
445	106	Сноровка	2025-04-29 04:01:11.028
446	106	ДВ	2025-04-29 04:01:11.028
447	107	Двурук	2025-04-29 04:01:11.028
448	107	Крит	2025-04-29 04:01:11.028
449	107	Сноровка	2025-04-29 04:01:11.028
450	108	Сноровка	2025-04-29 04:01:11.028
451	109	Двурук	2025-04-29 04:01:11.028
452	109	Сноровка	2025-04-29 04:01:11.028
453	110	Двурук	2025-04-29 04:01:11.028
454	110	Сноровка	2025-04-29 04:01:11.028
455	111	Двурук	2025-04-29 04:01:11.028
456	111	Сноровка	2025-04-29 04:01:11.028
457	112	Двурук	2025-04-29 04:01:11.028
458	112	Крит	2025-04-29 04:01:11.028
459	112	Сноровка	2025-04-29 04:01:11.028
460	113	Сноровка	2025-04-29 04:01:11.028
461	114	Сноровка	2025-04-29 04:01:11.028
462	115	Сноровка	2025-04-29 04:01:11.028
463	116	Каст	2025-04-29 04:01:11.028
464	117	Каст	2025-04-29 04:01:11.028
465	118	Крит	2025-04-29 04:01:11.028
466	118	Каст	2025-04-29 04:01:11.028
467	118	ДВ	2025-04-29 04:01:11.028
468	119	Каст	2025-04-29 04:01:11.028
469	120	Каст	2025-04-29 04:01:11.028
470	121	Каст	2025-04-29 04:01:11.028
471	122	Каст	2025-04-29 04:01:11.028
472	123	Каст	2025-04-29 04:01:11.028
473	124	Каст	2025-04-29 04:01:11.028
474	124	ДВ	2025-04-29 04:01:11.028
475	125	Каст	2025-04-29 04:01:11.028
476	126	Каст	2025-04-29 04:01:11.028
477	127	Каст	2025-04-29 04:01:11.028
478	128	Каст	2025-04-29 04:01:11.028
479	129	Каст	2025-04-29 04:01:11.028
480	130	Каст	2025-04-29 04:01:11.028
481	131	Каст	2025-04-29 04:01:11.028
482	132	Каст	2025-04-29 04:01:11.028
483	133	Двурук	2025-04-29 04:01:11.028
484	133	Крит	2025-04-29 04:01:11.028
485	133	Каст	2025-04-29 04:01:11.028
486	134	Каст	2025-04-29 04:01:11.028
487	135	Каст	2025-04-29 04:01:11.028
488	136	Каст	2025-04-29 04:01:11.028
489	136	ДВ	2025-04-29 04:01:11.028
490	137	Каст	2025-04-29 04:01:11.028
491	138	Каст	2025-04-29 04:01:11.028
492	139	Каст	2025-04-29 04:01:11.028
496	94	Сноровка	2025-05-06 17:10:01.122
498	94	ДВ	2025-05-06 17:10:02.996
523	1	Администратор	2025-05-07 12:12:22.032
\.


--
-- TOC entry 4018 (class 0 OID 0)
-- Dependencies: 237
-- Name: Expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Expense_id_seq"', 3, true);


--
-- TOC entry 4019 (class 0 OID 0)
-- Dependencies: 239
-- Name: GuildFunds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GuildFunds_id_seq"', 58, true);


--
-- TOC entry 4020 (class 0 OID 0)
-- Dependencies: 247
-- Name: News_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."News_id_seq"', 3, true);


--
-- TOC entry 4021 (class 0 OID 0)
-- Dependencies: 241
-- Name: Salary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Salary_id_seq"', 2289, true);


--
-- TOC entry 4022 (class 0 OID 0)
-- Dependencies: 227
-- Name: boss_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.boss_id_seq', 18, true);


--
-- TOC entry 4023 (class 0 OID 0)
-- Dependencies: 235
-- Name: givenawayloot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.givenawayloot_id_seq', 9, true);


--
-- TOC entry 4024 (class 0 OID 0)
-- Dependencies: 231
-- Name: item_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_type_id_seq', 70, true);


--
-- TOC entry 4025 (class 0 OID 0)
-- Dependencies: 245
-- Name: link_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.link_token_id_seq', 43, true);


--
-- TOC entry 4026 (class 0 OID 0)
-- Dependencies: 230
-- Name: loot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loot_id_seq', 12, true);


--
-- TOC entry 4027 (class 0 OID 0)
-- Dependencies: 233
-- Name: loot_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loot_queue_id_seq', 36, true);


--
-- TOC entry 4028 (class 0 OID 0)
-- Dependencies: 225
-- Name: raid_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raid_attendance_id_seq', 186, true);


--
-- TOC entry 4029 (class 0 OID 0)
-- Dependencies: 226
-- Name: raid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raid_id_seq', 40, true);


--
-- TOC entry 4030 (class 0 OID 0)
-- Dependencies: 221
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 218, true);


--
-- TOC entry 4031 (class 0 OID 0)
-- Dependencies: 224
-- Name: user_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_inventory_id_seq', 1157, true);


--
-- TOC entry 4032 (class 0 OID 0)
-- Dependencies: 243
-- Name: user_salary_bonus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_salary_bonus_id_seq', 3, true);


--
-- TOC entry 4033 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tags_id_seq', 525, true);


--
-- TOC entry 3795 (class 2606 OID 16888)
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- TOC entry 3797 (class 2606 OID 16898)
-- Name: GuildFunds GuildFunds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuildFunds"
    ADD CONSTRAINT "GuildFunds_pkey" PRIMARY KEY (id);


--
-- TOC entry 3807 (class 2606 OID 17016)
-- Name: News News_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_pkey" PRIMARY KEY (id);


--
-- TOC entry 3799 (class 2606 OID 16905)
-- Name: Salary Salary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salary"
    ADD CONSTRAINT "Salary_pkey" PRIMARY KEY (id);


--
-- TOC entry 3782 (class 2606 OID 16779)
-- Name: boss boss_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss
    ADD CONSTRAINT boss_pkey PRIMARY KEY (id);


--
-- TOC entry 3792 (class 2606 OID 16866)
-- Name: givenawayloot givenawayloot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.givenawayloot
    ADD CONSTRAINT givenawayloot_pkey PRIMARY KEY (id);


--
-- TOC entry 3786 (class 2606 OID 16810)
-- Name: item_type item_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_type
    ADD CONSTRAINT item_type_name_key UNIQUE (name);


--
-- TOC entry 3788 (class 2606 OID 16808)
-- Name: item_type item_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_type
    ADD CONSTRAINT item_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3803 (class 2606 OID 16955)
-- Name: link_token link_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_token
    ADD CONSTRAINT link_token_pkey PRIMARY KEY (id);


--
-- TOC entry 3805 (class 2606 OID 16957)
-- Name: link_token link_token_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_token
    ADD CONSTRAINT link_token_token_key UNIQUE (token);


--
-- TOC entry 3776 (class 2606 OID 16629)
-- Name: loot loot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loot
    ADD CONSTRAINT loot_pkey PRIMARY KEY (id);


--
-- TOC entry 3790 (class 2606 OID 16830)
-- Name: loot_queue loot_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loot_queue
    ADD CONSTRAINT loot_queue_pkey PRIMARY KEY (id);


--
-- TOC entry 3774 (class 2606 OID 16622)
-- Name: raid_attendance raid_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raid_attendance
    ADD CONSTRAINT raid_attendance_pkey PRIMARY KEY (id);


--
-- TOC entry 3784 (class 2606 OID 16787)
-- Name: raid_boss raid_boss_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raid_boss
    ADD CONSTRAINT raid_boss_pkey PRIMARY KEY (raid_id, boss_id);


--
-- TOC entry 3772 (class 2606 OID 16617)
-- Name: raid raid_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raid
    ADD CONSTRAINT raid_pkey PRIMARY KEY (id);


--
-- TOC entry 3770 (class 2606 OID 16610)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 3778 (class 2606 OID 16634)
-- Name: tasks_user tasks_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks_user
    ADD CONSTRAINT tasks_user_pkey PRIMARY KEY (tasks_user_id, user_id);


--
-- TOC entry 3762 (class 2606 OID 16943)
-- Name: user user_googleId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_googleId_key" UNIQUE (google_id);


--
-- TOC entry 3768 (class 2606 OID 16603)
-- Name: user_inventory user_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_inventory
    ADD CONSTRAINT user_inventory_pkey PRIMARY KEY (id);


--
-- TOC entry 3764 (class 2606 OID 16596)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3801 (class 2606 OID 16922)
-- Name: user_salary_bonus user_salary_bonus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_salary_bonus
    ADD CONSTRAINT user_salary_bonus_pkey PRIMARY KEY (id);


--
-- TOC entry 3780 (class 2606 OID 16647)
-- Name: user_tags user_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tags
    ADD CONSTRAINT user_tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3766 (class 2606 OID 16945)
-- Name: user user_vkId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_vkId_key" UNIQUE (vk_id);


--
-- TOC entry 3793 (class 1259 OID 16874)
-- Name: user_loot_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_loot_unique ON public.givenawayloot USING btree (user_id, name);


--
-- TOC entry 3822 (class 2606 OID 16906)
-- Name: Salary Salary_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salary"
    ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3812 (class 2606 OID 16811)
-- Name: loot fk_item_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loot
    ADD CONSTRAINT fk_item_type FOREIGN KEY (item_type_id) REFERENCES public.item_type(id);


--
-- TOC entry 3813 (class 2606 OID 16818)
-- Name: loot fk_sold_to_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loot
    ADD CONSTRAINT fk_sold_to_user FOREIGN KEY (sold_to_user_id) REFERENCES public."user"(id);


--
-- TOC entry 3821 (class 2606 OID 16867)
-- Name: givenawayloot givenawayloot_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.givenawayloot
    ADD CONSTRAINT givenawayloot_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3824 (class 2606 OID 16958)
-- Name: link_token link_token_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_token
    ADD CONSTRAINT "link_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3819 (class 2606 OID 16831)
-- Name: loot_queue loot_queue_item_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loot_queue
    ADD CONSTRAINT loot_queue_item_type_id_fkey FOREIGN KEY (item_type_id) REFERENCES public.item_type(id) ON DELETE CASCADE;


--
-- TOC entry 3820 (class 2606 OID 16836)
-- Name: loot_queue loot_queue_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loot_queue
    ADD CONSTRAINT loot_queue_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3810 (class 2606 OID 16721)
-- Name: raid_attendance raid_attendance_raid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raid_attendance
    ADD CONSTRAINT raid_attendance_raid_id_fkey FOREIGN KEY (raid_id) REFERENCES public.raid(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3811 (class 2606 OID 16716)
-- Name: raid_attendance raid_attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raid_attendance
    ADD CONSTRAINT raid_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3817 (class 2606 OID 16793)
-- Name: raid_boss raid_boss_boss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raid_boss
    ADD CONSTRAINT raid_boss_boss_id_fkey FOREIGN KEY (boss_id) REFERENCES public.boss(id) ON DELETE CASCADE;


--
-- TOC entry 3818 (class 2606 OID 16788)
-- Name: raid_boss raid_boss_raid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raid_boss
    ADD CONSTRAINT raid_boss_raid_id_fkey FOREIGN KEY (raid_id) REFERENCES public.raid(id) ON DELETE CASCADE;


--
-- TOC entry 3809 (class 2606 OID 16711)
-- Name: tasks tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3814 (class 2606 OID 16731)
-- Name: tasks_user tasks_user_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks_user
    ADD CONSTRAINT tasks_user_tasks_user_id_fkey FOREIGN KEY (tasks_user_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3815 (class 2606 OID 16736)
-- Name: tasks_user tasks_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks_user
    ADD CONSTRAINT tasks_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3808 (class 2606 OID 16706)
-- Name: user_inventory user_inventory_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_inventory
    ADD CONSTRAINT user_inventory_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3823 (class 2606 OID 16923)
-- Name: user_salary_bonus user_salary_bonus_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_salary_bonus
    ADD CONSTRAINT user_salary_bonus_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3816 (class 2606 OID 16701)
-- Name: user_tags user_tags_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tags
    ADD CONSTRAINT user_tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2025-05-07 19:33:38 EEST

--
-- PostgreSQL database dump complete
--

