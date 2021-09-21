const { API, Log, validateNumberParam } = require('../utility');

function formatTimeframe(timeframe) {
  if (!timeframe) return 'day';

  timeframe = timeframe.toLowerCase();

  switch (timeframe) {
    case 'd':
    case 'day':
    case 'daily':
      return 'day';
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
    default:
      return 'day';
  }
}

async function handleTop(num, timeframe) {
  num = validateNumberParam(num);

  timeframe = formatTimeframe(timeframe);

  Log.info('Going to fetch posts on behalf of "top" command.', { count: num });

  let apiResponse;
  try {
    apiResponse = await API.getTopPosts(num, timeframe);
  } catch (error) {
    Log.error('Failed to retrieve top posts from reddit.', { error });
    return [];
  }

  const posts = [];
  for (const index in apiResponse) {
    posts.push(`${Number(index) + 1}. ${API.SHORT_URL}${apiResponse[index].data.id}`);
  }

  return posts;
}

module.exports = handleTop;
