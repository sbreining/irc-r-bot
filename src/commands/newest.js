const { api, log, validateNumberParam } = require('../utility');

async function handleNewest(num) {
  num = validateNumberParam(num);

  log.info('Going to fetch posts on behalf of "new" command.', { count: num });

  let apiResponse;
  try {
    apiResponse = await api('new', num);
  } catch (error) {
    log.error('Failed to retrieve newest posts from reddit.', { error });
    return [];
  }

  const posts = [];
  for (const index in apiResponse) {
    posts.push(`${Number(index) + 1}. ${api.BASE_URL}${apiResponse[index].data.permalink}`);
  }

  return posts;
}

module.exports = handleNewest;
