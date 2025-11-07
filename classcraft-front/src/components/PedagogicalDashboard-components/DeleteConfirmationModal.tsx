import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "../../styles/PedagogicalDashboard-components/DeleteConfirmationModal.module.css";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmer la suppression"
    >
      <div className={styles.content}>
        <p>Êtes-vous sûr de vouloir supprimer {entityName} ?</p>
        <p className={styles.warning}>Cette action est irréversible.</p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="delete" onClick={onConfirm}>
            Supprimer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal; 