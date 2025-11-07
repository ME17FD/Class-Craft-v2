import { Room, ExamSession } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import { usePlanningData, ReservationType } from "../../hooks/usePlanningData";
import { Group } from "../../types/type";

interface ExamModalProps {
  exam: ExamSession;
  rooms: Room[];
  group: Group;
  onClose: () => void;
  onSave: (exam: ExamSession) => void;
}

export const ExamModal = ({ exam, group, onClose, onSave }: ExamModalProps) => {
  const {
    modules = [],
    subModules = [],
    rooms = [],
  } = useApiData();
  const { createReservation, updateReservation } = usePlanningData();
  const [editedExam, setEditedExam] = useState(exam);
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms.find(r => r.id === exam.classroomId)?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter submodules by group's filiere
  const filteredSubModules = subModules.filter(subModule => {
    const module = modules.find(m => m.id === subModule.moduleId);
    return module?.filiereId === group.filiereId;
  });

  const handleChange = (field: keyof ExamSession, value: any) => {
    setEditedExam((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when it's changed
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editedExam.subModuleId) {
      errors.subModuleId = "Le module est requis";
    }
    if (!selectedRoom) {
      errors.classroomId = "La salle est requise";
    }
    if (!editedExam.startDateTime) {
      errors.startDateTime = "La date et l'heure sont requises";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedRoomObj = rooms.find(r => r.name === selectedRoom);
      const updatedExam = {
        ...editedExam,
        classroomId: selectedRoomObj?.id || 0,
      };

      // Call createReservation/updateReservation and wait for the response
      const savedExam = await (updatedExam.id ? updateReservation(updatedExam) : createReservation(updatedExam));
      
      // Only call onSave and close after we have the saved exam
      if (savedExam) {
        onSave(savedExam);
        onClose();
      } else {
        throw new Error("Failed to save exam");
      }
    } catch (err: any) {
      console.error("Failed to save exam:", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de la sauvegarde de l'examen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{exam.id ? "Modifier" : "Créer"} un examen</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Type d'examen */}
            <div className={styles.formGroup}>
              <label>Type d'examen</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="examType"
                    value={ReservationType.EXAM}
                    checked={editedExam.type === ReservationType.EXAM}
                    onChange={(e) => handleChange("type", e.target.value)}
                  />
                  Examen Normal
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="examType"
                    value={ReservationType.RATTRAPAGE}
                    checked={editedExam.type === ReservationType.RATTRAPAGE}
                    onChange={(e) => handleChange("type", e.target.value)}
                  />
                  Rattrapage
                </label>
              </div>
            </div>

            {/* Module */}
            <div className={styles.formGroup}>
              <label>Module</label>
              <select
                value={editedExam.subModuleId || ""}
                onChange={(e) => {
                  const subModule = filteredSubModules.find(
                    (sm) => sm.id === Number(e.target.value)
                  );
                  if (subModule) {
                    handleChange("subModuleId", subModule.id);
                  }
                }}
                className={formErrors.subModuleId ? styles.error : ""}
                required>
                <option value="">Sélectionner un module</option>
                {filteredSubModules.map((subModule) => (
                  <option key={subModule.id} value={subModule.id}>
                    {subModule.name}
                  </option>
                ))}
              </select>
              {formErrors.subModuleId && (
                <span className={styles.fieldError}>{formErrors.subModuleId}</span>
              )}
            </div>

            {/* Date et Heure */}
            <div className={styles.formGroup}>
              <label>Date et Heure de début</label>
              <input
                type="datetime-local"
                value={editedExam.startDateTime ? new Date(editedExam.startDateTime).toISOString().slice(0, 16) : ""}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleChange("startDateTime", date.toISOString());
                  // Set end time based on exam type (2 hours for normal exam, 1.5 hours for makeup)
                  const duration = editedExam.type === ReservationType.EXAM ? 2 : 1.5;
                  const endDate = new Date(date.getTime() + duration * 60 * 60 * 1000);
                  handleChange("endDateTime", endDate.toISOString());
                }}
                className={formErrors.startDateTime ? styles.error : ""}
                required
              />
              {formErrors.startDateTime && (
                <span className={styles.fieldError}>{formErrors.startDateTime}</span>
              )}
            </div>

            {/* Salle */}
            <div className={styles.formGroup}>
              <label>Salle</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className={formErrors.classroomId ? styles.error : ""}
                required>
                <option value="">Sélectionner une salle</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name} ({room.type})
                  </option>
                ))}
              </select>
              {formErrors.classroomId && (
                <span className={styles.fieldError}>{formErrors.classroomId}</span>
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}>
              Annuler
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : (exam.id ? "Mettre à jour" : "Créer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
