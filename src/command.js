const API = require('./api');
const Log = require('./log');

const COMMAND_PREFIX = '!bb';

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
    throw new Error('To reduce spam, will only post at most 5. Want more? "!bb link"');
  }

  return Math.floor(num);
}

function formatResponse(response) {
  const posts = [];
  for (const index in response) {
    posts.push(`[ ${Number(index) + 1}. ${API.SHORT_URL}${response[index].data.id} ]`);
  }

  return `@ ${posts.join('|.-^-.|')}`;
}

function formatTimeframe(timeframe) {
  if (!timeframe) return 'day';

  timeframe = timeframe.toLowerCase();

  switch (timeframe) {
    case 'w':
    case 'week':
    case 'weekly':
      return 'week';
    case 'm':
    case 'month':
    case 'monthly':
    case 'mon':
      return 'month';
    case 'y':
    case 'year':
    case 'yearly':
      return 'year';
    case 'a':
    case 'at':
    case 'all':
    case 'alltime':
      return 'all';
    case 'd':
    case 'day':
    case 'daily':
    default:
      return 'day';
  }
}

function linkest() {
  return API.BBQ_URL;
}

async function handle(uri, num, timeframe) {
  num = validateNumberParam(num);

  Log.info(`Going to fetch posts on behalf of ${uri} command.`, { count: num });

  let response;
  try {
    response = await API[uri](num, formatTimeframe(timeframe));
  } catch (error) {
    const errorMessage = `Failed to retrieve ${uri} posts from reddit.`;
    Log.error(errorMessage, { error });
    console.error(error);
    return Promise.reject(errorMessage);
  }

  return formatResponse(response);
}

module.exports = {
  COMMAND_PREFIX,
  linkest,
  hottest: (num) => handle('hot_', num),
  newest: (num) => handle('new_', num),
  toppest: (num, timeframe) => handle('top_', num, timeframe),
};
