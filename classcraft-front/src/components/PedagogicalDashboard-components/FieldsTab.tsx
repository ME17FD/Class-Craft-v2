import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/FieldsTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Field, Module, SubModule, Group, Professor } from "../../types/type";
import FieldDetailsModal from "./FieldDetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface FieldsTabProps {
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
  groups: Group[];
  professors: Professor[];
  onEdit: (field: Field) => void;
  onDelete: (field: Field) => void;
  onAdd: () => void;
}

const FieldsTab: React.FC<FieldsTabProps> = ({
  fields,
  modules,
  subModules,
  groups,
  professors,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null);

  const handleOpenDetails = (field: Field) => {
    setSelectedField(field);
  };

  const handleCloseDetails = () => {
    setSelectedField(null);
  };

  const handleDeleteClick = (field: Field) => {
    setFieldToDelete(field);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fieldToDelete) {
      onDelete(fieldToDelete);
      setIsDeleteModalOpen(false);
      setFieldToDelete(null);
    }
  };

  const handleAddField = () => {
    if (onAdd) {
      onAdd();
    } else {
      // Fallback to edit with empty field if onAdd not provided
      onEdit({ id: 0, name: "", description: "" });
    }
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof Field },
    { header: "Description", accessor: "description" as keyof Field },
    {
      header: "Actions",
      render: (field: Field) => (
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={() => handleOpenDetails(field)}
            small
          >
            Détails
          </Button>
          <Button variant="secondary" onClick={() => onEdit(field)} small>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(field)} small>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="primary" onClick={handleAddField}>
          + Ajouter une filière
        </Button>
      </div>

      <Table
        data={fields}
        columns={columns}
        emptyMessage="Aucune filière trouvée"
      />

      {selectedField && (
        <FieldDetailsModal
          field={selectedField}
          modules={modules.filter((m) => m.filiereId === selectedField.id)}
          subModules={subModules.filter((sm) =>
            modules.some(
              (m) => m.id === sm.moduleId && m.filiereId === selectedField.id
            )
          )}
          groups={groups.filter((g) => g.filiereId === selectedField.id)}
          professors={professors}
          onClose={handleCloseDetails}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={fieldToDelete?.name || "cette filière"}
      />
    </div>
  );
};

export default FieldsTab;