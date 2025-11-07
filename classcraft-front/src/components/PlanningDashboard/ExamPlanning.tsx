import { useState, useEffect } from "react";
import { useApiData } from "../../hooks/useApiData";
import { usePlanningData, ReservationType } from "../../hooks/usePlanningData";
import { ExamsCard } from "./ExamsCard";
import { ExamModal } from "./ExamModal";
import { MakeupModal } from "./RattrapageModal";
import { ExamScheduleModal } from "./ExamScheduleModal";
import { MakeupScheduleModal } from "./RattrapageScheduleModal";
import { ExamSession } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Group } from "../../types/type";

export const ExamPlanning = () => {
  const { groups = [] } = useApiData();
  const { reservations = [], setReservations } = usePlanningData();
  const [selectedExam, setSelectedExam] = useState<ExamSession | null>(null);
  const [selectedMakeup, setSelectedMakeup] = useState<ExamSession | null>(null);
  const [selectedGroupForExamSchedule, setSelectedGroupForExamSchedule] =
    useState<Group | null>(null);
  const [selectedGroupForMakeupSchedule, setSelectedGroupForMakeupSchedule] =
    useState<Group | null>(null);
  const [, setSelectedTimeSlot] = useState<{
    day: string;
    time: string;
    type: ReservationType;
  } | null>(null);

  // Add debug logging for reservations
  useEffect(() => {
    console.log("Current reservations:", reservations);
  }, [reservations]);

  const handleCreateNewExam = (group: Group, type: ReservationType = ReservationType.EXAM) => {
    const newExam: ExamSession = {
      id: 0,
      type,
      startDateTime: new Date().toISOString(),
      endDateTime: new Date(Date.now() + (type === ReservationType.EXAM ? 2 : 1.5) * 60 * 60 * 1000).toISOString(),
      wasAttended: false,
      groupId: group.id || null,
      groupName: group.name || null,
      classroomId: 0,
      subModuleId: 0
    };
    setSelectedExam(newExam);
  };

  const handleTimeSlotClick = (
    day: string,
    time: string,
    type: ReservationType
  ) => {
    setSelectedTimeSlot({ day, time, type });

    // Trouver la session existante
    const group =
      type === ReservationType.EXAM
        ? selectedGroupForExamSchedule
        : selectedGroupForMakeupSchedule;
    const existingSession = reservations.find(
      (s) =>
        s.groupId === group?.id &&
        s.type === type &&
        new Date(s.startDateTime!).toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase() === day.toLowerCase() &&
        new Date(s.startDateTime!).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) === time
    );

    if (existingSession) {
      type === ReservationType.EXAM
        ? setSelectedExam(existingSession as ExamSession)
        : setSelectedMakeup(existingSession as ExamSession);
    } else {
      // Créer une nouvelle session
      const startDate = new Date();
      startDate.setHours(parseInt(time.split(':')[0]));
      startDate.setMinutes(parseInt(time.split(':')[1]));
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + (type === ReservationType.EXAM ? 2 : 1.5));

      const newSession: ExamSession = {
        id: 0,
        type,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        wasAttended: false,
        groupId: group?.id || null,
        groupName: group?.name || null,
        classroomId: 0,
        subModuleId: 0
      };
      type === ReservationType.EXAM
        ? setSelectedExam(newSession)
        : setSelectedMakeup(newSession);
    }
  };

  const handleSaveExam = async (savedExam: ExamSession) => {
    try {
      console.log("Saving exam:", savedExam);
      
      // Update local state with the saved exam
      setReservations((prev: ExamSession[]) => {
        console.log("Previous reservations:", prev);
        const examId = Number(savedExam.id);
        
        // Check if this exam already exists in the state
        const existingExamIndex = prev.findIndex(
          reservation => Number(reservation.id) === examId
        );

        const updated = existingExamIndex === -1
          ? [...prev, savedExam]  // Add new exam
          : prev.map((reservation: ExamSession) => 
              Number(reservation.id) === examId ? savedExam : reservation
            );  // Update existing exam
        
        console.log("Updated reservations:", updated);
        return updated;
      });

      // Close modals after state update
      setSelectedExam(null);
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error("Failed to update local state:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Examens et Rattrapages par Groupe</h1>

      <div className={styles.groupExamsGrid}>
        {groups.map((group) => {
          // Ensure we're working with numbers for IDs
          const groupId = Number(group.id);
          const groupSessions = reservations.filter(
            (s) => Number(s.groupId) === groupId
          );
          console.log(`Group ${group.name} sessions:`, groupSessions);
          const exams = groupSessions.filter((s) => s.type === ReservationType.EXAM);
          const makeups = groupSessions.filter((s) => s.type === ReservationType.RATTRAPAGE);
          console.log(`Group ${group.name} exams:`, exams);
          console.log(`Group ${group.name} makeups:`, makeups);

          return (
            <ExamsCard
              key={groupId}
              group={group}
              exams={exams}
              makeups={makeups}
              onExamClick={(exam) => setSelectedExam(exam)}
              onMakeupClick={() => setSelectedGroupForMakeupSchedule(group)}
              onCreateExamClick={() => handleCreateNewExam(group)}
            />
          );
        })}
      </div>

      {/* Modal pour le planning des examens */}
      {selectedGroupForExamSchedule && (
        <ExamScheduleModal
          group={selectedGroupForExamSchedule}
          sessions={reservations.filter(
            (s) =>
              s.groupId === selectedGroupForExamSchedule.id &&
              s.type === ReservationType.EXAM
          )}
          onClose={() => setSelectedGroupForExamSchedule(null)}
          onTimeSlotClick={(day, time) =>
            handleTimeSlotClick(day, time, ReservationType.EXAM)
          }
        />
      )}

      {/* Modal pour le planning des rattrapages */}
      {selectedGroupForMakeupSchedule && (
        <MakeupScheduleModal
          group={selectedGroupForMakeupSchedule}
          sessions={reservations.filter(
            (s) =>
              s.groupId === selectedGroupForMakeupSchedule.id &&
              s.type === ReservationType.RATTRAPAGE
          )}
          onClose={() => setSelectedGroupForMakeupSchedule(null)}
          onTimeSlotClick={(day, time) =>
            handleTimeSlotClick(day, time, ReservationType.RATTRAPAGE)
          }
        />
      )}

      {/* Modal pour la modification/création d'examen */}
      {selectedExam && (
        <ExamModal
          exam={selectedExam}
          group={groups.find(g => g.id === selectedExam.groupId) || groups[0]}
          rooms={[]}
          onClose={() => {
            setSelectedExam(null);
            setSelectedTimeSlot(null);
          }}
          onSave={handleSaveExam}
        />
      )}

      {/* Modal pour la modification/création de rattrapage */}
      {selectedMakeup && (
        <MakeupModal
          makeup={selectedMakeup}
          rooms={[]}
          onClose={() => {
            setSelectedMakeup(null);
            setSelectedTimeSlot(null);
          }}
          onSave={(updatedMakeup) => {
            console.log("Rattrapage sauvegardé:", updatedMakeup);
            setSelectedMakeup(null);
            setSelectedTimeSlot(null);
          }}
        />
      )}
    </div>
  );
};

export default ExamPlanning;
