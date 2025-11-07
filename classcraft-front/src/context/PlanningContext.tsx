import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Session, WeeklySchedule, DailyReport } from "../types/schedule";
import { getWeek } from "date-fns";
import { useApiData } from "../hooks/useApiData"; // Importez votre hook API

type PlanningContextType = {
  sessions: Session[];
  weeklySchedules: WeeklySchedule[];
  dailyReports: DailyReport[];
  selectedSession: Session | null;
  setSelectedSession: (session: Session | null) => void;
  addSession: (session: Session) => Promise<void>;
  updateSession: (session: Session) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
  generateWeeklySchedule: (groupId: number) => void;
  toggleProfessorPresence: (sessionId: number) => void;
  addDailyReport: (report: DailyReport) => void;
  validateDailyReport: (reportId: number) => void;
};

const PlanningContext = createContext<PlanningContextType | undefined>(
  undefined
);

export const PlanningProvider = ({ children }: { children: ReactNode }) => {
  const { seances, addSceance, updateSceance, deleteSceance } = useApiData();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  console.log("0Raw seances:", seances); 
  console.log("0Context sessions:", sessions);
  
  // Synchronise les sessions avec les données de l'API
  useEffect(() => {
    setSessions(seances);
    updateDailyReports(seances);
  }, [seances]);

  const addSession = useCallback(
    async (session: Session) => {
      try {
        const newSession = await addSceance(session);
        setSessions((prev) => [...prev, newSession]);
      } catch (error) {
        console.error("Failed to add session:", error);
        throw error;
      }
    },
    [addSceance]
  );
  // Add these debug logs right after your hooks

  const updateSession = useCallback(
    async (session: Session) => {
      try {
        await updateSceance(session);
        setSessions((prev) =>
          prev.map((s) => (s.id === session.id ? session : s))
        );
      } catch (error) {
        console.error("Failed to update session:", error);
        throw error;
      }
    },
    [updateSceance]
  );

  const deleteSession = useCallback(
    async (sessionId: number) => {
      try {
        await deleteSceance(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } catch (error) {
        console.error("Failed to delete session:", error);
        throw error;
      }
    },
    [deleteSceance]
  );

  const generateWeeklySchedule = useCallback(
    (groupId: number) => {
      const groupSessions = sessions.filter((s) => s.group?.id === groupId);
      if (groupSessions.length === 0 || !groupSessions[0].group) return;

      const newSchedule: WeeklySchedule = {
        id: Date.now(),
        group: groupSessions[0].group,
        sessions: groupSessions,
        weekNumber: getWeek(new Date(), { weekStartsOn: 1 }),
        semester: 1,
        academicYear: new Date().getFullYear().toString(),
      };
      setWeeklySchedules((prev) => [...prev, newSchedule]);
    },
    [sessions]
  );

  const toggleProfessorPresence = useCallback((sessionId: number) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, professorPresent: !session.professorPresent }
          : session
      )
    );
  }, []);

  const updateDailyReports = useCallback((allSessions: Session[]) => {
    // Group sessions by date (you might need to adjust this based on your Session type)
    const reportsByDate = allSessions.reduce((acc, session) => {
      const date = session.day || new Date().toISOString().split("T")[0]; // Use actual session date if available

      if (!acc[date]) acc[date] = [];
      acc[date].push({
        ...session,
        professorPresent: session.professorPresent ?? true,
      });
      return acc;
    }, {} as Record<string, Session[]>);

    setDailyReports(
      Object.entries(reportsByDate).map(([date, sessions]) => ({
        id: Date.now(),
        date,
        sessions,
        validated: false,
      }))
    );
  }, []);

  const addDailyReport = useCallback((report: DailyReport) => {
    setDailyReports((prev) => [...prev, report]);
  }, []);

  const validateDailyReport = useCallback((reportId: number) => {
    setDailyReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, validated: true } : report
      )
    );
  }, []);

  return (
    <PlanningContext.Provider
      value={{
        sessions,
        weeklySchedules,
        dailyReports,
        selectedSession,
        setSelectedSession,
        addSession,
        updateSession,
        deleteSession,
        generateWeeklySchedule,
        toggleProfessorPresence,
        addDailyReport,
        validateDailyReport,
      }}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning must be used within PlanningProvider");
  }
  return context;
};

export default PlanningContext;
