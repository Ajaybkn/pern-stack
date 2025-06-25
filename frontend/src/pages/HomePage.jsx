import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";

const HomePage = () => {
  const { products, loading, error, fetchProducts } = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  console.log(products, "kdfmk");
  return <div>HomePage</div>;
};

export default HomePage;
