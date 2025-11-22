import api from './api';
import type { SalleDto, SalleRequestDto, PageResponse } from '../types/salles';

const BASE_URL = '/api/gestion/classrooms';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const salleService = {
    async getAll(params: PaginationParams = {}): Promise<PageResponse<SalleDto>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        
        if (sort) {
            queryParams.append('sort', sort);
        }

        const response = await api.get<PageResponse<SalleDto>>(
            `${BASE_URL}?${queryParams.toString()}`
        );
        return response.data;
    },

    async getById(id: number): Promise<SalleDto> {
        const response = await api.get<SalleDto>(`${BASE_URL}/${id}`);
        return response.data;
    },

    async create(salle: SalleRequestDto): Promise<SalleDto> {
        const response = await api.post<SalleDto>(BASE_URL, salle);
        return response.data;
    },

    async update(id: number, salle: SalleRequestDto): Promise<SalleDto> {
        const response = await api.put<SalleDto>(`${BASE_URL}/${id}`, salle);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

