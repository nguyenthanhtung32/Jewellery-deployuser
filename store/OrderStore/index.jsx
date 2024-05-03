import { create } from "zustand";

const useOrderStore = create((set) => ({
  orderDetails: [],
  setOrderDetails: (details) => set({ orderDetails: details }),
}));

export default useOrderStore;
