import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import profile from "../assets/pic.jpg";
import { MouseEvent } from "react";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation =
    (path: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // Empêche le comportement par défaut si nécessaire
      navigate(path);
      setIsOpen(false);
    };

  const handleLogout = () => {
    // Clear the user's session data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDetails");
    // Redirect to login
    navigate("/");
  };

  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar} // Ferme la sidebar si on clique sur l'overlay
        />
      )}
      {/* Bouton de toggle (en haut à gauche) */}
      <button
        className={`${styles.toggleButton} ${isOpen ? styles.hidden : ""}`}
        onClick={toggleSidebar}>
        <img src={profile} alt="Toggle menu" className={styles.toggleImage} />
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* Bouton de fermeture (en haut à droite de la sidebar) */}
        <button className={styles.closeButton} onClick={toggleSidebar}>
          ×
        </button>

        {/* Photo + Nom */}
        <div className={styles.profileSection}>
          <div className={styles.profileCircle}>
            <img
              src={profile} // Remplacez par votre image
              alt="Profil"
              className={styles.profileImage}
            />
          </div>
          <h3 className={styles.profileName}>
            {" "}
            {userDetails.firstName} {userDetails.lastName}
          </h3>
        </div>

        {/* Boutons de navigation */}
        <div className={styles.navButtons}>
          <button
            className={styles.navButton}
            onClick={handleNavigation("/admin-dashboard")}>
            Pedagogique informations
          </button>
          <button
            className={styles.navButton}
            onClick={handleNavigation("/planning-dashboard")}>
            Planning
          </button>
          <button
            className={styles.navButton}
            onClick={handleNavigation("/approval-dashboard")}>
            Aprobation
          </button>
        </div>

        {/* Bouton de déconnexion (en bas) */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut className={styles.logoutIcon} />
        </button>
      </div>
    </>
  );
}
