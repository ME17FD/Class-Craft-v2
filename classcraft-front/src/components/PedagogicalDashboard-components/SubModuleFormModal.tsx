import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import styles from "../../styles/PedagogicalDashboard-components/SubModuleFormModal.module.css";
import { SubModule, Module, Field } from "../../types/type";
import Button from "./Button";

interface SubModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subModule: Omit<SubModule, "id">) => void;
  subModule?: SubModule;
  modules: Module[];
  fields: Field[];
}

const SubModuleFormModal: React.FC<SubModuleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subModule,
  modules,
  fields,
}) => {
  // Définition d'un sous-module par défaut avec nbrHours initialisé à 0
  const defaultSubModule: Omit<SubModule, "id"> = {
    name: "",
    nbrHours: 0, // Valeur par défaut explicite
    moduleId: 0,
  };

  const [formData, setFormData] =
    useState<Omit<SubModule, "id">>(defaultSubModule);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    if (subModule) {
      // Mode édition - initialisation avec les valeurs existantes
      setFormData({
        name: subModule.name,
        nbrHours: subModule.nbrHours ?? 0, // Protection contre null/undefined
        moduleId: subModule.moduleId,
      });
      const module = modules.find((m) => m.id === subModule.moduleId);
      setSelectedModule(module || null);
    } else {
      // Mode création - réinitialisation aux valeurs par défaut
      setFormData(defaultSubModule);
      setSelectedModule(null);
    }
  }, [subModule, modules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation et conversion explicite de nbrHours
    const submittedData = {
      ...formData,
      nbrHours: Number(formData.nbrHours) || 0, // Conversion et valeur par défaut
    };

    onSubmit(submittedData);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      nbrHours: value === "" ? 0 : Number(value), // Conversion en number
    }));
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const moduleId = Number(e.target.value);
    const module = modules.find((m) => m.id === moduleId);
    setSelectedModule(module || null);
    setFormData((prev) => ({
      ...prev,
      moduleId,
    }));
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subModule ? "Modifier le sous-module" : "Ajouter un sous-module"}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nom du sous-module</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="hours">Nombre d'heures</label>
          <input
            type="text"
            id="hours"
            value={formData.nbrHours}
            onChange={handleNumberChange}
            required
            min="0"
            step="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="moduleId">Module parent</label>
          <select
            id="moduleId"
            value={formData.moduleId}
            onChange={handleModuleChange}
            required>
            <option value="">Sélectionner un module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>

        {selectedModule && (
          <div className={styles.fieldInfo}>
            Filière:{" "}
            {fields.find((f) => f.id === selectedModule.filiereId)?.name ||
              "Non spécifiée"}
          </div>
        )}

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {subModule ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubModuleFormModal;
