import { useState, useEffect } from "react";
import { Module, SubModule, Professor, Group } from "../../types/type";
import { Room, Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/GroupFormModal.module.css";

// Session type enum mapping
const SessionType = {
  CM: 0,
  TD: 1,
  TP: 2
} as const;

type SessionTypeValue = typeof SessionType[keyof typeof SessionType];

interface SessionFormModalProps {
  session: Session | null;
  day: string;
  time: string;
  group: Group;
  modules: Module[];
  subModules: SubModule[];
  professors: Professor[];
  rooms: Room[];
  existingSessions: Session[];
  onClose: () => void;
  onSave: (session: Session) => void;
}

export const SessionFormModal = ({
  session,
  day,
  time,
  group,
  onClose,
  onSave,
  modules = [],
  subModules = [],
  rooms = [],
}: SessionFormModalProps) => {
  const [selectedModule, setSelectedModule] = useState(
    session?.module?.id?.toString() || ""
  );
  const [selectedSubModule, setSelectedSubModule] = useState(
    session?.subModule?.id?.toString() || ""
  );
  const [selectedRoom, setSelectedRoom] = useState(session?.classroom?.id?.toString() || "");
  const [selectedType, setSelectedType] = useState<SessionTypeValue>(
    session?.type === 'CM' ? 0 : 
    session?.type === 'TD' ? 1 : 
    session?.type === 'TP' ? 2 : 0
  );
  const [frequency, setFrequency] = useState(session?.frequency || 1);
  const [wasAttended, setWasAttended] = useState(session?.wasAttended || false);

  // Format time for backend
  const formatTimeForBackend = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  };

  // Calculate end time (always 1 hour after start time)
  const calculateEndTime = (start: string) => {
    const [h, m] = start.split(":").map(Number);
    const totalMinutes = h * 60 + m + 60; // Add 1 hour
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, "0")}:${endM
      .toString()
      .padStart(2, "0")}`;
  };

  // Convert day to English format
  const formatDayOfWeek = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      'lundi': 'Monday',
      'mardi': 'Tuesday',
      'mercredi': 'Wednesday',
      'jeudi': 'Thursday',
      'vendredi': 'Friday',
      'samedi': 'Saturday',
      'dimanche': 'Sunday',
      'Lundi': 'Monday',
      'Mardi': 'Tuesday',
      'Mercredi': 'Wednesday',
      'Jeudi': 'Thursday',
      'Vendredi': 'Friday',
      'Samedi': 'Saturday',
      'Dimanche': 'Sunday'
    };
    return dayMap[day] || day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (selectedSubModule) {
      // No need to set professor as it will be handled by the backend
    }
  }, [selectedSubModule, subModules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedMod = modules.find((m) => m.id === Number(selectedModule));
      const selectedSubMod = subModules.find(
        (sm) => sm.id === Number(selectedSubModule)
      );
      const selectedRoomObj = rooms.find((r) => r.id === Number(selectedRoom));

      if (!selectedMod || !selectedRoomObj) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      const sessionType = selectedType === 0 ? 'CM' as const : 
                         selectedType === 1 ? 'TD' as const : 
                         'TP' as const;

      const sessionData: Session = {
        id: session?.id || 0,
        dayOfWeek: formatDayOfWeek(day),
        startTime: formatTimeForBackend(time),
        endTime: formatTimeForBackend(calculateEndTime(time)),
        frequency: frequency,
        wasAttended: wasAttended,
        type: sessionType,
        group: { id: group.id || 0, name: group.name || '' },
        subModule: selectedSubMod ? {
          id: selectedSubMod.id,
          name: selectedSubMod.name,
          nbrHours: selectedSubMod.nbrHours,
          moduleId: selectedMod.id || 0,
          professor: selectedSubMod.professor
        } : undefined,
        module: {
          id: selectedMod.id,
          name: selectedMod.name,
          code: selectedMod.code || '',
          filiereId: selectedMod.filiereId || null
        },
        professor: selectedSubMod?.professor,
        classroom: {
          id: selectedRoomObj.id,
          name: selectedRoomObj.name,
          capacity: selectedRoomObj.capacity,
          type: selectedRoomObj.type || ''
        }
      };

      console.log('Sending session data:', JSON.stringify(sessionData, null, 2));
      onSave(sessionData);
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la séance:", error);
      const errorMessage = error.response?.data?.message || error.message || "Une erreur est survenue lors de l'enregistrement";
      alert(`Erreur lors de l'enregistrement: ${errorMessage}`);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            {session ? "Modifier" : "Créer"} une séance - {day} {time}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Type de séance</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(Number(e.target.value) as SessionTypeValue)}
                required>
                <option value="">Sélectionner un type</option>
                <option value={SessionType.CM}>CM</option>
                <option value={SessionType.TD}>TD</option>
                <option value={SessionType.TP}>TP</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Module</label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setSelectedSubModule("");
                }}
                required>
                <option value="">Sélectionner un module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Sous-module (optionnel)</label>
              <select
                value={selectedSubModule}
                onChange={(e) => setSelectedSubModule(e.target.value)}
                disabled={!selectedModule}>
                <option value="">
                  Sélectionner un sous-module (optionnel)
                </option>
                {subModules
                  .filter((sm) => sm.moduleId === Number(selectedModule))
                  .map((subModule) => (
                    <option key={subModule.id} value={subModule.id}>
                      {subModule.name} ({subModule.nbrHours}h)
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Salle</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required>
                <option value="">Sélectionner une salle</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.type})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Fréquence (en semaines)</label>
              <input
                type="number"
                min="1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={wasAttended}
                  onChange={(e) => setWasAttended(e.target.checked)}
                />
                Séance effectuée
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className={styles.saveButton}>
              {session ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionFormModal;
