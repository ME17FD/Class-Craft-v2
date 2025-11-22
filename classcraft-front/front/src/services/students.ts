import api from './api';
import type { StudentDto, StudentRequestDto, PageResponse } from '../types/students';

const BASE_URL = 'api/gestion/students';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const studentService = {
    /**
     * Récupère tous les étudiants avec pagination
     */
    async getAll(params: PaginationParams = {}): Promise<PageResponse<StudentDto>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        
        if (sort) {
            queryParams.append('sort', sort);
        }

        const response = await api.get<PageResponse<StudentDto>>(
            `${BASE_URL}?${queryParams.toString()}`
        );
        return response.data;
    },

    /**
     * Récupère un étudiant par son ID
     */
    async getById(id: number): Promise<StudentDto> {
        const response = await api.get<StudentDto>(`${BASE_URL}/${id}`);
        return response.data;
    },

    /**
     * Crée un nouvel étudiant
     */
    async create(student: StudentRequestDto): Promise<StudentDto> {
        const response = await api.post<StudentDto>(BASE_URL, student);
        return response.data;
    },

    /**
     * Met à jour un étudiant existant
     */
    async update(id: number, student: StudentRequestDto): Promise<StudentDto> {
        const response = await api.put<StudentDto>(`${BASE_URL}/${id}`, student);
        return response.data;
    },

    /**
     * Supprime un étudiant
     */
    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};

