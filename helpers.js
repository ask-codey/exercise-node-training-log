// Two small helpers for training.js. Ready to use: you don't need to change this file.

// addDays("2026-11-02", 6) gives "2026-11-08": the date that many days later, as yyyy-mm-dd text.
export function addDays(date, days) {
  const day = new Date(`${date}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + days);
  return day.toISOString().slice(0, 10);
}

// formatPace(9.5) gives "9:30": minutes per mile as minutes and seconds, the way runners say a pace.
export function formatPace(minutesPerMile) {
  const seconds = Math.round(minutesPerMile * 60);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
