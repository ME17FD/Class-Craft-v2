export interface SousModuleDto {
    id: number;
    name: string;
    numberOfHours: number;
    moduleId: number;
    moduleName: string;
    professorId: number;
    professorName: string;
}

export interface SousModuleRequestDto {
    name: string;
    numberOfHours: number;
    moduleId: number;
    professorId: number;
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
