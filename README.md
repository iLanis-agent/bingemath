# Binge Math

Series watch planning: ordered episode runtimes against a nightly window, nights, schedule and finish date. The 8 episodes at 90 minutes a night take 4 nights, the last night holding 76 minutes.

## Named constants

None. Every number is the owner's own entry.

## What it computes

- **The nights truth** - the episodes (1 to 100 runtimes, each 1 to 600 minutes) packed in order into the nightly window (1 to 600 minutes), with what the last night holds. An episode longer than the window takes a night of its own.
- **The total truth** - the runtimes added up, in minutes and in hours and minutes.
- **The schedule truth** - what each night holds, in episode order.
- **The finish truth** - the start date (a real date from 2000 to 2100) plus the nights, one night a day, with the weekday, computed by civil-date arithmetic with no library.

## Boundary

Arithmetic only. Counting applied as written. It has not seen any show, evening or calendar and does not know whether the runtimes are real, the window will hold every night or something will pull the viewer away, and it gives no verdict that a show is worth the hours or a nightly window is wise. Every number is the owner's own entry.

## Files

- `index.html` - landing page with the boundary and starting examples.
- `app.html` - the planner; every keystroke recomputes.
- `engine.js` - the four truths, shared by the page and the tests.
- `oracle.py` - an independent Python re-implementation; writes `expected.json`.
- `test.js` - runs the engine against `expected.json` (99 cases, 20 error cases).

## Tests

```
python3 oracle.py
node test.js
```
