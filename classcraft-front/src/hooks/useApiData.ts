/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // your api service
import { AxiosError } from "axios";
import {
  Field,
  Module,
  SubModule,
  Group,
  Professor,
  Student,
} from "../types/type";

import{
  Room,
  Session
} from "../types/schedule";

export const useApiData = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [seances, setSeances] = useState<Session[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]); 

  const fetchData = async () => {
    console.log("Initiating API requests...");

    try {
      const endpoints = [
        { name: "filieres", url: "/api/filieres" },
        { name: "modules", url: "/api/modules" },
        { name: "submodules", url: "/api/submodules" },
        { name: "groups", url: "/api/groups" },
        { name: "professors", url: "/api/professors" },
        { name: "students", url: "/api/students" },
        { name: "seances", url: "/api/seances" },
        { name: "classrooms", url: "/api/classrooms" },
      ];

      const requests = endpoints.map((endpoint) =>
        api
          .get(endpoint.url)
          .then((response) => {
            //console.log(`✅ Success [${endpoint.name}]:`, response.data);
            return response;
          })
          .catch((error) => {
            console.error(`❌ Failed [${endpoint.name}]:`, error);
            throw error;
          })
      );

      const results = await Promise.allSettled(requests);

      const successful = results.filter(
        (r) => r.status === "fulfilled"
      ) as PromiseFulfilledResult<any>[];
      const failed = results.filter(
        (r) => r.status === "rejected"
      ) as PromiseRejectedResult[];

      if (failed.length > 0) {
        console.group("Failed API Requests");
        failed.forEach((f, i) => {
          const error = f.reason as AxiosError;
          console.error(`Request ${i + 1} failed:`, {
            endpoint: endpoints[i].name,
            status: error.response?.status,
            message: error.message,
          });
        });
        console.groupEnd();
      }

      successful.forEach((result) => {
        const endpointName = endpoints.find(
          (e) => e.url === result.value.config.url
        )?.name;

        switch (endpointName) {
          case "filieres":
            setFields(result.value.data);
            break;
          case "modules":
            setModules(result.value.data);
            break;
          case "submodules":
            setSubModules(result.value.data);
            break;
          case "groups":
            setGroups(result.value.data);
            break;
          case "professors":
            setProfessors(result.value.data);
            break;
          case "students":
            setStudents(result.value.data);
            break;
          case "seances":  // ADD THIS CASE
            setSeances(result.value.data);
            break;
          case "classrooms":  // ALSO ADD THIS CASE FOR ROOMS
            setRooms(result.value.data);
            break;
        }
      });
    } catch (error) {
      console.error("Global error handler:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ----- CRUD: Classrooms -----
  const addClassroom = useCallback(async (classroom: Omit<Room, 'id'>) => {
    try {
      const res = await api.post("/api/classrooms", classroom);
      setRooms(prev => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error("Failed to create classroom:", error);
      throw error;
    }
  }, []);

  const updateClassroom = useCallback(async (classroom: Room) => {
    try {
      const res = await api.put(`/api/classrooms/${classroom.id}`, classroom);
      setRooms(prev => prev.map(r => r.id === classroom.id ? res.data : r));
      return true;
    } catch (error) {
      console.error("Failed to update classroom:", error);
      return false;
    }
  }, []);

  const deleteClassroom = useCallback(async (classroomId: number) => {
    try {
      await api.delete(`/api/classrooms/${classroomId}`);
      setRooms(prev => prev.filter(r => r.id !== classroomId));
      return true;
    } catch (error) {
      console.error("Failed to delete classroom:", error);
      return false;
    }
  }, []);

// ----- CRUD: Seances -----
const addSceance = useCallback(async (sceance: Omit<Session, 'id'>) => {
  const res = await api.post("/api/seances", sceance);
  setSeances(prev => [...prev, res.data]);
  return res.data;
}, []);

const updateSceance = useCallback(async (sceance: Session) => {
  const res = await api.put(`/api/seances/${sceance.id}`, sceance);
  setSeances(prev => prev.map(s => s.id === sceance.id ? res.data : s));
  return res.data;
}, []);

const deleteSceance = useCallback(async (sceanceId: number) => {
  await api.delete(`/api/seances/${sceanceId}`);
  setSeances(prev => prev.filter(s => s.id !== sceanceId));
}, []);

  // ----- CRUD: Fields -----

  const addField = useCallback(async (field: Field) => {
    const res = await api.post("/api/filieres", field);
    setFields((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateField = useCallback(async (field: Field) => {
    const res = await api.put(`/api/filieres/${field.id}`, field);
    setFields((prev) => prev.map((f) => (f.id === field.id ? res.data : f)));
    return res.data;
  }, []);

  const deleteField = useCallback(async (fieldId: number) => {
    await api.delete(`/api/filieres/${fieldId}`);
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
  }, []);

  // ----- CRUD: Modules -----
  const addModule = useCallback(async (module: Module) => {
    const res = await api.post("/api/modules", module);
    setModules((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateModule = useCallback(async (module: Module) => {
    const res = await api.put(`/api/modules/${module.id}`, module);
    setModules((prev) => prev.map((m) => (m.id === module.id ? res.data : m)));
    return res.data;
  }, []);

  const deleteModule = useCallback(async (moduleId: number) => {
    await api.delete(`/api/modules/${moduleId}`);
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  }, []);

  // ----- CRUD: SubModules -----
  const addSubModule = useCallback(async (subModule: SubModule) => {
    const res = await api.post("/api/submodules", subModule);
    setSubModules((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateSubModule = useCallback(async (subModule: SubModule) => {
    const res = await api.put(`/api/submodules/${subModule.id}`, subModule);
    setSubModules((prev) =>
      prev.map((s) => (s.id === subModule.id ? res.data : s))
    );
    return res.data;
  }, []);

  const deleteSubModule = useCallback(async (subModuleId: number) => {
    await api.delete(`/api/submodules/${subModuleId}`);
    setSubModules((prev) => prev.filter((s) => s.id !== subModuleId));
  }, []);

  // ----- CRUD: Groups -----
  const addGroup = useCallback(async (group: Omit<Group, "id">) => {
    try {
      const res = await api.post("/api/groups", group);
      setGroups((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error;
    }
  }, []);

  const updateGroup = useCallback(async (group: Group): Promise<boolean> => {
    try {
      console.log("3awtanii");
      const res = await api.put(`/api/groups/${group.id}`, group);
      setGroups((prev) => prev.map((g) => (g.id === group.id ? res.data : g)));
      return true; // Return true if the update is successful
    } catch (error) {
      console.error("Failed to update group:", error);
      return false; // Return false if an error occurs
    }
  }, []);

  const deleteGroup = useCallback(
    async (groupId: number): Promise<boolean> => {
      try {
        await api.delete(`/api/groups/${groupId}`);
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        setStudents((prev) =>
          prev.map((s) => (s.groupId === groupId ? { ...s, groupId: null } : s))
        );
        return true;
      } catch (error) {
        console.error("Failed to delete group:", error);
        return false;
      }
    },
    [setGroups, setStudents]
  );

  const assignStudentsToGroup = async (groupId: number, studentIds: number[]) => {
    const response = await api.put(`/api/groups/${groupId}/students`, { studentIds });
    return response.data;
  };
  
  const removeStudentsFromGroup = async (groupId: number, studentIds: number[]) => {
    const response = await api.delete(`/api/groups/${groupId}/students`, {
      data: { studentIds }
    });
    return response.data;
  };

  // ----- CRUD: Professors -----
  const addProfessor = useCallback(async (prof: Professor) => {
    const res = await api.post("/api/professors", prof);
    setProfessors((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateProfessor = useCallback(async (prof: Professor) => {
    await api.put(`/api/professors/${prof.id}`, prof);
    setProfessors((prev) => prev.map((p) => (p.id === prof.id ? prof : p)));
  }, []);

  const deleteProfessor = useCallback(async (profId: number) => {
    await api.delete(`/api/professors/${profId}`);
    setProfessors((prev) => prev.filter((p) => p.id !== profId));
  }, []);

  // ----- CRUD: Students -----
  const fetchUnapprovedStudents = useCallback(async () => {
    try {
      const response = await api.get("/api/students/unapproved");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch unapproved students:", error);
      throw error;
    }
  }, []);

  const addStudent = useCallback(async (student: Omit<Student, "id">): Promise<Student> => {
    const res = await api.post<Student>("/api/students", student);
    setStudents(prev => [...prev, res.data]);
    return res.data;
  }, []);
  
  const updateStudent = useCallback(async (student: Student): Promise<Student> => {
    const res = await api.put<Student>(`/api/students/${student.id}`, student);
    setStudents(prev => 
      prev.map(s => s.id === student.id ? res.data : s)
    );
    console.log(res.data);
    return res.data;
  }, []);
  
  const deleteStudent = useCallback(async (studentId: number): Promise<void> => {
    await api.delete(`/api/students/${studentId}`);
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  return {
        rooms, 
    addClassroom,
    updateClassroom,
    deleteClassroom,
    seances,
    addSceance,
    deleteSceance,
    updateSceance,
    fields,
    modules,
    subModules,
    groups,
    professors,
    students,
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
    fetchData,
    assignStudentsToGroup,
    removeStudentsFromGroup,
    fetchUnapprovedStudents
  };
};
