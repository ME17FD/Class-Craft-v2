import React, { useState, useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupsTab.module.css";
import Button from "./Button";
import { Group, Field, Module, Student,Professor } from "../../types/type";
import Table from "./TableActions";
import GroupStudentsModal from "./GroupStudentsModal";
import UnassignedStudentsModal from "./UnassignedStudentsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface GroupsTabProps {
  groups: Group[];
  fields: Field[];
  modules: Module[];
  professors: Professor[];
  students: Student[];
  onEdit: (group: Group) => void;
  onDelete: (groupId: number) => Promise<boolean>;
  onAdd: () => void;
  onAssignStudents: (groupId: number, studentIds: number[], assign: boolean) => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({
  groups: initialGroups = [],
  fields = [],
  modules = [],
  students = [],
  professors = [],
  onEdit,
  onDelete,
  onAdd,
  onAssignStudents,
}) => {

  const [localGroups, setLocalGroups] = useState<Group[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isUnassignedModalOpen, setIsUnassignedModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);

  useEffect(() => {
    setLocalGroups(initialGroups);
  }, [initialGroups]);

  const filteredModules = selectedField
    ? modules.filter(module => module.filiereId === selectedField)
    : modules;



  const filteredGroups = localGroups.filter(group => {
    // Filter by field
    if (selectedField && group.filiereId !== selectedField) return false;

    // Filter by module
    if (selectedModule) {
      const module = modules.find(m => m.id === selectedModule);
      if (!module || group.filiereId !== module.filiereId) return false;
    }

    if (selectedProfessor) {
      const professor = professors.find(p => p.id === selectedProfessor);
      if (!professor) return false;
      // Get all module IDs that this professor teaches
      const professorModuleIds = professor.modules;
  
      // Get all modules in this group's field
      const field = fields.find(f => f.id === group.filiereId);
      if (!field) return false;
  
      // Get module IDs in this field (from the modules array, not field.modules)
      const fieldModuleIds = modules
        .filter(m => m.filiereId === field.id)
        .map(m => m.id);
      // Check if professor teaches any module in this group's field
      const professorTeachesInField = professorModuleIds?.some(moduleId => 
        fieldModuleIds.includes(moduleId)
      );
  
      if (!professorTeachesInField) return false;
    }
  
    return true;
  });

  const handleShowStudents = (group: Group) => {
    setSelectedGroup(group);
    setIsStudentsModalOpen(true);
  };

  const handleAssignStudents = () => {
    setIsStudentsModalOpen(false);
    setIsUnassignedModalOpen(true);
  };

  const handleCloseUnassignedModal = () => {
    setIsUnassignedModalOpen(false);
    setSelectedGroup(null);
  };

  const handleAssignStudent = (studentId: number) => {
    if (!selectedGroup?.id) {
      console.error("No group selected or group has no ID");
      return;
    }
    onAssignStudents(selectedGroup.id, [studentId], true);
    handleCloseUnassignedModal();
  };

  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroup?.id) return;
    
    try {
      const success = await onDelete(selectedGroup.id); // Now passing just the ID
      if (success) {
        setLocalGroups(prev => prev.filter(g => g.id !== selectedGroup.id));
      } else {
        console.error("Failed to delete group");
        // Optionally show error to user
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    }
  };

  const resetFilters = () => {
    setSelectedField(null);
    setSelectedModule(null);
    setSelectedProfessor(null);
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof Group },
    {
      header: "Filière",
      render: (group: Group) => fields.find(f => f.id === group.filiereId)?.name || "Inconnue"
    },
    {
      header: "Nombre d'étudiants",
      render: (group: Group) => (
        <span
          className={styles.studentCount}
          onClick={() => handleShowStudents(group)}
        >
          {group.students?.length || 0}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (group: Group) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(group)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(group)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];
  console.log("filter studensssts:", students.filter(s => s.groupId === null || s.groupId === undefined));


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select
            value={selectedField !== null ? selectedField : ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedField(val === "" ? null : Number(val));
            }}
          >
            <option value="">Toutes les filières</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>


          <select
            value={selectedModule || ""}
            onChange={(e) => setSelectedModule(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Tous les modules</option>
            {filteredModules.map((module) => (
              <option key={module.id} value={module.id}>{module.name}</option>
            ))}
          </select>
          <select
  value={selectedProfessor || ""}
  onChange={(e) => setSelectedProfessor(e.target.value ? Number(e.target.value) : null)}
>
  <option value="">Tous les professeurs</option>
  {professors.map((prof) => (
    <option key={prof.id} value={prof.id}>{prof.lastName} {prof.firstName}</option>
  ))}
</select>


          <Button variant="secondary" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>

        <Button variant="secondary" onClick={onAdd}>
          + AJOUTER UN GROUPE
        </Button>
      </div>

      <Table 
        data={filteredGroups} 
        columns={columns} 
        emptyMessage="Aucun groupe trouvé" 
      />

      {isStudentsModalOpen && selectedGroup && (
        <GroupStudentsModal
          isOpen={isStudentsModalOpen}
          students={selectedGroup.students ?? []}
          onClose={() => setIsStudentsModalOpen(false)}
          onAssignStudents={handleAssignStudents}
        />
      )}

      <UnassignedStudentsModal
        isOpen={isUnassignedModalOpen}
        onClose={handleCloseUnassignedModal}
        onAssignStudent={handleAssignStudent}
        students={students.filter(s => s.groupId === null || s.groupId === undefined)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={selectedGroup?.name || "ce groupe"}
      />
    </div>
  );
};

export default GroupsTab;