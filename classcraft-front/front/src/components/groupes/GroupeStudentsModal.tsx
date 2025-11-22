import React, { useState, useEffect } from 'react';
import Modal from '../ui/modal/Modal';
import type { StudentDto } from '../../types/students';

interface GroupeStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupeId: number;
    groupeName: string;
    students: StudentDto[];
    allStudents: StudentDto[];
    loading?: boolean;
    onAddStudent: (studentId: number) => Promise<void>;
    onRemoveStudent: (studentId: number) => Promise<void>;
    onRefresh: () => void;
}

export const GroupeStudentsModal: React.FC<GroupeStudentsModalProps> = ({
    isOpen,
    onClose,
    groupeId,
    groupeName,
    students: initialStudents,
    allStudents,
    loading = false,
    onAddStudent,
    onRemoveStudent,
    onRefresh,
}) => {
    const [students, setStudents] = useState<StudentDto[]>(initialStudents);
    const [availableStudents, setAvailableStudents] = useState<StudentDto[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        setStudents(initialStudents);
        // Filtrer les étudiants qui ne sont pas dans ce groupe
        const studentIdsInGroupe = new Set(initialStudents.map(s => s.id));
        setAvailableStudents(allStudents.filter(s => !studentIdsInGroupe.has(s.id)));
    }, [initialStudents, allStudents]);

    const handleAddStudent = async () => {
        if (!selectedStudentId) {
            setError('Veuillez sélectionner un étudiant');
            return;
        }

        setActionLoading(true);
        setError(null);
        try {
            await onAddStudent(selectedStudentId);
            setSelectedStudentId(null);
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveStudent = async (studentId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir retirer cet étudiant du groupe ?')) {
            return;
        }

        setActionLoading(true);
        setError(null);
        try {
            await onRemoveStudent(studentId);
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du retrait');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Étudiants du groupe - ${groupeName}`}
            size="large"
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div>Chargement...</div>
                </div>
            ) : (
                <div>
                    {error && (
                        <div style={{
                            padding: '12px',
                            marginBottom: '15px',
                            backgroundColor: '#ffebee',
                            color: '#c62828',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Section Ajouter un étudiant */}
                    <div style={{
                        padding: '15px',
                        marginBottom: '20px',
                        border: '1px solid #1976d2',
                        borderRadius: '4px',
                        backgroundColor: '#e3f2fd'
                    }}>
                        <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Ajouter un étudiant</h4>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <select
                                value={selectedStudentId || ''}
                                onChange={(e) => setSelectedStudentId(parseInt(e.target.value) || null)}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                                disabled={actionLoading || availableStudents.length === 0}
                            >
                                <option value="">Sélectionner un étudiant</option>
                                {availableStudents.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.firstName} {student.lastName} ({student.email})
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddStudent}
                                disabled={!selectedStudentId || actionLoading || availableStudents.length === 0}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: availableStudents.length === 0 ? '#ccc' : '#4caf50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: availableStudents.length === 0 ? 'not-allowed' : 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {actionLoading ? 'Ajout...' : 'Ajouter'}
                            </button>
                        </div>
                        {availableStudents.length === 0 && (
                            <p style={{ marginTop: '10px', color: '#666', fontSize: '0.875rem', fontStyle: 'italic' }}>
                                Tous les étudiants sont déjà dans ce groupe
                            </p>
                        )}
                    </div>

                    {/* Liste des étudiants */}
                    <div>
                        <h3 style={{ 
                            color: '#1976d2', 
                            marginBottom: '15px',
                            fontSize: '18px',
                            borderBottom: '2px solid #1976d2',
                            paddingBottom: '8px'
                        }}>
                            Étudiants dans le groupe ({students.length})
                        </h3>
                        {students.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>Aucun étudiant dans ce groupe</p>
                        ) : (
                            <div style={{ 
                                display: 'grid', 
                                gap: '10px',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {student.firstName} {student.lastName}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                                {student.email} | {student.approved ? '✓ Approuvé' : '✗ Non approuvé'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveStudent(student.id)}
                                            disabled={actionLoading}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#f44336',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: actionLoading ? 'not-allowed' : 'pointer',
                                                fontSize: '0.875rem',
                                                opacity: actionLoading ? 0.6 : 1
                                            }}
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

