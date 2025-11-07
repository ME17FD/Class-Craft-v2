import  { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import { usePlanning } from "../../context/PlanningContext";
import ProfessorCard from "./ProfessorCard";
import ProfessorScheduleModal from "./ProfessorScheduleModal";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Professor } from "../../types/type";
const ProfessorPlanning = () => {
  const { professors = [], seances = [] } = useApiData();

  const { sessions = [] } = usePlanning();
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const allSessions = [...seances, ...sessions];

  const filteredProfessors = professors.filter((professor) => {
    return `${professor.firstName} ${professor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Rechercher un professeur..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.groupsGrid}>
        {filteredProfessors.map((professor) => (
          <ProfessorCard
            key={professor.id}
            professor={professor}
            sessions={allSessions.filter(
              (s) => s.professor?.id === professor.id
            )}
            onOpenSchedule={() => setSelectedProfessor(professor)}
          />
        ))}
      </div>

      {selectedProfessor && (
        <ProfessorScheduleModal
          professor={selectedProfessor}
          onTimeSlotClick={(day, time) => console.log(day, time)}
          onClose={() => setSelectedProfessor(null)}
        />
      )}
    </div>
  );
};

export default ProfessorPlanning;
