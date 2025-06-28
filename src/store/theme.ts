import { atom } from "jotai";

export type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme) return savedTheme;
  
  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const themeAtom = atom<Theme>(getInitialTheme());

// Action atom to toggle theme
export const toggleThemeAtom = atom(null, (get, set) => {
  const currentTheme = get(themeAtom);
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  set(themeAtom, newTheme);
  
  // Apply theme to document
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
});