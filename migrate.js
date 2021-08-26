const fs = require('fs');

try {
  fs.openSync('./data/database.db', 'ax+');
} catch (err) {
  console.log('Database file already exists.');
}

const SQL = require('better-sqlite3');

const db = new SQL('./data/database.db', { verbose: console.log });

const createPosts = `
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_name CHAR(50) NOT NULL
  );
`;

try {
  db.exec(createPosts);
} catch (err) {
  console.log('The table, posts, already exists.');
}

const createLogs = `
  CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL DEFAULT 'INFO',
    message TEXT NOT NULL,
    context TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

try {
  db.exec(createLogs);
} catch (err) {
  console.log('The table, logs, already exists.');
}

const createTimes = `
  CREATE TABLE times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    next_post TEXT NOT NULL
  );
`;

try {
  db.exec(createTimes);
} catch (err) {
  console.log('The table, times, already exists.');
}

const query = `
  SELECT
      *
  FROM
      times
  WHERE
      id = ?;
`;

const results = db.prepare(query).get(1);

if (!results) {
  const now = new Date();
  now.setHours(9);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  db.prepare('INSERT INTO times (next_post) VALUES (?)').run(now.toISOString());
} else {
  console.log('A row of ID 1 already exists, no need for anymore rows.');
}
