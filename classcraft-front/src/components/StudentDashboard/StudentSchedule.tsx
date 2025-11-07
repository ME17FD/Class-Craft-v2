import { Session } from "../../types/schedule";
import { Group } from "../../types/type";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import * as XLSX from "xlsx";
import { usePlanning } from "../../context/PlanningContext";
import { useApiData } from "../../hooks/useApiData";
import { useMemo } from "react";

type Props = {
  group: Group | null;
  student: {
    id: number;
    groupId: number | null;
  };
};

const exportToExcel = (sessions: Session[], groupName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    sessions.map((s) => ({
      Jour: s.day || s.dayOfWeek,
      Heure: `${s.startTime} - ${s.endTime}`,
      Module: s.module?.name || s.subModule?.name,
      Type: s.type,
      Professeur: s.professor?.firstName || "Non spécifié",
      Salle: s.classroom?.name || "Non spécifiée",
      Durée: `${s.duration}h`,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planning");
  XLSX.writeFile(workbook, `emploi-du-temps-${groupName}.xlsx`);
};

export const StudentSchedule = ({ group, student }: Props) => {
  const { seances } = useApiData();
  const { sessions } = usePlanning();

  const normalizeTime = (time: string) => {
    if (!time || !time.includes(":")) return "00:00";
    const [h, m] = time.split(":").map((t) => t.padStart(2, "0"));
    return `${h}:${m}`;
  };

  const studentSessions = useMemo(() => {
    const allSessions = [...seances, ...sessions];
    return allSessions.filter((s) => s.group?.id === group?.id);
  }, [seances, sessions, group, student.id]);

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

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleHeader}>
        <h2>
          Emploi du temps - Group :{group?.name || "(Vous n'êtes pas assigné) "}
        </h2>
        <button
          onClick={() =>
            exportToExcel(studentSessions, group?.name || "Étudiant")
          }
          className={styles.excelButton}>
          Export Excel
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
          const daySessions = studentSessions.filter(
            (s) =>
              s.day?.toUpperCase() === day || s.dayOfWeek?.toUpperCase() === day
          );

          return (
            <div key={`day-${day}`} className={styles.dayColumn}>
              <div className={styles.dayHeader}>
                {dayTranslations[day] || day}
              </div>

              {timeSlots.slice(1).map((time) => {
                const normalizedTime = normalizeTime(time);
                const session = daySessions.find((s) => {
                  const start = normalizeTime(s.startTime ||"");
                  const end = normalizeTime(s.endTime||"");
                  return start <= normalizedTime && normalizedTime < end;
                });

                return (
                  <div
                    key={`${day}-${normalizedTime}`}
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
                            <strong>Salle:</strong>{" "}
                            {session.classroom?.name || "Non spécifiée"}
                          </div>
                          <div>
                            <strong>Prof:</strong>{" "}
                            {session.professor?.firstName || ""}{" "}
                            {session.professor?.lastName || ""}
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

export default StudentSchedule;
