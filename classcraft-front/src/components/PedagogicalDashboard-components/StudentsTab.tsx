import React, { useCallback, useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/StudentTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Student, Group } from "../../types/type";
import StudentFormModal from "./StudentFormModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface StudentsTabProps {
  students: Student[];
  groups: Group[];
  onAdd: (student: Omit<Student, "id">) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

type ModalType = "add" | "edit";

const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  groups,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    student: Student | null;
  }>({ isOpen: false, type: null, student: null });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getGroupName = (groupId: number | null) => {
    if (!groupId) return "Non affecté";
    const group = groups.find((g) => g.id === groupId);
    return group?.name || "Inconnu";
  };

  const handleOpenAddModal = () => {
    setModalState({
      isOpen: true,
      type: "add",
      student: {
        id: 0,
        cne: "",
        registrationNumber: "",
        lastName: "",
        firstName: "",
        groupId: null,
      },
    });
  };

  const handleOpenEditModal = (student: Student) => {
    setModalState({ isOpen: true, type: "edit", student });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null, student: null });
  };

  const handleSave = useCallback(
    (studentData: Student) => {
      if (modalState.type === "add") {
        const { id, ...addData } = studentData;
        onAdd(addData);
      } else if (modalState.type === "edit") {
        onEdit(studentData);
      }
      handleCloseModal();
    },
    [modalState.type, onAdd, onEdit]
  );

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      onDelete(selectedStudent);
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const columns = [
    { header: "CNE", accessor: "cne" as keyof Student },
    { header: "Apogée", accessor: "registrationNumber" as keyof Student },
    { header: "Nom", accessor: "lastName" as keyof Student },
    { header: "Prénom", accessor: "firstName" as keyof Student },
    { header: "Groupe", render: (student: Student) => getGroupName(student.groupId) },
    {
      header: "Actions",
      render: (student: Student) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => handleOpenEditModal(student)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(student)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="primary" onClick={handleOpenAddModal}>
          + Ajouter un étudiant
        </Button>
      </div>

      <Table data={students} columns={columns} emptyMessage="Aucun étudiant trouvé" />

      {modalState.isOpen && modalState.student && (
        <StudentFormModal
          student={modalState.student}
          groups={groups}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={
          selectedStudent
            ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
            : "cet étudiant"
        }
      />
    </div>
  );
};

export default StudentsTab;
