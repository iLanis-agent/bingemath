// Binge Math engine: ordered episode runtimes against a nightly window - the nights the season takes, the total runtime, the night-by-night schedule, and the finish date. Exact integers, half-up on display only, civil-date arithmetic with no library. No named constants; every number is the owner's own entry.
function _i(t, err, digits, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  if (!new RegExp("^[0-9]{1," + digits + "}$").test(t)) throw new Error(err);
  var v = parseInt(t, 10);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
function _pl(n, one, many) { return n + (n === 1 ? one : many); }
function _v(n, one, many) { return n === 1 ? one : many; }
var _W = "the nightly window must be from 1 to 600 with no decimal places";
var _L = "enter 1 to 100 episode runtimes from 1 to 600 with no decimal places, split by spaces or commas";
var _D = "the start date must be a real date as YYYY-MM-DD between 2000 and 2100";
function _list(t) {
  var parts = typeof t === "string" ? t.trim().split(/[\s,]+/).filter(Boolean) : [];
  if (parts.length < 1 || parts.length > 100) throw new Error(_L);
  return parts.map(function (p) { return _i(p, _L, 3, 1, 600); });
}
function _days(y, m, d) {
  y -= m <= 2 ? 1 : 0;
  var era = Math.floor((y >= 0 ? y : y - 399) / 400);
  var yoe = y - era * 400;
  var doy = Math.floor((153 * (m > 2 ? m - 3 : m + 9) + 2) / 5) + d - 1;
  var doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}
function _civil(z) {
  z += 719468;
  var era = Math.floor((z >= 0 ? z : z - 146096) / 146097);
  var doe = z - era * 146097;
  var yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  var y = yoe + era * 400;
  var doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  var mp = Math.floor((5 * doy + 2) / 153);
  var d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  var m = mp + (mp < 10 ? 3 : -9);
  return [y + (m <= 2 ? 1 : 0), m, d];
}
function _date(t) {
  t = typeof t === "string" ? t.trim() : "";
  var m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(t);
  if (!m) throw new Error(_D);
  var y = +m[1], mo = +m[2], d = +m[3];
  if (y < 2000 || y > 2100) throw new Error(_D);
  var c = _civil(_days(y, mo, d));
  if (c[0] !== y || c[1] !== mo || c[2] !== d) throw new Error(_D);
  return _days(y, mo, d);
}
function _fmt(z) {
  var c = _civil(z);
  var wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(z + 4) % 7];
  function p(x) { return String(x).padStart(2, "0"); }
  return c[0] + "-" + p(c[1]) + "-" + p(c[2]) + ", a " + wd;
}
function _plan(window, t) {
  var w = _i(window, _W, 3, 1, 600), eps = _list(t);
  var nights = [], cur = [], sum = 0;
  for (var i = 0; i < eps.length; i++) {
    if (cur.length && sum + eps[i] > w) { nights.push(cur); cur = []; sum = 0; }
    cur.push(i + 1); sum += eps[i];
    if (sum >= w) { nights.push(cur); cur = []; sum = 0; }
  }
  if (cur.length) nights.push(cur);
  return { w: w, eps: eps, nights: nights };
}
function nightsTruth(window, t) {
  var p = _plan(window, t), n = p.nights.length, eps = p.eps;
  var last = p.nights[n - 1].reduce(function (a, e) { return a + p.eps[e - 1]; }, 0);
  return "The " + _pl(eps.length, " episode", " episodes") + " at " + _pl(p.w, " minute", " minutes") + " a night " + _v(eps.length, "takes", "take") + " " + _pl(n, " night", " nights") + ", the last night holding " + _pl(last, " minute", " minutes") + ".";
}
function totalTruth(t) {
  var eps = _list(t), s = eps.reduce(function (a, b) { return a + b; }, 0);
  var h = Math.floor(s / 60), r = s % 60;
  return "The " + _pl(eps.length, " episode", " episodes") + " " + _v(eps.length, "runs", "run") + " " + _pl(s, " minute", " minutes") + ", " + _pl(h, " hour", " hours") + " " + _pl(r, " minute", " minutes") + ".";
}
function scheduleTruth(window, t) {
  var p = _plan(window, t);
  return p.nights.map(function (ns, i) {
    var mins = ns.reduce(function (a, e) { return a + p.eps[e - 1]; }, 0);
    var span = ns.length === 1
      ? "episode " + ns[0]
      : "episodes " + ns[0] + " to " + ns[ns.length - 1];
    return "Night " + (i + 1) + ": " + span + ", " + _pl(mins, " minute", " minutes") + ".";
  });
}
function finishTruth(date, window, t) {
  var z = _date(date), p = _plan(window, t);
  return "Starting " + date.trim() + ", the last episode lands on " + _fmt(z + p.nights.length - 1) + ".";
}
