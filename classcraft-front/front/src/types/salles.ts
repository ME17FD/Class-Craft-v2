import type { SalleType } from "./Enums/salleType";

export interface SalleDto {
    id: number;
    name: string;
    type: SalleType;
    capacity: number;
}

export interface SalleRequestDto {
    name: string;
    type: SalleType;
    capacity: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}
