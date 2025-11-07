import React, { useState } from "react";
import { PlanningProvider } from "../../context/PlanningContext";
import GroupPlanning from "./GroupPlanning";
import SemesterPlanning from "./SemesterPlanning";
import ProfessorPlanning from "./ProfessorPlanning";
import DailyReportsPage from "./DailyReportsPage";
import ExamPlanning from "./ExamPlanning";
import styles from "../../styles/PlanningDashboard/PlanningDashboard.module.css";
import Sidebar from "../Sidebar";

const tabs = [
  { id: "group", label: "Planning des groupes", icon: "👥" },
  { id: "semester", label: "Planning des semestres", icon: "📅" },
  { id: "professor", label: "Planning des professeurs", icon: "👨‍🏫" },
  { id: "room", label: "Rapport des salles", icon: "🏫" },
  { id: "exam", label: "Examens", icon: "📝" },
];

type TabId = (typeof tabs)[number]["id"];

const PlanningDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("group");

  return (
    <div className={styles.layout}>
      <Sidebar />
      <PlanningProvider>
        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Générateur de planning</h1>
            </div>
            <div className={styles.tabBar}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${
                    activeTab === tab.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}>
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className={styles.activeIndicator} />
                  )}
                </button>
              ))}
            </div>
          </header>

          <section className={styles.contentPanel}>
            <div className={styles.panelContainer}>
              {activeTab === "group" && <GroupPlanning />}
              {activeTab === "semester" && <SemesterPlanning />}
              {activeTab === "professor" && <ProfessorPlanning />}
              {activeTab === "room" && <DailyReportsPage />}
              {activeTab === "exam" && <ExamPlanning />}
            </div>
          </section>
        </main>
      </PlanningProvider>
    </div>
  );
};

export default PlanningDashboard;
