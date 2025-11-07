import { useContext } from "react";
import PlanningContext  from "../context/PlanningContext";

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning must be used within a PlanningProvider");
  }
  return context;
};