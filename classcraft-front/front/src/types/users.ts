import type { UserRole } from "./Enums/userRoles";

export interface User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    approved: boolean;
    groupeId: number;
}