import { useState, useCallback } from 'react';
import { SalleDataGrid } from '../components/salles/SalleDataGrid';
import { useSalles } from '../hooks/salles/useSalles';
import type { SalleDto, SalleRequestDto } from '../types/salles';

export const SallesPage: React.FC = () => {
    const {
        salles,
        loading,
        error,
        pagination,
        createSalle,
        updateSalle,
        deleteSalle,
        refresh,
    } = useSalles({
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

    const handleDelete = useCallback(async (salle: SalleDto) => {
        try {
            const success = await deleteSalle(salle.id);
            if (success) {
                showNotification('success', `Salle "${salle.name}" supprimée avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la suppression de la salle');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    }, [deleteSalle, showNotification]);

    const handleBulkUpdate = useCallback(async (updatedSalles: SalleDto[]) => {
        try {
            const updatePromises = updatedSalles.map(async (salle) => {
                return updateSalle(salle.id, {
                    name: salle.name,
                    type: salle.type,
                    capacity: salle.capacity,
                });
            });
            
            await Promise.all(updatePromises);
            showNotification('success', 'Salles mises à jour avec succès');
            await refresh();
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        }
    }, [updateSalle, refresh, showNotification]);

    const handleAdd = useCallback(async (newSalle: SalleRequestDto) => {
        try {
            const result = await createSalle(newSalle);
            if (result) {
                showNotification('success', `Salle "${newSalle.name}" créée avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la création de la salle');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    }, [createSalle, showNotification]);

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
                Gestion des Salles
            </h1>

            <SalleDataGrid
                salles={salles}
                loading={loading}
                pagination={pagination}
                onDelete={handleDelete}
                onBulkUpdate={handleBulkUpdate}
                onAdd={handleAdd}
            />
        </div>
    );
};

export default SallesPage;

