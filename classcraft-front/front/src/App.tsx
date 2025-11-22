import { useState, useEffect } from 'react';
import { CoursesPage } from './pages/CoursesPage';
import StudentsPage from './pages/StudentsPage';
import SallesPage from './pages/SallesPage';
import ProfessorsPage from './pages/ProfessorsPage';
import MajorsPage from './pages/MajorsPage';
import ModulesPage from './pages/ModulesPage';
import GroupesPage from './pages/GroupesPage';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/ui/sidebar/Sidebar';
import BurgerMenu from './components/ui/sidebar/BurgerMenu';
import { useSidebar } from './hooks/sidebar/useSidebar';
import { useAuth } from './hooks/auth/useAuth';
import { navigationSections } from './utils/navigationlinks/navigationData';

function App() {
  const { 
    isSidebarOpen, 
    currentPath, 
    toggleSidebar, 
    closeSidebar, 
    navigate 
  } = useSidebar();

  const { isAuthenticated, login, logout, checkAuth } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
    setIsCheckingAuth(false);
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token) {
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
      login(token, user || undefined);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    console.log('Navigation vers:', path);
  };

  // Fonction pour rendre le contenu selon le chemin actuel
  const renderContent = () => {
    switch (currentPath) {
      case '/students':
        return <StudentsPage />;
      case '/salles':
      case '/classrooms':
        return <SallesPage />;
      case '/professors':
        return <ProfessorsPage />;
      case '/majors':
      case '/filieres':
        return <MajorsPage />;
      case '/modules':
        return <ModulesPage />;
      case '/groupes':
      case '/groups':
        return <GroupesPage />;
      case '/':
      default:
        return <CoursesPage />;
    }
  };

  // Afficher le login si non authentifié
  if (isCheckingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      {/* Burger menu toujours en haut à gauche */}
      <BurgerMenu isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      {/* Sidebar toujours en haut à gauche */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        sections={navigationSections}
        currentPath={currentPath}
        onNavigate={handleNavigation}
        onLogout={logout}
      />
      
      {/* Le reste de votre contenu */}
      <div style={{ padding: '20px' }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default App
