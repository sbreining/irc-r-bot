```
                               _                         _           _
                              (_)_ __ ___      _ __     | |__   ___ | |_
                              | | '__/ __|____| '__|____| '_ \ / _ \| __|
                              | | | | (_|_____| | |_____| |_) | (_) | |_
                              |_|_|  \___|    |_|       |_.__/ \___/ \__|

```

## Description

An IRC bot that will report on the top Reddit r/bbq post of the day.
Additionaly it has a listener for commands to see the hot|new|top x
posts. The links posted are shortened links, and thus are redirects
to the actual link.

## Issuing Commands

Start commands with `!bb COMMAND [OPTIONS]`.

## Available Commands

- `hot [NUMBER]`
  - `NUMBER` is optional, or is `1 <= NUMBER <= 5` and an integer (will take
    `Math.floor()` if not an integer), or is `one|two|three|four|five`, and if
    ommitted will post the three 'hottest' Reddit posts of the day (for
    whatever Reddit deems 'hot').
- `link`
  - With no additional params needed, this will report the link to the
    barbeque subreddit.
- `new [NUMBER]`
  - `NUMBER` is optional, or is `1 <= NUMBER <= 5` and an integer (will take
    `Math.floor()` if not an integer), or is `one|two|three|four|five`, and if
    ommitted will post the three newest Reddit posts of the day.
- `top [NUMBER] [TIMEFRAME]`
  - `NUMBER` is optional, or is `1 <= NUMBER <= 5` and an integer (will take
    `Math.floor()` if not an integer), or is `one|two|three|four|five`, and if
    ommitted will post the three top Reddit posts of the day.
  - `TIMEFRAME` is optional, and if omitted will default to `day`, or from the
    following list (case-insensitive):
    ```
    [
      d, day, daily,
      w, week, weekly,
      m, mon, month, monthly,
      y, year, yearly,
      a, at, all, alltime
    ]
    ```
