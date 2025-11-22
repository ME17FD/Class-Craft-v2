import type { ModuleDto } from "./modules";
import type { SousModuleDto } from "./sousModules";

export interface MajorDto {
    id: number;
    name: string;
    description: string;
}

export interface MajorRequestDto {
    name: string;
    description?: string;
}

export interface MajorWithCourses {
    major: MajorDto;
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
