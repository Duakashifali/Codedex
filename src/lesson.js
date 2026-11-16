import React, { useState } from 'react';
import { View, ScrollView, TextInput, Pressable, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { C } from './theme';
import { COURSES, chapters } from './data';
import { T, Btn, Ghost, Card, Bar, Header, Confetti, Toast } from './ui';
import { Banner } from './scenes';
import { Diagram } from './diagrams';

const MONO = Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' });
const edge = { borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 };

// ---- run helpers (user code runs inside an isolated WebView, never in the app's own JS) ----
const BRIDGE = `<script>(function(){var s=function(t,a){try{window.ReactNativeWebView.postMessage(JSON.stringify({t:t,m:Array.prototype.map.call(a,function(x){try{return typeof x==='object'?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(' ')}))}catch(e){}};console.log=function(){s('log',arguments)};console.error=function(){s('err',arguments)};window.onerror=function(m){s('err',[m])}})();</script>`;
const buildDoc = (f) => {
  const html = f['index.html'] != null ? f['index.html'] : '<p id="out"></p>';
  const m = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html);
  const body = (m ? m[1] : html.replace(/<head[\s\S]*<\/head>/i, '').replace(/<\/?(html|body)[^>]*>|<!doctype[^>]*>/gi, '')).replace(/<script[^>]*src=[^>]*><\/script>/gi, '');
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">${BRIDGE}<style>body{font-family:sans-serif;margin:12px;color:#111}</style><style>${f['styles.css'] || ''}</style></head><body>${body}<script>try{${f['script.js'] || ''}}catch(e){console.error(e.message)}</script></body></html>`;
};
// Tiny safe arithmetic parser (no eval) for the Python simulator
const calc = (s) => { let i = 0; const ws = () => { while (s[i] === ' ') i++; };
  const num = () => { ws(); if (s[i] === '(') { i++; const v = add(); ws(); i++; return v; } const m = /^\d+(\.\d+)?/.exec(s.slice(i)); if (!m) throw 0; i += m[0].length; return +m[0]; };
  const mul = () => { let v = num(); for (;;) { ws(); const o = s[i]; if (o === '*' || o === '/') { i++; const r = num(); v = o === '*' ? v * r : v / r; } else return v; } };
  const add = () => { let v = mul(); for (;;) { ws(); const o = s[i]; if (o === '+' || o === '-') { i++; const r = mul(); v = o === '+' ? v + r : v - r; } else return v; } };
  const r = add(); ws(); if (i < s.length) throw 0; return r; };
const pyRun = (src) => { const vars = {}, out = [];
  const val = (e) => { e = e.trim(); let m;
    if ((m = /^f(["'])(.*)\1$/.exec(e))) return m[2].replace(/\{(\w+)\}/g, (_, n) => (n in vars ? vars[n] : '?'));
    if ((m = /^(["'])(.*)\1$/.exec(e))) return m[2];
    if (e in vars) return vars[e];
    try { return calc(e); } catch (x) { return undefined; } };
  src.split('\n').forEach((line) => { const l = line.trim(); let m;
    if ((m = /^print\((.*)\)$/.exec(l))) { const v = val(m[1]); out.push(v === undefined ? '⚠ not supported here: ' + l : String(v)); }
    else if ((m = /^(\w+)\s*=\s*(.+)$/.exec(l))) { const v = val(m[2]); if (v !== undefined) vars[m[1]] = v; } });
  return out; };

const Block = ({ b }) => {
  if (b.t === 'h') return <T px s={10} c={C.blue} style={{ marginTop: 18, marginBottom: 8 }}># {b.x}</T>;
  if (b.t === 'p') return <T s={15} style={{ marginBottom: 10 }}>{b.x}</T>;
  if (b.t === 'code') return <View style={{ backgroundColor: '#161b2e', padding: 12, borderRadius: 6, marginVertical: 8 }}><Text style={{ fontFamily: MONO, fontSize: 13, color: '#9bd1ff', lineHeight: 19 }}>{b.x}</Text></View>;
  if (b.t === 'tip') return <View style={{ backgroundColor: '#07304f', borderColor: C.blue, borderWidth: 1, padding: 12, marginVertical: 8 }}><T s={13}>💡 {b.x}</T></View>;
  if (b.t === 'img') return <Diagram kind={b.x} />;
  return null;
};
const Pill = ({ label, on, onPress }) => <Pressable onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: on ? '#0b3a5c' : C.card, borderColor: on ? C.blue : C.line, borderWidth: 1, marginRight: 8 }}><T px s={8} c={on ? '#fff' : C.mute}>{label}</T></Pressable>;
const Editor = ({ value, onChange }) => (
  <View style={{ backgroundColor: '#00254d', flexDirection: 'row', padding: 10, minHeight: 190 }}>
    <View style={{ width: 28 }}>{value.split('\n').map((_, k) => <Text key={k} style={{ fontFamily: MONO, fontSize: 13, lineHeight: 20, color: '#5d7fa8' }}>{k + 1}</Text>)}</View>
    <TextInput multiline value={value} onChangeText={onChange} autoCapitalize="none" autoCorrect={false} spellCheck={false} scrollEnabled={false} textAlignVertical="top"
      style={{ flex: 1, fontFamily: MONO, fontSize: 13, lineHeight: 20, color: '#d6e4ff', padding: 0 }} />
  </View>
);

export const Lesson = ({ app, cid, i }) => {
  const { store } = app; const c = COURSES.find((k) => k.id === cid); const ex = chapters(c)[0].ex; const e = ex[i]; const task = e.task;
  const done = (store.done[cid] || []).includes(i);
  const [tab, setTab] = useState('learn'); const [files, setFiles] = useState(task ? task.files : {}); const [cf, setCf] = useState(task ? Object.keys(task.files)[0] : null);
  const [doc, setDoc] = useState(null); const [logs, setLogs] = useState([]); const [res, setRes] = useState(null); const [out, setOut] = useState(null);
  const [hint, setHint] = useState(false); const [fx, setFx] = useState(false); const [toast, setToast] = useState(false); const [busy, setBusy] = useState(false);
  const passed = !task || done || (res && res.every((r) => r.ok));

  const run = () => {
    const r = task.check.map(([re, msg]) => ({ ok: new RegExp(re, 'i').test(Object.values(files).join('\n')), msg })); const ok = r.every((x) => x.ok);
    setRes(r); setLogs([]); setOut(null);
    if (task.run === 'web' || task.run === 'js') setDoc(buildDoc(files));
    if (task.run === 'py') setOut(pyRun(files['main.py']));
    if (task.run === 'sql' || task.run === 'check') setOut(ok ? task.out.split('\n') : ['⚠ Not matching the task yet. Finish every item in the checklist.']);
  };
  const mark = () => { if (done || busy || !passed) return; setBusy(true); setTimeout(() => { app.completeEx(cid, i, e.xp, ex.length); setBusy(false); setFx(true); setToast(true); }, 700); };
  const next = () => (i + 1 < ex.length ? app.replace('lesson', { cid, i: i + 1 }) : app.replace('chapter', { cid }));
  const pct = (store.done[cid] || []).length / ex.length;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header app={app} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }}><T s={12} c={C.mute}>{c.name}</T><View style={{ flex: 1 }}><Bar v={pct} /></View><T s={12} c={C.mute}>{Math.round(pct * 100)}%</T></View>
      {task && <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 8 }}><Pill label="📖 LEARN" on={tab === 'learn'} onPress={() => setTab('learn')} /><Pill label="⌨ CODE" on={tab === 'code'} onPress={() => setTab('code')} /></View>}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
        {tab === 'learn' ? <>
          <View style={[{ marginBottom: 14, overflow: 'hidden' }, edge]}><Banner c={c} i={i} h={120} /></View>
          <T px s={16} style={{ marginBottom: 6 }}>{String(i + 1).padStart(2, '0')}. {e.title}</T>
          {e.blocks ? e.blocks.map((b, k) => <Block key={k} b={b} />) : <T s={15}>{e.body}</T>}
          {task ? <Btn label="Try it in the editor  ›" style={{ marginTop: 16 }} onPress={() => setTab('code')} /> : null}
          <View style={{ backgroundColor: C.panel, padding: 10, marginTop: 20 }}><T b s={13} c={C.mute}>Help</T></View>
          <Pressable onPress={() => setHint(!hint)}><Card style={{ marginTop: 8 }}><T b>💡  Hint   {hint ? '▴' : '▾'}</T>{hint ? <T s={13} c={C.mute} style={{ marginTop: 8 }}>{e.hint}</T> : null}</Card></Pressable>
        </> : <>
          <Card style={{ marginBottom: 12 }}><T px s={8} c={C.yellow}>YOUR TASK</T><T s={14} style={{ marginTop: 6 }}>{task.goal}</T>
            {(res || task.check.map(([, m]) => ({ ok: false, msg: m }))).map((r, k) => <T key={k} s={12} c={res ? (r.ok ? C.lime : C.pink) : C.mute} style={{ marginTop: 4 }}>{res ? (r.ok ? '✔ ' : '✖ ') : '○ '}{r.msg}</T>)}</Card>
          <ScrollView horizontal style={{ marginBottom: 6 }}>{Object.keys(files).map((f) => <Pill key={f} label={f} on={cf === f} onPress={() => setCf(f)} />)}</ScrollView>
          <Editor value={files[cf]} onChange={(v) => setFiles({ ...files, [cf]: v })} />
          <View style={{ flexDirection: 'row', gap: 10, marginVertical: 12 }}>
            <Btn label="▶ Run" onPress={run} style={{ flex: 1 }} /><Ghost label="Reset" onPress={() => { setFiles(task.files); setRes(null); setDoc(null); setOut(null); setLogs([]); }} style={{ flex: 1 }} />
          </View>
          <T px s={9} c={C.mute} style={{ marginBottom: 6 }}>OUTPUT</T>
          {(task.run === 'web' || task.run === 'js') && (doc
            ? <View style={{ height: task.run === 'web' ? 240 : 1, opacity: task.run === 'web' ? 1 : 0, backgroundColor: '#fff' }}><WebView key={doc} originWhitelist={['*']} source={{ html: doc }} javaScriptEnabled nestedScrollEnabled
                onMessage={(ev) => { try { const d = JSON.parse(ev.nativeEvent.data); setLogs((l) => [...l, d]); } catch (x) {} }} /></View>
            : <View style={{ height: 120, backgroundColor: '#e5ebf3', alignItems: 'center', justifyContent: 'center', padding: 16 }}><Text style={{ color: '#4b5563', textAlign: 'center' }}>Your result will appear here when you press Run.</Text></View>)}
          {(task.run === 'js' || logs.length > 0) && <View style={{ backgroundColor: '#0a0f1f', padding: 10, marginTop: 8, minHeight: 60 }}>
            <T px s={7} c={C.mute} style={{ marginBottom: 6 }}>CONSOLE</T>
            {logs.length ? logs.map((l, k) => <Text key={k} style={{ fontFamily: MONO, fontSize: 13, color: l.t === 'err' ? '#ff7a9c' : '#b6f27c' }}>{l.t === 'err' ? '✖ ' : '› '}{l.m}</Text>) : <Text style={{ fontFamily: MONO, color: C.mute, fontSize: 12 }}>Nothing printed yet.</Text>}</View>}
          {(task.run === 'py' || task.run === 'sql' || task.run === 'check') && <View style={{ backgroundColor: '#0a0f1f', padding: 10, minHeight: 90 }}>
            <T px s={7} c={C.mute} style={{ marginBottom: 6 }}>{task.run === 'py' ? 'TERMINAL (simulated: print, variables, math)' : 'RESULT (checked against the task)'}</T>
            {out ? (out.length ? out.map((l, k) => <Text key={k} style={{ fontFamily: MONO, fontSize: 13, color: '#b6f27c' }}>{l}</Text>) : <Text style={{ fontFamily: MONO, color: C.mute }}>No output.</Text>) : <Text style={{ fontFamily: MONO, color: C.mute, fontSize: 12 }}>Press Run to see the output.</Text>}</View>}
          <Pressable onPress={() => setHint(!hint)}><Card style={{ marginTop: 14 }}><T b>💡  Hint   {hint ? '▴' : '▾'}</T>{hint ? <T s={13} c={C.mute} style={{ marginTop: 8 }}>{e.hint}</T> : null}</Card></Pressable>
        </>}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderTopColor: C.line, borderTopWidth: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1 }}><T b s={12} numberOfLines={1}>{e.title}</T><T s={10} c={C.mute}>Exercise {i + 1} / {ex.length} · {e.xp} XP</T></View>
        <Btn small label={busy ? '• • •' : done ? '✓ Done' : passed ? '✓ Mark complete' : '🔒 Pass the task'} color={C.lime} dark={C.limeD} tc="#111" onPress={mark} disabled={done || !passed} />
        <Ghost small label="Back" onPress={() => (i > 0 ? app.replace('lesson', { cid, i: i - 1 }) : app.back())} />
        <Btn small label="Next" color={done ? C.yellow : C.card} dark={done ? C.yellowD : C.line} tc={done ? '#111' : C.mute} disabled={!done} onPress={next} />
      </View>
      {fx && <Confetti onEnd={() => setFx(false)} />}
      {toast && <Toast title={`+${e.xp} XP`} msg="You earned XP for this exercise. Keep it up!" onClose={() => setToast(false)} />}
    </View>
  );
};
