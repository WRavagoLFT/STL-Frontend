import { create } from 'zustand';

export type gameType = 
  | 'Dashboard' 
  | 'STL Pares' 
  | 'STL Swer2'
  | 'STL Swer3'
  | 'STL Swer4';

interface SideBarStore {
  SideBarActiveGameType: gameType; // use gameType type for strict typing
  setSideBarActiveGameType: (gameType: gameType) => void;
  reset: () => void;
}

export const useSideBarStore = create<SideBarStore>((set) => ({
  SideBarActiveGameType: 'Dashboard', // default value

  setSideBarActiveGameType: (gameType) => set({ SideBarActiveGameType: gameType }),

  reset: () => set({ SideBarActiveGameType: 'Dashboard' }),
}));
