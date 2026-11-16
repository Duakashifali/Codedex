import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, Text, Platform } from 'react-native';
import { C } from './theme';
import { T, Pulse, Bob, FadeIn } from './ui';

const MONO = Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' });
const Box = ({ children, cap }) => (
  <View style={{ backgroundColor: '#0d1426', borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', padding: 14, marginVertical: 10, alignItems: 'center' }}>
    {children}{cap ? <T s={11} c={C.mute} style={{ marginTop: 10, textAlign: 'center' }}>{cap}</T> : null}
  </View>
);
const useTick = (ms, n) => { const [k, setK] = useState(0); useEffect(() => { const t = setInterval(() => setK((v) => (v + 1) % n), ms); return () => clearInterval(t); }, []); return k; };
const Layer = ({ c, label, children }) => <View style={{ backgroundColor: c, padding: 14, borderWidth: 2, borderColor: 'rgba(0,0,0,0.35)' }}><T px s={7} c="#111" style={{ marginBottom: 4 }}>{label}</T>{children}</View>;
const Node = ({ label, col }) => <View style={{ backgroundColor: col, padding: 10, borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.4)' }}><T px s={7} c="#111">{label}</T></View>;

const KINDS = {
  tree: () => <Box cap="An HTML page is a tree: tags nest inside other tags.">
    {[[0, '<html>'], [1, '<head>'], [2, '<title>'], [1, '<body>'], [2, '<h1>'], [2, '<p>']].map(([d, t], k) => (
      <FadeIn key={k} delay={k * 180} style={{ alignSelf: 'flex-start', marginLeft: d * 22, marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ width: 10, height: 10, backgroundColor: C.lime, marginRight: 8 }} /><Text style={{ fontFamily: MONO, color: '#9bd1ff', fontSize: 14 }}>{t}</Text></View>
      </FadeIn>))}
  </Box>,
  boxmodel: () => <Box cap="Margin → Border → Padding → Content (from outside in).">
    <Pulse to={1.03}><Layer c="#f6b26b" label="MARGIN"><Layer c="#ffe08a" label="BORDER"><Layer c="#a8e06a" label="PADDING"><View style={{ backgroundColor: '#6ab7ff', padding: 12, alignItems: 'center' }}><T px s={8} c="#111">CONTENT</T></View></Layer></Layer></Layer></Pulse>
  </Box>,
  selector: () => <Box cap="A rule = selector + property + value.">
    <Text style={{ fontFamily: MONO, fontSize: 18, lineHeight: 28, color: '#fff' }}><Text style={{ color: '#6ab7ff' }}>h1</Text>{' {\n  '}<Text style={{ color: C.yellow }}>color</Text>{': '}<Text style={{ color: C.lime }}>tomato</Text>{';\n}'}</Text>
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>{[['selector', '#6ab7ff'], ['property', C.yellow], ['value', C.lime]].map(([l, col]) => <Bob key={l} amp={3}><View style={{ backgroundColor: col, paddingHorizontal: 8, paddingVertical: 4 }}><T px s={7} c="#111">{l}</T></View></Bob>)}</View>
  </Box>,
  variable: () => <Box cap="A variable is a labeled chest that holds a value.">
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View style={{ borderWidth: 4, borderColor: '#5a3a14', backgroundColor: '#8b5a2b', padding: 10, width: 110, alignItems: 'center' }}><T px s={8}>age</T><Bob amp={4}><View style={{ backgroundColor: C.yellow, paddingHorizontal: 16, paddingVertical: 8, marginTop: 8 }}><T px s={12} c="#111">12</T></View></Bob></View>
      <Text style={{ fontFamily: MONO, color: '#9bd1ff', fontSize: 16 }}>age = 12</Text>
    </View>
  </Box>,
  table: () => { const k = useTick(900, 3); const rows = [[1, 'Ava', 12], [2, 'Ben', 14], [3, 'Cleo', 11]];
    return <Box cap="Rows light up one by one, like a query reading each record.">
      {[['id', 'name', 'age'], ...rows].map((r, y) => <View key={y} style={{ flexDirection: 'row', backgroundColor: y === 0 ? C.panel : y - 1 === k ? '#0b4a2a' : 'transparent' }}>{r.map((v, x) => <View key={x} style={{ width: 80, padding: 8, borderWidth: 1, borderColor: C.line }}><T s={13} b={y === 0}>{String(v)}</T></View>)}</View>)}
    </Box>; },
  flow: () => { const t = useRef(new Animated.Value(0)).current; useEffect(() => { Animated.loop(Animated.timing(t, { toValue: 1, duration: 2200, easing: Easing.linear, useNativeDriver: true })).start(); }, []);
    return <Box cap="The browser asks, the server answers with a page.">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}><Node label="BROWSER" col="#6ab7ff" />
        <View style={{ width: 90, height: 6, marginHorizontal: 6, backgroundColor: C.panel, justifyContent: 'center' }}><Animated.View style={{ width: 12, height: 12, backgroundColor: C.yellow, transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, 78] }) }] }} /></View>
        <Node label="SERVER" col="#a8e06a" /></View></Box>; },
  loop: () => { const k = useTick(750, 5); return <Box cap="A loop repeats the same steps again and again.">
    <T px s={12} c={C.yellow}>↻ Round {k + 1}</T><View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>{[0, 1, 2, 3, 4].map((n) => <View key={n} style={{ width: 22, height: 22, backgroundColor: n <= k ? C.lime : C.panel }} />)}</View></Box>; },
  flex: () => { const k = useTick(1300, 4); const m = ['flex-start', 'center', 'space-between', 'flex-end'][k];
    return <Box cap={`justify-content: ${m}`}><View style={{ width: 260, flexDirection: 'row', justifyContent: m, backgroundColor: C.panel, padding: 8 }}>{['A', 'B', 'C'].map((l) => <View key={l} style={{ backgroundColor: '#6ab7ff', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}><T px s={10} c="#111">{l}</T></View>)}</View></Box>; },
};

// ---- more diagrams for the new courses ----
const Steps = ({ items, cap }) => {
  const k = useTick(900, items.length);
  return <Box cap={cap}><View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    {items.map((l, i) => <React.Fragment key={l}>
      <View style={{ backgroundColor: i === k ? C.yellow : '#1f2a4a', paddingHorizontal: 10, paddingVertical: 8, marginVertical: 3, borderBottomWidth: 4, borderBottomColor: i === k ? C.yellowD : '#0a0f1f', transform: [{ scale: i === k ? 1.08 : 1 }] }}><T px s={8} c={i === k ? '#111' : '#fff'}>{l}</T></View>
      {i < items.length - 1 ? <T px s={10} c={C.mute}>›</T> : null}</React.Fragment>)}</View></Box>;
};
const Layers = () => { const k = useTick(1000, 3); return <Box cap="Each layer builds on the one below it.">
  {['Applications', 'Operating system', 'Hardware'].map((l, i) => <View key={l} style={{ width: 240, padding: 10, marginBottom: 4, alignItems: 'center', backgroundColor: i === k ? C.yellow : ['#2f6fed', '#6d28d9', '#4b5563'][i] }}><T px s={8} c={i === k ? '#111' : '#fff'}>{l}</T></View>)}</Box>; };
const SearchTree = () => { const k = useTick(700, 8); const rows = [['A'], ['B', 'C'], ['D', 'E', 'F', 'G']]; const order = 'ABCDEFG';
  return <Box cap="Search visits nodes one by one until it finds the goal.">{rows.map((r, y) => <View key={y} style={{ flexDirection: 'row', gap: y === 2 ? 14 : 60, marginBottom: 10 }}>{r.map((n) => <View key={n} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: order.indexOf(n) < k ? C.lime : C.panel, borderWidth: 2, borderColor: '#000' }}><T px s={9} c={order.indexOf(n) < k ? '#111' : '#fff'}>{n}</T></View>)}</View>)}</Box>; };
const BarChart = () => {
  const v = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  useEffect(() => { v.forEach((a, i) => Animated.loop(Animated.sequence([Animated.timing(a, { toValue: 1, duration: 900 + i * 150, useNativeDriver: false }), Animated.timing(a, { toValue: 0.3, duration: 900, useNativeDriver: false })])).start()); }, []);
  const H = [70, 100, 55, 120, 85];
  return <Box cap="Bars make it easy to compare categories."><View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 12 }}>{v.map((a, i) => <Animated.View key={i} style={{ width: 30, backgroundColor: ['#6ab7ff', C.lime, C.yellow, C.pink, '#a66bff'][i], height: a.interpolate({ inputRange: [0, 1], outputRange: [8, H[i]] }) }} />)}</View></Box>;
};
const S = (items, cap) => () => <Steps items={items} cap={cap} />;
const MORE = {
  arch: S(['Browser', 'Web server', 'App logic', 'Database'], 'A request travels to the database and back.'),
  phpflow: S(['HTML form', 'PHP script', 'MySQL', 'Page back'], 'The form data goes through PHP into MySQL.'),
  xampp: S(['Download', 'Install', 'Start Apache', 'Open localhost'], 'Four steps to a local server.'),
  devcycle: S(['Idea', 'Plan', 'Build', 'Test', 'Ship'], 'Projects move through stages, and often loop back.'),
  navstack: S(['Home', 'Details', 'Profile'], 'Screens are pushed on a stack and popped when you go back.'),
  lifecycle: S(['Mount', 'Update', 'Unmount'], 'A component is added, changes, then is removed.'),
  dataloop: S(['Collect', 'Clean', 'Analyze', 'Visualize', 'Decide'], 'Data work is a loop from raw numbers to decisions.'),
  pipeline: S(['Collect', 'Clean', 'Train', 'Test', 'Deploy'], 'A pipeline turns raw data into a working model.'),
  agent: S(['Percept', 'Agent', 'Action'], 'An agent senses, decides and acts, again and again.'),
  gameloop: S(['Input', 'Update', 'Draw'], 'Every game repeats this loop many times a second.'),
  sqlclauses: S(['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'], 'The usual order of clauses in a query.'),
  layers: Layers, search: SearchTree, chart: BarChart,
};
export const Diagram = ({ kind }) => { const K = KINDS[kind] || MORE[kind]; return K ? <K /> : null; };
