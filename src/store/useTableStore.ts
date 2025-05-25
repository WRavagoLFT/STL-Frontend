import { create } from 'zustand';
import { Operator } from '~/types/types';

interface SortConfig<T> {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableStoreState<T = any> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isFilterActive: boolean;
  setIsFilterActive: (val: boolean) => void;
  toggleFilter: () => void;

  page: number;
  setPage: (page: number) => void;

  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;

  modalOpen: boolean;
  setModalOpen: (val: boolean) => void;
  
  modalType: 'create' | 'view' | null;
  setModalType: (type: 'create' | 'view' | null) => void;

  sortConfig: SortConfig<T>;
  setSortConfig: (config: SortConfig<T>) => void;

  operatorMap: { [key: number]: Operator };
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;

  filters: { [key: string]: string };
  setFilters: (
    filters: { [key: string]: string } | ((prevFilters: { [key: string]: string }) => { [key: string]: string })
  ) => void;

  handleFilterChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;

  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortWrapper: (key: string) => void;

  // Action menu state
  anchorEl: HTMLElement | null;
  selectedRow: T | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  setSelectedRow: (row: T | null) => void;
  resetMenu: () => void;
}

const useDetailTableStore = create<TableStoreState>((set, get) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  isFilterActive: false,
  setIsFilterActive: (val) => set({ isFilterActive: val }),
  toggleFilter: () => set((state) => ({ isFilterActive: !state.isFilterActive })),

  page: 0,
  setPage: (page) => set({ page }),
  modalOpen: false,
  setModalOpen: (val) => set({ modalOpen: val }),

  modalType: null,
  setModalType: (type) => set({ modalType: type }),

  rowsPerPage: 10,
  setRowsPerPage: (rows) => set({ rowsPerPage: rows }),

  sortConfig: { key: '', direction: 'asc' },
  setSortConfig: (config) => set({ sortConfig: config }),

  filters: {},
  setFilters: (newFilters) =>
    set((state) => ({
      filters: typeof newFilters === 'function' ? newFilters(state.filters) : newFilters,
    })),

  handleFilterChange: (key) => (e) => {
    const value = e.target.value;
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 0,
    }));
  },

  handleSearchChange: (e) => {
    set({ searchQuery: e.target.value, page: 0 });
  },

  handleChangePage: (event, newPage) => {
    set({ page: newPage });
  },

  operatorMap: {},
  setOperatorMap: (operatorMap) => set({ operatorMap }),

  handleChangeRowsPerPage: (event) => {
    const newRows = parseInt(event.target.value, 10);
    set({ rowsPerPage: newRows, page: 0 });
  },

  onSortWrapper: (key: string) => {
    const { sortConfig } = get();
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    set({ sortConfig: { key, direction } });
  },

  // Action menu state
  anchorEl: null,
  selectedRow: null,
  setAnchorEl: (el) => set({ anchorEl: el }),
  setSelectedRow: (row) => set({ selectedRow: row }),
  resetMenu: () => set({ anchorEl: null, selectedRow: null }),
}));

export default useDetailTableStore;
