import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F } from './theme';
import { useApp } from './context/AppContext';

export const T = ({ s = 14, px, c = C.text, b, style, ...p }) => (
  <Text {...p} style={[{ fontSize: s, color: c, fontFamily: px ? F.px : b ? F.b : F.r, lineHeight: s * (px ? 1.6 : 1.45) }, style]} />
);

// Original pixel mascot ("Blobby") drawn from a character grid
const BLOB = ['..........','...gggg...','..gggggg..','.ggwbggwbg','.ggggggggg','.gggkkgggg','.gGGGGGGGg','..GGGGGG..'];
const MAP = { g: '#4be39b', G: '#27a96d', w: '#fff', b: '#111', k: '#157a4c' };
export const Slime = ({ px = 6 }) => (
  <View>{BLOB.map((r, y) => (
    <View key={y} style={{ flexDirection: 'row' }}>
      {r.split('').map((ch, x) => <View key={x} style={{ width: px, height: px, backgroundColor: MAP[ch] || 'transparent' }} />)}
    </View>))}</View>
);

export const Btn = ({ label, onPress, color = C.blue, dark = C.blueD, tc = '#fff', disabled, style, small, icon }) => {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v) => Animated.spring(s, { toValue: v, speed: 40, bounciness: 10, useNativeDriver: true }).start();
  return (
    <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
      <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.93)} onPressOut={() => to(1)}
        style={{ backgroundColor: color, borderBottomColor: dark, borderBottomWidth: 4, borderRadius: 4, paddingVertical: small ? 8 : 12, paddingHorizontal: 16, alignItems: 'center', opacity: disabled ? 0.45 : 1 }}>
        <T px s={small ? 9 : 11} c={tc}>{icon ? icon + ' ' : ''}{label}</T>
      </Pressable>
    </Animated.View>
  );
};
export const Ghost = (p) => <Btn {...p} color={C.card} dark={C.line} tc={C.text} />;
export const Card = ({ style, ...p }) => <View {...p} style={[{ backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderBottomWidth: 3, borderRadius: 8, padding: 14 }, style]} />;
export const Bar = ({ v, color = C.lime, h = 8 }) => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(t, { toValue: Math.min(1, v || 0), duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(); }, [v]);
  return (
    <View style={{ height: h, borderRadius: h, backgroundColor: C.panel, overflow: 'hidden', borderWidth: 1, borderColor: C.line }}>
      <Animated.View style={{ width: t.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), height: '100%', backgroundColor: color }} />
    </View>
  );
};
export const Bubble = ({ text }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 }}>
    <Slime px={5} />
    <View style={{ flex: 1, backgroundColor: C.panel, borderRadius: 8, borderColor: C.line, borderWidth: 1, padding: 12 }}><T s={13}>{text}</T></View>
  </View>
);

// REQUIREMENT 3: nested consumer. XPChip gets xp from context, nobody passes it down.
export const XPChip = () => {
  const { store } = useApp();
  return <T px s={9} c={C.yellow}>Lv{Math.floor(store.xp / 100) + 1} · {store.xp} XP</T>;
};

// Header no longer needs an `app` prop: it reads everything from context.
export const Header = () => {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const { store } = app;
  const links = [['Dashboard', 'dash'], ['Explore Courses', 'explore'], ['Home', 'landing']];
  return (
    <View style={{ zIndex: 20, backgroundColor: C.bg, borderBottomColor: C.line, borderBottomWidth: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 36, gap: 10 }}>
        <View style={{ width: 16, height: 16, backgroundColor: C.yellow, borderRadius: 3 }} />
        <T px s={14} style={{ flex: 1 }}>CodeQuest</T>
        {store.onboarded ? <XPChip /> : <Btn small color={C.yellow} dark={C.yellowD} tc="#111" label="Sign up" onPress={() => app.go('signup')} />}
        <Pressable onPress={() => setOpen(!open)}><T s={24}>{open ? '✕' : '☰'}</T></Pressable>
      </View>
      {open && <View style={{ backgroundColor: C.card, borderTopColor: C.line, borderTopWidth: 1, padding: 8 }}>
        {links.map(([l, n]) => <Pressable key={n} onPress={() => { setOpen(false); app.reset(n); }} style={{ padding: 12 }}><T b>{l}</T></Pressable>)}
      </View>}
    </View>
  );
};

export const Confetti = ({ onEnd }) => {
  const ps = useRef([...Array(28)].map((_, i) => ({ t: new Animated.Value(0), x: Math.random() * 360, dx: (Math.random() - 0.5) * 80,
    col: [C.blue, C.yellow, C.pink, C.lime, '#a66bff'][i % 5], d: 1400 + Math.random() * 1200 }))).current;
  useEffect(() => { Animated.parallel(ps.map((p) => Animated.timing(p.t, { toValue: 1, duration: p.d, easing: Easing.out(Easing.quad), useNativeDriver: true }))).start(onEnd); }, []);
  return <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
    {ps.map((p, i) => <Animated.View key={i} style={{ position: 'absolute', left: p.x, top: -10, width: 6, height: 10, backgroundColor: p.col,
      opacity: p.t.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
      transform: [{ translateY: p.t.interpolate({ inputRange: [0, 1], outputRange: [0, 700] }) }, { translateX: p.t.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
        { rotate: p.t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] }) }] }} />)}
  </View>;
};

export const Toast = ({ title, msg, onClose }) => {
  const y = useRef(new Animated.Value(120)).current;
  useEffect(() => { Animated.spring(y, { toValue: 0, useNativeDriver: true }).start(); const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return <Animated.View style={{ position: 'absolute', right: 12, bottom: 80, left: 60, zIndex: 60, transform: [{ translateY: y }], backgroundColor: '#07304f', borderColor: C.blue, borderWidth: 1, borderRadius: 8, padding: 12 }}>
    <T b>{'✦ ' + title}</T><T s={12} c={C.mute}>{msg}</T>
  </Animated.View>;
};

// Touch version of the mouse sparkle trail: every tap spawns a small pixel burst
const Burst = ({ x, y, done }) => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(t, { toValue: 1, duration: 600, useNativeDriver: true }).start(done); }, []);
  return <>{[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3;
    return <Animated.View key={i} style={{ position: 'absolute', left: x - 3, top: y - 3, width: 6, height: 6, backgroundColor: i % 2 ? C.yellow : C.blue,
      opacity: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(a) * 34] }) }, { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(a) * 34] }) }] }} />; })}</>;
};
export const Sparkles = ({ children }) => {
  const [list, setList] = useState([]);
  const id = useRef(0);
  return <View style={{ flex: 1 }} onTouchStart={(e) => { const k = id.current++; setList((l) => [...l, { k, x: e.nativeEvent.pageX, y: e.nativeEvent.pageY }]); }}>
    {children}
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}>
      {list.map((s) => <Burst key={s.k} x={s.x} y={s.y} done={() => setList((l) => l.filter((q) => q.k !== s.k))} />)}
    </View>
  </View>;
};

// ---------- animation + blocky world ----------
const W = Dimensions.get('window').width;
const loop = (t, dur, ease = Easing.inOut(Easing.quad)) => Animated.loop(Animated.sequence([
  Animated.timing(t, { toValue: 1, duration: dur, easing: ease, useNativeDriver: true }), Animated.timing(t, { toValue: 0, duration: dur, easing: ease, useNativeDriver: true })])).start();

export const FadeIn = ({ delay = 0, children, style }) => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(t, { toValue: 1, duration: 500, delay, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }).start(); }, []);
  return <Animated.View style={[{ opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }, { scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }, style]}>{children}</Animated.View>;
};
export const Slide = ({ children }) => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(t, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); }, []);
  return <Animated.View style={{ flex: 1, opacity: t, transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>{children}</Animated.View>;
};
export const Bob = ({ amp = 6, dur = 900, children, style }) => {
  const t = useRef(new Animated.Value(0)).current; useEffect(() => loop(t, dur), []);
  return <Animated.View style={[{ transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -amp] }) }] }, style]}>{children}</Animated.View>;
};
export const Pulse = ({ children, to = 1.07 }) => {
  const t = useRef(new Animated.Value(0)).current; useEffect(() => loop(t, 700), []);
  return <Animated.View style={{ transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, to] }) }] }}>{children}</Animated.View>;
};
export const Px = ({ rows, map, s = 5 }) => (
  <View>{rows.map((r, y) => <View key={y} style={{ flexDirection: 'row' }}>
    {r.split('').map((ch, x) => <View key={x} style={{ width: s, height: s, backgroundColor: map[ch] || 'transparent' }} />)}</View>)}</View>
);
// Original blocky explorer character (not based on any existing game character)
const EXP = ['..hhhh..', '.hhhhhh.', '.hssssh.', '.skssks.', '.ssssss.', '..cccc..', 'sbbbbbbs', 'sbbbbbbs', '.bbbbbb.', '.pp..pp.', '.pp..pp.', '.dd..dd.'];
const EXPM = { h: '#e8742a', s: '#f2c28c', k: '#222', c: '#ff5da2', b: '#3b6fe0', p: '#43338a', d: '#2b2b2b' };
const Cloud = ({ top, from, dur, b = 10 }) => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.timing(t, { toValue: 1, duration: dur, easing: Easing.linear, useNativeDriver: true })).start(); }, []);
  return <Animated.View style={{ position: 'absolute', top, left: 0, transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [from, W + 100] }) }] }}>
    <Px rows={['..XXX...', '.XXXXXX.', 'XXXXXXXX']} map={{ X: 'rgba(255,255,255,0.95)' }} s={b} /></Animated.View>;
};
const Mtn = ({ left, b = 14, rows = 10, c1, c2 }) => (
  <View style={{ position: 'absolute', left, bottom: 46, alignItems: 'center' }}>
    {[...Array(rows)].map((_, r) => <View key={r} style={{ width: (2 * r + 1) * b, height: b, backgroundColor: r < 2 ? '#fff' : r % 2 ? c1 : c2 }} />)}
  </View>
);
const Tree = ({ left, b = 10 }) => (
  <View style={{ position: 'absolute', left, bottom: 42, alignItems: 'center' }}>
    {[1, 3, 5].map((n) => <View key={n} style={{ width: n * b, height: b, backgroundColor: n === 3 ? '#2f9e4f' : '#237a3c' }} />)}
    <View style={{ width: b, height: b * 2, backgroundColor: '#6b4423' }} />
  </View>
);
const Walker = () => {
  const x = useRef(new Animated.Value(0)).current, hop = useRef(new Animated.Value(0)).current, step = useRef(new Animated.Value(0)).current;
  useEffect(() => { loop(x, 5200, Easing.linear); loop(hop, 420, Easing.out(Easing.quad)); loop(step, 260, Easing.linear); }, []);
  return <>
    <Animated.View style={{ position: 'absolute', bottom: 40, left: 20, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, W - 90] }) }, { translateY: step.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }] }}>
      <Px rows={EXP} map={EXPM} s={5} /></Animated.View>
    <Animated.View style={{ position: 'absolute', bottom: 40, right: 24, transform: [{ translateY: hop.interpolate({ inputRange: [0, 1], outputRange: [0, -26] }) }, { scaleY: hop.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0.8, 1.05, 1] }) }] }}><Slime px={6} /></Animated.View>
  </>;
};
export const Landscape = ({ height = 440, children }) => {
  const sun = useRef(new Animated.Value(0)).current; useEffect(() => loop(sun, 1500), []);
  const cols = Math.ceil(W / 16) + 1;
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <LinearGradient colors={['#2f8cff', '#7fd4ff', '#d9f4ff']} style={StyleSheet.absoluteFill} />
      <Animated.View style={{ position: 'absolute', top: 24, right: 28, width: 44, height: 44, backgroundColor: '#fff3a0', borderColor: C.yellow, borderWidth: 6,
        transform: [{ scale: sun.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }, { rotate: sun.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) }] }} />
      <Cloud top={70} from={-80} dur={30000} /><Cloud top={150} from={W / 2} dur={42000} b={7} /><Cloud top={30} from={W * 0.8} dur={36000} b={8} />
      <Mtn left={-20} c1="#4a7fb5" c2="#5c93c9" /><Mtn left={W * 0.45} rows={8} c1="#3f6f9f" c2="#4f84b8" />
      <Tree left={14} /><Tree left={W * 0.36} b={8} /><Tree left={W * 0.78} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <View style={{ flexDirection: 'row' }}>{[...Array(cols)].map((_, i) => <View key={i} style={{ width: 16, height: 14, backgroundColor: i % 3 ? '#4ec24e' : '#5ed65e' }} />)}</View>
        {[0, 1].map((r) => <View key={r} style={{ flexDirection: 'row' }}>{[...Array(cols)].map((_, i) => <View key={i} style={{ width: 16, height: 16, backgroundColor: (i + r) % 3 ? '#8b5a2b' : '#7a4d24' }} />)}</View>)}
      </View>
      <Walker />
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
};
const Star = ({ i }) => {
  const t = useRef(new Animated.Value(0)).current; useEffect(() => loop(t, 600 + (i % 5) * 400), []);
  const sz = 3 + (i % 3) * 2;
  return <Animated.View style={{ position: 'absolute', left: (i * 53) % (W - 10), top: (i * 97) % 520, width: sz, height: sz, backgroundColor: i % 4 ? '#fff' : C.yellow, opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }} />;
};
export const Stars = () => <View pointerEvents="none" style={StyleSheet.absoluteFill}>{[...Array(26)].map((_, i) => <Star key={i} i={i} />)}</View>;

// ---------- blocky course-card banner ----------
const TAG = { python: 'PY', html: '</>', css: 'CSS', js: 'JS', sql: 'SQL', ai: 'AI', game: 'GD', pandas: 'DF', ml: 'ML', cs: 'CS', design: 'UX' };
const Rise = ({ i, x, col }) => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.timing(t, { toValue: 1, duration: 2400 + i * 500, delay: i * 400, easing: Easing.linear, useNativeDriver: true })).start(); }, []);
  return <Animated.View style={{ position: 'absolute', left: x, bottom: 10, width: 6, height: 6, backgroundColor: col,
    opacity: t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
    transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -90] }) }, { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }} />;
};
const Shine = ({ i }) => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.timing(t, { toValue: 1, duration: 2800, delay: 600 + i * 300, easing: Easing.inOut(Easing.quad), useNativeDriver: true })).start(); }, []);
  return <Animated.View style={{ position: 'absolute', top: -30, width: 26, height: 180, backgroundColor: 'rgba(255,255,255,0.25)',
    transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [-60, W] }) }, { rotate: '20deg' }] }} />;
};
const Runner = ({ i }) => {
  const x = useRef(new Animated.Value(0)).current, st = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.timing(x, { toValue: 1, duration: 4200 + i * 500, easing: Easing.linear, useNativeDriver: true })).start(); loop(st, 170, Easing.linear); }, []);
  return <Animated.View style={{ position: 'absolute', bottom: 10, left: 0, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-30, W - 40] }) }, { translateY: st.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }}>
    <Px rows={EXP} map={EXPM} s={3} /></Animated.View>;
};
export const BlockBanner = ({ c, i = 0 }) => {
  const w = useRef(new Animated.Value(0)).current; useEffect(() => loop(w, 1000 + (i % 3) * 250), []);
  const cols = Math.ceil(W / 28);
  return (
    <View style={{ height: 112, overflow: 'hidden' }}>
      <LinearGradient colors={c.g} style={StyleSheet.absoluteFill} />
      {[0, 1, 2, 3].map((r) => <View key={r} style={{ flexDirection: 'row' }}>{[...Array(cols)].map((_, k) => <View key={k} style={{ width: 28, height: 28, backgroundColor: (k + r) % 2 ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)' }} />)}</View>)}
      {[30, 90, 170, 250].map((x, k) => <Rise key={k} i={k} x={x} col={k % 2 ? '#fff3a0' : '#ffffff'} />)}
      <Animated.View style={{ position: 'absolute', top: 14, right: 24, width: 64, height: 64, backgroundColor: c.g[1], borderWidth: 5, alignItems: 'center', justifyContent: 'center',
        borderTopColor: 'rgba(255,255,255,0.6)', borderLeftColor: 'rgba(255,255,255,0.6)', borderRightColor: 'rgba(0,0,0,0.5)', borderBottomColor: 'rgba(0,0,0,0.5)',
        transform: [{ translateY: w.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }, { rotate: w.interpolate({ inputRange: [0, 1], outputRange: ['-7deg', '7deg'] }) }] }}>
        <Text style={{ fontFamily: F.px, fontSize: (TAG[c.id] || 'X').length > 2 ? 11 : 16, color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 }}>{TAG[c.id] || '?'}</Text>
      </Animated.View>
      <Shine i={i} />
      <Runner i={i} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row' }}>{[...Array(Math.ceil(W / 14))].map((_, k) => <View key={k} style={{ width: 14, height: 10, backgroundColor: k % 3 ? '#4ec24e' : '#5ed65e', borderBottomWidth: 3, borderBottomColor: '#8b5a2b' }} />)}</View>
    </View>
  );
};

export const Explorer = ({ s = 3 }) => <Px rows={EXP} map={EXPM} s={s} />;
export { Cloud, Mtn, Tree, Walker };
