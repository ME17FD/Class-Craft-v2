import api from './api';
import type { ModuleDto, ModuleRequestDto, PageResponse } from '../types/modules';

const BASE_URL = '/api/gestion/modules';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const moduleService = {
    async getAll(params: PaginationParams = {}): Promise<PageResponse<ModuleDto>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (sort) queryParams.append('sort', sort);
        const response = await api.get<PageResponse<ModuleDto>>(`${BASE_URL}?${queryParams.toString()}`);
        return response.data;
    },
    async getById(id: number): Promise<ModuleDto> {
        const response = await api.get<ModuleDto>(`${BASE_URL}/${id}`);
        return response.data;
    },
    async create(module: ModuleRequestDto): Promise<ModuleDto> {
        const response = await api.post<ModuleDto>(BASE_URL, module);
        return response.data;
    },
    async update(id: number, module: ModuleRequestDto): Promise<ModuleDto> {
        const response = await api.put<ModuleDto>(`${BASE_URL}/${id}`, module);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

