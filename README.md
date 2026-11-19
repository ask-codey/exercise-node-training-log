# Exercise: Training Log

Exercise code for the lesson **Exercise: Training Log** in the Node.js in Depth course on [ask-codey.com](https://www.ask-codey.com).

The Trailhead Running Club keeps its training log in a CSV file, and every Sunday night the coach adds up each runner's week by hand. You'll build the command that does it for her: `node log.js --runner Maya --week 2026-11-02` reads the log, prints Maya's week (her runs, her total miles, her average pace and her longest run), saves it as JSON when asked, and reports a missing file or an unknown runner with a clear message and the right exit code. Tests check every part.

## What's here

- `training.js`: the calculations, `parseRuns`, `runsForWeek` and `summarize`. For now each returns an empty answer. The comment at the top says what each should return, with examples. For you to finish.
- `log.js`: the command itself. For now it prints `Not built yet.` whatever it's given. The comment at the top lists every command it should answer, what it prints and its exit code. For you to finish.
- `helpers.js`: two small helpers for `training.js`: `addDays`, which gives the date a number of days later, and `formatPace`, which writes a pace such as `9:35`. Ready to use.
- `data/runs.csv`: the club's training log, 17 runs from October 26 to November 14, 2026. Ready to use.
- `log.test.js`: the tests. Tests 1 to 6 call the functions in `training.js`; tests 7 to 16 run `log.js` as its own program and check what it prints, what it saves and its exit code. You don't need to change this file.
- `package.json`: the project's settings and its `test` script. Ready to use.

## Before you start

There's nothing to install: the tests use Node's own test runner, `node:test`, and run `log.js` with `node:child_process`, both built into Node. You need Node.js 24 or later (the course uses Node.js 26 LTS).

## Run it

In VS Code's terminal, in this folder:

```bash
node log.js --runner Maya --week 2026-11-02
```

Until you've finished `log.js`, it prints `Not built yet.` To see the exit code of the last command, run `$LASTEXITCODE` in PowerShell, or `echo $?` in zsh.

## Check your work

```bash
npm test
```

At first all 16 tests fail: that is expected. Each part you finish turns its tests green. A failing test's name says the command or the call it tried and what it expected, and its message says what came back.

## The rules

- Use Node's own modules only: `node:fs/promises`, `node:path` and `node:util`'s `parseArgs`. No packages.
- Errors go to `console.error`, and a failed command sets `process.exitCode = 1`, so nothing else is printed and the computer that ran it knows it failed.
- Without `RUNLOG_DIR`, find `data/runs.csv` from `log.js`'s own folder (`import.meta.dirname`), so the command works from any folder the terminal is in.
- Don't change `data/runs.csv` or `helpers.js`: the tests compare your answers with them.

## Tips

- Finish `training.js` first: tests 1 to 6 check each function on its own, and `log.js` needs all three.
- Split the text into lines, trim each one and drop the blank ones, then split each line at its commas. `Number()` turns `"4.0"` into `4`.
- Dates written as `yyyy-mm-dd` sort the same way as text, so `run.date >= week` compares two dates.
- Read the options with `parseArgs`, then check them in this order: `--help`, a missing runner or week, the file, the runner, the week.
- Catch the error from `readFile` and look at its `code`: `"ENOENT"` means the file isn't there.

## Hand it in

When it works, push your solution to a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. The lesson page shows the Git commands, step by step.
