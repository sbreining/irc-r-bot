const api = require('./api');
const db = require('./db');
const log = require('./log');

function validateNumberParam(num) {
  if (num === undefined) num = 1;

  switch (num) {
    case 'one':
      num = 1;
      break;
    case 'two':
      num = 2;
      break;
    case 'three':
      num = 3;
      break;
    default:
      num = Number(num);
  }

  if (!num || num < 1) {
    throw new Error('Please use a valid integer 1, 2, or 3.');
  }
  if (num > 3) {
    throw new Error('To reduce spam, will only post at most 3. Want more? "!rbs link"');
  }

  return Math.floor(num);
}

module.exports = {
  api,
  db,
  log,
  validateNumberParam,
};
