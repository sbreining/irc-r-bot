const phin = require('phin');

const BASE_URL = 'https://www.reddit.com';
const BBQ_URL = `${BASE_URL}/r/BBQ`;
const SHORT_URL = 'https://redd.it/';

async function getPostsFromReddit(path, limit) {
  const request = {
    url: `${BBQ_URL}/${path}/.json?t=day&limit=${limit}`,
    method: 'GET',
    parse: 'json',
  };

  const response = await phin(request);

  return response.body.data.children;
}

module.exports = {
  BBQ_URL,
  getHotPosts: (num) => getPostsFromReddit('hot', num),
  getNewPosts: (num) => getPostsFromReddit('new', num),
  getTopPosts: (num) => getPostsFromReddit('top', num),
  SHORT_URL,
};
