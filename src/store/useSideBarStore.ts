import { create } from 'zustand';

export type gameType = 
  'Dashboard' | 
  'STL Pares' | 
  'STL Swer2' |
  'STL Swer3' |
  'STL Swer4' ;

interface SideBarStore {
  SideBarActiveGameType: string;
  setSideBarActiveGameType: (gameType: gameType)=> void;
}

export const useSideBarStore = create<SideBarStore>((set) => ({
  SideBarActiveGameType: '',
  setSideBarActiveGameType: (gameType) => set({ SideBarActiveGameType: gameType }), // Use `set` to update the state
}));