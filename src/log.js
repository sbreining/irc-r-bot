const SQL = require('better-sqlite3');

const db = new SQL('./data/database.db');

async function submit(level, message, context) {
  db.prepare('INSERT INTO logs (level, message, context) VALUES (?, ?, ?)').run(
    level,
    message,
    context ? JSON.stringify(context) : null
  );
}

module.exports = {
  info: (message, context) => submit('INFO', message, context),
  warning: (message, context) => submit('WARNING', message, context),
  error: (message, context) => submit('ERROR', message, context),
};
