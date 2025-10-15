import Database from 'better-sqlite3';
import path from 'path';

// Open (or create) a database file
const sqlite: typeof Database.prototype = new Database(
  path.join(process.cwd(), '/database.db'),
);

export { sqlite };
