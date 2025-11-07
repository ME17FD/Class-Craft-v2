import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/SubModulesTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { SubModule, Module, Field, Professor, TabType } from "../../types/type";
import SubModuleFormModal from "./SubModuleFormModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { ModalState } from "../../types/type";

interface SubModulesTabProps {
  subModules: SubModule[];
  modules: Module[];
  fields: Field[];
  professors: Professor[];
  modalState: ModalState;
  handleAdd: (entityType: TabType) => void;
  handleEdit: (entityType: TabType, entity: SubModule) => Promise<void>;
  handleDelete: (entityType: TabType, entity: SubModule) => Promise<void>;
  handleCloseModal: () => void;
}

const SubModulesTab: React.FC<SubModulesTabProps> = ({
  subModules = [],
  modules = [],
  fields = [],
  professors = [],
  modalState,
  handleAdd,
  handleEdit,
  handleDelete,
  handleCloseModal,
}) => {
  const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getModuleName = (moduleId: number): string => {
    if (!modules || modules.length === 0) return "Non spécifié";
    return modules.find((m) => m.id === moduleId)?.name || "Non spécifié";
  };

  const getFieldName = (moduleId: number): string => {
    if (!modules || modules.length === 0 || !fields || fields.length === 0)
      return "Non spécifié";

    const module = modules.find((m) => m.id === moduleId);
    if (!module) return "Non spécifié";

    const field = fields.find((f) => f.id === module.filiereId);
    return field?.name || "Non spécifié";
  };

  const getProfessorNames = (subModuleId: number): string => {
    if (!subModules || !professors || professors.length === 0)
      return "Aucun professeur";

    const subModule = subModules.find((sm) => sm.id === subModuleId);
    if (!subModule) return "Aucun professeur";

    const moduleProfessors = professors.filter((p) =>
      p.subModules?.some((profSubModule) => {
        if (typeof profSubModule === "number") {
          return profSubModule === subModuleId;
        }
        return (profSubModule as SubModule).id === subModuleId;
      })
    );
    return (
      moduleProfessors.map((p) => `${p.firstName} ${p.lastName}`).join(", ") ||
      "Aucun professeur"
    );
  };

  const handleDeleteClick = (subModule: SubModule) => {
    setSelectedSubModule(subModule);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSubModule) {
      setIsSubmitting(true);
      setError(null);
      try {
        await handleDelete("submodules", selectedSubModule);
      } catch (err) {
        setError("Échec de la suppression du sous-module");
        console.error("Erreur:", err);
      } finally {
        setIsSubmitting(false);
        setIsDeleteModalOpen(false);
        setSelectedSubModule(null);
      }
    }
  };

  const handleFormSubmit = async (subModuleData: Partial<SubModule>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const completeSubModule: SubModule = {
        id: subModuleData?.id || 0,
        name: subModuleData.name || "",
        nbrHours: subModuleData.nbrHours ?? 0,
        moduleId: subModuleData.moduleId || 0,
      };
      await handleEdit("submodules", completeSubModule);
      handleCloseModal();
    } catch (err) {
      setError("Échec de la sauvegarde du sous-module");
      console.error("Erreur:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof SubModule },
    { header: "Heures", accessor: "nbrHours" as keyof SubModule },
    {
      header: "Module parent",
      render: (subModule: SubModule) => getModuleName(subModule.moduleId),
    },
    {
      header: "Filière parente",
      render: (subModule: SubModule) => getFieldName(subModule.moduleId),
    },
    {
      header: "Professeur(s)",
      render: (subModule: SubModule) => getProfessorNames(subModule.id),
    },
    {
      header: "Actions",
      render: (subModule: SubModule) => (
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => handleEdit("submodules", subModule)}
            disabled={isSubmitting}>
            Modifier
          </Button>
          <Button
            variant="delete"
            onClick={() => handleDeleteClick(subModule)}
            disabled={isSubmitting}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.header}>
        <Button
          variant="primary"
          onClick={() => handleAdd("submodules")}
          disabled={isSubmitting}>
          {isSubmitting ? "Chargement..." : "+ Ajouter un sous-module"}
        </Button>
      </div>

      <Table
        data={subModules}
        columns={columns}
        emptyMessage="Aucun sous-module trouvé"
      />

      {modalState.entityType === "submodules" && modalState.isOpen && (
        <SubModuleFormModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          subModule={modalState.entity as SubModule | undefined}
          modules={modules}
          fields={fields}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={selectedSubModule?.name || "ce sous-module"}
      />
    </div>
  );
};

export default SubModulesTab;
