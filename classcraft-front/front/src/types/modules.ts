import type { SousModuleDto } from "./sousModules";

export interface ModuleDto {
    id: number;
    name: string;
    code: string;
    numberOfHours: number;
    professorId: number;
    semestreId: number;
}

export interface ModuleRequestDto {
    name: string;
    code: string;
    numberOfHours: number;
    professorId: number;
    semestreId: number;
}

export interface ModuleWithSousModules {
    module: ModuleDto;
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
