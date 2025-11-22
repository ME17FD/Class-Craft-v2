import React, { useState } from 'react';
import Modal from '../ui/modal/Modal';
import type { ModuleDto, ModuleRequestDto } from '../../types/modules';
import type { SousModuleDto, SousModuleRequestDto } from '../../types/sousModules';
import { moduleService } from '../../services/modules';
import { sousModuleService } from '../../services/sousModules';

interface MajorCoursesModalProps {
    isOpen: boolean;
    onClose: () => void;
    majorId: number;
    majorName: string;
    modules: ModuleDto[];
    sousModules: SousModuleDto[];
    loading?: boolean;
    onRefresh: () => void;
}

export const MajorCoursesModal: React.FC<MajorCoursesModalProps> = ({
    isOpen,
    onClose,
    majorId,
    majorName,
    modules: initialModules,
    sousModules: initialSousModules,
    loading = false,
    onRefresh,
}) => {
    const [modules, setModules] = useState<ModuleDto[]>(initialModules);
    const [sousModules, setSousModules] = useState<SousModuleDto[]>(initialSousModules);
    const [isAddingModule, setIsAddingModule] = useState(false);
    const [isAddingSousModule, setIsAddingSousModule] = useState(false);
    const [newModule, setNewModule] = useState<Partial<ModuleRequestDto>>({
        name: '',
        code: '',
        numberOfHours: 0,
        professorId: 0,
        semestreId: 0,
    });
    const [newSousModule, setNewSousModule] = useState<Partial<SousModuleRequestDto>>({
        name: '',
        numberOfHours: 0,
        moduleId: 0,
        professorId: 0,
    });
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        setModules(initialModules);
        setSousModules(initialSousModules);
    }, [initialModules, initialSousModules]);

    const handleAddModule = async () => {
        if (!newModule.name || !newModule.code || !newModule.numberOfHours || !newModule.professorId || !newModule.semestreId) {
            setError('Tous les champs sont requis');
            return;
        }

        try {
            await moduleService.create(newModule as ModuleRequestDto);
            setNewModule({ name: '', code: '', numberOfHours: 0, professorId: 0, semestreId: 0 });
            setIsAddingModule(false);
            setError(null);
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    };

    const handleAddSousModule = async () => {
        if (!newSousModule.name || !newSousModule.numberOfHours || !newSousModule.moduleId || !newSousModule.professorId) {
            setError('Tous les champs sont requis');
            return;
        }

        try {
            await sousModuleService.create(newSousModule as SousModuleRequestDto);
            setNewSousModule({ name: '', numberOfHours: 0, moduleId: 0, professorId: 0 });
            setIsAddingSousModule(false);
            setError(null);
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Modules et Sous-modules - ${majorName}`}
            size="xlarge"
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

                    {/* Modules Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ 
                                color: '#1976d2', 
                                margin: 0,
                                fontSize: '18px',
                                borderBottom: '2px solid #1976d2',
                                paddingBottom: '8px'
                            }}>
                                Modules ({modules.length})
                            </h3>
                            <button
                                onClick={() => setIsAddingModule(!isAddingModule)}
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
                                {isAddingModule ? 'Annuler' : '+ Ajouter Module'}
                            </button>
                        </div>

                        {isAddingModule && (
                            <div style={{
                                padding: '15px',
                                marginBottom: '15px',
                                border: '1px solid #1976d2',
                                borderRadius: '4px',
                                backgroundColor: '#e3f2fd'
                            }}>
                                <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Nouveau module</h4>
                                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        value={newModule.name || ''}
                                        onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Code"
                                        value={newModule.code || ''}
                                        onChange={(e) => setNewModule({ ...newModule, code: e.target.value })}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Nombre d'heures"
                                        value={newModule.numberOfHours || ''}
                                        onChange={(e) => setNewModule({ ...newModule, numberOfHours: parseInt(e.target.value) || 0 })}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="ID Professeur"
                                        value={newModule.professorId || ''}
                                        onChange={(e) => setNewModule({ ...newModule, professorId: parseInt(e.target.value) || 0 })}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="ID Semestre"
                                        value={newModule.semestreId || ''}
                                        onChange={(e) => setNewModule({ ...newModule, semestreId: parseInt(e.target.value) || 0 })}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <button
                                        onClick={handleAddModule}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#4caf50',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Créer Module
                                    </button>
                                </div>
                            </div>
                        )}

                        {modules.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>Aucun module</p>
                        ) : (
                            <div style={{ 
                                display: 'grid', 
                                gap: '10px',
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}>
                                {modules.map((module) => (
                                    <div
                                        key={module.id}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                    >
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                            {module.name} ({module.code})
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                            {module.numberOfHours} heures
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sous-modules Section */}
                    <div>
                        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ 
                                color: '#1976d2', 
                                margin: 0,
                                fontSize: '18px',
                                borderBottom: '2px solid #1976d2',
                                paddingBottom: '8px'
                            }}>
                                Sous-modules ({sousModules.length})
                            </h3>
                            <button
                                onClick={() => setIsAddingSousModule(!isAddingSousModule)}
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
                                {isAddingSousModule ? 'Annuler' : '+ Ajouter Sous-module'}
                            </button>
                        </div>

                        {isAddingSousModule && (
                            <div style={{
                                padding: '15px',
                                marginBottom: '15px',
                                border: '1px solid #1976d2',
                                borderRadius: '4px',
                                backgroundColor: '#e3f2fd'
                            }}>
                                <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Nouveau sous-module</h4>
                                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                                    <input
                                        type="text"
                                        placeholder="Nom"
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
                                    <input
                                        type="number"
                                        placeholder="ID Module"
                                        value={newSousModule.moduleId || ''}
                                        onChange={(e) => setNewSousModule({ ...newSousModule, moduleId: parseInt(e.target.value) || 0 })}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="ID Professeur"
                                        value={newSousModule.professorId || ''}
                                        onChange={(e) => setNewSousModule({ ...newSousModule, professorId: parseInt(e.target.value) || 0 })}
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
                                        Créer Sous-module
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
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}>
                                {sousModules.map((sousModule) => (
                                    <div
                                        key={sousModule.id}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                    >
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                            {sousModule.name}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                            Module: {sousModule.moduleName} | {sousModule.numberOfHours} heures
                                        </div>
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

