/* eslint-disable @typescript-eslint/no-explicit-any */
// Exemple complet de fonctionnement du DataGrid
import DataGrid from '../components/ui/datagrid/dataGrid';
import { useMemo, useState } from 'react';
import type { Column } from '../types/datagrid/dataGrid.types';


export const CoursesPage = () => {
  // Données de navigation

  

  // Jeu de données complet avec diverses situations
const [courses, setCourses] = useState([
    { id: 1, code: 'MATH101', name: 'Mathématiques Avancées', credits: 4, professor: 'Dr. Sophie Martin', department: 'Mathématiques', semester: 'Automne 2024', enrolledStudents: 45, maxCapacity: 50, status: 'Actif' },
    { id: 2, code: 'PHY101', name: 'Physique Quantique', credits: 3, professor: 'Dr. Jean Dupont', department: 'Physique', semester: 'Automne 2024', enrolledStudents: 32, maxCapacity: 40, status: 'Actif' },
    { id: 3, code: 'CHM201', name: 'Chimie Organique', credits: 5, professor: 'Dr. Marie Curie', department: 'Chimie', semester: 'Printemps 2024', enrolledStudents: 28, maxCapacity: 35, status: 'Actif' },
    { id: 4, code: 'BIO150', name: 'Biologie Cellulaire', credits: 4, professor: 'Dr. Alain Bernard', department: 'Biologie', semester: 'Automne 2024', enrolledStudents: 60, maxCapacity: 60, status: 'Complet' },
    { id: 5, code: 'INF301', name: 'Algorithmes et Structures', credits: 6, professor: 'Dr. Laura Tech', department: 'Informatique', semester: 'Printemps 2024', enrolledStudents: 25, maxCapacity: 30, status: 'Actif' },
    { id: 6, code: 'HIS205', name: 'Histoire Contemporaine', credits: 3, professor: 'Dr. Pierre Histor', department: 'Histoire', semester: 'Automne 2024', enrolledStudents: 40, maxCapacity: 45, status: 'Actif' },
    { id: 7, code: 'ECO101', name: 'Économie Internationale', credits: 4, professor: 'Dr. Alice Économ', department: 'Économie', semester: 'Printemps 2024', enrolledStudents: 55, maxCapacity: 55, status: 'Complet' },
    { id: 8, code: 'ART110', name: 'Histoire de lArt Moderne', credits: 2, professor: 'Dr. Marc Artiste', department: 'Arts', semester: 'Automne 2024', enrolledStudents: 20, maxCapacity: 25, status: 'Actif' },
    { id: 9, code: 'PHI201', name: 'Philosophie des Sciences', credits: 3, professor: 'Dr. Élise Philosophe', department: 'Philosophie', semester: 'Printemps 2024', enrolledStudents: 35, maxCapacity: 40, status: 'Actif' },
    { id: 10, code: 'STA305', name: 'Statistiques Avancées', credits: 5, professor: 'Dr. Thomas Statist', department: 'Mathématiques', semester: 'Automne 2024', enrolledStudents: 30, maxCapacity: 35, status: 'Actif' },
    { id: 11, code: 'MATH202', name: 'Algèbre Linéaire', credits: 4, professor: 'Dr. Robert Math', department: 'Mathématiques', semester: 'Printemps 2024', enrolledStudents: 38, maxCapacity: 40, status: 'Actif' },
    { id: 12, code: 'PHY202', name: 'Mécanique Classique', credits: 4, professor: 'Dr. Sarah Physique', department: 'Physique', semester: 'Automne 2024', enrolledStudents: 42, maxCapacity: 45, status: 'Actif' },
    { id: 13, code: 'CHM102', name: 'Chimie Générale', credits: 3, professor: 'Dr. Paul Chimie', department: 'Chimie', semester: 'Printemps 2024', enrolledStudents: 50, maxCapacity: 50, status: 'Complet' },
    { id: 14, code: 'BIO201', name: 'Génétique', credits: 5, professor: 'Dr. Lisa Biologie', department: 'Biologie', semester: 'Automne 2024', enrolledStudents: 33, maxCapacity: 40, status: 'Actif' },
    { id: 15, code: 'INF102', name: 'Programmation Basique', credits: 4, professor: 'Dr. Marc Info', department: 'Informatique', semester: 'Printemps 2024', enrolledStudents: 48, maxCapacity: 50, status: 'Actif' },
    { id: 16, code: 'HIS101', name: 'Histoire Ancienne', credits: 3, professor: 'Dr. Anna Histoire', department: 'Histoire', semester: 'Automne 2024', enrolledStudents: 29, maxCapacity: 35, status: 'Actif' },
    { id: 17, code: 'ECO201', name: 'Microéconomie', credits: 4, professor: 'Dr. David Économie', department: 'Économie', semester: 'Printemps 2024', enrolledStudents: 44, maxCapacity: 45, status: 'Actif' },
    { id: 18, code: 'ART201', name: 'Art Contemporain', credits: 2, professor: 'Dr. Clara Art', department: 'Arts', semester: 'Automne 2024', enrolledStudents: 18, maxCapacity: 25, status: 'Actif' },
    { id: 19, code: 'PHI101', name: 'Introduction à la Philosophie', credits: 3, professor: 'Dr. Michel Philosophe', department: 'Philosophie', semester: 'Printemps 2024', enrolledStudents: 37, maxCapacity: 40, status: 'Actif' },
    { id: 20, code: 'STA101', name: 'Statistiques Descriptives', credits: 4, professor: 'Dr. Julie Stats', department: 'Mathématiques', semester: 'Automne 2024', enrolledStudents: 52, maxCapacity: 55, status: 'Actif' },
    { id: 21, code: 'MATH305', name: 'Calcul Différentiel', credits: 5, professor: 'Dr. Pierre Calcul', department: 'Mathématiques', semester: 'Printemps 2024', enrolledStudents: 26, maxCapacity: 30, status: 'Actif' },
    { id: 22, code: 'PHY305', name: 'Électromagnétisme', credits: 5, professor: 'Dr. Luc Électro', department: 'Physique', semester: 'Automne 2024', enrolledStudents: 31, maxCapacity: 35, status: 'Actif' },
    { id: 23, code: 'CHM305', name: 'Chimie Analytique', credits: 4, professor: 'Dr. Sophie Analyse', department: 'Chimie', semester: 'Printemps 2024', enrolledStudents: 39, maxCapacity: 40, status: 'Actif' },
    { id: 24, code: 'BIO305', name: 'Écologie', credits: 4, professor: 'Dr. Paul Écolo', department: 'Biologie', semester: 'Automne 2024', enrolledStudents: 34, maxCapacity: 40, status: 'Actif' },
    { id: 25, code: 'INF405', name: 'Intelligence Artificielle', credits: 6, professor: 'Dr. Alice IA', department: 'Informatique', semester: 'Printemps 2024', enrolledStudents: 47, maxCapacity: 50, status: 'Actif' },
    { id: 26, code: 'HIS305', name: 'Histoire Médiévale', credits: 3, professor: 'Dr. Robert Médiéval', department: 'Histoire', semester: 'Automne 2024', enrolledStudents: 23, maxCapacity: 30, status: 'Actif' },
    { id: 27, code: 'ECO305', name: 'Macroéconomie', credits: 4, professor: 'Dr. Laura Macro', department: 'Économie', semester: 'Printemps 2024', enrolledStudents: 41, maxCapacity: 45, status: 'Actif' },
    { id: 28, code: 'ART305', name: 'Sculpture Moderne', credits: 2, professor: 'Dr. Jean Sculpture', department: 'Arts', semester: 'Automne 2024', enrolledStudents: 16, maxCapacity: 20, status: 'Actif' },
    { id: 29, code: 'PHI305', name: 'Éthique Appliquée', credits: 3, professor: 'Dr. Marie Éthique', department: 'Philosophie', semester: 'Printemps 2024', enrolledStudents: 32, maxCapacity: 35, status: 'Actif' },
    { id: 30, code: 'STA405', name: 'Probabilités Avancées', credits: 5, professor: 'Dr. Thomas Probas', department: 'Mathématiques', semester: 'Automne 2024', enrolledStudents: 28, maxCapacity: 30, status: 'Actif' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15; // 15 éléments par page

    const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return courses.slice(startIndex, startIndex + pageSize);
  }, [courses, currentPage, pageSize]);

  const totalPages = Math.ceil(courses.length / pageSize);

  // Configuration complète des colonnes avec différents types et fonctionnalités
  const columns: Column[] = [
    { 
      key: 'code', 
      label: 'Code Cours', 
      sortable: true, 
      editable: true, 
      required: true,
      type: 'string',
      width: '120px'
    },
    { 
      key: 'name', 
      label: 'Nom du Cours', 
      sortable: true, 
      editable: true, 
      required: true,
      type: 'string',
      width: '200px'
    },
    { 
      key: 'credits', 
      label: 'Crédits', 
      sortable: true, 
      editable: true, 
      type: 'number',
      required: true,
      width: '100px'
    },
    { 
      key: 'professor', 
      label: 'Professeur',
      editable: true,
      required: true,
      type: 'string',
      width: '180px',
      render: (value: string) => <span style={{ fontWeight: '600' }}>{value}</span>
    },
    { 
      key: 'department', 
      label: 'Département',
      sortable: true,
      editable: true,
      type: 'string',
      width: '150px'
    },
    { 
      key: 'semester', 
      label: 'Semestre',
      sortable: true,
      editable: true,
      type: 'string',
      width: '140px'
    },
    { 
      key: 'enrolledStudents', 
      label: 'Étudiants Inscrits',
      sortable: true,
      editable: true,
      type: 'number',
      width: '160px',
      render: (value: number, row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{value}</span>
          {row && value === row.maxCapacity && (
            <span style={{ 
              color: '#d32f2f', 
              fontSize: '12px', 
              fontWeight: 'bold' 
            }}>
              COMPLET
            </span>
          )}
        </div>
      )
    },
    { 
      key: 'maxCapacity', 
      label: 'Capacité Max',
      sortable: true,
      editable: true,
      type: 'number',
      width: '140px'
    },
    { 
      key: 'status', 
      label: 'Statut',
      sortable: true,
      editable: true,
      type: 'string',
      width: '120px',
      render: (value: string) => {
        const statusColors: { [key: string]: string } = {
          'Actif': '#4caf50',
          'Complet': '#f44336',
          'Inactif': '#ff9800'
        };
        return (
          <span style={{ 
            color: statusColors[value] || '#666',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            {value}
          </span>
        );
      }
    }
  ];

  // Gestion de la suppression avec confirmation
  const handleDelete = (course: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${course.name}" ?`)) {
      setCourses(prev => prev.filter(c => c.id !== course.id));
    }
  };

  // Gestion des modifications en lot
  const handleBulkUpdate = (updatedCourses: any[]) => {
    setCourses(updatedCourses);
    console.log('Modifications sauvegardées:', updatedCourses);
    // Ici vous pouvez appeler votre API pour sauvegarder les modifications
  };

  // Gestion de l'ajout de nouveaux cours
  const handleAdd = (newCourse: any) => {
    const courseWithId = {
      ...newCourse,
      id: Math.max(...courses.map(c => c.id), 0) + 1,
      enrolledStudents: 0,
      status: 'Actif'
    };
    setCourses(prev => [...prev, courseWithId]);
    console.log('Nouveau cours ajouté:', courseWithId);
  };

  // Template pour la nouvelle ligne
  const emptyCourseTemplate = {
    code: '',
    name: '',
    credits: 0,
    professor: '',
    department: '',
    semester: 'Automne 2024',
    enrolledStudents: 0,
    maxCapacity: 30,
    status: 'Actif'
  };

  // Configuration de pagination


  // Configuration de tri
  const sortingConfig = {
    sortBy: 'name',
    sortOrder: 'asc' as const,
    onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => {
      console.log('Tri par:', sortBy, 'ordre:', sortOrder);
      // Ici vous pouvez gérer le tri
    }
  };

  // Actions globales
  const globalActions = (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button 
        onClick={() => alert('Export des données...')}
        style={{
          padding: '8px 16px',
          border: '1px solid #1976d2',
          background: 'white',
          color: '#1976d2',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        Exporter
      </button>
      <button 
        onClick={() => alert('Filtres avancés...')}
        style={{
          padding: '8px 16px',
          border: '1px solid #4caf50',
          background: 'white',
          color: '#4caf50',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        Filtres
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      

     
      <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>
        Système de Gestion des Cours Universitaires
      </h1>
      <DataGrid
        title={`Catalogue des Cours (${courses.length} cours au total)`}
        data={paginatedData}
        sorting={sortingConfig}
        actions={globalActions}
        columns={columns}
        onDelete={handleDelete}
        onBulkUpdate={handleBulkUpdate}
        onAdd={handleAdd}
        emptyRowTemplate={emptyCourseTemplate}
        addLabel="Nouveau cours"
        deleteLabel="Supprimer"
        className="courses-grid"
        pagination={{
          currentPage: currentPage,
          totalPages: totalPages,
          onPageChange: setCurrentPage, // Utiliser directement setCurrentPage
          pageSize: pageSize
        }}
        showActionsColumn={true}
        showAddButton={true}
      />
    </div>
  );
};

export default CoursesPage;