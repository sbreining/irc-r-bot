const irc = require('irc');
const commands = require('./commands');
const { api, db, log } = require('./utility');

const FIVE_MINUTES = 5 * 60 * 1000;

const CHANNEL = '#battlebottestchannel';

const client = new irc.Client('irc.mzima.net', 'battlebot2', {
  userName: 'battlebot2',
  realName: 'Battle Bot for r/BattleStations',
  channels: [CHANNEL],
  autoConnect: true,
  retryCount: 3,
});

function getPostFullName(post) {
  return post.kind + '_' + post.data.id;
}

async function sendNewPostToChannel(post) {
  log.info('Sending post to channel', { post });

  client.say(CHANNEL, 'Top Battle Station Of The Day:');
  client.say(CHANNEL, api.BASE_URL + post.data.permalink);
}

function timePassed() {
  const results = db.getTimestamp();

  const now = new Date();

  log.info('Comparing next_post date to now', { now: now.toISOString(), next_post: results.next_post });

  return now > new Date(results.next_post);
}

async function core() {
  if (!timePassed()) {
    log.info('Time has not passed, so do not make the API request.');
    return;
  }

  let topFivePosts = await api.getTopPostsFromReddit();

  for (const post of topFivePosts) {
    const postFullName = getPostFullName(post);
    if (!db.isInDatabase(postFullName)) {
      db.putNewPostInDatabase(postFullName);
      sendNewPostToChannel(post);
      db.setNextPostTime();

      return;
    }
  }

  log.info('The top 5 posts have all been sent before.');
}

function joinListener(channel, to, message) {
  if (channel === CHANNEL && to === 'KettleMan' /* && message.host === 'HOSTNAME' */) {
    try {
      client.send('MODE', CHANNEL, '+o', 'KettleMan');
    } catch (err) {
      log.warning('Unable to grant moderator privs, bot is probably not channel moderator', { err });
    }
  }
}

async function commandHandler(_, message) {
  if (!message.startsWith('!rbs')) return;

  log.info('Received a command.', { command: message });

  const command = message.split(' ');

  switch (command[1]) {
    case 'link':
      client.say(CHANNEL, commands.handleLink());
      break;
    case 'new':
      commands
        .handleNewest(command[2])
        .then((posts) => {
          for (const post of posts) {
            client.say(CHANNEL, post);
          }
        })
        .catch((err) => client.say(CHANNEL, err.message));
      break;
    case 'top':
      commands
        .handleTop(command[2])
        .then((posts) => {
          for (const post of posts) {
            client.say(CHANNEL, post);
          }
        })
        .catch((err) => client.say(CHANNEL, err.message));
      break;
    default:
      client.say(CHANNEL, 'Not a valid command.');
  }
}

async function main() {
  // Keep this as console log to ensure connection.
  console.log('The bot has connected to IRC');
  setInterval(core, FIVE_MINUTES);
}

client
  .addListener(`message${CHANNEL}`, commandHandler)
  .addListener('join', joinListener)
  .addListener('registered', main);
