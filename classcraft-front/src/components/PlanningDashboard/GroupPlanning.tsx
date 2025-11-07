import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import { usePlanning } from "../../context/PlanningContext";
import { GroupCard } from "./GroupCard";
import { GroupScheduleModal } from "./GroupScheduleModal";
import { GroupFormModal } from "./GroupFromModal";
import { ConfirmationModal } from "./ConfirmationModal";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Group, Professor } from "../../types/type";
import { Room, Session } from "../../types/schedule";

export const GroupPlanning = () => {
  const {
    groups = [],
    professors = [] as Professor[],
    fields = [],
    rooms = [],
    addGroup,
    updateGroup,
    deleteGroup,
    seances = [],
    addSceance,
    updateSceance,
  } = useApiData();

  const { sessions = [] } = usePlanning();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const allSessions = [...seances, ...sessions];

  const filteredGroups = groups.filter((group) => {
    const matchesField = selectedField
      ? group.filiereId === selectedField
      : true;
    const matchesSearch = group.name
      ? group.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesProfessor = selectedProfessor
      ? allSessions.some(
          (s) =>
            s.group?.id === group.id && s.professor?.id === selectedProfessor
        )
      : true;
    const matchesRoom = selectedRoom
      ? allSessions.some(
          (s) => s.group?.id === group.id && s.classroom?.name === selectedRoom
        )
      : true;

    return matchesField && matchesSearch && matchesProfessor && matchesRoom;
  });

  const handleSaveGroup = async (group: Group) => {
    try {
      if (group.id) {
        await updateGroup(group);
      } else {
        await addGroup(group);
      }
      setEditingGroup(null);
    } catch (error) {
      console.error("Error saving group:", error);
    }
  };

  const handleSaveSession = async (session: Session) => {
    try {
      if (session.id && seances.some((s) => s.id === session.id)) {
        await updateSceance(session);
      } else {
        const { id, ...newSession } = session;
        await addSceance(newSession);
      }
    } catch (error) {
      console.error("Error saving session:", error);
      throw error;
    }
  };

  const handleTimeSlotClick = (day: string, time: string) => {
    // Implement time slot click handling logic here
    console.log(`Time slot clicked: ${day} at ${time}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Rechercher un groupe..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={selectedField ?? ""}
          onChange={(e) =>
            setSelectedField(e.target.value ? Number(e.target.value) : null)
          }>
          <option value="">Toutes les filières</option>
          {fields?.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={selectedProfessor ?? ""}
          onChange={(e) =>
            setSelectedProfessor(e.target.value ? Number(e.target.value) : null)
          }>
          <option value="">Tous les professeurs</option>
          {professors.length > 0 ? (
            professors.map((prof: Professor) => {
              return (
                <option key={prof.id} value={prof.id}>
                  {prof.firstName} {prof.lastName}
                </option>
              );
            })
          ) : (
            <option disabled>Aucun professeur chargé</option>
          )}
        </select>

        <select
          className={styles.filterSelect}
          value={selectedRoom ?? ""}
          onChange={(e) => setSelectedRoom(e.target.value || null)}>
          <option value="">Toutes les salles</option>
          {rooms && rooms.length > 0 ? (
            rooms.map((room: Room) => (
              <option key={room.id} value={room.name}>
                {room.name} ({room.capacity} places)
              </option>
            ))
          ) : (
            <option disabled>
              {rooms ? "Aucune salle disponible" : "Chargement..."}
            </option>
          )}
        </select>
      </div>

      <div className={styles.groupsGrid}>
        {filteredGroups?.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onEdit={() => setEditingGroup(group)}
            onDelete={() => setDeletingGroup(group)}
            onOpenSchedule={() => setSelectedGroup(group)}
            onSaveSession={handleSaveSession}
          />
        ))}
      </div>

      {selectedGroup && (
        <GroupScheduleModal
          group={selectedGroup}
          sessions={allSessions.filter((s) => s.group?.id === selectedGroup.id)}
          onClose={() => setSelectedGroup(null)}
          onTimeSlotClick={handleTimeSlotClick}
        />
      )}

      <GroupFormModal
        show={!!editingGroup}
        group={editingGroup || undefined}
        onHide={() => setEditingGroup(null)}
        onSave={handleSaveGroup}
        onSaveSession={handleSaveSession}
      />

      <ConfirmationModal
        show={!!deletingGroup}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le groupe "${deletingGroup?.name}" ?`}
        onConfirm={() => {
          if (deletingGroup?.id) {
            deleteGroup(deletingGroup.id);
            setDeletingGroup(null);
          }
        }}
        onCancel={() => setDeletingGroup(null)}
      />
    </div>
  );
};

export default GroupPlanning;
