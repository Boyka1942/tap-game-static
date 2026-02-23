CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`walletAddress` varchar(42) NOT NULL,
	`totalTokens` int NOT NULL DEFAULT 0,
	`lastGameTaps` int,
	`lastGameTokens` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastPlayedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaderboard_walletAddress_unique` UNIQUE(`walletAddress`)
);
