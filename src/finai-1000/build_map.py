# -*- coding: utf-8 -*-
import json, html

# ---- Taxonomy ----------------------------------------------------------------
CATEGORIES = [  # (token, label)  — ordered for visual payoff in the matrix
 ("REG","Regulatory Compliance & Fin-Crime"),
 ("IDF","Identity & Fraud"),
 ("LEND","Lending, Credit & BNPL"),
 ("BAP","Brokerage, Advisory & PFM"),
 ("DOC","Data & Document Mgmt"),
 ("OPS","Operations & Workflow"),
 ("RISK","Risk Management"),
 ("PAY","Payments & Money Movement"),
 ("DBP","Digital Banking Platforms"),
 ("ONB","Client Onboarding"),
 ("CORE","Core Banking & Infrastructure"),
 ("FIN","Finance & Accounting"),
 ("TRE","Treasury / AP / AR"),
 ("CRM","CRM & Customer Marketing"),
 ("SVC","Servicing Platform"),
 ("LEG","Legal Services"),
 ("CARD","Card Issuer Services"),
 ("WAL","Digital Wallet"),
 ("DEP","Deposit Management"),
 ("MER","Merchant Services"),
 ("CYB","Cyber & Security"),
 ("CAP","Capital Markets & Trading"),
 ("MRM","Model Risk & AI Governance"),
 ("INS","Insurance & Claims"),
 ("OTH","Other"),
]
SEGMENTS = [
 ("CON","Consumer"),
 ("SMB","SMB / Small Business"),
 ("COM","Commercial"),
 ("WEA","Wealth"),
 ("SPE","Specialty / Other"),
 ("INT","Internal / Bank Ops"),
]

def C(n,d,t,u,h,c,s,g="",f="",i="",r="",p="",x="",a="",st="Independent",fl=None):
    return {"n":n,"d":d,"t":t,"u":u,"h":h,"c":c,"s":s,"g":g,"f":f,"i":i,
            "r":r,"p":p,"x":x,"a":a,"st":st,"fl":fl}

import json as _json
CO = _json.load(open("/home/claude/companies.json", encoding="utf-8"))
print("Loaded", len(CO), "companies from companies.json")

# dedup safety net (by name)
seen=set(); CLEAN=[]
for x in CO:
    if x["n"] in seen: continue
    seen.add(x["n"]); CLEAN.append(x)
CO=CLEAN

data_json=json.dumps(CO, ensure_ascii=False)
cats_json=json.dumps(CATEGORIES, ensure_ascii=False)
segs_json=json.dumps(SEGMENTS, ensure_ascii=False)

TPL = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<title>AI in Financial Services — Coverage Map · Catalyst-DNA</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#09090B; --ink2:#18181B; --ink3:#27272A; --paper:#09090B; --card:#18181B;
  --line:#27272A; --line2:#1F1F23; --muted:#A1A1AA; --text:#FAFAFA;
  --pure:#F59E0B;            /* pure-play AI — warm amber */
  --pure-weak:#3A2A12;
  --enab:#94A3B8;            /* AI-enabled — cool slate */
  --enab-weak:#23262E;
  --focus:#3B82F6;           /* interactive / focus / links — Catalyst blue */
  --add:#8B5CF6;             /* additions */
  --shadow:0 1px 2px rgba(0,0,0,.5),0 12px 34px rgba(0,0,0,.55);
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--paper);color:var(--text);font-family:"IBM Plex Sans",system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;line-height:1.5;font-size:15px;}
.mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
.disp{font-family:"Space Grotesk",system-ui,sans-serif}
a{color:inherit}
.wrap{max-width:1280px;margin:0 auto;padding:0 24px}
.eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}

/* ---------- Header ---------- */
.hd{background:var(--ink);color:#EAF0F6;border-bottom:1px solid var(--line);
  background-image:radial-gradient(900px 320px at 12% -10%, rgba(59,130,246,.16), transparent 60%),
                   radial-gradient(820px 320px at 92% -20%, rgba(245,158,11,.10), transparent 60%);}
.hd .wrap{padding-top:30px;padding-bottom:26px}
.brandline{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:11px;font-family:"IBM Plex Mono",monospace;letter-spacing:.16em;
  font-size:12px;text-transform:uppercase;color:#C7D3E0}
.brand .helix{width:18px;height:18px}
.brand b{color:#fff;font-weight:600}
.hd h1{font-family:"Space Grotesk",sans-serif;font-weight:600;letter-spacing:-.02em;line-height:1.02;
  margin:18px 0 8px;font-size:clamp(30px,5vw,52px);color:#fff;max-width:18ch}
.hd .sub{color:#AFBDCC;max-width:62ch;font-size:15.5px;margin:0}
.hd .asof{margin-top:6px}
/* ticker */
.ticker{display:flex;flex-wrap:wrap;gap:0;margin-top:24px;border-top:1px solid rgba(255,255,255,.1)}
.stat{flex:1 1 0;min-width:150px;padding:16px 18px 4px;border-right:1px solid rgba(255,255,255,.08)}
.stat:last-child{border-right:0}
.stat .v{font-family:"Space Grotesk",sans-serif;font-weight:600;font-size:30px;line-height:1;color:#fff;
  letter-spacing:-.01em;display:flex;align-items:baseline;gap:8px}
.stat .v small{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:500;color:#8FA0B3;letter-spacing:.04em}
.stat .k{font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#8FA0B3;margin-top:7px}
.stat.pure .v{color:var(--pure)} .stat.enab .v{color:#9FB6CC}

/* ---------- Controls ---------- */
.controls{position:sticky;top:0;z-index:40;background:rgba(246,245,241,.92);backdrop-filter:blur(8px);
  border-bottom:1px solid var(--line)}
.controls .wrap{padding-top:14px;padding-bottom:14px;display:flex;flex-direction:column;gap:12px}
.crow{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.search{flex:1 1 280px;min-width:220px;position:relative}
.search input{width:100%;padding:11px 14px 11px 38px;border:1px solid var(--line);border-radius:9px;background:#fff;
  font:inherit;font-size:14px;color:var(--text)}
.search input:focus{outline:2px solid var(--focus);outline-offset:1px;border-color:transparent}
.search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--muted)}
.viewtoggle{display:inline-flex;border:1px solid var(--line);border-radius:9px;overflow:hidden;background:#fff}
.viewtoggle button{font:inherit;font-size:13px;padding:10px 16px;border:0;background:transparent;cursor:pointer;color:var(--muted);
  display:inline-flex;align-items:center;gap:7px}
.viewtoggle button[aria-pressed="true"]{background:var(--ink);color:#fff}
.seg{display:inline-flex;align-items:center;gap:8px}
.seg>.lbl{font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.pills{display:inline-flex;border:1px solid var(--line);border-radius:999px;background:#fff;padding:3px;gap:2px}
.pill{font:inherit;font-size:13px;padding:6px 13px;border:0;border-radius:999px;background:transparent;cursor:pointer;color:var(--muted);white-space:nowrap}
.pill[aria-pressed="true"]{background:var(--text);color:#fff}
.pill.is-pure[aria-pressed="true"]{background:var(--pure)}
.pill.is-enab[aria-pressed="true"]{background:var(--enab)}
.selectwrap{position:relative}
.dropbtn{font:inherit;font-size:13px;padding:9px 13px;border:1px solid var(--line);border-radius:9px;background:#fff;cursor:pointer;
  color:var(--text);display:inline-flex;align-items:center;gap:8px}
.dropbtn .cnt{font-family:"IBM Plex Mono",monospace;font-size:11px;background:var(--ink);color:#fff;border-radius:6px;padding:1px 6px}
.menu{position:absolute;top:calc(100% + 6px);left:0;z-index:60;background:#fff;border:1px solid var(--line);border-radius:11px;
  box-shadow:var(--shadow);padding:8px;min-width:250px;max-height:330px;overflow:auto;display:none}
.menu.open{display:block}
.menu label{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:7px;font-size:13.5px;cursor:pointer}
.menu label:hover{background:var(--line2)}
.menu input{accent-color:var(--focus);width:15px;height:15px}
.clear{font:inherit;font-size:12.5px;color:var(--focus);background:none;border:0;cursor:pointer;padding:8px 4px}
.clear[hidden]{display:none}
.legend{display:flex;gap:16px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--muted)}
.legend .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:middle}

/* ---------- Matrix ---------- */
.section{padding:30px 0 56px}
.mtx-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:14px}
.mtx-head h2{font-family:"Space Grotesk",sans-serif;font-weight:600;font-size:22px;margin:0;letter-spacing:-.01em}
.mtx-head p{margin:4px 0 0;color:var(--muted);font-size:13.5px;max-width:60ch}
.matrix-scroll{overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:var(--shadow)}
table.matrix{border-collapse:collapse;width:100%;min-width:760px}
table.matrix th,table.matrix td{border-bottom:1px solid var(--line2);border-right:1px solid var(--line2)}
table.matrix thead th{position:sticky;top:0;background:#fff;z-index:2;padding:12px 8px;vertical-align:bottom;
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);
  text-align:center;line-height:1.25}
table.matrix tbody th{position:sticky;left:0;background:#fff;z-index:1;text-align:left;padding:10px 12px;
  font-size:12.5px;font-weight:500;color:var(--text);min-width:188px;border-right:1px solid var(--line)}
table.matrix tbody th .rc{font-family:"IBM Plex Mono",monospace;font-size:10px;color:var(--muted);display:block;margin-top:2px}
td.cell{padding:0;text-align:center;height:46px;cursor:pointer;position:relative;transition:transform .05s}
td.cell .num{font-family:"IBM Plex Mono",monospace;font-size:13px;font-weight:600;position:relative;z-index:2}
td.cell.empty{cursor:default}
td.cell.empty .num{color:#C9CcD2;font-weight:400}
td.cell:hover:not(.empty){outline:2px solid var(--focus);outline-offset:-2px}
td.cell .bar{position:absolute;left:0;bottom:0;height:3px;z-index:2}
.colgroup-top{background:#fff}
.mtx-tip{position:fixed;z-index:200;pointer-events:none;background:var(--ink);color:#fff;border-radius:9px;padding:9px 11px;
  font-size:12px;max-width:240px;box-shadow:0 8px 30px rgba(0,0,0,.3);opacity:0;transform:translateY(4px);transition:opacity .12s}
.mtx-tip.show{opacity:1;transform:none}
.mtx-tip b{font-family:"Space Grotesk",sans-serif}
.mtx-tip .names{color:#B9C6D4;margin-top:4px;line-height:1.4}

/* ---------- Directory ---------- */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.cardc{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:16px;cursor:pointer;
  display:flex;flex-direction:column;gap:11px;transition:border-color .12s,box-shadow .12s,transform .12s;position:relative;overflow:hidden}
.cardc:hover{border-color:#D4CFC2;box-shadow:var(--shadow);transform:translateY(-2px)}
.cardc:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
.cardc .edge{position:absolute;left:0;top:0;bottom:0;width:3px}
.cardc.tp .edge{background:var(--pure)} .cardc.te .edge{background:var(--enab)}
.ctop{display:flex;align-items:center;gap:11px}
.logo{width:38px;height:38px;border-radius:9px;border:1px solid var(--line2);background:#fff;flex:0 0 38px;
  display:flex;align-items:center;justify-content:center;overflow:hidden;font-family:"Space Grotesk",sans-serif;font-weight:600;color:#9AA4B2}
.logo img{width:100%;height:100%;object-fit:contain}
.cname{font-family:"Space Grotesk",sans-serif;font-weight:600;font-size:16px;line-height:1.15;letter-spacing:-.01em}
.chq{font-family:"IBM Plex Mono",monospace;font-size:10.5px;color:var(--muted);margin-top:2px;display:flex;align-items:center;gap:6px}
.flag{font-size:10px}
.cdesc{font-size:13px;color:#3a4654;line-height:1.45;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
.tag{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);
  border:1px solid var(--line);border-radius:6px;padding:3px 7px;background:#FBFAF7}
.badge{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.07em;text-transform:uppercase;padding:3px 7px;border-radius:6px;font-weight:600}
.b-pure{background:var(--pure-weak);color:#8A5316} .b-enab{background:var(--enab-weak);color:#3C5670}
.b-add{background:#ECE7F5;color:#574A86}.b-low{background:#F0EFEA;color:#7A7468}
.b-st{background:#EFEDE7;color:#6B7280;border:1px solid var(--line)}
.crow2{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.empty-state{text-align:center;padding:60px 20px;color:var(--muted)}
.empty-state h3{font-family:"Space Grotesk",sans-serif;color:var(--text);margin:0 0 6px}

/* ---------- Drawer ---------- */
.scrim{position:fixed;inset:0;background:rgba(14,26,43,.42);opacity:0;visibility:hidden;transition:opacity .2s;z-index:90}
.scrim.open{opacity:1;visibility:visible}
.drawer{position:fixed;top:0;right:0;height:100%;width:min(460px,94vw);background:#fff;z-index:100;transform:translateX(100%);
  transition:transform .26s cubic-bezier(.4,0,.2,1);box-shadow:-12px 0 40px rgba(14,26,43,.18);display:flex;flex-direction:column}
.drawer.open{transform:none}
.dr-top{padding:22px 24px;border-bottom:1px solid var(--line);position:relative}
.dr-top .x{position:absolute;top:16px;right:16px;border:1px solid var(--line);background:#fff;border-radius:8px;width:34px;height:34px;
  cursor:pointer;font-size:17px;color:var(--muted);line-height:1}
.dr-id{display:flex;align-items:center;gap:13px;padding-right:40px}
.dr-id .logo{width:48px;height:48px;flex-basis:48px;border-radius:11px}
.dr-id h3{font-family:"Space Grotesk",sans-serif;font-weight:600;font-size:22px;margin:0;letter-spacing:-.01em}
.dr-id .site{font-family:"IBM Plex Mono",monospace;font-size:11.5px;color:var(--focus);text-decoration:none}
.dr-badges{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}
.dr-body{padding:6px 24px 30px;overflow:auto}
.dr-x{font-size:14.5px;color:#33404e;margin:18px 0 6px;line-height:1.55}
.field{padding:13px 0;border-bottom:1px solid var(--line2)}
.field .l{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);margin-bottom:5px}
.field .d{font-size:13.5px;color:var(--text);line-height:1.5}
.chiplist{display:flex;flex-wrap:wrap;gap:6px}
.chip2{font-size:11.5px;border:1px solid var(--line);border-radius:7px;padding:3px 9px;background:#FBFAF7;color:#3a4654}

/* ---------- Footer ---------- */
.ft{background:var(--ink);color:#AFBDCC;margin-top:0}
.ft .wrap{padding:40px 24px}
.ft .cta{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-bottom:26px;border-bottom:1px solid rgba(255,255,255,.1)}
.ft .cta h3{font-family:"Space Grotesk",sans-serif;color:#fff;font-weight:600;font-size:20px;margin:0 0 4px}
.ft .cta p{margin:0;font-size:14px;max-width:48ch}
.ft .cta a{font-family:"IBM Plex Mono",monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);
  background:var(--pure);padding:12px 18px;border-radius:9px;text-decoration:none;white-space:nowrap;font-weight:600}
.ft .meta{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-top:22px;font-size:12px;color:#7E8EA0}
.ft .meta .mono{color:#9FB0C2}
.ft details{margin-top:14px;font-size:12px;color:#8FA0B3;max-width:80ch}
.ft summary{cursor:pointer;color:#B9C6D4;font-family:"IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase;font-size:10.5px}
.ft details p{margin:8px 0 0;line-height:1.6}

.hide{display:none!important}
@media (max-width:640px){
  .stat{min-width:50%;flex:1 1 50%}
  .hd .wrap{padding-top:22px}
  table.matrix tbody th{min-width:150px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
/* ===== Catalyst-DNA dark theme overrides ===== */
.controls{background:rgba(9,9,11,.9)}
.search input{background:#141417;border-color:var(--line);color:var(--text)}
.search input::placeholder{color:var(--muted)}
.viewtoggle,.pills,.dropbtn{background:#141417;border-color:var(--line);color:var(--text)}
.viewtoggle button{color:var(--muted)}
.viewtoggle button[aria-pressed="true"]{background:var(--focus);color:#08111f}
.pill[aria-pressed="true"]{color:#08111f}
.menu{background:#141417;border-color:var(--line);box-shadow:0 14px 44px rgba(0,0,0,.6)}
.menu label:hover{background:#1d1d22}
.cardc{background:var(--card);border-color:var(--line)}
.cardc:hover{border-color:#3a3b42;box-shadow:var(--shadow)}
.logo{background:#0f0f12;border-color:var(--line)}
.tag{border-color:var(--line)}
.b-pure{background:var(--pure-weak);color:#F7B53D}
.b-enab{background:var(--enab-weak);color:#C3CEDA}
.b-st{background:#23262E;color:#C3CEDA}
.b-add{background:#241c3a;color:#C4B5FD}
.b-low{background:#2a2333;color:#cbb8e6}
.drawer{background:#0d0d10;border-left-color:var(--line)}
.field .d,.dr-x{color:var(--text)}
.chip2{background:#1b1b20;border-color:var(--line);color:var(--muted)}
td.cell{border-color:var(--line2)}
table.matrix tbody th,table.matrix thead th{color:var(--muted)}
.loadmore{display:block;margin:24px auto 6px;font-family:"JetBrains Mono",monospace;font-size:12.5px;
  letter-spacing:.06em;color:var(--text);background:#141417;border:1px solid var(--line);
  border-radius:10px;padding:12px 22px;cursor:pointer}
.loadmore:hover{border-color:var(--focus);color:#fff}
.loadmore.hide{display:none}
</style>
</head>
<body>

<header class="hd">
  <div class="wrap">
    <div class="brandline">
      <div class="brand">
        <svg class="helix" viewBox="0 0 24 24" fill="none" stroke="#C6792F" stroke-width="1.6" stroke-linecap="round">
          <path d="M7 3c0 4 10 5 10 9s-10 5-10 9"/><path d="M17 3c0 4-10 5-10 9s10 5 10 9"/>
          <path d="M8.5 6h7M8.5 18h7M7.6 9.4h8.8M7.6 14.6h8.8" stroke-width="1.1"/>
        </svg>
        <span><b>CATALYST·DNA</b> &nbsp;/&nbsp; coverage intelligence</span>
      </div>
      <div class="eyebrow">Market Map · v1.0</div>
    </div>
    <h1>AI in Financial&nbsp;Services</h1>
    <p class="sub">The companies building artificial-intelligence applications for banking, lending, payments, wealth and risk — and where the pure-play innovation actually sits.</p>
    <p class="eyebrow asof">Coverage as of June 2026 · ${TOTAL} companies tracked</p>

    <div class="ticker" id="ticker">
      <div class="stat"><div class="v" id="s-total">0<small id="s-total-of"></small></div><div class="k">Companies shown</div></div>
      <div class="stat pure"><div class="v" id="s-pure">0<small id="s-pure-pct"></small></div><div class="k">Pure-play AI</div></div>
      <div class="stat enab"><div class="v" id="s-enab">0</div><div class="k">AI-enabled</div></div>
      <div class="stat"><div class="v" id="s-cats">0<small>/ ${NCAT}</small></div><div class="k">Categories covered</div></div>
      <div class="stat"><div class="v" id="s-us">0<small id="s-us-pct"></small></div><div class="k">US-headquartered</div></div>
    </div>
  </div>
</header>

<div class="controls">
  <div class="wrap">
    <div class="crow">
      <div class="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
        <input id="q" type="search" placeholder="Search companies, capabilities, investors…" autocomplete="off"/>
      </div>
      <div class="viewtoggle" role="group" aria-label="View">
        <button id="v-matrix" aria-pressed="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Coverage matrix</button>
        <button id="v-grid" aria-pressed="false">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1.4"/><circle cx="3.5" cy="12" r="1.4"/><circle cx="3.5" cy="18" r="1.4"/></svg>
          Directory</button>
      </div>
    </div>

    <div class="crow">
      <div class="seg"><span class="lbl">Type</span>
        <div class="pills" id="type-pills" role="group" aria-label="Company type">
          <button class="pill" data-type="all" aria-pressed="true">All</button>
          <button class="pill is-pure" data-type="pure" aria-pressed="false">Pure-play AI</button>
          <button class="pill is-enab" data-type="enab" aria-pressed="false">AI-enabled</button>
        </div>
      </div>
      <div class="seg"><span class="lbl">Geography</span>
        <div class="pills" id="geo-pills" role="group" aria-label="Geography">
          <button class="pill" data-geo="us" aria-pressed="true">US</button>
          <button class="pill" data-geo="non" aria-pressed="false">Non-US</button>
          <button class="pill" data-geo="all" aria-pressed="false">All</button>
        </div>
        <div class="pills" id="tier-pills" role="group" aria-label="Company tier">
          <button class="pill" data-tier="all" aria-pressed="true">All</button>
          <button class="pill" data-tier="inc" aria-pressed="false">Incumbents</button>
          <button class="pill" data-tier="chl" aria-pressed="false">Challengers</button>
        </div>
      </div>
      <div class="selectwrap"><button class="dropbtn" id="cat-btn">Category <span class="cnt" id="cat-cnt" hidden>0</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="menu" id="cat-menu"></div></div>
      <div class="selectwrap"><button class="dropbtn" id="seg-btn">Segment <span class="cnt" id="seg-cnt" hidden>0</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="menu" id="seg-menu"></div></div>
      <button class="clear" id="clear" hidden>Reset filters</button>
    </div>
    <div class="crow legend">
      <span><span class="dot" style="background:var(--pure)"></span>Pure-play AI — AI/ML is the core; remove it and the product collapses</span>
      <span><span class="dot" style="background:var(--enab)"></span>AI-enabled — an established platform with AI added as a feature</span>
      <span><span class="dot" style="background:var(--add)"></span>2026 addition (not in source list)</span>
    </div>
  </div>
</div>

<main class="wrap section">
  <!-- MATRIX -->
  <section id="view-matrix">
    <div class="mtx-head">
      <div>
        <h2>Coverage matrix</h2>
        <p>Service category × customer segment. Cell shade = number of companies; the figure turns <span style="color:var(--pure);font-weight:600">amber</span> where pure-play AI leads the cell and <span style="color:var(--enab);font-weight:600">steel</span> where AI-enabled incumbents do. Click any cell to open that slice in the directory.</p>
      </div>
      <div class="eyebrow" id="mtx-context"></div>
    </div>
    <div class="matrix-scroll"><table class="matrix" id="matrix"></table></div>
  </section>

  <!-- DIRECTORY -->
  <section id="view-grid" class="hide">
    <div class="grid" id="grid"></div>
    <div class="empty-state hide" id="empty">
      <h3>No companies match these filters</h3>
      <p>Try widening the type or geography, or reset the filters above.</p>
    </div>
  </section>
</main>

<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-hidden="true" aria-label="Company detail"></aside>
<div class="mtx-tip" id="tip"></div>

<footer class="ft">
  <div class="wrap">
    <div class="cta">
      <div>
        <h3>Building AI for financial services?</h3>
        <p>This map keeps growing. If your company belongs here, or a detail needs updating, send a note and we'll add it.</p>
      </div>
      <a href="mailto:hello@catalyst-dna.com?subject=AI%20in%20Financial%20Services%20market%20map">Submit a company</a>
    </div>
    <div class="meta">
      <span>Curated by <b style="color:#fff">Catalyst-DNA</b> — data &amp; AI strategy for financial services.</span>
      <span class="mono">Coverage as of June 2026</span>
    </div>
    <details>
      <summary>Methodology &amp; caveats</summary>
      <p><b>Pure-play vs AI-enabled</b> is a judgment classification: a company is "pure-play" only if removing AI/ML collapses its core value proposition. Reasonable observers may differ, especially for platform companies spanning several categories. Segment and category tags follow Catalyst-DNA's coverage taxonomy and may assign a company to more than one.</p>
      <p>Funding, investor and customer fields are point-in-time (June 2026), drawn from public sources and aggregators that sometimes disagree; figures are approximate and marked "Undisclosed" where unverified. Several entities have changed status since the source list was compiled (acquisitions and rebrands are noted on each card). A small number of ambiguous or stealth names from the source list were withheld pending verification. Logos are fetched from public favicon services and remain the property of their owners. Nothing here is investment advice.</p>
    </details>
  </div>
</footer>

<script>
const COMPANIES = /*__COMPANIES__*/;
const CATEGORIES = /*__CATEGORIES__*/;
const SEGMENTS   = /*__SEGMENTS__*/;
const CATLABEL = Object.fromEntries(CATEGORIES.map(c=>[c[0],c[1]]));
const SEGLABEL = Object.fromEntries(SEGMENTS.map(s=>[s[0],s[1]]));
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

const state = { q:'', type:'all', geo:'us', tier:'all', cats:new Set(), segs:new Set(), view:'matrix' };

/* ---------- filtering ---------- */
function passes(c){
  if(state.type!=='all' && c.t!==state.type) return false;
  if(state.geo==='us' && !c.u) return false;
  if(state.geo==='non' && c.u) return false;
  if(state.tier!=='all' && c.tr!==state.tier) return false;
  if(state.cats.size && !c.c.some(x=>state.cats.has(x))) return false;
  if(state.segs.size && !c.s.some(x=>state.segs.has(x))) return false;
  if(state.q){
    const h=(c.n+' '+c.x+' '+c.a+' '+c.i+' '+c.h+' '+c.p).toLowerCase();
    if(!h.includes(state.q)) return false;
  }
  return true;
}
function visible(){ return COMPANIES.filter(passes); }

/* ---------- favicon ---------- */
function logoEl(c,size){
  const d=document.createElement('div'); d.className='logo';
  if(size){d.style.width=d.style.height=d.style.flexBasis=size+'px';}
  const fallback=()=>{ d.textContent=c.n.replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase(); };
  if(c.d){
    const img=new Image(); img.alt=''; img.loading='lazy'; img.decoding='async';
    img.src='https://www.google.com/s2/favicons?sz=64&domain='+encodeURIComponent(c.d);
    img.onerror=fallback; d.appendChild(img);
  } else fallback();
  return d;
}

/* ---------- stats ---------- */
function animateNum(el,to){
  if(reduce){el.firstChild.textContent=to;return;}
  const dur=520, st=performance.now(), from=parseInt(el.firstChild.textContent)||0;
  function tick(now){ const p=Math.min(1,(now-st)/dur); const v=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));
    el.firstChild.textContent=v; if(p<1) requestAnimationFrame(tick);} requestAnimationFrame(tick);
}
function setStat(id,val){ const el=document.getElementById(id); el.firstChild.textContent=val; }
function updateStats(v){
  const total=v.length, pure=v.filter(c=>c.t==='pure').length, enab=total-pure;
  const us=v.filter(c=>c.u).length;
  const cats=new Set(); v.forEach(c=>c.c.forEach(x=>cats.add(x)));
  animateNum(document.getElementById('s-total'),total);
  animateNum(document.getElementById('s-pure'),pure);
  animateNum(document.getElementById('s-enab'),enab);
  animateNum(document.getElementById('s-cats'),cats.size);
  animateNum(document.getElementById('s-us'),us);
  document.getElementById('s-total-of').textContent='/ '+COMPANIES.length;
  document.getElementById('s-pure-pct').textContent= total? Math.round(pure/total*100)+'%':'';
  document.getElementById('s-us-pct').textContent= total? Math.round(us/total*100)+'%':'';
}

/* ---------- matrix ---------- */
function buildMatrix(){
  const v=visible();
  // index cells
  const cell={}; let max=0;
  CATEGORIES.forEach(([ck])=>SEGMENTS.forEach(([sk])=>{ cell[ck+'|'+sk]={list:[],pure:0}; }));
  v.forEach(c=>{ c.c.forEach(ck=>{ c.s.forEach(sk=>{ const o=cell[ck+'|'+sk]; if(o){o.list.push(c); if(c.t==='pure')o.pure++; }});});});
  Object.values(cell).forEach(o=>{ if(o.list.length>max)max=o.list.length; });

  const t=document.getElementById('matrix'); t.innerHTML='';
  // head
  const thead=document.createElement('thead'); const hr=document.createElement('tr');
  const corner=document.createElement('th'); corner.className='colgroup-top';
  corner.innerHTML='<span class="rc">rows: category<br>cols: segment</span>'; hr.appendChild(corner);
  SEGMENTS.forEach(([sk,sl])=>{ const th=document.createElement('th'); th.textContent=sl; hr.appendChild(th); });
  thead.appendChild(hr); t.appendChild(thead);

  const tb=document.createElement('tbody');
  CATEGORIES.forEach(([ck,cl])=>{
    const tr=document.createElement('tr');
    const rh=document.createElement('th'); rh.innerHTML=cl; tr.appendChild(rh);
    SEGMENTS.forEach(([sk,sl])=>{
      const o=cell[ck+'|'+sk]; const n=o.list.length; const td=document.createElement('td');
      td.className='cell'+(n?'':' empty');
      const ratio=max? n/max:0;
      // sequential blue ramp on near-black
      const a = n? (0.10+0.85*Math.pow(ratio,0.7)) : 0;
      td.style.background = n? `rgba(59,130,246,${a.toFixed(3)})` : 'transparent';
      const dark = a>0.40;
      const numColor = !n? '' : (o.pure*2>n? 'var(--pure)' : 'var(--enab)');
      const num=document.createElement('span'); num.className='num'; num.textContent=n||'·';
      if(n){ num.style.color = dark? '#fff' : numColor; }
      td.appendChild(num);
      if(n){
        const bar=document.createElement('span'); bar.className='bar';
        bar.style.width='100%';
        const pp=o.pure/n*100;
        bar.style.background=`linear-gradient(90deg, var(--pure) ${pp}%, var(--enab) ${pp}%)`;
        bar.style.opacity= dark? '.9':'.65';
        td.appendChild(bar);
        td.tabIndex=0;
        td.dataset.ck=ck; td.dataset.sk=sk;
        const open=()=>{ state.cats=new Set([ck]); state.segs=new Set([sk]); syncFilterUI(); setView('grid'); render(); };
        td.addEventListener('click',open);
        td.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
        td.addEventListener('mousemove',e=>showTip(e,cl,sl,o));
        td.addEventListener('mouseleave',hideTip);
      }
      tr.appendChild(td);
    });
    tb.appendChild(tr);
  });
  t.appendChild(tb);

  const ctx=[]; if(state.type!=='all')ctx.push(state.type==='pure'?'pure-play only':'AI-enabled only');
  if(state.tier!=='all')ctx.push(state.tier==='inc'?'incumbents only':'challengers only');
  ctx.push(state.geo==='us'?'US':state.geo==='non'?'Non-US':'global');
  document.getElementById('mtx-context').textContent=ctx.join(' · ')+' · '+v.length+' companies';
}
const tip=document.getElementById('tip');
function showTip(e,cl,sl,o){
  const names=o.list.slice(0,6).map(c=>c.n).join(', ')+(o.list.length>6?` +${o.list.length-6} more`:'');
  tip.innerHTML=`<b>${o.list.length}</b> in ${cl} · ${sl}<div class="names">${names}</div>`+
    `<div class="names" style="margin-top:5px"><span style="color:var(--pure)">${o.pure} pure-play</span> · <span style="color:#9FB6CC">${o.list.length-o.pure} AI-enabled</span></div>`;
  tip.classList.add('show');
  const pad=14; let x=e.clientX+pad, y=e.clientY+pad;
  if(x+250>innerWidth)x=e.clientX-250; if(y+90>innerHeight)y=e.clientY-90;
  tip.style.left=x+'px'; tip.style.top=y+'px';
}
function hideTip(){ tip.classList.remove('show'); }

/* ---------- grid ---------- */
function badge(cls,txt){ const s=document.createElement('span'); s.className='badge '+cls; s.textContent=txt; return s; }
function card(c){
  const el=document.createElement('div'); el.className='cardc '+(c.t==='pure'?'tp':'te'); el.tabIndex=0; el.setAttribute('role','button');
  const edge=document.createElement('div'); edge.className='edge'; el.appendChild(edge);
  const top=document.createElement('div'); top.className='ctop'; top.appendChild(logoEl(c));
  const id=document.createElement('div');
  const nm=document.createElement('div'); nm.className='cname'; nm.textContent=c.n;
  const hq=document.createElement('div'); hq.className='chq';
  hq.innerHTML=(c.u?'🇺🇸':'🌐')+' <span>'+c.h+'</span>';
  id.appendChild(nm); id.appendChild(hq); top.appendChild(id); el.appendChild(top);
  const desc=document.createElement('p'); desc.className='cdesc'; desc.textContent=c.x; el.appendChild(desc);
  const r2=document.createElement('div'); r2.className='crow2';
  r2.appendChild(badge(c.t==='pure'?'b-pure':'b-enab', c.t==='pure'?'Pure-play AI':'AI-enabled'));
  if(c.st && c.st!=='Independent') r2.appendChild(badge('b-st',c.st));
  if(c.fl==='add') r2.appendChild(badge('b-add','2026 add'));
  if(c.fl==='low') r2.appendChild(badge('b-low','Unverified'));
  el.appendChild(r2);
  const tags=document.createElement('div'); tags.className='tags';
  c.c.slice(0,2).forEach(ck=>{ const tg=document.createElement('span'); tg.className='tag'; tg.textContent=CATLABEL[ck]; tags.appendChild(tg); });
  el.appendChild(tags);
  const open=()=>openDrawer(c);
  el.addEventListener('click',open);
  el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  return el;
}
const GRIDPAGE=60; let gridShown=GRIDPAGE; let gridData=[];
function ensureMore(){
  let more=document.getElementById('loadmore');
  if(!more){
    more=document.createElement('button'); more.id='loadmore'; more.type='button'; more.className='loadmore hide';
    more.addEventListener('click',()=>{ gridShown+=GRIDPAGE; renderGridPage(); });
    const g=document.getElementById('grid'); g.parentNode.insertBefore(more, g.nextSibling);
  }
  return more;
}
function renderGridPage(){
  const g=document.getElementById('grid');
  const frag=document.createDocumentFragment();
  gridData.slice(0,gridShown).forEach(c=>frag.appendChild(card(c)));
  g.innerHTML=''; g.appendChild(frag);
  const more=ensureMore();
  if(gridData.length>gridShown){ more.classList.remove('hide'); more.textContent='Load more — '+(gridData.length-gridShown)+' remaining'; }
  else more.classList.add('hide');
}
function buildGrid(){
  gridData=visible();
  document.getElementById('empty').classList.toggle('hide', gridData.length>0);
  gridData.sort((a,b)=> (a.t===b.t?0:(a.t==='pure'?-1:1)) || a.n.localeCompare(b.n));
  gridShown=GRIDPAGE;
  renderGridPage();
}

/* ---------- drawer ---------- */
const drawer=document.getElementById('drawer'), scrim=document.getElementById('scrim');
function field(label,val){ if(!val) return ''; return `<div class="field"><div class="l">${label}</div><div class="d">${val}</div></div>`; }
function openDrawer(c){
  const cats=c.c.map(x=>`<span class="chip2">${CATLABEL[x]}</span>`).join('');
  const segs=c.s.map(x=>`<span class="chip2">${SEGLABEL[x]}</span>`).join('');
  const badges=[`<span class="badge ${c.t==='pure'?'b-pure':'b-enab'}">${c.t==='pure'?'Pure-play AI':'AI-enabled'}</span>`,
                (c.tr==='inc')?`<span class="badge b-st">Incumbent</span>`:'',
                (c.st&&c.st!=='Independent')?`<span class="badge b-st">${c.st}</span>`:'',
                c.fl==='add'?'<span class="badge b-add">2026 addition</span>':'',
                c.fl==='low'?'<span class="badge b-low">Unverified</span>':''].join('');
  drawer.innerHTML=`
    <div class="dr-top">
      <button class="x" id="dr-x" aria-label="Close">×</button>
      <div class="dr-id">
        <div class="logo-mount"></div>
        <div>
          <h3>${c.n}</h3>
          ${c.d?`<a class="site" href="https://${c.d}" target="_blank" rel="noopener">${c.d} ↗</a>`:''}
        </div>
      </div>
      <div class="dr-badges">${badges}</div>
    </div>
    <div class="dr-body">
      <p class="dr-x">${c.x}</p>
      ${field('AI capability', c.a)}
      ${field('Headquarters', (c.u?'🇺🇸 ':'🌐 ')+c.h)}
      <div class="field"><div class="l">Service categories</div><div class="d"><div class="chiplist">${cats}</div></div></div>
      <div class="field"><div class="l">Customer segments</div><div class="d"><div class="chiplist">${segs}</div></div></div>
      ${field('Stage', c.g)}
      ${field('Funding', c.f)}
      ${field('Select investors', c.i)}
      ${field('Recent activity', c.r)}
      ${field('Notable customers &amp; partners', c.p)}
    </div>`;
  drawer.querySelector('.logo-mount').replaceWith(logoEl(c,48));
  drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden','false');
  document.getElementById('dr-x').addEventListener('click',closeDrawer);
  document.getElementById('dr-x').focus();
}
function closeDrawer(){ drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
scrim.addEventListener('click',closeDrawer);
addEventListener('keydown',e=>{ if(e.key==='Escape'){closeDrawer(); closeMenus();} });

/* ---------- filter UI ---------- */
function buildMenu(menuId,btnCntId,items,set){
  const m=document.getElementById(menuId); m.innerHTML='';
  items.forEach(([k,l])=>{
    const lab=document.createElement('label');
    const cb=document.createElement('input'); cb.type='checkbox'; cb.value=k; cb.checked=set.has(k);
    cb.addEventListener('change',()=>{ cb.checked?set.add(k):set.delete(k); updateCnt(btnCntId,set.size); render(); });
    lab.appendChild(cb); lab.appendChild(document.createTextNode(l)); m.appendChild(lab);
  });
}
function updateCnt(id,n){ const e=document.getElementById(id); e.textContent=n; e.hidden=n===0; }
function syncFilterUI(){
  document.querySelectorAll('#cat-menu input').forEach(cb=>cb.checked=state.cats.has(cb.value));
  document.querySelectorAll('#seg-menu input').forEach(cb=>cb.checked=state.segs.has(cb.value));
  updateCnt('cat-cnt',state.cats.size); updateCnt('seg-cnt',state.segs.size);
}
function toggleMenu(id){ closeMenus(id); document.getElementById(id).classList.toggle('open'); }
function closeMenus(except){ ['cat-menu','seg-menu'].forEach(m=>{ if(m!==except) document.getElementById(m).classList.remove('open'); }); }
document.getElementById('cat-btn').addEventListener('click',e=>{e.stopPropagation();toggleMenu('cat-menu');});
document.getElementById('seg-btn').addEventListener('click',e=>{e.stopPropagation();toggleMenu('seg-menu');});
document.addEventListener('click',()=>closeMenus());
document.getElementById('cat-menu').addEventListener('click',e=>e.stopPropagation());
document.getElementById('seg-menu').addEventListener('click',e=>e.stopPropagation());

/* pills */
function wirePills(groupId,key,attr){
  document.querySelectorAll('#'+groupId+' .pill').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('#'+groupId+' .pill').forEach(x=>x.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed','true'); state[key]=b.dataset[attr]; render();
    });
  });
}
wirePills('type-pills','type','type'); wirePills('geo-pills','geo','geo'); wirePills('tier-pills','tier','tier');

document.getElementById('q').addEventListener('input',e=>{ state.q=e.target.value.trim().toLowerCase(); render(); });

/* view toggle */
function setView(v){
  state.view=v;
  document.getElementById('v-matrix').setAttribute('aria-pressed', v==='matrix');
  document.getElementById('v-grid').setAttribute('aria-pressed', v==='grid');
  document.getElementById('view-matrix').classList.toggle('hide', v!=='matrix');
  document.getElementById('view-grid').classList.toggle('hide', v!=='grid');
}
document.getElementById('v-matrix').addEventListener('click',()=>{setView('matrix');render();});
document.getElementById('v-grid').addEventListener('click',()=>{setView('grid');render();});

/* clear */
const clearBtn=document.getElementById('clear');
clearBtn.addEventListener('click',()=>{
  state.q=''; state.type='all'; state.geo='us'; state.tier='all'; state.cats.clear(); state.segs.clear();
  document.getElementById('q').value='';
  document.querySelectorAll('#type-pills .pill').forEach(x=>x.setAttribute('aria-pressed',x.dataset.type==='all'));
  document.querySelectorAll('#geo-pills .pill').forEach(x=>x.setAttribute('aria-pressed',x.dataset.geo==='us'));
  document.querySelectorAll('#tier-pills .pill').forEach(x=>x.setAttribute('aria-pressed',x.dataset.tier==='all'));
  syncFilterUI(); render();
});
function filtersActive(){ return state.q||state.type!=='all'||state.geo!=='us'||state.tier!=='all'||state.cats.size||state.segs.size; }

/* ---------- render ---------- */
function render(){
  const v=visible();
  updateStats(v);
  if(state.view==='matrix') buildMatrix(); else buildGrid();
  clearBtn.hidden=!filtersActive();
}

buildMenu('cat-menu','cat-cnt',CATEGORIES,state.cats);
buildMenu('seg-menu','seg-cnt',SEGMENTS,state.segs);
render();
</script>
</body>
</html>
"""

out = (TPL
       .replace("Space Grotesk", "Outfit")
       .replace("IBM Plex Sans", "DM Sans")
       .replace("IBM Plex Mono", "JetBrains Mono")
       .replace("/*__COMPANIES__*/", data_json)
       .replace("/*__CATEGORIES__*/", cats_json)
       .replace("/*__SEGMENTS__*/", segs_json)
       .replace("${TOTAL}", str(len(CO)))
       .replace("${NCAT}", str(len(CATEGORIES))))

import os
os.makedirs("/mnt/user-data/outputs", exist_ok=True)
with open("/mnt/user-data/outputs/catalyst-dna-ai-fs-map.html","w",encoding="utf-8") as f:
    f.write(out)
print("WROTE", len(out), "bytes;", len(CO), "companies")
