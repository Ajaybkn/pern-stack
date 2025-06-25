import { create } from "zustand";

import axios from "axios";
const BASE_URL = "http://localhost:3000";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      console.log(`${BASE_URL}/api/products`, "skdlfmkl");
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.status == 429)
        set({ error: "Rate limit exceeded", products: [] });
      else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
