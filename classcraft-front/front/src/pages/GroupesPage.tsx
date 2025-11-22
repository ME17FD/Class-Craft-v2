import { useState, useCallback } from 'react';
import { GroupeDataGrid } from '../components/groupes/GroupeDataGrid';
import { GroupeStudentsModal } from '../components/groupes/GroupeStudentsModal';
import { useGroupes } from '../hooks/groupes/useGroupes';
import type { GroupeDto, GroupeRequestDto } from '../types/groupes';
import type { StudentDto } from '../types/students';

export const GroupesPage: React.FC = () => {
    const {
        groupes,
        loading,
        error,
        pagination,
        createGroupe,
        updateGroupe,
        deleteGroupe,
        getGroupeStudents,
        getAllStudents,
        addStudentToGroupe,
        removeStudentFromGroupe,
        refresh,
    } = useGroupes({
        initialPage: 0,
        initialSize: 10,
        autoFetch: true,
    });

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [selectedGroupe, setSelectedGroupe] = useState<{
        id: number;
        name: string;
        students: StudentDto[];
    } | null>(null);
    const [allStudents, setAllStudents] = useState<StudentDto[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const showNotification = useCallback((type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleNameClick = useCallback(async (id: number) => {
        const groupe = groupes.find(g => g.id === id);
        if (!groupe) return;

        setStudentsLoading(true);
        try {
            const [students, all] = await Promise.all([
                getGroupeStudents(id),
                getAllStudents(),
            ]);
            setSelectedGroupe({
                id,
                name: groupe.name,
                students,
            });
            setAllStudents(all);
        } catch (err) {
            showNotification('error', 'Erreur lors du chargement des étudiants');
        } finally {
            setStudentsLoading(false);
        }
    }, [groupes, getGroupeStudents, getAllStudents, showNotification]);

    const handleAddStudent = useCallback(async (studentId: number) => {
        if (!selectedGroupe) return;
        try {
            const success = await addStudentToGroupe(studentId, selectedGroupe.id);
            if (success) {
                const updated = await getGroupeStudents(selectedGroupe.id);
                setSelectedGroupe({ ...selectedGroupe, students: updated });
                showNotification('success', 'Étudiant ajouté au groupe avec succès');
            } else {
                showNotification('error', 'Erreur lors de l\'ajout de l\'étudiant');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
        }
    }, [selectedGroupe, addStudentToGroupe, getGroupeStudents, showNotification]);

    const handleRemoveStudent = useCallback(async (studentId: number) => {
        if (!selectedGroupe) return;
        try {
            const success = await removeStudentFromGroupe(studentId);
            if (success) {
                const updated = await getGroupeStudents(selectedGroupe.id);
                setSelectedGroupe({ ...selectedGroupe, students: updated });
                const all = await getAllStudents();
                setAllStudents(all);
                showNotification('success', 'Étudiant retiré du groupe avec succès');
            } else {
                showNotification('error', 'Erreur lors du retrait de l\'étudiant');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors du retrait');
        }
    }, [selectedGroupe, removeStudentFromGroupe, getGroupeStudents, getAllStudents, showNotification]);

    const handleDelete = useCallback(async (groupe: GroupeDto) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le groupe "${groupe.name}" ? Les étudiants ne seront pas supprimés, mais leur groupe sera retiré.`)) {
            return;
        }
        try {
            const success = await deleteGroupe(groupe.id);
            if (success) {
                showNotification('success', `Groupe "${groupe.name}" supprimé avec succès. Les étudiants ont été conservés.`);
            } else {
                showNotification('error', 'Erreur lors de la suppression du groupe');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    }, [deleteGroupe, showNotification]);

    const handleBulkUpdate = useCallback(async (updatedGroupes: GroupeDto[]) => {
        try {
            const updatePromises = updatedGroupes.map(async (groupe) => {
                return updateGroupe(groupe.id, {
                    name: groupe.name,
                    sectionId: groupe.sectionId,
                });
            });
            
            await Promise.all(updatePromises);
            showNotification('success', 'Groupes mis à jour avec succès');
            await refresh();
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        }
    }, [updateGroupe, refresh, showNotification]);

    const handleAdd = useCallback(async (newGroupe: GroupeRequestDto) => {
        try {
            const result = await createGroupe(newGroupe);
            if (result) {
                showNotification('success', `Groupe "${newGroupe.name}" créé avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la création du groupe');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    }, [createGroupe, showNotification]);

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
                Gestion des Groupes
            </h1>

            <GroupeDataGrid
                groupes={groupes}
                loading={loading}
                pagination={pagination}
                onDelete={handleDelete}
                onBulkUpdate={handleBulkUpdate}
                onAdd={handleAdd}
                onNameClick={handleNameClick}
            />

            {selectedGroupe && (
                <GroupeStudentsModal
                    isOpen={!!selectedGroupe}
                    onClose={() => setSelectedGroupe(null)}
                    groupeId={selectedGroupe.id}
                    groupeName={selectedGroupe.name}
                    students={selectedGroupe.students}
                    allStudents={allStudents}
                    loading={studentsLoading}
                    onAddStudent={handleAddStudent}
                    onRemoveStudent={handleRemoveStudent}
                    onRefresh={async () => {
                        const updated = await getGroupeStudents(selectedGroupe.id);
                        const all = await getAllStudents();
                        setSelectedGroupe({ ...selectedGroupe, students: updated });
                        setAllStudents(all);
                    }}
                />
            )}
        </div>
    );
};

export default GroupesPage;

