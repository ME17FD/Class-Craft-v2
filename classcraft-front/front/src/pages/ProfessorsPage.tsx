import { useState, useCallback } from 'react';
import { ProfessorDataGrid } from '../components/professors/ProfessorDataGrid';
import { ProfessorCoursesModal } from '../components/professors/ProfessorCoursesModal';
import { useProfessors } from '../hooks/professors/useProfessors';
import type { ProfessorDto, ProfessorRequestDto } from '../types/professors';
import type { ModuleDto } from '../types/modules';
import type { SousModuleDto } from '../types/sousModules';

export const ProfessorsPage: React.FC = () => {
    const {
        professors,
        loading,
        error,
        pagination,
        createProfessor,
        updateProfessor,
        deleteProfessor,
        getProfessorCourses,
        refresh,
    } = useProfessors({
        initialPage: 0,
        initialSize: 10,
        autoFetch: true,
    });

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [selectedProfessor, setSelectedProfessor] = useState<{
        id: number;
        name: string;
        modules: ModuleDto[];
        sousModules: SousModuleDto[];
    } | null>(null);
    const [coursesLoading, setCoursesLoading] = useState(false);

    const showNotification = useCallback((type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleNameClick = useCallback(async (id: number) => {
        const professor = professors.find(p => p.id === id);
        if (!professor) return;

        setCoursesLoading(true);
        try {
            const courses = await getProfessorCourses(id);
            setSelectedProfessor({
                id,
                name: `${professor.firstName} ${professor.lastName}`,
                modules: courses.modules,
                sousModules: courses.sousModules,
            });
        } catch (err) {
            showNotification('error', 'Erreur lors du chargement des cours');
        } finally {
            setCoursesLoading(false);
        }
    }, [professors, getProfessorCourses, showNotification]);

    const handleDelete = useCallback(async (professor: ProfessorDto) => {
        try {
            const success = await deleteProfessor(professor.id);
            if (success) {
                showNotification('success', `Professeur "${professor.firstName} ${professor.lastName}" supprimé avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la suppression du professeur');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    }, [deleteProfessor, showNotification]);

    const handleBulkUpdate = useCallback(async (updatedProfessors: ProfessorDto[]) => {
        try {
            const updatePromises = updatedProfessors.map(async (professor) => {
                return updateProfessor(professor.id, {
                    email: professor.email,
                    password: 'temp123',
                    firstName: professor.firstName,
                    lastName: professor.lastName,
                    approved: professor.approved,
                    groupeId: professor.groupeId,
                });
            });
            
            await Promise.all(updatePromises);
            showNotification('success', 'Professeurs mis à jour avec succès');
            await refresh();
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        }
    }, [updateProfessor, refresh, showNotification]);

    const handleAdd = useCallback(async (newProfessor: ProfessorRequestDto) => {
        try {
            const result = await createProfessor(newProfessor);
            if (result) {
                showNotification('success', `Professeur "${newProfessor.firstName} ${newProfessor.lastName}" créé avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la création du professeur');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    }, [createProfessor, showNotification]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {notification && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        padding: '16px 24px',
                        borderRadius: '4px',
                        backgroundColor: notification.type === 'success' ? '#4caf50' : '#f44336',
                        color: '#fff',
                        fontWeight: '500',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                    }}
                >
                    {notification.message}
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: '16px',
                        marginBottom: '20px',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        borderRadius: '4px',
                        border: '1px solid #ef5350',
                    }}
                >
                    <strong>Erreur :</strong> {error}
                </div>
            )}

            <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>
                Gestion des Professeurs
            </h1>

            <ProfessorDataGrid
                professors={professors}
                loading={loading}
                pagination={pagination}
                onDelete={handleDelete}
                onBulkUpdate={handleBulkUpdate}
                onAdd={handleAdd}
                onNameClick={handleNameClick}
            />

            {selectedProfessor && (
                <ProfessorCoursesModal
                    isOpen={!!selectedProfessor}
                    onClose={() => setSelectedProfessor(null)}
                    professorName={selectedProfessor.name}
                    modules={selectedProfessor.modules}
                    sousModules={selectedProfessor.sousModules}
                    loading={coursesLoading}
                />
            )}
        </div>
    );
};

export default ProfessorsPage;

