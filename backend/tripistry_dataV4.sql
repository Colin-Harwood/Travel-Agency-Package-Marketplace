-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 03:47 PM
-- Server version: 12.2.2-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tripistry_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodation`
--

DROP DATABASE IF EXISTS tripistry_data;
CREATE DATABASE tripistry_data CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tripistry_data;

CREATE TABLE `accommodation` (
  `accommodationID` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` enum('Hotel','Hostel','Resort','Apartment','Villa','Guesthouse') NOT NULL,
  `rating` decimal(2,1) DEFAULT NULL CHECK (`rating` between 0 and 5),
  `pricePerNight` decimal(10,2) NOT NULL CHECK (`pricePerNight` > 0),
  `destinationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accommodation`
--

INSERT INTO `accommodation` (`accommodationID`, `name`, `type`, `rating`, `pricePerNight`, `destinationID`) VALUES
(1, 'Hotel Le Marais', 'Hotel', 4.5, 3500.00, 1),
(2, 'Generator Paris', 'Hostel', 3.8, 800.00, 1),
(3, 'Shinjuku Grand Hotel', 'Hotel', 4.7, 4000.00, 2),
(4, 'Khaosan Tokyo Laboratory', 'Hostel', 3.9, 600.00, 2),
(5, 'Cape Grace Hotel', 'Hotel', 4.8, 5000.00, 3),
(6, 'Once in Cape Town', 'Guesthouse', 4.3, 1800.00, 3),
(7, 'Hotel Artemide Rome', 'Hotel', 4.3, 3200.00, 4),
(8, 'Beehive Rome', 'Hostel', 4.0, 700.00, 4),
(9, 'Mandarin Oriental Bangkok', 'Hotel', 4.9, 9000.00, 5),
(10, 'Lub d Bangkok', 'Hostel', 4.1, 650.00, 5),
(11, 'Park Hyatt Sydney', 'Hotel', 4.8, 8500.00, 6),
(12, 'Wake Up Sydney', 'Hostel', 3.9, 750.00, 6),
(13, 'Copacabana Palace', 'Hotel', 4.7, 7500.00, 7),
(14, 'Rio Beach Villa', 'Villa', 4.6, 6000.00, 7),
(15, 'Villa Rosa Kempinski', 'Hotel', 4.6, 6500.00, 8),
(16, 'Nairobi Safari Lodge', 'Guesthouse', 4.5, 3800.00, 8),
(17, 'The Standard High Line', 'Hotel', 4.5, 9000.00, 9),
(18, 'HI NYC Hostel', 'Hostel', 3.8, 900.00, 9),
(19, 'Mystique Hotel', 'Hotel', 4.8, 11000.00, 10),
(20, 'Caldera View Resort', 'Resort', 4.9, 8000.00, 10),
(21, 'Hotel Arts Barcelona', 'Hotel', 4.7, 7000.00, 11),
(22, 'Sant Jordi Hostel', 'Hostel', 4.0, 800.00, 11),
(23, 'Burj Al Arab', 'Hotel', 4.9, 35000.00, 12),
(24, 'Atlantis The Palm', 'Resort', 4.6, 9000.00, 12),
(25, 'La Mamounia', 'Hotel', 4.9, 15000.00, 13),
(26, 'Riad Kniza', 'Guesthouse', 4.7, 4000.00, 13),
(27, 'Hotel Borg', 'Hotel', 4.6, 6000.00, 14),
(28, 'Ion Adventure Hotel', 'Hotel', 4.7, 8500.00, 14),
(29, 'Four Seasons Bali', 'Resort', 4.9, 18000.00, 15),
(30, 'Alaya Resort Ubud', 'Resort', 4.6, 5500.00, 15),
(31, 'Four Seasons Cairo', 'Hotel', 4.8, 8000.00, 16),
(32, 'Kempinski Nile Hotel', 'Hotel', 4.5, 6000.00, 16),
(33, 'Bairro Alto Hotel', 'Hotel', 4.6, 5500.00, 17),
(34, 'Lisbon Lounge Hostel', 'Hostel', 4.2, 700.00, 17),
(35, 'Four Seasons Istanbul', 'Hotel', 4.9, 12000.00, 18),
(36, 'World House Hostel', 'Hostel', 3.9, 600.00, 18),
(37, 'Pulitzer Amsterdam', 'Hotel', 4.6, 6000.00, 19),
(38, 'Stayokay Amsterdam', 'Hostel', 4.0, 750.00, 19),
(39, 'Marina Bay Sands Hotel', 'Hotel', 4.8, 14000.00, 20),
(40, 'The Pod Hotel Singapore', 'Hostel', 4.1, 900.00, 20),
(41, 'Inkaterra Machu Picchu', 'Hotel', 4.8, 12000.00, 21),
(42, 'Sumaq Machu Picchu Hotel', 'Hotel', 4.6, 8000.00, 21),
(43, 'Palacio Duhau Park Hyatt', 'Hotel', 4.8, 9000.00, 22),
(44, 'Milhouse Hostel Buenos Aires', 'Hostel', 4.1, 600.00, 22),
(45, 'Taj Mahal Palace Mumbai', 'Hotel', 4.8, 12000.00, 23),
(46, 'Backpacker Panda Mumbai', 'Hostel', 3.7, 450.00, 23),
(47, 'Sofitel Legend Metropole', 'Hotel', 4.8, 8000.00, 24),
(48, 'Hanoi Backpackers Hostel', 'Hostel', 3.8, 500.00, 24),
(49, 'Villa Dubrovnik', 'Hotel', 4.8, 12000.00, 25),
(50, 'Fresh Sheets Hostel Dubrovnik', 'Hostel', 4.0, 700.00, 25),
(51, 'Four Seasons Mexico City', 'Hotel', 4.8, 9500.00, 26),
(52, 'Hostel Home Mexico City', 'Hostel', 3.8, 500.00, 26),
(53, 'Fairmont Pacific Rim', 'Hotel', 4.8, 8000.00, 27),
(54, 'SameSun Vancouver Hostel', 'Hostel', 3.9, 700.00, 27),
(55, 'Eichardt Private Hotel', 'Hotel', 4.8, 9000.00, 28),
(56, 'Base Backpackers Queenstown', 'Hostel', 3.8, 650.00, 28),
(57, 'Park Hyatt Zanzibar', 'Hotel', 4.8, 12000.00, 29),
(58, 'Karibu Inn Zanzibar', 'Guesthouse', 4.1, 1200.00, 29),
(59, 'Augustine Hotel Prague', 'Hotel', 4.7, 6500.00, 30),
(60, 'Czech Inn Prague', 'Hostel', 4.1, 700.00, 30),
(61, 'Aria Hotel Budapest', 'Hotel', 4.8, 8000.00, 31),
(62, 'Maverick City Lodge Budapest', 'Hostel', 4.2, 650.00, 31),
(63, 'Hotel Sacher Vienna', 'Hotel', 4.8, 9000.00, 32),
(64, 'Wombats City Hostel Vienna', 'Hostel', 4.0, 750.00, 32),
(65, 'Baur au Lac Zurich', 'Hotel', 4.9, 12000.00, 33),
(66, 'City Backpacker Zurich', 'Hostel', 3.9, 800.00, 33),
(67, 'The Thief Oslo', 'Hotel', 4.7, 7500.00, 34),
(68, 'Anker Hostel Oslo', 'Hostel', 3.8, 700.00, 34),
(69, 'Grand Hotel Stockholm', 'Hotel', 4.8, 8500.00, 35),
(70, 'City Backpackers Stockholm', 'Hostel', 4.0, 650.00, 35),
(71, 'Hotel d Angleterre Copenhagen', 'Hotel', 4.8, 9000.00, 36),
(72, 'Generator Copenhagen', 'Hostel', 4.0, 750.00, 36),
(73, 'Hotel Copernicus Krakow', 'Hotel', 4.7, 5500.00, 37),
(74, 'Greg and Tom Party Hostel', 'Hostel', 4.1, 500.00, 37),
(75, 'Lotte Hotel Moscow', 'Hotel', 4.7, 7000.00, 38),
(76, 'Napoleon Hostel Moscow', 'Hostel', 3.9, 600.00, 38),
(77, 'The Peninsula Beijing', 'Hotel', 4.9, 10000.00, 39),
(78, 'Leo Hostel Beijing', 'Hostel', 3.8, 400.00, 39),
(79, 'The Shilla Seoul', 'Hotel', 4.8, 9000.00, 40),
(80, 'Kimchee Guesthouse Seoul', 'Guesthouse', 4.2, 600.00, 40),
(81, 'Mandarin Oriental Kuala Lumpur', 'Hotel', 4.7, 5000.00, 41),
(82, 'Reggae Mansion Hostel', 'Hostel', 4.0, 450.00, 41),
(83, 'El Nido Resorts Pangulasian', 'Resort', 4.9, 15000.00, 42),
(84, 'Outpost Hostel Palawan', 'Hostel', 3.9, 600.00, 42),
(85, 'Gili Lankanfushi Maldives', 'Resort', 4.9, 45000.00, 43),
(86, 'Hulhule Island Hotel', 'Hotel', 4.2, 3500.00, 43),
(87, 'Heritance Kandalama', 'Hotel', 4.7, 5000.00, 44),
(88, 'Clock Inn Colombo', 'Hostel', 3.8, 400.00, 44),
(89, 'Dwarika Hotel Kathmandu', 'Hotel', 4.8, 6000.00, 45),
(90, 'Zostel Kathmandu', 'Hostel', 4.0, 500.00, 45),
(91, 'Mövenpick Resort Petra', 'Hotel', 4.7, 6000.00, 46),
(92, 'Cleopatras Hotel Petra', 'Hotel', 4.2, 2500.00, 46),
(93, 'King David Hotel Jerusalem', 'Hotel', 4.8, 7000.00, 47),
(94, 'Abraham Hostel Jerusalem', 'Hostel', 4.3, 600.00, 47),
(95, 'Four Seasons Hotel Johannesburg', 'Hotel', 4.8, 8000.00, 48),
(96, 'Curiocity Backpackers', 'Hostel', 4.1, 550.00, 48),
(97, 'Olive Exclusive Boutique Hotel', 'Hotel', 4.7, 5500.00, 49),
(98, 'Chameleon Backpackers Windhoek', 'Hostel', 3.9, 450.00, 49),
(99, 'Sanctuary Chiefs Camp', 'Resort', 4.9, 25000.00, 50),
(100, 'Audi Camp Maun', 'Guesthouse', 4.2, 1500.00, 50);

-- --------------------------------------------------------

--
-- Table structure for table `attraction`
--

CREATE TABLE `attraction` (
  `name` varchar(150) NOT NULL,
  `entryFee` decimal(10,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `destinationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attraction`
--

INSERT INTO `attraction` (`name`, `entryFee`, `description`, `destinationID`) VALUES
('Eiffel Tower', 26.00, 'Iconic iron lattice tower on the Champ de Mars.', 1),
('Louvre Museum', 17.00, 'The worlds largest art museum, housing the Mona Lisa.', 1),
('Senso-ji Temple', 0.00, 'Ancient Buddhist temple in Asakusa district.', 2),
('Shibuya Crossing', 0.00, 'The worlds busiest pedestrian crossing in Tokyo.', 2),
('Robben Island', 450.00, 'Historic island prison where Nelson Mandela was held.', 3),
('Table Mountain', 380.00, 'Flat-topped mountain offering panoramic views over Cape Town.', 3),
('Colosseum', 18.00, 'Ancient Roman amphitheatre in the centre of Rome.', 4),
('Vatican Museums', 20.00, 'World-renowned art collection within Vatican City.', 4),
('Grand Palace', 500.00, 'Stunning complex of royal buildings in central Bangkok.', 5),
('Wat Pho', 200.00, 'Temple of the Reclining Buddha near the Grand Palace.', 5),
('Bondi Beach', 0.00, 'Famous beach suburb and world-renowned surfing destination.', 6),
('Sydney Opera House', 40.00, 'Iconic multi-venue performing arts centre on Sydney Harbour.', 6),
('Christ the Redeemer', 84.00, 'Art Deco statue of Jesus Christ atop Corcovado mountain.', 7),
('Sugarloaf Mountain', 118.00, 'Iconic peak at the mouth of Guanabara Bay.', 7),
('Giraffe Centre', 300.00, 'Conservation centre for the endangered Rothschild giraffe.', 8),
('Maasai Mara Reserve', 100.00, 'Famous national game reserve in southwestern Kenya.', 8),
('Central Park', 0.00, 'Large urban park in the heart of Manhattan.', 9),
('Statue of Liberty', 24.00, 'Iconic copper statue on Liberty Island in New York Harbor.', 9),
('Akrotiri', 14.00, 'Prehistoric settlement buried by volcanic eruption on Santorini.', 10),
('Oia Village', 0.00, 'Picturesque village renowned for stunning sunset views.', 10),
('Park Guell', 10.00, 'Colourful park with mosaics designed by Gaudi.', 11),
('Sagrada Familia', 26.00, 'Unfinished basilica designed by Antoni Gaudi.', 11),
('Burj Khalifa', 37.00, 'The tallest building in the world at 828 metres.', 12),
('Palm Jumeirah', 0.00, 'Artificial archipelago shaped like a palm tree in Dubai.', 12),
('Bahia Palace', 70.00, '19th-century palace showcasing Moroccan architecture.', 13),
('Jardin Majorelle', 70.00, 'Botanical garden and artist studio in Marrakech.', 13),
('Blue Lagoon', 60.00, 'Geothermal spa set in a lava field near Reykjavik.', 14),
('Hallgrimskirkja', 9.00, 'Lutheran parish church and tallest structure in Iceland.', 14),
('Tegallalang Terraces', 0.00, 'Iconic terraced rice paddies north of Ubud in Bali.', 15),
('Uluwatu Temple', 30.00, 'Clifftop Hindu sea temple overlooking the Indian Ocean.', 15),
('Egyptian Museum', 15.00, 'Home to the most extensive collection of ancient Egyptian antiquities.', 16),
('Pyramids of Giza', 10.00, 'Ancient Egyptian pyramids on the outskirts of Cairo.', 16),
('Belem Tower', 6.00, '16th-century fortification on the banks of the Tagus River.', 17),
('Jeronimos Monastery', 10.00, 'UNESCO World Heritage monastery in the Belem district of Lisbon.', 17),
('Grand Bazaar', 0.00, 'One of the largest and oldest covered markets in the world.', 18),
('Hagia Sophia', 15.00, 'Former cathedral and mosque, now a landmark museum in Istanbul.', 18),
('Anne Frank House', 16.00, 'Museum in the hiding place of Anne Frank during WWII.', 19),
('Rijksmuseum', 22.00, 'Dutch national museum dedicated to arts and history.', 19),
('Gardens by the Bay', 28.00, 'Futuristic nature park in the heart of Singapore.', 20),
('Marina Bay Sands', 23.00, 'Integrated resort with iconic rooftop infinity pool.', 20),
('Huayna Picchu', 10.00, 'Mountain overlooking Machu Picchu with steep trails.', 21),
('Machu Picchu', 52.00, '15th-century Inca citadel in the Eastern Cordillera.', 21),
('Casa Rosada', 0.00, 'Pink presidential palace facing Plaza de Mayo.', 22),
('Recoleta Cemetery', 0.00, 'Famous cemetery containing the tomb of Eva Peron.', 22),
('Elephanta Caves', 15.00, 'UNESCO caves with rock-cut sculptures of Hindu deities.', 23),
('Gateway of India', 0.00, 'Arch monument built in the early 20th century in Mumbai.', 23),
('Hoan Kiem Lake', 0.00, 'Lake in the historical centre of Hanoi.', 24),
('Temple of Literature', 30.00, 'Well-preserved Vietnamese temple and first university.', 24),
('Dubrovnik City Walls', 35.00, 'Medieval walls encircling the old city of Dubrovnik.', 25),
('Fort Lovrijenac', 35.00, 'Fortress on a 37-metre high rock outside the city walls.', 25),
('Frida Kahlo Museum', 270.00, 'Former home of artist Frida Kahlo in Coyoacan.', 26),
('Teotihuacan', 80.00, 'Ancient Mesoamerican city with the Pyramid of the Sun.', 26),
('Capilano Suspension Bridge', 62.00, 'Suspension bridge over the Capilano River canyon.', 27),
('Stanley Park', 0.00, '1000-acre park on a peninsula in Vancouver.', 27),
('Bungee Jumping Kawarau', 180.00, 'Worlds first commercial bungee jump site.', 28),
('Milford Sound', 89.00, 'Fiord in Fiordland renowned for its stunning scenery.', 28),
('Nungwi Beach', 0.00, 'White sand beach at the northern tip of Zanzibar.', 29),
('Stone Town', 0.00, 'UNESCO World Heritage old town of Zanzibar City.', 29),
('Charles Bridge', 0.00, 'Historic 14th-century stone bridge crossing the Vltava River.', 30),
('Prague Castle', 250.00, 'The largest ancient castle in the world.', 30),
('Buda Castle', 3000.00, 'UNESCO-listed castle complex overlooking the Danube.', 31),
('Szechenyi Thermal Bath', 28.00, 'One of the largest thermal bath complexes in Europe.', 31),
('Belvedere Palace', 16.00, 'Baroque palace complex housing Austrian art collections.', 32),
('Schonbrunn Palace', 16.00, 'Baroque imperial palace and gardens in Vienna.', 32),
('Lake Zurich', 0.00, 'Beautiful lake at the heart of the city of Zurich.', 33),
('Zurich Old Town', 0.00, 'Charming medieval old town with cobbled streets.', 33),
('Vigeland Sculpture Park', 0.00, 'The worlds largest sculpture park made by a single artist.', 34),
('Viking Ship Museum', 120.00, 'Museum housing three well-preserved Viking ships.', 34),
('Gamla Stan', 0.00, 'Stockholms old town, one of the best preserved in Europe.', 35),
('Vasa Museum', 160.00, 'Museum housing a 17th-century warship salvaged from the sea.', 35),
('Nyhavn', 0.00, '17th-century waterfront canal and entertainment district.', 36),
('Tivoli Gardens', 120.00, 'One of the worlds oldest amusement parks in Copenhagen.', 36),
('Wawel Castle', 35.00, 'A magnificent royal castle on a limestone hill in Krakow.', 37),
('Wieliczka Salt Mine', 99.00, 'A UNESCO-listed salt mine with underground chapels.', 37),
('Red Square', 0.00, 'The central square of Moscow, surrounded by iconic landmarks.', 38),
('Saint Basils Cathedral', 500.00, 'Iconic cathedral with colourful onion-shaped domes.', 38),
('Forbidden City', 60.00, 'A palace complex that was home to Chinese emperors for 500 years.', 39),
('Great Wall of China', 40.00, 'An ancient series of walls and fortifications along northern China.', 39),
('Gyeongbokgung Palace', 3000.00, 'The largest of the Five Grand Palaces in Seoul.', 40),
('N Seoul Tower', 21.00, 'Iconic communications tower offering panoramic views of Seoul.', 40),
('Batu Caves', 0.00, 'A limestone hill with a series of caves and cave temples.', 41),
('Petronas Twin Towers', 80.00, 'Once the worlds tallest buildings, now iconic Kuala Lumpur landmark.', 41),
('El Nido', 0.00, 'A stunning municipality known for crystal-clear lagoons.', 42),
('Puerto Princesa Underground River', 1500.00, 'A UNESCO World Heritage Site and one of the New Seven Wonders of Nature.', 42),
('Banana Reef', 0.00, 'One of the most famous dive sites in the Maldives.', 43),
('Male Fish Market', 0.00, 'A colourful and lively traditional fish market in Male.', 43),
('Sigiriya Rock Fortress', 30.00, 'A UNESCO World Heritage ancient rock fortress in Sri Lanka.', 44),
('Temple of the Tooth', 1500.00, 'A Buddhist temple housing the relic of the tooth of Buddha.', 44),
('Boudhanath Stupa', 400.00, 'One of the largest stupas in the world located in Kathmandu.', 45),
('Pashupatinath Temple', 1000.00, 'A sacred Hindu temple on the banks of the Bagmati River.', 45),
('Petra Treasury', 50.00, 'The iconic rose-red facade of the ancient city of Petra.', 46),
('Wadi Rum', 35.00, 'A protected desert wilderness in southern Jordan.', 46),
('Church of the Holy Sepulchre', 0.00, 'A church built on the site where Jesus was crucified.', 47),
('Western Wall', 0.00, 'The holiest site in Judaism, located in the Old City of Jerusalem.', 47),
('Apartheid Museum', 220.00, 'A museum in Johannesburg dedicated to the apartheid era.', 48),
('Soweto Township', 0.00, 'The famous township that was home to Nelson Mandela.', 48),
('Etosha National Park', 80.00, 'One of Africas greatest wildlife sanctuaries.', 49),
('Sossusvlei Dunes', 0.00, 'Iconic red sand dunes in the heart of the Namib Desert.', 49),
('Chobe National Park', 120.00, 'Famous for having one of the highest concentrations of elephants.', 50),
('Okavango Delta', 0.00, 'A unique inland delta and one of Africas greatest wildernesses.', 50);

-- --------------------------------------------------------

--
-- Table structure for table `destination`
--

CREATE TABLE `destination` (
  `destinationID` int(11) NOT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `destination`
--

INSERT INTO `destination` (`destinationID`, `country`, `city`, `description`) VALUES
(1, 'France', 'Paris', 'The city of light, famous for the Eiffel Tower and haute cuisine.'),
(2, 'Japan', 'Tokyo', 'A vibrant metropolis blending ultramodern and traditional culture.'),
(3, 'South Africa', 'Cape Town', 'Stunning coastal city nestled beneath Table Mountain.'),
(4, 'Italy', 'Rome', 'The Eternal City, rich with ancient history and Renaissance art.'),
(5, 'Thailand', 'Bangkok', 'A bustling city known for ornate temples and vibrant street life.'),
(6, 'Australia', 'Sydney', 'Iconic harbour city with beautiful beaches and world-class dining.'),
(7, 'Brazil', 'Rio de Janeiro', 'Famous for Carnival, samba music and stunning beaches.'),
(8, 'Kenya', 'Nairobi', 'Gateway to world-famous safari destinations across East Africa.'),
(9, 'USA', 'New York', 'The city that never sleeps, a global hub of culture and finance.'),
(10, 'Greece', 'Santorini', 'Iconic white-washed buildings with breathtaking caldera views.'),
(11, 'Spain', 'Barcelona', 'A city of art and architecture, home to Gaudi masterpieces.'),
(12, 'UAE', 'Dubai', 'A futuristic city of skyscrapers, luxury shopping and desert adventures.'),
(13, 'Morocco', 'Marrakech', 'A sensory feast of souks, palaces and vibrant Medina life.'),
(14, 'Iceland', 'Reykjavik', 'Gateway to the Northern Lights and dramatic volcanic landscapes.'),
(15, 'Indonesia', 'Bali', 'Island of the Gods, known for terraced rice fields and temples.'),
(16, 'Egypt', 'Cairo', 'Home to the Great Pyramids and thousands of years of history.'),
(17, 'Portugal', 'Lisbon', 'A city of hills, trams and stunning Atlantic ocean views.'),
(18, 'Turkey', 'Istanbul', 'A city straddling two continents, rich in Byzantine history.'),
(19, 'Netherlands', 'Amsterdam', 'Famous for canals, cycling culture and world-class museums.'),
(20, 'Singapore', 'Singapore', 'A gleaming city-state of futuristic architecture and food culture.'),
(21, 'Peru', 'Machu Picchu', 'Ancient Incan citadel set high in the Andes mountains.'),
(22, 'Argentina', 'Buenos Aires', 'The Paris of South America, famed for tango and steak.'),
(23, 'India', 'Mumbai', 'A city of contrasts, Bollywood glamour and colonial architecture.'),
(24, 'Vietnam', 'Hanoi', 'A city of ancient temples, French colonial buildings and street food.'),
(25, 'Croatia', 'Dubrovnik', 'The Pearl of the Adriatic with stunning medieval walled city.'),
(26, 'Mexico', 'Mexico City', 'A sprawling metropolis rich in Aztec heritage and street food.'),
(27, 'Canada', 'Vancouver', 'A Pacific coast gem surrounded by mountains and ocean.'),
(28, 'New Zealand', 'Queenstown', 'Adventure capital of the world set beside a glacier lake.'),
(29, 'Tanzania', 'Zanzibar', 'Spice island paradise with white sand beaches and coral reefs.'),
(30, 'Czech Republic', 'Prague', 'A fairytale city of Gothic spires and Baroque palaces.'),
(31, 'Hungary', 'Budapest', 'The Pearl of the Danube, famous for thermal baths and ruin bars.'),
(32, 'Austria', 'Vienna', 'The City of Music, home to Mozart, Beethoven and world-class opera.'),
(33, 'Switzerland', 'Zurich', 'A pristine lakeside city combining finance, culture and alpine scenery.'),
(34, 'Norway', 'Oslo', 'A compact city surrounded by fjords, forests and world-class museums.'),
(35, 'Sweden', 'Stockholm', 'Built on 14 islands, known for design, ABBA and Viking history.'),
(36, 'Denmark', 'Copenhagen', 'A hygge capital of canals, castles and Michelin-starred restaurants.'),
(37, 'Poland', 'Krakow', 'A beautifully preserved medieval city and gateway to Auschwitz.'),
(38, 'Russia', 'Moscow', 'The political and cultural heart of Russia and the former Soviet Union.'),
(39, 'China', 'Beijing', 'Home to the Great Wall, Forbidden City and Tiananmen Square.'),
(40, 'South Korea', 'Seoul', 'A dynamic city blending K-pop culture with ancient palaces.'),
(41, 'Malaysia', 'Kuala Lumpur', 'A melting pot of cultures at the foot of the Petronas Towers.'),
(42, 'Philippines', 'Palawan', 'An island paradise with crystal-clear lagoons and dramatic karst cliffs.'),
(43, 'Maldives', 'Male', 'A tropical paradise of overwater bungalows and coral reefs.'),
(44, 'Sri Lanka', 'Colombo', 'A tropical island nation of tea, temples and wildlife.'),
(45, 'Nepal', 'Kathmandu', 'Gateway to the Himalayas and base for Everest trekking expeditions.'),
(46, 'Jordan', 'Petra', 'The Rose City, an ancient Nabataean city carved from rose-red cliffs.'),
(47, 'Israel', 'Jerusalem', 'A holy city sacred to three of the worlds major religions.'),
(48, 'South Africa', 'Johannesburg', 'The City of Gold, economic powerhouse and gateway to safari.'),
(49, 'Namibia', 'Windhoek', 'Gateway to the red dunes of Sossusvlei and etosha National Park.'),
(50, 'Botswana', 'Maun', 'Gateway to the Okavango Delta, one of Africas last great wildernesses.');

-- --------------------------------------------------------

--
-- Table structure for table `flight`
--

CREATE TABLE `flight` (
  `flightID` int(11) NOT NULL,
  `airline` varchar(100) NOT NULL,
  `flightNumber` varchar(20) NOT NULL,
  `departureAirport` varchar(100) NOT NULL,
  `arrivalAirport` varchar(100) NOT NULL,
  `departureTime` datetime NOT NULL,
  `arrivalTime` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL CHECK (`price` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flight`
--

INSERT INTO `flight` (`flightID`, `airline`, `flightNumber`, `departureAirport`, `arrivalAirport`, `departureTime`, `arrivalTime`, `price`) VALUES
(1, 'Air France', 'AF101', 'OR Tambo International', 'Charles de Gaulle', '2026-07-01 08:00:00', '2026-07-01 18:00:00', 12000.00),
(2, 'Japan Airlines', 'JL302', 'OR Tambo International', 'Narita International', '2026-07-02 10:00:00', '2026-07-03 06:00:00', 14000.00),
(3, 'FlySafair', 'FA210', 'OR Tambo International', 'Cape Town International', '2026-07-03 07:00:00', '2026-07-03 09:00:00', 1800.00),
(4, 'Alitalia', 'AZ550', 'OR Tambo International', 'Leonardo da Vinci', '2026-07-04 09:00:00', '2026-07-04 19:30:00', 11000.00),
(5, 'Thai Airways', 'TG971', 'OR Tambo International', 'Suvarnabhumi Airport', '2026-07-05 23:00:00', '2026-07-06 12:00:00', 8500.00),
(6, 'Qantas', 'QF63', 'OR Tambo International', 'Sydney Kingsford Smith', '2026-07-06 18:00:00', '2026-07-07 13:00:00', 15000.00),
(7, 'LATAM', 'LA704', 'OR Tambo International', 'Galeao International', '2026-07-07 21:00:00', '2026-07-08 06:00:00', 13000.00),
(8, 'Kenya Airways', 'KQ101', 'OR Tambo International', 'Jomo Kenyatta International', '2026-07-08 06:00:00', '2026-07-08 11:00:00', 5000.00),
(9, 'Delta', 'DL401', 'OR Tambo International', 'John F. Kennedy International', '2026-07-09 20:00:00', '2026-07-10 06:00:00', 16000.00),
(10, 'Aegean Airlines', 'A3601', 'OR Tambo International', 'Santorini Airport', '2026-07-10 07:00:00', '2026-07-10 17:00:00', 13500.00),
(11, 'Iberia', 'IB3401', 'OR Tambo International', 'El Prat Airport', '2026-07-11 10:00:00', '2026-07-11 22:00:00', 12500.00),
(12, 'Emirates', 'EK764', 'OR Tambo International', 'Dubai International', '2026-07-12 08:00:00', '2026-07-12 14:30:00', 7000.00),
(13, 'Royal Air Maroc', 'AT702', 'OR Tambo International', 'Marrakech Menara', '2026-07-13 06:00:00', '2026-07-13 14:00:00', 9500.00),
(14, 'Icelandair', 'FI614', 'OR Tambo International', 'Keflavik International', '2026-07-14 09:00:00', '2026-07-14 23:00:00', 14500.00),
(15, 'Garuda Indonesia', 'GA829', 'OR Tambo International', 'Ngurah Rai International', '2026-07-15 22:00:00', '2026-07-16 12:00:00', 10000.00),
(16, 'EgyptAir', 'MS782', 'OR Tambo International', 'Cairo International', '2026-07-16 05:00:00', '2026-07-16 13:00:00', 7500.00),
(17, 'TAP Air Portugal', 'TP272', 'OR Tambo International', 'Humberto Delgado Airport', '2026-07-17 10:00:00', '2026-07-17 22:00:00', 11500.00),
(18, 'Turkish Airlines', 'TK16', 'OR Tambo International', 'Istanbul Airport', '2026-07-18 08:00:00', '2026-07-18 18:00:00', 10500.00),
(19, 'KLM', 'KL591', 'OR Tambo International', 'Amsterdam Schiphol', '2026-07-19 09:00:00', '2026-07-19 21:00:00', 12000.00),
(20, 'Singapore Airlines', 'SQ478', 'OR Tambo International', 'Changi Airport', '2026-07-20 22:00:00', '2026-07-21 14:00:00', 13000.00),
(21, 'LATAM', 'LA800', 'OR Tambo International', 'Lima Jorge Chavez International', '2026-07-21 20:00:00', '2026-07-22 08:00:00', 14500.00),
(22, 'Aerolineas Argentinas', 'AR1101', 'OR Tambo International', 'Ministro Pistarini International', '2026-07-22 19:00:00', '2026-07-23 07:00:00', 13500.00),
(23, 'Air India', 'AI226', 'OR Tambo International', 'Chhatrapati Shivaji International', '2026-07-23 08:00:00', '2026-07-23 18:00:00', 9000.00),
(24, 'Vietnam Airlines', 'VN54', 'OR Tambo International', 'Noi Bai International', '2026-07-24 21:00:00', '2026-07-25 12:00:00', 11000.00),
(25, 'Croatia Airlines', 'OU491', 'OR Tambo International', 'Dubrovnik Airport', '2026-07-25 09:00:00', '2026-07-25 19:00:00', 12000.00),
(26, 'Aeromexico', 'AM401', 'OR Tambo International', 'Benito Juarez International', '2026-07-26 20:00:00', '2026-07-27 08:00:00', 15000.00),
(27, 'Air Canada', 'AC882', 'OR Tambo International', 'Vancouver International', '2026-07-27 18:00:00', '2026-07-28 10:00:00', 16500.00),
(28, 'Air New Zealand', 'NZ281', 'OR Tambo International', 'Queenstown Airport', '2026-07-28 19:00:00', '2026-07-29 17:00:00', 17000.00),
(29, 'Kenya Airways', 'KQ460', 'OR Tambo International', 'Abeid Amani Karume International', '2026-07-29 07:00:00', '2026-07-29 10:00:00', 4500.00),
(30, 'Czech Airlines', 'OK701', 'OR Tambo International', 'Vaclav Havel Airport Prague', '2026-07-30 10:00:00', '2026-07-30 22:00:00', 11500.00),
(31, 'Wizz Air', 'W6 2381', 'OR Tambo International', 'Budapest Ferenc Liszt Airport', '2026-07-31 11:00:00', '2026-07-31 22:00:00', 10500.00),
(32, 'Austrian Airlines', 'OS67', 'OR Tambo International', 'Vienna International Airport', '2026-08-01 09:00:00', '2026-08-01 21:00:00', 11000.00),
(33, 'Swiss Air', 'LX284', 'OR Tambo International', 'Zurich Airport', '2026-08-02 09:00:00', '2026-08-02 21:00:00', 12600.00),
(34, 'Norwegian Air', 'DY7001', 'OR Tambo International', 'Oslo Gardermoen Airport', '2026-08-03 10:00:00', '2026-08-03 23:00:00', 13000.00),
(35, 'SAS', 'SK937', 'OR Tambo International', 'Stockholm Arlanda Airport', '2026-08-04 10:00:00', '2026-08-04 23:00:00', 13200.00),
(36, 'SAS', 'SK251', 'OR Tambo International', 'Copenhagen Airport', '2026-08-05 09:00:00', '2026-08-05 22:00:00', 12800.00),
(37, 'LOT Polish Airlines', 'LO273', 'OR Tambo International', 'Krakow John Paul II Airport', '2026-08-06 10:00:00', '2026-08-06 22:00:00', 11200.00),
(38, 'Aeroflot', 'SU290', 'OR Tambo International', 'Sheremetyevo International Airport', '2026-08-07 08:00:00', '2026-08-07 20:00:00', 10000.00),
(39, 'Air China', 'CA860', 'OR Tambo International', 'Beijing Capital International', '2026-08-08 20:00:00', '2026-08-09 14:00:00', 14000.00),
(40, 'Korean Air', 'KE471', 'OR Tambo International', 'Incheon International Airport', '2026-08-09 21:00:00', '2026-08-10 15:00:00', 14500.00),
(41, 'Malaysia Airlines', 'MH197', 'OR Tambo International', 'Kuala Lumpur International', '2026-08-10 21:00:00', '2026-08-11 12:00:00', 10500.00),
(42, 'Philippine Airlines', 'PR210', 'OR Tambo International', 'Puerto Princesa Airport', '2026-08-11 20:00:00', '2026-08-12 16:00:00', 13000.00),
(43, 'Maldivian Airlines', 'Q2201', 'OR Tambo International', 'Velana International Airport', '2026-08-12 08:00:00', '2026-08-12 18:00:00', 9500.00),
(44, 'SriLankan Airlines', 'UL504', 'OR Tambo International', 'Bandaranaike International Airport', '2026-08-13 07:00:00', '2026-08-13 17:00:00', 9000.00),
(45, 'Buddha Air', 'U4201', 'OR Tambo International', 'Tribhuvan International Airport', '2026-08-14 08:00:00', '2026-08-14 18:00:00', 9500.00),
(46, 'Royal Jordanian', 'RJ117', 'OR Tambo International', 'Queen Alia International Airport', '2026-08-15 07:00:00', '2026-08-15 17:00:00', 10000.00),
(47, 'El Al', 'LY764', 'OR Tambo International', 'Ben Gurion International Airport', '2026-08-16 08:00:00', '2026-08-16 18:00:00', 11000.00),
(48, 'Ethiopian Airlines', 'ET820', 'OR Tambo International', 'OR Tambo to Johannesburg O.R. Tambo', '2026-08-17 06:00:00', '2026-08-17 08:00:00', 2500.00),
(49, 'Air Namibia', 'SW041', 'OR Tambo International', 'Hosea Kutako International Airport', '2026-08-18 07:00:00', '2026-08-18 09:30:00', 3000.00),
(50, 'Air Botswana', 'BP101', 'OR Tambo International', 'Sir Seretse Khama International', '2026-08-19 08:00:00', '2026-08-19 10:00:00', 3500.00),
(51, 'Air France', 'AF103', 'OR Tambo International', 'Charles de Gaulle', '2026-09-01 08:00:00', '2026-09-01 18:00:00', 12500.00),
(52, 'Japan Airlines', 'JL304', 'OR Tambo International', 'Narita International', '2026-09-02 10:00:00', '2026-09-03 06:00:00', 14500.00),
(53, 'FlySafair', 'FA212', 'OR Tambo International', 'Cape Town International', '2026-09-03 07:00:00', '2026-09-03 09:00:00', 1900.00),
(54, 'Alitalia', 'AZ552', 'OR Tambo International', 'Leonardo da Vinci', '2026-09-04 09:00:00', '2026-09-04 19:30:00', 11500.00),
(55, 'Thai Airways', 'TG973', 'OR Tambo International', 'Suvarnabhumi Airport', '2026-09-05 23:00:00', '2026-09-06 12:00:00', 8800.00),
(56, 'Qantas', 'QF65', 'OR Tambo International', 'Sydney Kingsford Smith', '2026-09-06 18:00:00', '2026-09-07 13:00:00', 15500.00),
(57, 'LATAM', 'LA706', 'OR Tambo International', 'Galeao International', '2026-09-07 21:00:00', '2026-09-08 06:00:00', 13500.00),
(58, 'Kenya Airways', 'KQ103', 'OR Tambo International', 'Jomo Kenyatta International', '2026-09-08 06:00:00', '2026-09-08 11:00:00', 5200.00),
(59, 'Delta', 'DL403', 'OR Tambo International', 'John F. Kennedy International', '2026-09-09 20:00:00', '2026-09-10 06:00:00', 16500.00),
(60, 'Aegean Airlines', 'A3603', 'OR Tambo International', 'Santorini Airport', '2026-09-10 07:00:00', '2026-09-10 17:00:00', 14000.00),
(61, 'Iberia', 'IB3403', 'OR Tambo International', 'El Prat Airport', '2026-09-11 10:00:00', '2026-09-11 22:00:00', 13000.00),
(62, 'Emirates', 'EK766', 'OR Tambo International', 'Dubai International', '2026-09-12 08:00:00', '2026-09-12 14:30:00', 7200.00),
(63, 'Royal Air Maroc', 'AT704', 'OR Tambo International', 'Marrakech Menara', '2026-09-13 06:00:00', '2026-09-13 14:00:00', 9800.00),
(64, 'Icelandair', 'FI616', 'OR Tambo International', 'Keflavik International', '2026-09-14 09:00:00', '2026-09-14 23:00:00', 15000.00),
(65, 'Garuda Indonesia', 'GA831', 'OR Tambo International', 'Ngurah Rai International', '2026-09-15 22:00:00', '2026-09-16 12:00:00', 10500.00),
(66, 'EgyptAir', 'MS784', 'OR Tambo International', 'Cairo International', '2026-09-16 05:00:00', '2026-09-16 13:00:00', 7800.00),
(67, 'TAP Air Portugal', 'TP274', 'OR Tambo International', 'Humberto Delgado Airport', '2026-09-17 10:00:00', '2026-09-17 22:00:00', 12000.00),
(68, 'Turkish Airlines', 'TK18', 'OR Tambo International', 'Istanbul Airport', '2026-09-18 08:00:00', '2026-09-18 18:00:00', 11000.00),
(69, 'KLM', 'KL593', 'OR Tambo International', 'Amsterdam Schiphol', '2026-09-19 09:00:00', '2026-09-19 21:00:00', 12500.00),
(70, 'Singapore Airlines', 'SQ480', 'OR Tambo International', 'Changi Airport', '2026-09-20 22:00:00', '2026-09-21 14:00:00', 13500.00),
(71, 'British Airways', 'BA056', 'OR Tambo International', 'London Heathrow', '2026-09-21 21:00:00', '2026-09-22 07:00:00', 11800.00),
(72, 'Lufthansa', 'LH574', 'OR Tambo International', 'Frankfurt Airport', '2026-09-22 09:00:00', '2026-09-22 20:00:00', 11300.00),
(73, 'Ethiopian Airlines', 'ET502', 'OR Tambo International', 'Addis Ababa Bole International', '2026-09-23 06:00:00', '2026-09-23 11:00:00', 4800.00),
(74, 'Qatar Airways', 'QR1364', 'OR Tambo International', 'Hamad International Airport', '2026-09-24 08:00:00', '2026-09-24 15:00:00', 6800.00),
(75, 'Cathay Pacific', 'CX234', 'OR Tambo International', 'Hong Kong International', '2026-09-25 22:00:00', '2026-09-26 14:00:00', 14200.00),
(76, 'Finnair', 'AY061', 'OR Tambo International', 'Helsinki-Vantaa Airport', '2026-09-26 10:00:00', '2026-09-26 23:00:00', 13400.00),
(77, 'LOT Polish Airlines', 'LO275', 'OR Tambo International', 'Warsaw Chopin Airport', '2026-09-27 10:00:00', '2026-09-27 22:00:00', 11500.00),
(78, 'Aeroflot', 'SU292', 'OR Tambo International', 'Sheremetyevo International Airport', '2026-09-28 08:00:00', '2026-09-28 20:00:00', 10200.00),
(79, 'Air China', 'CA862', 'OR Tambo International', 'Beijing Capital International', '2026-09-29 20:00:00', '2026-09-30 14:00:00', 14200.00),
(80, 'Korean Air', 'KE473', 'OR Tambo International', 'Incheon International Airport', '2026-09-30 21:00:00', '2026-10-01 15:00:00', 14800.00),
(81, 'Kenya Airways', 'KQ462', 'OR Tambo International', 'Abeid Amani Karume International', '2026-10-01 07:00:00', '2026-10-01 10:00:00', 4700.00),
(82, 'Kenya Airways', 'KQ105', 'OR Tambo International', 'Jomo Kenyatta International', '2026-10-02 06:00:00', '2026-10-02 11:00:00', 5400.00);

-- --------------------------------------------------------

--
-- Table structure for table `group_trip`
--

CREATE TABLE `group_trip` (
  `tripID` int(11) NOT NULL,
  `maxSize` int(11) NOT NULL CHECK (`maxSize` > 0),
  `tripDate` date NOT NULL,
  `currentSize` int(11) NOT NULL DEFAULT 0 CHECK (`currentSize` >= 0),
  `packageID` int(11) NOT NULL,
  `agencyID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `group_trip`
--

INSERT INTO `group_trip` (`tripID`, `maxSize`, `tripDate`, `currentSize`, `packageID`, `agencyID`) VALUES
(1, 10, '2026-10-02', 10, 1, 11),
(2, 7, '2026-11-21', 3, 2, 12),
(3, 8, '2026-12-15', 5, 3, 13),
(4, 19, '2026-07-21', 17, 4, 11),
(5, 17, '2026-08-02', 3, 5, 12),
(6, 19, '2026-08-08', 4, 6, 13),
(7, 14, '2026-07-09', 1, 7, 11),
(8, 18, '2026-12-13', 16, 8, 12),
(9, 12, '2026-09-29', 2, 9, 13),
(10, 19, '2026-12-05', 7, 10, 11),
(11, 15, '2026-09-26', 5, 11, 12),
(12, 18, '2026-09-26', 1, 12, 13),
(13, 18, '2026-08-18', 13, 13, 11),
(14, 10, '2026-07-29', 2, 14, 12),
(15, 8, '2026-12-12', 7, 15, 13),
(16, 14, '2026-07-04', 11, 16, 11),
(17, 9, '2026-12-22', 6, 17, 12),
(18, 18, '2026-08-30', 3, 18, 13),
(19, 15, '2026-12-02', 14, 19, 11),
(20, 19, '2026-08-11', 2, 20, 12),
(21, 20, '2026-10-22', 5, 21, 13),
(22, 11, '2026-09-19', 4, 22, 11),
(23, 15, '2026-11-27', 1, 23, 12),
(24, 12, '2026-09-15', 0, 24, 13),
(25, 8, '2026-07-03', 2, 25, 11),
(26, 20, '2026-11-20', 9, 26, 12),
(27, 10, '2026-08-01', 4, 27, 13),
(28, 13, '2026-07-19', 6, 28, 11),
(29, 6, '2026-08-11', 2, 29, 12),
(30, 15, '2026-09-24', 10, 30, 13),
(31, 16, '2026-07-09', 10, 31, 11),
(32, 12, '2026-12-04', 4, 32, 12),
(33, 9, '2026-08-08', 8, 33, 13),
(34, 17, '2026-09-12', 0, 34, 11),
(35, 17, '2026-10-16', 12, 35, 12),
(36, 14, '2026-08-28', 11, 36, 13),
(37, 8, '2026-10-13', 8, 37, 11),
(38, 6, '2026-08-31', 1, 38, 12),
(39, 16, '2026-08-11', 8, 39, 13),
(40, 19, '2026-07-25', 18, 40, 11),
(41, 12, '2026-11-22', 0, 41, 12),
(42, 6, '2026-08-21', 6, 42, 13),
(43, 8, '2026-12-09', 2, 43, 11),
(44, 10, '2026-09-04', 0, 44, 12),
(45, 8, '2026-08-08', 6, 45, 13),
(46, 6, '2026-07-10', 5, 46, 11),
(47, 14, '2026-10-23', 6, 47, 12),
(48, 7, '2026-11-28', 2, 48, 13),
(49, 9, '2026-10-20', 5, 49, 11),
(50, 8, '2026-12-04', 7, 50, 12),
(51, 7, '2026-11-06', 5, 51, 13),
(52, 8, '2026-11-24', 3, 52, 11),
(53, 13, '2026-07-26', 3, 53, 12),
(54, 12, '2026-08-21', 9, 54, 13),
(55, 20, '2026-08-04', 5, 55, 11),
(56, 13, '2026-09-02', 11, 56, 12),
(57, 8, '2026-08-12', 4, 57, 13),
(58, 16, '2026-12-20', 16, 58, 11),
(59, 18, '2026-11-17', 16, 59, 12),
(60, 7, '2026-08-31', 3, 60, 13),
(61, 14, '2026-12-23', 3, 61, 11),
(62, 17, '2026-10-10', 13, 62, 12),
(63, 14, '2026-07-19', 8, 63, 13),
(64, 9, '2026-09-21', 4, 64, 11),
(65, 18, '2026-09-24', 18, 65, 12),
(66, 13, '2026-07-25', 3, 66, 13),
(67, 18, '2026-07-10', 0, 67, 11),
(68, 12, '2026-09-19', 0, 68, 12),
(69, 9, '2026-12-17', 0, 69, 13),
(70, 10, '2026-09-07', 2, 70, 11),
(71, 20, '2026-07-03', 8, 71, 12),
(72, 15, '2026-08-20', 9, 72, 13),
(73, 17, '2026-07-30', 11, 73, 11),
(74, 8, '2026-10-08', 5, 74, 12),
(75, 8, '2026-11-13', 4, 75, 13),
(76, 10, '2026-10-24', 3, 76, 11),
(77, 6, '2026-09-29', 0, 77, 12),
(78, 9, '2026-12-03', 2, 78, 13),
(79, 7, '2026-07-05', 6, 79, 11),
(80, 11, '2026-10-05', 5, 80, 12),
(81, 9, '2026-08-09', 8, 81, 13),
(82, 18, '2026-07-06', 2, 82, 11),
(83, 6, '2026-08-24', 1, 83, 12),
(84, 9, '2026-12-06', 5, 84, 13),
(85, 10, '2026-12-13', 1, 85, 11),
(86, 6, '2026-07-30', 3, 86, 12),
(87, 16, '2026-07-21', 13, 87, 13),
(88, 17, '2026-11-05', 11, 88, 11),
(89, 12, '2026-10-05', 8, 89, 12),
(90, 18, '2026-12-13', 17, 90, 13),
(91, 10, '2026-09-27', 5, 91, 11),
(92, 18, '2026-09-08', 3, 92, 12),
(93, 14, '2026-07-17', 3, 93, 13),
(94, 20, '2026-08-26', 1, 94, 11),
(95, 10, '2026-12-06', 5, 95, 12),
(96, 7, '2026-09-17', 4, 96, 13),
(97, 15, '2026-08-24', 7, 97, 11),
(98, 13, '2026-10-22', 10, 98, 12),
(99, 14, '2026-12-02', 0, 99, 13),
(100, 17, '2026-07-20', 8, 100, 11);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `orderID` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `numTravellers` int(11) NOT NULL CHECK (`numTravellers` > 0),
  `status` enum('Pending','Confirmed','Cancelled','Completed') NOT NULL DEFAULT 'Pending',
  `totalPrice` decimal(10,2) NOT NULL CHECK (`totalPrice` > 0),
  `userID` int(11) NOT NULL,
  `packageID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`orderID`, `startDate`, `numTravellers`, `status`, `totalPrice`, `userID`, `packageID`) VALUES
(1, '2026-10-07', 1, 'Completed', 17119.34, 1, 1),
(2, '2026-07-05', 3, 'Confirmed', 31092.21, 2, 2),
(3, '2026-12-28', 4, 'Confirmed', 111185.28, 3, 3),
(4, '2026-09-21', 5, 'Confirmed', 82460.15, 4, 4),
(5, '2026-12-02', 5, 'Pending', 105794.35, 5, 5),
(6, '2026-09-12', 4, 'Confirmed', 43936.16, 6, 6),
(7, '2026-07-18', 5, 'Confirmed', 113261.10, 7, 7),
(8, '2026-10-25', 4, 'Confirmed', 123379.08, 8, 8),
(9, '2026-11-30', 1, 'Completed', 18844.50, 9, 9),
(10, '2026-07-06', 1, 'Cancelled', 15164.20, 10, 10),
(11, '2026-07-22', 2, 'Confirmed', 50642.66, 1, 11),
(12, '2026-08-19', 4, 'Completed', 57965.44, 2, 12),
(13, '2026-12-16', 5, 'Cancelled', 108692.80, 3, 13),
(14, '2026-07-05', 1, 'Pending', 15875.94, 4, 14),
(15, '2026-09-21', 2, 'Confirmed', 37725.20, 5, 15),
(16, '2026-12-18', 1, 'Pending', 18881.01, 6, 16),
(17, '2026-10-19', 3, 'Confirmed', 26622.57, 7, 17),
(18, '2026-08-04', 3, 'Confirmed', 82275.75, 8, 18),
(19, '2026-12-28', 4, 'Pending', 130981.64, 9, 19),
(20, '2026-09-18', 2, 'Confirmed', 49617.98, 10, 20),
(21, '2026-10-07', 1, 'Pending', 5699.12, 1, 21),
(22, '2026-09-07', 5, 'Confirmed', 147950.20, 2, 22),
(23, '2026-09-03', 2, 'Confirmed', 47920.88, 3, 23),
(24, '2026-08-01', 1, 'Completed', 23521.73, 4, 24),
(25, '2026-12-02', 1, 'Confirmed', 9074.48, 5, 25),
(26, '2026-10-30', 4, 'Confirmed', 127996.40, 6, 26),
(27, '2026-09-13', 5, 'Confirmed', 56715.30, 7, 27),
(28, '2026-08-25', 5, 'Confirmed', 85610.15, 8, 28),
(29, '2026-10-23', 3, 'Cancelled', 99721.71, 9, 29),
(30, '2026-09-03', 2, 'Confirmed', 17855.62, 10, 30),
(31, '2026-09-11', 2, 'Confirmed', 56736.52, 1, 31),
(32, '2026-09-23', 5, 'Confirmed', 166183.50, 2, 32),
(33, '2026-11-06', 2, 'Cancelled', 17122.88, 3, 33),
(34, '2026-09-29', 5, 'Cancelled', 173668.25, 4, 34),
(35, '2026-07-19', 2, 'Cancelled', 65448.04, 5, 35),
(36, '2026-10-20', 2, 'Cancelled', 56234.02, 6, 36),
(37, '2026-07-01', 3, 'Completed', 25549.20, 7, 37),
(38, '2026-10-11', 5, 'Pending', 126748.70, 8, 38),
(39, '2026-07-03', 4, 'Pending', 21337.80, 9, 39),
(40, '2026-10-17', 4, 'Pending', 45958.64, 10, 40),
(41, '2026-07-22', 1, 'Confirmed', 29671.01, 1, 41),
(42, '2026-07-23', 2, 'Confirmed', 34843.92, 2, 42),
(43, '2026-08-19', 1, 'Confirmed', 7779.93, 3, 43),
(44, '2026-09-05', 3, 'Confirmed', 79949.40, 4, 44),
(45, '2026-11-20', 2, 'Pending', 23812.58, 5, 45),
(46, '2026-12-05', 1, 'Confirmed', 24600.91, 6, 46),
(47, '2026-07-07', 2, 'Confirmed', 62453.80, 7, 47),
(48, '2026-10-12', 3, 'Cancelled', 34674.36, 8, 48),
(49, '2026-07-11', 4, 'Completed', 105393.92, 9, 49),
(50, '2026-09-03', 4, 'Cancelled', 72575.04, 10, 50),
(51, '2026-12-05', 3, 'Confirmed', 52899.81, 1, 51),
(52, '2026-09-28', 2, 'Pending', 40189.04, 2, 52),
(53, '2026-12-27', 3, 'Completed', 85938.36, 3, 53),
(54, '2026-11-19', 2, 'Confirmed', 65789.84, 4, 54),
(55, '2026-12-08', 5, 'Cancelled', 157236.85, 5, 55),
(56, '2026-10-17', 4, 'Confirmed', 119158.36, 6, 56),
(57, '2026-12-02', 3, 'Cancelled', 49106.28, 7, 57),
(58, '2026-08-15', 5, 'Cancelled', 154406.00, 8, 58),
(59, '2026-09-17', 1, 'Pending', 26444.77, 9, 59),
(60, '2026-12-03', 5, 'Confirmed', 75527.05, 10, 60),
(61, '2026-08-09', 2, 'Confirmed', 10258.68, 1, 61),
(62, '2026-07-12', 1, 'Cancelled', 13862.04, 2, 62),
(63, '2026-09-20', 5, 'Confirmed', 125172.50, 3, 63),
(64, '2026-10-01', 2, 'Cancelled', 49430.00, 4, 64),
(65, '2026-09-23', 1, 'Completed', 11937.10, 5, 65),
(66, '2026-11-18', 3, 'Pending', 50991.06, 6, 66),
(67, '2026-12-18', 3, 'Confirmed', 62857.35, 7, 67),
(68, '2026-08-20', 2, 'Pending', 28632.08, 8, 68),
(69, '2026-08-14', 1, 'Confirmed', 34713.63, 9, 69),
(70, '2026-10-09', 4, 'Cancelled', 131971.00, 10, 70),
(71, '2026-11-17', 4, 'Confirmed', 122174.28, 1, 71),
(72, '2026-11-29', 4, 'Confirmed', 87244.80, 2, 72),
(73, '2026-07-27', 2, 'Confirmed', 56071.68, 3, 73),
(74, '2026-08-04', 1, 'Confirmed', 11008.54, 4, 74),
(75, '2026-12-22', 1, 'Pending', 29191.30, 5, 75),
(76, '2026-10-03', 4, 'Confirmed', 23835.32, 6, 76),
(77, '2026-11-29', 2, 'Cancelled', 27983.22, 7, 77),
(78, '2026-08-01', 5, 'Completed', 167246.90, 8, 78),
(79, '2026-09-13', 3, 'Confirmed', 41565.54, 9, 79),
(80, '2026-08-03', 2, 'Completed', 33906.80, 10, 80),
(81, '2026-08-03', 3, 'Completed', 56474.01, 1, 81),
(82, '2026-12-17', 1, 'Cancelled', 32053.03, 2, 82),
(83, '2026-11-08', 5, 'Confirmed', 83353.35, 3, 83),
(84, '2026-08-06', 2, 'Confirmed', 20730.04, 4, 84),
(85, '2026-11-12', 5, 'Confirmed', 66036.70, 5, 85),
(86, '2026-09-06', 3, 'Confirmed', 49438.89, 6, 86),
(87, '2026-10-07', 1, 'Confirmed', 31787.88, 7, 87),
(88, '2026-07-08', 4, 'Confirmed', 40337.80, 8, 88),
(89, '2026-10-31', 1, 'Confirmed', 12187.19, 9, 89),
(90, '2026-09-16', 2, 'Cancelled', 10924.78, 10, 90),
(91, '2026-07-10', 2, 'Confirmed', 14328.66, 1, 91),
(92, '2026-07-18', 3, 'Cancelled', 15354.66, 2, 92),
(93, '2026-08-03', 3, 'Completed', 39781.74, 3, 93),
(94, '2026-11-15', 1, 'Pending', 14572.56, 4, 94),
(95, '2026-07-04', 2, 'Completed', 18169.14, 5, 95),
(96, '2026-07-04', 4, 'Confirmed', 24337.00, 6, 96),
(97, '2026-12-12', 5, 'Confirmed', 59493.40, 7, 97),
(98, '2026-11-05', 1, 'Confirmed', 30135.01, 8, 98),
(99, '2026-07-12', 5, 'Confirmed', 141254.65, 9, 99),
(100, '2026-08-09', 4, 'Confirmed', 34060.08, 10, 100),
(101, '2024-02-14', 2, 'Completed', 18999.99, 14, 1),
(102, '2024-04-03', 1, 'Completed', 24500.00, 14, 2),
(103, '2024-06-11', 3, 'Completed', 31250.50, 14, 3),
(104, '2024-09-20', 2, 'Completed', 22890.75, 14, 15),
(105, '2025-01-09', 1, 'Completed', 32992.75, 14, 20),
(106, '2025-03-17', 2, 'Completed', 29191.30, 14, 25),
(107, '2025-07-05', 4, 'Completed', 48750.00, 14, 28),
(108, '2025-10-12', 2, 'Completed', 21440.20, 14, 30);

-- --------------------------------------------------------

--
-- Table structure for table `package`
--

CREATE TABLE `package` (
  `packageID` int(11) NOT NULL,
  `type` enum('Adventure','Cultural','Beach','City','Safari','Ski','Cruise','Wellness') NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `pricePerPerson` decimal(10,2) NOT NULL CHECK (`pricePerPerson` > 0),
  `status` enum('Active','Inactive','Draft') NOT NULL DEFAULT 'Draft',
  `duration` int(11) NOT NULL CHECK (`duration` > 0),
  `destinationID` int(11) NOT NULL,
  `agencyID` int(11) NOT NULL,
  `imageURL` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `package`
--

INSERT INTO `package` (`packageID`, `type`, `name`, `description`, `pricePerPerson`, `status`, `duration`, `destinationID`, `agencyID`, `imageURL`) VALUES
(1, 'Adventure', 'Paris Getaway', 'An unforgettable adventure package exploring the highlights of Paris.', 17119.34, 'Active', 12, 1, 11, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'),
(2, 'Cultural', 'Tokyo Explorer', 'An unforgettable cultural package exploring the highlights of Tokyo.', 10364.07, 'Active', 5, 2, 12, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'),
(3, 'Beach', 'Cape Town Experience', 'An unforgettable beach package exploring the highlights of Cape Town.', 27796.32, 'Active', 14, 3, 13, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80'),
(4, 'City', 'Rome Escape', 'An unforgettable city package exploring the highlights of Rome.', 16492.03, 'Draft', 14, 4, 11, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'),
(5, 'Safari', 'Bangkok Discovery', 'An unforgettable safari package exploring the highlights of Bangkok.', 21158.87, 'Inactive', 10, 5, 12, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80'),
(6, 'Ski', 'Sydney Journey', 'An unforgettable ski package exploring the highlights of Sydney.', 10984.04, 'Draft', 12, 6, 13, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80'),
(7, 'Cruise', 'Rio de Janeiro Tour', 'An unforgettable cruise package exploring the highlights of Rio de Janeiro.', 22652.22, 'Active', 9, 7, 11, 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80'),
(8, 'Wellness', 'Nairobi Retreat', 'An unforgettable wellness package exploring the highlights of Nairobi.', 30844.77, 'Active', 5, 8, 12, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'),
(9, 'Adventure', 'New York Holiday', 'An unforgettable adventure package exploring the highlights of New York.', 18844.50, 'Active', 12, 9, 13, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'),
(10, 'Cultural', 'Santorini Expedition', 'An unforgettable cultural package exploring the highlights of Santorini.', 15164.20, 'Draft', 11, 10, 11, 'https://images.unsplash.com/photo-1507501336603-6b9a8f4e7b2e?w=800&q=80'),
(11, 'Beach', 'Barcelona Getaway', 'An unforgettable beach package exploring the highlights of Barcelona.', 25321.33, 'Active', 10, 11, 12, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80'),
(12, 'City', 'Dubai Explorer', 'An unforgettable city package exploring the highlights of Dubai.', 14491.36, 'Active', 7, 12, 13, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'),
(13, 'Safari', 'Marrakech Experience', 'An unforgettable safari package exploring the highlights of Marrakech.', 21738.56, 'Active', 6, 13, 11, 'https://images.unsplash.com/photo-1597211833712-dc8229d4de06?w=800&q=80'),
(14, 'Ski', 'Reykjavik Escape', 'An unforgettable ski package exploring the highlights of Reykjavik.', 15875.94, 'Inactive', 4, 14, 12, 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80'),
(15, 'Cruise', 'Bali Discovery', 'An unforgettable cruise package exploring the highlights of Bali.', 18862.60, 'Active', 12, 15, 13, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'),
(16, 'Wellness', 'Cairo Journey', 'An unforgettable wellness package exploring the highlights of Cairo.', 18881.01, 'Active', 8, 16, 11, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80'),
(17, 'Adventure', 'Lisbon Tour', 'An unforgettable adventure package exploring the highlights of Lisbon.', 8874.19, 'Draft', 5, 17, 12, 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80'),
(18, 'Cultural', 'Istanbul Retreat', 'An unforgettable cultural package exploring the highlights of Istanbul.', 27425.25, 'Active', 12, 18, 13, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80'),
(19, 'Beach', 'Amsterdam Holiday', 'An unforgettable beach package exploring the highlights of Amsterdam.', 32745.41, 'Active', 11, 19, 11, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5702?w=800&q=80'),
(20, 'City', 'Singapore Expedition', 'An unforgettable city package exploring the highlights of Singapore.', 24808.99, 'Active', 4, 20, 12, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80'),
(21, 'Safari', 'Machu Picchu Getaway', 'An unforgettable safari package exploring the highlights of Machu Picchu.', 5699.12, 'Active', 13, 21, 13, 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80'),
(22, 'Ski', 'Buenos Aires Explorer', 'An unforgettable ski package exploring the highlights of Buenos Aires.', 29590.04, 'Active', 9, 22, 11, 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80'),
(23, 'Cruise', 'Mumbai Experience', 'An unforgettable cruise package exploring the highlights of Mumbai.', 23960.44, 'Active', 7, 23, 12, 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80'),
(24, 'Wellness', 'Hanoi Escape', 'An unforgettable wellness package exploring the highlights of Hanoi.', 23521.73, 'Active', 8, 24, 13, 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80'),
(25, 'Adventure', 'Dubrovnik Discovery', 'An unforgettable adventure package exploring the highlights of Dubrovnik.', 9074.48, 'Active', 6, 25, 11, 'https://images.unsplash.com/photo-1555990793-da11153b6ec9?w=800&q=80'),
(26, 'Cultural', 'Mexico City Journey', 'An unforgettable cultural package exploring the highlights of Mexico City.', 31999.10, 'Active', 13, 26, 12, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80'),
(27, 'Beach', 'Vancouver Tour', 'An unforgettable beach package exploring the highlights of Vancouver.', 11343.06, 'Active', 11, 27, 13, 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800&q=80'),
(28, 'City', 'Queenstown Retreat', 'An unforgettable city package exploring the highlights of Queenstown.', 17122.03, 'Active', 8, 28, 11, 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80'),
(29, 'Safari', 'Zanzibar Holiday', 'An unforgettable safari package exploring the highlights of Zanzibar.', 33240.57, 'Active', 3, 29, 12, 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80'),
(30, 'Ski', 'Prague Expedition', 'An unforgettable ski package exploring the highlights of Prague.', 8927.81, 'Draft', 12, 30, 13, 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80'),
(31, 'Cruise', 'Budapest Getaway', 'An unforgettable cruise package exploring the highlights of Budapest.', 28368.26, 'Active', 12, 31, 11, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'),
(32, 'Wellness', 'Vienna Explorer', 'An unforgettable wellness package exploring the highlights of Vienna.', 33236.70, 'Active', 4, 32, 12, 'https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc8?w=800&q=80'),
(33, 'Adventure', 'Zurich Experience', 'An unforgettable adventure package exploring the highlights of Zurich.', 8561.44, 'Active', 5, 33, 13, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'),
(34, 'Cultural', 'Oslo Escape', 'An unforgettable cultural package exploring the highlights of Oslo.', 34733.65, 'Active', 5, 34, 11, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80'),
(35, 'Beach', 'Stockholm Discovery', 'An unforgettable beach package exploring the highlights of Stockholm.', 32724.02, 'Inactive', 8, 35, 12, 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&q=80'),
(36, 'City', 'Copenhagen Journey', 'An unforgettable city package exploring the highlights of Copenhagen.', 28117.01, 'Active', 7, 36, 13, 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80'),
(37, 'Safari', 'Krakow Tour', 'An unforgettable safari package exploring the highlights of Krakow.', 8516.40, 'Active', 5, 37, 11, 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=800&q=80'),
(38, 'Ski', 'Moscow Retreat', 'An unforgettable ski package exploring the highlights of Moscow.', 25349.74, 'Inactive', 7, 38, 12, 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=800&q=80'),
(39, 'Cruise', 'Beijing Holiday', 'An unforgettable cruise package exploring the highlights of Beijing.', 5334.45, 'Active', 8, 39, 13, 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80'),
(40, 'Wellness', 'Seoul Expedition', 'An unforgettable wellness package exploring the highlights of Seoul.', 11489.66, 'Active', 8, 40, 11, 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80'),
(41, 'Adventure', 'Kuala Lumpur Getaway', 'An unforgettable adventure package exploring the highlights of Kuala Lumpur.', 29671.01, 'Active', 9, 41, 12, 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'),
(42, 'Cultural', 'Palawan Explorer', 'An unforgettable cultural package exploring the highlights of Palawan.', 17421.96, 'Active', 11, 42, 13, 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80'),
(43, 'Beach', 'Male Experience', 'An unforgettable beach package exploring the highlights of Male.', 7779.93, 'Active', 8, 43, 11, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80'),
(44, 'City', 'Colombo Escape', 'An unforgettable city package exploring the highlights of Colombo.', 26649.80, 'Active', 10, 44, 12, 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80'),
(45, 'Safari', 'Kathmandu Discovery', 'An unforgettable safari package exploring the highlights of Kathmandu.', 11906.29, 'Draft', 6, 45, 13, 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80'),
(46, 'Ski', 'Petra Journey', 'An unforgettable ski package exploring the highlights of Petra.', 24600.91, 'Active', 4, 46, 11, 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&q=80'),
(47, 'Cruise', 'Jerusalem Tour', 'An unforgettable cruise package exploring the highlights of Jerusalem.', 31226.90, 'Draft', 8, 47, 12, 'https://images.unsplash.com/photo-1544015759-237f8ef76f0c?w=800&q=80'),
(48, 'Wellness', 'Johannesburg Retreat', 'An unforgettable wellness package exploring the highlights of Johannesburg.', 11558.12, 'Draft', 13, 48, 13, 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&q=80'),
(49, 'Adventure', 'Windhoek Holiday', 'An unforgettable adventure package exploring the highlights of Windhoek.', 26348.48, 'Active', 7, 49, 11, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80'),
(50, 'Cultural', 'Maun Expedition', 'An unforgettable cultural package exploring the highlights of Maun.', 18143.76, 'Active', 10, 50, 12, 'https://images.unsplash.com/photo-1516202144-90bbae1d97a5?w=800&q=80'),
(51, 'Beach', 'Paris Getaway', 'An unforgettable beach package exploring the highlights of Paris.', 17633.27, 'Active', 4, 1, 13, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'),
(52, 'City', 'Tokyo Explorer', 'An unforgettable city package exploring the highlights of Tokyo.', 20094.52, 'Draft', 8, 2, 11, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'),
(53, 'Safari', 'Cape Town Experience', 'An unforgettable safari package exploring the highlights of Cape Town.', 28646.12, 'Inactive', 5, 3, 12, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80'),
(54, 'Ski', 'Rome Escape', 'An unforgettable ski package exploring the highlights of Rome.', 32894.92, 'Active', 9, 4, 13, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'),
(55, 'Cruise', 'Bangkok Discovery', 'An unforgettable cruise package exploring the highlights of Bangkok.', 31447.37, 'Active', 13, 5, 11, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80'),
(56, 'Wellness', 'Sydney Journey', 'An unforgettable wellness package exploring the highlights of Sydney.', 29789.59, 'Active', 7, 6, 12, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80'),
(57, 'Adventure', 'Rio de Janeiro Tour', 'An unforgettable adventure package exploring the highlights of Rio de Janeiro.', 16368.76, 'Draft', 12, 7, 13, 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80'),
(58, 'Cultural', 'Nairobi Retreat', 'An unforgettable cultural package exploring the highlights of Nairobi.', 30881.20, 'Inactive', 13, 8, 11, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80'),
(59, 'Beach', 'New York Holiday', 'An unforgettable beach package exploring the highlights of New York.', 26444.77, 'Active', 9, 9, 12, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'),
(60, 'City', 'Santorini Expedition', 'An unforgettable city package exploring the highlights of Santorini.', 15105.41, 'Active', 8, 10, 13, 'https://images.unsplash.com/photo-1507501336603-6b9a8f4e7b2e?w=800&q=80'),
(61, 'Safari', 'Barcelona Getaway', 'An unforgettable safari package exploring the highlights of Barcelona.', 5129.34, 'Active', 14, 11, 11, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80'),
(62, 'Ski', 'Dubai Explorer', 'An unforgettable ski package exploring the highlights of Dubai.', 13862.04, 'Active', 13, 12, 12, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'),
(63, 'Cruise', 'Marrakech Experience', 'An unforgettable cruise package exploring the highlights of Marrakech.', 25034.50, 'Draft', 7, 13, 13, 'https://images.unsplash.com/photo-1597211833712-dc8229d4de06?w=800&q=80'),
(64, 'Wellness', 'Reykjavik Escape', 'An unforgettable wellness package exploring the highlights of Reykjavik.', 24715.00, 'Draft', 14, 14, 11, 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80'),
(65, 'Adventure', 'Bali Discovery', 'An unforgettable adventure package exploring the highlights of Bali.', 11937.10, 'Active', 13, 15, 12, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'),
(66, 'Cultural', 'Cairo Journey', 'An unforgettable cultural package exploring the highlights of Cairo.', 16997.02, 'Active', 11, 16, 13, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80'),
(67, 'Beach', 'Lisbon Tour', 'An unforgettable beach package exploring the highlights of Lisbon.', 20952.45, 'Active', 11, 17, 11, 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80'),
(68, 'City', 'Istanbul Retreat', 'An unforgettable city package exploring the highlights of Istanbul.', 14316.04, 'Draft', 14, 18, 12, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80'),
(69, 'Safari', 'Amsterdam Holiday', 'An unforgettable safari package exploring the highlights of Amsterdam.', 34713.63, 'Inactive', 10, 19, 13, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5702?w=800&q=80'),
(70, 'Ski', 'Singapore Expedition', 'An unforgettable ski package exploring the highlights of Singapore.', 32992.75, 'Active', 14, 20, 11, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80'),
(71, 'Cruise', 'Machu Picchu Getaway', 'An unforgettable cruise package exploring the highlights of Machu Picchu.', 30543.57, 'Active', 10, 21, 12, 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80'),
(72, 'Wellness', 'Buenos Aires Explorer', 'An unforgettable wellness package exploring the highlights of Buenos Aires.', 21811.20, 'Draft', 12, 22, 13, 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80'),
(73, 'Adventure', 'Mumbai Experience', 'An unforgettable adventure package exploring the highlights of Mumbai.', 28035.84, 'Inactive', 7, 23, 11, 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80'),
(74, 'Cultural', 'Hanoi Escape', 'An unforgettable cultural package exploring the highlights of Hanoi.', 11008.54, 'Active', 4, 24, 12, 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80'),
(75, 'Beach', 'Dubrovnik Discovery', 'An unforgettable beach package exploring the highlights of Dubrovnik.', 29191.30, 'Active', 12, 25, 13, 'https://images.unsplash.com/photo-1555990793-da11153b6ec9?w=800&q=80'),
(76, 'City', 'Mexico City Journey', 'An unforgettable city package exploring the highlights of Mexico City.', 5958.83, 'Active', 9, 26, 11, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80'),
(77, 'Safari', 'Vancouver Tour', 'An unforgettable safari package exploring the highlights of Vancouver.', 13991.61, 'Inactive', 13, 27, 12, 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800&q=80'),
(78, 'Ski', 'Queenstown Retreat', 'An unforgettable ski package exploring the highlights of Queenstown.', 33449.38, 'Inactive', 12, 28, 13, 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80'),
(79, 'Cruise', 'Zanzibar Holiday', 'An unforgettable cruise package exploring the highlights of Zanzibar.', 13855.18, 'Active', 9, 29, 11, 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80'),
(80, 'Wellness', 'Prague Expedition', 'An unforgettable wellness package exploring the highlights of Prague.', 16953.40, 'Active', 7, 30, 12, 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80'),
(81, 'Adventure', 'Budapest Getaway', 'An unforgettable adventure package exploring the highlights of Budapest.', 18824.67, 'Active', 5, 31, 13, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'),
(82, 'Cultural', 'Vienna Explorer', 'An unforgettable cultural package exploring the highlights of Vienna.', 32053.03, 'Draft', 14, 32, 11, 'https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc8?w=800&q=80'),
(83, 'Beach', 'Zurich Experience', 'An unforgettable beach package exploring the highlights of Zurich.', 16670.67, 'Inactive', 14, 33, 12, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'),
(84, 'City', 'Oslo Escape', 'An unforgettable city package exploring the highlights of Oslo.', 10365.02, 'Active', 6, 34, 13, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80'),
(85, 'Safari', 'Stockholm Discovery', 'An unforgettable safari package exploring the highlights of Stockholm.', 13207.34, 'Inactive', 14, 35, 11, 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&q=80'),
(86, 'Ski', 'Copenhagen Journey', 'An unforgettable ski package exploring the highlights of Copenhagen.', 16479.63, 'Active', 12, 36, 12, 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80'),
(87, 'Cruise', 'Krakow Tour', 'An unforgettable cruise package exploring the highlights of Krakow.', 31787.88, 'Active', 13, 37, 13, 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=800&q=80'),
(88, 'Wellness', 'Moscow Retreat', 'An unforgettable wellness package exploring the highlights of Moscow.', 10084.45, 'Active', 11, 38, 11, 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=800&q=80'),
(89, 'Adventure', 'Beijing Holiday', 'An unforgettable adventure package exploring the highlights of Beijing.', 12187.19, 'Active', 11, 39, 12, 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80'),
(90, 'Cultural', 'Seoul Expedition', 'An unforgettable cultural package exploring the highlights of Seoul.', 5462.39, 'Active', 10, 40, 13, 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80'),
(91, 'Beach', 'Kuala Lumpur Getaway', 'An unforgettable beach package exploring the highlights of Kuala Lumpur.', 7164.33, 'Draft', 14, 41, 11, 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'),
(92, 'City', 'Palawan Explorer', 'An unforgettable city package exploring the highlights of Palawan.', 5118.22, 'Draft', 11, 42, 12, 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80'),
(93, 'Safari', 'Male Experience', 'An unforgettable safari package exploring the highlights of Male.', 13260.58, 'Active', 12, 43, 13, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80'),
(94, 'Ski', 'Colombo Escape', 'An unforgettable ski package exploring the highlights of Colombo.', 14572.56, 'Active', 5, 44, 11, 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80'),
(95, 'Cruise', 'Kathmandu Discovery', 'An unforgettable cruise package exploring the highlights of Kathmandu.', 9084.57, 'Active', 9, 45, 12, 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80'),
(96, 'Wellness', 'Petra Journey', 'An unforgettable wellness package exploring the highlights of Petra.', 6084.25, 'Active', 11, 46, 13, 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&q=80'),
(97, 'Adventure', 'Jerusalem Tour', 'An unforgettable adventure package exploring the highlights of Jerusalem.', 11898.68, 'Active', 5, 47, 11, 'https://images.unsplash.com/photo-1544015759-237f8ef76f0c?w=800&q=80'),
(98, 'Cultural', 'Johannesburg Retreat', 'An unforgettable cultural package exploring the highlights of Johannesburg.', 30135.01, 'Active', 14, 48, 12, 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&q=80'),
(99, 'Beach', 'Windhoek Holiday', 'An unforgettable beach package exploring the highlights of Windhoek.', 28250.93, 'Active', 6, 49, 13, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80'),
(100, 'City', 'Maun Expedition', 'An unforgettable city package exploring the highlights of Maun.', 8515.02, 'Active', 7, 50, 11, 'https://images.unsplash.com/photo-1516202144-90bbae1d97a5?w=800&q=80'),
(117, 'Adventure', 'Cape Town Ultimate Adventure', 'Experience the best of Cape Town with mountain hikes, coastal tours, wine tasting, and luxury accommodation.', 24999.99, 'Active', 7, 3, 15, 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?q=80&w=1200&auto=format&fit=crop'),
(118, 'Wellness', 'Santorini Sunset Escape', 'Relax with a premium island retreat featuring cliffside villas, sunset cruises, and exclusive dining experiences in Santorini.', 38950.00, 'Active', 6, 10, 15, 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200&auto=format&fit=crop'),
(119, 'Safari', 'Kenya Wildlife Expedition', 'An unforgettable safari experience through the Maasai Mara with guided game drives and luxury tented camps.', 42999.50, 'Active', 8, 8, 15, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop'),
(120, 'City', 'Tokyo Neon Experience', 'Explore the vibrant streets of Tokyo with food tours, anime districts, cultural landmarks, and nightlife.', 31990.75, 'Active', 5, 2, 15, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop'),
(121, 'Beach', 'Bali Wellness Retreat', 'Relax in Bali with yoga sessions, spa treatments, beachfront villas, and guided cultural experiences.', 27880.25, 'Active', 9, 15, 15, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop'),
(122, 'Cultural', 'Rome & Vatican Discovery', 'Immerse yourself in Roman history with guided tours of the Colosseum, Vatican Museums, and authentic Italian cuisine.', 29440.00, 'Active', 6, 4, 15, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop'),
(123, 'Cruise', 'Greek Islands Luxury Cruise', 'Sail across the Greek islands with premium accommodation, island excursions, and fine dining onboard.', 51999.95, 'Draft', 10, 10, 15, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'),
(124, 'Adventure', 'New Zealand Extreme Escape', 'Thrilling adventure package including bungee jumping, mountain excursions, jet boating, and alpine lodges.', 46750.80, 'Active', 8, 28, 15, 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1200&auto=format&fit=crop');

-- --------------------------------------------------------

--
-- Table structure for table `package_accommodation`
--

CREATE TABLE `package_accommodation` (
  `packageID` int(11) NOT NULL,
  `accommodationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `package_accommodation`
--

INSERT INTO `package_accommodation` (`packageID`, `accommodationID`) VALUES
(51, 1),
(1, 2),
(52, 3),
(2, 4),
(53, 5),
(3, 6),
(4, 7),
(54, 7),
(5, 10),
(55, 10),
(6, 11),
(56, 12),
(7, 14),
(57, 14),
(8, 15),
(58, 16),
(9, 17),
(59, 17),
(10, 20),
(60, 20),
(11, 22),
(61, 22),
(12, 23),
(62, 24),
(13, 26),
(63, 26),
(14, 28),
(64, 28),
(65, 29),
(15, 30),
(16, 31),
(66, 32),
(17, 33),
(67, 33),
(18, 35),
(68, 36),
(19, 37),
(69, 37),
(20, 40),
(70, 40),
(21, 41),
(71, 41),
(22, 43),
(72, 43),
(23, 45),
(73, 46),
(24, 47),
(74, 48),
(25, 49),
(75, 49),
(26, 51),
(76, 51),
(27, 54),
(77, 54),
(28, 55),
(78, 56),
(29, 58),
(79, 58),
(30, 59),
(80, 60),
(31, 61),
(81, 62),
(32, 63),
(82, 64),
(33, 65),
(83, 66),
(34, 67),
(84, 68),
(35, 69),
(85, 69),
(36, 71),
(86, 71),
(37, 73),
(87, 74),
(38, 75),
(88, 75),
(39, 77),
(89, 77),
(40, 80),
(90, 80),
(91, 81),
(41, 82),
(92, 83),
(42, 84),
(93, 85),
(43, 86),
(94, 87),
(44, 88),
(45, 90),
(95, 90),
(46, 92),
(96, 92),
(47, 93),
(97, 94),
(98, 95),
(48, 96),
(49, 97),
(99, 97),
(100, 99),
(50, 100);

-- --------------------------------------------------------

--
-- Table structure for table `package_attraction`
--

CREATE TABLE `package_attraction` (
  `packageID` int(11) NOT NULL,
  `destinationID` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `package_attraction`
--

INSERT INTO `package_attraction` (`packageID`, `destinationID`, `name`) VALUES
(1, 1, 'Eiffel Tower'),
(51, 1, 'Louvre Museum'),
(52, 2, 'Senso-ji Temple'),
(2, 2, 'Shibuya Crossing'),
(3, 3, 'Table Mountain'),
(53, 3, 'Table Mountain'),
(4, 4, 'Vatican Museums'),
(54, 4, 'Vatican Museums'),
(5, 5, 'Wat Pho'),
(55, 5, 'Wat Pho'),
(56, 6, 'Bondi Beach'),
(6, 6, 'Sydney Opera House'),
(7, 7, 'Christ the Redeemer'),
(57, 7, 'Christ the Redeemer'),
(58, 8, 'Giraffe Centre'),
(8, 8, 'Maasai Mara Reserve'),
(9, 9, 'Central Park'),
(59, 9, 'Statue of Liberty'),
(60, 10, 'Akrotiri'),
(10, 10, 'Oia Village'),
(11, 11, 'Sagrada Familia'),
(61, 11, 'Sagrada Familia'),
(12, 12, 'Burj Khalifa'),
(62, 12, 'Palm Jumeirah'),
(63, 13, 'Bahia Palace'),
(13, 13, 'Jardin Majorelle'),
(14, 14, 'Blue Lagoon'),
(64, 14, 'Blue Lagoon'),
(15, 15, 'Uluwatu Temple'),
(65, 15, 'Uluwatu Temple'),
(16, 16, 'Egyptian Museum'),
(66, 16, 'Egyptian Museum'),
(17, 17, 'Belem Tower'),
(67, 17, 'Belem Tower'),
(18, 18, 'Grand Bazaar'),
(68, 18, 'Grand Bazaar'),
(69, 19, 'Anne Frank House'),
(19, 19, 'Rijksmuseum'),
(20, 20, 'Gardens by the Bay'),
(70, 20, 'Marina Bay Sands'),
(71, 21, 'Huayna Picchu'),
(21, 21, 'Machu Picchu'),
(22, 22, 'Casa Rosada'),
(72, 22, 'Casa Rosada'),
(23, 23, 'Elephanta Caves'),
(73, 23, 'Gateway of India'),
(24, 24, 'Temple of Literature'),
(74, 24, 'Temple of Literature'),
(75, 25, 'Dubrovnik City Walls'),
(25, 25, 'Fort Lovrijenac'),
(26, 26, 'Frida Kahlo Museum'),
(76, 26, 'Frida Kahlo Museum'),
(27, 27, 'Capilano Suspension Bridge'),
(77, 27, 'Capilano Suspension Bridge'),
(28, 28, 'Bungee Jumping Kawarau'),
(78, 28, 'Bungee Jumping Kawarau'),
(29, 29, 'Nungwi Beach'),
(79, 29, 'Nungwi Beach'),
(30, 30, 'Charles Bridge'),
(80, 30, 'Prague Castle'),
(31, 31, 'Buda Castle'),
(81, 31, 'Buda Castle'),
(32, 32, 'Schonbrunn Palace'),
(82, 32, 'Schonbrunn Palace'),
(33, 33, 'Lake Zurich'),
(83, 33, 'Zurich Old Town'),
(34, 34, 'Vigeland Sculpture Park'),
(84, 34, 'Vigeland Sculpture Park'),
(35, 35, 'Vasa Museum'),
(85, 35, 'Vasa Museum'),
(86, 36, 'Nyhavn'),
(36, 36, 'Tivoli Gardens'),
(37, 37, 'Wawel Castle'),
(87, 37, 'Wawel Castle'),
(38, 38, 'Red Square'),
(88, 38, 'Saint Basils Cathedral'),
(39, 39, 'Great Wall of China'),
(89, 39, 'Great Wall of China'),
(90, 40, 'Gyeongbokgung Palace'),
(40, 40, 'N Seoul Tower'),
(41, 41, 'Batu Caves'),
(91, 41, 'Petronas Twin Towers'),
(42, 42, 'Puerto Princesa Underground River'),
(92, 42, 'Puerto Princesa Underground River'),
(43, 43, 'Male Fish Market'),
(93, 43, 'Male Fish Market'),
(94, 44, 'Sigiriya Rock Fortress'),
(44, 44, 'Temple of the Tooth'),
(45, 45, 'Boudhanath Stupa'),
(95, 45, 'Pashupatinath Temple'),
(46, 46, 'Wadi Rum'),
(96, 46, 'Wadi Rum'),
(97, 47, 'Church of the Holy Sepulchre'),
(47, 47, 'Western Wall'),
(48, 48, 'Apartheid Museum'),
(98, 48, 'Soweto Township'),
(49, 49, 'Sossusvlei Dunes'),
(99, 49, 'Sossusvlei Dunes'),
(50, 50, 'Chobe National Park'),
(100, 50, 'Okavango Delta');

-- --------------------------------------------------------

--
-- Table structure for table `package_flight`
--

CREATE TABLE `package_flight` (
  `packageID` int(11) NOT NULL,
  `flightID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `package_flight`
--

INSERT INTO `package_flight` (`packageID`, `flightID`) VALUES
(1, 1),
(33, 1),
(51, 1),
(83, 1),
(2, 2),
(34, 2),
(52, 2),
(84, 2),
(3, 3),
(35, 3),
(53, 3),
(85, 3),
(4, 4),
(36, 4),
(54, 4),
(86, 4),
(5, 5),
(37, 5),
(55, 5),
(87, 5),
(6, 6),
(38, 6),
(56, 6),
(88, 6),
(7, 7),
(39, 7),
(57, 7),
(89, 7),
(8, 8),
(40, 8),
(58, 8),
(90, 8),
(9, 9),
(41, 9),
(59, 9),
(91, 9),
(10, 10),
(42, 10),
(60, 10),
(92, 10),
(11, 11),
(43, 11),
(61, 11),
(93, 11),
(12, 12),
(44, 12),
(62, 12),
(94, 12),
(13, 13),
(45, 13),
(63, 13),
(95, 13),
(14, 14),
(46, 14),
(64, 14),
(96, 14),
(15, 15),
(47, 15),
(65, 15),
(97, 15),
(16, 16),
(48, 16),
(66, 16),
(98, 16),
(17, 17),
(49, 17),
(67, 17),
(99, 17),
(18, 18),
(50, 18),
(68, 18),
(100, 18),
(19, 19),
(69, 19),
(20, 20),
(70, 20),
(21, 21),
(71, 21),
(22, 22),
(72, 22),
(23, 23),
(73, 23),
(24, 24),
(74, 24),
(25, 25),
(75, 25),
(26, 26),
(76, 26),
(27, 27),
(77, 27),
(28, 28),
(78, 28),
(29, 29),
(79, 29),
(30, 30),
(80, 30),
(31, 31),
(81, 31),
(32, 32),
(82, 32),
(33, 33),
(83, 33),
(34, 34),
(84, 34),
(35, 35),
(85, 35),
(36, 36),
(86, 36),
(37, 37),
(87, 37),
(38, 38),
(88, 38),
(39, 39),
(89, 39),
(40, 40),
(90, 40),
(41, 41),
(91, 41),
(42, 42),
(92, 42),
(43, 43),
(93, 43),
(44, 44),
(94, 44),
(45, 45),
(95, 45),
(46, 46),
(96, 46),
(47, 47),
(97, 47),
(48, 48),
(98, 48),
(49, 49),
(99, 49),
(50, 50),
(100, 50),
(1, 51),
(51, 51),
(2, 52),
(52, 52),
(3, 53),
(53, 53),
(4, 54),
(54, 54),
(5, 55),
(55, 55),
(6, 56),
(56, 56),
(7, 57),
(57, 57),
(8, 58),
(58, 58),
(9, 59),
(59, 59),
(10, 60),
(60, 60),
(11, 61),
(61, 61),
(12, 62),
(62, 62),
(13, 63),
(63, 63),
(14, 64),
(64, 64),
(15, 65),
(65, 65),
(16, 66),
(66, 66),
(17, 67),
(67, 67),
(18, 68),
(68, 68),
(19, 69),
(69, 69),
(20, 70),
(70, 70),
(21, 71),
(71, 71),
(22, 72),
(72, 72),
(23, 73),
(73, 73),
(24, 74),
(74, 74),
(25, 75),
(75, 75),
(26, 76),
(76, 76),
(27, 77),
(77, 77),
(28, 78),
(78, 78),
(29, 79),
(79, 79),
(30, 80),
(80, 80),
(31, 81),
(81, 81),
(32, 82),
(82, 82);

-- --------------------------------------------------------

--
-- Table structure for table `package_restaurant`
--

CREATE TABLE `package_restaurant` (
  `packageID` int(11) NOT NULL,
  `restaurantID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `package_restaurant`
--

INSERT INTO `package_restaurant` (`packageID`, `restaurantID`) VALUES
(1, 1),
(51, 2),
(52, 3),
(2, 4),
(3, 6),
(53, 6),
(4, 7),
(54, 7),
(5, 9),
(55, 9),
(6, 12),
(56, 12),
(7, 14),
(57, 14),
(8, 15),
(58, 15),
(59, 17),
(9, 18),
(60, 19),
(10, 20),
(61, 21),
(11, 22),
(12, 23),
(62, 23),
(13, 25),
(63, 25),
(14, 27),
(64, 28),
(15, 29),
(65, 30),
(16, 31),
(66, 31),
(17, 33),
(67, 33),
(68, 35),
(18, 36),
(69, 37),
(19, 38),
(70, 39),
(20, 40),
(21, 41),
(71, 41),
(22, 43),
(72, 43),
(23, 45),
(73, 45),
(74, 47),
(24, 48),
(75, 49),
(25, 50),
(76, 51),
(26, 52),
(27, 53),
(77, 53),
(28, 56),
(78, 56),
(29, 57),
(79, 58),
(30, 59),
(80, 60),
(31, 61),
(81, 61),
(32, 64),
(82, 64),
(33, 66),
(83, 66),
(34, 67),
(84, 67),
(35, 69),
(85, 70),
(36, 71),
(86, 71),
(37, 73),
(87, 74),
(38, 75),
(88, 75),
(39, 78),
(89, 78),
(40, 80),
(90, 80),
(91, 81),
(41, 82),
(42, 84),
(92, 84),
(43, 85),
(93, 85),
(44, 87),
(94, 88),
(45, 89),
(95, 90),
(96, 91),
(46, 92),
(97, 93),
(47, 94),
(98, 95),
(48, 96),
(99, 97),
(49, 98),
(50, 99),
(100, 100);

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

CREATE TABLE `restaurant` (
  `restaurantID` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `priceRange` enum('$','$$','$$$','$$$$') NOT NULL,
  `cuisine` varchar(100) DEFAULT NULL,
  `destinationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`restaurantID`, `name`, `priceRange`, `cuisine`, `destinationID`) VALUES
(1, 'Le Cinq', '$$$$', 'French', 1),
(2, 'Septime', '$$$', 'Modern French', 1),
(3, 'Sukiyabashi Jiro', '$$$$', 'Japanese', 2),
(4, 'Narisawa', '$$$$', 'Innovative Japanese', 2),
(5, 'La Colombe', '$$$', 'Contemporary', 3),
(6, 'The Test Kitchen', '$$$$', 'Modern', 3),
(7, 'Osteria Francescana', '$$$$', 'Italian', 4),
(8, 'Da Enzo al 29', '$$', 'Roman', 4),
(9, 'Gaggan', '$$$', 'Progressive Indian', 5),
(10, 'Bo.lan', '$$$', 'Thai', 5),
(11, 'Quay Restaurant', '$$$', 'Modern Australian', 6),
(12, 'Tetsuyas', '$$$$', 'Japanese-French', 6),
(13, 'Olympe', '$$$', 'French-Brazilian', 7),
(14, 'Aprazivel', '$$$', 'Brazilian', 7),
(15, 'Carnivore Restaurant', '$$', 'African Grill', 8),
(16, 'Talisman Restaurant', '$$$', 'International', 8),
(17, 'Per Se', '$$$$', 'American', 9),
(18, 'Le Bernardin', '$$$$', 'French Seafood', 9),
(19, 'Selene Restaurant', '$$$', 'Greek', 10),
(20, 'Metaxy Mas', '$$', 'Cycladic', 10),
(21, 'El Celler de Can Roca', '$$$$', 'Catalan', 11),
(22, 'Tickets', '$$$', 'Avant-garde Tapas', 11),
(23, 'Nobu Dubai', '$$$$', 'Japanese-Peruvian', 12),
(24, 'Zuma Dubai', '$$$', 'Japanese', 12),
(25, 'Le Foundouk', '$$$', 'Moroccan-French', 13),
(26, 'Nomad Restaurant', '$$', 'Modern Moroccan', 13),
(27, 'Dill Restaurant', '$$$$', 'New Nordic', 14),
(28, 'Fiskmarkadurinn', '$$$', 'Seafood', 14),
(29, 'Locavore', '$$$', 'Modern Indonesian', 15),
(30, 'Mozaic Restaurant', '$$$$', 'French-Indonesian', 15),
(31, 'Koshary Abou Tarek', '$', 'Egyptian', 16),
(32, 'Sequoia', '$$$', 'Mediterranean', 16),
(33, 'Belcanto', '$$$$', 'Contemporary Portuguese', 17),
(34, 'Time Out Market', '$$', 'Various', 17),
(35, 'Mikla', '$$$', 'Modern Turkish', 18),
(36, 'Karakoy Lokantasi', '$$', 'Turkish', 18),
(37, 'De Librije', '$$$$', 'Dutch', 19),
(38, 'Rijsel', '$$', 'French-Belgian', 19),
(39, 'Odette', '$$$$', 'French', 20),
(40, 'Burnt Ends', '$$$', 'Modern Australian BBQ', 20),
(41, 'Indio Feliz', '$$', 'Peruvian-French', 21),
(42, 'Tinkuy Buffet', '$$$', 'Andean', 21),
(43, 'Don Julio', '$$$', 'Argentine Grill', 22),
(44, 'El Baqueano', '$$$', 'Contemporary Argentine', 22),
(45, 'Trishna', '$$$', 'Seafood', 23),
(46, 'Khyber Restaurant', '$$$', 'North Indian', 23),
(47, 'Cha Ca La Vong', '$$', 'Vietnamese', 24),
(48, 'Green Tangerine', '$$$', 'French-Vietnamese', 24),
(49, 'Restaurant 360', '$$$$', 'Mediterranean', 25),
(50, 'Nautika Restaurant', '$$$', 'Croatian Seafood', 25),
(51, 'Pujol', '$$$$', 'Mexican', 26),
(52, 'Contramar', '$$$', 'Seafood', 26),
(53, 'Hawksworth Restaurant', '$$$$', 'Contemporary Canadian', 27),
(54, 'Miku Restaurant', '$$$', 'Japanese', 27),
(55, 'Botswana Butchery', '$$$', 'New Zealand', 28),
(56, 'Rata Restaurant', '$$$', 'Modern New Zealand', 28),
(57, 'The Rock Restaurant', '$$$', 'Seafood', 29),
(58, 'Emerson Spice', '$$$', 'Swahili', 29),
(59, 'La Degustation', '$$$$', 'Czech', 30),
(60, 'Lokál', '$$', 'Czech Pub', 30),
(61, 'Onyx Restaurant', '$$$$', 'Hungarian', 31),
(62, 'Borkonyha', '$$$', 'Hungarian Wine Kitchen', 31),
(63, 'Steirereck', '$$$$', 'Austrian', 32),
(64, 'Figlmuller', '$$', 'Viennese Schnitzel', 32),
(65, 'Restaurant Clouds', '$$$', 'Swiss', 33),
(66, 'Kronenhalle', '$$$', 'Classic Zurich', 33),
(67, 'Maaemo', '$$$$', 'New Nordic', 34),
(68, 'Restaurant Eik', '$$$', 'Norwegian', 34),
(69, 'Frantzen', '$$$$', 'Swedish', 35),
(70, 'Mathias Dahlgren', '$$$', 'Nordic', 35),
(71, 'Geranium', '$$$$', 'New Nordic', 36),
(72, 'Kadeau', '$$$', 'Danish', 36),
(73, 'Copernicus Restaurant', '$$$', 'Polish', 37),
(74, 'Miod Malina', '$$', 'Traditional Polish', 37),
(75, 'White Rabbit', '$$$$', 'Modern Russian', 38),
(76, 'Cafe Pushkin', '$$$', 'Russian', 38),
(77, 'Duck de Chine', '$$$', 'Peking Duck', 39),
(78, 'Ultraviolet', '$$$$', 'Avant-garde', 39),
(79, 'Jungsik Seoul', '$$$$', 'Modern Korean', 40),
(80, 'Mingles', '$$$$', 'Korean Fusion', 40),
(81, 'Dewakan', '$$$', 'Modern Malaysian', 41),
(82, 'Nadodi', '$$$', 'South Indian', 41),
(83, 'Auro Restaurant', '$$$', 'Filipino', 42),
(84, 'Gallery Vask', '$$$$', 'Modern Filipino', 42),
(85, 'Ithaa Undersea Restaurant', '$$$$', 'International', 43),
(86, 'Vilu Restaurant', '$$$', 'Maldivian', 43),
(87, 'Ministry of Crab', '$$$', 'Seafood', 44),
(88, 'Nihonbashi', '$$$', 'Japanese', 44),
(89, 'Dwarika Hotel Restaurant', '$$$', 'Nepali', 45),
(90, 'Krishnarpan', '$$$$', 'Traditional Nepali', 45),
(91, 'Sufra', '$$$', 'Jordanian', 46),
(92, 'Fakhr El-Din', '$$$$', 'Lebanese', 46),
(93, 'Machneyuda', '$$$', 'Israeli', 47),
(94, 'Messa', '$$$$', 'Modern Israeli', 47),
(95, 'The Marabi Club', '$$$', 'Pan-African', 48),
(96, 'Nambitha', '$$', 'South African', 48),
(97, 'The Stellenbosch Kitchen', '$$$', 'South African', 49),
(98, 'Olivia', '$$$$', 'Contemporary Namibian', 49),
(99, 'Bon Appetit', '$$$', 'Continental', 50),
(100, 'Caravanserai', '$$', 'Botswanan', 50);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `reviewID` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `starRating` tinyint(4) NOT NULL CHECK (`starRating` between 1 and 5),
  `reviewDate` date NOT NULL,
  `userID` int(11) NOT NULL,
  `packageID` int(11) NOT NULL,
  `agencyID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`reviewID`, `comment`, `starRating`, `reviewDate`, `userID`, `packageID`, `agencyID`) VALUES
(1, 'Absolutely fantastic trip from start to finish. The agency handled everything perfectly.', 5, '2027-02-23', 1, 1, 11),
(2, 'Great itinerary and excellent accommodation choices throughout the journey.', 5, '2026-08-12', 2, 2, 12),
(3, 'Really enjoyed this package. The local guides were knowledgeable and friendly.', 4, '2027-02-16', 3, 3, 13),
(4, 'Good value for money overall. A few logistical hiccups but nothing that ruined the trip.', 4, '2027-03-02', 4, 4, 11),
(5, 'The destination was stunning but some of the restaurant choices felt underwhelming.', 3, '2027-02-02', 5, 5, 12),
(6, 'An unforgettable experience. Would book with this agency again without hesitation.', 5, '2026-11-28', 6, 6, 13),
(7, 'Very well organised trip. Loved every single day of the itinerary.', 5, '2026-11-05', 7, 7, 11),
(8, 'Decent package but the flight times were inconvenient and tiring.', 3, '2026-09-22', 8, 8, 12),
(9, 'The accommodation was absolutely beautiful and the views were breathtaking.', 5, '2027-02-09', 9, 9, 13),
(10, 'Some activities felt rushed. Would have preferred more free time to explore.', 3, '2026-12-13', 10, 10, 11),
(11, 'Excellent communication from the agency before and during the trip.', 4, '2026-07-16', 1, 11, 12),
(12, 'The food recommendations were spot on. Every restaurant was exceptional.', 5, '2027-01-24', 2, 12, 13),
(13, 'Good trip overall but the group was slightly too large for a personal experience.', 3, '2027-02-08', 3, 13, 11),
(14, 'Incredible safari. Saw all of the Big Five within the first two days.', 5, '2027-01-11', 4, 14, 12),
(15, 'The city tour was well paced and covered all the major highlights.', 4, '2027-02-04', 5, 15, 13),
(16, 'Loved the blend of cultural activities and leisure time built into the schedule.', 4, '2026-07-19', 6, 16, 11),
(17, 'The package was slightly overpriced for what was offered at this time of year.', 2, '2026-09-26', 7, 17, 12),
(18, 'Would highly recommend this package to couples looking for a romantic getaway.', 5, '2026-07-25', 8, 18, 13),
(19, 'The travel agency was responsive and professional from booking to return.', 4, '2026-12-18', 9, 19, 11),
(20, 'One of the best travel experiences of my life. Already planning a return trip.', 5, '2026-07-19', 10, 20, 12),
(21, 'Absolutely fantastic trip from start to finish. The agency handled everything perfectly.', 5, '2027-01-02', 1, 21, 13),
(22, 'Great itinerary and excellent accommodation choices throughout the journey.', 5, '2026-09-12', 2, 22, 11),
(23, 'Really enjoyed this package. The local guides were knowledgeable and friendly.', 4, '2026-12-03', 3, 23, 12),
(24, 'Good value for money overall. A few logistical hiccups but nothing that ruined the trip.', 4, '2026-10-19', 4, 24, 13),
(25, 'The destination was stunning but some of the restaurant choices felt underwhelming.', 3, '2027-02-13', 5, 25, 11),
(26, 'An unforgettable experience. Would book with this agency again without hesitation.', 5, '2026-10-14', 6, 26, 12),
(27, 'Very well organised trip. Loved every single day of the itinerary.', 5, '2027-03-08', 7, 27, 13),
(28, 'Decent package but the flight times were inconvenient and tiring.', 3, '2027-01-21', 8, 28, 11),
(29, 'The accommodation was absolutely beautiful and the views were breathtaking.', 5, '2026-11-15', 9, 29, 12),
(30, 'Some activities felt rushed. Would have preferred more free time to explore.', 3, '2027-01-22', 10, 30, 13),
(31, 'Excellent communication from the agency before and during the trip.', 4, '2026-08-14', 1, 31, 11),
(32, 'The food recommendations were spot on. Every restaurant was exceptional.', 5, '2026-09-21', 2, 32, 12),
(33, 'Good trip overall but the group was slightly too large for a personal experience.', 3, '2026-12-04', 3, 33, 13),
(34, 'Incredible safari. Saw all of the Big Five within the first two days.', 5, '2026-10-08', 4, 34, 11),
(35, 'The city tour was well paced and covered all the major highlights.', 4, '2027-01-05', 5, 35, 12),
(36, 'Loved the blend of cultural activities and leisure time built into the schedule.', 4, '2027-02-24', 6, 36, 13),
(37, 'The package was slightly overpriced for what was offered at this time of year.', 2, '2026-08-18', 7, 37, 11),
(38, 'Would highly recommend this package to couples looking for a romantic getaway.', 5, '2027-01-03', 8, 38, 12),
(39, 'The travel agency was responsive and professional from booking to return.', 4, '2027-03-03', 9, 39, 13),
(40, 'One of the best travel experiences of my life. Already planning a return trip.', 5, '2026-07-19', 10, 40, 11),
(41, 'Absolutely fantastic trip from start to finish. The agency handled everything perfectly.', 5, '2027-01-28', 1, 41, 12),
(42, 'Great itinerary and excellent accommodation choices throughout the journey.', 5, '2026-10-03', 2, 42, 13),
(43, 'Really enjoyed this package. The local guides were knowledgeable and friendly.', 4, '2026-12-05', 3, 43, 11),
(44, 'Good value for money overall. A few logistical hiccups but nothing that ruined the trip.', 4, '2027-02-06', 4, 44, 12),
(45, 'The destination was stunning but some of the restaurant choices felt underwhelming.', 3, '2026-10-14', 5, 45, 13),
(46, 'An unforgettable experience. Would book with this agency again without hesitation.', 5, '2026-11-25', 6, 46, 11),
(47, 'Very well organised trip. Loved every single day of the itinerary.', 5, '2027-02-11', 7, 47, 12),
(48, 'Decent package but the flight times were inconvenient and tiring.', 3, '2026-08-31', 8, 48, 13),
(49, 'The accommodation was absolutely beautiful and the views were breathtaking.', 5, '2026-12-28', 9, 49, 11),
(50, 'Some activities felt rushed. Would have preferred more free time to explore.', 3, '2026-10-25', 10, 50, 12),
(51, 'Excellent communication from the agency before and during the trip.', 4, '2026-12-31', 1, 51, 13),
(52, 'The food recommendations were spot on. Every restaurant was exceptional.', 5, '2026-09-16', 2, 52, 11),
(53, 'Good trip overall but the group was slightly too large for a personal experience.', 3, '2026-08-25', 3, 53, 12),
(54, 'Incredible safari. Saw all of the Big Five within the first two days.', 5, '2026-11-19', 4, 54, 13),
(55, 'The city tour was well paced and covered all the major highlights.', 4, '2026-09-14', 5, 55, 11),
(56, 'Loved the blend of cultural activities and leisure time built into the schedule.', 4, '2026-11-10', 6, 56, 12),
(57, 'The package was slightly overpriced for what was offered at this time of year.', 2, '2027-02-11', 7, 57, 13),
(58, 'Would highly recommend this package to couples looking for a romantic getaway.', 5, '2026-07-31', 8, 58, 11),
(59, 'The travel agency was responsive and professional from booking to return.', 4, '2026-10-18', 9, 59, 12),
(60, 'One of the best travel experiences of my life. Already planning a return trip.', 5, '2027-01-08', 10, 60, 13),
(61, 'Absolutely fantastic trip from start to finish. The agency handled everything perfectly.', 5, '2026-10-24', 1, 61, 11),
(62, 'Great itinerary and excellent accommodation choices throughout the journey.', 5, '2027-01-11', 2, 62, 12),
(63, 'Really enjoyed this package. The local guides were knowledgeable and friendly.', 4, '2026-09-15', 3, 63, 13),
(64, 'Good value for money overall. A few logistical hiccups but nothing that ruined the trip.', 4, '2026-12-13', 4, 64, 11),
(65, 'The destination was stunning but some of the restaurant choices felt underwhelming.', 3, '2026-09-26', 5, 65, 12),
(66, 'An unforgettable experience. Would book with this agency again without hesitation.', 5, '2026-11-10', 6, 66, 13),
(67, 'Very well organised trip. Loved every single day of the itinerary.', 5, '2026-07-11', 7, 67, 11),
(68, 'Decent package but the flight times were inconvenient and tiring.', 3, '2026-11-30', 8, 68, 12),
(69, 'The accommodation was absolutely beautiful and the views were breathtaking.', 5, '2026-08-24', 9, 69, 13),
(70, 'Some activities felt rushed. Would have preferred more free time to explore.', 3, '2027-01-24', 10, 70, 11),
(71, 'Excellent communication from the agency before and during the trip.', 4, '2026-07-18', 1, 71, 12),
(72, 'The food recommendations were spot on. Every restaurant was exceptional.', 5, '2027-01-06', 2, 72, 13),
(73, 'Good trip overall but the group was slightly too large for a personal experience.', 3, '2026-09-13', 3, 73, 11),
(74, 'Incredible safari. Saw all of the Big Five within the first two days.', 5, '2026-09-08', 4, 74, 12),
(75, 'The city tour was well paced and covered all the major highlights.', 4, '2026-08-24', 5, 75, 13),
(76, 'Loved the blend of cultural activities and leisure time built into the schedule.', 4, '2027-02-27', 6, 76, 11),
(77, 'The package was slightly overpriced for what was offered at this time of year.', 2, '2026-12-30', 7, 77, 12),
(78, 'Would highly recommend this package to couples looking for a romantic getaway.', 5, '2027-02-20', 8, 78, 13),
(79, 'The travel agency was responsive and professional from booking to return.', 4, '2027-01-09', 9, 79, 11),
(80, 'One of the best travel experiences of my life. Already planning a return trip.', 5, '2027-02-11', 10, 80, 12),
(81, 'Absolutely fantastic trip from start to finish. The agency handled everything perfectly.', 5, '2026-07-15', 1, 81, 13),
(82, 'Great itinerary and excellent accommodation choices throughout the journey.', 5, '2026-08-20', 2, 82, 11),
(83, 'Really enjoyed this package. The local guides were knowledgeable and friendly.', 4, '2026-11-23', 3, 83, 12),
(84, 'Good value for money overall. A few logistical hiccups but nothing that ruined the trip.', 4, '2027-02-16', 4, 84, 13),
(85, 'The destination was stunning but some of the restaurant choices felt underwhelming.', 3, '2026-09-05', 5, 85, 11),
(86, 'An unforgettable experience. Would book with this agency again without hesitation.', 5, '2026-09-25', 6, 86, 12),
(87, 'Very well organised trip. Loved every single day of the itinerary.', 5, '2026-09-14', 7, 87, 13),
(88, 'Decent package but the flight times were inconvenient and tiring.', 3, '2026-10-01', 8, 88, 11),
(89, 'The accommodation was absolutely beautiful and the views were breathtaking.', 5, '2026-10-19', 9, 89, 12),
(90, 'Some activities felt rushed. Would have preferred more free time to explore.', 3, '2026-10-10', 10, 90, 13),
(91, 'Excellent communication from the agency before and during the trip.', 4, '2026-10-21', 1, 91, 11),
(92, 'The food recommendations were spot on. Every restaurant was exceptional.', 5, '2026-08-21', 2, 92, 12),
(93, 'Good trip overall but the group was slightly too large for a personal experience.', 3, '2027-02-22', 3, 93, 13),
(94, 'Incredible safari. Saw all of the Big Five within the first two days.', 5, '2026-09-16', 4, 94, 11),
(95, 'The city tour was well paced and covered all the major highlights.', 4, '2026-10-14', 5, 95, 12),
(96, 'Loved the blend of cultural activities and leisure time built into the schedule.', 4, '2027-01-27', 6, 96, 13),
(97, 'The package was slightly overpriced for what was offered at this time of year.', 2, '2026-08-22', 7, 97, 11),
(98, 'Would highly recommend this package to couples looking for a romantic getaway.', 5, '2026-07-12', 8, 98, 12),
(99, 'The travel agency was responsive and professional from booking to return.', 4, '2026-08-19', 9, 99, 13),
(100, 'One of the best travel experiences of my life. Already planning a return trip.', 5, '2026-11-28', 10, 100, 11),
(101, 'Absolutely incredible experience. The Eiffel Tower views at night were unforgettable and the accommodation exceeded expectations.', 5, '2024-02-25', 14, 1, 1),
(102, 'Tokyo was extremely well organised. Loved the mix of modern city life and cultural experiences. Would definitely book again.', 5, '2024-04-15', 14, 2, 2),
(103, 'Cape Town was beautiful and the itinerary was packed with activities. Table Mountain and Robben Island were highlights.', 4, '2024-06-22', 14, 3, 3),
(104, 'Bali was relaxing and scenic. The rice terraces and temple visits were amazing, although airport transfers were slightly delayed.', 4, '2024-10-02', 14, 15, 4),
(105, 'Singapore was one of the cleanest and easiest trips I have taken. Marina Bay Sands and Gardens by the Bay were spectacular.', 5, '2025-01-18', 14, 20, 2),
(106, 'Dubrovnik had stunning coastal views and a fantastic old city atmosphere. Great balance between relaxation and exploration.', 5, '2025-03-28', 14, 25, 5),
(107, 'Queenstown was pure adrenaline. The adventure activities were excellent and the mountain scenery was unreal.', 5, '2025-07-17', 14, 28, 3),
(108, 'Prague had incredible architecture and nightlife. The tour guides were knowledgeable and the food recommendations were excellent.', 4, '2025-10-21', 14, 30, 1);

-- --------------------------------------------------------

--
-- Table structure for table `traveller`
--

CREATE TABLE `traveller` (
  `userID` int(11) NOT NULL,
  `paymentID` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `traveller`
--

INSERT INTO `traveller` (`userID`, `paymentID`) VALUES
(1, 'PAY_001'),
(2, 'PAY_002'),
(3, 'PAY_003'),
(4, 'PAY_004'),
(5, 'PAY_005'),
(6, 'PAY_006'),
(7, 'PAY_007'),
(8, 'PAY_008'),
(9, 'PAY_009'),
(10, 'PAY_010'),
(14, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `traveller_group_trip`
--

CREATE TABLE `traveller_group_trip` (
  `userID` int(11) NOT NULL,
  `tripID` int(11) NOT NULL,
  `joinDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `traveller_group_trip`
--

INSERT INTO `traveller_group_trip` (`userID`, `tripID`, `joinDate`) VALUES
(1, 1, '2026-05-31'),
(1, 11, '2026-05-13'),
(1, 21, '2026-06-13'),
(1, 31, '2026-05-27'),
(1, 41, '2026-05-07'),
(1, 51, '2026-05-28'),
(1, 61, '2026-06-01'),
(1, 71, '2026-06-12'),
(1, 81, '2026-06-18'),
(1, 91, '2026-05-10'),
(2, 2, '2026-05-31'),
(2, 12, '2026-05-22'),
(2, 22, '2026-06-08'),
(2, 32, '2026-05-23'),
(2, 42, '2026-05-16'),
(2, 52, '2026-05-16'),
(2, 62, '2026-05-26'),
(2, 72, '2026-06-06'),
(2, 82, '2026-05-12'),
(2, 92, '2026-06-01'),
(3, 3, '2026-05-19'),
(3, 13, '2026-06-07'),
(3, 23, '2026-05-11'),
(3, 33, '2026-06-20'),
(3, 43, '2026-06-11'),
(3, 53, '2026-05-23'),
(3, 63, '2026-05-15'),
(3, 73, '2026-06-11'),
(3, 83, '2026-06-10'),
(3, 93, '2026-05-30'),
(4, 4, '2026-06-18'),
(4, 14, '2026-05-11'),
(4, 24, '2026-06-21'),
(4, 34, '2026-05-29'),
(4, 44, '2026-06-19'),
(4, 54, '2026-05-07'),
(4, 64, '2026-06-17'),
(4, 74, '2026-05-29'),
(4, 84, '2026-06-30'),
(4, 94, '2026-05-31'),
(5, 5, '2026-06-24'),
(5, 15, '2026-06-15'),
(5, 25, '2026-05-31'),
(5, 35, '2026-06-05'),
(5, 45, '2026-05-17'),
(5, 55, '2026-05-13'),
(5, 65, '2026-05-18'),
(5, 75, '2026-06-09'),
(5, 85, '2026-05-11'),
(5, 95, '2026-05-13'),
(6, 6, '2026-06-01'),
(6, 16, '2026-06-10'),
(6, 26, '2026-05-15'),
(6, 36, '2026-05-22'),
(6, 46, '2026-06-21'),
(6, 56, '2026-05-05'),
(6, 66, '2026-05-30'),
(6, 76, '2026-06-26'),
(6, 86, '2026-06-01'),
(6, 96, '2026-05-31'),
(7, 7, '2026-06-11'),
(7, 17, '2026-05-05'),
(7, 27, '2026-06-03'),
(7, 37, '2026-05-23'),
(7, 47, '2026-05-26'),
(7, 57, '2026-06-17'),
(7, 67, '2026-05-23'),
(7, 77, '2026-06-12'),
(7, 87, '2026-06-07'),
(7, 97, '2026-06-14'),
(8, 8, '2026-05-22'),
(8, 18, '2026-06-03'),
(8, 28, '2026-05-09'),
(8, 38, '2026-05-15'),
(8, 48, '2026-05-12'),
(8, 58, '2026-05-05'),
(8, 68, '2026-06-03'),
(8, 78, '2026-05-29'),
(8, 88, '2026-05-25'),
(8, 98, '2026-06-04'),
(9, 9, '2026-06-17'),
(9, 19, '2026-05-27'),
(9, 29, '2026-06-21'),
(9, 39, '2026-06-16'),
(9, 49, '2026-05-17'),
(9, 59, '2026-05-07'),
(9, 69, '2026-05-02'),
(9, 79, '2026-05-22'),
(9, 89, '2026-06-15'),
(9, 99, '2026-06-02'),
(10, 10, '2026-06-11'),
(10, 20, '2026-06-06'),
(10, 30, '2026-06-15'),
(10, 40, '2026-05-06'),
(10, 50, '2026-06-16'),
(10, 60, '2026-06-11'),
(10, 70, '2026-05-13'),
(10, 80, '2026-05-19'),
(10, 90, '2026-06-24'),
(10, 100, '2026-06-09');

-- --------------------------------------------------------

--
-- Table structure for table `travel_agency`
--

CREATE TABLE `travel_agency` (
  `userID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `street` varchar(100) DEFAULT NULL,
  `suburb` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `travel_agency`
--

INSERT INTO `travel_agency` (`userID`, `name`, `street`, `suburb`, `city`, `country`) VALUES
(11, 'Sunrise Travels', '12 Sun Street', 'Sandton', 'Johannesburg', 'South Africa'),
(12, 'Global Getaways', '45 Globe Avenue', 'Sea Point', 'Cape Town', 'South Africa'),
(13, 'Epic Voyages', '7 Adventure Road', 'Hatfield', 'Pretoria', 'South Africa'),
(15, 'Tripistry Adventures', '15 Ocean View Drive', 'Sea Point', 'Cape Town', 'South Africa');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) NOT NULL,
  `emailAddress` varchar(100) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `apiKey` varchar(255) NOT NULL,
  `userType` enum('Traveller','Agency') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `firstName`, `middleName`, `lastName`, `emailAddress`, `phoneNumber`, `password`, `salt`, `apiKey`, `userType`) VALUES
(1, 'James', '', 'Smith', 'james.smith@gmail.com', '+27821234501', '7d935b0fcbbe33703d74d03168b29ec1157381687dc569522367eb5907a0a603', '19a73186236db51ca038ee2e835345ce', 'Rk/e/Lc6VGscZcl36ycQKKLzm3FjkXvEh/MVNjWjoo5UObrE', 'Traveller'),
(2, 'Sarah', 'Brittany', 'Johnson', 'sarah.johnson@gmail.com', '+27831234502', '37d48eeca3c50b608ce6e53b5b921050b44b3011d841d3bd51f4d1efcb5b9ecd', '1091388eadb275d71f06e4be91c99336', 'ldcZu9CTmoAVL5o0vdVeRd1zoKfM5w4AqmtDZw2YMoFOinUJ', 'Traveller'),
(3, 'Michael', NULL, 'Williams', 'mwilliams@outlook.com', '+27841234503', 'df74d5444469cdd66f93078d3158934f9617e33a28e3f22cf5418a6ee34489a5', '0ded2d656767ce3711a2d4c760e0f906', 'tuyIjYBnidE4cezcKuSowGrLHTd+iOSaERlgdrkeXYDmV2bt', 'Traveller'),
(4, 'Emily', 'Camilla', 'Brown', 'emily.brown@gmail.com', '+27851234504', '960f9dbd9a9e24251b6438e7bf22456a2661488a3604ba9978f0cc3d1280eb43', '3cb6fb35a56dbed204abe49aec8bc6b1', '2HjoV08eyKwh2vbCvUApAh1eeUMuu9P35vjparMQkPEKtPPW', 'Traveller'),
(5, 'David', NULL, 'Jones', 'david.jones@yahoo.com', '+27861234505', '01ccded9e5abd0dfbc745245e6d675ae72f5200a9dd6c14042df419d4602bad7', '1002a4c115dfed42b179b380df1d0368', 'vyEt0D0FpR1mIaH/93E/NG6PPKwnWmA3VhGxv3UxIWPM4kdm', 'Traveller'),
(6, 'Jessica', '', 'Garcia', 'jessica.garcia@gmail.com', '+27871234506', 'a58a8a6d4c4d675d9e3cb04d7c7637d566f4e52efcd6782dc8496feabb8a7f21', '82ee3ffb6fdedf79891cd52634348921', 'ZJhzfRfeDWH3THYLAxBgDHZoMw2EPTs4XE6crhW6OTygnA36', 'Traveller'),
(7, 'Chris', NULL, 'Martinez', 'chris.martinez@outlook.com', '+27881234507', '4a87c2834ab574727e9d46ee78127b84f9673b80001d69a111994ecd58a64008', 'a9ebad930b9f3619e51ac215c9abcd58', 'MCX6t/SjR3bdIsFYQP4geHM9m1h8R300TYBKWTJY7dT3nAgZ', 'Traveller'),
(8, 'Amanda', 'Emily', 'Davis', 'amanda.davis@gmail.com', '+27891234508', '4de3a4121290e1fc9fa9640cea9177f3cdea71ecaacd95318925d4a078dc00fc', '2ac9f1922b979c3304dad4adcc526129', 'fuZEc1WoOIlpEm9NmYh4eOyAaSgGvHG/ALRG2bO9PuT8Ws2b', 'Traveller'),
(9, 'Robert', NULL, 'Miller', 'robert.miller@yahoo.com', '+27801234509', 'f3eb9c50db0c8f205bf7e60e43cc551cfbab83346782399f97ce07360b0bb3b4', '8dd3c223564d57f8e0f76bad1b45b956', 'stCoxb3odz6Fyri5Ej9/NX40iMhMPIIttBdaauUM1S3BMvv3', 'Traveller'),
(10, 'Laura', 'Charlene', 'Wilson', 'laura.wilson@gmail.com', '+27821112510', '8d1fdf2cbffd11cc1b2eb6d726c18897f9c7d03b087a8c7e831130995b188452', '8a976d08d2bd007f1b470d620bae03bb', 'mtureT8G02S6EqJnw9kTysvIPnRYKwfdUkclrSAH1aGvZ8UU', 'Traveller'),
(11, 'Robert', 'Jerry', 'Katlan', 'info@sunrisetravels.com', '+27115550001', 'f7f5ea710c72b9a1b398de55b49b5df8a37d27f0dc47d8b301a68b75bc40ed7e', '7b850c93363f42dbf17b91a6fa113a48', 'ptEDUgd0nvfP9M5uAx0EzsLqjQrzwXgZ+SCkWT0hGQqTPWEN', 'Agency'),
(12, 'Jhon', NULL, 'Smith', 'info@globalgetaways.com', '+27115550002', '872be2bd920bc7ab83ec9d9d52c3fb2ff4278ddb374901655b547111249e7cc8', 'b595ba94d4430e934203df06f8f21462', 'EUHa6hcwH+YACVn7CDAahQVLNla7qnqoV6WoIMatPZ5XoGT7', 'Agency'),
(13, 'Rynhardt', 'Paul', 'Gouws', 'info@epicvoyages.com', '+27115550003', 'ccd245dba28f6bfc0e968b13cce93cad34c854cbd53d04c0fd83fb5d391eea2f', '77ceaa8b8b29d98421997a252d72af24', 'qoaYOFJwTH735yXbgQYu4OoUlPYMkgAqzUmwIaVgtdodfhgd', 'Agency'),
(14, 'Kai', 'Ehren', 'Fynn', 'demotraveller@tripistry.com', '+27821112510', 'f4feefac41a1314d6011fd9bc89cb73ef5849937799708738d460e5f1bd5917d', 'c0cd171b7ac43f7663ca2a2ce602633b06871a1e34c57d6be424a7343a363ea7', '6d69e0dcf7741c7a19f5347b5c6672a21d2d0291ab3d614a9ed7ffbcfa74b180', 'Traveller'),
(15, 'Sarah', 'Jane', 'Parker', 'demoagency@tripistry.com', '+27821234567', '2a35539c0d23d1db43d75d0753e752483bd446bf179a9535fa31380daf45f461', 'f37adb7959bf62b6f888dc130314b138ad99566aa9c5cd441062bf5b185b8c7d', '26e603b6a39135eaccf8f357962d601b095590fd38450a22a3c2c41548829298', 'Agency');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodation`
--
ALTER TABLE `accommodation`
  ADD PRIMARY KEY (`accommodationID`),
  ADD KEY `destinationID` (`destinationID`);

--
-- Indexes for table `attraction`
--
ALTER TABLE `attraction`
  ADD PRIMARY KEY (`destinationID`,`name`);

--
-- Indexes for table `destination`
--
ALTER TABLE `destination`
  ADD PRIMARY KEY (`destinationID`);

--
-- Indexes for table `flight`
--
ALTER TABLE `flight`
  ADD PRIMARY KEY (`flightID`);

--
-- Indexes for table `group_trip`
--
ALTER TABLE `group_trip`
  ADD PRIMARY KEY (`tripID`),
  ADD KEY `packageID` (`packageID`),
  ADD KEY `agencyID` (`agencyID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`orderID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `packageID` (`packageID`);

--
-- Indexes for table `package`
--
ALTER TABLE `package`
  ADD PRIMARY KEY (`packageID`),
  ADD KEY `destinationID` (`destinationID`),
  ADD KEY `agencyID` (`agencyID`);

--
-- Indexes for table `package_accommodation`
--
ALTER TABLE `package_accommodation`
  ADD PRIMARY KEY (`packageID`,`accommodationID`),
  ADD KEY `accommodationID` (`accommodationID`);

--
-- Indexes for table `package_attraction`
--
ALTER TABLE `package_attraction`
  ADD PRIMARY KEY (`packageID`,`destinationID`,`name`),
  ADD KEY `destinationID` (`destinationID`,`name`);

--
-- Indexes for table `package_flight`
--
ALTER TABLE `package_flight`
  ADD PRIMARY KEY (`packageID`,`flightID`),
  ADD KEY `flightID` (`flightID`);

--
-- Indexes for table `package_restaurant`
--
ALTER TABLE `package_restaurant`
  ADD PRIMARY KEY (`packageID`,`restaurantID`),
  ADD KEY `restaurantID` (`restaurantID`);

--
-- Indexes for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`restaurantID`),
  ADD KEY `destinationID` (`destinationID`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`reviewID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `packageID` (`packageID`);

--
-- Indexes for table `traveller`
--
ALTER TABLE `traveller`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `traveller_group_trip`
--
ALTER TABLE `traveller_group_trip`
  ADD PRIMARY KEY (`userID`,`tripID`),
  ADD KEY `tripID` (`tripID`);

--
-- Indexes for table `travel_agency`
--
ALTER TABLE `travel_agency`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `emailAddress` (`emailAddress`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodation`
--
ALTER TABLE `accommodation`
  MODIFY `accommodationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `destination`
--
ALTER TABLE `destination`
  MODIFY `destinationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `flight`
--
ALTER TABLE `flight`
  MODIFY `flightID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `group_trip`
--
ALTER TABLE `group_trip`
  MODIFY `tripID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `package`
--
ALTER TABLE `package`
  MODIFY `packageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `restaurantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `reviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accommodation`
--
ALTER TABLE `accommodation`
  ADD CONSTRAINT `1` FOREIGN KEY (`destinationID`) REFERENCES `destination` (`destinationID`);

--
-- Constraints for table `attraction`
--
ALTER TABLE `attraction`
  ADD CONSTRAINT `1` FOREIGN KEY (`destinationID`) REFERENCES `destination` (`destinationID`);

--
-- Constraints for table `group_trip`
--
ALTER TABLE `group_trip`
  ADD CONSTRAINT `1` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`agencyID`) REFERENCES `travel_agency` (`userID`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `1` FOREIGN KEY (`userID`) REFERENCES `traveller` (`userID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`);

--
-- Constraints for table `package`
--
ALTER TABLE `package`
  ADD CONSTRAINT `1` FOREIGN KEY (`destinationID`) REFERENCES `destination` (`destinationID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`agencyID`) REFERENCES `travel_agency` (`userID`);

--
-- Constraints for table `package_accommodation`
--
ALTER TABLE `package_accommodation`
  ADD CONSTRAINT `1` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`accommodationID`) REFERENCES `accommodation` (`accommodationID`);

--
-- Constraints for table `package_attraction`
--
ALTER TABLE `package_attraction`
  ADD CONSTRAINT `1` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`destinationID`,`name`) REFERENCES `attraction` (`destinationID`, `name`);

--
-- Constraints for table `package_flight`
--
ALTER TABLE `package_flight`
  ADD CONSTRAINT `1` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`flightID`) REFERENCES `flight` (`flightID`);

--
-- Constraints for table `package_restaurant`
--
ALTER TABLE `package_restaurant`
  ADD CONSTRAINT `1` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`restaurantID`) REFERENCES `restaurant` (`restaurantID`);

--
-- Constraints for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD CONSTRAINT `1` FOREIGN KEY (`destinationID`) REFERENCES `destination` (`destinationID`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `1` FOREIGN KEY (`userID`) REFERENCES `traveller` (`userID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`);

--
-- Constraints for table `traveller`
--
ALTER TABLE `traveller`
  ADD CONSTRAINT `1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `traveller_group_trip`
--
ALTER TABLE `traveller_group_trip`
  ADD CONSTRAINT `1` FOREIGN KEY (`userID`) REFERENCES `traveller` (`userID`),
  ADD CONSTRAINT `2` FOREIGN KEY (`tripID`) REFERENCES `group_trip` (`tripID`);

--
-- Constraints for table `travel_agency`
--
ALTER TABLE `travel_agency`
  ADD CONSTRAINT `1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
