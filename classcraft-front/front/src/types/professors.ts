import type { UserRole } from "./Enums/userRoles";
import type { ModuleDto } from "./modules";
import type { SousModuleDto } from "./sousModules";

export interface ProfessorDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    approved: boolean;
    groupeId: number | null;
}

export interface ProfessorRequestDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    approved?: boolean;
    groupeId?: number | null;
}

export interface ProfessorWithCourses {
    professor: ProfessorDto;
    modules: ModuleDto[];
    sousModules: SousModuleDto[];
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

