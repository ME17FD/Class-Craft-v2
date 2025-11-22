export interface Seance {
    id: number;
    moduleId: number;
    startTime: string;     // "HH:mm"
    endTime: string;       // "HH:mm"
    dayOfWeek: string;
    salleId: number;
    groupeId: number;
    sectionId: number;
}