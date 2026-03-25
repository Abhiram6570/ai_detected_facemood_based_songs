-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 17, 2025 at 12:26 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mood_music`
--

-- --------------------------------------------------------

--
-- Table structure for table `fav_songs`
--

CREATE TABLE `fav_songs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fav_songs`
--

INSERT INTO `fav_songs` (`id`, `user_id`, `song_id`, `created_at`) VALUES
(76, 7, 5, '2025-01-17 20:45:52'),
(77, 789, 8, '2025-01-18 10:22:19'),
(78, 789, 5, '2025-01-18 10:22:32'),
(79, 789, 6, '2025-01-18 10:39:31'),
(80, 789, 3, '2025-01-18 10:40:02'),
(82, 7890, 8, '2025-01-18 12:15:39'),
(84, 7890, 5, '2025-01-18 12:27:31'),
(85, 7890, 2, '2025-01-18 12:27:53'),
(86, 999, 5, '2025-01-18 14:02:38'),
(87, 7891, 5, '2025-01-18 14:17:17'),
(89, 4, 3, '2025-01-18 20:38:11'),
(91, 7892, 3, '2025-01-18 20:40:30'),
(92, 7892, 2, '2025-01-18 20:46:01'),
(94, 4, 5, '2025-01-18 21:00:02'),
(95, 999, 1, '2025-01-19 15:29:05'),
(97, 4, 14, '2025-01-19 21:58:25'),
(98, 4, 7, '2025-03-10 23:24:52'),
(99, 999, 4, '2025-10-16 17:57:29'),
(100, 4, 9, '2025-10-17 13:32:04');

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `genre` varchar(100) NOT NULL,
  `mood` varchar(100) NOT NULL,
  `file_path` text NOT NULL,
  `image_data` blob DEFAULT 'https://cdn.pixabay.com/photo/2016/05/24/22/54/icon-1413583_640.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `title`, `artist`, `genre`, `mood`, `file_path`, `image_data`) VALUES
(4, 'Happy-Title', 'Happy-Artist', 'Happy-Genre', 'Happy', 'uploads/songs/Happy/Happy-SenSongsMp3.Com.mp3', 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67),
(6, 'Fear-Title', 'Fear-Artist', 'Fear-Genre', 'Fear', 'uploads/songs/Fear/Fear.mp3', 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67),
(7, 'Surprise-Title', 'Surprise-Artist', 'Surprise-Genre', 'Surprise', 'uploads/songs/Surprise/Hoyna_Hoyna_-_SenSongsMp3.Co.mp3', 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67),
(8, 'Sad-Title', 'Sad-Artist', 'Sad-Genre', 'Sad', 'uploads/songs/Sad/Po_Ve_Po_Remix_-_SenSongsmp3.Co.mp3', 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67),
(9, 'Disgust-Title', 'Disgust-Artist', 'Disgust-Genre', 'Disgust', 'uploads/songs/Disgust/Anbu_Thoza_777_Charlie_Tamil_320_Kbps.mp3', 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67),
(14, 'rrr-title', 'rrr', 'rrr', 'Angry', 'uploads/songs/Angry/Anbu_Thoza_777_Charlie_Tamil_320_Kbps.mp3', 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67),
(16, 'Demo', 'Demo', 'Demo', 'Disgust', 'uploads/songs/Disgust/04_-_Ee_Pichhey_Premani.mp3', 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `image` blob NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2016/05/24/22/54/icon-1413583_640.png',
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` int(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `image`, `fullname`, `email`, `password`, `type`, `created_at`) VALUES
(4, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'Harikrishnas', 'Harikrishna@gmail.com', 'Harikrishna@gmail.com', 1, '2025-03-12 08:44:13'),
(6, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'John Does', 'john.doe@examsple.com', 'securepassword', 0, '2025-03-12 08:44:13'),
(9, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'Harikrishnaaaa', 'Harikrishnaaaa@gmail.com', 'Harikrishnaaaa', 0, '2025-03-12 08:44:13'),
(999, 0x416268692e706e67, 'Abhiram', 'Abhi@gmail.com', 'Abhi@gmail.com', 0, '2025-03-12 08:44:13'),
(7891, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'HIIIU', 'HIIIU@gmail.com', 'HIIIU', 0, '2025-03-12 08:44:13'),
(7892, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'Krishna', 'krishna@gmail.com', '1234567890', 0, '2025-03-12 08:44:13'),
(7897, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'poco', 'poco@gmail.com', 'poco', 0, '2025-03-12 08:44:13'),
(7898, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'Demo', 'Demo@gmail.com', 'Demo@gmail.com', 1, '2025-10-17 08:08:26'),
(7899, 0x68747470733a2f2f63646e2e706978616261792e636f6d2f70686f746f2f323031362f30352f32342f32322f35342f69636f6e2d313431333538335f3634302e706e67, 'Demo1@gmail.com', 'Demo1@gmail.com', 'Demo1@gmail.com', 1, '2025-10-17 08:20:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fav_songs`
--
ALTER TABLE `fav_songs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fullname` (`fullname`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fav_songs`
--
ALTER TABLE `fav_songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7900;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
