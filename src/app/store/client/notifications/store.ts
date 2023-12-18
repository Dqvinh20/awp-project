import { create } from 'zustand';

interface NotificationsState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
