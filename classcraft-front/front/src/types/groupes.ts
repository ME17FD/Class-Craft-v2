import type { StudentDto } from "./students";

export interface GroupeDto {
    id: number;
    name: string;
    sectionId: number;
}

export interface GroupeRequestDto {
    name: string;
    sectionId: number;
}

export interface GroupeWithStudents {
    groupe: GroupeDto;
    students: StudentDto[];
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
