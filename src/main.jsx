import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PortfolioSkeleton from "./Portfolio.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PortfolioSkeleton />
  </StrictMode>
);
