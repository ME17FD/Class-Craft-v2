import { Group, Professor, Module, SubModule, Field , Student, Classroom} from './type';
import { ReservationType } from '../hooks/usePlanningData';

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    field?:Field;
    room?: Classroom;
    group?: Group;
    professor?: Professor;
    seances?:Session;
    type: string;
    wasAttended?: boolean;
  };
}
// Type pour une séance
export interface Session {
    id: number;
    startDateTime?: string;
    endDateTime?: string;
    wasAttended: boolean;
    subModuleId?: number;
    groupId?: number | null;
    classroomId?: number;
    frequency?: number;
    submodule?: {
        id: number;
        name: string;
        nbrHours: number;
        moduleId: number;
        moduleName: string;
        teacherId: number;
        teacher: Professor;
    };
    groupName?: string | null;
    type: 'CM' | 'TD' | 'TP' | ReservationType;
    
    // Legacy fields
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    day?: string;
    professor?: Professor;
    module?: Module;
    subModule?: SubModule;
    classroom?: Room;
    group?: Group;
    student?: Student;
    professorPresent?: boolean;
    duration?: number;
}

// Type pour un emploi du temps hebdomadaire
export interface WeeklySchedule {
    id: number;
    group: Group;
    sessions: Session[];
    weekNumber: number; // Numéro de la semaine
    semester: number; // 1 ou 2
    academicYear: string; // Format: "2023-2024"
}

// Type pour un emploi du temps de filière
export interface FieldSchedule {
    id: number;
    field: Field;
    weeklySchedules: WeeklySchedule[];
    semester: number;
    academicYear: string;
}

export interface DailyReport {
    id: number;
    date: string; // Format: "YYYY-MM-DD" (ex: "2023-03-15")
    sessions: Session[];
    validated?: boolean; // Si le rapport a été validé
    createdAt?: string; // Date de création du rapport
    updatedAt?: string; // Date de modification
}

export interface DailyPlanning {
    date: string;
    rooms: RoomOccupation[];
}

export interface RoomOccupation {
    room: string;
    timeSlots: {
        start: string;
        end: string;
        session: Session | null;
    }[];
}

// Type pour les salles
export interface Room {
    id: number;
    name: string;
    capacity: number;
    type?: string;
}

export interface ExamSession {
    id: number;
    startDateTime: string;
    endDateTime: string;
    wasAttended: boolean;
    groupId: number | null;
    groupName: string | null;
    classroomId: number;
    subModuleId: number;
    type: ReservationType;
    submodule?: {
        id: number;
        name: string;
        nbrHours: number;
        moduleId: number;
        moduleName: string;
        teacherId: number;
        teacher: Professor;
    };
    classroom?: {
        id: number;
        name: string;
        capacity: number;
        type: string;
    };
}








