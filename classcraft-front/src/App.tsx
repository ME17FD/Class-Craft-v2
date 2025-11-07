import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginFrom";
import ProtectedRoute from "./components/ProtectedRoute";
import PlanningDashboard from "./components/PlanningDashboard/PlanningDashboard";
import PedagogicalDashboard from "./components/PedagogicalDashboard";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard/ProfessorDashboard";
import ApprovalManager from "./components/ApprovalManager";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        {/* Protected for STUDENT */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute Component={StudentDashboard} role="STUDENT" />
          }
        />

        {/* Protected for ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute Component={PedagogicalDashboard} role="ADMIN" />
          }
        />
        <Route
          path="/planning-dashboard"
          element={
            <ProtectedRoute Component={PlanningDashboard} role="ADMIN" />
          }
        />
        <Route
          path="/approval-dashboard"
          element={<ProtectedRoute Component={ApprovalManager} role="ADMIN" />}
        />

        {/* Protected for PROFESSOR */}
        <Route
          path="/professor-dashboard"
          element={
            <ProtectedRoute Component={ProfessorDashboard} role="PROFESSOR" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
