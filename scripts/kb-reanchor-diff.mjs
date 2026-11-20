// scripts/kb-reanchor-diff.mjs — propose repairs for broken quotes on a page capture from the old and the new page
// alone, with no model. kb-reanchor.mjs checks every proposal by the gate's rules before anything is written.
//
// A capture's text is one heading, list item, table row or paragraph per line (kb-reanchor's lineSpans). The method:
//   1. Align. Old and new lines are aligned like a diff, by the longest common subsequence of identical lines. Inside
//      each changed hunk the lines are cut into sentences ("pieces"; a heading or a table row is one piece), and the old
//      pieces are paired, in order, with the new pieces most like them, so a line the vendor split or merged still
//      maps. An old piece left without a partner is looked for over the whole page ("moved"), and taken only when one
//      free new piece is clearly the most alike.
//   2. Carve. The old quote's first and last word are mapped through a word alignment of its first and last piece with
//      their new pieces. An edge on a piece's or a line's edge stays on one; an edge inside a sentence follows the
//      nearest surviving word. A sentence of the quote with no partner is passed over. Where the word alignment finds
//      nothing because the sentence was turned around, the quote's own words, unbroken, are looked for in the new
//      sentence. A passage that keeps under half of the old quote's words is declined; one over QUOTE_MAX characters is
//      cut to the stretch between its first and last surviving word.
//   3. Entry. The entry's quotes must anchor as the gate anchors them. A quote that is unchanged but now repeated, or a
//      new quote that occurs twice, gets an `after` anchor: the nearest line above its place that occurs once on the
//      page and is one of its headings, parent items or list lead-ins. A broken anchor is mapped like a quote; when its
//      line is gone, the same kind of line above the entry's first quote stands in.
//   4. Edit class. What differs between the old and the new quote is classed: spacing, case or punctuation only
//      ("format"), articles only ("function"), or anything else, a number's sign or decimal point included
//      ("content"). That is all this says about meaning: whether a content change leaves the statement true is
//      kb-reanchor's question for a model or a person.
// What it declines: an old line with no new line like it (removed, rewritten past recognition, or the section was
// restructured). On refresh #354, measured against the hand-reviewed merge, 89 of the 98 proposals that passed the
// checks were the reviewers' own quote, and 91 of 200 broken items were declined: they had no counterpart to find.
// (The counts are of the prototype this was ported from, which gave the same proposals on all 200.)

/** The least Dice similarity for two sentences of one hunk to be the same sentence, reworded. */
const PAIR_MIN = 0.5;
/** The least for a sentence found elsewhere on the page, and the margin it must beat the next best by. */
const MOVED_MIN = 0.7;
const MOVED_MARGIN = 0.15;
/** The least share of the old quote's words the new passage must keep. */
const KEEP_MIN = 0.5;
const QUOTE_MIN = 8;
const QUOTE_MAX = 320;

/** Every position of `q` in `text`, from `from` on. */
export function occurrences(text, q, from = 0) {
  const out = [];
  if (!q) return out;
  for (let i = text.indexOf(q, from); i !== -1; i = text.indexOf(q, i + 1)) out.push(i);
  return out;
}

/** Longest-common-subsequence alignment of two arrays, as matched index pairs. */
export function align(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Int32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const pairs = [];
  for (let i = 0, j = 0; i < a.length && j < b.length;) {
    if (a[i] === b[j]) pairs.push([i++, j++]);
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

/** A word's comparison key: lower case, without leading and trailing punctuation. */
const key = (w) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
/** The words of `s`, each with its key and where it is in `s`. */
const toks = (s) => [...s.matchAll(/\S+/g)].map((x) => ({ w: x[0], k: key(x[0]), at: x.index, end: x.index + x[0].length }));
const words = (t) => t.filter((x) => x.k).map((x) => x.k);
/** Dice similarity of two word lists by their longest common subsequence. */
export const dice = (a, b) => (a.length + b.length ? (2 * align(a, b).length) / (a.length + b.length) : 0);

/** A list, heading or table marker: not a word of what the line says. */
const MARKER = /^(-|\d+\.|#{1,6}|\|)$/;
const ENDS = /[.!?]["')\]]*$/;

/** A line's sentences, as offsets in the line. A heading or a table row is one sentence. */
function sentencesOf(s) {
  const t = toks(s);
  if (!t.length) return [];
  if (s.startsWith("|") || s.startsWith("#")) return [{ a: 0, b: s.length }];
  const out = [];
  let start = 0;
  for (let i = 0; i < t.length - 1; i++) {
    const marker = i <= 1 && MARKER.test(t[i].w) && (i === 0 || MARKER.test(t[0].w));
    if (!marker && ENDS.test(t[i].w)) {
      out.push({ a: start, b: t[i].end });
      start = t[i + 1].at;
    }
  }
  out.push({ a: start, b: s.length });
  return out;
}

/** Every sentence of a page, from its line spans: { line, at (in the page), s, w (its words) }. */
function piecesOf(spans) {
  const out = [];
  spans.forEach((sp, line) => {
    for (const p of sentencesOf(sp.s)) {
      const s = sp.s.slice(p.a, p.b);
      out.push({ line, at: sp.at + p.a, s, w: words(toks(s)) });
    }
  });
  return out;
}

/** Two short sentences must be more alike to pair: a few words in common is chance. */
const pairMin = (a, b) => (Math.min(a.length, b.length) < 4 ? Math.max(PAIR_MIN, 0.75) : PAIR_MIN);

const aligned = new WeakMap();
/**
 * Each old sentence's new sentence: { op, np (the pieces), to (the new piece's index, or -1), how ("same", "reworded",
 * "moved" or "none"), score (its similarity), owner (each new piece's old piece, or -1) }.
 */
export function alignPieces(oldSpans, newSpans) {
  const hit = aligned.get(oldSpans);
  if (hit?.newSpans === newSpans) return hit.out;
  const op = piecesOf(oldSpans);
  const np = piecesOf(newSpans);
  const to = new Int32Array(op.length).fill(-1);
  const how = new Array(op.length).fill("none");
  const score = new Array(op.length).fill(0);
  const taken = new Uint8Array(np.length);
  // The index of each line's first piece, and of the piece after the last line.
  const firstOf = (ps, n) => {
    const f = new Int32Array(n + 1).fill(-1);
    ps.forEach((p, i) => {
      if (f[p.line] === -1) f[p.line] = i;
    });
    f[n] = ps.length;
    for (let i = n - 1; i >= 0; i--) if (f[i] === -1) f[i] = f[i + 1];
    return f;
  };
  const of = firstOf(op, oldSpans.length);
  const nf = firstOf(np, newSpans.length);
  const lineTo = new Int32Array(oldSpans.length).fill(-1);
  for (const [i, j] of align(oldSpans.map((s) => s.s), newSpans.map((s) => s.s))) {
    lineTo[i] = j;
    for (let k = 0; of[i] + k < of[i + 1]; k++) {
      to[of[i] + k] = nf[j] + k;
      how[of[i] + k] = "same";
      score[of[i] + k] = 1;
      taken[nf[j] + k] = 1;
    }
  }
  // A hunk: a run of changed old lines, and the new lines between the same two unchanged lines. Its sentences are
  // paired in order, most alike first, by a weighted alignment.
  for (let i = 0; i < oldSpans.length;) {
    if (lineTo[i] !== -1) {
      i++;
      continue;
    }
    let i1 = i;
    while (i1 < oldSpans.length && lineTo[i1] === -1) i1++;
    let j0 = 0;
    for (let k = i - 1; k >= 0; k--) {
      if (lineTo[k] !== -1) {
        j0 = lineTo[k] + 1;
        break;
      }
    }
    let j1 = newSpans.length;
    for (let k = i1; k < oldSpans.length; k++) {
      if (lineTo[k] !== -1) {
        j1 = lineTo[k];
        break;
      }
    }
    const A = of[i];
    const p = of[i1] - of[i];
    const B = nf[j0];
    const q = nf[j1] - nf[j0];
    if (p > 0 && q > 0) {
      const S = Array.from({ length: p }, (_, a) =>
        Float64Array.from({ length: q }, (_, b) => {
          const d = dice(op[A + a].w, np[B + b].w);
          return d >= pairMin(op[A + a].w, np[B + b].w) ? d : 0;
        }),
      );
      const dp = Array.from({ length: p + 1 }, () => new Float64Array(q + 1));
      for (let a = p - 1; a >= 0; a--) for (let b = q - 1; b >= 0; b--) dp[a][b] = Math.max(dp[a + 1][b], dp[a][b + 1], S[a][b] ? S[a][b] + dp[a + 1][b + 1] : 0);
      for (let a = 0, b = 0; a < p && b < q;) {
        if (S[a][b] && dp[a][b] === S[a][b] + dp[a + 1][b + 1]) {
          to[A + a] = B + b;
          how[A + a] = S[a][b] === 1 && op[A + a].s === np[B + b].s ? "same" : "reworded";
          score[A + a] = S[a][b];
          taken[B + b] = 1;
          a++;
          b++;
        } else if (dp[a + 1][b] >= dp[a][b + 1]) a++;
        else b++;
      }
    }
    i = i1;
  }
  // Moved: an old sentence still without a partner, and one free new sentence clearly the most like it.
  for (let i = 0; i < op.length; i++) {
    if (to[i] !== -1 || op[i].w.length < 4) continue;
    let best = -1;
    let bs = 0;
    let second = 0;
    for (let j = 0; j < np.length; j++) {
      if (taken[j]) continue;
      const d = dice(op[i].w, np[j].w);
      if (d > bs) {
        second = bs;
        bs = d;
        best = j;
      } else if (d > second) second = d;
    }
    if (best !== -1 && bs >= MOVED_MIN && bs - second >= MOVED_MARGIN) {
      to[i] = best;
      how[i] = "moved";
      score[i] = bs;
    }
  }
  const owner = new Int32Array(np.length).fill(-1);
  to.forEach((j, i) => {
    if (j !== -1) owner[j] = i;
  });
  const out = { op, np, to, how, score, owner };
  aligned.set(oldSpans, { newSpans, out });
  return out;
}

/**
 * The new quote carved out of the new sentence `nl`, for the old quote at [qa, qb) of the old sentence `ol` (offsets
 * in the sentence): { a, b } in `nl`, how each edge was set, `kept` (the share of the quote's words that survive), and
 * the first and last surviving word's offsets (ta, tb). Null when none survive.
 */
export function carve(ol, nl, qa, qb) {
  const ot = toks(ol);
  const nt = toks(nl);
  if (!ot.length || !nt.length) return null;
  const a = ot.findIndex((t) => t.end > qa);
  const b = ot.findLastIndex((t) => t.at < qb);
  if (a === -1 || b === -1 || b < a) return null;
  const pairs = align(ot.map((t) => t.k || t.w), nt.map((t) => t.k || t.w));
  const img = new Map(pairs);
  const inQuote = pairs.filter(([i]) => i >= a && i <= b);
  if (!inQuote.length) return null;
  const firstContent = (t) => {
    let k = 0;
    while (k < t.length - 1 && MARKER.test(t[k].w)) k++;
    return k;
  };
  const how = {};
  // How much of its first and last word the quote leaves out: an opening bracket, a closing full stop.
  const da = qa - ot[a].at;
  const db = ot[b].end - qb;
  let na;
  if (a === 0 && MARKER.test(ot[0].w) && da === 0) {
    na = 0;
    how.left = "piece start, with its marker";
  } else if (a <= firstContent(ot)) {
    na = Math.min(firstContent(nt), inQuote[0][1]);
    how.left = "piece start";
  } else if (img.has(a)) {
    na = img.get(a);
    how.left = "same word";
  } else if (img.has(a - 1) && img.get(a - 1) + 1 <= inQuote[0][1]) {
    na = img.get(a - 1) + 1;
    how.left = "after kept word";
  } else {
    na = inQuote[0][1];
    how.left = "trimmed";
  }
  let nb;
  const lastIn = inQuote.at(-1)[1];
  if (b === ot.length - 1) {
    nb = nt.length - 1;
    how.right = "piece end";
  } else if (img.has(b)) {
    nb = img.get(b);
    how.right = "same word";
  } else if (img.has(b + 1) && img.get(b + 1) - 1 >= lastIn) {
    nb = img.get(b + 1) - 1;
    how.right = "before kept word";
  } else {
    nb = lastIn;
    how.right = "trimmed";
  }
  if (nb < na) return null;
  let ca = nt[na].at;
  let cb = nt[nb].end;
  if (da > 0 && nt[na].w.startsWith(ot[a].w.slice(0, da))) ca += da;
  if (db > 0 && nt[nb].w.endsWith(ot[b].w.slice(ot[b].w.length - db))) cb -= db;
  return { a: ca, b: cb, how, kept: inQuote.length / (b - a + 1), ta: nt[inQuote[0][1]].at, tb: nt[lastIn].end };
}

/**
 * The old quote's own words, in order and unbroken, in the new sentence (case and punctuation aside): where a sentence
 * was turned around, the word alignment loses a quote that is still there whole. Null unless it is there exactly once.
 */
function verbatim(ol, nl, qa, qb) {
  const ot = toks(ol);
  const nt = toks(nl);
  const a = ot.findIndex((t) => t.end > qa);
  const b = ot.findLastIndex((t) => t.at < qb);
  if (a === -1 || b < a) return null;
  const want = ot.slice(a, b + 1).map((t) => t.k || t.w);
  const hits = [];
  for (let i = 0; i + want.length <= nt.length; i++) if (want.every((k, j) => (nt[i + j].k || nt[i + j].w) === k)) hits.push(i);
  if (hits.length !== 1) return null;
  const i = hits[0];
  const da = qa - ot[a].at;
  const db = ot[b].end - qb;
  let ca = nt[i].at;
  let cb = nt[i + want.length - 1].end;
  if (da > 0 && nt[i].w.startsWith(ot[a].w.slice(0, da))) ca += da;
  if (db > 0 && nt[i + want.length - 1].w.endsWith(ot[b].w.slice(ot[b].w.length - db))) cb -= db;
  return { a: ca, b: cb };
}

const lineAt = (spans, at) => spans.findIndex((s) => s.at <= at && at < s.end + 1);

// The words whose change alone leaves what a sentence states as it was: the articles. Any other short word can change
// it: "or" for "and", "to" for "from", "can" dropped.
const ARTICLES = new Set(["a", "an", "the"]);
// What comparing words by their letters and digits loses, and a statement may rest on: a number with its sign, decimal
// point, percent or plus ("-1", "4.2+", "50%"), and a comparison sign.
// A hyphen joined to a word ("Windows-10") is not a minus sign.
const SIGNS = /[<>≤≥=±]|(?<![\p{L}\p{N}])[-+]?\d+(?:[.,]\d+)*(?:%|\+)?/gu;
const signsOf = (s) => s.match(SIGNS) ?? [];

/**
 * What changed between two quotes, word by word: { cls, del, ins }. `cls` is "format" when they have the same words
 * and the same numbers and signs (case, punctuation, hyphenation and spacing aside), "function" when only articles
 * differ besides, and "content" otherwise; `del` and `ins` are the other words, numbers and signs removed and added.
 */
export function editClass(oldQ, newQ) {
  const so = signsOf(oldQ);
  const sn = signsOf(newQ);
  if (so.join(" ") !== sn.join(" ")) return { cls: "content", del: so.filter((x) => !sn.includes(x)), ins: sn.filter((x) => !so.includes(x)) };
  const squash = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  if (squash(oldQ) === squash(newQ)) return { cls: "format", del: [], ins: [] };
  const a = words(toks(oldQ));
  const b = words(toks(newQ));
  const pairs = align(a, b);
  const ia = new Set(pairs.map((p) => p[0]));
  const ib = new Set(pairs.map((p) => p[1]));
  const del = a.filter((k, i) => !ia.has(i) && !ARTICLES.has(k));
  const ins = b.filter((k, j) => !ib.has(j) && !ARTICLES.has(k));
  return { cls: del.length || ins.length ? "content" : "function", del, ins };
}

/**
 * The nearest line above `at`, between `floor` and `ceiling`, that occurs once on the page and is one of the line's
 * own headings, parent items or list lead-ins: what a reader would say the passage is under. Never the page's title
 * (it tells no two places apart), and never just the line above: an unrelated neighbour anchors today and misleads
 * tomorrow.
 */
function anchorAbove(E, at, floor, ceiling) {
  const spans = E.newSpans;
  const li = lineAt(spans, at);
  if (li === -1) return null;
  let depth = spans[li].depth;
  let level = 7;
  const fits = (s) => s.at >= floor && s.end <= ceiling && s.s.length >= QUOTE_MIN && s.s.length <= QUOTE_MAX && occurrences(E.newText, s.s).length === 1;
  for (let k = li - 1; k > 0; k--) {
    const s = spans[k];
    const h = s.s.match(/^(#{1,6}) /);
    if (h) {
      if (h[1].length >= level) continue;
      level = h[1].length;
      // Above a heading, only higher headings are the passage's.
      depth = -2;
      if (fits(s)) return { after: s.s, at: s.at, end: s.end, kind: "heading" };
      continue;
    }
    const parent = s.depth >= 0 && s.depth < depth;
    const leadIn = s.depth === -1 && s.s.endsWith(":") && depth >= 0;
    if (parent || leadIn) {
      if (fits(s)) return { after: s.s, at: s.at, end: s.end, kind: parent ? "parent item" : "lead-in" };
      depth = s.depth;
    }
  }
  return null;
}

/**
 * Proposals for one evidence entry's broken items (kb-reanchor's entry record `E`, which has the new page's text and
 * line spans, and its items). `olds` are the old texts to look each quote up in, in order ([{ text, spans }]): the base
 * page first, then later versions of it, since a quote an earlier repair wrote is not in the base page. Returns a Map from each item to
 * { action: "replace" | "anchor" | "decline", new_quote, after, why, edit, feat }.
 */
export function proposeEntry(E, items, olds) {
  const norm = E.norm;
  const out = new Map();
  // Where a quote was: in the first old text that has it, after the old anchor when that is there too.
  const locate = (q) => {
    for (const o of olds) {
      if (!o.text || !o.spans) continue;
      let from = 0;
      if (E.ev.after !== undefined) {
        const a = o.text.indexOf(norm(E.ev.after));
        if (a !== -1) from = a + norm(E.ev.after).length;
      }
      let at = o.text.indexOf(q, from);
      if (at === -1) at = o.text.indexOf(q);
      if (at !== -1) return { o, at };
    }
    return null;
  };
  /**
   * The place and text of an old passage on the new page, or why there is none. The quote's sentences that have a
   * partner set its place. One without (a sentence the vendor cut, or rewrote past recognition) is passed over; when it
   * was the quote's first or last, the quote keeps a line edge it had, and otherwise ends at the nearest sentence that
   * survived. A quote that ran to its line's edge also takes in the new sentences there that are no other old
   * sentence's partner: the line said one thing and now says it in two sentences.
   */
  const mapPassage = (q) => {
    const loc = locate(q);
    if (!loc) return { fail: "the old quote is not in the old text" };
    const { o, at } = loc;
    const L = alignPieces(o.spans, E.newSpans);
    const ix = L.op.flatMap((p, i) => (p.at < at + q.length && p.at + p.s.length > at ? [i] : []));
    if (!ix.length) return { fail: "no old line" };
    const oldLine = o.spans[L.op[ix[0]].line].s;
    const mappedIx = ix.filter((i) => L.to[i] !== -1);
    if (!mappedIx.length) return { fail: "nothing on the new page is like the old sentence", lineHow: "none", oldLine };
    for (let k = 1; k < mappedIx.length; k++) {
      if (L.to[mappedIx[k]] <= L.to[mappedIx[k - 1]]) return { fail: "the quote's sentences are no longer in order", lineHow: "none", oldLine };
    }
    const i1 = ix[0];
    const ik = ix.at(-1);
    const first = L.op[i1];
    const last = L.op[ik];
    const startsLine = i1 === 0 || L.op[i1 - 1].line !== first.line;
    const endsLine = ik === L.op.length - 1 || L.op[ik + 1].line !== last.line;
    const j1 = L.to[mappedIx[0]];
    const jk = L.to[mappedIx.at(-1)];
    const mine = new Set(ix);
    const free = (j) => L.owner[j] === -1 || mine.has(L.owner[j]);
    const newLine = (j) => E.newSpans[L.np[j].line].s;
    const how = {};
    let a;
    let b;
    let kept = 1;
    // The left edge.
    const c1 = L.to[i1] !== -1 ? carve(first.s, L.np[j1].s, Math.max(0, at - first.at), ix.length === 1 ? at + q.length - first.at : first.s.length) : null;
    if (L.to[i1] !== -1 && !c1) {
      const v = ix.length === 1 ? verbatim(first.s, L.np[j1].s, Math.max(0, at - first.at), at + q.length - first.at) : null;
      if (v) {
        const s = L.np[j1].at;
        return { at: s + v.a, text: E.newText.slice(s + v.a, s + v.b), lineHow: "reworded", how: { left: "same words", right: "same words" }, kept: 1, lineScore: L.score[i1], oldLine, newLine: newLine(j1) };
      }
      return { fail: "none of the quote's words are in the new sentence", lineHow: "reworded", oldLine, newLine: newLine(j1) };
    }
    const atPieceStart = c1 ? c1.how.left.startsWith("piece start") : at - first.at <= 2;
    if (startsLine && atPieceStart) {
      // The quote began its line: it takes the new line's leading sentences that are nobody else's.
      let j = j1;
      while (j > 0 && L.np[j - 1].line === L.np[j1].line && free(j - 1)) j--;
      if (j !== j1 || !c1) {
        const withMarker = MARKER.test(toks(first.s)[0].w) && at === first.at;
        const t = toks(L.np[j].s);
        let k = 0;
        if (!withMarker) while (k < t.length - 1 && MARKER.test(t[k].w)) k++;
        a = L.np[j].at + t[k].at;
        how.left = j !== j1 ? "line start, over new sentences" : "line start";
      } else {
        a = L.np[j1].at + c1.a;
        how.left = c1.how.left;
      }
    } else if (c1) {
      a = L.np[j1].at + c1.a;
      how.left = c1.how.left;
      kept = Math.min(kept, c1.kept);
    } else {
      a = L.np[j1].at;
      how.left = "first sentence gone";
    }
    // The right edge.
    const c2 = L.to[ik] !== -1 ? (ix.length === 1 ? c1 : carve(last.s, L.np[jk].s, 0, at + q.length - last.at)) : null;
    if (L.to[ik] !== -1 && !c2) return { fail: "none of the quote's words are in the new sentence", lineHow: "reworded", oldLine, newLine: newLine(jk) };
    const atPieceEnd = c2 ? c2.how.right === "piece end" : last.at + last.s.length - (at + q.length) <= 1;
    if (endsLine && atPieceEnd) {
      let j = jk;
      while (j < L.np.length - 1 && L.np[j + 1].line === L.np[jk].line && free(j + 1)) j++;
      if (j !== jk || !c2) {
        b = L.np[j].at + L.np[j].s.length - (c2 && j === jk ? L.np[jk].s.length - c2.b : 0);
        how.right = j !== jk ? "line end, over new sentences" : "line end";
      } else {
        b = L.np[jk].at + c2.b;
        how.right = c2.how.right;
      }
    } else if (c2) {
      b = L.np[jk].at + c2.b;
      how.right = c2.how.right;
      kept = Math.min(kept, c2.kept);
    } else {
      b = L.np[jk].at + L.np[jk].s.length;
      how.right = "last sentence gone";
    }
    if (b <= a) return { fail: "the mapped passage is empty", lineHow: "reworded", oldLine };
    const hows = mappedIx.map((i) => L.how[i]);
    const lineHow = hows.includes("moved") ? "moved" : hows.includes("reworded") || mappedIx.length !== ix.length ? "reworded" : "same";
    // Too long for a quote: the stretch from the first to the last of the quote's words that survive.
    if (b - a > QUOTE_MAX && c1 && c2) {
      const ta = L.np[j1].at + c1.ta;
      const tb = L.np[jk].at + c2.tb;
      if (tb - ta >= QUOTE_MIN && tb - ta <= QUOTE_MAX) {
        a = ta;
        b = tb;
        how.left = "cut to fit";
        how.right = "cut to fit";
      }
    }
    const text = E.newText.slice(a, b);
    // A passage that keeps under half of the quote's words is another sentence, whatever the alignment says.
    const qw = words(toks(q));
    const share = qw.length ? align(qw, words(toks(text))).length / qw.length : 0;
    if (share < KEEP_MIN) return { fail: "less than half of the quote's words are in the new passage", lineHow, oldLine, newLine: newLine(j1) };
    return { at: a, text, lineHow, how, kept, share, lineScore: Math.min(...mappedIx.map((i) => L.score[i])), oldLine, newLine: newLine(j1) };
  };

  // 1. Each quote's target: a broken one's mapped passage.
  const target = new Array(E.ev.quotes.length).fill(null);
  const mapped = new Map();
  for (const b of items) {
    const m = mapPassage(norm(b.quote));
    mapped.set(b, m);
    if (!b.anchor && !m.fail) target[b.qi] = m;
  }
  // 2. The entry's anchor: a broken one's mapped line, when that occurs once.
  let from = 0;
  let newAfter = null;
  const anchorItem = items.find((b) => b.anchor);
  if (E.ev.after !== undefined && !anchorItem) from = E.newText.indexOf(norm(E.ev.after)) + norm(E.ev.after).length;
  if (anchorItem) {
    const m = mapped.get(anchorItem);
    if (!m.fail && m.text.length >= QUOTE_MIN && m.text.length <= QUOTE_MAX && occurrences(E.newText, m.text).length === 1) {
      newAfter = { after: m.text, end: m.at + m.text.length, kind: `the old anchor's line, ${m.lineHow}`, m };
      from = newAfter.end;
    }
  }
  // 3. Every quote of the entry, as it would be, must resolve to its target.
  const texts = E.ev.quotes.map((q, qi) => (target[qi] ? target[qi].text : norm(q)));
  const targetAt = E.ev.quotes.map((q, qi) => {
    if (target[qi]) return target[qi].at;
    // A broken quote with no proposal has no target.
    if (items.some((b) => !b.anchor && b.qi === qi)) return -1;
    // A quote that anchors now: where it was, mapped, when it is repeated; else where it resolves.
    const m = occurrences(E.newText, norm(q)).length > 1 ? mapPassage(norm(q)) : null;
    return m && !m.fail && m.text === norm(q) ? m.at : E.newText.indexOf(norm(q), E.ev.after !== undefined && !anchorItem ? from : 0);
  });
  const resolves = (f) => texts.every((t, qi) => targetAt[qi] < 0 || E.newText.indexOf(t, f) === targetAt[qi]);
  const uniqueAll = () => texts.every((t, qi) => targetAt[qi] < 0 || occurrences(E.newText, t).length === 1);
  const live = targetAt.filter((x) => x >= 0);
  // Where a copy of an entry's quote comes before its target, an anchor must come after that copy.
  const lineAbove = () => {
    const firstAt = Math.min(...live);
    const prevCopy = Math.max(-1, ...texts.flatMap((t, qi) => (targetAt[qi] < 0 ? [] : occurrences(E.newText, t).filter((x) => x < targetAt[qi]))));
    const c = anchorAbove(E, firstAt, prevCopy + 1, firstAt);
    return c && resolves(c.end) ? c : null;
  };
  let needAnchor = null;
  if (anchorItem && !newAfter && live.length) {
    // The old anchor's line is gone: the nearest line above the entry's first quote that can stand for it.
    const c = lineAbove();
    if (c) newAfter = { ...c, structural: true };
  } else if (E.ev.after === undefined && live.length && !uniqueAll()) {
    needAnchor = lineAbove();
  }

  // 4. One proposal per broken item.
  for (const b of items) {
    const m = mapped.get(b);
    const feat = { why: b.why, lineHow: m.lineHow ?? null, edges: m.how ?? null, oldLine: m.oldLine, newLine: m.newLine };
    if (b.anchor) {
      if (newAfter?.m) out.set(b, { action: "replace", new_quote: newAfter.after, edit: editClass(norm(b.quote), newAfter.after).cls, feat: { ...feat, anchorKind: newAfter.kind } });
      else if (newAfter) out.set(b, { action: "replace", new_quote: newAfter.after, edit: "structure", feat: { ...feat, anchorKind: newAfter.kind } });
      else out.set(b, { action: "decline", why: m.fail ?? "the old anchor's new line does not occur once", feat });
      continue;
    }
    if (m.fail) {
      out.set(b, { action: "decline", why: m.fail, feat });
      continue;
    }
    if (m.text.length < QUOTE_MIN || m.text.length > QUOTE_MAX) {
      out.set(b, { action: "decline", why: `the passage it maps to is ${m.text.length} characters`, feat });
      continue;
    }
    const same = m.text === norm(b.quote);
    const edit = same ? "unchanged" : editClass(norm(b.quote), m.text).cls;
    if (same && !needAnchor) {
      out.set(b, { action: "decline", why: "the quote is unchanged where it was, but no line above it can anchor the entry", feat });
      continue;
    }
    if (needAnchor) feat.anchorKind = needAnchor.kind;
    out.set(b, { ...(same ? { action: "anchor", after: needAnchor.after } : { action: "replace", new_quote: m.text }), edit, feat });
  }
  // A new anchor the entry needs, when no unchanged quote carries it: the first replacement does.
  if (needAnchor && ![...out.values()].some((d) => d.action === "anchor")) {
    const first = items.find((b) => !b.anchor && out.get(b).action === "replace");
    if (first) out.get(first).after = needAnchor.after;
  }
  return out;
}
