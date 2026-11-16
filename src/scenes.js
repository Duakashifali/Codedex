import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F } from './theme';
import { Px, Explorer, Stars, Cloud, Mtn, Tree, Walker, Slime, FadeIn } from './ui';

const { width: W, height: SH } = Dimensions.get('window');
const abs = StyleSheet.absoluteFill;

// Generic looping animation: moves/fades/scales/rotates a child between two states
const A = ({ f = {}, t = {}, dur = 2000, delay = 0, rev, ease = Easing.linear, style, children }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const go = (to) => Animated.timing(v, { toValue: to, duration: dur, delay: to ? delay : 0, easing: ease, useNativeDriver: true });
    Animated.loop(rev ? Animated.sequence([go(1), go(0)]) : go(1)).start();
  }, []);
  const I = (a, b, d) => v.interpolate({ inputRange: [0, 1], outputRange: [a ?? d, b ?? d] });
  return <Animated.View style={[{ position: 'absolute', opacity: I(f.o, t.o, 1), transform: [{ translateX: I(f.x, t.x, 0) }, { translateY: I(f.y, t.y, 0) }, { scale: I(f.s, t.s, 1) }, { rotate: I(f.r, t.r, '0deg') }] }, style]}>{children}</Animated.View>;
};
const B = ({ x, y, w, h, c, style }) => <View style={[{ position: 'absolute', left: x, bottom: y, width: w, height: h, backgroundColor: c }, style]} />;
const Pine = ({ x, b = 8, c = '#12301f' }) => (
  <View style={{ position: 'absolute', left: x, bottom: 22, alignItems: 'center' }}>
    {[1, 3, 3, 5, 5, 7].map((n, k) => <View key={k} style={{ width: n * b, height: b, backgroundColor: c }} />)}<View style={{ width: b, height: b, backgroundColor: '#3b2514' }} />
  </View>
);
const Ground = ({ w, a = '#4ec24e', a2 = '#5ed65e', d = '#8b5a2b' }) => (
  <View style={{ position: 'absolute', bottom: 0, left: 0, width: w, flexDirection: 'row', overflow: 'hidden' }}>
    {[...Array(Math.ceil(w / 14))].map((_, k) => <View key={k} style={{ width: 14, height: 18, backgroundColor: k % 3 ? a : a2, borderBottomWidth: 6, borderBottomColor: k % 2 ? d : '#7a4d24' }} />)}
  </View>
);
const Fly = ({ w, h, n = 7, col = '#ffe680' }) => <>{[...Array(n)].map((_, k) => (
  <A key={k} f={{ x: 0, y: 0, o: 0.15 }} t={{ x: 16 - (k % 3) * 12, y: -20, o: 1 }} rev dur={1100 + k * 230} delay={k * 150} style={{ left: (k * 47 + 20) % (w - 10), top: h * 0.35 + ((k * 31) % (h * 0.4)) }}>
    <View style={{ width: 4, height: 4, backgroundColor: col }} /></A>))}</>;
const Petals = ({ w, h, n = 9 }) => <>{[...Array(n)].map((_, k) => (
  <A key={k} f={{ x: 0, y: -10, o: 1, r: '0deg' }} t={{ x: 40, y: h, o: 0.2, r: '360deg' }} dur={3200 + k * 380} delay={k * 330} style={{ left: (k * 41) % w, top: 0 }}>
    <View style={{ width: 5, height: 5, backgroundColor: k % 2 ? '#ff9ec7' : '#ffd0e6' }} /></A>))}</>;
const Sway = ({ x, y, h = 18, c, top = '#fff', d = 1200 }) => (
  <A f={{ r: '-8deg' }} t={{ r: '8deg' }} rev dur={d + (x % 5) * 80} style={{ left: x, bottom: y }}>
    <View style={{ width: 6, height: 6, backgroundColor: top }} /><View style={{ width: 2, height: h, backgroundColor: c, marginLeft: 2 }} /></A>
);
const Bird = ({ w, y, d }) => (
  <A f={{ x: -20 }} t={{ x: w + 10 }} dur={d} style={{ top: y, left: 0 }}>
    <A f={{ s: 0.5 }} t={{ s: 1 }} rev dur={260} style={{ position: 'relative', flexDirection: 'row' }}>
      <View style={{ width: 9, height: 2, backgroundColor: '#1a0f2e', transform: [{ rotate: '-28deg' }] }} /><View style={{ width: 9, height: 2, backgroundColor: '#1a0f2e', transform: [{ rotate: '28deg' }] }} /></A></A>
);
const Sun = ({ x, y, s = 28, c = '#fff6c8', e = '#ffe08a' }) => (
  <A f={{ s: 1 }} t={{ s: 1.14 }} rev dur={1600} style={{ left: x, bottom: y }}><View style={{ width: s, height: s, backgroundColor: c, borderWidth: 4, borderColor: e }} /></A>
);
const Lantern = ({ x, y }) => (
  <>
    <A f={{ s: 1, o: 0.35 }} t={{ s: 1.5, o: 0.8 }} rev dur={900 + (x % 4) * 150} style={{ left: x - 9, bottom: y - 9 }}><View style={{ width: 28, height: 28, backgroundColor: 'rgba(255,200,90,0.4)' }} /></A>
    <B x={x} y={y} w={10} h={12} c="#ffd36b" style={{ borderWidth: 2, borderColor: '#5a3a14' }} />
  </>
);

const SCENES = {
  // 1 cherry blossom sunset
  cherry: (w, h) => <>
    <LinearGradient colors={['#6a5bd1', '#e48bc4', '#ffb36b']} style={abs} />
    <Sun x={w * 0.42} y={h * 0.34} />
    <A f={{ x: -60 }} t={{ x: w + 20 }} dur={24000} style={{ top: 18 }}><Px rows={['..XXX...', '.XXXXXX.', 'XXXXXXXX']} map={{ X: 'rgba(255,225,240,0.9)' }} s={9} /></A>
    <View style={{ position: 'absolute', left: w * 0.62, bottom: 36 }}><Mtn left={0} rows={7} b={11} c1="#a06bb5" c2="#8a5aa8" /></View>
    {[[0.06, 9], [0.5, 7], [0.84, 10]].map(([p, b], k) => <View key={k} style={{ position: 'absolute', left: w * p, bottom: 8 }}><Tree left={0} b={b} /></View>)}
    {[[0.06, 9], [0.5, 7], [0.84, 10]].map(([p, b], k) => <View key={'c' + k} style={{ position: 'absolute', left: w * p, bottom: 42 }}>{[1, 3, 5].map((n) => <View key={n} style={{ position: 'absolute', left: -n * b / 2 + b / 2, top: -n * b * 0.35, width: n * b, height: b, backgroundColor: n === 3 ? '#ff9ec7' : '#e873a8' }} />)}</View>)}
    <B x={0} y={14} w={w} h={12} c="#c77bb5" />
    <A f={{ x: -w / 2 }} t={{ x: w / 2 }} dur={3000} style={{ bottom: 18, left: w / 4 }}><View style={{ width: 24, height: 2, backgroundColor: 'rgba(255,255,255,0.7)' }} /></A>
    <Ground w={w} a="#6bbf5a" a2="#8ad56f" /><Petals w={w} h={h} />
  </>,
  // 2 sunlit garden with light rays
  garden: (w, h) => <>
    <LinearGradient colors={['#0e3b1d', '#2f7a35', '#a6e35f']} style={abs} />
    {[0.1, 0.25, 0.4].map((p, k) => <A key={k} f={{ r: '-10deg', o: 0.3 }} t={{ r: '8deg', o: 1 }} rev dur={2600 + k * 500} style={{ left: w * p, top: -30 }}><View style={{ width: 22 + k * 8, height: h * 1.6, backgroundColor: 'rgba(255,244,160,0.2)' }} /></A>)}
    <View style={{ position: 'absolute', left: 0, top: 0, width: 38, height: 38, backgroundColor: '#fff7c2' }} />
    {[0.55, 0.8].map((p, k) => <View key={k} style={{ position: 'absolute', left: w * p, bottom: 20, alignItems: 'center' }}>{[3, 5, 7].map((n) => <View key={n} style={{ width: n * 9, height: 9, backgroundColor: n === 5 ? '#1d6b2a' : '#174f20' }} />)}<View style={{ width: 12, height: 22, backgroundColor: '#5a3a1c' }} /></View>)}
    <B x={w * 0.35} y={20} w={w * 0.3} h={14} c="#2aa6a0" />
    {[0.04, 0.12, 0.2, 0.3, 0.68, 0.76, 0.86, 0.92].map((p, k) => <Sway key={k} x={w * p} y={20} h={14 + (k % 3) * 6} c="#2c8a2e" top={['#ff7a3c', '#ff9ec7', '#fff', '#ffcf3c'][k % 4]} />)}
    <Ground w={w} a="#3d9c3d" a2="#52b852" /><Fly w={w} h={h} n={9} />
  </>,
  // 3 lantern-lit pergola at night
  pergola: (w, h) => <>
    <LinearGradient colors={['#04201d', '#0d4a3a', '#1b6b3c']} style={abs} />
    <A f={{ o: 0.6 }} t={{ o: 1 }} rev dur={2200} style={{ right: 22, top: 12 }}><View style={{ width: 22, height: 22, backgroundColor: '#fff6d0' }} /></A>
    <B x={w * 0.12} y={20} w={10} h={h * 0.62} c="#7a4a22" /><B x={w * 0.58} y={20} w={10} h={h * 0.62} c="#7a4a22" />
    <B x={w * 0.08} y={20 + h * 0.62} w={w * 0.62} h={9} c="#9a5f2c" />
    {[...Array(12)].map((_, k) => <A key={k} f={{ y: 0 }} t={{ y: 4 }} rev dur={1400 + k * 90} style={{ left: w * 0.08 + k * (w * 0.62 / 12), top: h * 0.2 + 9 }}><View style={{ width: 8, height: 8 + (k % 4) * 6, backgroundColor: k % 2 ? '#6ac23a' : '#3f9d2e' }} /></A>)}
    <Lantern x={w * 0.2} y={h * 0.5} /><Lantern x={w * 0.5} y={h * 0.5} /><Lantern x={w * 0.88} y={h * 0.38} />
    <B x={w * 0.66} y={20} w={w * 0.22} h={20} c="#6b7280" /><B x={w * 0.72} y={40} w={w * 0.14} h={14} c="#4b5563" />
    <Ground w={w} a="#6b7280" a2="#7b8494" d="#4b5563" /><Fly w={w} h={h} n={10} />
  </>,
  // 4 sunset overlook with pines + birds
  sunset: (w, h) => <>
    <LinearGradient colors={['#3b1c6e', '#e0566b', '#ff9a3c', '#ffd27a']} style={abs} />
    <A f={{ y: 0 }} t={{ y: 8 }} rev dur={3200} style={{ left: w * 0.5 - 16, bottom: h * 0.4 }}><View style={{ width: 32, height: 32, backgroundColor: '#fff6c8', borderWidth: 4, borderColor: '#ffd36b' }} /></A>
    <View style={{ position: 'absolute', left: -20, bottom: 30 }}><Mtn left={0} rows={7} b={12} c1="#5a2f6e" c2="#4a2a5e" /></View>
    <View style={{ position: 'absolute', left: w * 0.62, bottom: 30 }}><Mtn left={0} rows={6} b={12} c1="#5a2f6e" c2="#4a2a5e" /></View>
    <B x={0} y={20} w={w} h={14} c="#e0566b" />
    {[0, 1, 2].map((k) => <A key={k} f={{ s: 0.5, o: 0.4 }} t={{ s: 1, o: 1 }} rev dur={800 + k * 250} style={{ left: w * 0.5 - 14, bottom: 22 + k * 3 }}><View style={{ width: 28 - k * 6, height: 2, backgroundColor: '#fff0b0' }} /></A>)}
    {[0.02, 0.1, 0.18, 0.28, 0.7, 0.78, 0.86, 0.94].map((p, k) => <A key={k} f={{ r: '-2deg' }} t={{ r: '2deg' }} rev dur={1800 + k * 120} style={{ left: 0, bottom: 0 }}><Pine x={w * p} b={6 + (k % 3)} /></A>)}
    <Bird w={w} y={18} d={9000} /><Bird w={w} y={44} d={12000} />
    <View style={{ position: 'absolute', left: w * 0.1, bottom: 20 }}><Explorer s={3} /></View>
    <Ground w={w} a="#27502a" a2="#2f6a34" d="#3b2514" />
  </>,
  // 5 snowy mountain meadow
  meadow: (w, h) => <>
    <LinearGradient colors={['#5aa9ff', '#a9dcff', '#e8f7ff']} style={abs} />
    {[[-60, 20, 26000], [w * 0.4, 46, 34000]].map(([x, y, d], k) => <A key={k} f={{ x }} t={{ x: w + 20 }} dur={d} style={{ top: y }}><Px rows={['..XXX...', '.XXXXXX.', 'XXXXXXXX']} map={{ X: 'rgba(255,255,255,0.95)' }} s={8} /></A>)}
    <View style={{ position: 'absolute', left: w * 0.28, bottom: 30 }}><Mtn left={0} rows={9} b={13} c1="#9fb7d8" c2="#7d97bd" /></View>
    <View style={{ position: 'absolute', left: w * 0.62, bottom: 30 }}><Mtn left={0} rows={6} b={11} c1="#8ea8cc" c2="#6f89b0" /></View>
    <B x={0} y={22} w={w} h={14} c="#3b8ec0" />
    {[...Array(22)].map((_, k) => <Sway key={k} x={(k * 37) % (w - 10)} y={20 + (k % 3) * 3} h={10 + (k % 4) * 3} c="#2f9e3a" top={['#a66bff', '#fff', '#ffd23c'][k % 3]} d={1000 + k * 40} />)}
    <A f={{ x: 4 }} t={{ x: w - 60 }} dur={7000} style={{ bottom: 20 }}><A f={{ y: 0 }} t={{ y: -3 }} rev dur={170} style={{ position: 'relative' }}><Explorer s={3} /></A></A>
    <Ground w={w} a="#3fae3f" a2="#52c452" />
  </>,
  // 6 bridge + cabin by the river
  bridge: (w, h) => <>
    <LinearGradient colors={['#dff0e6', '#8cc7a4', '#3f8f6a']} style={abs} />
    {[0, 0.2, 0.45, 0.7, 0.9].map((p, k) => <View key={k} style={{ position: 'absolute', left: w * p - 20, bottom: 40 + (k % 2) * 8, alignItems: 'center' }}>{[3, 5, 7].map((n) => <View key={n} style={{ width: n * 9, height: 9, backgroundColor: n === 5 ? '#2f8a4a' : '#256f3b' }} />)}</View>)}
    <View style={{ position: 'absolute', left: w * 0.62, bottom: 44 }}>
      {[1, 3, 5].map((n) => <View key={n} style={{ width: n * 9, height: 7, backgroundColor: '#b5562f', alignSelf: 'center' }} />)}
      <View style={{ width: 45, height: 26, backgroundColor: '#7a4a22', alignSelf: 'center' }}><A f={{ o: 0.6 }} t={{ o: 1 }} rev dur={700} style={{ left: 16, top: 8 }}><View style={{ width: 9, height: 9, backgroundColor: '#ffd36b' }} /></A></View>
    </View>
    {[0, 1, 2].map((k) => <A key={k} f={{ y: 0, o: 0.7, s: 0.6 }} t={{ y: -34, o: 0, s: 1.6 }} dur={2600} delay={k * 800} style={{ left: w * 0.62 + 42, bottom: 92 }}><View style={{ width: 6, height: 6, backgroundColor: '#e5e7eb' }} /></A>)}
    <B x={0} y={0} w={w} h={h * 0.4} c="#2aa1b3" />
    {[0, 1, 2, 3].map((k) => <A key={k} f={{ x: -40 }} t={{ x: w }} dur={3000 + k * 700} delay={k * 400} style={{ bottom: 8 + k * 9, left: 0 }}><View style={{ width: 26, height: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} /></A>)}
    <B x={w * 0.2} y={h * 0.4} w={w * 0.5} h={7} c="#8a4b24" />
    <B x={w * 0.2} y={h * 0.4 - 18} w={9} h={18} c="#5b6270" /><B x={w * 0.2 + w * 0.5 - 9} y={h * 0.4 - 18} w={9} h={18} c="#5b6270" />
    <A f={{ x: w * 0.2 }} t={{ x: w * 0.68 }} dur={5200} style={{ bottom: h * 0.4 + 7 }}><Explorer s={3} /></A>
  </>,
};
const KIND = { python: 'garden', html: 'bridge', css: 'cherry', js: 'sunset', sql: 'pergola', ai: 'meadow', game: 'meadow', pandas: 'bridge', ml: 'cherry', cs: 'sunset', design: 'garden' };
const TAG = { python: 'PY', html: '</>', css: 'CSS', js: 'JS', sql: 'SQL', ai: 'AI', game: 'GD', pandas: 'DA', ml: 'ML', cs: 'CS', php: 'PHP', mobile: 'RN', aifund: 'AI', numpy: 'NP' };

const SRC = [require('../assets/scenes/s1.jpg'), require('../assets/scenes/s2.jpg'), require('../assets/scenes/s3.jpg'), require('../assets/scenes/s4.jpg'), require('../assets/scenes/s5.jpg'), require('../assets/scenes/s6.jpg'), require('../assets/scenes/s7.jpg'), require('../assets/scenes/s8.jpg'), require('../assets/scenes/s9.jpg'), require('../assets/scenes/s10.jpg')];
const PICK = { python: 1, html: 5, css: 0, js: 3, sql: 2, ai: 4, game: 4, pandas: 1, ml: 2, cs: 5, php: 1, mobile: 2, aifund: 3, numpy: 5 };
// Ken Burns: slow pan + zoom across a photo so every image feels alive
const KB = ({ src, w, h, dur = 16000, flip, zoom = 1.07 }) => {
  const ih = h * 1.15, iw = Math.max(w * 1.3, ih * 1.7), ex = iw - w;
  return <A f={{ x: -ex * (flip ? 0.85 : 0.15), s: 1 }} t={{ x: -ex * (flip ? 0.15 : 0.85), s: zoom }} rev dur={dur} ease={Easing.inOut(Easing.quad)} style={{ left: 0, top: -(ih - h) / 2 }}>
    <Image source={src} style={{ width: iw, height: ih }} resizeMode="cover" /></A>;
};
const FX = [
  (w, h) => <Petals w={w} h={h} n={10} />,
  (w, h) => <Fly w={w} h={h} n={10} />,
  (w, h) => <Fly w={w} h={h} n={12} col="#ffd27a" />,
  (w, h) => <Fly w={w} h={h} n={8} col="#ffb86b" />,
  (w, h) => <Fly w={w} h={h} n={10} col="#ffffff" />,
  (w, h) => <>{[0, 1, 2].map((k) => <A key={k} f={{ x: -90 }} t={{ x: w }} dur={9000 + k * 3000} delay={k * 1500} style={{ left: 0, top: h * (0.3 + k * 0.18) }}><View style={{ width: 90, height: 12, backgroundColor: 'rgba(255,255,255,0.2)' }} /></A>)}</>,
];
export const PhotoBG = ({ idx, dim = 0.35 }) => {
  const [sz, setSz] = useState({ width: W, height: SH });
  return <View onLayout={(e) => setSz(e.nativeEvent.layout)} pointerEvents="none" style={[abs, { overflow: 'hidden', backgroundColor: '#000' }]}>
    <KB src={SRC[idx]} w={sz.width} h={sz.height} dur={15000} /><View style={[abs, { backgroundColor: `rgba(0,0,0,${dim})` }]} /></View>;
};
export const Banner = ({ c, i = 0, h = 140 }) => {
  const w = W - 38, k = PICK[c.id] ?? 0;
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(bob, { toValue: 1, duration: 1000 + (i % 3) * 250, useNativeDriver: true }), Animated.timing(bob, { toValue: 0, duration: 1000 + (i % 3) * 250, useNativeDriver: true })])).start(); }, []);
  return (
    <View style={{ height: h, width: w, overflow: 'hidden', backgroundColor: '#000' }}>
      <KB src={SRC[k]} w={w} h={h} dur={13000 + i * 1500} flip={i % 2} />
      {FX[k](w, h)}
      <A f={{ x: -60 }} t={{ x: w + 20 }} dur={3200} delay={600 + i * 400} style={{ top: -20, left: 0 }}><View style={{ width: 22, height: h * 1.8, backgroundColor: 'rgba(255,255,255,0.2)', transform: [{ rotate: '20deg' }] }} /></A>
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 50 }} />
      <Animated.View style={{ position: 'absolute', top: 12, right: 14, width: 54, height: 54, backgroundColor: c.g[1], borderWidth: 4, alignItems: 'center', justifyContent: 'center',
        borderTopColor: 'rgba(255,255,255,0.65)', borderLeftColor: 'rgba(255,255,255,0.65)', borderRightColor: 'rgba(0,0,0,0.5)', borderBottomColor: 'rgba(0,0,0,0.5)',
        transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) }, { rotate: bob.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '6deg'] }) }] }}>
        <Text style={{ fontFamily: F.px, fontSize: (TAG[c.id] || 'X').length > 2 ? 10 : 15, color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 }}>{TAG[c.id] || '?'}</Text>
      </Animated.View>
    </View>
  );
};

// Scroll-driven landing world: photos cross-fade as you scroll, with parallax, drifting petals and fireflies
export const World = ({ y }) => {
  const order = [0, 1, 4, 2, 3], B = 650;
  return (
    <View pointerEvents="none" style={[abs, { overflow: 'hidden', backgroundColor: '#000' }]}>
      {order.map((p, k) => (
        <Animated.View key={k} style={[abs, { opacity: k === 0 ? 1 : y.interpolate({ inputRange: [(k - 1) * B, k * B], outputRange: [0, 1], extrapolate: 'clamp' }),
          transform: [{ translateY: y.interpolate({ inputRange: [0, 3000], outputRange: [0, -60], extrapolate: 'clamp' }) }, { scale: 1.1 }] }]}>
          <KB src={SRC[p]} w={W} h={SH} dur={15000 + k * 1500} flip={k % 2} />
        </Animated.View>
      ))}
      <View style={[abs, { backgroundColor: 'rgba(0,0,0,0.28)' }]} />
      <Petals w={W} h={SH} n={14} /><Fly w={W} h={SH} n={14} col="#fff3a0" />
    </View>
  );
};
// Fades + slides a section up as it scrolls into view
export const Reveal = ({ y, children, style }) => {
  const [ly, setLy] = useState(null);
  const r = ly == null ? null : [ly - SH, ly - SH * 0.6];
  return <Animated.View onLayout={(e) => setLy(e.nativeEvent.layout.y)} style={[{ opacity: r ? y.interpolate({ inputRange: r, outputRange: [0, 1], extrapolate: 'clamp' }) : 0, transform: [{ translateY: r ? y.interpolate({ inputRange: r, outputRange: [70, 0], extrapolate: 'clamp' }) : 70 }, { scale: r ? y.interpolate({ inputRange: r, outputRange: [0.94, 1], extrapolate: 'clamp' }) : 0.94 }] }, style]}>{children}</Animated.View>;
};

// Big photo card with a Ken Burns pan, particles, a light sweep and a one-line caption
export const PhotoCard = ({ idx, title, line, h = 200, flip, fx = 0 }) => {
  const w = W - 38;
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 22, borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 }}>
      <View style={{ height: h, width: w, overflow: 'hidden', backgroundColor: '#000' }}>
        <KB src={SRC[idx]} w={w} h={h} dur={11000} flip={flip} zoom={1.14} />
        {FX[fx % FX.length](w, h)}
        <A f={{ x: -60 }} t={{ x: w + 20 }} dur={3400} delay={900} style={{ top: -20, left: 0 }}><View style={{ width: 24, height: h * 1.8, backgroundColor: 'rgba(255,255,255,0.18)', transform: [{ rotate: '20deg' }] }} /></A>
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.7 }} />
        <View style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
          <Text style={{ fontFamily: F.px, fontSize: 12, color: C.yellow, lineHeight: 20, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 }}>{title}</Text>
          <Text style={{ fontFamily: F.b, fontSize: 14, color: '#fff', marginTop: 6, textShadowColor: '#000', textShadowRadius: 4 }}>{line}</Text>
        </View>
      </View>
    </View>
  );
};

// ---------- original blocky characters (drawn in code, so they can move) ----------
const Spr = ({ rows, map, s = 4 }) => <Px rows={rows} map={map} s={s} />;
const ROBOT = ['...yy...', '...gg...', '.gggggg.', '.gwwwwg.', '.gbwwbg.', '.gggggg.', '..gggg..', 'gggggggg', 'g.gggg.g', '.gg..gg.', '.gg..gg.', '.dd..dd.'];
const ROBOTM = { g: '#9fb4c8', w: '#e8fbff', b: '#1b2a41', y: '#ffc720', d: '#4b5563' };
const MAGE = ['...pp...', '..pppp..', '.pppppp.', 'pppppppp', '.ssssss.', '.skssks.', '.ssssss.', '..tttt..', 'tttttttt', 'tttttttt', '.tttttt.', '.tt..tt.'];
const MAGEM = { p: '#8b5cf6', t: '#6d28d9', s: '#f2c28c', k: '#222' };
const CAT = ['.o....o.', '.oo..oo.', '.oooooo.', '.okooko.', '.oowwoo.', '..oooo..', 'gggggggg', 'gggggggg', '.gggggg.', '.dd..dd.', '.dd..dd.', '.kk..kk.'];
const CATM = { o: '#f59e0b', k: '#222', w: '#fff', g: '#22c55e', d: '#374151' };
const ENV = ['pppppppppp', 'ppwppppwpp', 'pppwppwppp', 'ppppyypppp', 'pppppppppp', 'pppppppppp', 'dddddddddd'];
const ENVM = { p: '#ffc2d9', w: '#ffffff', y: '#ffc720', d: '#e879a8' };
const STAR = ['...y...', '..yyy..', 'yyyyyyy', '.yywyy.', '..yyy..', '.yy.yy.', '.y...y.'];
const Flame = ({ x }) => <>
  <B x={x - 16} y={0} w={32} h={7} c="#5a3a14" />
  {[0, 1, 2].map((k) => <A key={k} f={{ s: 0.8, o: 0.85 }} t={{ s: 1.25, o: 1 }} rev dur={260 + k * 90} style={{ left: x - 10 + k * 8, bottom: 7 }}><View style={{ width: 8, height: 12 + (k % 2) * 8, backgroundColor: k === 1 ? '#ffd23c' : '#ff7a1a' }} /></A>)}
  {[0, 1, 2].map((k) => <A key={'s' + k} f={{ y: 0, o: 1 }} t={{ y: -60, o: 0 }} dur={1300 + k * 300} delay={k * 400} style={{ left: x - 6 + k * 7, bottom: 24 }}><View style={{ width: 3, height: 3, backgroundColor: '#ffd27a' }} /></A>)}
</>;
const CREW = {
  invite: () => <>
    <A f={{ y: 0 }} t={{ y: -8 }} rev dur={1200} style={{ left: 62, bottom: 52 }}><Spr rows={ROBOT} map={ROBOTM} s={4} /></A>
    <A f={{ s: 1 }} t={{ s: 1.05 }} rev dur={900} style={{ left: 46, bottom: 0 }}><Spr rows={ENV} map={ENVM} s={7} /></A>
    <A f={{ y: 0 }} t={{ y: -6 }} rev dur={520} style={{ left: 2, bottom: 0 }}><Explorer s={4} /></A>
    <A f={{ r: '-6deg' }} t={{ r: '6deg' }} rev dur={480} style={{ left: 120, bottom: 0 }}><Spr rows={MAGE} map={MAGEM} s={4} /></A>
  </>,
  learn: () => <>
    <A f={{ r: '-5deg' }} t={{ r: '5deg' }} rev dur={600} style={{ left: 18, bottom: 0 }}><Explorer s={6} /></A>
    <A f={{ y: 0 }} t={{ y: -22 }} rev dur={420} ease={Easing.out(Easing.quad)} style={{ left: 100, bottom: 0 }}><Slime px={6} /></A>
    <A f={{ y: 0, r: '0deg' }} t={{ y: -10, r: '20deg' }} rev dur={900} style={{ left: 104, bottom: 70 }}><Spr rows={STAR} map={{ y: '#ffc720', w: '#fff3a0' }} s={5} /></A>
  </>,
  practice: () => <>
    <Flame x={84} />
    <A f={{ y: 0 }} t={{ y: -4 }} rev dur={700} style={{ left: 6, bottom: 6 }}><Spr rows={CAT} map={CATM} s={5} /></A>
    <A f={{ r: '-4deg' }} t={{ r: '4deg' }} rev dur={900} style={{ left: 114, bottom: 6 }}><Spr rows={ROBOT} map={ROBOTM} s={5} /></A>
  </>,
  build: () => <>
    {[0, 1, 2, 3].map((k) => <A key={k} f={{ y: -50, o: 0 }} t={{ y: 0, o: 1 }} dur={2400} delay={k * 500} style={{ left: 66 + (k % 2) * 8, bottom: k * 16 }}><View style={{ width: 30, height: 16, backgroundColor: ['#8b5a2b', '#6b7280', '#4ec24e', '#ffc720'][k], borderWidth: 2, borderColor: 'rgba(0,0,0,0.4)' }} /></A>)}
    <A f={{ y: 0 }} t={{ y: -5 }} rev dur={600} style={{ left: 6, bottom: 0 }}><Explorer s={5} /></A>
    <A f={{ y: 0 }} t={{ y: -14 }} rev dur={450} ease={Easing.out(Easing.quad)} style={{ left: 118, bottom: 0 }}><Spr rows={ROBOT} map={ROBOTM} s={4} /></A>
  </>,
  community: () => <>
    {[[ROBOT, ROBOTM, 0], [MAGE, MAGEM, 38], [CAT, CATM, 76]].map(([r, m, x], k) => <A key={k} f={{ y: 0 }} t={{ y: -8 }} rev dur={500 + k * 130} delay={k * 120} style={{ left: x, bottom: 0 }}><Spr rows={r} map={m} s={4} /></A>)}
    <A f={{ y: 0 }} t={{ y: -6 }} rev dur={620} style={{ left: 116, bottom: 0 }}><Explorer s={4} /></A>
    <A f={{ s: 0.6, o: 0 }} t={{ s: 1, o: 1 }} rev dur={900} style={{ left: 40, bottom: 66 }}><View style={{ backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4 }}><Text style={{ fontFamily: F.px, fontSize: 8, color: '#111' }}>hi!</Text></View></A>
  </>,
};
export const Crew = ({ kind, scale = 1 }) => <View style={{ width: 170, height: 140, transform: [{ scale }] }}>{CREW[kind]()}</View>;

// Character group on one side, heading + short lines on the other (like the "Invite a Friend" section)
export const SideCard = ({ idx, kind, title, lines, flip, fx = 0 }) => {
  const w = W - 38, h = 200;
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 22, borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 }}>
      <View style={{ height: h, width: w, overflow: 'hidden', backgroundColor: '#000' }}>
        <KB src={SRC[idx]} w={w} h={h} dur={12000} flip={flip} zoom={1.12} />
        {FX[fx % FX.length](w, h)}
        <View style={[abs, { backgroundColor: 'rgba(5,8,22,0.62)' }]} />
        <Ground w={w} />
        <View style={{ flex: 1, flexDirection: flip ? 'row-reverse' : 'row', alignItems: 'center', paddingHorizontal: 6, paddingBottom: 22 }}>
          <View style={{ width: 140, height: 140 }}><View style={{ marginLeft: -15 }}><Crew kind={kind} scale={0.8} /></View></View>
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: F.px, fontSize: 11, color: C.yellow, lineHeight: 19, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 }}>{title}</Text>
            {lines.map((l, k) => <FadeIn key={k} delay={300 + k * 250}><Text style={{ fontFamily: F.r, fontSize: 13, color: '#e8ecf5', marginTop: 6, lineHeight: 18 }}>{l}</Text></FadeIn>)}
          </View>
        </View>
      </View>
    </View>
  );
};
