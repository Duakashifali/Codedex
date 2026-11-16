import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
// Background loop is used on the landing screen only. The achievement jingle plays when a badge is earned.
let bg = null, win = null;
const init = () => {
  if (bg) return;
  try { setAudioModeAsync({ playsInSilentMode: true }); } catch (e) {}
  bg = createAudioPlayer(require('../assets/audio/bgm.wav')); bg.loop = true; bg.volume = 0.45;
  win = createAudioPlayer(require('../assets/audio/achievement.wav')); win.volume = 0.9;
};
export const playMusic = () => { try { init(); bg.play(); } catch (e) {} };
export const stopMusic = () => { try { if (bg) bg.pause(); } catch (e) {} };
export const playAchievement = () => { try { init(); win.seekTo(0); win.play(); } catch (e) {} };
