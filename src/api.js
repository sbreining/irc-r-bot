const phin = require('phin');

const BASE_URL = 'https://www.reddit.com';
const BBQ_URL = `${BASE_URL}/r/BBQ`;
const SHORT_URL = 'https://redd.it/';

async function getPostsFromReddit(path, limit, timeframe = 'day') {
  const request = {
    url: `${BBQ_URL}/${path}/.json?t=${timeframe}&limit=${limit}`,
    method: 'GET',
    parse: 'json',
  };

  const response = await phin(request);

  return response.body.data.children;
}

module.exports = {
  BBQ_URL,
  hot_: (num) => getPostsFromReddit('hot', num),
  new_: (num) => getPostsFromReddit('new', num),
  top_: (num, timeframe) => getPostsFromReddit('top', num, timeframe),
  SHORT_URL,
};
