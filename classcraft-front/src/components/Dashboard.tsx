import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const userRole = localStorage.getItem("userRole");
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user's session data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDetails");
    // Redirect to login
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Your Dashboard, {userDetails.firstName}!</h1>

      {/* Role-based content */}
      {userRole === "ADMIN" && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>As an Admin, you can manage users, view system data, and more.</p>
          {/* Add more admin-specific features here */}
        </div>
      )}

      {userRole === "STUDENT" && (
        <div>
          <h2>Student Dashboard</h2>
          <p>
            As a Student, you can view your courses, grades, and assignments.
          </p>
          {/* Add more student-specific features here */}
        </div>
      )}

      {/* If the role doesn't match */}
      {!userRole && (
        <div>
          <p>You are not logged in. Please log in again.</p>
        </div>
      )}

      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
