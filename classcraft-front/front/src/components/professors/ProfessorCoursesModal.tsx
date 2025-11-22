import React from 'react';
import Modal from '../ui/modal/Modal';
import type { ModuleDto } from '../../types/modules';
import type { SousModuleDto } from '../../types/sousModules';

interface ProfessorCoursesModalProps {
    isOpen: boolean;
    onClose: () => void;
    professorName: string;
    modules: ModuleDto[];
    sousModules: SousModuleDto[];
    loading?: boolean;
}

export const ProfessorCoursesModal: React.FC<ProfessorCoursesModalProps> = ({
    isOpen,
    onClose,
    professorName,
    modules,
    sousModules,
    loading = false,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Modules et Sous-modules - ${professorName}`}
            size="large"
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div>Chargement...</div>
                </div>
            ) : (
                <div>
                    {/* Modules Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ 
                            color: '#1976d2', 
                            marginBottom: '15px',
                            fontSize: '18px',
                            borderBottom: '2px solid #1976d2',
                            paddingBottom: '8px'
                        }}>
                            Modules ({modules.length})
                        </h3>
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
                        <h3 style={{ 
                            color: '#1976d2', 
                            marginBottom: '15px',
                            fontSize: '18px',
                            borderBottom: '2px solid #1976d2',
                            paddingBottom: '8px'
                        }}>
                            Sous-modules ({sousModules.length})
                        </h3>
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

