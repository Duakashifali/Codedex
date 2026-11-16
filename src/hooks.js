// ============================================================
// REQUIREMENT 4: custom hooks (names start with "use")
// A custom hook is a normal function that uses React hooks inside it, so
// stateful logic can be written ONCE and reused in many components.
// ============================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from './context/AppContext';
import { chapters } from './data';

// useStoredState(key, initial): like useState, but it loads from and saves to the phone's storage.
// Encapsulates: loading on start, merging with defaults, saving after every change, "ready" flag.
// Used in App.js to keep XP, name, badges and progress after the app restarts.
export const useStoredState = (key, initial) => {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => { if (raw) setValue({ ...initial, ...JSON.parse(raw) }); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [key]);
  const save = useCallback((next) => {
    setValue(next);
    AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
  }, [key]);
  return [value, save, ready];
};

// useCourseProgress(course): everything about how far the learner is in one course.
// Encapsulates the repeated maths (exercises done, total, percentage, XP earned vs available).
// Used in every CourseCard and in the Course screen, so the calculation lives in ONE place.
export const useCourseProgress = (course) => {
  const { store } = useApp(); // reads the shared data through context
  return useMemo(() => {
    const ex = chapters(course)[0].ex;
    const doneList = store.done[course.id] || [];
    const xpTotal = ex.reduce((a, e) => a + e.xp, 0);
    const xpGot = ex.reduce((a, e, i) => a + (doneList.includes(i) ? e.xp : 0), 0);
    return { doneList, done: doneList.length, total: ex.length, pct: doneList.length / ex.length, xpGot, xpTotal, isDone: (i) => doneList.includes(i) };
  }, [store.done, course.id]);
};
