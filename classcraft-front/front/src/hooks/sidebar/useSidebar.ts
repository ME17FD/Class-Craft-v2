import { useState } from 'react';

export const useSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('/');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const navigate = (path: string) => {
        setCurrentPath(path);
        // Ici vous pouvez intégrer votre router (React Router, etc.)
        console.log('Navigation vers:', path);
    };

    return {
        isSidebarOpen,
        currentPath,
        toggleSidebar,
        closeSidebar,
        navigate
    };
};