/* eslint-disable @typescript-eslint/no-explicit-any */
// Exemple complet de fonctionnement du DataGrid
import DataGrid from './ui/datagrid/dataGrid';
import { useState } from 'react';
import type { Column } from './ui/datagrid/dataGrid.types';

export const CoursesPage = () => {
  // Jeu de données complet avec diverses situations
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      code: 'MATH101', 
      name: 'Mathématiques Avancées', 
      credits: 4, 
      professor: 'Dr. Sophie Martin',
      department: 'Mathématiques',
      semester: 'Automne 2024',
      enrolledStudents: 45,
      maxCapacity: 50,
      status: 'Actif'
    },
    { 
      id: 2, 
      code: 'PHY101', 
      name: 'Physique Quantique', 
      credits: 3, 
      professor: 'Dr. Jean Dupont',
      department: 'Physique',
      semester: 'Automne 2024',
      enrolledStudents: 32,
      maxCapacity: 40,
      status: 'Actif'
    },
    { 
      id: 3, 
      code: 'CHM201', 
      name: 'Chimie Organique', 
      credits: 5, 
      professor: 'Dr. Marie Curie',
      department: 'Chimie',
      semester: 'Printemps 2024',
      enrolledStudents: 28,
      maxCapacity: 35,
      status: 'Actif'
    },
    { 
      id: 4, 
      code: 'BIO150', 
      name: 'Biologie Cellulaire', 
      credits: 4, 
      professor: 'Dr. Alain Bernard',
      department: 'Biologie',
      semester: 'Automne 2024',
      enrolledStudents: 60,
      maxCapacity: 60,
      status: 'Complet'
    },
    { 
      id: 5, 
      code: 'INF301', 
      name: 'Algorithmes et Structures de Données', 
      credits: 6, 
      professor: 'Dr. Laura Tech',
      department: 'Informatique',
      semester: 'Printemps 2024',
      enrolledStudents: 25,
      maxCapacity: 30,
      status: 'Actif'
    },
    { 
      id: 6, 
      code: 'HIS205', 
      name: 'Histoire Contemporaine', 
      credits: 3, 
      professor: 'Dr. Pierre Histor',
      department: 'Histoire',
      semester: 'Automne 2024',
      enrolledStudents: 40,
      maxCapacity: 45,
      status: 'Actif'
    },
    { 
      id: 7, 
      code: 'ECO101', 
      name: 'Économie Internationale', 
      credits: 4, 
      professor: 'Dr. Alice Économ',
      department: 'Économie',
      semester: 'Printemps 2024',
      enrolledStudents: 55,
      maxCapacity: 55,
      status: 'Complet'
    },
    { 
      id: 8, 
      code: 'ART110', 
      name: 'Histoire de l\'Art Moderne', 
      credits: 2, 
      professor: 'Dr. Marc Artiste',
      department: 'Arts',
      semester: 'Automne 2024',
      enrolledStudents: 20,
      maxCapacity: 25,
      status: 'Actif'
    },
    { 
      id: 9, 
      code: 'PHI201', 
      name: 'Philosophie des Sciences', 
      credits: 3, 
      professor: 'Dr. Élise Philosophe',
      department: 'Philosophie',
      semester: 'Printemps 2024',
      enrolledStudents: 35,
      maxCapacity: 40,
      status: 'Actif'
    },
    { 
      id: 10, 
      code: 'STA305', 
      name: 'Statistiques Avancées', 
      credits: 5, 
      professor: 'Dr. Thomas Statist',
      department: 'Mathématiques',
      semester: 'Automne 2024',
      enrolledStudents: 30,
      maxCapacity: 35,
      status: 'Actif'
    }
  ]);

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
  const paginationConfig = {
    currentPage: 1,
    totalPages: Math.ceil(courses.length / 5), // 5 éléments par page
    onPageChange: (page: number) => {
      console.log('Changement de page:', page);
      // Ici vous pouvez gérer le changement de page
    },
    pageSize: 5
  };

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
      
      <div style={{ 
        backgroundColor: '#f5f9ff', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #e1e8ed'
      }}>
        <h3 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>
          Fonctionnalités démontrées :
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#546e7a' }}>
          <li>Édition inline des cellules (cliquez sur une cellule)</li>
          <li>Ajout de nouvelles lignes (bouton "Nouveau cours")</li>
          <li>Suppression de lignes (bouton "Supprimer")</li>
          <li>Sauvegarde en lot des modifications</li>
          <li>Tri des colonnes (cliquez sur les en-têtes)</li>
          <li>Validation des champs requis</li>
          <li>Rendu personnalisé des cellules</li>
          <li>Actions globales (Export, Filtres)</li>
        </ul>
      </div>

      <DataGrid
        title="Catalogue des Cours"
        data={courses}
        columns={columns}
        onDelete={handleDelete}
        onBulkUpdate={handleBulkUpdate}
        onAdd={handleAdd}
        emptyRowTemplate={emptyCourseTemplate}
        addLabel="Nouveau cours"
        deleteLabel="Supprimer"
        className="courses-grid"
        pagination={paginationConfig}
        sorting={sortingConfig}
        actions={globalActions}
        height="600px"
        showActionsColumn={true}
        showAddButton={true}
      />

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ color: '#495057', margin: '0 0 10px 0' }}>
          Instructions d'utilisation :
        </h4>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#6c757d' }}>
          <li><strong>Édition</strong> : Cliquez sur n'importe quelle cellule éditable pour modifier sa valeur</li>
          <li><strong>Ajout</strong> : Utilisez le bouton "Nouveau cours" pour ajouter une ligne</li>
          <li><strong>Suppression</strong> : Utilisez le bouton "Supprimer" sur chaque ligne</li>
          <li><strong>Sauvegarde</strong> : Le bouton "Sauvegarder" apparaît automatiquement lors de modifications</li>
          <li><strong>Tri</strong> : Cliquez sur les en-têtes de colonnes avec des flèches ↕</li>
        </ol>
      </div>
    </div>
  );
};

export default CoursesPage;