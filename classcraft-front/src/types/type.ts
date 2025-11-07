export type Student = {
  id: number;
  cne: string;
  registrationNumber: string;
  lastName: string;
  firstName: string;
  groupId: number | null;
  email?: string;
  approved?: boolean | null;

};

export type Module = {

  id?: number;
  name: string;
  code: string;
  professor?: Professor;
  filiereId: number | null;
  subModules?: SubModule[];
};

export type SubModule = {
  id: number;
  name: string;
  nbrHours: number;
  moduleId: number;
  professor?: Professor;
};

export type Field = {
  id?: number;
  name: string;
  description: string;
  modules?: ExtendedModule[];
};

export type ExtendedModule = Module & {
  subModules: SubModule[];
};

export type Professor = {
  id: number;
  firstName: string; // Changé ici
  lastName: string;  // Changé ici
  email: string;
  password?: string;
  approved?: boolean |null;
  grade?: string;
  specialty?: string;
  modules?: number[];
  subModules?: number[];
};
export type Group = {
  id ?: number;
  name ?: string;
  filiereId ?: number;
  students ?: Student[];
  modules ?: Module[];
};

export type CrudModalType = 'add' | 'edit' | 'delete' | 'assign';

export type TabType = 'groups' | 'students' | 'fields' | 'modules' | "classrooms"| 'submodules' | 'professors' | 'weekly' | 'field' | 'daily' | 'create' | 'allStudents';

export interface ModalState {
  isOpen: boolean;
  type: CrudModalType;
  entityType: TabType;
  entity: unknown;
}

export interface PedagogicalData {
  groups: Group[];
  allStudents: Student[];
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
  professors: Professor[];
}
export type Reservation = {
  id: number;
  startDateTime: string;  // ISO format date-time string for the start of the reservation
  endDateTime: string;    // ISO format date-time string for the end of the reservation
  wasAttended: boolean;   // Indicates whether the reservation was attended
  subModuleId: number;    // Reference to the SubModule being reserved
  groupId: number;        // Reference to the Group associated with the reservation
  classroomId: number;    // Reference to the Classroom being reserved
};
export type Classroom = {
  id: number;
  name: string;
  capacity: number;
  type:string;
 // Equipment available in the classroom (e.g., projector, whiteboard)
};