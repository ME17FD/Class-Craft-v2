import { useState, useEffect } from "react";
import { Group } from "../../types/type";
import { Session } from "../../types/schedule";
import { GroupScheduleModal } from "./GroupScheduleModal";
import styles from "../../styles/PlanningDashboard/GroupFormModal.module.css";
import { useApiData } from "../../hooks/useApiData";
import { usePlanning } from "../../context/PlanningContext";
import { SessionFormModal } from "./SessionFormModal";

type Props = {
  show: boolean;
  group?: Group;
  onHide: () => void;
  onSave: (group: Group) => void;
  onSaveSession: (session: Session) => void;
};

export const GroupFormModal = ({
  show,
  group,
  onHide,
  onSave,
  onSaveSession,
}: Props) => {
  const {
    modules = [],
    subModules = [],
    professors = [],
    rooms = [],
    seances = [],
  } = useApiData();
  const { sessions } = usePlanning();
  const [name, setName] = useState(group?.name || "");
  const [filiereId, setFiliereId] = useState(group?.filiereId || 0);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: group?.id || Date.now(),
      name,
      filiereId,
      students: group?.students || [],
    });
    onHide();
  };

  const handleTimeSlotClick = (day: string, time: string) => {
    const normalizedTime = time.padStart(5, "0");

    const existingSession = [...sessions, ...seances].find(
      (s) =>
        s.day === day &&
        (s.startTime || "").padStart(5, "0") === normalizedTime &&
        s.group?.id === group?.id
    );

    setSelectedDay(day);
    setSelectedTime(normalizedTime);
    setSelectedSession(existingSession || null);
    setShowSessionModal(true);
  };

  const handleAddSession = async (newSession: Session) => {
    try {
      const sessionToSave = {
        ...newSession,
        startTime: formatTimeForBackend(newSession.startTime || "08:00"),
        endTime: formatTimeForBackend(newSession.endTime || "09:00"),
        group: group || { id: 0, name: "", filiereId: 0, students: [] },
      };

      await onSaveSession(sessionToSave);
      setShowSessionModal(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la séance:", error);
    }
  };

  const formatTimeForBackend = (time: string): string => {
    if (!time) return "08:00:00";
    if (time.split(":").length === 3) return time;
    return `${time}:00`;
  };

  useEffect(() => {
    if (!show) {
      setShowSessionModal(false);
      setSelectedSession(null);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onHide}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{group ? "Modifier" : "Créer"} un groupe</h2>
          <button className={styles.closeButton} onClick={onHide}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nom du groupe</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Filière</label>
            <select
              value={filiereId}
              onChange={(e) => setFiliereId(Number(e.target.value))}
              required>
              <option value={0}>Sélectionnez une filière</option>
              <option value={1}>Informatique</option>
              <option value={2}>Mathématiques</option>
            </select>
          </div>

          {group && (
            <div className={styles.scheduleSection}>
              <h3>Emploi du temps</h3>
              <button
                type="button"
                className={styles.addSessionButton}
                onClick={() => {
                  setSelectedSession(null);
                  setShowSessionModal(true);
                }}>
                + Ajouter une séance
              </button>
              <GroupScheduleModal
                group={group}
                sessions={[...sessions, ...seances]
                  .filter((s) => s.group?.id === group.id)
                  .map((s) => ({
                    ...s,
                    startTime: (s.startTime || "").includes(":")
                      ? s.startTime || ""
                      : `${s.startTime || ""}:00`,
                    endTime: (s.endTime || "").includes(":")
                      ? s.endTime || ""
                      : `${s.endTime || ""}:00`,
                  }))}
                onClose={onHide}
                onTimeSlotClick={handleTimeSlotClick}
              />
            </div>
          )}

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onHide}>
              Annuler
            </button>
            <button type="submit" className={styles.saveButton}>
              Sauvegarder
            </button>
          </div>
        </form>

        {showSessionModal && (
          <SessionFormModal
            session={selectedSession}
            day={selectedDay}
            time={selectedTime}
            group={group || { id: 0, name: "", filiereId: 0, students: [] }}
            modules={modules}
            subModules={subModules}
            professors={professors}
            rooms={rooms}
            existingSessions={[...sessions, ...seances]}
            onClose={() => setShowSessionModal(false)}
            onSave={handleAddSession}
          />
        )}
      </div>
    </div>
  );
};
