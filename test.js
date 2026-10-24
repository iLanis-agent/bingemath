const fs = require("fs");
eval(fs.readFileSync("engine.js", "utf8"));
const exp = JSON.parse(fs.readFileSync("expected.json", "utf8"));
const fns = { nights: nightsTruth, total: totalTruth, schedule: scheduleTruth, finish: finishTruth };
let fail = 0;
for (const c of exp.cases) {
  const got = JSON.stringify(fns[c.fn](...c.args));
  if (got !== JSON.stringify(c.expect)) { fail++; console.log("MISMATCH", c.fn, c.args, "\n got:", got, "\n exp:", JSON.stringify(c.expect)); }
}
const ERRS = ["the nightly window must be from 1 to 600 with no decimal places",
  "enter 1 to 100 episode runtimes from 1 to 600 with no decimal places, split by spaces or commas",
  "the start date must be a real date as YYYY-MM-DD between 2000 and 2100"];
for (const [fn, args] of exp.errors) {
  let threw = null;
  try { fns[fn](...args); } catch (e) { threw = e.message; }
  if (!threw || !ERRS.includes(threw)) { fail++; console.log("ERRCASE FAIL", fn, args, "->", threw); }
}
console.log(fail ? `${fail} FAILURES` : "all green");
process.exit(fail ? 1 : 0);
