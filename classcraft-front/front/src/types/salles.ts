import type { SalleType } from "./Enums/salleType";

export interface Salle {
    id: number;
    nom: string;
    type: SalleType;
    capacity: number;
}