const { API, Log, validateNumberParam } = require('../utility');

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

async function handleTop(num, timeframe) {
  num = validateNumberParam(num);

  timeframe = formatTimeframe(timeframe);

  Log.info('Going to fetch posts on behalf of "top" command.', { count: num, timeframe });

  let apiResponse;
  try {
    apiResponse = await API.getTopPosts(num, timeframe);
  } catch (error) {
    const errorMessage = 'Failed to retrieve top posts from reddit.';
    Log.error(errorMessage, { error });
    return Promise.reject(errorMessage);
  }

  const posts = [];
  for (const index in apiResponse) {
    posts.push(`[ ${Number(index) + 1}. ${API.SHORT_URL}${apiResponse[index].data.id} ]`);
  }

  return posts.join('|.-^-.|');
}

module.exports = handleTop;
