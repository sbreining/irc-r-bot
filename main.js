const IRC = require('irc');
const { API, Commands, DB, Log } = require('./src');

const FIVE_MINUTES = 5 * 60 * 1000;

const BOT_NAME = 'bbqbot';
const IRC_NET = 'irc.libera.chat';
const CHANNEL = '##bbq';

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

  Client.say(CHANNEL, `Top BBQ Post Of The Day: ${API.SHORT_URL + post.data.id}`);
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

  let topFivePosts = await API.top_(5);

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

// The following is to grant moderator priveledges (provided the bot can) to BOT_OWNER
// with BOT_HOST. The host is in there to prevent impersonators if using only the nick
// alone to auto-mod.
// function joinListener(channel, to, message) {
//   if (channel === CHANNEL && to === BOT_OWNER && message.host === BOT_HOST) {
//     try {
//       Client.send('MODE', CHANNEL, '+o', BOT_OWNER);
//     } catch (err) {
//       Log.warning('Unable to grant moderator privs, bot is probably not channel moderator', { err });
//     }
//   }
// }

async function commandHandler(_, message) {
  if (!message.startsWith(Commands.COMMAND_PREFIX)) return;

  Log.info('Received a command.', { command: message });

  const command = message.split(' ');

  switch (command[1]) {
    case 'hot':
      Commands.hottest(command[2])
        .then((message) => Client.say(CHANNEL, message))
        .catch((err) => Client.say(CHANNEL, err.message));
      break;
    case 'link':
      Client.say(CHANNEL, Commands.linkest());
      break;
    case 'new':
      Commands.newest(command[2])
        .then((message) => Client.say(CHANNEL, message))
        .catch((err) => Client.say(CHANNEL, err.message));
      break;
    case 'top':
      Commands.toppest(command[2], command[3])
        .then((message) => Client.say(CHANNEL, message))
        .catch((err) => Client.say(CHANNEL, err.message));
      break;
    default:
      Client.say(CHANNEL, 'How to use: !bb [COMMAND]. Available commands: hot, link, new, top');
  }
}

async function main() {
  // Keep this as console Log to ensure connection.
  console.log('The bot has connected to IRC');
  setInterval(core, FIVE_MINUTES);
}

Client.addListener(`message${CHANNEL}`, commandHandler).addListener('registered', main);
// .addListener('join', joinListener);
