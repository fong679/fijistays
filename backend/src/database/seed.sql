-- ─────────────────────────────────────────────────────────────
--  FijiStays — Seed Data
--  Realistic Fijian villages, experiences & cultural protocols
-- ─────────────────────────────────────────────────────────────

-- Cultural protocols (inserted first, no FK deps)
INSERT INTO cultural_protocols (id, name, description_en, description_fj, is_mandatory, tourist_must_ack) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001',
   'Sevusevu (Kava Presentation)',
   'Upon entering a village you must present a sevusevu — a gift of dried kava root (yaqona) to the village chief or elder. This is not optional; it is the formal request for permission to enter iTaukei land. Kava can be purchased at any local market for around FJ$10–20.',
   'Ni sa yadra. Ko ira na tamata vakaitaukei era gadreva me vakarau tiko na sevusevu.',
   true, true),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   'Dress code — shoulders & knees covered',
   'Village visits require modest dress. Shoulders must be covered and legs covered to at least the knee for both men and women. Swimwear, singlets, and short shorts are not appropriate in village settings. A sulu (wraparound skirt) is the easiest solution and can be purchased for FJ$5–10.',
   'Segai na isulu vakaviti — e dodonu me sega ni vakaraitaka na yabaki.',
   true, true),

  ('a1b2c3d4-0003-0003-0003-000000000003',
   'Remove hats upon entering a home or meeting area',
   'Wearing a hat inside a Fijian bure (traditional house) or in the presence of a chief is considered highly disrespectful. Remove headwear before entering any indoor village space.',
   'Kauta yani na hats ni o iko ena loma ni vale.',
   true, true),

  ('a1b2c3d4-0004-0004-0004-000000000004',
   'Photography consent',
   'Always ask permission before photographing village residents, especially elders, ceremonies, and sacred spaces. Some villages prohibit photography during ceremonies. Your host will guide you.',
   'Taroga tiko na nodratou lomana ni ko via taga keda.',
   false, true),

  ('a1b2c3d4-0005-0005-0005-000000000005',
   'Kava ceremony participation',
   'If offered kava during the welcome ceremony, clap once before receiving the bilo (coconut shell cup), drink in one go if possible, then clap three times saying "Maca!" (it is finished). Declining kava is acceptable — simply clap three times and say "Maca."',
   'Ni vakayacori na yaqona, qai kuci vakadua, qai kuci tolu.',
   false, true);

-- Admin user (password: Admin1234!)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, is_verified, verified_at, is_active, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'admin@fijistays.com.fj',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiptiFHCI51vB9n/CrMBKzBxFhe2', -- Admin1234!
   'ADMIN',
   'Admin', 'FijiStays', '+6793000001',
   true, NOW(), true, NOW(), NOW());

-- Host user (password: Host1234!)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, is_verified, verified_at, is_active, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000002',
   'sione@navala.fj',
   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uakCUi72W', -- Host1234!
   'HOST',
   'Sione', 'Taufa', '+6799123456',
   true, NOW(), true, NOW(), NOW());

-- Tourist user (password: Tourist1234!)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, is_verified, verified_at, is_active, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000003',
   'sarah@example.com',
   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uakCUi72W', -- Tourist1234!
   'TOURIST',
   'Sarah', 'Johnson', '+61412345678',
   true, NOW(), true, NOW(), NOW());

-- Villages
INSERT INTO villages (id, host_id, name, description, island_group, island, province, latitude, longitude, is_verified, verified_at, is_active, created_at, updated_at) VALUES
  ('v0000001-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'Navala Village',
   'Navala is one of the last remaining authentic traditional Fijian villages, nestled in the Ba Highlands of Viti Levu. With over 200 traditional bure (thatched houses) still standing, it is considered the finest example of traditional Fijian architecture in the country. Visitors experience genuine village life — kava ceremonies, traditional cooking, highland hikes and stunning panoramic views of the Ba River valley.',
   'VITI_LEVU', 'Viti Levu', 'Ba Province',
   -17.5286, 177.8772,
   true, NOW(), true, NOW(), NOW()),

  ('v0000002-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000002',
   'Wayasewa Village',
   'Perched on the breathtaking island of Waya in the Yasawa Group, Wayasewa Village offers an unforgettable combination of white-sand beaches, crystal-clear lagoons, and warm Fijian hospitality. The village is a 20-minute walk from stunning Likuliku Bay. Experience traditional weaving, village feasts, snorkelling straight from the beach, and sunset kava ceremonies with the chief.',
   'YASAWA', 'Waya Island', 'Ra Province',
   -17.2833, 177.1167,
   true, NOW(), true, NOW(), NOW()),

  ('v0000003-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000002',
   'Natokalau Village',
   'Natokalau sits on the southern tip of Kadavu Island — a world-class dive destination and home to the Great Astrolabe Reef, the fourth largest barrier reef on earth. This small, welcoming village of around 80 residents has built a reputation for some of the most knowledgeable reef guides in Fiji. Manta ray encounters here are near-guaranteed May through October.',
   'KADAVU', 'Kadavu Island', 'Kadavu Province',
   -19.1167, 178.2167,
   true, NOW(), true, NOW(), NOW());

-- Village protocols
INSERT INTO village_protocols (village_id, protocol_id) VALUES
  ('v0000001-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001'),
  ('v0000001-0000-0000-0000-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002'),
  ('v0000001-0000-0000-0000-000000000001', 'a1b2c3d4-0003-0003-0003-000000000003'),
  ('v0000001-0000-0000-0000-000000000001', 'a1b2c3d4-0004-0004-0004-000000000004'),
  ('v0000001-0000-0000-0000-000000000001', 'a1b2c3d4-0005-0005-0005-000000000005'),
  ('v0000002-0000-0000-0000-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001'),
  ('v0000002-0000-0000-0000-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002'),
  ('v0000002-0000-0000-0000-000000000002', 'a1b2c3d4-0003-0003-0003-000000000003'),
  ('v0000002-0000-0000-0000-000000000002', 'a1b2c3d4-0004-0004-0004-000000000004'),
  ('v0000002-0000-0000-0000-000000000002', 'a1b2c3d4-0005-0005-0005-000000000005'),
  ('v0000003-0000-0000-0000-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001'),
  ('v0000003-0000-0000-0000-000000000003', 'a1b2c3d4-0002-0002-0002-000000000002'),
  ('v0000003-0000-0000-0000-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003'),
  ('v0000003-0000-0000-0000-000000000003', 'a1b2c3d4-0005-0005-0005-000000000005');

-- Experiences
INSERT INTO experiences (id, village_id, title, description, type, price_per_person, max_guests, duration_hours, includes_food, includes_transfer, is_active, created_at, updated_at) VALUES
  ('e0000001-0000-0000-0000-000000000001',
   'v0000001-0000-0000-0000-000000000001',
   'Highland Village Day — Kava, Culture & Panoramic Hike',
   'Spend a full day immersed in the authentic rhythms of Navala, one of Fiji''s last fully traditional villages. Your day begins with a formal sevusevu welcome ceremony with the village chief, followed by a guided walk through 200+ traditional bure. After a village-cooked lovo lunch, hike to the ridge overlooking the Ba River valley for panoramic highland views. End the afternoon with a relaxed kava session with local men. A truly unforgettable window into living Fijian culture.',
   'CULTURAL_TOUR', 125.00, 12, 8.0, true, false, true, NOW(), NOW()),

  ('e0000002-0000-0000-0000-000000000002',
   'v0000001-0000-0000-0000-000000000001',
   'Traditional Lovo Cooking Masterclass',
   'Learn the ancient Fijian art of lovo — earth-oven cooking — directly from the village women. You''ll help prepare the fire pit, wrap fish, taro, and chicken in banana leaves, and learn which local herbs and coconut preparations make each dish unique. The class ends with a communal feast of everything you''ve prepared, eaten together with village families in a traditional bure.',
   'COOKING_CLASS', 75.00, 8, 4.5, true, false, true, NOW(), NOW()),

  ('e0000003-0000-0000-0000-000000000003',
   'v0000002-0000-0000-0000-000000000002',
   'Yasawa Island Village & Reef Snorkel',
   'Start with a sevusevu welcome at Wayasewa Village, explore the village with a local guide, and try traditional weaving with the village women. After lunch on the beach, snorkel the pristine coral gardens of Likuliku Bay — home to turtles, reef sharks, and some of the most vibrant hard corals in the Yasawas. Sunset kava ceremony with the chief closes the day.',
   'ECO_TOUR', 155.00, 10, 7.0, true, true, true, NOW(), NOW()),

  ('e0000004-0000-0000-0000-000000000004',
   'v0000002-0000-0000-0000-000000000002',
   'Yasawa Overnight Village Homestay',
   'Sleep in a traditional bure as a genuine guest of a Wayasewa family. Your evening begins with a welcome ceremony and communal dinner cooked over open fire. Wake to sunrise over the lagoon, share breakfast with your host family, and spend the morning fishing on a traditional bilibili bamboo raft. The most authentic way to experience Yasawa island life — away from the resort bubble entirely.',
   'HOMESTAY', 220.00, 4, 20.0, true, true, true, NOW(), NOW()),

  ('e0000005-0000-0000-0000-000000000005',
   'v0000003-0000-0000-0000-000000000003',
   'Great Astrolabe Reef Village Dive Experience',
   'Dive the legendary Great Astrolabe Reef with a Natokalau village guide who has been navigating these waters since childhood. The reef is accessible directly from the village jetty — no boat transfer needed. Two guided dives explore bommies, swim-throughs and cleaning stations. Surface intervals at the village include fresh coconut and traditional snacks. PADI Open Water minimum required; equipment rental available.',
   'ECO_TOUR', 195.00, 6, 6.0, true, false, true, NOW(), NOW()),

  ('e0000006-0000-0000-0000-000000000006',
   'v0000003-0000-0000-0000-000000000003',
   'Manta Ray Encounter & Village Conservation Tour',
   'Join Natokalau''s community manta conservation programme — the village has been protecting and monitoring their local manta population for over a decade. Snorkel alongside mantas at the village''s protected cleaning station, then join the village''s weekly manta ID recording session. Learn how the community earns sustainable income from conservation rather than fishing. Best May–October.',
   'ECO_TOUR', 145.00, 8, 5.0, true, false, true, NOW(), NOW());

-- Availability (next 90 days for all experiences)
INSERT INTO availability (id, experience_id, date, spots_total, spots_booked, version, is_closed)
SELECT
  gen_random_uuid(),
  e.id,
  (CURRENT_DATE + s.day)::date,
  e.max_guests,
  0,
  0,
  false
FROM experiences e
CROSS JOIN generate_series(1, 90) AS s(day)
ON CONFLICT (experience_id, date) DO NOTHING;
