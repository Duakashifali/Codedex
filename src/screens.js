import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TextInput, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F } from './theme';
import { COURSES, CATS, PATHS, chapters, level, rank, matchCourse } from './data';
import { AuthSheet } from './auth';
import { useApp } from './context/AppContext';
import { useCourseProgress } from './hooks';
import { T, Slime, Btn, Ghost, Card, Bar, Bubble, Header, Confetti, Toast, FadeIn, Bob, Pulse, Landscape, Stars } from './ui';
import { Banner, World, Reveal, PhotoBG, PhotoCard, SideCard, Crew } from './scenes';
import { playMusic, stopMusic, playAchievement } from './audio';
const SH = Dimensions.get('window').height;

const Page = ({ app, children, pad = 16 }) => (
  <View style={{ flex: 1, backgroundColor: C.bg }}><Header app={app} /><ScrollView contentContainerStyle={{ padding: pad, paddingBottom: 40 }}>{children}</ScrollView></View>
);
const prog = (store, c) => (store.done[c.id] || []).length / chapters(c)[0].ex.length;

const SegBar = ({ v }) => { const n = Math.round(v * 10); return <View style={{ flexDirection: 'row', gap: 3 }}>{[...Array(10)].map((_, k) => <View key={k} style={{ flex: 1, height: 10, backgroundColor: k < n ? C.lime : C.panel, borderBottomWidth: 3, borderBottomColor: k < n ? C.limeD : '#0a0f1f' }} />)}</View>; };
const CourseCard = ({ c, i = 0 }) => {
  const app = useApp();                       // context: navigation + data, no props needed
  const { done, total } = useCourseProgress(c); // custom hook: progress maths in one place
  const sc = useRef(new Animated.Value(1)).current;
  const dots = c.lvl === 'Beginner' ? 1 : 2;
  const edge = { borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 };
  return (
    <FadeIn delay={i * 90}>
      <Animated.View style={{ transform: [{ scale: sc }], marginBottom: 16 }}>
        <Pressable onPressIn={() => Animated.spring(sc, { toValue: 0.96, useNativeDriver: true }).start()} onPressOut={() => Animated.spring(sc, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
          onPress={() => app.go('course', { cid: c.id })}>
          <View style={[{ backgroundColor: '#0d1426', overflow: 'hidden' }, edge]}>
            <Banner c={c} i={i} />
            <View style={{ padding: 12, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <T px s={8} c={C.mute}>COURSE</T>
                <View style={{ flexDirection: 'row', gap: 3 }}>{[0, 1, 2].map((k) => <View key={k} style={{ width: 10, height: 10, backgroundColor: k < dots ? C.yellow : C.panel, borderWidth: 1, borderColor: '#000' }} />)}</View>
              </View>
              <T px s={13}>{c.name}</T>
              <T s={13} c={C.mute} numberOfLines={2}>{c.d}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <View style={{ backgroundColor: C.panel, paddingHorizontal: 8, paddingVertical: 4, borderBottomWidth: 3, borderBottomColor: '#000' }}><T px s={7} c={C.mute}>{c.lvl.toUpperCase()}</T></View>
                <Pulse to={1.08}><View style={{ backgroundColor: C.lime, borderBottomWidth: 3, borderBottomColor: C.limeD, paddingHorizontal: 10, paddingVertical: 5 }}><T px s={8} c="#111">{done ? 'CONTINUE ▶' : 'START ▶'}</T></View></Pulse>
              </View>
              {done ? <SegBar v={done / total} /> : null}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </FadeIn>
  );
};

const PANEL = { backgroundColor: 'rgba(5,8,22,0.85)', marginHorizontal: 16, marginBottom: 22, padding: 14, borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 };
const Invite = () => {
  const [email, setEmail] = useState(''); const [msg, setMsg] = useState('');
  const send = () => { if (!/^\S+@\S+\.\S+$/.test(email)) { setMsg('Please enter a valid email.'); return; } setMsg('Invite saved 💌 (demo only: no email is actually sent)'); setEmail(''); };
  return <>
    <T px s={15} style={{ textAlign: 'center', marginBottom: 10 }}>Invite a Friend</T>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 140, height: 140 }}><View style={{ marginLeft: -15 }}><Crew kind="invite" scale={0.8} /></View></View>
      <View style={{ flex: 1 }}><T s={13} c="#e8ecf5">Having fun? Share the love with a friend (or two)!</T><T s={13} c={C.mute} style={{ marginTop: 6 }}>Enter an email to save a personal invite.</T></View>
    </View>
    <TextInput value={email} onChangeText={setEmail} placeholder="Your friend's email" placeholderTextColor={C.mute} autoCapitalize="none" keyboardType="email-address"
      style={{ borderColor: C.line, borderWidth: 2, backgroundColor: '#0a1128', color: C.text, padding: 10, fontFamily: F.r, marginTop: 12, marginBottom: 10 }} />
    <Btn label="Send Invite" color={C.lime} dark={C.limeD} tc="#111" onPress={send} />
    {msg ? <T s={12} c={C.mute} style={{ marginTop: 8, textAlign: 'center' }}>{msg}</T> : null}
  </>;
};

// REQUIREMENT 3 (update function): a deeply nested component that READS and CHANGES shared data
// through context. Dash -> Card -> row -> NameEditor, and no props are passed down.
const NameEditor = () => {
  const { store, update } = useApp();
  const [edit, setEdit] = useState(false); const [v, setV] = useState(store.name);
  if (!edit) return <Pressable onPress={() => { setV(store.name); setEdit(true); }}><T b s={16}>{store.name}  ✎</T></Pressable>;
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <TextInput value={v} onChangeText={setV} autoCapitalize="none" autoFocus style={{ borderColor: C.lime, borderWidth: 1, color: C.text, paddingHorizontal: 8, paddingVertical: 2, minWidth: 110, fontFamily: F.r }} />
    <Btn small label="Save" color={C.lime} dark={C.limeD} tc="#111" onPress={() => { update({ name: v.trim() || store.name }); setEdit(false); }} />
  </View>;
};

const Rotator = ({ lines }) => {
  const [k, setK] = useState(0); const o = useRef(new Animated.Value(1)).current;
  useEffect(() => { const t = setInterval(() => { Animated.timing(o, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => { setK((v) => (v + 1) % lines.length); Animated.timing(o, { toValue: 1, duration: 350, useNativeDriver: true }).start(); }); }, 2800); return () => clearInterval(t); }, []);
  return <Animated.View style={{ opacity: o, transform: [{ translateY: o.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}><T px s={10} c={C.yellow} style={{ textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 }}>{lines[k]}</T></Animated.View>;
};

export const Landing = ({ app }) => {
  const y = useRef(new Animated.Value(0)).current;
  const on = app.store.sound !== false;
  useEffect(() => { if (on) playMusic(); else stopMusic(); return () => stopMusic(); }, [on]);
  const panel = { backgroundColor: 'rgba(5,8,22,0.82)', marginHorizontal: 16, marginBottom: 22, padding: 14, borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 };
  const feats = [['Level up your learning', 'Gain XP, keep a streak and collect badges. Every exercise feels like completing a quest.'], ['Practice your coding chops', 'Bite-sized challenges for beginners and advanced learners alike.'],
    ['Build an awesome portfolio', 'Build websites, games and apps from a library of project tutorials.'], ['Join a motivating community', 'Give and get help, join monthly challenges and collaborate.']];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header app={app} />
      <View style={{ flex: 1 }}>
        <World y={y} />
        <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 30 }}>
          <Btn small label={on ? '♪ ON' : '♪ OFF'} color={on ? C.lime : C.card} dark={on ? C.limeD : C.line} tc={on ? '#111' : C.text} onPress={() => app.update({ sound: !on })} />
        </View>
        <Animated.ScrollView scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })} contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={{ height: SH * 0.72, alignItems: 'center', paddingTop: 34, gap: 12 }}>
            <T px s={11} c="#fff">START YOUR</T>
            <Bob amp={8} dur={1100}><T px s={30} c={C.yellow} style={{ textAlign: 'center', textShadowColor: '#a03b00', textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 0 }}>Coding{'\n'}Adventure</T></Bob>
            <T s={14} c="#fff" b style={{ textAlign: 'center', paddingHorizontal: 24, textShadowColor: '#000', textShadowRadius: 4 }}>The most fun and beginner-friendly way to learn to code.</T>
            <Rotator lines={['Mine knowledge.', 'Craft code.', 'Build worlds.', 'Level up every day.']} />
            <Pulse><Btn label="Get started" color={C.yellow} dark={C.yellowD} tc="#111" onPress={() => app.go(app.store.onboarded ? 'dash' : 'signup')} /></Pulse>
            <Bob amp={6} dur={700} style={{ marginTop: 14 }}><T px s={9} c="#fff">SCROLL ▾</T></Bob>
          </View>
          <Reveal y={y}><View style={panel}>
            <T px s={14} style={{ textAlign: 'center', marginBottom: 16 }}>Explore 250+ hours of free interactive coding lessons</T>
            {['python', 'html', 'mobile'].map((id) => COURSES.find((c) => c.id === id)).map((c, i) => <CourseCard i={i} key={c.id} c={c} app={app} store={app.store} />)}
            <Btn label="Explore All Courses  ›" onPress={() => app.go('explore')} />
          </View></Reveal>
          <Reveal y={y}><View style={[panel, { flexDirection: 'row', flexWrap: 'wrap', gap: 14 }]}>
            {[['2.3m+', 'Learners', C.yellow], ['190+', 'Countries', C.lime], ['8m+', 'Exercises done', '#a66bff'], ['170k+', 'Builds', C.pink]].map(([n, l, col]) => <View key={l} style={{ width: '45%' }}><T px s={18} c={col}>{n}</T><T c={C.mute}>{l}</T></View>)}
          </View></Reveal>
          {[[9, 'learn', 'Level up your learning', ['Gain XP, keep a streak and collect badges.', 'Every exercise feels like a quest.']], [7, 'practice', 'Practice your coding chops', ['Warm up with bite-sized challenges.', 'Beginners and experts welcome.']],
            [8, 'build', 'Build an awesome portfolio', ['Websites, games and apps, block by block.', 'Show off what you made.']], [6, 'community', 'Join a motivating community', ['Give and get help from other learners.', 'No one codes alone.']]]
            .map(([im, kind, h, l], k) => <Reveal key={h} y={y}><SideCard idx={im} kind={kind} title={h} lines={l} flip={k % 2} fx={k + 1} /></Reveal>)}
          <Reveal y={y}><View style={[panel, { alignItems: 'center', gap: 14 }]}><T px s={16}>Ready to build?</T><Pulse><Btn label="Start Learning for Free" onPress={() => app.go('signup')} /></Pulse></View></Reveal>
          <Reveal y={y}><View style={PANEL}><Invite /></View></Reveal>
          <Reveal y={y}><T s={12} c="#fff" style={{ textAlign: 'center', textShadowColor: '#000', textShadowRadius: 4 }}>CodeQuest · Made with ♥ for Mobile App Development</T></Reveal>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export const Explore = ({ app }) => {
  const [q, setQ] = useState(''); const [cat, setCat] = useState('Popular');
  const query = q.trim();
  // searching looks through ALL categories (name, description, keywords and lesson titles); chips only filter when the box is empty
  const list = query ? COURSES.filter((c) => matchCourse(c, query)) : COURSES.filter((c) => cat === 'Popular' || c.cat === cat);
  return (
    <Page app={app}>
      <T px s={16} style={{ textAlign: 'center', marginVertical: 14 }}>Explore 250+ hours of free interactive coding lessons</T>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: C.line, borderWidth: 1, borderRadius: 6, marginBottom: 12, paddingRight: 10 }}>
        <TextInput value={q} onChangeText={setQ} placeholder="🔍  Search: python, php, react, sql..." placeholderTextColor={C.mute} autoCapitalize="none" autoCorrect={false}
          style={{ flex: 1, color: C.text, padding: 10, fontFamily: F.r }} />
        {q ? <Pressable onPress={() => setQ('')} hitSlop={10}><T s={18} c={C.mute}>✕</T></Pressable> : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {CATS.map((k) => { const on = !query && cat === k; return <Pressable key={k} onPress={() => { setQ(''); setCat(k); }} style={{ borderColor: on ? C.blue : C.line, backgroundColor: on ? '#0b3a5c' : 'transparent', borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8 }}><T b s={13}>{k}</T></Pressable>; })}
      </ScrollView>
      {query ? <T s={12} c={C.mute} style={{ marginBottom: 10 }}>{list.length} result{list.length === 1 ? '' : 's'} for "{query}" in all categories</T> : null}
      {list.length ? list.map((c, i) => <CourseCard i={i} key={c.id} c={c} />) : <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <T c={C.mute} style={{ textAlign: 'center' }}>No courses found for "{query}".</T><T s={12} c={C.mute} style={{ marginTop: 10 }}>Try one of these:</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>{['python', 'php', 'react', 'sql', 'game', 'ai'].map((w) => <Pressable key={w} onPress={() => setQ(w)} style={{ borderColor: C.blue, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5, margin: 4 }}><T b s={12}>{w}</T></Pressable>)}</View></View>}
    </Page>
  );
};

export const Signup = ({ app }) => {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [prov, setProv] = useState(null);
  const inp = { backgroundColor: '#fff', borderColor: '#9aa5b8', borderWidth: 1, borderRadius: 6, padding: 10, marginTop: 10, fontFamily: F.r, color: '#111' };
  const done = (acct, p) => { setProv(null); app.update({ name: (acct.name || '').split(' ')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'learner', email: acct.email, provider: p }); app.go('onboard'); };
  const Social = ({ p, label, bg, fg, border, mark }) => <Pressable onPress={() => setProv(p)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: bg, borderColor: border, borderWidth: 1, borderRadius: 6, paddingVertical: 12, marginTop: 8, opacity: pressed ? 0.8 : 1 })}>{mark}<T b s={14} c={fg}>{label}</T></Pressable>;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
        <PhotoBG idx={2} dim={0.45} />
        <Bubble text="Create an account to save your progress :)" />
        <View style={{ backgroundColor: '#f4f6fb', borderRadius: 10, padding: 16, marginTop: 10 }}>
          <Social p="google" label="Continue with Google" bg="#fff" fg="#3c4043" border="#dadce0" mark={<T b s={18} c="#4285F4">G</T>} />
          <Social p="github" label="Continue with GitHub" bg="#24292f" fg="#fff" border="#24292f" mark={<View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><T b s={8} c="#24292f">GH</T></View>} />
          <T s={12} c="#667" style={{ textAlign: 'center', marginVertical: 12 }}>─────  or sign up with email  ─────</T>
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={inp} />
          <TextInput value={pw} onChangeText={setPw} placeholder="Password" secureTextEntry style={inp} />
          <Btn label="Sign up for free" style={{ marginTop: 14 }} disabled={!email.includes('@') || pw.length < 4} onPress={() => { app.update({ email, provider: 'email' }); app.go('onboard'); }} />
          <T s={11} c="#667" style={{ marginTop: 10, textAlign: 'center' }}>Demo only: nothing is sent to a server. Data stays on your phone.</T>
        </View>
        <Pressable onPress={() => app.back()} style={{ marginTop: 20 }}><T c={C.mute} style={{ textAlign: 'center' }}>← Back</T></Pressable>
      </View>
      <AuthSheet provider={prov} onClose={() => setProv(null)} onDone={(a) => done(a, prov)} />
    </View>
  );
};

export const Onboard = ({ app }) => {
  const [step, setStep] = useState(0); const [name, setName] = useState(app.store.name || ''); const [exp, setExp] = useState(null); const [int, setInt] = useState(null);
  const opts = [['Beginner', "I've never coded before / I know some basics."], ['Intermediate', 'I have some knowledge and may have built a project or two.'], ['Advanced', "I'm very comfortable coding and have built multiple projects."]];
  const ints = ['Programming fundamentals', 'Building websites or webapps', 'Mobile app development', 'Analyzing data', 'Artificial Intelligence', 'Computer Science', 'Game development'];
  const finish = (P) => { app.update({ name: name || 'learner', onboarded: true, interest: int, last: P && P.ids ? P.ids[0] : null }); app.reset('dash'); };
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 18, paddingTop: 50 }}>
      <PhotoBG idx={3} dim={0.62} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><View style={{ flex: 1 }}><Bar v={(step + 1) / 4} /></View><Pressable onPress={finish}><T c={C.mute} s={13}>Skip</T></Pressable></View>
      {step === 0 && <><Bubble text="Looking good! What should I call you?" />
        <TextInput value={name} onChangeText={setName} placeholder="username" placeholderTextColor={C.mute} autoCapitalize="none" style={{ borderColor: name ? C.lime : C.line, borderWidth: 1, borderRadius: 6, color: C.text, padding: 12, fontFamily: F.r, marginBottom: 14 }} />
        <Btn label="Continue" onPress={() => setStep(1)} /><Ghost label="I'll decide later" style={{ marginTop: 10 }} onPress={() => setStep(1)} /></>}
      {step === 1 && <><Bubble text="What's your experience with coding?" />
        {opts.map(([t, d]) => <Pressable key={t} onPress={() => setExp(t)}><Card style={{ marginBottom: 10, borderColor: exp === t ? C.blue : C.line }}><T b>{t}</T><T s={12} c={C.mute}>{d}</T></Card></Pressable>)}
        <Btn label="Continue" disabled={!exp} onPress={() => setStep(2)} /></>}
      {step === 2 && <><Bubble text="What are you most interested in?" />
        {ints.map((t) => <Pressable key={t} onPress={() => setInt(t)}><Card style={{ marginBottom: 8, padding: 12, borderColor: int === t ? C.blue : C.line }}><T b s={13}>{t}</T></Card></Pressable>)}
        <Btn label="Continue" disabled={!int} onPress={() => setStep(3)} /></>}
      {step === 3 && (() => { const P = PATHS[int] || PATHS['Something else']; return <ScrollView showsVerticalScrollIndicator={false}>
        <Bubble text="Here's what I found just for you!" />
        <T px s={9} c={C.mute} style={{ textAlign: 'center' }}>RECOMMENDED JOURNEY ✨</T>
        <Bob amp={4}><T px s={18} style={{ textAlign: 'center', marginVertical: 10 }}>{P.title}</T></Bob>
        <T c={C.mute} style={{ textAlign: 'center', marginBottom: 12 }}>{P.sub}</T>
        <FadeIn delay={100}><Card style={{ marginBottom: 14 }}><T px s={10} style={{ marginBottom: 8 }}>What you'll learn</T>{P.out.map((o) => <T key={o} s={13} style={{ marginTop: 6 }}>✔ {o}</T>)}</Card></FadeIn>
        {P.ids.map((id, k) => <CourseCard key={id} i={k + 1} c={COURSES.find((x) => x.id === id)} app={app} store={app.store} />)}
        <Btn label="Start Learning" onPress={() => finish(P)} style={{ marginBottom: 30 }} /></ScrollView>; })()}
    </View>
  );
};

export const Dash = ({ app }) => {
  const { store } = app; const c = COURSES.find((k) => k.id === store.last) || COURSES.find((k) => k.id === 'html'); const started = COURSES.filter((k) => store.done[k.id]);
  return (
    <Page app={app}>
      <View style={{ height: 150, marginBottom: 14, overflow: 'hidden', justifyContent: 'flex-end', padding: 12, borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 }}>
        <PhotoBG idx={1} dim={0.25} />
        <T px s={11} style={{ textShadowColor: '#000', textShadowRadius: 4 }}>Welcome back,</T>
        <T px s={15} c={C.yellow} style={{ marginTop: 6, textShadowColor: '#000', textShadowRadius: 4 }}>@{store.name}</T>
      </View>
      <Card style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><Slime px={6} /><View><NameEditor /><T s={12} c={C.mute}>Level {level(store.xp)}</T></View></View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
          {[['✦', store.xp, 'Total XP'], ['♦', rank(store.xp), 'Rank'], ['●', store.badges.length, 'Badges'], ['▲', store.streak, 'Day streak']].map(([i, v, l]) => (
            <View key={l} style={{ width: '46%' }}><T b>{i} {v}</T><T s={12} c={C.mute}>{l}</T></View>))}
        </View>
      </Card>
      <T px s={12} style={{ marginVertical: 10 }}>Jump back in</T>
      <LinearGradient colors={c.g} style={{ borderRadius: 8, padding: 16, borderColor: C.line, borderWidth: 1 }}>
        <Bar v={prog(store, c)} /><T px s={8} c="#fff" style={{ marginTop: 14 }}>COURSE</T><T px s={16} c="#fff" style={{ marginVertical: 6 }}>{c.name}</T>
        <Btn label="Continue Learning" onPress={() => app.go('course', { cid: c.id })} style={{ alignSelf: 'flex-start' }} />
      </LinearGradient>
      {store.interest && PATHS[store.interest] ? <FadeIn><Card style={{ marginTop: 16 }}><T px s={8} c={C.mute}>RECOMMENDED FOR YOU</T><T px s={13} style={{ marginVertical: 8 }}>{PATHS[store.interest].title}</T>
        {PATHS[store.interest].out.map((o) => <T key={o} s={13} c={C.mute} style={{ marginTop: 4 }}>✔ {o}</T>)}</Card></FadeIn> : null}
      {store.interest && PATHS[store.interest] ? PATHS[store.interest].ids.map((id, k) => <View key={id} style={{ marginTop: 12 }}><CourseCard i={k} c={COURSES.find((x) => x.id === id)} app={app} store={store} /></View>) : null}
      <T px s={12} style={{ marginVertical: 16 }}>Continue progress</T>
      {started.length ? started.map((k, i) => <CourseCard i={i} key={k.id} c={k} app={app} store={store} />) : <T c={C.mute}>Nothing started yet.</T>}
      <T px s={12} style={{ marginVertical: 14 }}>Explore more</T>
      <Card><T b>Monthly Challenge</T><T s={12} c={C.mute} style={{ marginVertical: 6 }}>Build something small and share it with the community.</T><Ghost small label="Join the challenge" onPress={() => {}} /></Card>
      <Btn label="Explore All Courses" style={{ marginTop: 18 }} onPress={() => app.go('explore')} />
      <View style={[PANEL, { marginHorizontal: 0, marginTop: 18 }]}><Invite /></View>
      <Ghost label="Reset progress" style={{ marginTop: 12 }} onPress={() => app.reset_all()} />
    </Page>
  );
};

export const Course = ({ app, cid }) => {
  const { store } = app; const c = COURSES.find((k) => k.id === cid); const ch = chapters(c)[0];
  const { doneList: done, xpGot, xpTotal: xpTot } = useCourseProgress(c); // same custom hook reused
  return (
    <Page app={app}>
      <T px s={18} style={{ marginBottom: 12 }}>{c.name}</T>
      <Card style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><View style={{ width: 28, height: 28, borderRadius: 14, borderColor: C.lime, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}><T b s={13}>1</T></View><T b s={16}>{ch.title}</T></View>
        {ch.ex.map((e, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 }}>
            <T s={12} c={C.mute} style={{ width: 70 }}>Exercise {i + 1}</T><T b s={13} style={{ flex: 1 }}>{e.title}</T>
            {done.includes(i) ? <Ghost small label="Done!" onPress={() => app.go('lesson', { cid, i })} /> : <Btn small color={C.yellow} dark={C.yellowD} tc="#111" label={`+${e.xp}XP`} onPress={() => app.go('lesson', { cid, i })} />}
          </View>))}
      </Card>
      <Card style={{ marginTop: 6 }}><T b>Course Progress</T><T s={12} c={C.mute} style={{ marginTop: 8 }}>Exercises {done.length} / {ch.ex.length}</T><Bar v={done.length / ch.ex.length} color={C.yellow} />
        <T s={12} c={C.mute} style={{ marginTop: 8 }}>XP Earned {xpGot} / {xpTot}</T><Bar v={xpGot / xpTot} color={C.yellow} /></Card>
      <Card style={{ marginTop: 12 }}><T b>Course Badges</T><T s={12} c={C.mute}>Complete a chapter to earn a badge.</T><T s={22} style={{ marginTop: 6 }}>{store.badges.includes(cid) ? '🏅' : '▢'}</T></Card>
    </Page>
  );
};

export { Lesson } from './lesson';

export const Chapter = ({ app, cid }) => {
  const { store } = app; const c = COURSES.find((k) => k.id === cid); const ex = chapters(c)[0].ex; const earned = ex.reduce((a, e) => a + e.xp, 0);
  const [badge, setBadge] = useState(false); const [fx, setFx] = useState(true);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 20, paddingTop: 60, alignItems: 'center' }}>
      {!badge ? <>
        <T px s={20} style={{ textAlign: 'center' }}>Chapter 1 complete!</T>
        <T c={C.mute} style={{ textAlign: 'center', marginVertical: 16 }}>Woohoo! You just wrapped up your very first chapter of {c.name}. This is a HUGE first step!</T>
        <Slime px={9} />
        <View style={{ flexDirection: 'row', gap: 8, marginVertical: 30 }}>
          {[['✦ ' + earned + ' XP', 'EARNED IN CHAPTER'], ['✦ ' + store.xp + ' XP', 'TOTAL EARNED'], ['♦ Level ' + level(store.xp), 'CURRENT LEVEL']].map(([a, b]) => <Card key={b} style={{ flex: 1, padding: 8 }}><T px s={9}>{a}</T><T s={9} c={C.mute} style={{ marginTop: 6 }}>{b}</T></Card>)}
        </View>
        <Btn label="Continue" onPress={() => { app.award(cid); setBadge(true); setFx(true); if (app.store.sound !== false) playAchievement(); }} style={{ width: 220 }} />
      </> : <>
        <T px s={18} style={{ textAlign: 'center', marginBottom: 24 }}>You earned a new badge!</T>
        <FadeIn><Pulse to={1.06}><Card style={{ width: 260, flexDirection: 'row', alignItems: 'center', gap: 12 }}><T s={34}>🏅</T><View><T px s={7} c={C.mute}>CHAPTER 1</T><T px s={11} style={{ marginTop: 6 }}>The World of {c.name}</T></View></Card></Pulse></FadeIn>
        <Btn label="Continue" onPress={() => app.reset('course', { cid })} style={{ width: 220, marginTop: 30 }} />
      </>}
      {fx && <Confetti onEnd={() => setFx(false)} />}
    </View>
  );
};
