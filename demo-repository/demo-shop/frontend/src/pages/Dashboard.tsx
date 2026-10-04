import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

interface Product {
  id: number;
  name: string;
  price: number;
  inventory: number;
}

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Product[]>("/products")
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>DemoShop Catalog</h1>
      </header>
      {loading ? (
        <p>Loading catalog items...</p>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <div key={item.id} className="product-card">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
              <span>{item.inventory} in stock</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
