import { Group } from "../../types/type";
import { ExamSession } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useApiData } from "../../hooks/useApiData";

interface GroupExamsCardProps {
  group: Group;
  exams: ExamSession[];
  makeups: ExamSession[];
  onExamClick: (exam: ExamSession) => void;
  onMakeupClick: () => void;
  onCreateExamClick: () => void;
}

export const ExamsCard = ({
  group,
  exams,
  makeups,
  onExamClick,
  onMakeupClick,
  onCreateExamClick,
}: GroupExamsCardProps) => {
  const { subModules = [], rooms = [] } = useApiData();

  const formatDateTime = (session: ExamSession) => {
    if (session.startDateTime) {
      const date = new Date(session.startDateTime);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const time = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${dayName} ${formattedDate} ${time}`;
    }
    return "";
  };

  const getModuleName = (subModuleId: number) => {
    const subModule = subModules.find(sm => sm.id === subModuleId);
    return subModule?.name || "Module non spécifié";
  };

  const getClassroomName = (classroomId: number) => {
    const classroom = rooms.find(r => r.id === classroomId);
    return classroom?.name || "Salle non spécifiée";
  };

  return (
    <div className={styles.groupExamCard}>
      <div className={styles.cardHeader}>
        <h3>{group.name}</h3>
        <div className={styles.headerActions}>
          <button 
            className={styles.createButton}
            onClick={(e) => {
              e.stopPropagation();
              onCreateExamClick();
            }}
          >
            + Nouvel Examen
          </button>
          <span className={styles.badge}>
            {exams.length + makeups.length} sessions
          </span>
        </div>
      </div>

      <div className={styles.examList}>
        <h4>Examens ({exams.length})</h4>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div
              key={`exam-${exam.id || exam.startDateTime}`}
              className={styles.examItem}
              onClick={() => onExamClick(exam)}>
              <div>
                <strong>{getModuleName(exam.subModuleId)}</strong>
                <span className={styles.examBadge}>Examen</span>
              </div>
              <div>
                {formatDateTime(exam)} - {getClassroomName(exam.classroomId)}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>Aucun examen programmé</div>
        )}
      </div>

      <div className={styles.makeupSection} onClick={onMakeupClick}>
        <h4>Rattrapages ({makeups.length})</h4>
        {makeups.length > 0 ? (
          makeups.map((makeup) => (
            <div 
              key={`makeup-${makeup.id || makeup.startDateTime}`} 
              className={styles.makeupItem}>
              <div>
                <strong>{getModuleName(makeup.subModuleId)}</strong>
                <span className={styles.makeupBadge}>Rattrapage</span>
              </div>
              <div>
                {formatDateTime(makeup)} - {getClassroomName(makeup.classroomId)}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>Aucun rattrapage programmé</div>
        )}
      </div>
    </div>
  );
};

export default ExamsCard;
