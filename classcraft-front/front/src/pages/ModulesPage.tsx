import { useState, useCallback } from 'react';
import { ModuleDataGrid } from '../components/modules/ModuleDataGrid';
import { ModuleSousModulesModal } from '../components/modules/ModuleSousModulesModal';
import { useModules } from '../hooks/modules/useModules';
import type { ModuleDto, ModuleRequestDto } from '../types/modules';
import type { SousModuleDto } from '../types/sousModules';

export const ModulesPage: React.FC = () => {
    const {
        modules,
        loading,
        error,
        pagination,
        createModule,
        updateModule,
        deleteModule,
        getModuleSousModules,
        refresh,
    } = useModules({
        initialPage: 0,
        initialSize: 10,
        autoFetch: true,
    });

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [selectedModule, setSelectedModule] = useState<{
        id: number;
        name: string;
        professorId: number;
        sousModules: SousModuleDto[];
    } | null>(null);
    const [sousModulesLoading, setSousModulesLoading] = useState(false);

    const showNotification = useCallback((type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleNameClick = useCallback(async (id: number) => {
        const module = modules.find(m => m.id === id);
        if (!module) return;

        setSousModulesLoading(true);
        try {
            const sousModules = await getModuleSousModules(id);
            setSelectedModule({
                id,
                name: module.name,
                professorId: module.professorId,
                sousModules,
            });
        } catch (err) {
            showNotification('error', 'Erreur lors du chargement des sous-modules');
        } finally {
            setSousModulesLoading(false);
        }
    }, [modules, getModuleSousModules, showNotification]);

    const handleDelete = useCallback(async (module: ModuleDto) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le module "${module.name}" ? Cela supprimera également tous les sous-modules associés.`)) {
            return;
        }
        try {
            const success = await deleteModule(module.id);
            if (success) {
                showNotification('success', `Module "${module.name}" et ses sous-modules supprimés avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la suppression du module');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    }, [deleteModule, showNotification]);

    const handleBulkUpdate = useCallback(async (updatedModules: ModuleDto[]) => {
        try {
            const updatePromises = updatedModules.map(async (module) => {
                return updateModule(module.id, {
                    name: module.name,
                    code: module.code,
                    numberOfHours: module.numberOfHours,
                    professorId: module.professorId,
                    semestreId: module.semestreId,
                });
            });
            
            await Promise.all(updatePromises);
            showNotification('success', 'Modules mis à jour avec succès');
            await refresh();
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        }
    }, [updateModule, refresh, showNotification]);

    const handleAdd = useCallback(async (newModule: ModuleRequestDto) => {
        try {
            const result = await createModule(newModule);
            if (result) {
                showNotification('success', `Module "${newModule.name}" créé avec succès`);
            } else {
                showNotification('error', 'Erreur lors de la création du module');
            }
        } catch (err) {
            showNotification('error', err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    }, [createModule, showNotification]);

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
                Gestion des Modules
            </h1>

            <ModuleDataGrid
                modules={modules}
                loading={loading}
                pagination={pagination}
                onDelete={handleDelete}
                onBulkUpdate={handleBulkUpdate}
                onAdd={handleAdd}
                onNameClick={handleNameClick}
            />

            {selectedModule && (
                <ModuleSousModulesModal
                    isOpen={!!selectedModule}
                    onClose={() => setSelectedModule(null)}
                    moduleId={selectedModule.id}
                    moduleName={selectedModule.name}
                    sousModules={selectedModule.sousModules}
                    loading={sousModulesLoading}
                    onRefresh={async () => {
                        const updated = await getModuleSousModules(selectedModule.id);
                        setSelectedModule({ ...selectedModule, sousModules: updated });
                        await refresh();
                    }}
                    professorId={selectedModule.professorId}
                />
            )}
        </div>
    );
};

export default ModulesPage;

