import React, { useEffect, useState } from "react";
import ApprovalDashboard from "./ApprouvalDashbaord";
import { useApiData } from "../hooks/useApiData";
import { Student, Professor } from "../types/type";

const ApprovalManager: React.FC = () => {
  const {
    professors,
    students,
    updateStudent,
    deleteStudent,
    updateProfessor,
    deleteProfessor,
    fetchUnapprovedStudents,
  } = useApiData();

  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [pendingProfessors, setPendingProfessors] = useState<Professor[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allProfessors, setAllProfessors] = useState<Professor[]>([]);

  // Fetch unapproved students and professors
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const unapprovedStudents = await fetchUnapprovedStudents();
        setPendingStudents(unapprovedStudents);

        // Filter professors with approved === null or approved === false
        const unapprovedProfessors = professors.filter(
          (professor) => professor.approved === null || professor.approved === false
        );
        setPendingProfessors(unapprovedProfessors);

        // Combine approved and unapproved students
        const combinedStudents = [...students, ...unapprovedStudents];
        // Remove duplicates based on id
        const uniqueStudents = Array.from(
          new Map(combinedStudents.map(student => [student.id, student])).values()
        );
        setAllStudents(uniqueStudents);

        // Set all professors
        setAllProfessors(professors);

        console.log(
          `${unapprovedStudents.length} étudiants en attente d'approbation`
        );
        console.log(
          `${unapprovedProfessors.length} professeurs en attente d'approbation`
        );
      } catch (error) {
        console.error("Failed to fetch pending users:", error);
      }
    };

    fetchPendingUsers();
  }, [professors, students, fetchUnapprovedStudents]);

  // Gestion de l'approbation des étudiants
  const handleApproveStudent = async (studentId: number) => {
    try {
      const student = allStudents.find((s) => s.id === studentId) || pendingStudents.find((s) => s.id === studentId);
      if (student) {
        await updateStudent({ ...student, approved: true });
        // Update the student in allStudents list
        setAllStudents(prev => 
          prev.map(s => s.id === studentId ? { ...s, approved: true } : s)
        );
        // Remove from pending list only if it's in the pending tab
        if (pendingStudents.find(s => s.id === studentId)) {
          setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        }
      }
    } catch (error) {
      console.error("Failed to approve student:", error);
    }
  };

  const handleRejectStudent = async (studentId: number) => {
    try {
      await deleteStudent(studentId);
      // Remove from both lists
      setPendingStudents(prev => prev.filter(s => s.id !== studentId));
      setAllStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (error) {
      console.error("Failed to reject student:", error);
    }
  };

  // Gestion de l'approbation des professeurs
  const handleApproveProfessor = async (professorId: number) => {
    try {
      const professor = allProfessors.find((p) => p.id === professorId) || pendingProfessors.find((p) => p.id === professorId);
      if (professor) {
        await updateProfessor({ ...professor, approved: true });
        // Update the professor in allProfessors list
        setAllProfessors(prev => 
          prev.map(p => p.id === professorId ? { ...p, approved: true } : p)
        );
        // Remove from pending list only if it's in the pending tab
        if (pendingProfessors.find(p => p.id === professorId)) {
          setPendingProfessors(prev => prev.filter(p => p.id !== professorId));
        }
      }
    } catch (error) {
      console.error("Failed to approve professor:", error);
    }
  };

  const handleRejectProfessor = async (professorId: number) => {
    try {
      await deleteProfessor(professorId);
      // Remove from both lists
      setPendingProfessors(prev => prev.filter(p => p.id !== professorId));
      setAllProfessors(prev => prev.filter(p => p.id !== professorId));
    } catch (error) {
      console.error("Failed to reject professor:", error);
    }
  };

  // Gestion des étudiants approuvés
  const handleUnapproveStudent = async (studentId: number) => {
    try {
      const student = allStudents.find((s) => s.id === studentId);
      if (student) {
        await updateStudent({ ...student, approved: false });
        // Update the student in allStudents list
        setAllStudents(prev => 
          prev.map(s => s.id === studentId ? { ...s, approved: false } : s)
        );
        // Add to pending students if not already there
        setPendingStudents(prev => {
          if (!prev.find(s => s.id === studentId)) {
            return [...prev, { ...student, approved: false }];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Failed to unapprove student:", error);
    }
  };

  const handleDeleteApprovedStudent = async (studentId: number) => {
    try {
      await deleteStudent(studentId);
      // Remove from both lists
      setAllStudents(prev => prev.filter(s => s.id !== studentId));
      setPendingStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (error) {
      console.error("Failed to delete approved student:", error);
    }
  };

  // Gestion des professeurs approuvés
  const handleUnapproveProfessor = async (professorId: number) => {
    try {
      const professor = allProfessors.find((p) => p.id === professorId);
      if (professor) {
        await updateProfessor({ ...professor, approved: false });
        // Update the professor in allProfessors list
        setAllProfessors(prev => 
          prev.map(p => p.id === professorId ? { ...p, approved: false } : p)
        );
        // Add to pending professors if not already there
        setPendingProfessors(prev => {
          if (!prev.find(p => p.id === professorId)) {
            return [...prev, { ...professor, approved: false }];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Failed to unapprove professor:", error);
    }
  };

  const handleDeleteApprovedProfessor = async (professorId: number) => {
    try {
      await deleteProfessor(professorId);
      // Remove from both lists
      setAllProfessors(prev => prev.filter(p => p.id !== professorId));
      setPendingProfessors(prev => prev.filter(p => p.id !== professorId));
    } catch (error) {
      console.error("Failed to delete approved professor:", error);
    }
  };

  return (
    <ApprovalDashboard
      pendingStudents={pendingStudents}
      pendingProfessors={pendingProfessors}
      allStudents={allStudents}
      allProfessors={allProfessors}
      onApproveStudent={handleApproveStudent}
      onRejectStudent={handleRejectStudent}
      onApproveProfessor={handleApproveProfessor}
      onRejectProfessor={handleRejectProfessor}
      onUnapproveStudent={handleUnapproveStudent}
      onDeleteApprovedStudent={handleDeleteApprovedStudent}
      onUnapproveProfessor={handleUnapproveProfessor}
      onDeleteApprovedProfessor={handleDeleteApprovedProfessor}
    />
  );
};

export default ApprovalManager;
