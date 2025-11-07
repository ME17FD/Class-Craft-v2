import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/ProfessorsTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Professor, Module, SubModule } from "../../types/type";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ProfessorsTabProps {
  professors: Professor[];
  modules: Module[];
  subModules: SubModule[];
  onAdd: () => void;
  onEdit: (professor: Professor) => void;
  onDelete: (professor: Professor) => void;
}

const ProfessorsTab: React.FC<ProfessorsTabProps> = ({
  professors = [],
  modules = [],
  subModules = [],
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getModuleNames = (professorModules: Module[] | undefined) => {
    if (!professorModules || professorModules.length === 0) return "Aucun";
    return professorModules.map((m) => m.name).join(", ");
  };

  const getSubModuleNames = (professorSubModules: SubModule[] | undefined) => {
    if (!professorSubModules || professorSubModules.length === 0)
      return "Aucun";
    return professorSubModules.map((sm) => sm.name).join(", ");
  };

  const handleDeleteClick = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProfessor) {
      onDelete(selectedProfessor);
      setIsDeleteModalOpen(false);
      setSelectedProfessor(null);
    }
  };

  const columns = [
    {
      header: "Nom",
      render: (professor: Professor) =>
        `${professor.firstName} ${professor.lastName}`,
    },
    { header: "Email", accessor: "email" as keyof Professor },
    {
      header: "Modules enseignés",
      render: (professor: Professor) => {
        console.log("Professor:", professor);
        console.log("Professor modules array:", professor.modules);
        console.log("Available modules:", modules);

        // If professor.modules is undefined or empty, return "Aucun"
        if (!professor.modules || professor.modules.length === 0) {
          return "Aucun";
        }

        const moduleObjects = modules.filter((m) => {
          // Handle both cases: when modules array contains full objects or just IDs
          return professor.modules?.some((profModule) => {
            // If profModule is a number (ID), compare directly
            if (typeof profModule === "number") {
              return profModule === m.id;
            }
            // If profModule is an object, compare IDs
            const moduleObj = profModule as Module;
            return moduleObj.id === m.id;
          });
        });

        console.log("Filtered module objects:", moduleObjects);
        return getModuleNames(moduleObjects);
      },
    },
    {
      header: "Sous-modules enseignés",
      render: (professor: Professor) => {
        console.log("Professor submodules array:", professor.subModules);
        console.log("Available submodules:", subModules);

        // If professor.subModules is undefined or empty, return "Aucun"
        if (!professor.subModules || professor.subModules.length === 0) {
          return "Aucun";
        }

        const subModuleObjects = subModules.filter((sm) => {
          // Handle both cases: when subModules array contains full objects or just IDs
          return professor.subModules?.some((profSubModule) => {
            // If profSubModule is a number (ID), compare directly
            if (typeof profSubModule === "number") {
              return profSubModule === sm.id;
            }
            // If profSubModule is an object, compare IDs
            const subModuleObj = profSubModule as SubModule;
            return subModuleObj.id === sm.id;
          });
        });

        console.log("Filtered submodule objects:", subModuleObjects);
        return getSubModuleNames(subModuleObjects);
      },
    },
    {
      header: "Actions",
      render: (professor: Professor) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(professor)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(professor)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.header}>
        <Button variant="primary" onClick={() => onAdd()}>
          + Ajouter un enseignant
        </Button>
      </div>

      <Table
        data={professors}
        columns={columns}
        emptyMessage="Aucun enseignant trouvé"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={
          selectedProfessor
            ? `${selectedProfessor.lastName} ${selectedProfessor.firstName}`
            : "cet enseignant"
        }
      />
    </>
  );
};

export default ProfessorsTab;
