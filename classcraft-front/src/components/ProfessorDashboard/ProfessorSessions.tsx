import React, { useMemo } from "react";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import * as XLSX from "xlsx";
import { Session } from "../../types/schedule";
import { FiDownload } from "react-icons/fi";

interface ProfessorSessionsProps {
  professor: {
    id: number;
    firstName: string;
    lastName: string;
  };
  sessions: Session[];
}

const dayTranslations: Record<string, string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
  SUNDAY: "Dimanche",
};

const weekDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const ProfessorSessions: React.FC<ProfessorSessionsProps> = ({
  professor,
  sessions,
}) => {
  const normalizeTime = (time: string) => {
    if (!time || !time.includes(":")) return "00:00";
    const [h, m] = time.split(":").map((t) => t.padStart(2, "0"));
    return `${h}:${m}`;
  };

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

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => s.professor?.id === professor.id);
  }, [sessions, professor.id]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSessions.map((s) => ({
        Jour:
          dayTranslations[(s.dayOfWeek?.toUpperCase() || '')] ||
          dayTranslations[(s.day?.toUpperCase() || '')] ||
          s.dayOfWeek ||
          s.day,
        "Heure Début": s.startTime?.slice(0, 5),
        "Heure Fin": s.endTime?.slice(0, 5),
        Module: s.module?.name || s.subModule?.name,
        Type: s.type,
        Groupe: s.group?.name || "Non spécifié",
        Salle: s.classroom?.name || "Non spécifiée",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Emploi du temps");
    XLSX.writeFile(workbook, `emploi-du-temps-${professor.lastName}.xlsx`);
  };

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleHeader}>
        <h2>
          Emploi du temps - Professeur {professor.firstName}{" "}
          {professor.lastName}
        </h2>
        <button onClick={exportToExcel} className={styles.excelButton}>
          <FiDownload /> Export Excel
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
          const daySessions = filteredSessions.filter((s) => {
            const sessionDay =
              s.day?.toUpperCase?.() || s.dayOfWeek?.toUpperCase?.();
            return sessionDay === day;
          });

          return (
            <div key={`day-${day}`} className={styles.dayColumn}>
              <div className={styles.dayHeader}>
                {dayTranslations[day] || day}
              </div>

              {timeSlots.slice(1).map((time) => {
                const normalizedTime = normalizeTime(time);
                const session = daySessions.find((s) => {
                  const start = normalizeTime(s.startTime || '');
                  const end = normalizeTime(s.endTime || '');
                  return start <= normalizedTime && normalizedTime < end;
                });

                return (
                  <div
                    key={`${day}-${time}`}
                    className={`${styles.timeSlot} ${
                      session ? styles.occupied : ""
                    }`}>
                    {session && (
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
                            <strong>Groupe:</strong>{" "}
                            {session.group?.name || "Non spécifié"}
                          </div>
                          <div>
                            <strong>Salle:</strong>{" "}
                            {session.classroom?.name || "Non spécifiée"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessorSessions;
