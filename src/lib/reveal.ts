/**
 * Animated show/hide of translations: the block grows smoothly, then its text is typed in letter by letter.
 *
 * Own small code rather than a typing library (typed.js, TypeIt): those type one string into one element,
 * while here dozens of translations appear at once and keep their markup (bold words inside a sentence).
 * Typing fills the existing text nodes, so the markup stays intact.
 */

/** How many characters of each text node are visible when `shown` characters of the whole are typed. */
export function splitProgress(lengths: number[], shown: number): number[] {
  let left = Math.max(0, shown);
  return lengths.map((len) => {
    const take = Math.min(len, left);
    left -= take;
    return take;
  });
}

/** Typing time for a text: quick for short labels, capped for long paragraphs. */
export function typingDuration(chars: number): number {
  return Math.min(900, 120 + chars * 12);
}

const GROW_MS = 220;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Elements on screen (with a margin) get the animation; the rest just switch, so long pages stay fast. */
function nearViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > -200 && r.top < window.innerHeight + 200 && r.width > 0;
}

/** Original text of every node being typed, so a quick toggle never leaves a half-typed translation. */
const originals = new WeakMap<Text, string>();
/** Current typing run per element; a newer run (or a hide) stops the older one. */
const runs = new WeakMap<HTMLElement, number>();

function textNodes(el: HTMLElement): Text[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
  return nodes;
}

function finishTyping(el: HTMLElement): void {
  runs.set(el, (runs.get(el) ?? 0) + 1);
  for (const n of textNodes(el)) {
    const full = originals.get(n);
    if (full !== undefined) n.data = full;
  }
}

function typeIn(el: HTMLElement): void {
  finishTyping(el);
  const run = runs.get(el)!;
  const nodes = textNodes(el);
  const full = nodes.map((n) => {
    const text = originals.get(n) ?? n.data;
    originals.set(n, text);
    return text;
  });
  const lengths = full.map((s) => s.length);
  const total = lengths.reduce((a, b) => a + b, 0);
  if (total === 0) return;
  const duration = typingDuration(total);
  nodes.forEach((n) => (n.data = ''));
  const start = performance.now();
  const step = (now: number) => {
    if (runs.get(el) !== run) return;
    const shown = Math.ceil((total * (now - start)) / duration);
    splitProgress(lengths, shown).forEach((count, i) => (nodes[i]!.data = full[i]!.slice(0, count)));
    if (shown < total) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function isBlock(el: HTMLElement): boolean {
  return getComputedStyle(el).display !== 'inline';
}

/** Shows translations: call after they became visible (the hiding attribute was removed). */
export function revealTranslations(root: ParentNode = document): void {
  if (prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>('.tr').forEach((el) => {
    if (!nearViewport(el)) return;
    if (isBlock(el)) {
      const height = el.offsetHeight;
      el.animate(
        [
          { height: '0px', opacity: 0, overflow: 'hidden' },
          { height: `${height}px`, opacity: 1, overflow: 'hidden' },
        ],
        { duration: GROW_MS, easing: 'ease-out' },
      );
    }
    typeIn(el);
  });
}

/** Hides translations: shrinks those on screen, then calls `done` (which sets the hiding attribute). */
export function concealTranslations(done: () => void, root: ParentNode = document): void {
  if (prefersReducedMotion()) {
    root.querySelectorAll<HTMLElement>('.tr').forEach(finishTyping);
    return done();
  }
  const animations = [...root.querySelectorAll<HTMLElement>('.tr')]
    .filter((el) => nearViewport(el))
    .map((el) =>
      el.animate(
        isBlock(el)
          ? [
              { height: `${el.offsetHeight}px`, opacity: 1, overflow: 'hidden' },
              { height: '0px', opacity: 0, overflow: 'hidden' },
            ]
          : [{ opacity: 1 }, { opacity: 0 }],
        { duration: GROW_MS, easing: 'ease-in', fill: 'forwards' },
      ),
    );
  Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(() => {
    root.querySelectorAll<HTMLElement>('.tr').forEach(finishTyping);
    done();
    animations.forEach((a) => a.cancel());
  });
}
