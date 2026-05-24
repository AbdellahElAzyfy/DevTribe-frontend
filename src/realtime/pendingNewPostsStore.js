import { useSyncExternalStore } from "react";

const pending = new Map();
const listeners = new Map();

function getListeners(key) {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  return listeners.get(key);
}

function notify(key) {
  const set = listeners.get(key);
  if (!set) return;
  set.forEach((listener) => listener());
}

function keyOf(listKey) {
  return JSON.stringify(listKey);
}

export function addPending(listKey, postId) {
  const key = keyOf(listKey);
  const set = pending.get(key) ?? new Set();
  set.add(String(postId));
  pending.set(key, set);
  notify(key);
}

export function clearPending(listKey) {
  const key = keyOf(listKey);
  if (!pending.has(key)) return;
  pending.delete(key);
  notify(key);
}

export function getPendingCount(listKey) {
  const key = keyOf(listKey);
  return pending.get(key)?.size ?? 0;
}

function subscribe(key) {
  return (listener) => {
    const set = getListeners(key);
    set.add(listener);
    return () => set.delete(listener);
  };
}

export function usePendingCount(listKey) {
  const key = keyOf(listKey);
  return useSyncExternalStore(
    subscribe(key),
    () => pending.get(key)?.size ?? 0,
    () => 0,
  );
}
