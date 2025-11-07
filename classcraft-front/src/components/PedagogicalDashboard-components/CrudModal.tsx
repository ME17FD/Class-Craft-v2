/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/CrudModal.module.css";
import Button from "./Button";
import Modal from "./Modal";
import {
  CrudModalType,
  TabType,
  Group,
  Field,
  Module,
  SubModule,
  Professor,
} from "../../types/type";

interface CrudModalProps {
  isOpen: boolean;
  type: CrudModalType;
  entityType: TabType;
  entity: any;
  fields: Field[];
  professors: Professor[];
  modules: Module[];
  subModules: SubModule[];
  groups: Group[];
  onSave: (entityType: TabType, data: any) => void;
  onClose: () => void;
}

const CrudModal: React.FC<CrudModalProps> = ({
  isOpen,
  type,
  entityType,
  entity,
  fields,
  modules,
  subModules,
  professors,
  groups,
  onSave,
  onClose,
}) => {
  const [temporarilySelectedSubModules, setTemporarilySelectedSubModules] =
    useState<number[]>([]);
  const [
    availableSubModulesForAssignment,
    setAvailableSubModulesForAssignment,
  ] = useState<SubModule[]>([]);

  // Initialize formData with proper default values
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const defaults = {
      name: "",
      code: "",
      filiereId: "",
      hours: 0,
      nbrHours: 0,
      moduleId: "",
      firstName: "",
      lastName: "",
      email: "",
      cne: "",
      apogee: "",
      groupId: "",
      modules: [],
      subModules: [],
    };

    if (entity) {
      return {
        ...defaults,
        ...entity,
        hours: entity.hours ?? 0,
        nbrHours: entity.nbrHours ?? 0,
        moduleId: entity.moduleId ?? "",
        filiereId: entity.filiereId ?? "",
        modules: entity.modules?.map((m: any) => m.id || m) || [],
        subModules: entity.subModules?.map((sm: any) => sm.id || sm) || [],
      };
    }
    return defaults;
  });

  useEffect(() => {
    if (type === "edit" && entityType === "modules") {
      // Load unassigned submodules when editing a module
      const unassignedSubModules = subModules.filter((sm) => !sm.moduleId);
      setAvailableSubModulesForAssignment(unassignedSubModules);
    }
  }, [type, entityType, subModules]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "hours" || name === "nbrHours" ? Number(value) || 0 : value,
    }));
  };

  const handleAddSubModules = (subModuleIds: number[]) => {
    const newSubModules = [
      ...new Set([...formData.subModules, ...subModuleIds]),
    ];
    setFormData({
      ...formData,
      subModules: newSubModules,
    });
  };

  const handleRemoveSubModule = (subModuleId: number) => {
    const removedSubModule = subModules.find((sm) => sm.id === subModuleId);
    setFormData({
      ...formData,
      subModules: formData.subModules.filter(
        (id: number) => id !== subModuleId
      ),
    });

    // If the submodule was unassigned before being added, make it available again
    if (removedSubModule && !removedSubModule.moduleId) {
      setAvailableSubModulesForAssignment((prev) => [
        ...prev,
        removedSubModule,
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      hours: Number(formData.hours) || 0,
      nbrHours: Number(formData.nbrHours) || 0,
    };

    onSave(entityType, dataToSubmit);
  };

  const renderModuleFields = () => {
    const isEditMode = type === "edit";

    return (
      <>
        <div className={styles.formGroup}>
          <label>Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Code</label>
          <input
            type="text"
            name="code"
            value={formData.code || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Filière</label>
          <select
            name="filiereId"
            value={formData.filiereId || ""}
            onChange={handleChange}
            required>
            <option value="">Sélectionner une filière</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        {/* Current submodules */}
        <div className={styles.formGroup}>
          <label>Sous-modules actuels</label>
          <div className={styles.selectedItemsContainer}>
            {formData.subModules?.map((subModId: number) => {
              const subModule = subModules.find((sm) => sm.id === subModId);
              if (!subModule) return null;

              return (
                <div key={subModule.id} className={styles.selectedItem}>
                  <span>
                    {subModule.name} ({subModule.nbrHours}h)
                  </span>
                  {isEditMode && (
                    <Button
                      variant="delete"
                      onClick={() => handleRemoveSubModule(subModule.id)}>
                      ×
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submodule assignment (edit mode only) */}
        {isEditMode && (
          <div className={styles.formGroup}>
            <label>Attribuer des sous-modules disponibles</label>
            <div className={styles.selectionContainer}>
              <select
                multiple
                size={5}
                value={temporarilySelectedSubModules.map(String)}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  const values = options.map((opt) => Number(opt.value));
                  setTemporarilySelectedSubModules(values);
                }}>
                {availableSubModulesForAssignment.map((subModule) => (
                  <option key={subModule.id} value={subModule.id}>
                    {subModule.name} ({subModule.nbrHours}h)
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                onClick={() => {
                  if (temporarilySelectedSubModules.length > 0) {
                    handleAddSubModules(temporarilySelectedSubModules);
                    // Update available submodules list
                    setAvailableSubModulesForAssignment((prev) =>
                      prev.filter(
                        (sm) => !temporarilySelectedSubModules.includes(sm.id)
                      )
                    );
                    setTemporarilySelectedSubModules([]);
                  }
                }}
                disabled={temporarilySelectedSubModules.length === 0}>
                Attribuer
              </Button>
            </div>
          </div>
        )}

        {/* Associated professors (edit mode only) */}
        {isEditMode && (
          <div className={styles.formGroup}>
            <label>Professeurs associés</label>
            <div className={styles.selectedItemsContainer}>
              {professors
                .filter((prof) =>
                  prof.subModules?.some((sm) =>
                    formData.subModules?.includes(
                      typeof sm === "object" ? (sm as { id: number }).id : sm
                    )
                  )
                )
                .map((professor) => (
                  <div key={professor.id} className={styles.selectedItem}>
                    <span>
                      {professor.firstName} {professor.lastName}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderFormFields = () => {
    switch (entityType) {
      case "classrooms":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Nom de la salle</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Capacité</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity || 0}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Type de salle</label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                required>
                <option value="">Sélectionner un type</option>
                <option value="AMPHI">Amphithéâtre</option>
                <option value="SALLE_TD">Salle de TD</option>
                <option value="SALLE_TP">Salle de TP</option>
              </select>
            </div>
          </>
        );
      case "groups":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Filière</label>
              <select
                name="filiereId"
                value={formData?.filiereId || ""}
                onChange={handleChange}
                required>
                <option value="">Sélectionnez une filière</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "modules":
        return renderModuleFields();
      case "submodules":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Heures</label>
              <input
                type="number"
                name="nbrHours"
                value={formData.nbrHours}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Module parent</label>
              <select
                name="moduleId"
                value={formData.moduleId || ""}
                onChange={handleChange}
                required>
                <option value="">Sélectionner un module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "professors":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case "students":
        return (
          <>
            <div className={styles.formGroup}>
              <label>CNE</label>
              <input
                type="text"
                name="cne"
                value={formData.cne || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Apogée</label>
              <input
                type="text"
                name="apogee"
                value={formData.apogee || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Groupe</label>
              <select
                name="groupId"
                value={formData.groupId || ""}
                onChange={handleChange}>
                <option value="">Aucun groupe</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case "add":
        return `Ajouter ${entityType}`;
      case "edit":
        return `Modifier ${entity?.name || entityType}`;
      case "delete":
        return `Supprimer ${entity?.name || entityType}`;
      default:
        return `${entityType}`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      {type === "delete" ? (
        <div className={styles.deleteConfirmation}>
          <p>
            Êtes-vous sûr de vouloir supprimer {entity?.name || "cet élément"} ?
          </p>
          <p className={styles.warning}>Cette action est irréversible.</p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="delete" onClick={() => handleSubmit({} as React.FormEvent)}>
              Supprimer
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {type === "add" ? "Ajouter" : "Modifier"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CrudModal;
