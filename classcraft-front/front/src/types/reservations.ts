import type { ReservationType } from "./Enums/reservationType";
export interface Reservation {
    id: number;
    type: ReservationType;
    section_id: number;
    groupe_id: number;
    module_id: number;
    start_datetime: Date;
    end_datetime: Date;
    salle_id: number;
}