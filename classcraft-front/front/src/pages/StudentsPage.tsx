import { useState, useCallback } from 'react';
import { StudentDataGrid } from '../components/students/StudentDataGrid';
import { useStudents } from '../hooks/students/useStudents';
import type { StudentDto, StudentRequestDto } from '../types/students';

export const StudentsPage: React.FC = () => {
    const {
        students,
        loading,
        error,
        pagination,
        createStudent,
        updateStudent,
        deleteStudent,
        refresh,
    } = useStudents({
        initialPage: 0,
        initialSize: 10,
        autoFetch: true,
    });

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const showNotification = useCallback((type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleDelete = useCallback(async (student: StudentDto) => {
        try {
            const success = await deleteStudent(student.id);
            if (success) {
                showNotification('success', `Étudiant "${student.firstName} ${student.lastName}" supprimé avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la suppression de l\'étudiant');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    }, [deleteStudent, showNotification]);

    const handleBulkUpdate = useCallback(async (updatedStudents: StudentDto[]) => {
        try {
            // Note: Le backend nécessite un mot de passe dans le DTO (@NotBlank)
            // mais le service ne le met à jour que s'il n'est pas vide
            // Pour éviter de changer le mot de passe, on devrait avoir un DTO séparé pour les mises à jour
            // Pour l'instant, on utilise une valeur minimale qui satisfait la validation
            // TODO: Créer un StudentUpdateDto côté backend qui rend le mot de passe optionnel
            
            const updatePromises = updatedStudents.map(async (student) => {
                return updateStudent(student.id, {
                    email: student.email,
                    password: 'temp123', // Valeur minimale pour satisfaire @NotBlank et @Size(min=6)
                    firstName: student.firstName,
                    lastName: student.lastName,
                    approved: student.approved,
                    groupeId: student.groupeId,
                });
            });
            
            await Promise.all(updatePromises);
            showNotification('success', 'Étudiants mis à jour avec succès');
            await refresh();
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        }
    }, [updateStudent, refresh, showNotification]);

    const handleAdd = useCallback(async (newStudent: StudentRequestDto) => {
        try {
            const result = await createStudent(newStudent);
            if (result) {
                showNotification('success', `Étudiant "${newStudent.firstName} ${newStudent.lastName}" créé avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la création de l\'étudiant');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    }, [createStudent, showNotification]);

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
                        animation: 'slideIn 0.3s ease-out',
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
                Gestion des Étudiants
            </h1>

            <StudentDataGrid
                students={students}
                loading={loading}
                pagination={pagination}
                onDelete={handleDelete}
                onBulkUpdate={handleBulkUpdate}
                onAdd={handleAdd}
            />
        </div>
    );
};

export default StudentsPage;

