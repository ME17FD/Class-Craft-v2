import React from 'react';
import '../../../styles/components/sidebar/sidebar.css';

interface SidebarLink {
  id: string;
  label: string;
  icon?: string;
  path: string;
}

interface SidebarSection {
  id: string;
  title: string;
  links: SidebarLink[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SidebarSection[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sections,
  currentPath,
  onNavigate
}) => {
  const handleLinkClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay open"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Menu</h2>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.id} className="sidebar-section">
                <h3 className="sidebar-section-title">{section.title}</h3>
                <ul className="sidebar-menu">
                  {section.links && section.links.map((link) => (
                    <li key={link.id} className="sidebar-item">
                      <a
                        href="#"
                        className={`sidebar-link ${
                          currentPath === link.path ? 'active' : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(link.path);
                        }}
                      >
                        {link.icon && (
                          <span className="sidebar-icon">{link.icon}</span>
                        )}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              Aucune section de navigation trouvée
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;