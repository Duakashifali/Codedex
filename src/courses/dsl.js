// Tiny lesson language so content stays readable:
//   # Heading      > tip      @diagram      ~~~ code ~~~      anything else = paragraph
export const parse = (src) => {
  const out = []; let code = null;
  src.trim().split('\n').forEach((ln) => {
    if (ln.trim() === '~~~') { if (code) { out.push({ t: 'code', x: code.join('\n') }); code = null; } else code = []; return; }
    if (code) { code.push(ln); return; }
    const l = ln.trim(); if (!l) return;
    if (l.startsWith('# ')) out.push({ t: 'h', x: l.slice(2) });
    else if (l.startsWith('> ')) out.push({ t: 'tip', x: l.slice(2) });
    else if (l[0] === '@') out.push({ t: 'img', x: l.slice(1) });
    else out.push({ t: 'p', x: l });
  });
  return out;
};
// L(title, xp, text, hint, task)
export const L = (title, xp, src, hint = 'Re-read the lesson and try again.', task) => ({ title, xp, blocks: parse(src), hint, task });
// T(run, goal, files, checks, expectedOutput): run = 'web' | 'js' | 'py' | 'sql' | 'check'
export const T = (run, goal, files, check, out) => ({ goal, run, files, check, out });
