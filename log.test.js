// Tests for training.js and log.js. Run them with: npm test
// Tests 1 to 6 call the functions in training.js. Tests 7 to 15 run log.js as its own program, the way you run it in
// the terminal (node log.js ...), and check what it prints, what it saves and its exit code. Each run gets a clean
// copy of the environment with no RUNLOG_DIR, unless the test sets one.
// You don't need to change this file.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseRuns, runsForWeek, summarize } from "./training.js";

const here = import.meta.dirname;
const logText = await readFile(path.join(here, "data", "runs.csv"), "utf8");

// Runs node log.js with these arguments, from the folder given (the exercise folder unless a test says otherwise).
function runLog(args, { cwd = here, env = {} } = {}) {
  const cleanEnv = { ...process.env, ...env };
  if (!("RUNLOG_DIR" in env)) {
    delete cleanEnv.RUNLOG_DIR;
  }
  const result = spawnSync(process.execPath, [path.join(here, "log.js"), ...args], { cwd, env: cleanEnv, encoding: "utf8" });
  return { out: result.stdout.trim(), err: result.stderr.trim(), code: result.status };
}

// Makes an empty folder for one test, and removes it when the test ends.
async function tempFolder(t) {
  const folder = await mkdtemp(path.join(os.tmpdir(), "training-log-"));
  t.after(() => rm(folder, { recursive: true, force: true }));
  return folder;
}

function lines(text) {
  return text === "" ? [] : text.split(/\r?\n/);
}

const mayasWeek = [
  "Maya's week of 2026-11-02",
  "Runs: 3",
  "Total: 14.5 miles",
  "Average pace: 9:35 per mile",
  "Longest run: 6.2 miles",
];

test("1) parseRuns turns the header and one line into one run, with miles and minutes as numbers", () => {
  assert.deepEqual(parseRuns("date,runner,miles,minutes\n2026-11-02,Maya,4.0,38\n"),
    [{ date: "2026-11-02", runner: "Maya", miles: 4, minutes: 38 }]);
});

test("2) parseRuns skips blank lines and reads lines that end with \\r\\n: two runs", () => {
  assert.deepEqual(parseRuns("date,runner,miles,minutes\r\n2026-11-02,Leo,3.1,31\r\n\r\n2026-11-05,Leo,5.0,47\r\n"), [
    { date: "2026-11-02", runner: "Leo", miles: 3.1, minutes: 31 },
    { date: "2026-11-05", runner: "Leo", miles: 5, minutes: 47 },
  ]);
});

test("3) parseRuns reads all 17 runs in data/runs.csv, the last one Maya's 7.5 miles on 2026-11-14", () => {
  const runs = parseRuns(logText);
  assert.equal(runs.length, 17, `data/runs.csv holds 17 runs, but parseRuns returned ${runs.length}.`);
  assert.deepEqual(runs[16], { date: "2026-11-14", runner: "Maya", miles: 7.5, minutes: 72 });
});

test("4) runsForWeek gives Maya's 3 runs in the week of 2026-11-02 (Nov 2, 4 and 6)", () => {
  const week = runsForWeek(parseRuns(logText), "Maya", "2026-11-02");
  assert.deepEqual(week.map((run) => run.date), ["2026-11-02", "2026-11-04", "2026-11-06"]);
});

test("5) runsForWeek includes the Sunday and nothing after it: Priya's week of 2026-11-02 is Nov 3 and Nov 8", () => {
  const week = runsForWeek(parseRuns(logText), "Priya", "2026-11-02");
  assert.deepEqual(week.map((run) => run.date), ["2026-11-03", "2026-11-08"],
    "The week starts on the Monday and ends on the Sunday six days later, both included.");
});

test("6) summarize gives Maya's week: 3 runs, 14.5 miles, a 9:35 pace and a longest run of 6.2", () => {
  const week = runsForWeek(parseRuns(logText), "Maya", "2026-11-02");
  assert.deepEqual(summarize(week), { runs: 3, totalMiles: 14.5, averagePace: "9:35", longestRun: 6.2 });
});

test("7) node log.js --runner Maya --week 2026-11-02 prints Maya's week and exits with 0", () => {
  const { out, err, code } = runLog(["--runner", "Maya", "--week", "2026-11-02"]);
  assert.deepEqual(lines(out), mayasWeek);
  assert.equal(err, "", "Nothing should go to the error output when it works.");
  assert.equal(code, 0, `The exit code should be 0 when it works, but it was ${code}.`);
});

test("8) node log.js -r Leo -w 2026-11-02 (the short flags) prints Leo's week: 2 runs, 8.1 miles, a 9:38 pace", () => {
  const { out, code } = runLog(["-r", "Leo", "-w", "2026-11-02"]);
  assert.deepEqual(lines(out), [
    "Leo's week of 2026-11-02",
    "Runs: 2",
    "Total: 8.1 miles",
    "Average pace: 9:38 per mile",
    "Longest run: 5.0 miles",
  ]);
  assert.equal(code, 0);
});

test("9) --out summary.json saves Maya's week as JSON and prints \"Saved the summary to ...\"", async (t) => {
  const folder = await tempFolder(t);
  const { out, code } = runLog(["--runner", "Maya", "--week", "2026-11-02", "--out", "summary.json"], { cwd: folder });
  assert.deepEqual(lines(out), [...mayasWeek, "Saved the summary to summary.json"]);
  assert.equal(code, 0);
  const saved = await readFile(path.join(folder, "summary.json"), "utf8").catch(() => null);
  assert.ok(saved !== null, "summary.json should be saved in the terminal's folder, where --out says.");
  assert.deepEqual(JSON.parse(saved),
    { runner: "Maya", week: "2026-11-02", runs: 3, totalMiles: 14.5, averagePace: "9:35", longestRun: 6.2 });
  assert.match(saved, /\n {2}"runner"/, "Write the JSON with two-space indents: JSON.stringify(data, null, 2).");
});

test("10) node log.js --help prints the usage line and exits with 0", () => {
  const { out, code } = runLog(["--help"]);
  assert.equal(out, "Usage: node log.js --runner <name> --week <yyyy-mm-dd> [--out <file.json>]");
  assert.equal(code, 0);
});

test("11) With no --week, it prints \"Give a runner and a week ...\" to the error output and exits with 1", () => {
  const { out, err, code } = runLog(["--runner", "Maya"]);
  assert.equal(err, "Give a runner and a week, such as: node log.js --runner Maya --week 2026-11-02");
  assert.equal(out, "", "An error goes to console.error, so nothing should be printed with console.log.");
  assert.equal(code, 1, `The exit code should be 1 when it fails, but it was ${code}.`);
});

test("12) --runner Zoe prints \"There's no runner named Zoe in the training log.\" and exits with 1", () => {
  const { out, err, code } = runLog(["--runner", "Zoe", "--week", "2026-11-02"]);
  assert.equal(err, "There's no runner named Zoe in the training log.");
  assert.equal(out, "");
  assert.equal(code, 1);
});

test("13) --runner Jonah --week 2026-11-09 prints \"Jonah has no runs in the week of 2026-11-09.\" and exits with 0", () => {
  const { out, code } = runLog(["--runner", "Jonah", "--week", "2026-11-09"]);
  assert.equal(out, "Jonah has no runs in the week of 2026-11-09.");
  assert.equal(code, 0);
});

test("14) RUNLOG_DIR names another folder: it reads that folder's runs.csv (Priya, 2 runs, 7.0 miles)", async (t) => {
  const folder = await tempFolder(t);
  await writeFile(path.join(folder, "runs.csv"), "date,runner,miles,minutes\n2026-11-16,Priya,3.0,27\n2026-11-18,Priya,4.0,38\n");
  const { out, code } = runLog(["--runner", "Priya", "--week", "2026-11-16"], { env: { RUNLOG_DIR: folder } });
  assert.deepEqual(lines(out), [
    "Priya's week of 2026-11-16",
    "Runs: 2",
    "Total: 7.0 miles",
    "Average pace: 9:17 per mile",
    "Longest run: 4.0 miles",
  ]);
  assert.equal(code, 0);
});

test("15) RUNLOG_DIR names a folder with no runs.csv: \"Can't find the training log at ...\" and exit code 1", async (t) => {
  const folder = await tempFolder(t);
  const { out, err, code } = runLog(["--runner", "Maya", "--week", "2026-11-02"], { env: { RUNLOG_DIR: folder } });
  assert.match(err, /^Can't find the training log at .*runs\.csv\. Set RUNLOG_DIR to the folder that holds runs\.csv\.$/);
  assert.ok(err.includes(path.join(folder, "runs.csv")), "The message should name the full path it looked for.");
  assert.equal(out, "");
  assert.equal(code, 1);
});

test("16) Run from another folder with no RUNLOG_DIR, it still finds data/runs.csv beside log.js", () => {
  const { out, code } = runLog(["--runner", "Maya", "--week", "2026-11-02"], { cwd: os.tmpdir() });
  assert.deepEqual(lines(out), mayasWeek,
    "Build the path from import.meta.dirname, the script's own folder, not from the terminal's folder.");
  assert.equal(code, 0);
});
