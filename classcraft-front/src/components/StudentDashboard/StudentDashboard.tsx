import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import StudentSchedule from "./StudentSchedule";
import ClassmatesList from "./ClassmatesList";
import styles from "../../styles/StudentDashboard.module.css";
import { FiLogOut } from "react-icons/fi";
import { PlanningProvider } from "../../context/PlanningContext";
import { useNavigate } from "react-router-dom";
import { Student, Group } from "../../types/type";

const StudentDashboard = () => {
  // Récupération des données depuis le localStorage
  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}") as Partial<Student>;
  const { students = [], groups = [] } = useApiData() as {
    students: Student[];
    groups: Group[];
  };

  console.log("Debug - userData:", userData);
  console.log("Debug - students:", students);
  console.log("Debug - groups:", groups);

  // State pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState<"schedule" | "classmates">(
    "schedule"
  );

  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the user's session data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDetails");
    // Redirect to login
    navigate("/");
  };

  // Trouver l'étudiant correspondant
  const currentStudent = students.find(
    (s) =>
      s.id === userData.id ||
      s.email === userData.email ||
      s.registrationNumber === userData.registrationNumber
  ) || {
    id: userData.id || 0,
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    cne: userData.cne || "",
    registrationNumber: userData.registrationNumber || "",
    groupId: userData.groupId || null,
    email: userData.email || ""
  };

  console.log("Debug - currentStudent:", currentStudent);

  // Trouver le groupe de l'étudiant
  const studentGroup = groups.find((g) => g.id === currentStudent.groupId) || null;

  console.log("Debug - studentGroup:", studentGroup);

  return (
    <PlanningProvider>
      <div className={styles.container}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut className={styles.logoutIcon} size={22} />
        </button>
        <h1 className={styles.title}>Mon Tableau de Bord</h1>

        <div className={styles.userInfo}>
          <h2>
            {currentStudent.firstName} {currentStudent.lastName}
          </h2>
          <p>
            CNE: {currentStudent.cne} | Groupe:{" "}
            {studentGroup?.name || "Non assigné"}
          </p>
        </div>

        {/* Onglets de navigation */}
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
              activeTab === "classmates" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("classmates")}>
            Camarades de classe
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className={styles.planingContainer}>
          {activeTab === "schedule" ? (
            <section className={styles.scheduleSection}>
              <StudentSchedule 
                student={{ id: currentStudent.id, groupId: currentStudent.groupId }} 
                group={studentGroup} 
              />
            </section>
          ) : (
            <section className={styles.classmatesSection}>
              <ClassmatesList
                group={studentGroup}
                currentStudentId={currentStudent.id}
              />
            </section>
          )}
        </div>
      </div>
    </PlanningProvider>
  );
};

export default StudentDashboard;
