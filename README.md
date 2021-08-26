# r-battle-station-bot

An IRC bot that will reprot on the top Reddit r/battlestations post of the day.

### Issuing Commands

Start commands with `!rbs [COMMAND]`.

#### Available Commands

- `top [NUMBER]`: `NUMBER` is optional or `1 <= NUMBER <= 3` and is an integer (will take `Math.floor()` if not an integer), or is `one|two|three`, and if ommitted will post the top Reddit post of the day.
- `new [NUMBER]`: `NUMBER` is optional or `1 <= NUMBER <= 3` and is an integer (will take `Math.floor()` if not an integer), or is `one|two|three`, and if ommitted will post the newest Reddit post of the day.
- `link`: With no additional params needed, this will report the link to the battle station subreddit.
