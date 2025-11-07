import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import ProfessorSessions from "./ProfessorSessions";
import ProfessorGroups from "./ProfessorGroups";
import styles from "../../styles/ProfessorDashboard.module.css";
import { FiLogOut } from "react-icons/fi";
import { PlanningProvider } from "../../context/PlanningContext";
import { useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const { professors = [], seances = [] } = useApiData();
  const [activeTab, setActiveTab] = useState<"schedule" | "groups">("schedule");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  const currentProfessor =
    professors.find(
      (p) => p.id === userData.id || p.email === userData.email
    ) || userData;

  return (
    <PlanningProvider>
      <div className={styles.dashboardContainer}>
        {/* Déconnexion */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut className={styles.logoutIcon} size={22} />
        </button>

        {/* Titre */}
        <h1 className={styles.title}>Tableau de Bord Enseignant</h1>

        {/* Infos professeur */}
        <div className={styles.userInfo}>
          <h2>
            {currentProfessor.firstName} {currentProfessor.lastName}
          </h2>
          <p>
            {currentProfessor.grade && `${currentProfessor.grade} | `}
            Spécialité: {currentProfessor.specialty || "Non spécifiée"}
          </p>
        </div>

        {/* Onglets */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "schedule" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("schedule")}>
            Emploi du temps
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "groups" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("groups")}>
            Groupes enseignés
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="scheduleContainer">
          {activeTab === "schedule" ? (
            <ProfessorSessions
              professor={currentProfessor}
              sessions={seances}
            />
          ) : (
            <ProfessorGroups professor={currentProfessor} />
          )}
        </div>
      </div>
    </PlanningProvider>
  );
};

export default ProfessorDashboard;
