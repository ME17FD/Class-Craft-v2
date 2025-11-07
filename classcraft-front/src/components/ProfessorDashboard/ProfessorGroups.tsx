import React, { useState, useMemo } from "react";
import { usePlanning } from "../../context/PlanningContext";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Professor } from "../../types/type";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useApiData } from "../../hooks/useApiData";

interface ProfessorGroupsProps {
  professor?: Professor;
}

const ProfessorGroups: React.FC<ProfessorGroupsProps> = ({ professor }) => {
  const { sessions } = usePlanning();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  // Vérification initiale des données
  if (!professor) {
    return (
      <div className={styles.emptyMessage}>
        Les informations du professeur ne sont pas disponibles
      </div>
    );
  }
  const { students } = useApiData();

  // Mémoization des données filtrées
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { taughtGroups } = useMemo(() => {
    // Filtrer les sessions du professeur
    const profSessions = sessions.filter(
      (s) => s.professor?.id === professor.id || s.professor?.id === professor.id
    );

    // Extraire les groupes uniques
    const uniqueGroups: { id: number; name: string }[] = [];
    const groupMap = new Map<number, boolean>();

    profSessions.forEach((session) => {
      const group = session.group;
      if (group && group.id !== undefined && group.name !== undefined && !groupMap.has(group.id)) {
        groupMap.set(group.id, true);
        uniqueGroups.push({ id: group.id, name: group.name });
      }
    });

    return {
      taughtGroups: uniqueGroups,
      groupSessions: profSessions,
    };
  }, [sessions, professor.id]);

  // Gestion de l'expansion des groupes
  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Cas où aucun groupe n'est trouvé
  if (taughtGroups.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        {professor.firstName} {professor.lastName} n'enseigne dans aucun groupe
        actuellement
        {professor.modules?.length === 0 && (
          <p className={styles.noModules}>Aucun module attribué</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          Groupes enseignés - {professor.firstName} {professor.lastName}
          {professor.grade && <span> ({professor.grade})</span>}
        </h2>

        {professor.specialty && (
          <p className={styles.specialty}>Spécialité: {professor.specialty}</p>
        )}
      </div>

      <div className={styles.groupsContainer}>
        {taughtGroups.map((group) => (
          <div key={group.id} className={styles.groupCard}>
            <div
              className={styles.cardHeader}
              onClick={() => toggleGroup(group.id)}>
              <h3>{group.name}</h3>
              <div className={styles.toggleIcon}>
                {expandedGroups.includes(group.id) ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </div>
            </div>

            {expandedGroups.includes(group.id) && (
              <div className={styles.groupDetails}>
                <div className={styles.studentList}>
                  <h4>Étudiants du groupe {group.name}</h4>
                  <ul>
                    {students
                      .filter((student) => student.groupId === group.id)
                      .map((student) => (
                        <li key={student.id}>
                          {student.firstName} {student.lastName}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorGroups;
