import React, { useState, useMemo } from "react";
import styles from "../../styles/PedagogicalDashboard-components/ModulesTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Module, Field, Professor, SubModule } from "../../types/type";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ModulesTabProps {
  modules: Module[];
  fields: Field[];
  professors: Professor[];
  subModules: SubModule[];
  onEdit: (module: Module) => void;
  onDelete: (module: Module) => void;
  onAdd: () => void;
}

const ModulesTab: React.FC<ModulesTabProps> = ({
  modules,
  fields,
  professors,
  subModules,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [selectedField, setSelectedField] = useState<number>(0);
  const [selectedProfessor, setSelectedProfessor] = useState<number>(0);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getFieldName = (fieldId: number) => {
    return fields.find((f) => f.id === fieldId)?.name || "Non spécifié";
  };

  const getProfessorNames = (moduleId: number) => {
    const moduleProfessors = professors.filter((p) =>
      p.modules?.some((profModule) => {
        // If profModule is a number (ID), compare directly
        if (typeof profModule === "number") {
          return profModule === moduleId;
        }
        // If profModule is an object, compare IDs
        const moduleObj = profModule as Module;
        return moduleObj.id === moduleId;
      })
    );
    return (
      moduleProfessors.map((p) => `${p.firstName} ${p.lastName}`).join(", ") ||
      "Aucun professeur"
    );
  };

  const getSubModuleNames = (moduleId: number) => {
    const moduleSubModules = subModules.filter(
      (sm) => sm.moduleId === moduleId
    );
    return (
      moduleSubModules.map((sm) => `${sm.name} (${sm.nbrHours}h)`).join(", ") ||
      "Aucun sous-module"
    );
  };

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesField =
        selectedField === 0 || module.filiereId === selectedField;

      const matchesProfessor =
        selectedProfessor === 0 ||
        professors.some(
          (p) =>
            p.id === selectedProfessor &&
            p.modules?.some((profModule) => {
              // If profModule is a number (ID), compare directly
              if (typeof profModule === "number") {
                return profModule === module.id;
              }
              // If profModule is an object, compare IDs
              const moduleObj = profModule as Module;
              return moduleObj.id === module.id;
            })
        );

      return matchesField && matchesProfessor;
    });
  }, [modules, selectedField, selectedProfessor, professors]);

  const handleDeleteClick = (module: Module) => {
    setSelectedModule(module);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedModule) {
      onDelete(selectedModule);
      setIsDeleteModalOpen(false);
      setSelectedModule(null);
    }
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof Module },
    {
      header: "Filière",
      render: (module: Module) => getFieldName(module.filiereId || 0),
    },
    {
      header: "Professeur(s)",
      render: (module: Module) => getProfessorNames(module.id ?? 0),
    },
    {
      header: "Sous-modules",
      render: (module: Module) => getSubModuleNames(module.id ?? 0),
    },
    {
      header: "Actions",
      render: (module: Module) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(module)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(module)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Filière</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(Number(e.target.value))}>
              <option value={0}>Toutes les filières</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Professeur</label>
            <select
              value={selectedProfessor}
              onChange={(e) => setSelectedProfessor(Number(e.target.value))}>
              <option value={0}>Tous les professeurs</option>
              {professors.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.firstName} {professor.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button variant="primary" onClick={() => onAdd()}>
          + Ajouter un module
        </Button>
      </div>

      <Table
        data={filteredModules}
        columns={columns}
        emptyMessage="Aucun module trouvé"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={selectedModule?.name || "ce module"}
      />
    </div>
  );
};

export default ModulesTab;
