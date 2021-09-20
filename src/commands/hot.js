const { API, Log, validateNumberParam } = require('../utility');

async function handleHottest(num) {
  num = validateNumberParam(num);

  Log.info('Going to fetch posts on behalf of "hot" command.', { count: num });

  let apiResponse;
  try {
    apiResponse = await API.getHotPosts(num);
  } catch (error) {
    Log.error('Failed to retrieve hottest posts from reddit.', { error });
    return [];
  }

  const posts = [];
  for (const index in apiResponse) {
    posts.push(`${Number(index) + 1}. ${API.SHORT_URL}${apiResponse[index].data.id}`);
  }

  return posts;
}

module.exports = handleHottest;
