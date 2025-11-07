import { Room, ExamSession } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import { ReservationType } from "../../hooks/usePlanningData";

interface MakeupModalProps {
  makeup: ExamSession;
  rooms: Room[];
  onClose: () => void;
  onSave: (makeup: ExamSession) => void;
}

export const MakeupModal = ({ makeup, rooms, onClose, onSave }: MakeupModalProps) => {
  const {
    subModules = [],
  } = useApiData();
  const [editedMakeup, setEditedMakeup] = useState({
    ...makeup,
    type: ReservationType.RATTRAPAGE
  });
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms.find(r => r.id === makeup.classroomId)?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof ExamSession, value: any) => {
    setEditedMakeup((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedRoomObj = rooms.find(r => r.name === selectedRoom);
      const updatedMakeup = {
        ...editedMakeup,
        classroomId: selectedRoomObj?.id || 0,
        type: ReservationType.RATTRAPAGE
      };

      onSave(updatedMakeup);
      onClose();
    } catch (err) {
      console.error("Failed to save makeup:", err);
      setError("Une erreur est survenue lors de la sauvegarde du rattrapage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{makeup.id ? "Modifier" : "Créer"} un rattrapage</h2>
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
            {/* Module */}
            <div className={styles.formGroup}>
              <label>Module</label>
              <select
                value={editedMakeup.subModuleId || ""}
                onChange={(e) => {
                  const subModule = subModules.find(
                    (sm) => sm.id === Number(e.target.value)
                  );
                  if (subModule) {
                    handleChange("subModuleId", subModule.id);
                  }
                }}
                required>
                <option value="">Sélectionner un module</option>
                {subModules.map((subModule) => (
                  <option key={subModule.id} value={subModule.id}>
                    {subModule.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date et heure */}
            <div className={styles.formGroup}>
              <label>Date et heure</label>
              <input
                type="datetime-local"
                value={new Date(editedMakeup.startDateTime).toISOString().slice(0, 16)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleChange("startDateTime", date.toISOString());
                  // Set end time (1.5 hours for makeup)
                  const endDate = new Date(date.getTime() + 1.5 * 60 * 60 * 1000);
                  handleChange("endDateTime", endDate.toISOString());
                }}
                required
              />
            </div>

            {/* Salle */}
            <div className={styles.formGroup}>
              <label>Salle</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
              >
                <option value="">Sélectionner une salle</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
