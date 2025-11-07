import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Professor } from "../../types/type";
import { Session } from "../../types/schedule";

interface ProfessorCardProps {
  professor: Professor;
  sessions: Session[];
  onOpenSchedule: () => void;
}

const ProfessorCard = ({
  professor,
  sessions,
  onOpenSchedule,
}: ProfessorCardProps) => {
  const sessionCount = sessions.length;

  return (
    <div className={styles.groupCard} onClick={onOpenSchedule}>
      <h3>
        {professor.firstName} {professor.lastName}
      </h3>
      <div className={styles.sessionCount}>{sessionCount} séances</div>
    </div>
  );
};

export default ProfessorCard;
