import { create } from "zustand";

import axios from "axios";
import toast from "react-hot-toast";
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
  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
        loading: false,
        error: null,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error, "Error deleting product");
      toast.error("Failed to delete product");
    } finally {
      set({ loading: false });
    }
  },
}));
