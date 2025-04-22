import { create } from 'zustand';
import { AccountRole } from '@spesia/common';
import { environment } from '@spesia/data-access';

interface User {
    userId: number;
    userEmail: string;
    userRole: string;
    userName: string;
}

interface UserState {
    account: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    logout: () => Promise<void>;
    setTokens: (accessToken: string, refreshToken: string, user: { id: number, email: string, role: AccountRole }) => void;
    isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
    accessToken: localStorage.getItem('spesiaAccessToken') || null,
    refreshToken: localStorage.getItem('spesiaRefreshToken') || null,
    account: localStorage.getItem('spesiaAccount') || null,

    logout: async () => {
        localStorage.removeItem('spesiaAccessToken');
        localStorage.removeItem('spesiaRefreshToken');
        localStorage.removeItem('spesiaAccount');
        set({ account: null, accessToken: null, refreshToken: null });
    },
    setTokens: (accessToken: string, refreshToken: string, user: { id: number, email: string, role: string }) => {
        localStorage.setItem('spesiaAccount', JSON.stringify(user));
        localStorage.setItem('spesiaAccessToken', accessToken);
        localStorage.setItem('spesiaRefreshToken', refreshToken);

        set({ accessToken, refreshToken });
    },
    isAuthenticated: () => !!get().accessToken,}));
