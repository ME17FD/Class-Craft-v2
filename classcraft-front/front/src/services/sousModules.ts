import api from './api';
import type { SousModuleDto, SousModuleRequestDto, PageResponse } from '../types/sousModules';

const BASE_URL = '/api/gestion/submodules';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const sousModuleService = {
    async getAll(params: PaginationParams = {}): Promise<PageResponse<SousModuleDto>> {
        const { page = 0, size = 100, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (sort) queryParams.append('sort', sort);
        const response = await api.get<PageResponse<SousModuleDto>>(`${BASE_URL}?${queryParams.toString()}`);
        return response.data;
    },
    async getById(id: number): Promise<SousModuleDto> {
        const response = await api.get<SousModuleDto>(`${BASE_URL}/${id}`);
        return response.data;
    },
    async create(sousModule: SousModuleRequestDto): Promise<SousModuleDto> {
        const response = await api.post<SousModuleDto>(BASE_URL, sousModule);
        return response.data;
    },
    async update(id: number, sousModule: SousModuleRequestDto): Promise<SousModuleDto> {
        const response = await api.put<SousModuleDto>(`${BASE_URL}/${id}`, sousModule);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

