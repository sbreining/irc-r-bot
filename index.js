const irc = require('irc');
const phin = require('phin');
const SQL = require('better-sqlite3');

const fiveMinutes = 5 * 60 * 1000;

const db = new SQL('./database.db', { verbose: console.log });

const ircOptions = {
    userName: 'battlebot',
    realName: 'Battle Bot for r/BattleStations',
    channels: ['#battlebottestchannel'],
    autoConnect: false,
};

const client = new irc.Client('irc.mzima.net', 'battlebot', ircOptions);

async function getPostFromReddit() {
    const request = {
        url: 'https://www.reddit.com/r/battlestations/top/.json?t=day&limit=3',
        method: 'GET',
        parse: 'json',
    };

    const response = await phin(request);

    return response.body.data.children;
}

function getPostFullName(post) {
    return post.kind + '_' + post.data.id;
}

function isInDatabase(post) {
    const postFullName = getPostFullName(post);

    const results = db.prepare('SELECT COUNT(*) FROM posts WHERE post_name = ?').get(postFullName);

    return results['COUNT(*)'] > 0;
}

async function putNewPostInDatabase(post) {
    const postFullName = getPostFullName(post);

    db.prepare('INSERT INTO posts (post_name) VALUES (?)').run(postFullName);
}

async function sendNewPostToChannel(post) {
    console.log('Sending post to channel:\n', post);

    client.say('#battlebottestchannel', 'Top Battle Station Of The Day:');
    client.say('#battlebottestchannel', 'https://reddit.com' + post.data.permalink);
}

function timePassed() {
    const results = db.prepare('SELECT * FROM times WHERE id = ?').get(1);

    console.log(`The date in the database is: ${results.next_post}`);

    return new Date() > new Date(results.next_post)
}

function setNextPostTime() {
    const now = new Date();

    now.setDate(now.getDate() + 1);
    now.setHours(9);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    db.prepare('UPDATE times SET next_post = ? WHERE id = 1').run(now.toISOString());
}

async function core() {
    if (!timePassed()) {
        console.log('The time has not passed, so we are not going to make the API request.');
        return;
    }

    let topFivePosts = await getPostFromReddit();

    for (const post of topFivePosts) {
        if (!isInDatabase(post)) {
            putNewPostInDatabase(post);
            sendNewPostToChannel(post);
            setNextPostTime();
            break;
        }
    }
}

async function main() {
    setInterval(core, fiveMinutes);
}

client.connect(() => {
    console.log('The bot has connected to IRC');
    main();
});
