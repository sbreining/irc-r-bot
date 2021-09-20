const { API, Log, validateNumberParam } = require('../utility');

async function handleNewest(num) {
  num = validateNumberParam(num);

  Log.info('Going to fetch posts on behalf of "new" command.', { count: num });

  let apiResponse;
  try {
    apiResponse = await API.getNewPosts(num);
  } catch (error) {
    Log.error('Failed to retrieve newest posts from reddit.', { error });
    return [];
  }

  const posts = [];
  for (const index in apiResponse) {
    posts.push(`${Number(index) + 1}. ${API.SHORT_URL}${apiResponse[index].data.id}`);
  }

  return posts;
}

module.exports = handleNewest;
