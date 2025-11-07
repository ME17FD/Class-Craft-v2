import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useApiData } from "../../hooks/useApiData";
import { Group } from "../../types/type";

interface ClassmatesListProps {
  group: Group | null;
  currentStudentId: number;
}

const ClassmatesList = ({ group, currentStudentId }: ClassmatesListProps) => {
  const { students = [] } = useApiData();

  const classmates = group
    ? students.filter(
        (s) => s.groupId === group.id && s.id !== currentStudentId
      )
    : [];

  return (
    <div className={styles.classmatesContainer}>
      <h3 className={styles.classmatesTitle}>Mes camarades de classe</h3>
      {classmates.length > 0 ? (
        <div className={styles.classmatesGrid}>
          {classmates.map((student) => (
            <div key={student.id} className={styles.classmateCard}>
              <div className={styles.classmateAvatar}>
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div className={styles.classmateInfo}>
                <h4 className={styles.classmateName}>
                  {student.firstName} {student.lastName}
                </h4>
                <div className={styles.classmateDetails}>
                  <span className={styles.detailItem}>
                    <i className="fas fa-id-card"></i>
                    {student.cne}
                  </span>
                  <span className={styles.detailItem}>
                    <i className="fas fa-envelope"></i>
                    {student.email}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyClassmates}>
          <i className="fas fa-users"></i>
          <p>
            {group
              ? "Aucun autre étudiant dans votre groupe"
              : "Vous n'êtes pas assigné à un groupe"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassmatesList;
