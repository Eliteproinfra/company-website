#!/usr/bin/env node
/**
 * Audit a MySQL dump from the live PHP site before importing any of it.
 *
 * Usage:
 *   node scripts/audit-sql-dump.mjs path/to/dump.sql [--full]
 *
 * The live host was compromised (see the quarantined files under _public_html):
 * an unauthenticated file-upload webshell plus an SEO-cloaking backdoor. The
 * standard follow-on to that malware is injected markup inside CMS post bodies
 * — hidden link farms, <script> beacons, iframes — which a blind import would
 * carry straight into the new site.
 *
 * This is a REPORTER, not a cleaner. It never edits the dump. Read the report,
 * decide what is genuinely yours, then clean deliberately.
 *
 * Exit code is 1 when anything suspicious is found, so it can gate an import.
 */
import { readFileSync } from "node:fs";

const [, , file, ...flags] = process.argv;
const showAll = flags.includes("--full");

if (!file) {
  console.error("Usage: node scripts/audit-sql-dump.mjs <dump.sql> [--full]");
  process.exit(2);
}

let sql;
try {
  sql = readFileSync(file, "utf8");
} catch (error) {
  console.error(`Could not read ${file}: ${error.message}`);
  process.exit(2);
}

/** Domains seen in this specific compromise — an exact hit is damning. */
const KNOWN_BAD = ["suijiyx.shop", "buildingcircularity.eu"];

/**
 * Patterns worth a human look. Deliberately broad: a false positive costs a
 * glance, a false negative republishes someone else's spam under your domain.
 */
const RULES = [
  { name: "Script tag", re: /<script\b/gi, severity: "high" },
  { name: "Iframe", re: /<iframe\b/gi, severity: "high" },
  { name: "javascript: URL", re: /javascript\s*:/gi, severity: "high" },
  { name: "PHP eval / obfuscation", re: /\b(eval|base64_decode|gzinflate|str_rot13)\s*\(/gi, severity: "high" },
  { name: "Hidden via display:none", re: /display\s*:\s*none/gi, severity: "medium" },
  { name: "Hidden via visibility", re: /visibility\s*:\s*hidden/gi, severity: "medium" },
  { name: "Off-screen positioning", re: /(left|top)\s*:\s*-\s*\d{3,}\s*px/gi, severity: "medium" },
  { name: "Zero-size text", re: /font-size\s*:\s*0(px|em|pt)?\b/gi, severity: "medium" },
  { name: "Spam keywords", re: /\b(viagra|cialis|casino|porn|escort|payday loan|replica watch)\b/gi, severity: "high" },
  { name: "Base64 data blob", re: /data:[a-z/+-]+;base64,[A-Za-z0-9+/]{200,}/gi, severity: "medium" },
];

/** Hosts that legitimately appear in this site's own content. */
const EXPECTED_HOSTS = [
  "eliteproinfra.com",
  "www.eliteproinfra.com",
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "instagram.com",
  "www.instagram.com",
  "facebook.com",
  "www.facebook.com",
  "linkedin.com",
  "www.linkedin.com",
  "x.com",
  "twitter.com",
  "google.com",
  "maps.google.com",
  "goo.gl",
  "maps.app.goo.gl",
  "cdn.jsdelivr.net",
  "cdnjs.cloudflare.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "unpkg.com",
  "images.unsplash.com",
  "w3.org",
  "schema.org",
];

const lines = sql.split(/\r?\n/);

/** Best-effort table attribution: which INSERT/CREATE block a line sits in. */
function buildTableIndex() {
  const index = new Array(lines.length).fill(null);
  let current = null;
  const re = /(?:INSERT\s+INTO|CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?)\s+[`"]?([A-Za-z0-9_]+)/i;
  for (let i = 0; i < lines.length; i++) {
    const m = re.exec(lines[i]);
    if (m) current = m[1];
    index[i] = current;
  }
  return index;
}
const tableOf = buildTableIndex();

function scanRules() {
  const findings = new Map();
  for (const rule of RULES) {
    for (let i = 0; i < lines.length; i++) {
      rule.re.lastIndex = 0;
      if (!rule.re.test(lines[i])) continue;
      if (!findings.has(rule.name)) {
        findings.set(rule.name, { severity: rule.severity, hits: [] });
      }
      findings.get(rule.name).hits.push({ line: i + 1, table: tableOf[i] });
    }
  }
  return findings;
}

function scanKnownBad() {
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    for (const bad of KNOWN_BAD) {
      if (lines[i].toLowerCase().includes(bad)) {
        hits.push({ line: i + 1, table: tableOf[i], domain: bad });
      }
    }
  }
  return hits;
}

/** Every external host referenced anywhere in the dump, with a sample line. */
function scanHosts() {
  const hosts = new Map();
  const re = /https?:\/\/([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  for (let i = 0; i < lines.length; i++) {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(lines[i]))) {
      const host = m[1].toLowerCase().replace(/\.$/, "");
      if (!hosts.has(host)) hosts.set(host, { count: 0, line: i + 1, table: tableOf[i] });
      hosts.get(host).count++;
    }
  }
  return hosts;
}

function isExpected(host) {
  return EXPECTED_HOSTS.some((ok) => host === ok || host.endsWith(`.${ok}`));
}

// ---------------------------------------------------------------- report ---

const sizeMb = (Buffer.byteLength(sql, "utf8") / 1024 / 1024).toFixed(2);
console.log(`\nSQL dump audit — ${file}`);
console.log(`${lines.length.toLocaleString()} lines, ${sizeMb} MB\n`);

const tables = [...new Set(tableOf.filter(Boolean))];
console.log(`Tables seen (${tables.length}): ${tables.join(", ") || "none detected"}\n`);

let suspicious = false;
const LIMIT = showAll ? Infinity : 8;

const bad = scanKnownBad();
if (bad.length) {
  suspicious = true;
  console.log("!! KNOWN-MALWARE DOMAINS PRESENT IN THE DATA !!");
  for (const hit of bad.slice(0, LIMIT)) {
    console.log(`   line ${hit.line}  table ${hit.table ?? "?"}  ${hit.domain}`);
  }
  if (bad.length > LIMIT) console.log(`   ... and ${bad.length - LIMIT} more`);
  console.log("   Do NOT import until these rows are understood and cleaned.\n");
}

const findings = scanRules();
if (findings.size) {
  suspicious = true;
  console.log("Suspicious patterns:");
  const order = { high: 0, medium: 1 };
  const sorted = [...findings.entries()].sort(
    (a, b) => order[a[1].severity] - order[b[1].severity] || b[1].hits.length - a[1].hits.length
  );
  for (const [name, data] of sorted) {
    console.log(`\n  [${data.severity.toUpperCase()}] ${name} — ${data.hits.length} line(s)`);
    for (const hit of data.hits.slice(0, LIMIT)) {
      console.log(`     line ${hit.line}  table ${hit.table ?? "?"}`);
    }
    if (data.hits.length > LIMIT) console.log(`     ... and ${data.hits.length - LIMIT} more`);
  }
  console.log();
} else {
  console.log("No suspicious markup/code patterns matched.\n");
}

const hosts = scanHosts();
const unexpected = [...hosts.entries()]
  .filter(([host]) => !isExpected(host))
  .sort((a, b) => b[1].count - a[1].count);

if (unexpected.length) {
  console.log(`External hosts NOT on the expected list (${unexpected.length}) — review each:`);
  for (const [host, data] of unexpected.slice(0, showAll ? Infinity : 25)) {
    console.log(`   ${String(data.count).padStart(5)}x  ${host.padEnd(38)} first: line ${data.line} (${data.table ?? "?"})`);
  }
  if (!showAll && unexpected.length > 25) {
    console.log(`   ... and ${unexpected.length - 25} more — rerun with --full`);
  }
  console.log("\n   A real-estate CMS linking to unrelated domains is the classic\n   signature of injected spam. Confirm every one before importing.\n");
  suspicious = true;
} else {
  console.log("All external hosts are on the expected list.\n");
}

if (suspicious) {
  console.log("RESULT: review required before import.\n");
  process.exit(1);
}
console.log("RESULT: nothing flagged. Still spot-check a few post bodies by hand.\n");
