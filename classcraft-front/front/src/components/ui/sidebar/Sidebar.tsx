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
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sections,
  currentPath,
  onNavigate,
  onLogout
}) => {
  const handleLinkClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      onClose();
    }
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

        {/* Bouton de déconnexion */}
        {onLogout && (
          <div style={{ 
            padding: '20px', 
            borderTop: '1px solid var(--color-border, #e0e0e0)',
            marginTop: 'auto'
          }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#d32f2f',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#c62828';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#d32f2f';
              }}
            >
              <span>🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;