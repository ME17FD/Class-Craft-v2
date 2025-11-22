export const navigationSections = [
    {
        id: 'accueil',
        title: 'Accueil',
        links: [
            { id: 'dashboard', label: 'Tableau de bord', icon: '📊', path: '/' },
            { id: 'statistiques', label: 'Statistiques', icon: '📈', path: '/stats' },
        ],
    },
    {
        id: 'gestion-eleves',
        title: 'Gestion des Élèves',
        links: [
            { id: 'liste-eleves', label: 'Liste des élèves', icon: '📋', path: '/students' },
            { id: 'fiches-eleves', label: 'Fiches individuelles', icon: '📄', path: '/students/profiles' },
            { id: 'absences-eleves', label: 'Absences & retards', icon: '⏰', path: '/students/attendance' },
        ],
    },
    {
        id: 'gestion-classes',
        title: 'Gestion des Classes',
        links: [
            { id: 'liste-classes', label: 'Liste des classes', icon: '🏫', path: '/classes' },
            { id: 'emploi-temps-classes', label: 'Emploi du temps', icon: '📅', path: '/classes/schedule' },
        ],
    },
    {
        id: 'gestion-ressources',
        title: 'Gestion des Ressources',
        links: [
            { id: 'salles', label: 'Salles', icon: '🏛️', path: '/salles' },
            { id: 'professeurs', label: 'Professeurs', icon: '👨‍🏫', path: '/professors' },
            { id: 'filieres', label: 'Filières', icon: '🎓', path: '/filieres' },
            { id: 'modules', label: 'Modules', icon: '📖', path: '/modules' },
            { id: 'groupes', label: 'Groupes', icon: '👥', path: '/groupes' },
        ],
    },
    {
        id: 'cours-enseignement',
        title: 'Cours & Enseignement',
        links: [
            { id: 'matieres-enseignement', label: 'Matières enseignées', icon: '📚', path: '/subjects' },
            { id: 'devoirs-enseignement', label: 'Devoirs & exercices', icon: '📝', path: '/homework' },
        ],
    },
    {
        id: 'communication-parents',
        title: 'Communication Parents',
        links: [
            { id: 'messagerie-parents', label: 'Messagerie', icon: '✉️', path: '/messaging' },
            { id: 'annonces-parents', label: 'Annonces', icon: '📢', path: '/announcements' },
        ],
    },
    {
        id: 'administration-systeme',
        title: 'Administration',
        links: [
            { id: 'utilisateurs-admin', label: 'Gestion des utilisateurs', icon: '👥', path: '/admin/users' },
            { id: 'parametres-admin', label: 'Paramètres généraux', icon: '⚙️', path: '/admin/settings' },
        ],
    },
];