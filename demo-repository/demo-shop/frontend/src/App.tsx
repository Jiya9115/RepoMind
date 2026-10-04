import React from "react";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Checkout } from "./pages/Checkout";

export const App: React.FC = () => {
  return (
    <div className="app-main">
      <nav className="navbar">
        <span>DemoShop Navigation</span>
      </nav>
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
