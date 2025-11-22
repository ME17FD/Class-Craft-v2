import { useState, useCallback } from 'react';
import { MajorDataGrid } from '../components/majors/MajorDataGrid';
import { MajorCoursesModal } from '../components/majors/MajorCoursesModal';
import { useMajors } from '../hooks/majors/useMajors';
import type { MajorDto, MajorRequestDto } from '../types/majors';
import type { ModuleDto } from '../types/modules';
import type { SousModuleDto } from '../types/sousModules';

export const MajorsPage: React.FC = () => {
    const {
        majors,
        loading,
        error,
        pagination,
        createMajor,
        updateMajor,
        deleteMajor,
        getMajorCourses,
        refresh,
    } = useMajors({
        initialPage: 0,
        initialSize: 10,
        autoFetch: true,
    });

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [selectedMajor, setSelectedMajor] = useState<{
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
        const major = majors.find(m => m.id === id);
        if (!major) return;

        setCoursesLoading(true);
        try {
            const courses = await getMajorCourses(id);
            setSelectedMajor({
                id,
                name: major.name,
                modules: courses.modules,
                sousModules: courses.sousModules,
            });
        } catch (err) {
            showNotification('error', 'Erreur lors du chargement des cours');
        } finally {
            setCoursesLoading(false);
        }
    }, [majors, getMajorCourses, showNotification]);

    const handleDelete = useCallback(async (major: MajorDto) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la filière "${major.name}" ? Cela supprimera également tous les modules et sous-modules associés.`)) {
            return;
        }
        try {
            const success = await deleteMajor(major.id);
            if (success) {
                showNotification('success', `Filière "${major.name}" et tous ses modules/sous-modules supprimés avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la suppression de la filière');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    }, [deleteMajor, showNotification]);

    const handleBulkUpdate = useCallback(async (updatedMajors: MajorDto[]) => {
        try {
            const updatePromises = updatedMajors.map(async (major) => {
                return updateMajor(major.id, {
                    name: major.name,
                    description: major.description,
                });
            });
            
            await Promise.all(updatePromises);
            showNotification('success', 'Filières mises à jour avec succès');
            await refresh();
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        }
    }, [updateMajor, refresh, showNotification]);

    const handleAdd = useCallback(async (newMajor: MajorRequestDto) => {
        try {
            const result = await createMajor(newMajor);
            if (result) {
                showNotification('success', `Filière "${newMajor.name}" créée avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la création de la filière');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    }, [createMajor, showNotification]);

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
                Gestion des Filières
            </h1>

            <MajorDataGrid
                majors={majors}
                loading={loading}
                pagination={pagination}
                onDelete={handleDelete}
                onBulkUpdate={handleBulkUpdate}
                onAdd={handleAdd}
                onNameClick={handleNameClick}
            />

            {selectedMajor && (
                <MajorCoursesModal
                    isOpen={!!selectedMajor}
                    onClose={() => setSelectedMajor(null)}
                    majorId={selectedMajor.id}
                    majorName={selectedMajor.name}
                    modules={selectedMajor.modules}
                    sousModules={selectedMajor.sousModules}
                    loading={coursesLoading}
                    onRefresh={async () => {
                        const updated = await getMajorCourses(selectedMajor.id);
                        setSelectedMajor({ ...selectedMajor, modules: updated.modules, sousModules: updated.sousModules });
                        await refresh();
                    }}
                />
            )}
        </div>
    );
};

export default MajorsPage;

