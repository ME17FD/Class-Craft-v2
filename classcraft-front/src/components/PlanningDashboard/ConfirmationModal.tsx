import styles from "../../styles/PlanningDashboard/ConfirmationModal.module.css";
type Props = {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeButton} onClick={onCancel}>
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}>
            Annuler
          </button>
          <button
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};
