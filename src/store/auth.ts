import { atom } from "jotai";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const getInitialAuthState = (): AuthState => {
  const savedUser = localStorage.getItem('user');
  return {
    isAuthenticated: !!savedUser,
    user: savedUser ? JSON.parse(savedUser) : null,
    isLoading: false,
  };
};

export const authAtom = atom<AuthState>(getInitialAuthState());

// Login action
export const loginAtom = atom(null, async (_, set, credentials: { email: string; password: string }) => {
  set(authAtom, prev => ({ ...prev, isLoading: true }));
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const user: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    set(authAtom, {
      isAuthenticated: true,
      user,
      isLoading: false,
    });
    
    return { success: true };
  } catch (error) {
    set(authAtom, prev => ({ ...prev, isLoading: false }));
    return { success: false, error: 'Invalid credentials' };
  }
});

// Logout action
export const logoutAtom = atom(null, (_, set) => {
  localStorage.removeItem('user');
  set(authAtom, {
    isAuthenticated: false,
    user: null,
    isLoading: false,
  });
});