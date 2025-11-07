import React, { useState, useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/UnassignedStudentsModal.module.css";
import { Student } from "../../types/type";
import Button from "./Button";
import Modal from "./Modal";

interface UnassignedStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignStudent: (studentId: number) => void;
  students: Student[];
}

const UnassignedStudentsModal: React.FC<UnassignedStudentsModalProps> = ({
  isOpen,
  onClose,
  onAssignStudent,
  students,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {

    setFilteredStudents(
      students.filter(
        (student) =>
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.cne.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, students]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Étudiants non assignés"
    >
      <div className={styles.modal}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.studentsList}>
          {filteredStudents.length > 0 ? (
            <table className={styles.studentsTable}>
              <thead>
                <tr>
                  <th>CNE</th>
                  <th>Numéro d'inscription</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.cne}</td>
                    <td>{student.registrationNumber}</td>
                    <td>{student.lastName}</td>
                    <td>{student.firstName}</td>
                    <td>
                      <Button
                        variant="assign"
                        onClick={() => onAssignStudent(student.id)}
                      >
                        Assigner
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noResults}>Aucun étudiant trouvé</p>
          )}
        </div>
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UnassignedStudentsModal; 