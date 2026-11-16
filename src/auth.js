// Demo social sign-in. It looks and flows like a real OAuth sheet (account chooser -> consent -> signed in),
// but no real Google/GitHub account is contacted. To make it real, replace `finish` with expo-auth-session
// (needs your own Google / GitHub OAuth client IDs) and keep the same onDone(profile) callback.
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { F } from './theme';

const ACCOUNTS = [{ name: 'Alex Carter', email: 'alex.carter@gmail.com', c: '#7c4dff' }, { name: 'Sam Rivera', email: 'sam.rivera@gmail.com', c: '#00897b' }];
const nameFrom = (e) => e.split('@')[0].split(/[._-]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') || 'Learner';
const Txt = ({ s = 14, c = '#202124', b, style, ...p }) => <Text {...p} style={[{ fontSize: s, color: c, fontFamily: b ? F.b : F.r }, style]} />;
const Avatar = ({ n, c }) => <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c, alignItems: 'center', justifyContent: 'center' }}><Txt b c="#fff" s={16}>{n[0]}</Txt></View>;
const Spinner = ({ dark, label }) => <View style={{ alignItems: 'center', paddingVertical: 50 }}><ActivityIndicator size="large" color={dark ? '#58a6ff' : '#1a73e8'} /><Txt c={dark ? '#e6edf3' : '#5f6368'} style={{ marginTop: 14 }}>{label}</Txt></View>;

export const AuthSheet = ({ provider, onClose, onDone }) => {
  const [step, setStep] = useState('pick'); const [a, setA] = useState(''); const [b, setB] = useState(''); const [acct, setAcct] = useState(null);
  useEffect(() => { setStep(provider === 'github' ? 'login' : 'pick'); setA(''); setB(''); setAcct(null); }, [provider]);
  useEffect(() => { if (step === 'wait') { const t = setTimeout(() => onDone(acct), 1300); return () => clearTimeout(t); } }, [step]);
  const gh = provider === 'github';
  const bg = gh ? '#0d1117' : '#ffffff'; const fg = gh ? '#e6edf3' : '#202124'; const mute = gh ? '#8b949e' : '#5f6368'; const line = gh ? '#30363d' : '#dadce0';
  const input = { borderWidth: 1, borderColor: line, borderRadius: 6, padding: 10, color: fg, fontFamily: F.r, marginTop: 6, backgroundColor: gh ? '#0d1117' : '#fff' };
  const Btn = ({ label, onPress, disabled, color }) => <Pressable disabled={disabled} onPress={onPress} style={{ backgroundColor: color, opacity: disabled ? 0.5 : 1, borderRadius: gh ? 6 : 20, paddingVertical: 11, alignItems: 'center', marginTop: 14 }}><Txt b c="#fff">{label}</Txt></Pressable>;
  const ghMark = <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#e6edf3', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}><Txt b s={15} c="#0d1117">GH</Txt></View>;
  const gMark = <Txt b s={30} c="#4285F4" style={{ textAlign: 'center' }}>G</Txt>;
  return (
    <Modal visible={!!provider} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: bg, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, maxHeight: '92%' }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Pressable onPress={onClose} style={{ position: 'absolute', right: 0, top: 0, zIndex: 5, padding: 6 }}><Txt s={20} c={mute}>✕</Txt></Pressable>
            {gh ? ghMark : gMark}
            {step === 'wait' ? <Spinner dark={gh} label={gh ? 'Authorizing CodeQuest…' : 'Signing you in…'} /> : null}

            {!gh && step === 'pick' && <>
              <Txt s={22} style={{ textAlign: 'center', marginTop: 8 }}>Choose an account</Txt>
              <Txt c={mute} style={{ textAlign: 'center', marginBottom: 14 }}>to continue to CodeQuest</Txt>
              {ACCOUNTS.map((x) => <Pressable key={x.email} onPress={() => { setAcct(x); setStep('consent'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderColor: line }}><Avatar n={x.name} c={x.c} /><View><Txt b>{x.name}</Txt><Txt s={13} c={mute}>{x.email}</Txt></View></Pressable>)}
              <Pressable onPress={() => setStep('other')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: line }}><View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: line, alignItems: 'center', justifyContent: 'center' }}><Txt s={18} c={mute}>👤</Txt></View><Txt b>Use another account</Txt></Pressable>
              <Txt s={11} c={mute} style={{ marginTop: 14, textAlign: 'center' }}>Demo sign-in: no real Google account is contacted.</Txt>
            </>}
            {!gh && step === 'other' && <>
              <Txt s={22} style={{ textAlign: 'center', marginTop: 8 }}>Sign in</Txt>
              <Txt c={mute} style={{ textAlign: 'center' }}>to continue to CodeQuest</Txt>
              <TextInput value={a} onChangeText={setA} placeholder="Email" placeholderTextColor={mute} autoCapitalize="none" keyboardType="email-address" style={[input, { marginTop: 18 }]} />
              <Btn label="Next" color="#1a73e8" disabled={!/^\S+@\S+\.\S+$/.test(a)} onPress={() => { setAcct({ name: nameFrom(a), email: a, c: '#1a73e8' }); setStep('consent'); }} />
              <Pressable onPress={() => setStep('pick')}><Txt c="#1a73e8" style={{ textAlign: 'center', marginTop: 14 }}>← Back to accounts</Txt></Pressable>
            </>}
            {!gh && step === 'consent' && acct && <>
              <Txt s={20} style={{ textAlign: 'center', marginTop: 8 }}>CodeQuest wants to access your Google Account</Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14, padding: 10, borderWidth: 1, borderColor: line, borderRadius: 24 }}><Avatar n={acct.name} c={acct.c} /><Txt s={13}>{acct.email}</Txt></View>
              <Txt c={mute} s={13}>This will allow CodeQuest to:</Txt>
              {['See your name and profile picture', 'See your email address'].map((t) => <Txt key={t} s={14} style={{ marginTop: 8 }}>✓  {t}</Txt>)}
              <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Pressable onPress={onClose} style={{ borderWidth: 1, borderColor: line, borderRadius: 20, paddingVertical: 11, alignItems: 'center', marginTop: 14 }}><Txt b c="#1a73e8">Cancel</Txt></Pressable></View>
                <View style={{ flex: 1 }}><Btn label="Continue" color="#1a73e8" onPress={() => setStep('wait')} /></View></View>
            </>}

            {gh && step === 'login' && <>
              <Txt s={22} c={fg} style={{ textAlign: 'center', marginTop: 10 }}>Sign in to GitHub</Txt>
              <Txt c={mute} style={{ textAlign: 'center', marginBottom: 16 }}>to continue to CodeQuest</Txt>
              <Txt b c={fg} s={13}>Username or email address</Txt><TextInput value={a} onChangeText={setA} autoCapitalize="none" style={input} />
              <Txt b c={fg} s={13} style={{ marginTop: 12 }}>Password</Txt><TextInput value={b} onChangeText={setB} secureTextEntry style={input} />
              <Btn label="Sign in" color="#238636" disabled={!a.trim() || b.length < 4} onPress={() => { setAcct({ name: a.trim().split('@')[0], email: a.includes('@') ? a.trim() : a.trim() + '@users.noreply.github.com' }); setStep('consent'); }} />
              <Txt s={11} c={mute} style={{ marginTop: 14, textAlign: 'center' }}>Demo sign-in: no real GitHub account is contacted.</Txt>
            </>}
            {gh && step === 'consent' && acct && <>
              <Txt s={20} c={fg} style={{ textAlign: 'center', marginTop: 10 }}>Authorize CodeQuest</Txt>
              <Txt c={mute} style={{ textAlign: 'center', marginBottom: 12 }}>CodeQuest by Mobile App Development project would like to access your account <Txt b c={fg}>@{acct.name}</Txt></Txt>
              <View style={{ borderWidth: 1, borderColor: line, borderRadius: 6, padding: 12 }}><Txt b c={fg}>Personal user data</Txt><Txt c={mute} s={13} style={{ marginTop: 4 }}>Public profile and email address (read-only)</Txt></View>
              <Btn label="Authorize CodeQuest" color="#238636" onPress={() => setStep('wait')} />
              <Pressable onPress={onClose}><Txt c="#58a6ff" style={{ textAlign: 'center', marginTop: 14 }}>Cancel</Txt></Pressable>
            </>}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
