const IRC = require('irc');
const Commands = require('./commands');
const { API, DB, Log } = require('./utility');

const FIVE_MINUTES = 5 * 60 * 1000;

const BOT_NAME = 'bbqbot';
const IRC_NET = 'irc.libera.chat';
const CHANNEL = '#bbqbottestchannel';
const BOT_OWNER = 'KettleMan';
const BOT_HOST = '';

const IRC_OPTS = {
  userName: BOT_NAME,
  realName: 'BBQ Bot for r/BBQ: Low and Slow',
  channels: [CHANNEL],
  autoConnect: true,
  retryCount: 3,
};

const Client = new IRC.Client(IRC_NET, BOT_NAME, IRC_OPTS);

function getPostFullName(post) {
  return post.kind + '_' + post.data.id;
}

async function sendNewPostToChannel(post) {
  Log.info('Sending post to channel', { post });

  Client.say(CHANNEL, 'Top BBQ Post Of The Day:');
  Client.say(CHANNEL, API.BASE_URL + post.data.permalink);
}

function timePassed() {
  const results = DB.getTimestamp();

  const now = new Date();

  Log.info('Comparing next_post date to now', { now: now.toISOString(), next_post: results.next_post });

  return now > new Date(results.next_post);
}

async function core() {
  if (!timePassed()) {
    Log.info('Time has not passed, so do not make the API request.');
    return;
  }

  let topFivePosts = await API.getTopPosts(5);

  for (const post of topFivePosts) {
    const postFullName = getPostFullName(post);
    if (!DB.isInDatabase(postFullName)) {
      DB.putNewPostInDatabase(postFullName);
      sendNewPostToChannel(post);
      DB.setNextPostTime();

      return;
    }
  }

  Log.info('The top 5 posts have all been sent before.');
}

function joinListener(channel, to, message) {
  if (channel === CHANNEL && to === BOT_OWNER /* && message.host === BOT_HOST */) {
    try {
      Client.send('MODE', CHANNEL, '+o', BOT_OWNER);
    } catch (err) {
      Log.warning('Unable to grant moderator privs, bot is probably not channel moderator', { err });
    }
  }
}

async function commandHandler(_, message) {
  if (!message.startsWith(Commands.COMMAND_PREFIX)) return;

  Log.info('Received a command.', { command: message });

  const command = message.split(' ');

  switch (command[1]) {
    case 'link':
      Client.say(CHANNEL, Commands.handleLink());
      break;
    case 'new':
      Commands.handleNewest(command[2])
        .then((posts) => {
          for (const post of posts) {
            Client.say(CHANNEL, post);
          }
        })
        .catch((err) => Client.say(CHANNEL, err.message));
      break;
    case 'top':
      Commands.handleTop(command[2])
        .then((posts) => {
          for (const post of posts) {
            Client.say(CHANNEL, post);
          }
        })
        .catch((err) => Client.say(CHANNEL, err.message));
      break;
    default:
      Client.say(CHANNEL, 'Not a valid command.');
  }
}

async function main() {
  // Keep this as console Log to ensure connection.
  console.log('The bot has connected to IRC');
  setInterval(core, FIVE_MINUTES);
}

Client.addListener(`message${CHANNEL}`, commandHandler)
  .addListener('join', joinListener)
  .addListener('registered', main);
