const API = require('./api');
const DB = require('./db');
const Log = require('./log');

function validateNumberParam(num) {
  if (num === undefined) return 3;

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
    case 'four':
      num = 4;
      break;
    case 'five':
      num = 5;
      break;
    default:
      num = Number(num);
  }

  if (!num || num < 1) {
    throw new Error('Please use a valid integer 1 - 5.');
  }
  if (num > 5) {
    throw new Error(`To reduce spam, will only post at most 5. Want more? "!bb link"`);
  }

  return Math.floor(num);
}

module.exports = {
  API,
  DB,
  Log,
  validateNumberParam,
};
