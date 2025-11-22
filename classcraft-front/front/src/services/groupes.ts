import api from './api';
import type { GroupeDto, GroupeRequestDto, PageResponse } from '../types/groupes';

const BASE_URL = '/api/gestion/groups';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const groupeService = {
    async getAll(params: PaginationParams = {}): Promise<PageResponse<GroupeDto>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (sort) queryParams.append('sort', sort);
        const response = await api.get<PageResponse<GroupeDto>>(`${BASE_URL}?${queryParams.toString()}`);
        return response.data;
    },
    async getById(id: number): Promise<GroupeDto> {
        const response = await api.get<GroupeDto>(`${BASE_URL}/${id}`);
        return response.data;
    },
    async create(groupe: GroupeRequestDto): Promise<GroupeDto> {
        const response = await api.post<GroupeDto>(BASE_URL, groupe);
        return response.data;
    },
    async update(id: number, groupe: GroupeRequestDto): Promise<GroupeDto> {
        const response = await api.put<GroupeDto>(`${BASE_URL}/${id}`, groupe);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

