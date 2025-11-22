import api from './api';
import type { MajorDto, MajorRequestDto, PageResponse } from '../types/majors';

const BASE_URL = '/api/gestion/major';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const majorService = {
    async getAll(params: PaginationParams = {}): Promise<PageResponse<MajorDto>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (sort) queryParams.append('sort', sort);
        const response = await api.get<PageResponse<MajorDto>>(`${BASE_URL}?${queryParams.toString()}`);
        return response.data;
    },
    async getById(id: number): Promise<MajorDto> {
        const response = await api.get<MajorDto>(`${BASE_URL}/${id}`);
        return response.data;
    },
    async create(major: MajorRequestDto): Promise<MajorDto> {
        const response = await api.post<MajorDto>(BASE_URL, major);
        return response.data;
    },
    async update(id: number, major: MajorRequestDto): Promise<MajorDto> {
        const response = await api.put<MajorDto>(`${BASE_URL}/${id}`, major);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

