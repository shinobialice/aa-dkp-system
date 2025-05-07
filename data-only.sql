--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Homebrew)
-- Dumped by pg_dump version 15.12 (Homebrew)

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
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Expense" VALUES (1, '2025-05-04 00:00:00', 12000, 'Коллекция Боевых', 'Прыгайкиска', '');
INSERT INTO public."Expense" VALUES (2, '2025-05-05 00:00:00', 21000, 'тест', 'какашка', 'пуп');
INSERT INTO public."Expense" VALUES (3, '2025-05-05 00:00:00', 25000, 'на покушать', 'Прыгайкиска', '');


--
-- Data for Name: GuildFunds; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."GuildFunds" VALUES (57, 2025, 6, 0, 0, 0, 0, 0);
INSERT INTO public."GuildFunds" VALUES (58, 2025, 5, 91000, 58000, 33000, 23100, 9900);
INSERT INTO public."GuildFunds" VALUES (37, 2025, 4, 0, 0, 0, 0, 0);


--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."News" VALUES (1, 'пук', 'кака', '2025-05-07 09:53:24.234', '2025-05-07 09:53:24.234', '2025-05-07 09:53:24.234');
INSERT INTO public."News" VALUES (2, 'adasd', 'asdasd', '2025-05-07 09:55:43.766', '2025-05-07 09:55:43.766', '2025-05-07 09:55:43.766');
INSERT INTO public."News" VALUES (3, 'asdasd', 'asdasd', '2025-05-07 09:56:38.084', '2025-05-07 09:56:38.084', '2025-05-07 09:56:38.084');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" VALUES (6, 'Кияяяяяяя', 'Бард', NULL, 19306, NULL, NULL, true, true, '2023-07-12 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (134, 'Sxddsxadsda', 'Хил', NULL, 19169, NULL, 'Ксюша Флегонтова', false, true, '2024-07-26 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (135, 'Totheright', 'Хил', NULL, 1899, NULL, 'Валерия Царюк', false, true, '2024-11-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (136, 'Swiftfox ', 'Хил', 'Тактик', 19392, 180, 'Анна Носова', false, true, '2025-02-17 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (137, 'Kitfox', 'Хил', NULL, 19994, NULL, 'Александр Орлов', false, true, '2025-02-17 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (138, 'Палкаисцелялка ', 'Хил', NULL, 19794, NULL, 'Ирина Гурьева', false, true, '2025-02-20 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (139, 'Палкахилялка ', 'Хил', NULL, 2037, NULL, 'Лера Комарова', false, true, '2025-02-20 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (140, 'Arania', 'Хил', NULL, 18697, NULL, 'Ирина Ярославская', false, true, '2025-03-02 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (2, 'Dimonishx', 'Тактик', 'Маг', 18776, 123123123, 'romanov.egor_835', true, true, '2025-04-17 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (1, 'Прыгайкиска', 'Хил', 'Милик', 21259, NULL, 'alicebut', true, true, '2022-10-07 00:00:00', '2025-04-26 19:31:44', 0, '111616906439099901042', NULL);
INSERT INTO public."user" VALUES (7, 'Куникулёр', 'Бард', NULL, 199, NULL, 'Виктор Дублинский', true, true, '2024-12-14 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (8, 'Goruyshko ', 'Бард', NULL, 17661, NULL, 'Oleg Kolesnik', true, true, '2025-03-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (43, 'Annesh', 'Хил', NULL, 19919, NULL, 'id508145467', true, true, '2018-11-30 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (10, 'Чхоль', 'Лук', NULL, 2075, NULL, 'Иван Игонин', true, true, '2023-05-25 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (11, 'Reykow', 'Лук', 'Тактик', 2113, 15158, 'Рома Косарев', true, true, '2023-06-30 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (12, 'Хромиум', 'Лук', NULL, 22108, NULL, 'Дмитрий Шмелев', true, true, '2023-07-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (13, 'Трезво', 'Лук', NULL, 21487, NULL, 'Валерий Филиппов', true, true, '2024-02-18 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (14, 'Flugegehaimen', 'Лук', NULL, 20891, NULL, 'Дмитрий Метелица', true, false, '2024-09-27 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (16, 'Ленинь', 'Лук', NULL, 19287, NULL, 'Иван Уколов', true, true, '2024-11-04 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (17, 'Таксебелук', 'Лук', NULL, 20067, NULL, 'Андрей Исаев', true, true, '2024-11-05 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (19, 'Sergun', 'Лук', 'Танцор', 20515, 156, 'Сергей Смоленцев', true, false, '2025-04-14 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (20, 'Dumka ', 'Лук', NULL, 20925, NULL, 'Дмитрий Кобзев', true, false, '2025-04-26 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (22, 'Бульониш', 'Маг', NULL, 19502, NULL, 'Гриша Мелешенков', true, true, '2023-11-22 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (26, 'Nadsod', 'Милик', NULL, 19957, NULL, 'Александр Маркин', true, true, '2023-05-14 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (27, 'Avarise', 'Милик', NULL, 20216, NULL, 'Илья Томашевич', true, true, '2023-11-05 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (28, 'Инс', 'Милик', NULL, 192, NULL, 'Антон Богатов', true, true, '2023-12-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (29, 'Kaqp', 'Милик', NULL, 18688, NULL, 'Максим Ерёмин', true, true, '2024-11-23 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (30, 'Pusya', 'Милик', NULL, 19606, NULL, 'Александр Ионов', true, true, '2025-01-18 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (31, 'Damvey ', 'Милик', NULL, 1947, NULL, 'Роман Ершов ', true, true, '2025-03-08 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (32, 'Wvvooow', 'Милик', 'Бард', 18137, 175, 'Александр Двинских', true, true, '2025-03-08 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (33, 'Panibrat ', 'Милик', 'Бард', 183, 175, 'Григорий Панибратец', true, true, '2025-03-10 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (34, 'Xaaaaaaa', 'Милик', 'Бард', 19616, 18126, 'Алексей Овчаренко', true, false, '2025-04-22 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (35, 'Gutallin', 'Тактик', NULL, 17906, NULL, 'Кирилл Вяткин', true, false, '2022-04-16 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (36, 'Кладо', 'Тактик', 'Маг', 1752, 18558, 'Heal Tank', true, true, '2023-09-22 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (37, 'Пельмониш', 'Тактик', NULL, 175, NULL, 'Oxinion Sinister', true, true, '2023-11-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (38, 'Lekontant', 'Тактик', 'Танцор', 21062, NULL, 'Даниил Воронец', true, true, '2025-02-16 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (39, 'Wwooovv', 'Тактик', NULL, 17506, NULL, 'Aibar Mukatai', true, true, '2025-03-08 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (42, 'Ricardothebest', 'Танцор', 'Маг', 19027, 17222, 'Рома Просто---Рома', true, true, '2024-11-04 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (45, 'Садюша', 'Хил', NULL, 21428, NULL, 'Екатерина Ивановна', true, true, '2022-08-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (46, 'Bellatricee', 'Хил', NULL, 201, NULL, 'Anastasiya Akulenko', true, true, '2022-08-18 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (47, 'Kaktus', 'Хил', NULL, 20254, NULL, 'Ирина Плотникова', true, true, '2022-12-12 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (48, 'Yd', 'Хил', NULL, 19536, NULL, 'Katya Petrova', true, true, '2023-01-29 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (50, 'Ляяяяяяя', 'Хил', NULL, 19844, NULL, 'Райан Йонои', true, true, '2023-05-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (51, 'Мдяяяяяяя', 'Хил', 'Бард', 20016, NULL, 'Нюрка Котёнкина', true, true, '2023-05-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (52, 'Мяяяяяяя', 'Хил', NULL, 20814, NULL, 'Юлия Халаева', true, true, '2023-05-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (53, 'Moonflare', 'Хил', 'Танцор', 20132, 20207, 'Евгений Бондарь', true, true, '2023-05-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (54, 'Чхуня', 'Хил', NULL, 20477, NULL, 'Df Kj', true, true, '2023-06-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (55, 'Makemefeel', 'Хил', NULL, 20188, NULL, 'Алиночка Воронина', true, true, '2023-09-17 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (57, 'Loraiine', 'Хил', NULL, 20026, NULL, 'Lena Paymeeva', true, true, '2023-10-25 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (58, 'Alinia', 'Хил', NULL, 20105, NULL, NULL, true, true, '2023-10-30 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (59, 'Gst', 'Хил', NULL, 21103, NULL, 'Алёна Балтаева', true, true, '2023-12-07 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (60, 'Felanza', 'Хил', NULL, 20539, NULL, 'Ксения Ксения', true, true, '2024-10-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (61, 'Inariokami', 'Хил', NULL, 20058, NULL, 'Гульнара Жалялова', true, true, '2024-11-04 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (62, 'Арасака', 'Хил', NULL, 20352, NULL, 'Urinoby Arasaka', true, true, '2024-12-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (63, 'Таэръ', 'Хил', NULL, 20941, NULL, 'Мила Милявская', true, true, '2024-12-14 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (64, 'Невидимаисвободна', 'Хил', NULL, 19209, NULL, 'Оксана Швецова', true, true, '2025-01-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (65, 'Wwooow', 'Хил', NULL, 20242, NULL, 'Маргарита Белова', true, true, '2025-03-08 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (66, 'Alvilda ', 'Хил', NULL, 20696, NULL, 'Галина .', true, false, '2025-04-22 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (67, 'Melanta ', 'Хил', NULL, 21328, NULL, 'Melanta Fox', true, false, '2025-04-22 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (72, 'Luckyboo', 'Лук', NULL, 19451, NULL, 'Артик Мацуткевич', false, true, '2022-11-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (73, 'Какойтокрип', 'Лук', NULL, 19526, NULL, 'Дмитрий Челиков', false, true, '2023-07-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (4, 'Дутахе', 'Бард', 'Тактик', 1738, 1738, 'id508145467', true, true, '2022-08-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (3, 'Guantanamo', 'Бард', 'Маг', 17589, 21048, 'Laska Nemovа', true, true, '2025-04-05 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (23, 'Dragons', 'Милик', 'Лук', 19989, 1232, 'Александр Какичев', true, true, '2021-10-01 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (21, 'Батюшка', 'Маг', 'Милик', 19606, 123123123, 'Никита Филиппов', true, true, '2023-10-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (25, 'Sarinn', 'Милик', '', 20182, 0, NULL, true, true, '2025-04-08 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (44, 'Атпутитеуменялапки', 'Хил', NULL, 21016, NULL, 'Диана Мельникова', true, true, '2021-07-18 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (41, 'Кряяяяяяя', 'Танцор', 'Тактик', 17512, NULL, 'Даня Нилов', true, true, '2023-05-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (56, 'Бобр', 'Хил', 'Тактик', 21152, 18705, 'Иван Завгороднев', true, true, '2023-10-21 00:00:00', '2025-04-26 19:31:44', 0, '106762078539708183440', NULL);
INSERT INTO public."user" VALUES (15, 'Банановыйкот', 'Лук', NULL, 21003, NULL, 'Савелий Овчинников', true, true, '2024-10-05 00:00:00', '2025-04-26 19:31:44', 0, '112698106999373159125', NULL);
INSERT INTO public."user" VALUES (49, 'Вишнёваякиса', 'Хил', NULL, 219, NULL, 'Yanina Melifareast', false, false, '2023-05-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (40, 'Toffiiffee', 'Танцор', 'Хил', 16000, 20078, 'Нюта Спивак', true, true, '2025-04-17 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (9, 'Няяяяяяя', 'Лук', NULL, 21014, NULL, 'Амир Урумбаев', true, true, '2023-05-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (94, 'Nonsummortuus', 'Маг', NULL, 5000, NULL, 'Tristis Fabula', false, false, '2025-04-12 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (24, 'Mn', 'Милик', NULL, 20441, NULL, 'id508145467', true, true, '2022-04-17 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (5, 'Raivent', 'Бард', 'Тактик', 1737, 170, 'Юрий Макаров', true, true, '2022-08-07 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (18, 'Такамура', 'Лук', NULL, 20529, NULL, 'Ярослав Хлебутин', true, true, '2024-12-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (74, 'Хаски', 'Лук', NULL, 19774, NULL, 'Хаски Хахаски', false, true, '2024-04-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (75, 'Sqxdwuokj', 'Лук', NULL, 19607, NULL, 'Никита Фабирже', false, true, '2024-07-26 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (76, 'Amylyubimmyod', 'Лук', NULL, 2018, NULL, NULL, false, true, '2024-10-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (77, 'Профессорсквирта', 'Лук', NULL, 1913, NULL, 'Cheza Tip', false, true, '2024-10-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (78, 'Qtsq', 'Лук', NULL, 20543, NULL, 'Никита Прокопенко', false, true, '2024-11-15 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (79, 'Totheleft', 'Лук', NULL, 18185, NULL, 'Владимир Перегримов', false, false, '2024-11-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (80, 'Offkoss', 'Лук', NULL, 19583, NULL, 'Konstantin Sergiev', false, true, '2025-01-07 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (81, 'Страханет', 'Лук', 'Бард', 20022, 182, 'Александр Беляков', false, true, '2025-01-27 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (82, 'Палкаразрывалка ', 'Лук', NULL, 2111, NULL, 'Сергей Барабохин', false, true, '2025-02-20 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (83, 'Norid', 'Маг', NULL, 16388, NULL, 'Александр Будилин', false, true, '2019-10-16 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (84, 'Fntzer', 'Маг', NULL, 18938, NULL, 'Royal Mukhtarov', false, true, '2022-03-11 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (85, 'Цемангуст', 'Маг', NULL, 180, NULL, 'Виктор Сазонов', false, true, '2022-08-07 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (86, 'Чарующийкрип', 'Маг', 'Бард', 18097, NULL, 'Федор Ященко', false, true, '2023-02-10 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (87, 'Эчпочмаг', 'Маг', NULL, 18879, NULL, 'Lisman Archeage', false, true, '2023-05-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (88, 'Tnds', 'Маг', NULL, 180, NULL, 'Владислав Пименов', false, true, '2023-10-25 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (89, 'Цемедок', 'Маг', NULL, 18604, NULL, 'Влад Юраш', false, true, '2023-10-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (90, 'Отчаянныйкрип', 'Маг', NULL, 180, NULL, 'Евгений Фончиков', false, true, '2023-12-01 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (91, 'Eziooss', 'Маг', NULL, 18788, NULL, 'Алексей Макаров', false, true, '2024-01-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (92, 'Qsx', 'Маг', NULL, 19031, NULL, 'Матвей Гудиев', false, true, '2024-07-25 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (93, 'Typchelovod', 'Маг', NULL, 18447, NULL, 'Константин Червонцев', false, true, '2024-10-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (95, 'Эльстан', 'Милик', NULL, 18302, NULL, 'Роман Пеклов', false, true, '2022-01-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (96, 'Khallddrogo', 'Милик', NULL, 18707, NULL, 'Виталий Киллер', false, true, '2022-06-02 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (97, 'Sallvatrucha', 'Милик', NULL, 18155, NULL, 'Михаил Юрьевич', false, true, '2022-08-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (98, 'Meefis', 'Милик', 'Бард', 17634, 165, 'Mustafa Selimov', false, true, '2022-08-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (99, 'Цежёсткиелапки', 'Милик', NULL, 18163, NULL, 'Валентин Надвиничный', false, true, '2022-08-10 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (100, 'Qybee', 'Милик', NULL, 18471, NULL, 'Vlad Qybee', false, true, '2022-10-07 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (101, 'Killjoy', 'Милик', NULL, 18754, NULL, 'Вячеслав Косторев', false, true, '2023-02-01 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (102, 'Saveyounow', 'Милик', NULL, 18003, NULL, 'Виталий Кирчак', false, true, '2023-04-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (103, 'Gaanss', 'Милик', NULL, 19003, NULL, 'Михаил Терентьев', false, true, '2023-08-27 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (104, 'Япесокинефертити', 'Милик', 'Бард', 18473, 17075, 'Алексей Соколов', false, true, '2023-09-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (105, 'Wearedeeaplysorry', 'Милик', NULL, NULL, NULL, NULL, false, true, '2023-10-05 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (106, 'Snegr', 'Милик', NULL, 1855, NULL, 'Се Рко', false, true, '2024-04-03 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (107, 'Kvjlns', 'Милик', 'Бард', 18896, 18795, 'Vikir Van Baskerville', false, true, '2025-01-01 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (108, 'Sechuronfox', 'Милик', NULL, 19147, NULL, 'Вова Сумкин', false, true, '2025-02-17 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (109, 'Палкарешалка ', 'Милик', NULL, 19393, NULL, NULL, false, true, '2025-02-20 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (110, 'Matillda ', 'Тактик', NULL, 17596, NULL, NULL, false, true, '2023-06-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (111, 'Tyriionlannister', 'Тактик', NULL, 130, NULL, 'Nazgull Wer', false, false, '2025-01-20 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (112, 'Vitguard', 'Тактик', NULL, 17321, NULL, 'Torttuga Best', false, true, '2025-02-20 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (113, 'Балдежныйкрип', 'Танцор', 'Хил', 1774, 19528, 'Никита Хмелев', false, true, '2023-05-25 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (114, 'Pandorkka', 'Хил', NULL, 18819, NULL, 'Наташа Порох', false, true, '2018-10-19 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (115, 'Веривел', 'Хил', NULL, 20122, NULL, 'Елизавета Матушкина', false, true, '2021-11-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (116, 'Alinary', 'Хил', NULL, 19018, NULL, 'Мария Пеклова', false, true, '2022-01-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (117, 'Трусикиибусики', 'Хил', NULL, 19505, NULL, 'Анна Поморцева', false, true, '2022-11-05 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (118, 'Avocaboo', 'Хил', NULL, 19415, NULL, 'Нармина Аббасова', false, true, '2022-11-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (119, 'Bean', 'Хил', NULL, 18401, NULL, 'Иван Морозов', false, true, '2023-01-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (120, 'Сказочныйкрип', 'Хил', 'Танцор', 19757, NULL, 'Лидия Софрина', false, true, '2023-02-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (121, 'Tytutyta', 'Хил', 'Танцор', 1953, NULL, 'Yunni Kim', false, true, '2023-02-07 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (122, 'Yuumi', 'Хил', NULL, 19037, NULL, 'Аня Шебунина', false, true, '2023-06-26 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (123, 'Помятыйхил', 'Хил', NULL, 19429, NULL, 'Алёна Андреева', false, true, '2023-09-06 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (124, 'Polnalyubvi', 'Хил', NULL, 1956, NULL, 'Lana Lavrinyuk', false, true, '2023-10-28 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (125, 'Хихи', 'Хил', NULL, 1967, NULL, 'Алия Алексеевна', false, true, '2023-11-22 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (126, 'Insiik', 'Хил', NULL, 19374, NULL, 'Натали Инес', false, true, '2023-12-07 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (127, 'Snvs', 'Хил', NULL, 19318, NULL, 'Злата Симонова', false, true, '2024-01-09 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (128, 'Valua', 'Хил', NULL, 19672, NULL, 'Ольга Назарова', false, true, '2024-02-04 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (129, 'Бейбисайз ', 'Хил', NULL, 17411, NULL, 'Лена Головач', false, true, '2024-02-18 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (130, 'Deliveryheal ', 'Хил', NULL, 18462, NULL, 'Виктор Гусев', false, false, '2024-02-22 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (131, 'Modnavosh ', 'Хил', NULL, 19535, NULL, 'Вошь Модная', false, false, '2024-02-23 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (132, 'Meomeo', 'Хил', NULL, 19412, NULL, 'Милана Чистякова', false, false, '2024-03-10 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);
INSERT INTO public."user" VALUES (133, 'Xsq', 'Хил', NULL, 194, NULL, 'Ника Гудиева ', false, true, '2024-07-25 00:00:00', '2025-04-26 19:31:44', 0, NULL, NULL);


--
-- Data for Name: Salary; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Salary" VALUES (2230, 2025, 5, 5, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2231, 2025, 5, 6, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2232, 2025, 5, 7, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2233, 2025, 5, 8, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2234, 2025, 5, 9, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2235, 2025, 5, 10, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2236, 2025, 5, 11, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2237, 2025, 5, 12, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2238, 2025, 5, 13, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2239, 2025, 5, 15, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2240, 2025, 5, 16, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2241, 2025, 5, 17, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2242, 2025, 5, 18, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2243, 2025, 5, 22, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2244, 2025, 5, 26, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2245, 2025, 5, 27, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2246, 2025, 5, 28, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2247, 2025, 5, 29, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2248, 2025, 5, 30, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2249, 2025, 5, 31, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2250, 2025, 5, 32, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2251, 2025, 5, 33, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2252, 2025, 5, 36, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2253, 2025, 5, 37, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2254, 2025, 5, 38, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2255, 2025, 5, 39, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2256, 2025, 5, 40, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2257, 2025, 5, 42, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2258, 2025, 5, 45, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2259, 2025, 5, 46, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2260, 2025, 5, 47, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2261, 2025, 5, 48, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2262, 2025, 5, 49, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2263, 2025, 5, 50, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2264, 2025, 5, 51, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2265, 2025, 5, 52, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2266, 2025, 5, 53, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2267, 2025, 5, 54, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2268, 2025, 5, 55, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2269, 2025, 5, 56, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2270, 2025, 5, 57, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2271, 2025, 5, 58, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2272, 2025, 5, 59, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2273, 2025, 5, 60, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2274, 2025, 5, 61, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2275, 2025, 5, 62, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2276, 2025, 5, 63, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2277, 2025, 5, 64, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2278, 2025, 5, 65, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2279, 2025, 5, 4, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2280, 2025, 5, 3, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2281, 2025, 5, 23, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2282, 2025, 5, 21, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2283, 2025, 5, 25, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2284, 2025, 5, 44, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2285, 2025, 5, 41, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2286, 2025, 5, 43, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2287, 2025, 5, 1, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2288, 2025, 5, 24, 4456, 0, 4456);
INSERT INTO public."Salary" VALUES (2289, 2025, 5, 2, 4456, 0, 4456);


--
-- Data for Name: boss; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.boss VALUES (1, 'Кракен', 7, 'Прайм');
INSERT INTO public.boss VALUES (2, 'Ксанатос', 7, 'Прайм');
INSERT INTO public.boss VALUES (3, 'Калидис', 7, 'Прайм');
INSERT INTO public.boss VALUES (4, 'Левиафан', 7, 'Прайм');
INSERT INTO public.boss VALUES (5, 'Дельфиец', 2, 'Прайм');
INSERT INTO public.boss VALUES (6, 'Осада', 3, 'Прайм');
INSERT INTO public.boss VALUES (7, 'Анталлон', 5, 'Прайм');
INSERT INTO public.boss VALUES (8, 'Калеиль', 3, 'Прайм');
INSERT INTO public.boss VALUES (9, 'Корвус', 3, 'Прайм');
INSERT INTO public.boss VALUES (12, 'Марли', 0, 'АГЛ');
INSERT INTO public.boss VALUES (18, 'Гленн и Лорея', 0, 'АГЛ');
INSERT INTO public.boss VALUES (13, 'Марли Прок', 1, 'АГЛ');
INSERT INTO public.boss VALUES (14, 'Кошка', 1, 'АГЛ');
INSERT INTO public.boss VALUES (15, 'Ашьяра Прок', 1, 'АГЛ');
INSERT INTO public.boss VALUES (16, 'Ашьяра', 0, 'АГЛ');
INSERT INTO public.boss VALUES (17, 'Гленн и Лорея Прок', 1, 'АГЛ');
INSERT INTO public.boss VALUES (11, 'Морф', 1, 'АГЛ');


--
-- Data for Name: givenawayloot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.givenawayloot VALUES (1, 43, 'Глайдер охотника на драконов', '2025-05-04', '', '2025-05-04 23:14:14.435793', 'Выдано');
INSERT INTO public.givenawayloot VALUES (3, 5, 'Фрегат', '2025-05-04', '', '2025-05-05 00:08:25.869933', 'Выдано');
INSERT INTO public.givenawayloot VALUES (4, 5, 'Глайдер охотника на драконов', '2025-05-04', '', '2025-05-05 00:11:18.27017', 'Выдано');
INSERT INTO public.givenawayloot VALUES (5, 6, 'Фрегат', '2025-05-04', '', '2025-05-05 00:12:40.120635', 'Выдано');
INSERT INTO public.givenawayloot VALUES (6, 6, 'Глайдер охотника на драконов', '2025-05-04', '', '2025-05-05 00:13:32.529364', 'Выдано');
INSERT INTO public.givenawayloot VALUES (7, 11, 'Анд''хакар, Чернильная тьма', '2025-05-04', '', '2025-05-05 01:02:26.942406', 'В наличии');
INSERT INTO public.givenawayloot VALUES (8, 11, 'Ро''кана, Безумие морей', '2025-05-05', '', '2025-05-05 01:02:37.890546', 'Выдано');
INSERT INTO public.givenawayloot VALUES (9, 5, 'Ро''кана, Безумие морей', '2025-05-05', '', '2025-05-05 05:46:39.802', 'В наличии');


--
-- Data for Name: item_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.item_type VALUES (16, 'Капюшон иферийского советника', 10500);
INSERT INTO public.item_type VALUES (17, 'Мантия иферийского советника', 10500);
INSERT INTO public.item_type VALUES (18, 'Перчатки иферийского советника', 10500);
INSERT INTO public.item_type VALUES (19, 'Поножи иферийского советника', 10500);
INSERT INTO public.item_type VALUES (20, 'Сапоги иферийского советника', 10500);
INSERT INTO public.item_type VALUES (21, 'Средоточие безумия', NULL);
INSERT INTO public.item_type VALUES (22, 'Фрагмент чешуи Ашьяры', NULL);
INSERT INTO public.item_type VALUES (23, 'Ташш, змеиное жало', 7000);
INSERT INTO public.item_type VALUES (24, 'Нирах, искушающий', 7000);
INSERT INTO public.item_type VALUES (25, 'Ишхар, грань измерений', 28000);
INSERT INTO public.item_type VALUES (26, 'Гирра, пробивающий брешь', 28000);
INSERT INTO public.item_type VALUES (27, 'Джераб, слуга смерти', 15000);
INSERT INTO public.item_type VALUES (28, 'Нерхал, бронзовая чешуя', 28000);
INSERT INTO public.item_type VALUES (29, 'Шлем любимца Изы', 31500);
INSERT INTO public.item_type VALUES (30, 'Доспех любимца Изы', 31500);
INSERT INTO public.item_type VALUES (31, 'Перчатки любимца Изы', 31500);
INSERT INTO public.item_type VALUES (32, 'Поножи любимца Изы', 31500);
INSERT INTO public.item_type VALUES (33, 'Сапоги любимца Изы', 31500);
INSERT INTO public.item_type VALUES (34, 'Плащ проклятой души', 35000);
INSERT INTO public.item_type VALUES (35, 'Средоточие ярости', NULL);
INSERT INTO public.item_type VALUES (36, 'Клык Калидиса', 7000);
INSERT INTO public.item_type VALUES (37, 'Лоскут кожи Калидиса', 3500);
INSERT INTO public.item_type VALUES (38, 'Аст''аджал, Длань судьбы', NULL);
INSERT INTO public.item_type VALUES (39, 'Анд''хакар, Чернильная тьма', 28000);
INSERT INTO public.item_type VALUES (40, 'Ро''кана, Безумие морей', 35000);
INSERT INTO public.item_type VALUES (41, 'Глайдер охотника на драконов', 35000);
INSERT INTO public.item_type VALUES (42, 'Эссенция ужаса', 210);
INSERT INTO public.item_type VALUES (43, 'Дра''кордис, Сердце дракона', 49000);
INSERT INTO public.item_type VALUES (44, 'Рави’мар, Драконья ярость', 11500);
INSERT INTO public.item_type VALUES (45, 'Мор’гур, Смерть драконов', 49000);
INSERT INTO public.item_type VALUES (46, 'Вул’данор, Клеймитель драконов', 49000);
INSERT INTO public.item_type VALUES (47, 'Дра''орис, Дыхание дракона', 49000);
INSERT INTO public.item_type VALUES (48, 'Иг''нис, Пламя возмездия', 49000);
INSERT INTO public.item_type VALUES (51, 'Генетический материал дракона', 56000);
INSERT INTO public.item_type VALUES (52, 'Эссенция гнева', 210);
INSERT INTO public.item_type VALUES (53, 'Средоточие сумрака', NULL);
INSERT INTO public.item_type VALUES (54, 'Шлем властелина морей', 7400);
INSERT INTO public.item_type VALUES (55, 'Бригантина властелина морей', 7400);
INSERT INTO public.item_type VALUES (56, 'Перчатки властелина морей', 7400);
INSERT INTO public.item_type VALUES (57, 'Поножи властелина морей', 7400);
INSERT INTO public.item_type VALUES (58, 'Сапоги властелина морей', 7400);
INSERT INTO public.item_type VALUES (59, 'Эссенция кошмара', 350);
INSERT INTO public.item_type VALUES (60, 'Средоточие морей', 35000);
INSERT INTO public.item_type VALUES (61, 'Глаз Левиафана', 700);
INSERT INTO public.item_type VALUES (62, 'Каменное сердце Морфеоса', 3500);
INSERT INTO public.item_type VALUES (64, 'Трофейная эссенция стихий', 500);
INSERT INTO public.item_type VALUES (65, 'Свиток пробудившихся мифов', 35000);
INSERT INTO public.item_type VALUES (66, 'Свиток пробуждения драконоборца', 4000);
INSERT INTO public.item_type VALUES (67, 'Акхиумная сфера', 3225);
INSERT INTO public.item_type VALUES (68, 'Акхиумный раствор', 1.68);
INSERT INTO public.item_type VALUES (69, 'Эссенция звездного акхиума', 28);
INSERT INTO public.item_type VALUES (70, 'Кристалл властелина морей', 2500);
INSERT INTO public.item_type VALUES (14, 'Глайдер «Крылья небесного стража»', 90000);
INSERT INTO public.item_type VALUES (50, 'Глайдер «Рассекатель небес»', 35000);
INSERT INTO public.item_type VALUES (49, 'Драго’ран, Гнев Гартарейн', 50000);
INSERT INTO public.item_type VALUES (15, 'Аметистовая гравировка северной звезды', 21000);
INSERT INTO public.item_type VALUES (63, 'Эссенция ярости', 0.23);


--
-- Data for Name: link_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.link_token VALUES (41, '83b11e09-8ed0-470f-af6f-42b05d9baf5b', 1, '2025-05-07 06:22:55.452', true);
INSERT INTO public.link_token VALUES (42, 'dadf3f70-f32d-407c-865d-3a0a24488c10', 56, '2025-05-07 06:23:18.604', true);
INSERT INTO public.link_token VALUES (43, '8520a868-fd22-479f-aab7-0e6b394f23c4', 15, '2025-05-08 14:34:31.908', true);


--
-- Data for Name: loot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.loot VALUES (3, 'В наличии', NULL, NULL, NULL, '2025-05-05 19:41:05.262', 'Ксанатос', '2025-05-05 00:00:00', 65, NULL, 9, NULL, 3);
INSERT INTO public.loot VALUES (9, 'В наличии', NULL, NULL, NULL, '2025-05-06 01:42:18.785', 'Калидис', '2025-05-06 00:00:00', 36, NULL, 12, NULL, NULL);
INSERT INTO public.loot VALUES (10, 'Продано', '2025-05-06 02:17:59.403', 'Reykow', '', '2025-05-06 02:17:59.404', 'Калидис', '2025-05-05 00:00:00', 36, 11, 8, 91000, NULL);
INSERT INTO public.loot VALUES (8, 'В наличии', NULL, NULL, NULL, '2025-05-05 21:04:30.672', '', '2025-05-05 00:00:00', 36, NULL, 2, NULL, 8);
INSERT INTO public.loot VALUES (11, 'Продано', '2025-05-06 02:17:59.415', 'Reykow', '', '2025-05-06 02:17:59.416', '', '2025-05-05 00:00:00', 36, 11, 5, 91000, NULL);
INSERT INTO public.loot VALUES (12, 'В наличии', NULL, NULL, NULL, '2025-05-07 15:59:48.547', 'АГЛ', '2025-05-07 00:00:00', 63, NULL, 1, NULL, NULL);


--
-- Data for Name: loot_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.loot_queue VALUES (2, 19, 7, '2025-05-04 13:41:10.159', 'ожидание', NULL, 10500, 1, 0);
INSERT INTO public.loot_queue VALUES (28, 63, 22, '2025-05-04 18:05:11.718', 'ожидание', '', NULL, 1, 0);
INSERT INTO public.loot_queue VALUES (30, 16, 26, '2025-05-04 18:05:28.49', 'ожидание', '', NULL, 1, 0);
INSERT INTO public.loot_queue VALUES (33, 18, 29, '2025-05-05 02:34:31.235', 'ожидание', '', NULL, 1, 0);
INSERT INTO public.loot_queue VALUES (34, 63, 6, '2025-05-05 02:34:37.764', 'ожидание', '', NULL, 1, 0);
INSERT INTO public.loot_queue VALUES (35, 64, 2, '2025-05-06 20:50:12.594', 'ожидание', '', NULL, 1, 0);
INSERT INTO public.loot_queue VALUES (36, 64, 1, '2025-05-06 20:50:14.528', 'ожидание', '', NULL, 1, 0);


--
-- Data for Name: raid; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (19, 'Прайм', '2025-04-16 01:36:04', '2025-05-02 01:36:23.235', true, false, 8);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (20, 'АГЛ', '2025-04-16 01:37:07', '2025-05-02 01:37:27.191', true, false, 2);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (21, 'Прайм', '2025-05-14 01:37:29', '2025-05-02 01:37:51.099', false, false, 2);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (22, 'АГЛ', '2025-04-15 01:38:08', '2025-05-02 01:38:24.754', false, true, 3);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (25, 'Прайм', '2025-03-05 00:00:00', '2025-05-02 04:58:46.491', false, true, 3);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (26, 'АГЛ', '2025-03-12 00:00:00', '2025-05-02 04:58:46.491', true, false, 2);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (27, 'Прайм', '2025-03-18 00:00:00', '2025-05-02 04:59:20.134', false, false, 1);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (28, 'АГЛ', '2025-03-28 00:00:00', '2025-05-02 04:59:20.134', false, false, 4);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (29, 'Прайм', '2025-04-01 00:00:00', '2025-05-02 04:59:20.134', true, true, 2);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (30, 'АГЛ', '2025-04-09 00:00:00', '2025-05-02 04:59:20.134', false, true, 3);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (31, 'Прайм', '2025-04-15 00:00:00', '2025-05-02 04:59:20.134', true, false, 4);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (32, 'АГЛ', '2025-04-19 00:00:00', '2025-05-02 04:59:20.134', false, false, 1);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (33, 'Прайм', '2025-04-22 00:00:00', '2025-05-02 04:59:20.134', false, false, 3);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (34, 'АГЛ', '2025-04-28 00:00:00', '2025-05-02 04:59:20.134', true, true, 2);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (35, 'Прайм', '2025-10-23 03:12:16', '2025-05-02 03:12:32.831', false, false, 7);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (36, 'АГЛ', '2025-05-08 14:02:33', '2025-05-07 14:02:45.338', true, false, 1);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (37, 'Прайм', '2025-05-06 14:14:55', '2025-05-07 14:15:24.337', true, false, 8);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (38, 'АГЛ', '2025-05-02 14:19:27', '2025-05-07 14:19:46.304', false, true, 4);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (39, 'Прайм', '2025-05-05 14:19:53', '2025-05-07 14:20:03.708', true, false, 8);
INSERT INTO public.raid OVERRIDING SYSTEM VALUE VALUES (40, 'Прайм', '2025-05-06 14:20:30', '2025-05-07 14:20:41.635', false, false, 7);


--
-- Data for Name: raid_attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (160, 7, 19, '2025-05-02 01:36:23.235');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (161, 11, 19, '2025-05-02 01:36:23.235');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (162, 14, 19, '2025-05-02 01:36:23.235');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (163, 16, 19, '2025-05-02 01:36:23.235');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (164, 18, 19, '2025-05-02 01:36:23.235');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (165, 27, 19, '2025-05-02 01:36:23.235');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (166, 1, 20, '2025-05-02 01:37:27.191');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (167, 2, 20, '2025-05-02 01:37:27.191');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (168, 64, 21, '2025-05-02 01:37:51.099');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (169, 1, 21, '2025-05-02 01:37:51.099');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (170, 1, 22, '2025-05-02 01:38:24.754');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (171, 1, 25, '2025-05-02 04:58:46.491');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (172, 2, 26, '2025-05-02 04:58:46.491');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (173, 1, 27, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (174, 2, 28, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (175, 1, 29, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (176, 2, 30, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (177, 1, 31, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (178, 2, 32, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (179, 1, 33, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (180, 2, 34, '2025-05-02 04:59:20.134');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (181, 1, 35, '2025-05-02 03:12:32.831');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (182, 1, 36, '2025-05-07 14:02:45.339');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (183, 1, 37, '2025-05-07 14:15:24.338');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (184, 1, 38, '2025-05-07 14:19:46.304');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (185, 8, 39, '2025-05-07 14:20:03.708');
INSERT INTO public.raid_attendance OVERRIDING SYSTEM VALUE VALUES (186, 1, 40, '2025-05-07 14:20:41.635');


--
-- Data for Name: raid_boss; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.raid_boss VALUES (19, 3);
INSERT INTO public.raid_boss VALUES (20, 11);
INSERT INTO public.raid_boss VALUES (20, 12);
INSERT INTO public.raid_boss VALUES (21, 5);
INSERT INTO public.raid_boss VALUES (22, 18);
INSERT INTO public.raid_boss VALUES (25, 1);
INSERT INTO public.raid_boss VALUES (25, 2);
INSERT INTO public.raid_boss VALUES (25, 5);
INSERT INTO public.raid_boss VALUES (26, 11);
INSERT INTO public.raid_boss VALUES (26, 13);
INSERT INTO public.raid_boss VALUES (27, 3);
INSERT INTO public.raid_boss VALUES (27, 8);
INSERT INTO public.raid_boss VALUES (27, 9);
INSERT INTO public.raid_boss VALUES (28, 16);
INSERT INTO public.raid_boss VALUES (28, 17);
INSERT INTO public.raid_boss VALUES (29, 6);
INSERT INTO public.raid_boss VALUES (29, 7);
INSERT INTO public.raid_boss VALUES (30, 12);
INSERT INTO public.raid_boss VALUES (30, 15);
INSERT INTO public.raid_boss VALUES (31, 4);
INSERT INTO public.raid_boss VALUES (31, 1);
INSERT INTO public.raid_boss VALUES (31, 2);
INSERT INTO public.raid_boss VALUES (32, 14);
INSERT INTO public.raid_boss VALUES (32, 18);
INSERT INTO public.raid_boss VALUES (33, 5);
INSERT INTO public.raid_boss VALUES (33, 6);
INSERT INTO public.raid_boss VALUES (33, 7);
INSERT INTO public.raid_boss VALUES (34, 11);
INSERT INTO public.raid_boss VALUES (34, 13);
INSERT INTO public.raid_boss VALUES (34, 17);
INSERT INTO public.raid_boss VALUES (35, 2);
INSERT INTO public.raid_boss VALUES (36, 16);
INSERT INTO public.raid_boss VALUES (37, 2);
INSERT INTO public.raid_boss VALUES (38, 14);
INSERT INTO public.raid_boss VALUES (39, 1);
INSERT INTO public.raid_boss VALUES (40, 3);


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tasks VALUES (1, 1, 'Не скамить', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (2, 1, 'ККЛ', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (3, 1, 'Поспать', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (4, 1, 'Дизбанд №3', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (9, 3, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (10, 3, 'Рб Шмот', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (11, 3, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (12, 4, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (13, 4, 'Спек Тактика', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (14, 4, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (15, 5, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (16, 6, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (17, 8, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (18, 9, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (19, 10, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (20, 10, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (21, 10, 'Скачать доту', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (22, 10, 'Удалить доту', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (23, 12, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (24, 13, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (25, 14, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (26, 14, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (27, 15, 'ККЛ', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (28, 15, 'Глайдер "Рассекатель небес"', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (29, 15, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (30, 16, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (31, 17, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (32, 20, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (33, 20, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (34, 20, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (35, 20, 'Второй спек', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (36, 21, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (37, 22, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (38, 22, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (39, 22, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (40, 22, 'Глайдер "Рассекатель небес"', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (41, 23, 'Рб Пушка', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (42, 23, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (43, 23, 'Т2 Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (44, 24, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (45, 24, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (46, 25, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (47, 26, 'Спек тактика', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (48, 26, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (49, 27, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (50, 28, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (51, 29, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (52, 29, 'Спек барда', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (53, 29, 'Т2 Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (54, 31, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (55, 35, 'Спек Стража', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (56, 35, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (57, 36, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (58, 36, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (59, 36, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (60, 39, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (61, 39, 'Булава с Ксанатоса', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (62, 39, 'Щит с Кснатоса/Эфен', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (63, 39, 'Фрига', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (64, 40, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (65, 40, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (66, 40, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (67, 40, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (68, 41, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (69, 42, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (70, 42, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (71, 42, 'Щит с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (72, 42, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (73, 43, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (74, 43, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (75, 43, 'ККЛ', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (76, 43, 'Булава с Ксанатоса', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (77, 44, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (78, 44, 'Фрига', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (79, 44, 'Эфен Щит', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (80, 44, 'Булава с Ксанатоса', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (81, 45, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (82, 45, 'ККЛ', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (83, 45, 'Щит с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (84, 45, 'Найти богатого мужика для Ги', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (85, 46, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (86, 46, 'Т2 Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (87, 47, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (88, 47, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (89, 47, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (90, 48, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (91, 49, 'Т2 Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (5, 2, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.464', '2025-04-28 21:04:11.464');
INSERT INTO public.tasks VALUES (6, 2, 'Глайдер "Рассекатель небесс"', NULL, '2025-04-28 21:04:11.464');
INSERT INTO public.tasks VALUES (7, 2, 'Рб Пушка срочно', '2025-04-28 21:04:11.464', '2025-04-28 21:04:11.464');
INSERT INTO public.tasks VALUES (92, 49, 'Т2 Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (93, 50, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (94, 50, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (95, 51, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (96, 52, 'Спек танцора', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (97, 52, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (98, 53, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (99, 53, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (100, 54, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (101, 54, 'Глайдер "Рассекатель небес"', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (102, 54, 'Эфен Щит/Щит с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (103, 54, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (104, 55, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (105, 56, 'Щит с Ксанатоса', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (106, 56, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (107, 57, 'Булава с Ксанатоса', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (108, 57, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (109, 57, 'Эфен Бижа', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (110, 58, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (111, 58, 'ККЛ', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (112, 58, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (113, 58, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (114, 59, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (115, 60, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (116, 61, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (117, 62, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (118, 63, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (119, 64, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (120, 65, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (121, 65, 'Т2 Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (122, 65, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (123, 67, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (124, 67, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (129, 72, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (130, 78, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (131, 80, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (132, 81, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (133, 82, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (134, 82, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (135, 83, 'Рб Пушка', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (136, 83, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (137, 83, 'Глайдер "Рассекатель небес"', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (138, 84, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (139, 85, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (140, 85, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (141, 95, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (142, 95, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (143, 95, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (144, 95, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (145, 96, 'Фрига', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (146, 97, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (147, 97, 'Фрига', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (148, 98, 'Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (149, 98, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (150, 98, 'Эфен пушка', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (151, 98, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (152, 99, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (153, 99, 'Спек Тактика', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (154, 100, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (155, 101, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (156, 101, 'РБ Пушка', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (157, 101, 'Глайдер "Рассекатель небес"', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (158, 102, 'Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (159, 107, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (160, 108, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (161, 111, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (162, 114, 'Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (163, 114, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (164, 115, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (165, 115, 'Булава с Ксанатоса', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (166, 115, 'Щит с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (167, 116, 'Коллекция глайдеров', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (168, 116, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (169, 116, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (170, 116, 'Булава с Ксанатоса', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (171, 117, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (172, 117, 'Щит с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (173, 118, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (174, 118, 'Глайдер "Рассекатель небес"', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (175, 118, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (176, 120, 'Глайдер "Рассекатель небес"', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (177, 120, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (178, 122, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (179, 122, 'Коллекция боевых питомцев', '2025-04-28 21:04:11.465', '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (180, 122, 'Коллекция глайдеров', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (181, 122, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (182, 126, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (183, 136, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (184, 136, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (185, 138, 'Т2 Коллекция боевых питомцев', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (186, 139, 'ККЛ', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (187, 139, 'Булава с Ксанатоса', NULL, '2025-04-28 21:04:11.465');
INSERT INTO public.tasks VALUES (215, 44, 'ger', NULL, '2025-04-29 23:41:10.762');
INSERT INTO public.tasks VALUES (216, 44, 'asdasd', NULL, '2025-04-29 23:42:53.391');
INSERT INTO public.tasks VALUES (217, 44, 'zxcc', NULL, '2025-04-29 23:42:55.301');
INSERT INTO public.tasks VALUES (218, 2, 'пукпук', NULL, '2025-04-30 12:33:33.035');


--
-- Data for Name: tasks_user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_inventory VALUES (1088, 5, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 15:27:02.293', 1);
INSERT INTO public.user_inventory VALUES (1089, 17, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 15:28:19.414', 1);
INSERT INTO public.user_inventory VALUES (1114, 5, 'Выдано', 'Глайдер охотника на драконов', NULL, '2025-05-04 00:00:00', 1);
INSERT INTO public.user_inventory VALUES (1115, 6, 'Выдано', 'Фрегат', NULL, '2025-05-04 00:00:00', 1);
INSERT INTO public.user_inventory VALUES (1116, 6, 'Выдано', 'Глайдер охотника на драконов', NULL, '2025-05-04 00:00:00', 1);
INSERT INTO public.user_inventory VALUES (1135, 11, 'Выдано', 'Эссенция ярости', NULL, '2025-05-05 05:47:26.853', 10);
INSERT INTO public.user_inventory VALUES (1, 1, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (2, 1, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (3, 1, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (4, 1, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (5, 1, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (6, 1, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (7, 1, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (1090, 22, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 16:42:15.494', 1);
INSERT INTO public.user_inventory VALUES (1091, 6, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 16:42:34.159', 1);
INSERT INTO public.user_inventory VALUES (1092, 16, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 16:42:42.696', 1);
INSERT INTO public.user_inventory VALUES (1117, 11, 'Выдано', 'Ро''кана, Безумие морей', NULL, '2025-05-05 00:00:00', 1);
INSERT INTO public.user_inventory VALUES (1136, 13, 'Выдано', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 17:35:58.167', 11);
INSERT INTO public.user_inventory VALUES (1137, 46, 'Выдано', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 17:36:06.71', 1);
INSERT INTO public.user_inventory VALUES (1138, 5, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 17:37:22.852', 10000);
INSERT INTO public.user_inventory VALUES (1139, 6, 'Выдано', 'Эссенция ярости', NULL, '2025-05-05 17:37:50.966', 45000);
INSERT INTO public.user_inventory VALUES (93, 11, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (1093, 35, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 16:50:43.459', 1);
INSERT INTO public.user_inventory VALUES (1118, 6, 'Куплено', 'Перчатки иферийского советника', NULL, '2025-05-05 02:16:08.244', 1);
INSERT INTO public.user_inventory VALUES (1140, 34, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 17:38:02.484', 15000);
INSERT INTO public.user_inventory VALUES (1141, 19, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 17:38:23.369', 15000);
INSERT INTO public.user_inventory VALUES (1142, 48, 'Выдано', 'Эссенция ярости', NULL, '2025-05-05 17:38:37.155', 4);
INSERT INTO public.user_inventory VALUES (1143, 5, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 17:40:34.674', 40000);
INSERT INTO public.user_inventory VALUES (1144, 10, 'Выдано', 'Эссенция ярости', NULL, '2025-05-05 17:41:32.288', 20000);
INSERT INTO public.user_inventory VALUES (1145, 7, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 17:42:41.2', 15000);
INSERT INTO public.user_inventory VALUES (1094, 2, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:15:31.207', 1);
INSERT INTO public.user_inventory VALUES (1095, 33, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:19:49.159', 1);
INSERT INTO public.user_inventory VALUES (1119, 1, 'Куплено', 'Аметистовая гравировка северной звезды', NULL, '2025-05-05 03:36:59.57', 1);
INSERT INTO public.user_inventory VALUES (1146, 5, 'Куплено', 'Аметистовая гравировка северной звезды', NULL, '2025-05-05 17:48:22.817', 40000);
INSERT INTO public.user_inventory VALUES (1147, 7, 'Выдано', 'Аметистовая гравировка северной звезды', NULL, '2025-05-05 17:48:31.132', 20000);
INSERT INTO public.user_inventory VALUES (1148, 15, 'Куплено', 'Аметистовая гравировка северной звезды', NULL, '2025-05-05 17:48:44.291', 15000);
INSERT INTO public.user_inventory VALUES (274, 36, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (275, 36, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (276, 36, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (277, 36, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (278, 37, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (279, 37, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (280, 37, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (281, 37, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (1096, 6, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:21:48.11', 1);
INSERT INTO public.user_inventory VALUES (1097, 38, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:22:10.428', 1);
INSERT INTO public.user_inventory VALUES (1098, 58, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:25:49.013', 1);
INSERT INTO public.user_inventory VALUES (1120, 1, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 04:04:29.499', 1);
INSERT INTO public.user_inventory VALUES (1149, 11, 'Куплено', 'Свиток пробудившихся мифов', NULL, '2025-05-05 19:41:26.872', 1);
INSERT INTO public.user_inventory VALUES (1150, 11, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 19:42:10.209', 1);
INSERT INTO public.user_inventory VALUES (1099, 52, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:28:40.96', 800);
INSERT INTO public.user_inventory VALUES (1100, 45, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:29:31.542', 7000);
INSERT INTO public.user_inventory VALUES (1101, 37, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:30:51.514', 900);
INSERT INTO public.user_inventory VALUES (1121, 1, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 04:11:48.722', 100);
INSERT INTO public.user_inventory VALUES (1122, 1, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 04:12:15.143', 20);
INSERT INTO public.user_inventory VALUES (1151, 22, 'Куплено', 'Клык Калидиса', NULL, '2025-05-05 21:03:10.776', 2);
INSERT INTO public.user_inventory VALUES (1152, 28, 'Выдано', 'Свиток пробудившихся мифов', NULL, '2025-05-05 21:03:26.731', 1);
INSERT INTO public.user_inventory VALUES (1102, 67, 'blyat', 'Эссенция ярости', NULL, '2025-05-04 17:36:30.553', 90);
INSERT INTO public.user_inventory VALUES (1103, 1, 'blyat', 'Эссенция ярости', NULL, '2025-05-04 17:37:44.198', 80);
INSERT INTO public.user_inventory VALUES (1104, 24, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:38:18.906', 130);
INSERT INTO public.user_inventory VALUES (1123, 1, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 04:22:49.073', 1);
INSERT INTO public.user_inventory VALUES (1105, 30, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 17:44:55.429', 7000);
INSERT INTO public.user_inventory VALUES (1106, 30, 'Лут', 'Поножи любимца Изы', NULL, '2025-05-04 17:45:07.56', 0);
INSERT INTO public.user_inventory VALUES (1124, 1, 'Куплено', 'Ишхар, грань измерений', NULL, '2025-05-05 04:30:40.531', 1);
INSERT INTO public.user_inventory VALUES (1125, 1, 'Куплено', 'Гирра, пробивающий брешь', NULL, '2025-05-05 04:32:19.475', 1);
INSERT INTO public.user_inventory VALUES (1156, 11, 'Куплено', 'Клык Калидиса', NULL, '2025-05-06 02:17:59.405', 8);
INSERT INTO public.user_inventory VALUES (1157, 11, 'Куплено', 'Клык Калидиса', NULL, '2025-05-06 02:17:59.416', 5);
INSERT INTO public.user_inventory VALUES (636, 88, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (637, 88, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (638, 89, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (1107, 7, 'Лут', 'Аметистовая гравировка северной звезды', NULL, '2025-05-04 17:51:52.653', 0);
INSERT INTO public.user_inventory VALUES (1126, 5, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 04:37:40.799', 1);
INSERT INTO public.user_inventory VALUES (1127, 9, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 04:37:56.394', 1);
INSERT INTO public.user_inventory VALUES (1128, 29, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 04:38:10.414', 1);
INSERT INTO public.user_inventory VALUES (1129, 11, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 04:38:20.574', 12);
INSERT INTO public.user_inventory VALUES (1108, 62, 'Лут', 'Клык Калидиса', NULL, '2025-05-04 18:01:54.977', 0);
INSERT INTO public.user_inventory VALUES (1109, 62, 'Лут', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-04 18:06:22.185', 1);
INSERT INTO public.user_inventory VALUES (1130, 5, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 04:48:08.451', 1);
INSERT INTO public.user_inventory VALUES (1110, 62, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 18:06:44.309', 9000);
INSERT INTO public.user_inventory VALUES (1131, 6, 'Куплено', 'Глайдер «Крылья небесного стража»', NULL, '2025-05-05 04:52:21.199', 1);
INSERT INTO public.user_inventory VALUES (909, 128, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (910, 128, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (911, 128, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (915, 129, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (1111, 43, 'Выдано', 'Глайдер охотника на драконов', NULL, '2025-05-04 00:00:00', 1);
INSERT INTO public.user_inventory VALUES (1132, 10, 'Выдано', 'Дра''кордис, Сердце дракона', NULL, '2025-05-05 05:17:57.857', 1);
INSERT INTO public.user_inventory VALUES (8, 1, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (9, 1, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (1133, 9, 'Выдано', 'Эссенция ярости', NULL, '2025-05-05 05:19:38.554', 100);
INSERT INTO public.user_inventory VALUES (10, 1, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (11, 1, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (12, 1, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (15, 2, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (21, 2, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (24, 3, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (25, 3, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (26, 3, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (27, 3, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (28, 3, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (29, 3, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (30, 3, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (31, 3, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (32, 4, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (33, 4, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (34, 4, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (35, 4, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (36, 4, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (37, 4, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (38, 4, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (39, 4, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (40, 4, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (41, 5, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (42, 5, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (43, 5, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (44, 5, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (45, 5, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (46, 5, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (47, 5, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (48, 6, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (49, 6, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (50, 6, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (51, 6, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (52, 6, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (53, 6, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (54, 6, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (55, 6, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (56, 6, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (57, 7, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (58, 7, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (59, 7, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (60, 7, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (61, 7, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (62, 7, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (63, 8, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (64, 8, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (65, 8, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (66, 8, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (67, 8, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (68, 8, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (69, 9, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (70, 9, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (71, 9, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (72, 9, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (73, 9, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (74, 9, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (75, 9, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (76, 9, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (77, 9, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (78, 9, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (79, 10, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (80, 10, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (81, 10, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (82, 10, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (83, 10, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (84, 10, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (85, 10, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (86, 11, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (87, 11, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (88, 11, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (89, 11, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (90, 11, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (91, 11, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (92, 11, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (94, 11, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (95, 11, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (96, 11, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (97, 12, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (98, 12, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (99, 12, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (100, 12, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (101, 12, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (102, 12, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (103, 12, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (104, 12, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (105, 12, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (106, 12, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (107, 13, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (108, 13, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (109, 13, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (110, 13, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (111, 13, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (112, 13, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (113, 14, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (114, 14, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (115, 14, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (116, 14, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (117, 14, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (118, 14, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (119, 14, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (120, 14, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (121, 15, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (122, 15, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (123, 15, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (124, 15, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (125, 15, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (126, 15, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (127, 15, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (128, 15, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (129, 15, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (130, 16, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (131, 16, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (132, 16, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (133, 16, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (134, 16, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (135, 16, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (136, 16, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (137, 16, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (138, 17, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (139, 17, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (140, 17, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (141, 17, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (142, 17, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (143, 17, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (144, 17, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (145, 17, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (146, 19, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (147, 19, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (148, 19, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (149, 19, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (150, 19, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (151, 19, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (152, 19, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (153, 19, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (154, 20, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (155, 20, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (156, 20, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (157, 20, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (158, 20, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (159, 20, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (160, 20, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (161, 20, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (162, 20, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (163, 21, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (164, 21, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (165, 21, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (166, 21, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (688, 96, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (168, 21, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (169, 21, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (170, 22, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (171, 22, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (172, 22, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (173, 22, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (174, 22, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (175, 22, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (176, 22, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (177, 23, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (178, 23, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (179, 23, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (180, 23, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (181, 23, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (182, 23, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (183, 23, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (184, 23, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (185, 24, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (186, 24, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (187, 24, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (188, 24, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (189, 24, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (190, 24, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (191, 24, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (192, 24, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (193, 24, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (194, 24, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (195, 25, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (196, 25, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (197, 25, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (198, 25, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (199, 26, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (200, 26, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (201, 26, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (202, 26, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (203, 26, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (204, 26, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (205, 26, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (206, 26, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (207, 26, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (208, 27, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (209, 27, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (210, 27, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (211, 27, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (212, 27, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (213, 27, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (214, 27, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (215, 28, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (216, 28, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (217, 28, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (218, 28, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (219, 28, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (220, 28, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (221, 29, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (222, 29, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (223, 29, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (224, 29, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (225, 29, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (226, 29, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (227, 29, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (228, 30, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (229, 30, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (230, 30, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (231, 30, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (232, 30, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (233, 31, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (234, 31, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (235, 31, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (236, 31, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (237, 32, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (238, 32, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (239, 32, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (240, 32, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (241, 32, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (242, 32, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (243, 33, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (244, 33, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (245, 33, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (246, 33, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (247, 33, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (248, 33, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (249, 33, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (250, 33, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (251, 34, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (252, 34, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (253, 34, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (254, 34, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (255, 34, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (256, 34, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (257, 35, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (258, 35, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (259, 35, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (260, 35, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (261, 35, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (262, 35, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (263, 35, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (264, 35, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (265, 35, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (266, 35, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (267, 35, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (268, 35, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (269, 36, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (270, 36, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (271, 36, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (272, 36, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (273, 36, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (282, 37, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (283, 37, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (284, 37, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (285, 37, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (286, 37, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (287, 37, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (288, 37, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (289, 38, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (290, 38, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (291, 38, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (292, 38, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (293, 38, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (294, 38, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (295, 38, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (296, 38, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (297, 39, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (298, 39, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (299, 39, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (300, 39, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (301, 39, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (302, 39, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (303, 39, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (304, 39, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (305, 40, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (306, 40, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (307, 40, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (308, 41, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (309, 41, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (310, 41, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (311, 41, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (312, 41, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (313, 41, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (314, 41, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (315, 42, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (316, 42, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (317, 42, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (318, 42, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (319, 42, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (320, 42, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (321, 43, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (322, 43, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (323, 43, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (324, 43, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (326, 43, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (327, 43, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (328, 43, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (329, 43, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (337, 44, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (340, 45, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (341, 45, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (342, 45, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (343, 45, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (344, 45, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (345, 45, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (346, 45, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (347, 46, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (348, 46, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (349, 46, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (350, 46, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (351, 46, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (772, 109, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (352, 46, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (353, 46, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (354, 46, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (355, 46, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (356, 46, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (357, 47, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (358, 47, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (359, 47, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (360, 47, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (361, 47, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (362, 47, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (363, 47, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (364, 47, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (333, 44, 'Техника', 'Бафалка', '5', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (365, 48, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (366, 48, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (367, 48, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (368, 48, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (369, 48, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (370, 48, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (371, 48, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (372, 48, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (373, 48, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (374, 49, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (375, 49, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (376, 49, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (377, 49, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (378, 49, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (379, 49, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (380, 49, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (381, 49, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (382, 49, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (383, 50, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (384, 50, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (385, 50, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (386, 50, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (387, 50, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (388, 50, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (389, 50, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (390, 50, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (391, 50, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (392, 51, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (393, 51, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (394, 51, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (395, 51, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (396, 51, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (397, 51, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (398, 51, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (399, 51, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (400, 52, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (401, 52, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (402, 52, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (403, 52, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (404, 52, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (405, 53, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (406, 53, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (407, 53, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (408, 53, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (409, 53, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (410, 53, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (411, 53, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (412, 53, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (413, 53, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (414, 54, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (415, 54, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (416, 54, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (417, 54, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (418, 54, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (419, 54, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (420, 55, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (421, 55, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (422, 55, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (423, 55, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (424, 55, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (425, 55, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (426, 55, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (427, 55, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (428, 56, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (429, 56, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (430, 56, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (431, 56, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (432, 56, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (433, 56, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (434, 56, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (435, 56, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (436, 56, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (437, 56, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (438, 56, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (439, 57, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (440, 57, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (441, 57, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (442, 57, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (443, 57, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (444, 57, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (445, 57, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (446, 57, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (447, 57, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (448, 58, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (449, 58, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (450, 58, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (451, 58, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (452, 58, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (453, 58, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (454, 58, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (455, 58, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (456, 58, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (457, 59, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (458, 59, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (459, 59, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (460, 59, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (461, 59, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (462, 59, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (463, 59, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (464, 59, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (465, 59, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (466, 59, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (467, 60, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (468, 60, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (469, 60, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (470, 60, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (471, 61, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (472, 61, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (473, 61, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (474, 61, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (475, 61, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (476, 61, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (477, 61, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (478, 61, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (479, 62, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (480, 62, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (481, 62, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (482, 62, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (483, 62, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (484, 62, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (485, 62, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (486, 63, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (487, 63, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (488, 63, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (489, 63, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (490, 63, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (491, 63, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (492, 63, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (493, 63, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (494, 63, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (495, 63, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (496, 64, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (497, 64, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (498, 64, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (499, 64, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (500, 64, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (501, 64, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (502, 65, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (503, 65, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (504, 65, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (505, 65, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (506, 65, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (507, 65, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (508, 66, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (509, 66, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (510, 66, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (511, 66, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (512, 66, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (513, 66, 'Глайдеры', 'Коллеционный глайдер т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (514, 66, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (515, 66, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (773, 109, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (516, 66, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (517, 67, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (518, 67, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (519, 67, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (520, 67, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (521, 67, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (522, 67, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (523, 67, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (524, 67, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (525, 72, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (526, 72, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (527, 72, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (528, 72, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (529, 72, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (530, 73, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (531, 73, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (532, 73, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (533, 73, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (534, 73, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (535, 74, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (536, 74, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (537, 74, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (538, 75, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (539, 75, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (540, 75, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (541, 75, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (542, 75, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (543, 75, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (544, 75, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (545, 75, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (546, 75, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (547, 75, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (548, 76, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (549, 76, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (550, 76, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (551, 76, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (552, 76, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (553, 76, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (554, 76, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (555, 77, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (556, 77, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (557, 77, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (558, 77, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (559, 77, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (560, 78, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (561, 78, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (562, 78, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (563, 78, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (564, 78, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (565, 78, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (566, 78, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (567, 78, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (568, 79, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (569, 79, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (570, 79, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (571, 79, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (572, 79, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (573, 79, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (574, 80, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (575, 80, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (576, 80, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (577, 80, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (578, 80, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (579, 81, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (580, 81, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (581, 81, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (582, 81, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (583, 81, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (584, 81, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (585, 81, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (586, 82, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (587, 82, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (588, 82, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (589, 82, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (590, 82, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (591, 82, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (592, 82, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (593, 82, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (594, 83, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (595, 83, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (596, 83, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (597, 83, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (598, 83, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (599, 84, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (600, 84, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (601, 84, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (602, 84, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (603, 84, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (604, 84, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (605, 84, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (606, 84, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (607, 84, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (608, 84, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (609, 85, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (610, 85, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (611, 85, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (612, 85, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (613, 85, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (614, 85, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (615, 85, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (616, 86, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (617, 86, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (618, 86, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (619, 86, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (620, 86, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (621, 86, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (622, 86, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (623, 86, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (624, 86, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (625, 87, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (626, 87, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (627, 87, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (628, 87, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (629, 87, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (630, 87, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (631, 87, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (632, 88, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (633, 88, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (634, 88, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (635, 88, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (639, 89, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (640, 89, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (641, 89, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (642, 89, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (643, 89, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (644, 89, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (645, 90, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (646, 90, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (647, 90, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (648, 90, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (649, 90, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (650, 90, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (651, 91, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (652, 91, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (653, 91, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (654, 91, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (655, 91, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (656, 91, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (657, 91, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (658, 92, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (659, 92, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (660, 92, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (661, 92, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (662, 92, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (663, 92, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (664, 92, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (665, 93, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (666, 93, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (667, 93, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (668, 93, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (669, 94, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (670, 94, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (673, 94, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (674, 94, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (676, 95, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (677, 95, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (678, 95, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (679, 95, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (680, 95, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (681, 95, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (682, 95, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (683, 95, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (684, 95, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (685, 95, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (686, 96, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (687, 96, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (689, 96, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (690, 96, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (691, 96, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (692, 97, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (693, 97, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (694, 97, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (695, 97, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (696, 97, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (697, 97, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (698, 98, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (699, 98, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (700, 98, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (701, 98, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (702, 98, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (703, 98, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (704, 98, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (705, 99, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (706, 99, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (707, 99, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (708, 99, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (709, 99, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (710, 99, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (711, 99, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (712, 99, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (713, 99, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (714, 100, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (715, 100, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (716, 100, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (717, 100, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (718, 100, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (719, 100, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (720, 100, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (721, 101, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (722, 101, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (723, 101, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (724, 101, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (725, 101, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (726, 101, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (727, 101, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (728, 101, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (729, 101, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (730, 102, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (731, 102, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (732, 102, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (733, 103, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (734, 103, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (735, 103, 'Техника', 'Бафалка', '5', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (736, 103, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (737, 103, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (738, 103, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (739, 103, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (740, 104, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (741, 104, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (742, 104, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (743, 104, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (744, 104, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (745, 104, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (746, 104, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (747, 104, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (748, 105, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (749, 105, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (750, 105, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (751, 105, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (752, 105, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (753, 105, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (754, 106, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (755, 106, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (756, 106, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (757, 106, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (758, 106, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (759, 107, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (760, 107, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (761, 107, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (762, 107, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (763, 107, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (764, 107, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (765, 108, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (766, 108, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (767, 108, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (768, 108, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (769, 108, 'Петы', 'Коллекционный фамильяр т2', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (770, 109, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (771, 109, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (774, 109, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (775, 109, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (776, 110, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (777, 110, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (778, 110, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (779, 110, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (780, 111, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (781, 111, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (782, 111, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (783, 111, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (784, 111, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (785, 111, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (786, 111, 'Глайдеры', 'Авиара', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (787, 111, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (788, 112, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (789, 112, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (790, 112, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (791, 112, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (792, 112, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (793, 112, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (794, 112, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (795, 113, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (796, 113, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (797, 113, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (798, 113, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (799, 113, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (800, 113, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (801, 113, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (802, 113, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (803, 113, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (804, 114, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (805, 114, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (806, 114, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (807, 114, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (808, 114, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (809, 114, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (810, 115, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (811, 115, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (812, 115, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (813, 115, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (814, 115, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (815, 115, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (816, 115, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (817, 115, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (818, 116, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (819, 116, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (820, 116, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (821, 116, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (822, 116, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (823, 116, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (824, 117, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (825, 117, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (826, 117, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (827, 117, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (828, 117, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (829, 117, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (830, 117, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (831, 117, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (832, 117, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (833, 118, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (834, 118, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (835, 118, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (836, 118, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (837, 119, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (838, 119, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (839, 119, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (840, 119, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (841, 119, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (842, 119, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (843, 119, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (844, 119, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (845, 120, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (846, 120, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (847, 120, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (848, 120, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (849, 120, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (850, 120, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (851, 120, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (852, 120, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (853, 120, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (854, 121, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (855, 121, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (856, 121, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (857, 121, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (858, 121, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (859, 121, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (860, 121, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (861, 121, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (862, 121, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (863, 122, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (864, 122, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (865, 122, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (866, 122, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (867, 123, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (868, 123, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (869, 123, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (870, 123, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (871, 123, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (872, 123, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (873, 123, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (874, 123, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (875, 123, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (876, 123, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (877, 124, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (878, 124, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (879, 124, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (880, 124, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (881, 124, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (882, 124, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (883, 124, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (884, 124, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (885, 124, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (886, 125, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (887, 125, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (888, 125, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (889, 125, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (890, 125, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (891, 125, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (892, 125, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (893, 126, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (894, 126, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (895, 126, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (896, 126, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (897, 126, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (898, 126, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (899, 126, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (900, 126, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (901, 127, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (902, 127, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (903, 127, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (904, 127, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (905, 127, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (906, 127, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (907, 128, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (908, 128, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (912, 128, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (913, 128, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (914, 128, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (916, 129, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (917, 129, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (918, 129, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (919, 129, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (920, 129, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (921, 130, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (922, 130, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (923, 130, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (924, 130, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (925, 130, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (926, 130, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (927, 130, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (928, 131, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (929, 131, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (930, 131, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (931, 131, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (932, 131, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (933, 131, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (934, 132, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (935, 132, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (936, 132, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (937, 132, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (938, 132, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (939, 132, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (940, 132, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (941, 133, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (942, 133, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (943, 133, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (944, 133, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (945, 133, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (946, 133, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (947, 133, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (948, 133, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (949, 133, 'Петы', 'Дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (950, 134, 'Техника', 'Фрегат', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (951, 134, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (952, 134, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (953, 134, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (954, 134, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (955, 134, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (956, 134, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (957, 134, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (958, 134, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (959, 135, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (960, 135, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (961, 135, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (962, 135, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (963, 136, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (964, 136, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (965, 136, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (966, 136, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (967, 136, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (968, 136, 'Глайдеры', 'Глайдер дракон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (969, 136, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (970, 137, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (971, 137, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (972, 137, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (973, 137, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (974, 137, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (975, 137, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (976, 137, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (977, 138, 'Техника', 'Кобуксон', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (978, 138, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (979, 138, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (980, 138, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (981, 138, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (982, 138, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (983, 138, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (984, 139, 'Техника', 'Танк', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (985, 139, 'Техника', 'Канонёрка', NULL, '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (986, 139, 'Техника', 'Бафалка', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (987, 139, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (988, 139, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (989, 140, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (990, 140, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (994, 2, 'Техника', 'Кобуксон', NULL, '2025-04-29 13:30:45.153', 1);
INSERT INTO public.user_inventory VALUES (1002, 2, 'Техника', 'Канонёрка', NULL, '2025-04-29 13:34:10.208', 1);
INSERT INTO public.user_inventory VALUES (1011, 2, 'Глайдеры', 'Коллеционный глайдер', '4', '2025-04-29 14:06:23.264', 1);
INSERT INTO public.user_inventory VALUES (1005, 2, 'Глайдеры', 'Авиара', NULL, '2025-04-29 13:38:41.854', 1);
INSERT INTO public.user_inventory VALUES (1012, 24, 'Техника', 'Кобуксон', NULL, '2025-04-29 15:36:57.637', 1);
INSERT INTO public.user_inventory VALUES (325, 43, 'Техника', 'Бафалка', '4', '2025-04-26 19:38:37', 1);
INSERT INTO public.user_inventory VALUES (1087, 7, 'Лут', 'Эссенция ярости', NULL, '2025-05-04 15:18:19.802', 1);
INSERT INTO public.user_inventory VALUES (1015, 94, 'Петы', 'Коллекционный фамильяр', '3', '2025-04-29 20:47:59.334', 1);
INSERT INTO public.user_inventory VALUES (1016, 94, 'Глайдеры', 'Коллеционный глайдер', '3', '2025-04-29 20:48:01.33', 1);
INSERT INTO public.user_inventory VALUES (1017, 94, 'Техника', 'Бафалка', '4', '2025-04-29 20:48:14.673', 1);
INSERT INTO public.user_inventory VALUES (1018, 94, 'Техника', 'Бафалка', '4', '2025-04-29 20:48:36.52', 1);
INSERT INTO public.user_inventory VALUES (1021, 44, 'Глайдеры', 'Авиара', NULL, '2025-04-29 21:51:18.192', 1);
INSERT INTO public.user_inventory VALUES (1028, 44, 'Техника', 'Танк', NULL, '2025-04-29 22:14:08.614', 1);
INSERT INTO public.user_inventory VALUES (1034, 44, 'Техника', 'Кобуксон', NULL, '2025-04-29 22:52:47.993', 1);
INSERT INTO public.user_inventory VALUES (1035, 44, 'Техника', 'Канонёрка', NULL, '2025-04-29 22:52:56.798', 1);
INSERT INTO public.user_inventory VALUES (1036, 44, 'Глайдеры', 'Крылья кровавого легиона', NULL, '2025-04-29 22:53:12.794', 1);
INSERT INTO public.user_inventory VALUES (1042, 21, 'Глайдеры', 'Коллеционный глайдер', '4', '2025-04-30 09:38:48.658', 1);
INSERT INTO public.user_inventory VALUES (1067, 2, 'Петы', 'Коллекционный фамильяр', '4', '2025-04-30 10:06:08.712', 1);
INSERT INTO public.user_inventory VALUES (1077, 5, 'Петы', 'Зеленый Дракон', NULL, '2025-04-30 10:12:58.179', 1);
INSERT INTO public.user_inventory VALUES (1082, 2, 'Петы', 'Красный Дракон', NULL, '2025-04-30 10:25:51.546', 1);
INSERT INTO public.user_inventory VALUES (1085, 24, 'Петы', 'Зеленый Дракон', NULL, '2025-05-01 17:49:49.165', 1);
INSERT INTO public.user_inventory VALUES (1086, 2, 'Лут', 'Поножи иферийского советника', NULL, '2025-05-04 13:41:11.689', 1);
INSERT INTO public.user_inventory VALUES (1112, 5, 'Выдано', 'Фрегат', NULL, '2025-05-04 00:00:00', 1);
INSERT INTO public.user_inventory VALUES (1113, 5, 'Выдано', 'Фрегат', NULL, '2025-05-04 00:00:00', 1);
INSERT INTO public.user_inventory VALUES (1134, 5, 'Куплено', 'Эссенция ярости', NULL, '2025-05-05 05:44:55.071', 100);


--
-- Data for Name: user_salary_bonus; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_salary_bonus VALUES (2, 43, 2, 'w', '2025-05-05 05:39:41.096');
INSERT INTO public.user_salary_bonus VALUES (3, 43, 1, 'w', '2025-05-05 05:39:49.615');


--
-- Data for Name: user_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (250, 2, 'Модератор', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (251, 4, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (252, 4, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (253, 5, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (254, 5, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (255, 5, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (256, 6, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (257, 7, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (258, 7, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (259, 7, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (260, 8, 'Деф', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (261, 9, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (262, 10, 'Деф', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (263, 11, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (264, 11, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (265, 12, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (266, 12, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (267, 13, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (268, 13, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (269, 14, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (270, 14, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (271, 15, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (272, 15, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (273, 16, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (274, 16, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (275, 17, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (276, 17, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (277, 17, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (278, 18, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (279, 18, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (280, 19, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (281, 19, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (282, 20, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (283, 20, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (284, 21, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (285, 21, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (286, 22, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (287, 23, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (288, 23, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (289, 23, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (290, 23, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (291, 24, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (292, 24, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (293, 25, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (294, 25, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (295, 26, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (296, 26, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (297, 27, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (298, 27, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (299, 28, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (300, 28, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (301, 29, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (302, 29, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (303, 30, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (304, 30, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (305, 31, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (306, 31, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (307, 32, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (308, 32, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (309, 33, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (310, 33, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (311, 33, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (312, 34, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (313, 35, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (314, 35, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (315, 36, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (316, 36, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (317, 37, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (318, 38, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (319, 38, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (320, 38, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (321, 39, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (322, 40, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (323, 41, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (324, 42, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (325, 42, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (327, 44, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (328, 44, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (329, 44, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (330, 45, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (331, 46, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (332, 46, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (333, 47, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (334, 48, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (335, 48, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (336, 49, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (337, 50, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (338, 50, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (339, 51, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (340, 52, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (341, 52, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (342, 53, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (343, 54, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (344, 55, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (345, 56, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (346, 57, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (347, 58, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (348, 59, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (349, 60, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (350, 61, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (351, 62, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (352, 63, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (353, 64, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (354, 65, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (355, 66, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (356, 67, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (363, 75, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (364, 75, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (365, 75, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (366, 76, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (367, 76, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (368, 77, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (369, 77, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (370, 78, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (371, 78, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (372, 79, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (373, 79, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (374, 80, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (375, 80, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (376, 81, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (377, 81, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (378, 81, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (379, 82, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (380, 82, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (381, 83, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (382, 83, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (383, 84, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (384, 84, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (385, 85, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (386, 85, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (387, 86, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (388, 86, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (389, 86, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (390, 86, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (391, 87, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (392, 87, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (393, 88, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (394, 88, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (395, 89, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (396, 89, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (397, 90, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (398, 90, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (399, 91, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (400, 91, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (401, 91, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (402, 92, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (403, 92, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (404, 92, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (405, 93, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (406, 93, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (411, 95, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (412, 95, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (413, 95, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (414, 96, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (415, 96, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (416, 96, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (417, 97, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (418, 97, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (419, 97, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (420, 98, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (421, 98, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (422, 98, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (423, 99, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (424, 99, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (425, 99, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (426, 100, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (427, 100, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (428, 100, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (429, 101, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (430, 101, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (431, 102, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (432, 102, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (433, 102, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (434, 103, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (435, 103, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (436, 103, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (437, 103, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (438, 104, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (439, 104, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (440, 104, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (441, 105, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (442, 105, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (443, 105, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (444, 106, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (445, 106, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (446, 106, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (447, 107, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (448, 107, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (449, 107, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (450, 108, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (451, 109, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (452, 109, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (453, 110, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (454, 110, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (455, 111, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (456, 111, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (457, 112, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (458, 112, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (459, 112, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (460, 113, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (461, 114, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (462, 115, 'Сноровка', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (463, 116, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (464, 117, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (465, 118, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (466, 118, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (467, 118, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (468, 119, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (469, 120, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (470, 121, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (471, 122, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (472, 123, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (473, 124, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (474, 124, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (475, 125, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (476, 126, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (477, 127, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (478, 128, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (479, 129, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (480, 130, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (481, 131, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (482, 132, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (483, 133, 'Двурук', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (484, 133, 'Крит', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (485, 133, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (486, 134, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (487, 135, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (488, 136, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (489, 136, 'ДВ', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (490, 137, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (491, 138, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (492, 139, 'Каст', '2025-04-29 04:01:11.028');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (496, 94, 'Сноровка', '2025-05-06 17:10:01.122');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (498, 94, 'ДВ', '2025-05-06 17:10:02.996');
INSERT INTO public.user_tags OVERRIDING SYSTEM VALUE VALUES (523, 1, 'Администратор', '2025-05-07 12:12:22.032');


--
-- Name: Expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Expense_id_seq"', 3, true);


--
-- Name: GuildFunds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GuildFunds_id_seq"', 58, true);


--
-- Name: News_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."News_id_seq"', 3, true);


--
-- Name: Salary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Salary_id_seq"', 2289, true);


--
-- Name: boss_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.boss_id_seq', 18, true);


--
-- Name: givenawayloot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.givenawayloot_id_seq', 9, true);


--
-- Name: item_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_type_id_seq', 70, true);


--
-- Name: link_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.link_token_id_seq', 43, true);


--
-- Name: loot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loot_id_seq', 12, true);


--
-- Name: loot_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loot_queue_id_seq', 36, true);


--
-- Name: raid_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raid_attendance_id_seq', 186, true);


--
-- Name: raid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raid_id_seq', 40, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 218, true);


--
-- Name: user_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_inventory_id_seq', 1157, true);


--
-- Name: user_salary_bonus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_salary_bonus_id_seq', 3, true);


--
-- Name: user_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tags_id_seq', 525, true);


--
-- PostgreSQL database dump complete
--

