import type { UserRole } from "./Enums/userRoles";

export interface User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    approved: boolean;
    groupe_id: number;
}