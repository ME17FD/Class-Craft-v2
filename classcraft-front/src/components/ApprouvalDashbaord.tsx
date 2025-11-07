import React, { useState, useMemo } from "react";
import styles from "../styles/ApprovalDashboard.module.css";
import TabNav from "./PedagogicalDashboard-components/TabNav";
import Table from "./PedagogicalDashboard-components/TableActions";
import Sidebar from "./Sidebar";
import { Professor, Student, TabType } from "../types/type";

interface ApprovalDashboardProps {
  pendingStudents: Student[];
  pendingProfessors: Professor[];
  allStudents: Student[];
  allProfessors: Professor[];
  onApproveStudent: (studentId: number) => void;
  onRejectStudent: (studentId: number) => void;
  onApproveProfessor: (professorId: number) => void;
  onRejectProfessor: (professorId: number) => void;
  onUnapproveStudent: (studentId: number) => void;
  onDeleteApprovedStudent: (studentId: number) => void;
  onUnapproveProfessor: (professorId: number) => void;
  onDeleteApprovedProfessor: (professorId: number) => void;
}

type ApprovalFilter = 'all' | 'approved' | 'unapproved';

const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({
  pendingStudents,
  allStudents,
  allProfessors,
  onApproveStudent,
  onRejectStudent,
  onApproveProfessor,
  onUnapproveStudent,
  onDeleteApprovedStudent,
  onUnapproveProfessor,
  onDeleteApprovedProfessor,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>('all');

  const tabs = [
    { id: "students" as TabType, label: "Étudiants en attente" },
    { id: "professors" as TabType, label: "Gestion enseignants" },
    { id: "allStudents" as TabType, label: "Gestion étudiants" },
  ];

  // Filter data based on search query and approved status
  const filteredStudents = useMemo(() => {
    console.log('All pending students:', pendingStudents);
    const filtered = pendingStudents.filter(student => {
      const searchMatch = 
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const approvalStatus = student.approved === false || student.approved === null;
      console.log('Student:', student.firstName, student.lastName, 'approved:', student.approved, 'will show:', approvalStatus);
      return searchMatch && approvalStatus;
    });
    console.log('Filtered students:', filtered);
    return filtered;
  }, [pendingStudents, searchQuery]);

  const filteredProfessors = useMemo(() => {
    return allProfessors.filter(professor => {
      const searchMatch = 
        professor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (professor.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const approvalMatch = 
        approvalFilter === 'all' ? true :
        approvalFilter === 'approved' ? professor.approved === true :
        professor.approved === false || professor.approved === null;

      return searchMatch && approvalMatch;
    });
  }, [allProfessors, searchQuery, approvalFilter]);

  const filteredAllStudents = useMemo(() => {
    return allStudents.filter(student => {
      const searchMatch = 
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const approvalMatch = 
        approvalFilter === 'all' ? true :
        approvalFilter === 'approved' ? student.approved === true :
        student.approved === false || student.approved === null;

      return searchMatch && approvalMatch;
    });
  }, [allStudents, searchQuery, approvalFilter]);

  // Colonnes pour la table des étudiants
  const studentColumns = [
    { header: "ID", accessor: "id" as keyof Student },
    { header: "CNE", accessor: "cne" as keyof Student },
    { header: "Nom", accessor: "lastName" as keyof Student },
    { header: "Prénom", accessor: "firstName" as keyof Student },
    { header: "Email", accessor: "email" as keyof Student },
    {
      header: "Actions",
      render: (student: Student) => (
        <div className={styles.actionButtons}>
          <button
            className={`${styles.button} ${styles.approveButton}`}
            onClick={() => onApproveStudent(student.id)}>
            Approuver
          </button>
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={() => onRejectStudent(student.id)}>
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  // Colonnes pour la table des professeurs
  const professorColumns = [
    { header: "ID", accessor: "id" as keyof Professor },
    { header: "Nom", accessor: "lastName" as keyof Professor },
    { header: "Prénom", accessor: "firstName" as keyof Professor },
    { header: "Email", accessor: "email" as keyof Professor },
    { header: "Statut", render: (professor: Professor) => professor.approved ? "Approuvé" : "Non approuvé" },
    {
      header: "Actions",
      render: (professor: Professor) => (
        <div className={styles.actionButtons}>
          {professor.approved ? (
            <button
              className={`${styles.button} ${styles.rejectButton}`}
              onClick={() => onUnapproveProfessor(professor.id)}>
              Désapprouver
            </button>
          ) : (
            <button
              className={`${styles.button} ${styles.approveButton}`}
              onClick={() => onApproveProfessor(professor.id)}>
              Approuver
            </button>
          )}
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={() => onDeleteApprovedProfessor(professor.id)}>
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  // Colonnes pour la table de tous les étudiants
  const allStudentsColumns = [
    { header: "ID", accessor: "id" as keyof Student },
    { header: "CNE", accessor: "cne" as keyof Student },
    { header: "Nom", accessor: "lastName" as keyof Student },
    { header: "Prénom", accessor: "firstName" as keyof Student },
    { header: "Email", accessor: "email" as keyof Student },
    { header: "Statut", render: (student: Student) => student.approved ? "Approuvé" : "Non approuvé" },
    {
      header: "Actions",
      render: (student: Student) => (
        <div className={styles.actionButtons}>
          {student.approved ? (
            <button
              className={`${styles.button} ${styles.rejectButton}`}
              onClick={() => onUnapproveStudent(student.id)}>
              Désapprouver
            </button>
          ) : (
            <button
              className={`${styles.button} ${styles.approveButton}`}
              onClick={() => onApproveStudent(student.id)}>
              Approuver
            </button>
          )}
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={() => onDeleteApprovedStudent(student.id)}>
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Sidebar />
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestion des utilisateurs</h1>
        </header>

        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={styles.content}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {(activeTab === "allStudents" || activeTab === "professors") && (
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value as ApprovalFilter)}
                className={styles.filterSelect}
              >
                <option value="all">Tous</option>
                <option value="approved">Approuvés</option>
                <option value="unapproved">Non approuvés</option>
              </select>
            )}
          </div>

          {activeTab === "students" && (
            <Table
              data={filteredStudents}
              columns={studentColumns}
              emptyMessage="Aucun étudiant en attente d'approbation"
            />
          )}

          {activeTab === "professors" && (
            <Table
              data={filteredProfessors}
              columns={professorColumns}
              emptyMessage="Aucun enseignant trouvé"
            />
          )}

          {activeTab === "allStudents" && (
            <Table
              data={filteredAllStudents}
              columns={allStudentsColumns}
              emptyMessage="Aucun étudiant trouvé"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ApprovalDashboard;
