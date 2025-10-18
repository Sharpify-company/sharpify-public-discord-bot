import Database from 'better-sqlite3';
import path from 'path';

// Open (or create) a database file
const sqlite: typeof Database.prototype = new Database(
  path.join(process.cwd(), '/database.db'),
);

sqlite.prepare(`
    CREATE TABLE IF NOT EXISTS "discordUsers" (
    "id"	TEXT,
    "cartChannelId"	TEXT,
    "cartMessageId"	TEXT,
    "cartItems"	TEXT,
    "couponCode"	TEXT,
    "subTotalPrice"	REAL,
    "totalPrice"	REAL,
    "firstName"	TEXT,
    "lastName"	TEXT,
    "email"	TEXT,
    "gatewayMethod"	TEXT,
    "cartCreatedAt"	TEXT,
    PRIMARY KEY("id")
);
`).run()

sqlite.prepare(`
  CREATE TABLE  IF NOT EXISTS "externalEvents" (
	"id"	TEXT,
	"eventName"	TEXT,
	"contextAggregateId"	TEXT,
	"payload"	TEXT,
	PRIMARY KEY("id")
);
`).run()

sqlite.prepare(`
CREATE TABLE IF NOT EXISTS "orders" (
	"id"	TEXT,
	"orderProps"	TEXT,
	"customerId"	TEXT,
	"deliveryStatus"	TEXT,
	PRIMARY KEY("id")
);
`).run()

sqlite.prepare(`
CREATE TABLE IF NOT EXISTS "products" (
	"id"	TEXT,
	"productProps"	TEXT,
	"channelsLinked"	TEXT,
	PRIMARY KEY("id")
);
`).run()


export { sqlite };
