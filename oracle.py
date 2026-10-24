import json, random
def pl(n, one, many): return f"{n}" + (one if n == 1 else many)
def v(n, one, many): return one if n == 1 else many
def days(y, m, d):
    y -= m <= 2
    era = (y if y >= 0 else y-399)//400
    yoe = y - era*400
    doy = (153*(m-3 if m > 2 else m+9)+2)//5 + d-1
    doe = yoe*365 + yoe//4 - yoe//100 + doy
    return era*146097 + doe - 719468
def civil(z):
    z += 719468
    era = (z if z >= 0 else z-146096)//146097
    doe = z - era*146097
    yoe = (doe - doe//1460 + doe//36524 - doe//146096)//365
    y = yoe + era*400
    doy = doe - (365*yoe + yoe//4 - yoe//100)
    mp = (5*doy+2)//153
    d = doy - (153*mp+2)//5 + 1
    m = mp + (3 if mp < 10 else -9)
    return (y + (1 if m <= 2 else 0), m, d)
WD = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
def fmt(z):
    y,m,d = civil(z)
    return f"{y}-{m:02d}-{d:02d}, a {WD[(z+4)%7]}"
def plan(w, eps):
    nights, cur, s = [], [], 0
    for i, e in enumerate(eps):
        if cur and s + e > w:
            nights.append(cur); cur = []; s = 0
        cur.append(i+1); s += e
        if s >= w:
            nights.append(cur); cur = []; s = 0
    if cur: nights.append(cur)
    return nights
def nights_t(w, eps):
    ns = plan(w, eps)
    last = sum(eps[e-1] for e in ns[-1])
    return f"The {pl(len(eps),' episode',' episodes')} at {pl(w,' minute',' minutes')} a night {v(len(eps),'takes','take')} {pl(len(ns),' night',' nights')}, the last night holding {pl(last,' minute',' minutes')}."
def total_t(eps):
    s = sum(eps); h, r = divmod(s, 60)
    return f"The {pl(len(eps),' episode',' episodes')} {v(len(eps),'runs','run')} {pl(s,' minute',' minutes')}, {pl(h,' hour',' hours')} {pl(r,' minute',' minutes')}."
def schedule_t(w, eps):
    out = []
    for i, ns in enumerate(plan(w, eps)):
        mins = sum(eps[e-1] for e in ns)
        span = f"episode {ns[0]}" if len(ns) == 1 else f"episodes {ns[0]} to {ns[-1]}"
        out.append(f"Night {i+1}: {span}, {pl(mins,' minute',' minutes')}.")
    return out
def finish_t(date, w, eps):
    y, m, d = int(date[0:4]), int(date[5:7]), int(date[8:10])
    z = days(y, m, d)
    return f"Starting {date}, the last episode lands on {fmt(z + len(plan(w, eps)) - 1)}."
random.seed(798)
R = random.randint
DEF = "45 42 50 38 44 41 36 40"
def L(eps): return " ".join(str(e) for e in eps)
cases = [
 dict(fn="nights", args=["90",DEF], expect=nights_t(90,[45,42,50,38,44,41,36,40])),
 dict(fn="total", args=[DEF], expect=total_t([45,42,50,38,44,41,36,40])),
 dict(fn="schedule", args=["90",DEF], expect=schedule_t(90,[45,42,50,38,44,41,36,40])),
 dict(fn="finish", args=["2026-10-24","90",DEF], expect=finish_t("2026-10-24",90,[45,42,50,38,44,41,36,40])),
 dict(fn="nights", args=["90","45"], expect=nights_t(90,[45])),
 dict(fn="total", args=["45"], expect=total_t([45])),
 dict(fn="schedule", args=["90","45"], expect=schedule_t(90,[45])),
 dict(fn="finish", args=["2026-10-24","90","45"], expect=finish_t("2026-10-24",90,[45])),
 dict(fn="nights", args=["45",DEF], expect=nights_t(45,[45,42,50,38,44,41,36,40])),
 dict(fn="finish", args=["2026-12-31","600","1"], expect=finish_t("2026-12-31",600,[1])),
 dict(fn="finish", args=["2024-02-28","1","1"], expect=finish_t("2024-02-28",1,[1])),
 dict(fn="nights", args=["600",L([600]*100)], expect=nights_t(600,[600]*100)),
 dict(fn="nights", args=["1",L([1]*100)], expect=nights_t(1,[1]*100)),
]
for _ in range(20):
    w=R(1,600); k=R(1,20); eps=[R(1,600) for _ in range(k)]
    cases.append(dict(fn="nights", args=[str(w),L(eps)], expect=nights_t(w,eps)))
for _ in range(20):
    k=R(1,30); eps=[R(1,600) for _ in range(k)]
    cases.append(dict(fn="total", args=[L(eps)], expect=total_t(eps)))
for _ in range(22):
    w=R(1,600); k=R(1,15); eps=[R(1,600) for _ in range(k)]
    cases.append(dict(fn="schedule", args=[str(w),L(eps)], expect=schedule_t(w,eps)))
for _ in range(24):
    y=R(2000,2100); m=R(1,12); d=R(1,28); date=f"{y}-{m:02d}-{d:02d}"
    w=R(1,600); k=R(1,10); eps=[R(1,600) for _ in range(k)]
    cases.append(dict(fn="finish", args=[date,str(w),L(eps)], expect=finish_t(date,w,eps)))
errs=[["nights",["0","45"]],["nights",["601","45"]],["nights",["2.5","45"]],["nights",["90",""]],["nights",["90","0"]],
 ["nights",["90","601"]],["nights",["90","45 2.5"]],["total",[""]],["total",[str(R(601,700))]],["total",["1 "*101]],
 ["schedule",["90","abc"]],["schedule",["0","45"]],["finish",["2026-13-01","90","45"]],["finish",["2026-02-30","90","45"]],
 ["finish",["1999-01-01","90","45"]],["finish",["2101-01-01","90","45"]],["finish",["24-10-2026","90","45"]],["finish",["2026-10-24","601","45"]],
 ["finish",["2026-10-24","90",""]],["schedule",["90","-45"]]]
json.dump(dict(cases=cases, errors=errs), open("expected.json","w"), indent=1)
print(len(cases),"cases,",len(errs),"errcases")
