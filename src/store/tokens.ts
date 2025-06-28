import { atom } from "jotai";

// Get initial token from environment variables, fallback to localStorage for development
const getInitialToken = (): string | null => {
  // First try environment variable
  const envToken = import.meta.env.VITE_TAVUS_API_KEY;
  if (envToken && envToken !== 'your_tavus_api_key_here') {
    return envToken;
  }
  
  // Fallback to localStorage for development
  const savedToken = localStorage.getItem('tavus-token');
  return savedToken || null;
};

// Atom to store the API token
export const apiTokenAtom = atom<string | null>(getInitialToken());

// Atom to track if token is being validated
export const isValidatingTokenAtom = atom(false);

// Derived atom to check if token exists
export const hasTokenAtom = atom((get) => get(apiTokenAtom) !== null);

// Action atom to set token
export const setApiTokenAtom = atom(null, (_, set, token: string) => {
  localStorage.setItem('tavus-token', token);
  set(apiTokenAtom, token);
});

// Action atom to clear token
export const clearApiTokenAtom = atom(null, (_, set) => {
  localStorage.removeItem('tavus-token');
  set(apiTokenAtom, null);
});