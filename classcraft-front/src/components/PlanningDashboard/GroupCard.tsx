import { useState } from "react";
import { Group } from "../../types/type";
import { GroupFormModal } from "./GroupFromModal";
import { ConfirmationModal } from "./ConfirmationModal";
import styles from "../../styles/PlanningDashboard/GroupCard.module.css";
import { useApiData } from "../../hooks/useApiData";
import { usePlanning } from "../../context/PlanningContext";
import { Session } from "../../types/schedule";

type GroupCardProps = {
  group: Group;
  onEdit: (updatedGroup: Group) => void;
  onDelete: () => void;
  onOpenSchedule: () => void;
  onSaveSession: (session: Session) => void;
};

export const GroupCard = ({
  group,
  onEdit,
  onDelete,
  onOpenSchedule,
  onSaveSession,
}: GroupCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { seances } = useApiData();
  const { sessions } = usePlanning();
  const allSessions = [...seances, ...sessions];
  const groupSessions = allSessions.filter((s) => s.group?.id === group.id);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <>
      <div className={styles.groupCard} onClick={onOpenSchedule}>
        <div className={styles.cardActions}>
          {/* Bouton Modifier */}
          <button
            className={styles.editButton}
            onClick={(e) => handleAction(e, () => setShowEditModal(true))}
            aria-label="Modifier">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Bouton Supprimer */}
          <button
            className={styles.deleteButton}
            onClick={(e) => handleAction(e, () => setShowDeleteModal(true))}
            aria-label="Supprimer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className={styles.cardHeader}>
          <h3>{group.name}</h3>
          <div className={styles.sessionCount}>
            {groupSessions.length} séance{groupSessions.length !== 1 ? "s" : ""}{" "}
            planifiée{groupSessions.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Modale d'édition */}
      <GroupFormModal
        show={showEditModal}
        group={group}
        onHide={() => setShowEditModal(false)}
        onSave={(updatedGroup) => {
          onEdit(updatedGroup);
          setShowEditModal(false);
        }}
        onSaveSession={onSaveSession}
      />

      {/* Modale de confirmation */}
      <ConfirmationModal
        show={showDeleteModal}
        title="Supprimer le groupe"
        message={`Êtes-vous sûr de vouloir supprimer le groupe "${group.name}" ?`}
        onConfirm={() => {
          onDelete();
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};
