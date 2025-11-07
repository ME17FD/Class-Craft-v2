import React, { useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/FieldDetailsModal.module.css";
import { Field, Module, SubModule, Group, Professor } from "../../types/type";
import Button from "./Button";

interface FieldDetailsModalProps {
  field: Field;
  modules?: Module[];
  subModules?: SubModule[];
  groups?: Group[];
  professors?: Professor[];
  onClose: () => void;
}

const FieldDetailsModal: React.FC<FieldDetailsModalProps> = ({
  field,
  modules = [],
  subModules = [],
  groups = [],
  professors = [],
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  // Filtrer les modules de la filière
  const fieldModules = modules.filter(
    (module) => module.filiereId === field.id
  );

  // Pour chaque module, trouver ses sous-modules
  const modulesWithSubModules = fieldModules.map((module) => ({
    ...module,
    subModules: subModules.filter(
      (subModule) => subModule.moduleId === module.id
    ),
  }));

  // Pour chaque module, trouver les professeurs qui l'enseignent
  const modulesWithProfessors = modulesWithSubModules.map((module) => ({
    ...module,
    professors: professors.filter((professor) =>
      professor.modules?.includes(module.id || 0)
    ),
  }));

  // Trouver les groupes de la filière
  const fieldGroups = groups.filter((group) => group.filiereId === field.id);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{field.name}</h2>
            <p className={styles.description}>{field.description}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.content}>
          {/* Modules et leurs sous-modules */}
          <section className={styles.section}>
            <h3>Modules et Sous-modules</h3>
            <div className={styles.modulesList}>
              {modulesWithProfessors.map((module) => (
                <div key={module.id} className={styles.moduleCard}>
                  <div className={styles.moduleHeader}>
                    <h4>{module.name}</h4>
                    <span className={styles.moduleCode}>{module.code}</span>
                  </div>

                  {/* Sous-modules */}
                  <div className={styles.subModulesList}>
                    {module.subModules.map((subModule) => (
                      <div key={subModule.id} className={styles.subModuleItem}>
                        <span className={styles.subModuleName}>
                          {subModule.name}
                        </span>
                        <span className={styles.subModuleHours}>
                          {subModule.nbrHours}h
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Professeurs */}
                  <div className={styles.professorsList}>
                    <h5>Enseignants :</h5>
                    {module.professors.map((professor) => (
                      <div key={professor.id} className={styles.professorItem}>
                        {professor.firstName}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Groupes */}
          <section className={styles.section}>
            <h3>Groupes</h3>
            <div className={styles.groupsList}>
              {fieldGroups.map((group) => (
                <div key={group.id} className={styles.groupCard}>
                  <h4>{group.name}</h4>
                  <span className={styles.studentCount}>
                    {group.students?.length || 0} étudiants
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsModal;
