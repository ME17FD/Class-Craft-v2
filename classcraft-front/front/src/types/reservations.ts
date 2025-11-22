import type { ReservationType } from "./Enums/reservationType";

export interface Reservation {
    id: number;
    type: ReservationType;
    sectionId: number;
    groupeId: number;
    moduleId: number;
    startDateTime: Date;
    endDateTime: Date;
    salleId: number;
}