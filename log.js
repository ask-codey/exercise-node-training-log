// The training log command. For you to finish.
//
// Run it from a terminal, such as: node log.js --runner Maya --week 2026-11-02
//
// Where runs.csv is: in the folder the RUNLOG_DIR environment variable names, when it's set. When it isn't, in the
// data folder beside log.js, whatever folder the terminal is in.
//
// Options: --runner (short -r), --week (short -w), --out (short -o) and --help (short -h).
//
//   node log.js --runner Maya --week 2026-11-02
//     prints these five lines, and the exit code is 0:
//       Maya's week of 2026-11-02
//       Runs: 3
//       Total: 14.5 miles
//       Average pace: 9:35 per mile
//       Longest run: 6.2 miles
//     (Total and Longest run always show one decimal place: 8 miles prints as 8.0 miles.)
//
//   node log.js --runner Maya --week 2026-11-02 --out summary.json
//     prints the same five lines, writes the summary to summary.json as JSON with two-space indents:
//       { "runner": "Maya", "week": "2026-11-02", "runs": 3, "totalMiles": 14.5, "averagePace": "9:35", "longestRun": 6.2 }
//     then prints one more line: Saved the summary to summary.json
//     (the file goes where --out says, starting from the terminal's folder)
//
//   node log.js --help
//     prints Usage: node log.js --runner <name> --week <yyyy-mm-dd> [--out <file.json>]
//     and the exit code is 0
//
//   node log.js --runner Jonah --week 2026-11-09
//     a runner in the log with no runs that week: prints Jonah has no runs in the week of 2026-11-09.
//     The exit code is 0, and nothing is saved, even with --out.
//
// The errors: each message goes to console.error, nothing else is printed, and the exit code is 1.
//   No --runner, or no --week:
//     Give a runner and a week, such as: node log.js --runner Maya --week 2026-11-02
//   No runs.csv in the folder:
//     Can't find the training log at <the full path of runs.csv>. Set RUNLOG_DIR to the folder that holds runs.csv.
//   A runner with no runs anywhere in the log, such as Zoe:
//     There's no runner named Zoe in the training log.
//
// For now, log.js prints one line, whatever it's given.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { parseRuns, runsForWeek, summarize } from "./training.js";

console.log("Not built yet.");
