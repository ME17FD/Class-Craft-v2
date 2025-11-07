import { Session } from "../../types/schedule";
import { Group } from "../../types/type";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import * as XLSX from "xlsx";
import { usePlanning } from "../../context/PlanningContext";
import { useApiData } from "../../hooks/useApiData";
import { useMemo, useEffect } from "react";
import { PDFGenerator } from "./PDFGenerator";

type Props = {
  group: Group | null;
  sessions: Session[];
  onClose: () => void;
  onTimeSlotClick: (day: string, time: string) => void;
};

const exportToExcel = (sessions: Session[], groupName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    sessions.map((s) => ({
      Jour: s.day || s.dayOfWeek,
      Heure: `${s.startTime} - ${s.endTime}`,
      Module: s.module?.name || s.subModule?.name,
      Type: s.type,
      Professeur: s.professor?.firstName,
      Salle: s.classroom?.name || "Non spécifiée",
      Durée: `${s.duration}h`,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planning");
  XLSX.writeFile(workbook, `emploi-du-temps-${groupName}.xlsx`);
};

export const GroupScheduleModal = ({
  group,
  onClose,
  onTimeSlotClick,
}: Props) => {
  const { seances } = useApiData();
  const { sessions: planningSessions } = usePlanning();

  const normalizeTime = (time: string) => {
    if (!time || !time.includes(":")) return "00:00";
    const [h, m] = time.split(":").map((t) => t.padStart(2, "0"));
    return `${h}:${m}`;
  };

  const groupSessions = useMemo(() => {
    const allSessions = [...seances, ...planningSessions];
    if (!group) return [];
    return allSessions.filter((s) => s.group?.id === group.id);
  }, [seances, planningSessions, group]);

  const timeSlots = useMemo(
    () => [
      "",
      ...Array.from(
        { length: 11 },
        (_, i) => `${(8 + i).toString().padStart(2, "0")}:00`
      ),
    ],
    []
  );

  const weekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const dayTranslations: Record<string, string> = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
  };
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            Emploi du temps - {group?.name} (ID: {group?.id})
          </h2>
          <div className={styles.exportButtons}>
            <PDFGenerator
              data={{
                type: "group",
                group: group,
                sessions: groupSessions,
              }}
            />
            <button
              onClick={() =>
                exportToExcel(groupSessions, group?.name || "Groupe")
              }
              className={styles.excelButton}>
              Export Excel
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.scheduleGrid}>
          <div className={styles.timeColumn}>
            {timeSlots.map((time, i) => (
              <div key={`time-${i}`} className={styles.timeCell}>
                {i === 0 ? "" : time}
              </div>
            ))}
          </div>

          {weekDays.map((day) => {
            const daySessions = groupSessions.filter(
              (s) =>
                (s.day || "").toUpperCase() === day ||
                (s.dayOfWeek || "").toUpperCase() === day
            );

            return (
              <div key={`day-${day}`} className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  {dayTranslations[day] || day}
                </div>

                {timeSlots.slice(1).map((time) => {
                  const normalizedTime = normalizeTime(time);
                  const session = daySessions.find((s) => {
                    const start = normalizeTime(s.startTime || "");
                    const end = normalizeTime(s.endTime || "");
                    return start <= normalizedTime && normalizedTime < end;
                  });

                  const slotKey = session
                    ? `sess-${session.id}-${day}-${normalizedTime.replace(
                        ":",
                        ""
                      )}`
                    : `empty-${day}-${normalizedTime.replace(":", "")}`;

                  return (
                    <div
                      key={slotKey}
                      className={`${styles.timeSlot} ${
                        session ? styles.occupied : ""
                      }`}
                      onClick={() => onTimeSlotClick(day, time)}>
                      {session ? (
                        <div className={styles.sessionContent}>
                          <div className={styles.sessionTitle}>
                            {session.module?.name ||
                              session.subModule?.name ||
                              "Cours"}
                            <span className={styles.sessionType}>
                              {" - " + session.type}
                            </span>
                          </div>
                          <div className={styles.sessionDetails}>
                            <div>
                              <strong>Salle:</strong>{" "}
                              {session.classroom?.name || "Non spécifiée"}
                            </div>
                            <div>
                              <strong>Prof:</strong>{" "}
                              {session.professor ? (
                                <>
                                  {session.professor.firstName}{" "}
                                  {session.professor.lastName}
                                  <span
                                    className={
                                      session.professorPresent
                                        ? styles.present
                                        : styles.absent
                                    }>
                                    <strong> Présence:</strong>{" "}
                                    {session.professorPresent ? "✔" : "✖"}
                                  </span>
                                </>
                              ) : (
                                "Non assigné"
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GroupScheduleModal;
