import React from 'react';
import '../../../styles/components/sidebar/Sidebar.css';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onToggle }) => {
  return (
    <button 
      className={`burger-menu ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <span className="burger-line"></span>
      <span className="burger-line"></span>
      <span className="burger-line"></span>
    </button>
  );
};

export default BurgerMenu;