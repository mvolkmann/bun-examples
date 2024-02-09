CREATE TABLE `person` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`completed` integer DEFAULT false,
	`personId` integer NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `name` ON `person` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `description_constraint` ON `todo` (`description`);