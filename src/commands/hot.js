const { API, Log, validateNumberParam } = require('../utility');

async function handleHottest(num) {
  num = validateNumberParam(num);

  Log.info('Going to fetch posts on behalf of "hot" command.', { count: num });

  let apiResponse;
  try {
    apiResponse = await API.getHotPosts(num);
  } catch (error) {
    const errorMessage = 'Failed to retrieve hottest posts from reddit.';
    Log.error(errorMessage, { error });
    return Promise.reject(errorMessage);
  }

  const posts = [];
  for (const index in apiResponse) {
    posts.push(`[ ${Number(index) + 1}. ${API.SHORT_URL}${apiResponse[index].data.id} ]`);
  }

  return posts.join('|.-^-.|');
}

module.exports = handleHottest;
