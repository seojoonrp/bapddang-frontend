// namecheck.js
import React, { useMemo } from "react";
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

/** ───── 1) 정규화 + 자모 분해 + Jaro-Winkler ───── */
const normalizeBasic = (s) =>
  (s || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "");

const LTable = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const VTable = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
const TTable = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const SBase = 0xac00, LCount = 19, VCount = 21, TCount = 28;
const NCount = VCount * TCount, SCount = 11172;

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
  const len1 = s1.length, len2 = s2.length;
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

  let k = 0, transpositions = 0;
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

/** 3) 항상 모달 표시 */
const NameCheck = ({ visible, inputName, candidates, onAccept, onReject, onCancel }) => {
  const { best, top } = useMemo(
    () => getBestMatches(inputName, candidates, 5),
    [inputName, candidates]
  );

  if (!visible) return null;

  const suggestion = best?.name ?? null;
  const bestScore = best?.score ?? 0;
  
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>이걸 말씀하신 건가요?</Text>
          <Text style={styles.line}>입력: <Text style={styles.bold}>{inputName}</Text></Text>
          <Text style={styles.line}>
            제안: <Text style={styles.bold}>{suggestion ?? "없음"}</Text>
            {suggestion ? <Text style={styles.muted}>  (유사도 {bestScore.toFixed(3)})</Text> : null}
          </Text>

          {top?.length > 1 && (
            <>
              <Text style={[styles.line, { marginTop: 8 }]}>다른 후보</Text>
              <FlatList
                data={top}
                keyExtractor={(item, idx) => item.name + ":" + idx}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onAccept?.(item.name)} style={styles.item}>
                    <Text>{item.name} · {item.score.toFixed(3)}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                style={{ maxHeight: 160, marginTop: 4 }}
              />
            </>
          )}

          <View style={styles.actions}>
            {suggestion ? (
              <TouchableOpacity onPress={() => onAccept?.(suggestion)} style={[styles.btn, styles.primary]}>
                <Text style={styles.primaryText}>맞아요</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={onReject} style={[styles.btn, styles.secondary]}>
              <Text style={styles.secondaryText}>아니에요</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onCancel} style={styles.cancel}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NameCheck;

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center", padding: 16 },
  card: { width: "100%", maxWidth: 480, borderRadius: 16, backgroundColor: "#fff", paddingVertical: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: "#eee" },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 6 },
  line: { fontSize: 14, marginTop: 2 },
  bold: { fontWeight: "700" },
  muted: { color: "#6b7280" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 14 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  primary: { backgroundColor: "#ef4444", borderColor: "#ef4444" },
  secondary: { backgroundColor: "white", borderColor: "#e5e7eb" },
  primaryText: { color: "white", fontWeight: "700" },
  secondaryText: { color: "#111827", fontWeight: "600" },
  item: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
  cancel: { alignSelf: "center", marginTop: 10 },
  cancelText: { color: "#6b7280" },
});
