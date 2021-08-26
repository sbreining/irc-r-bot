const phin = require('phin');

const BASE_URL = 'https://www.reddit.com';
const BATTLE_URL = `${BASE_URL}/r/battlestations`;

async function getPostsFromReddit(path, limit) {
  const request = {
    url: `${BATTLE_URL}/${path}/.json?t=day&limit=${limit}`,
    method: 'GET',
    parse: 'json',
  };

  const response = await phin(request);

  return response.body.data.children;
}

const api = (module.exports = getPostsFromReddit);
api.BASE_URL = BASE_URL;
api.BATTLE_URL = BATTLE_URL;
