// define a state store
import { create } from 'zustand';

// Define the type for the store state
interface DateState {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
}

// Create the store
const useDateStore = create<DateState>((set) => ({
  selectedDate: new Date().toISOString().split('T')[0], // Default to today's date
  //function to update date
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export default useDateStore;