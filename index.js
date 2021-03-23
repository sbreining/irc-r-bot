const irc = require('irc');
const phin = require('phin');
const SQL = require('better-sqlite3');

const fiveMinutes = 5 * 60 * 1000;

const log = {
    // Logs connection
    db: new SQL('./database.db'),

    info: (context) => {
        log._submit('INFO', context);
    },

    warning: (context) => {
        log._submit('WARNING', context);
    },

    error: (context) => {
        log._submit('ERROR', context);
    },

    _submit: (level, context) => {
        log.db.prepare('INSERT INTO logs (level, log) VALUES (?, ?)').run(level, JSON.stringify(context));
    },
}

function convertSqlIntoLogFormat(sqlStatement) {
    context = {
        message: 'Running sql statement',
        sql: sqlStatement,
    };

    log.info(context);
}

const db = new SQL('./database.db', { verbose: convertSqlIntoLogFormat });

const ircOptions = {
    userName: 'battlebot',
    realName: 'Battle Bot for r/BattleStations',
    channels: ['#battlebottestchannel'],
    autoConnect: true,
    retryCount: 3,
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
    const logContext = {
        message: 'Sending post to channel',
        post,
    }
    log.info(logContext);

    client.say('#battlebottestchannel', 'Top Battle Station Of The Day:');
    client.say('#battlebottestchannel', 'https://reddit.com' + post.data.permalink);
}

function timePassed() {
    const results = db.prepare('SELECT * FROM times WHERE id = ?').get(1);

    const now = new Date();

    const logContext = {
        message: `Comparing next_post date to now`,
        now: now.toISOString,
        next_post: results.next_post,
    };
    log.info(logContext);

    return now > new Date(results.next_post)
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
        const logContext = {
            message: 'The time has not passed, so we are not going to make the API request.'
        };
        log.info(logContext);

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

client.addListener('join', (channel, to, message) => {
    if (channel == '#battlebottestchannel'
        && to == 'KettleMan'
        && message.host == 'ec2-52-9-107-53.us-west-1.compute.amazonaws.com'
    ) {
        try {
            client.send('MODE', '#battlebottestchannel', '+o', 'KettleMan');
        } catch (err) {
            const logContext = {
                message: 'Unable to grant moderator privs, probably not channel moderator',
                err
            };
            log.warning(logContext);
        }
    }
});

client.addListener('registered', () => {
    // Keep this as console log to ensure connection.
    console.log('The bot has connected to IRC');
    main();
});
