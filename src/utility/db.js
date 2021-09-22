const SQL = require('better-sqlite3');
const log = require('./log');

const db = new SQL('./data/database.db', {
  verbose: (sqlStatement) => log.info('Running sql statement', { sql: sqlStatement }),
});

function getTimestamp() {
  return db.prepare('SELECT * FROM times WHERE id = ?').get(1);
}

function isInDatabase(post) {
  const results = db.prepare('SELECT COUNT(*) FROM posts WHERE post_name = ?').get(post);

  return results['COUNT(*)'] > 0;
}

async function putNewPostInDatabase(post) {
  db.prepare('INSERT INTO posts (post_name) VALUES (?)').run(post);
}

async function setNextPostTime() {
  const now = new Date();

  now.setDate(now.getDate() + 1);
  now.setHours(12);
  now.setMinutes(30);
  now.setSeconds(0);
  now.setMilliseconds(0);

  db.prepare('UPDATE times SET next_post = ? WHERE id = 1').run(now.toISOString());
}

module.exports = {
  getTimestamp,
  isInDatabase,
  putNewPostInDatabase,
  setNextPostTime,
};
