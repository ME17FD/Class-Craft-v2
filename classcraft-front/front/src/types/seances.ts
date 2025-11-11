import type { ReservationType } from "./Enums/reservationType";

export interface Seance {
    id: number;
    module_id: number;
    start_time: string;     // "HH:mm"
    end_time: string;       // "HH:mm"
    day_of_week: string;
    type: ReservationType;
    salle_id: number;
    groupe_id: number;
    section_id: number;
}