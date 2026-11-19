// The training log's calculations. For you to finish.
//
// parseRuns(text)
//   text: the whole text of runs.csv. Its first line is the header, date,runner,miles,minutes, and every line
//   after it is one run, such as 2026-11-02,Maya,4.0,38.
//   Returns an array with one object per run, in the file's order: { date, runner, miles, minutes }.
//   date and runner stay text; miles and minutes are numbers (4.0 becomes 4, and 38 becomes 38).
//   Skips blank lines, such as the empty line after the last run. Lines may end with \r\n (a file saved on Windows).
//
//   parseRuns("date,runner,miles,minutes\n2026-11-02,Maya,4.0,38\n")
//     -> [{ date: "2026-11-02", runner: "Maya", miles: 4, minutes: 38 }]
//
// runsForWeek(runs, runner, week)
//   runs: an array from parseRuns. runner: a name, such as "Maya". week: the Monday the week starts on, such as
//   "2026-11-02". The week runs from that Monday to the Sunday six days later, both days included.
//   Returns that runner's runs in that week, in the same order. addDays (in helpers.js) gives the Sunday.
//
//   runsForWeek(runs, "Maya", "2026-11-02") -> Maya's three runs on 2026-11-02, 2026-11-04 and 2026-11-06
//
// summarize(runs)
//   runs: one runner's runs for a week (at least one).
//   Returns { runs, totalMiles, averagePace, longestRun }:
//     runs         how many runs there are
//     totalMiles   every run's miles added up, rounded to one decimal place
//     averagePace  every run's minutes added up, divided by totalMiles before rounding, as formatPace (in
//                  helpers.js) writes it, such as "9:35"
//     longestRun   the most miles in one run
//
//   summarize(Maya's three runs) -> { runs: 3, totalMiles: 14.5, averagePace: "9:35", longestRun: 6.2 }
// For now, each function returns an empty answer.
import { addDays, formatPace } from "./helpers.js";

export function parseRuns(text) {
  return [];
}

export function runsForWeek(runs, runner, week) {
  return [];
}

export function summarize(runs) {
  return { runs: 0, totalMiles: 0, averagePace: "0:00", longestRun: 0 };
}
