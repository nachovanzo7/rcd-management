import { create } from "zustand";

export const useFormStore = create((set) => ({
  data: {},

  updateData: (pageKey, values) =>
    set((state) => ({
      data: {
        ...state.data,
        [pageKey]: { ...state.data[pageKey], ...values },
      },
    })),

  resetData: () => set({ data: {} }),
}));
