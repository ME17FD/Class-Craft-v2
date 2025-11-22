import api from './api';
import type { ProfessorDto, ProfessorRequestDto, PageResponse } from '../types/professors';

const BASE_URL = '/api/gestion/professors';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const professorService = {
    async getAll(params: PaginationParams = {}): Promise<PageResponse<ProfessorDto>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (sort) queryParams.append('sort', sort);
        const response = await api.get<PageResponse<ProfessorDto>>(`${BASE_URL}?${queryParams.toString()}`);
        return response.data;
    },
    async getById(id: number): Promise<ProfessorDto> {
        const response = await api.get<ProfessorDto>(`${BASE_URL}/${id}`);
        return response.data;
    },
    async create(professor: ProfessorRequestDto): Promise<ProfessorDto> {
        const response = await api.post<ProfessorDto>(BASE_URL, professor);
        return response.data;
    },
    async update(id: number, professor: ProfessorRequestDto): Promise<ProfessorDto> {
        const response = await api.put<ProfessorDto>(`${BASE_URL}/${id}`, professor);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

