import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupStudentsModal.module.css";
import { Student } from "../../types/type";
import Button from "./Button";
import Modal from "./Modal";

interface GroupStudentsModalProps {
  isOpen: boolean;
  students: Student[];
  onClose: () => void;
  onAssignStudents: () => void;
}

const GroupStudentsModal: React.FC<GroupStudentsModalProps> = ({
  isOpen,
  students,
  onClose,
  onAssignStudents,
}) => {
  if (!isOpen) return null;
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Liste des étudiants du groupe"
    >
      <div className={styles.studentsList}>
        {students.length === 0 ? (
          <p className={styles.noResults}>Aucun étudiant dans ce groupe</p>
        ) : (
          <table className={styles.studentsTable}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>CNE</th>
                <th>Apogee</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.lastName}</td>
                  <td>{student.firstName}</td>
                  <td>{student.cne}</td>
                  <td>{student.registrationNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.modalActions}>
        <Button variant="primary" onClick={onAssignStudents}>
          Assigner des étudiants
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
};

export default GroupStudentsModal; 