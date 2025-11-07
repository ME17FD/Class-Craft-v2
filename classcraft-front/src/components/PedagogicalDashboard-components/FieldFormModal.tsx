import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "../../styles/PedagogicalDashboard-components/FieldFormModal.module.css";
import { Field, Module, SubModule } from "../../types/type";

interface ExtendedModule extends Module {
  subModules: SubModule[];
}

interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (field: Omit<Field, "id"> & { modules: ExtendedModule[] }) => void;
  field?: Field & { modules: ExtendedModule[] };
  isSubmitting?: boolean;
}

interface ModuleFormData {
  name: string;
  code: string;
  subModules: { name: string; nbrHours: number }[];
}

const FieldFormModal: React.FC<FieldFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  field,
  isSubmitting = false,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<ModuleFormData[]>([]);
  const [currentModule, setCurrentModule] = useState<ModuleFormData>({
    name: "",
    code: "",
    subModules: [],
  });
  const [currentSubModule, setCurrentSubModule] = useState<{
    name: string;
    nbrHours: number;
  }>({
    name: "",
    nbrHours: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (field) {
      setName(field.name);
      setDescription(field.description);
      setModules(
        field.modules.map((m) => ({
          name: m.name,
          code: m.code,
          subModules: m.subModules.map((sm) => ({
            name: sm.name,
            nbrHours: sm.nbrHours,
          })),
        }))
      );
    } else {
      // Reset to empty values for a new field
      setName("");
      setDescription("");
      setModules([]);
    }
  }, [field, isOpen]); // Depend on 'field' and 'isOpen'
  

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Le nom de la filière est requis";
    }

    if (!description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (modules.length === 0) {
      newErrors.modules = "Au moins un module est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubModule = () => {
    if (!currentSubModule.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        subModuleName: "Le nom du sous-module est requis",
      }));
      return;
    }

    if (currentSubModule.nbrHours <= 0) {
      setErrors((prev) => ({
        ...prev,
        subModuleHours: "Le nombre d'heures doit être supérieur à 0",
      }));
      return;
    }

    setCurrentModule({
      ...currentModule,
      subModules: [...currentModule.subModules, { ...currentSubModule }],
    });
    setCurrentSubModule({ name: "", nbrHours: 0 });
    setErrors((prev) => {
      const { subModuleName, subModuleHours, ...rest } = prev;
      return rest;
    });
  };

  const handleRemoveSubModule = (index: number) => {
    const updatedSubModules = [...currentModule.subModules];
    updatedSubModules.splice(index, 1);
    setCurrentModule({
      ...currentModule,
      subModules: updatedSubModules,
    });
  };

  const handleAddModule = () => {
    if (!currentModule.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        moduleName: "Le nom du module est requis",
      }));
      return;
    }

    if (!currentModule.code.trim()) {
      setErrors((prev) => ({
        ...prev,
        moduleCode: "Le code du module est requis",
      }));
      return;
    }

    if (currentModule.subModules.length === 0) {
      setErrors((prev) => ({
        ...prev,
        moduleSubModules: "Au moins un sous-module est requis",
      }));
      return;
    }

    setModules([...modules, { ...currentModule }]);
    setCurrentModule({
      name: "",
      code: "",
      subModules: [],
    });
    setErrors((prev) => {
      const { moduleName, moduleCode, moduleSubModules, ...rest } = prev;
      return rest;
    });
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit({
      name,
      description,
      modules: modules.map((m, index) => {
        // Check if this is an existing module or a new one
        const existingModule = field?.modules[index];
        return {
          id: existingModule?.id || 0,
          name: m.name,
          code: m.code,
          filiereId: field?.id || 0,
          subModules: m.subModules.map((sm, smIndex) => {
            // Check if this is an existing submodule or a new one
            const existingSubModule = existingModule?.subModules[smIndex];
            return {
              id: existingSubModule?.id || 0,
              name: sm.name,
              nbrHours: sm.nbrHours,
              moduleId: existingModule?.id || 0,
            };
          }),
        };
      }),
    });
  };

  const isValid = name && description && modules.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={field ? "Modifier une filière" : "Ajouter une filière"}
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nom de la filière</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? styles.errorInput : ""}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description}</span>
          )}
        </div>

        <div className={styles.section}>
          <h3>Modules et Sous-modules</h3>
          {errors.modules && (
            <span className={styles.error}>{errors.modules}</span>
          )}

          {modules.length > 0 && (
            <div className={styles.modulesList}>
              <h4>Modules ajoutés</h4>
              <ul>
                {modules.map((module, index) => (
                  <li key={index}>
                    {module.name} ({module.code})
                    <Button
                      variant="delete"
                      onClick={() => handleRemoveModule(index)}
                      small
                    >
                      Supprimer
                    </Button>
                    <ul>
                      {module.subModules.map((sm, smIndex) => (
                        <li key={smIndex}>
                          {sm.name} - {sm.nbrHours}h
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.moduleForm}>
            <h4>Ajouter un module</h4>
            <div className={styles.formGroup}>
              <label>Nom du module</label>
              <input
                type="text"
                value={currentModule.name}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, name: e.target.value })
                }
                className={errors.moduleName ? styles.errorInput : ""}
              />
              {errors.moduleName && (
                <span className={styles.error}>{errors.moduleName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Code du module</label>
              <input
                type="text"
                value={currentModule.code}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, code: e.target.value })
                }
                className={errors.moduleCode ? styles.errorInput : ""}
              />
              {errors.moduleCode && (
                <span className={styles.error}>{errors.moduleCode}</span>
              )}
            </div>

            <div className={styles.subModulesSection}>
              <h5>Sous-modules</h5>
              {errors.moduleSubModules && (
                <span className={styles.error}>{errors.moduleSubModules}</span>
              )}

              {currentModule.subModules.length > 0 && (
                <ul className={styles.subModulesList}>
                  {currentModule.subModules.map((sm, index) => (
                    <li key={index}>
                      {sm.name} - {sm.nbrHours}h
                      <Button
                        variant="delete"
                        onClick={() => handleRemoveSubModule(index)}
                        small
                      >
                        Supprimer
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.subModuleForm}>
                <div className={styles.formGroup}>
                  <label>Nom du sous-module</label>
                  <input
                    type="text"
                    value={currentSubModule.name}
                    onChange={(e) =>
                      setCurrentSubModule({
                        ...currentSubModule,
                        name: e.target.value,
                      })
                    }
                    className={errors.subModuleName ? styles.errorInput : ""}
                  />
                  {errors.subModuleName && (
                    <span className={styles.error}>{errors.subModuleName}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Nombre d'heures</label>
                  <input
                    type="number"
                    min="1"
                    value={currentSubModule.nbrHours}
                    onChange={(e) =>
                      setCurrentSubModule({
                        ...currentSubModule,
                        nbrHours: parseInt(e.target.value) || 0,
                      })
                    }
                    className={errors.subModuleHours ? styles.errorInput : ""}
                  />
                  {errors.subModuleHours && (
                    <span className={styles.error}>{errors.subModuleHours}</span>
                  )}
                </div>

                <Button variant="primary" onClick={handleAddSubModule}>
                  Ajouter le sous-module
                </Button>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleAddModule}
              disabled={
                !currentModule.name ||
                !currentModule.code ||
                currentModule.subModules.length === 0
              }
            >
              Ajouter le module
            </Button>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {field ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FieldFormModal;