import React, { useState } from 'react';
import Modal from '../ui/modal/Modal';
import type { SousModuleDto, SousModuleRequestDto } from '../../types/sousModules';
import { sousModuleService } from '../../services/sousModules';

interface ModuleSousModulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleId: number;
    moduleName: string;
    sousModules: SousModuleDto[];
    loading?: boolean;
    onRefresh: () => void;
    professorId: number;
}

export const ModuleSousModulesModal: React.FC<ModuleSousModulesModalProps> = ({
    isOpen,
    onClose,
    moduleId,
    moduleName,
    sousModules: initialSousModules,
    loading = false,
    onRefresh,
    professorId,
}) => {
    const [sousModules, setSousModules] = useState<SousModuleDto[]>(initialSousModules);
    const [isAdding, setIsAdding] = useState(false);
    const [newSousModule, setNewSousModule] = useState<Partial<SousModuleRequestDto>>({
        name: '',
        numberOfHours: 0,
        moduleId: moduleId,
        professorId: professorId,
    });
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        setSousModules(initialSousModules);
    }, [initialSousModules]);

    const handleAddSousModule = async () => {
        if (!newSousModule.name || !newSousModule.numberOfHours) {
            setError('Tous les champs sont requis');
            return;
        }

        try {
            await sousModuleService.create(newSousModule as SousModuleRequestDto);
            setNewSousModule({ name: '', numberOfHours: 0, moduleId: moduleId, professorId: professorId });
            setIsAdding(false);
            setError(null);
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    };

    const handleDeleteSousModule = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce sous-module ?')) {
            return;
        }
        try {
            await sousModuleService.delete(id);
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Sous-modules - ${moduleName}`}
            size="large"
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div>Chargement...</div>
                </div>
            ) : (
                <div>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: '#1976d2', margin: 0 }}>
                            Sous-modules ({sousModules.length})
                        </h3>
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            {isAdding ? 'Annuler' : '+ Ajouter'}
                        </button>
                    </div>

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

                    {isAdding && (
                        <div style={{
                            padding: '15px',
                            marginBottom: '20px',
                            border: '1px solid #1976d2',
                            borderRadius: '4px',
                            backgroundColor: '#e3f2fd'
                        }}>
                            <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Nouveau sous-module</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Nom du sous-module"
                                    value={newSousModule.name || ''}
                                    onChange={(e) => setNewSousModule({ ...newSousModule, name: e.target.value })}
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Nombre d'heures"
                                    value={newSousModule.numberOfHours || ''}
                                    onChange={(e) => setNewSousModule({ ...newSousModule, numberOfHours: parseInt(e.target.value) || 0 })}
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                                <button
                                    onClick={handleAddSousModule}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#4caf50',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Créer
                                </button>
                            </div>
                        </div>
                    )}

                    {sousModules.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Aucun sous-module</p>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gap: '10px',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {sousModules.map((sousModule) => (
                                <div
                                    key={sousModule.id}
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
                                            {sousModule.name}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                            {sousModule.numberOfHours} heures | Professeur: {sousModule.professorName}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSousModule(sousModule.id)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#f44336',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

