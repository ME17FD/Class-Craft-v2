import { CoursesPage } from './pages/CoursesPage'
import Sidebar from './components/ui/sidebar/Sidebar';
import BurgerMenu from './components/ui/sidebar/BurgerMenu';
import { useSidebar } from './hooks/sidebar/useSidebar';
import { navigationSections } from './utils/navigationlinks/navigationData';

// Données de navigation complètes avec plus de liens

function App() {


    const { 
    isSidebarOpen, 
    currentPath, 
    toggleSidebar, 
    closeSidebar, 
    navigate 
  } = useSidebar();

  const handleNavigation = (path: string) => {
    navigate(path);
    // Ici vous pouvez ajouter votre logique de routing (React Router, etc.)
    console.log('Navigation vers:', path);
    
    // Exemple avec React Router :
    // navigate(path); // si vous utilisez useNavigate de React Router
  };

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
        
      />
      {/* Le reste de votre contenu */}
      <div style={{ padding: '20px' }}>
        <CoursesPage />
      </div>
    </div>
  )
}

export default App
