const fs = require('fs');

try {
  fs.openSync('./database.db', 'ax+');
} catch (err) {
  console.log('Database file already exists.');
}

const SQL = require('better-sqlite3');

const db = new SQL('./database.db', { verbose: console.log });

try {
  const createPosts = 'CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, post_name CHAR(50) NOT NULL);';
  db.exec(createPosts);
} catch (err) {
  console.log('The table, posts, already exists.');
}

try {
  const createTimes = 'CREATE TABLE times (id INTEGER PRIMARY KEY AUTOINCREMENT, next_post TEXT NOT NULL)';
  db.exec(createTimes);
} catch (err) {
  console.log('The table, times, already exists.');
}

const results = db.prepare('SELECT * FROM times WHERE id = ?').get(1);

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

try {
  const createLogs =
    "CREATE TABLE logs (id INTEGER PRIMARY KEY AUTOINCREMENT, level TEXT NOT NULL DEFAULT 'INFO', log TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);";
  db.exec(createLogs);
} catch (err) {
  console.log('The table, logs, already exists.');
}
