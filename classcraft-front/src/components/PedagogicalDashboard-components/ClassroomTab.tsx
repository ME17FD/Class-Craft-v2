// src/components/PedagogicalDashboard-components/ClassroomsTab.tsx
import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/TableActions.module.css";
import Table from "./TableActions";
import { Room } from "../../types/schedule";
import Button from "./Button";
import { Classroom } from "../../types/type";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ClassroomsTabProps {
  classrooms: Room[];
  onAdd: () => void;
  onEdit: (classroom: Room) => void;
  onDelete: (classroom: Room) => void;
}

const ClassroomsTab: React.FC<ClassroomsTabProps> = ({
  classrooms,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(
    null
  );

  

  const handleConfirmDelete = () => {
    if (classroomToDelete) {
      onDelete(classroomToDelete);
      setClassroomToDelete(null);
    }
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof Room },
    { header: "Capacité", accessor: "capacity" as keyof Room },
    { header: "Type", accessor: "type" as keyof Room },
    {
      header: "Actions",
      render: (classroom: Room) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(classroom)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => onDelete(classroom)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tableHeader}>
        <h2>Gestion des salles</h2>
        <Button variant="primary" onClick={onAdd}>
          Ajouter une salle
        </Button>
      </div>
      <Table
        data={classrooms}
        columns={columns}
        emptyMessage="Aucune salle disponible"
      />
      <DeleteConfirmationModal
        isOpen={!!classroomToDelete}
        onClose={() => setClassroomToDelete(null)}
        onConfirm={handleConfirmDelete}
        entityName={classroomToDelete?.name || "cette salle"}
      />
    </div>
  );
};

export default ClassroomsTab;
