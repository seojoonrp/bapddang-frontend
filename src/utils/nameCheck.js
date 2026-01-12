const normalizeBasic = (s) =>
  (s || "").normalize("NFKC").toLowerCase().replace(/\s+/g, "");

const LTable = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const VTable = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const TTable = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const SBase = 0xac00,
  LCount = 19,
  VCount = 21,
  TCount = 28;
const NCount = VCount * TCount,
  SCount = 11172;

const toJamoString = (str) => {
  const out = [];
  for (const ch of normalizeBasic(str)) {
    const code = ch.codePointAt(0);
    if (!code) continue;
    if (code >= SBase && code < SBase + SCount) {
      const SIndex = code - SBase;
      const L = Math.floor(SIndex / NCount);
      const V = Math.floor((SIndex % NCount) / TCount);
      const T = SIndex % TCount;
      out.push(LTable[L], VTable[V]);
      const tail = TTable[T];
      if (tail) out.push(tail);
    } else {
      if (/\s/.test(ch)) continue;
      out.push(ch);
    }
  }
  return out.join("");
};

const jaro = (s1, s2) => {
  if (s1 === s2) return 1;
  const len1 = s1.length,
    len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0;
  const matchDist = Math.max(Math.floor(Math.max(len1, len2) / 2) - 1, 0);
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);
  let matches = 0;

  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDist);
    const end = Math.min(i + matchDist + 1, len2);
    for (let j = start; j < end; j++) {
      if (s2Matches[j]) continue;
      if (s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }
  if (matches === 0) return 0;

  let k = 0,
    transpositions = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }
  transpositions /= 2;

  return (
    (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3
  );
};

const jaroWinkler = (s1, s2, p = 0.1, maxPrefix = 4) => {
  const j = jaro(s1, s2);
  if (j === 0) return 0;
  let l = 0;
  const stop = Math.min(maxPrefix, s1.length, s2.length);
  while (l < stop && s1[l] === s2[l]) l++;
  return j + l * p * (1 - j);
};

const score = (a, b) => jaroWinkler(toJamoString(a), toJamoString(b));

export const getBestMatches = (inputName, candidates, k = 5) => {
  const list = (candidates || []).filter(Boolean);
  if (!inputName?.trim() || list.length === 0) {
    return { best: null, top: [] };
  }
  const top = list.map((name) => ({ name, score: score(inputName, name) }));
  top.sort((x, y) => y.score - x.score);
  const best = top[0] ?? null;
  return { best, top: top.slice(0, k) };
};

// 기본 내보내기도 유지(기존 import 호환)
const NameCheckUtilDefault = { getBestMatches, score, toJamoString };
export default NameCheckUtilDefault;
