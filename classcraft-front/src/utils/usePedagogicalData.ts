import { useState, useCallback, useEffect } from "react";
import {
  TabType,
  ModalState,
  Student,
  CrudModalType
} from "../types/type";
import { useApiData } from "../hooks/useApiData";

const usePedagogicalData = () => {
  const {
    rooms,
    fields,
    modules,
    subModules,
    groups,
    professors,
    students: initialStudents,
    addField,
    updateField,
    deleteField,
    addModule,
    updateModule,
    deleteModule,
    addSubModule,
    updateSubModule,
    deleteSubModule,
    addGroup,
    updateGroup,
    deleteGroup,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    addStudent,
    updateStudent,
    deleteStudent,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    assignStudentsToGroup,
    removeStudentsFromGroup,
  } = useApiData();

  const [students, setStudents] = useState<Student[]>(initialStudents);
  
  useEffect(() => {
    if (initialStudents.length > 0) {
      setStudents(initialStudents);
    }
  }, [initialStudents]);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: "add",
    entityType: "groups",
    entity: null,
  });

  const handleAdd = useCallback((entityType: TabType) => {
    setModalState({
      isOpen: true,
      type: "add",
      entityType,
      entity: null,
    });
  }, []);

  const handleEdit = useCallback(async (entityType: TabType, entity: any) => {
    setModalState({
      isOpen: true,
      type: "edit",
      entityType,
      entity,
    });
  }, []);

  const handleDelete = useCallback(async (entityType: TabType, entity: any) => {
    setModalState({
      isOpen: true,
      type: "delete",
      entityType,
      entity,
    });
  }, []);

  const handleAssignStudents = useCallback(
    async (groupId: number, studentIds: number[], assign: boolean): Promise<boolean> => {
      try {
        if (assign) {
          await assignStudentsToGroup(groupId, studentIds);
        } else {
          await removeStudentsFromGroup(groupId, studentIds);
        }

        setStudents(prev =>
          prev.map((student: Student) =>
            studentIds.includes(student.id)
              ? { ...student, groupId: assign ? groupId : null }
              : student
          )
        );

        return true;
      } catch (error) {
        console.error("Failed to assign students:", error);
        return false;
      }
    },
    [assignStudentsToGroup, removeStudentsFromGroup]
  );

  type SaveOperation = 'add' | 'edit';
  
  const handleSave = useCallback(
    (entityType: TabType, entity: any, operation: CrudModalType = modalState.type) => {
      // First handle delete operations since they're different
      if (operation === 'delete') {
        switch (entityType) {
          case 'fields':
            deleteField(entity.id);
            break;
          case 'modules':
            deleteModule(entity.id);
            break;
          case 'submodules':
            deleteSubModule(entity.id);
            break;
          case 'groups':
            deleteGroup(entity.id);
            break;
          case 'professors':
            deleteProfessor(entity.id);
            break;
          case 'students':
            deleteStudent(entity.id);
            break;
          case 'classrooms':
            deleteClassroom(entity.id);
            break;
        }
        handleCloseModal();
        return;
      }

      // Then handle save operations (add/edit)
      const saveOperation = operation as SaveOperation;

      switch (entityType) {
        case 'fields':
          saveOperation === 'add' ? addField(entity) : updateField(entity);
          break;
        case 'modules':
          saveOperation === 'add' ? addModule(entity) : updateModule(entity);
          break;
        case 'submodules':
          saveOperation === 'add' ? addSubModule(entity) : updateSubModule(entity);
          break;
        case 'groups':
          saveOperation === 'add' ? addGroup(entity) : updateGroup(entity);
          break;
        case 'professors':
          saveOperation === 'add' ? addProfessor(entity) : updateProfessor(entity);
          break;
        case 'students':
          saveOperation === 'add' ? addStudent(entity) : updateStudent(entity);
          break;
        case 'classrooms':
          saveOperation === 'add' ? addClassroom(entity) : updateClassroom(entity);
          break;
      }
      handleCloseModal();
    },
    [
      modalState.type,
      addField,
      updateField,
      deleteField,
      addModule,
      updateModule,
      deleteModule,
      addSubModule,
      updateSubModule,
      deleteSubModule,
      addGroup,
      updateGroup,
      deleteGroup,
      addProfessor,
      updateProfessor,
      deleteProfessor,
      addStudent,
      updateStudent,
      deleteStudent,
      addClassroom,
      updateClassroom,
      deleteClassroom,
    ]
  );

  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      type: "add",
      entityType: "groups",
      entity: null,
    });
  }, []);

  return {
    data: {
      fields,
      modules,
      subModules,
      groups,
      professors,
      allStudents: students,
      rooms,
    },
    modalState,
    handleAdd,
    handleEdit,
    handleDelete,
    handleAssignStudents,
    handleSave,
    handleCloseModal,
  };
};

export default usePedagogicalData;