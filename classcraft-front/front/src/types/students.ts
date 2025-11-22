import type { UserRole } from "./Enums/userRoles";

export interface StudentDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    approved: boolean;
    groupeId: number | null;
}

export interface StudentRequestDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    approved?: boolean;
    groupeId?: number | null;
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

