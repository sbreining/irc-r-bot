const { api, log, validateNumberParam } = require('../utility');

async function handleTop(num) {
  num = validateNumberParam(num);

  log.info('Going to fetch posts on behalf of "top" command.', { count: num });

  let apiResponse;
  try {
    apiResponse = await api('top', num);
  } catch (error) {
    log.error('Failed to retrieve top posts from reddit.', { error });
    return [];
  }

  const posts = [];
  for (const index in apiResponse) {
    posts.push(`${Number(index) + 1}. ${api.BASE_URL}${apiResponse[index].data.permalink}`);
  }

  return posts;
}

module.exports = handleTop;
