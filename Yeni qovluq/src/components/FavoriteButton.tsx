"use client";

import { useCallback, useSyncExternalStore } from "react";

// Sevimlilər siyahısı hesab/giriş tələb etmədən, brauzerin localStorage-ində
// saxlanılır. useSyncExternalStore ilə oxunur — bu, xarici (React-dən kənar)
// vəziyyətə (localStorage) abunə olmaq üçün React-ın tövsiyə etdiyi üsuldur
// və server/client hidratasiya uyğunsuzluğu yaratmır.
const STORAGE_KEY = "masinbazasi:sevimlilər";
const EVENT_NAME = "masinbazasi:favorites-changed";

function parseIds(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export function readFavoriteIds(): number[] {
  if (typeof window === "undefined") return [];
  return parseIds(window.localStorage.getItem(STORAGE_KEY));
}

function writeFavoriteIds(ids: number[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // localStorage əlçatan deyilsə (məs. məxfi baxış rejimi) səssizcə keç.
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

export function useFavoriteIds(): number[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return parseIds(raw);
}

export function FavoriteButton({ listingId }: { listingId: number }) {
  const favoriteIds = useFavoriteIds();
  const isFavorite = favoriteIds.includes(listingId);

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const current = readFavoriteIds();
      const next = current.includes(listingId)
        ? current.filter((id) => id !== listingId)
        : [...current, listingId];
      writeFavoriteIds(next);
    },
    [listingId]
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Sevimlilərdən çıxar" : "Sevimlilərə əlavə et"}
      className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition ${
        isFavorite ? "bg-rose-500 text-white" : "bg-white/90 text-slate-500 hover:text-rose-500"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} aria-hidden>
        <path
          d="M12 20.5s-7.5-4.6-10-9.3C.5 8 1.8 4.5 5 3.4c2.2-.8 4.5.1 6 2 1.5-1.9 3.8-2.8 6-2 3.2 1.1 4.5 4.6 3 7.8-2.5 4.7-10 9.3-10 9.3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
