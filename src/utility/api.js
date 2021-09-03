const phin = require('phin');

const BASE_URL = 'https://www.reddit.com';
const BATTLE_URL = `${BASE_URL}/r/BBQ`;

async function getPostsFromReddit(path, limit) {
  const request = {
    url: `${BATTLE_URL}/${path}/.json?t=day&limit=${limit}`,
    method: 'GET',
    parse: 'json',
  };

  const response = await phin(request);

  return response.body.data.children;
}

module.exports = {
  BASE_URL,
  BATTLE_URL,
  getHotPosts: (num) => getPostsFromReddit('hot', num),
  getNewPosts: (num) => getPostsFromReddit('new', num),
  getTopPosts: (num) => getPostsFromReddit('top', num),
};
