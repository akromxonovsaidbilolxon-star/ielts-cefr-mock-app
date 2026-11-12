// src/lib/voices.ts
var HIGH_QUALITY = [
  // Google (Chrome, ChromeOS, Android)
  "Google UK English Female",
  "Google UK English Male",
  "Google US English",
  "Google Australian English",
  // Microsoft (Edge / Windows) — neural voices
  "Microsoft Aria Online (Natural)",
  "Microsoft Guy Online (Natural)",
  "Microsoft Sonia Online (Natural)",
  "Microsoft Ryan Online (Natural)",
  "Microsoft Libby Online (Natural)",
  "Microsoft Thomas Online (Natural)",
  "Microsoft Jenny Online (Natural)",
  "Microsoft Christopher Online (Natural)",
  "Microsoft Aria",
  "Microsoft Guy",
  // Apple (Safari / iOS / macOS) — only the "enhanced"/"premium" ones are good
  "Samantha (Enhanced)",
  "Daniel (Enhanced)",
  "Karen (Enhanced)",
  "Moira (Enhanced)",
  "Tessa (Enhanced)",
  "Serena (Premium)",
  "Samantha",
  "Daniel",
  "Karen"
];
var BLOCKED = [
  "espeak",
  "eSpeak",
  "compact",
  "Compact",
  "novelty",
  "Albert",
  "Bad News",
  "Bahh",
  "Bells",
  "Boing",
  "Bubbles",
  "Cellos",
  "Good News",
  "Jester",
  "Organ",
  "Superstar",
  "Trinoids",
  "Whisper",
  "Wobble",
  "Zarvox"
];
function isBlocked(voice) {
  const name = voice.name.toLowerCase();
  return BLOCKED.some((b) => name.includes(b.toLowerCase()));
}
function scoreVoice(voice) {
  const name = voice.name;
  const lower = name.toLowerCase();
  let score = 0;
  let quality = "standard";
  const exact = HIGH_QUALITY.findIndex((q) => lower === q.toLowerCase());
  if (exact >= 0) {
    score += 1e3 - exact * 5;
    quality = lower.includes("natural") || lower.includes("online") ? "neural" : "premium";
  } else {
    const partial = HIGH_QUALITY.findIndex((q) => lower.includes(q.toLowerCase()));
    if (partial >= 0) {
      score += 800 - partial * 5;
      quality = lower.includes("natural") || lower.includes("neural") || lower.includes("online") ? "neural" : "premium";
    }
  }
  if (lower.includes("natural")) score += 260;
  if (lower.includes("neural")) score += 240;
  if (lower.includes("enhanced")) score += 200;
  if (lower.includes("premium")) score += 200;
  if (lower.includes("online")) score += 180;
  if (lower.includes("google")) score += 120;
  if (lower.includes("microsoft")) score += 100;
  if (lower.includes("siri")) score += 160;
  if (voice.localService && !lower.includes("google")) score += 20;
  const lang = voice.lang.toLowerCase();
  if (lang === "en-gb") score += 60;
  else if (lang === "en-au" || lang === "en-nz") score += 40;
  else if (lang === "en-us") score += 30;
  else if (lang.startsWith("en")) score += 10;
  if (isBlocked(voice)) score -= 1e3;
  return { voice, score, quality };
}
var GOOD_VOICE_THRESHOLD = 100;
function rankEnglishVoices(voices) {
  return voices.filter((v) => v.lang.toLowerCase().startsWith("en")).map(scoreVoice).sort((a, b) => b.score - a.score);
}
function assignVoices(voices, speakers) {
  const ranked = rankEnglishVoices(voices);
  const good = ranked.filter((r) => r.score >= GOOD_VOICE_THRESHOLD);
  const usable = good.length > 0 ? good : ranked;
  const FEMALE = ["female", "aria", "sonia", "libby", "jenny", "samantha", "karen", "moira", "tessa", "serena", "zira", "susan", "hazel", "fiona", "amelie", "female"];
  const MALE = ["male", "guy", "ryan", "thomas", "christopher", "daniel", "alex", "david", "george", "fred", "oliver", "male"];
  const genderOf = (name) => {
    const n = name.toLowerCase();
    if (FEMALE.some((f) => n.includes(f))) return "f";
    if (MALE.some((m) => n.includes(m))) return "m";
    return null;
  };
  const assignment = {};
  const used = /* @__PURE__ */ new Set();
  speakers.forEach((speaker, index) => {
    const want = index % 2 === 0 ? "f" : "m";
    const match = usable.find((r) => !used.has(r.voice.name) && genderOf(r.voice.name) === want) ?? usable.find((r) => !used.has(r.voice.name)) ?? usable[0];
    if (match) used.add(match.voice.name);
    assignment[speaker] = {
      voice: match?.voice,
      quality: match?.quality ?? "fallback",
      degraded: (match?.score ?? 0) < GOOD_VOICE_THRESHOLD
    };
  });
  return assignment;
}

// .tmp-test/voices.test.ts
var failures = 0;
var check = (n, c, e = "") => {
  if (!c) {
    failures++;
    console.log(`  FAIL  ${n} ${e}`);
  } else console.log(`  ok    ${n}`);
};
var mk = (name, lang, local = true) => ({ name, lang, localService: local, default: false, voiceURI: name });
var WINDOWS = [
  mk("Microsoft David - English (United States)", "en-US"),
  mk("Microsoft Zira - English (United States)", "en-US"),
  mk("Microsoft Mark - English (United States)", "en-US"),
  mk("Microsoft Hazel - English (Great Britain)", "en-GB")
];
var EDGE_NEURAL = [
  mk("Microsoft Aria Online (Natural) - English (United States)", "en-US", false),
  mk("Microsoft Guy Online (Natural) - English (United States)", "en-US", false),
  mk("Microsoft Sonia Online (Natural) - English (United Kingdom)", "en-GB", false)
];
var CHROME = [
  mk("Google US English", "en-US", false),
  mk("Google UK English Female", "en-GB", false),
  mk("Google UK English Male", "en-GB", false)
];
var SAFARI = [
  mk("Samantha", "en-US"),
  mk("Daniel", "en-GB"),
  mk("Karen", "en-AU"),
  mk("Albert", "en-US"),
  // novelty voice — must be blocked
  mk("Bad News", "en-US")
];
var LINUX_BAD = [
  mk("English (America)", "en-US"),
  mk("eSpeak English", "en-GB"),
  mk("english-us", "en-US")
];
console.log("\n== RANKING: good voices float to the top ==");
check("Edge neural voices rank above legacy", (() => {
  const r = rankEnglishVoices([...WINDOWS, ...EDGE_NEURAL]);
  return r[0].quality === "neural" && r[0].score > 1e3;
})());
check("all three Edge neural voices outrank every legacy voice", (() => {
  const r = rankEnglishVoices([...WINDOWS, ...EDGE_NEURAL]);
  const neural = r.filter((x) => x.quality === "neural").length;
  return neural === 3 && r.slice(0, 3).every((x) => x.quality === "neural");
})());
check("Chrome Google voices rank above Microsoft legacy", (() => {
  const r = rankEnglishVoices([...WINDOWS, ...CHROME]);
  return r[0].voice.name.includes("Google");
})());
check("novelty voices are pushed to the bottom", (() => {
  const r = rankEnglishVoices(SAFARI);
  const albert = r.findIndex((x) => x.voice.name === "Albert");
  const samantha = r.findIndex((x) => x.voice.name === "Samantha");
  return samantha < albert;
})());
check("eSpeak ranks below everything else", (() => {
  const r = rankEnglishVoices([...LINUX_BAD, ...CHROME]);
  const espeak = r.findIndex((x) => x.voice.name.includes("eSpeak"));
  return espeak === r.length - 1;
})());
check("non-English voices excluded", (() => {
  const r = rankEnglishVoices([mk("Milena", "ru-RU"), mk("Thomas", "fr-FR")]);
  return r.length === 0;
})());
check("British English gets preference over US", (() => {
  const r = rankEnglishVoices([mk("Some Voice", "en-US"), mk("Some Voice", "en-GB")]);
  return r[0].voice.lang === "en-GB";
})());
console.log("\n== ASSIGNMENT: distinct voices per speaker ==");
check("two speakers get TWO DIFFERENT voices", (() => {
  const a = assignVoices([...CHROME], ["Woman", "Man"]);
  return a.Woman.voice?.name !== a.Man.voice?.name;
})());
check("female speaker gets a female voice when available", (() => {
  const a = assignVoices(CHROME, ["Woman", "Man"]);
  return (a.Woman.voice?.name ?? "").toLowerCase().includes("female");
})());
check("male speaker gets a male voice when available", (() => {
  const a = assignVoices(CHROME, ["Woman", "Man"]);
  return (a.Man.voice?.name ?? "").toLowerCase().includes("male");
})());
check("never picks eSpeak when a good voice exists", (() => {
  const a = assignVoices([...LINUX_BAD, ...CHROME], ["Receptionist", "Man"]);
  return !Object.values(a).some((x) => (x.voice?.name ?? "").toLowerCase().includes("espeak"));
})());
check("degrades gracefully with only bad voices", (() => {
  const a = assignVoices(LINUX_BAD, ["A", "B"]);
  return a.A.degraded === true && a.B.degraded === true;
})());
check("degrades gracefully with NO voices", (() => {
  const a = assignVoices([], ["A"]);
  return a.A.voice === void 0 && a.A.degraded === true;
})());
console.log("\n== THE OLD BUG: random pick would hit bad voices ==");
var MIXED = [...LINUX_BAD, ...LINUX_BAD, mk("eSpeak", "en-GB"), mk("compact", "en-US"), ...CHROME];
var oldPick = (speaker) => {
  const hash = [...speaker].reduce((a, c) => a + c.charCodeAt(0), 0);
  return MIXED[hash % MIXED.length].name;
};
var SPEAKERS3 = ["Receptionist", "Man", "Woman"];
var NEW = assignVoices(MIXED, SPEAKERS3);
var oldNames = SPEAKERS3.map(oldPick);
var newNames = SPEAKERS3.map((s) => NEW[s].voice?.name ?? "");
var isBad = (n) => n.includes("espeak") || n.includes("compact") || n.includes("English (");
var oldBad = oldNames.filter(isBad).length;
var newBad = newNames.filter(isBad).length;
console.log(`  old algorithm picked bad voices: ${oldBad}/3  -> [${oldNames.join(", ")}]`);
console.log(`  new algorithm picked bad voices: ${newBad}/3  -> [${newNames.join(", ")}]`);
check("new algorithm never picks a bad voice from a mixed list", newBad === 0);
check("new algorithm outperforms the old random pick", newBad < Math.max(oldBad, 1));
console.log(`
${failures === 0 ? "ALL VOICE CHECKS PASSED" : failures + " FAILED"}
`);
process.exit(failures === 0 ? 0 : 1);
