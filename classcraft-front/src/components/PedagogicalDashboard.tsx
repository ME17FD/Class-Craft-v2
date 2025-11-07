import React, { useState } from "react";
import styles from "../styles/PedagogicalDashboard.module.css";
import TabNav from "./PedagogicalDashboard-components/TabNav";
import GroupsTab from "./PedagogicalDashboard-components/GroupsTab";
import StudentsTab from "./PedagogicalDashboard-components/StudentsTab";
import FieldsTab from "./PedagogicalDashboard-components/FieldsTab";
import ModulesTab from "./PedagogicalDashboard-components/ModulesTab";
import SubModulesTab from "./PedagogicalDashboard-components/SubModulesTab";
import ProfessorsTab from "./PedagogicalDashboard-components/ProfessorsTab";
import CrudModal from "./PedagogicalDashboard-components/CrudModal";
import FieldFormModal from "./PedagogicalDashboard-components/FieldFormModal";
import ClassroomTab from "./PedagogicalDashboard-components/ClassroomTab";
import usePedagogicalData from "../utils/usePedagogicalData";
import Sidebar from "./Sidebar";
import { TabType, Field, ExtendedModule } from "../types/type";
import { useApiData } from "../hooks/useApiData";

const PedagogicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("groups");
  const [fieldModalState, setFieldModalState] = useState<{
    isOpen: boolean;
    field?: Field & { modules: ExtendedModule[] };
  }>({
    isOpen: false,
  });

  const {
    data,
    modalState,
    handleAdd,
    handleEdit,
    handleDelete,
    handleAssignStudents,
    handleSave,
    handleCloseModal,
  } = usePedagogicalData();

  const {
    addField,
    updateField,
    updateModule,
    addModule,
    updateSubModule,
    addSubModule,
    fetchData,
  } = useApiData();

  const handleFieldEdit = (field: Field) => {
    // Find the modules associated with this field
    const fieldModules = data.modules
      .filter((module) => module.filiereId === field.id)
      .map((module) => ({
        ...module,
        subModules: data.subModules.filter(
          (subModule) => subModule.moduleId === module.id
        ),
      }));

    setFieldModalState({
      isOpen: true,
      field: {
        ...field,
        modules: fieldModules,
      },
    });
  };

  const handleFieldClose = () => {
    setFieldModalState({
      isOpen: false,
    });
  };

  const handleFieldSave = async (
    fieldData: Omit<Field, "id"> & { modules: ExtendedModule[] }
  ) => {
    try {
      // Save the field and modules
      const fieldId = fieldModalState.field?.id || 0;

      // Step 1: Save or update the field (Filière)
      const savedField = fieldId
        ? await updateField({ ...fieldData, id: fieldId })
        : await addField(fieldData);

      if (!savedField || !savedField.id) {
        throw new Error('Failed to save field');
      }

      // Step 2: Save or update modules linked to the field
      const savedModules = [];
      for (const module of fieldData.modules) {
        try {
          const savedModule = module.id
            ? await updateModule({ ...module, filiereId: savedField.id })
            : await addModule({ ...module, filiereId: savedField.id });

          if (!savedModule || !savedModule.id) {
            throw new Error('Failed to save module');
          }

          // Step 3: Save or update submodules linked to this module
          const savedSubModules = [];
          for (const sub of module.subModules || []) {
            try {
              const savedSub = sub.id
                ? await updateSubModule({ ...sub, moduleId: savedModule.id })
                : await addSubModule({ ...sub, moduleId: savedModule.id });
              savedSubModules.push(savedSub);
            } catch (error) {
              console.error('Error saving submodule:', error);
              throw error;
            }
          }

          savedModules.push({
            ...savedModule,
            subModules: savedSubModules
          });
        } catch (error) {
          console.error('Error saving module:', error);
          throw error;
        }
      }

      // Update the fields state after save
      setFieldModalState({
        isOpen: false,
        field: {
          ...savedField,
          modules: savedModules,
        },
      });

      // Close the modal
      handleFieldClose();

      // Use handleSave to update the state through usePedagogicalData
      handleSave("fields", savedField, fieldId ? "edit" : "add");

      // Refresh all data to ensure everything is in sync
      await fetchData();
    } catch (error) {
      console.error('Error saving field:', error);
      // You might want to show an error message to the user here
    }
  };

  const { deleteGroup } = useApiData();

  const tabs = [
    { id: "groups" as TabType, label: "Groupes" },
    { id: "students" as TabType, label: "Étudiants" },
    { id: "fields" as TabType, label: "Filières" },
    { id: "modules" as TabType, label: "Modules" },
    { id: "submodules" as TabType, label: "Sous-modules" },
    { id: "professors" as TabType, label: "Enseignants" },
    { id: "classrooms" as TabType, label: "Salles" },
  ];

  return (
    <>
      <Sidebar></Sidebar>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestion Pédagogique</h1>
        </header>

        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={styles.content}>
          {activeTab === "groups" && (
            <GroupsTab
              groups={data.groups}
              fields={data.fields}
              modules={data.modules}
              students={data.allStudents}
              professors={data.professors}
              onEdit={(group) => handleEdit("groups", group)}
              onDelete={deleteGroup}
              onAdd={() => handleAdd("groups")}
              onAssignStudents={handleAssignStudents}
            />
          )}
          {activeTab === "students" && (
            <StudentsTab
              students={data.allStudents}
              groups={data.groups}
              onAdd={(student) =>
                handleSave("students", { ...student, id: 0 }, "add")
              }
              onEdit={(student) => handleSave("students", student, "edit")}
              onDelete={(student) => handleSave("students", student, "delete")}
            />
          )}
          {activeTab === "fields" && (
            <FieldsTab
              fields={data.fields}
              modules={data.modules}
              subModules={data.subModules}
              groups={data.groups}
              professors={data.professors}
              onEdit={handleFieldEdit}
              onAdd={() => {
                setFieldModalState({
                  isOpen: true,
                  field: undefined, // no field -> this is "add"
                });
              }}
              onDelete={(field) => handleSave("fields", field, "delete")}
            />
          )}
          {activeTab === "modules" && (
            <ModulesTab
              modules={data.modules}
              fields={data.fields}
              professors={data.professors}
              subModules={data.subModules}
              onAdd={() => handleAdd("modules")}
              onEdit={(module) => handleEdit("modules", module)}
              onDelete={(module) => handleDelete("modules", module)}
            />
          )}
          {activeTab === "submodules" && (
            <SubModulesTab
              subModules={data.subModules}
              modules={data.modules}
              fields={data.fields}
              professors={data.professors}
              modalState={modalState}
              handleAdd={handleAdd}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleCloseModal={handleCloseModal}
            />
          )}
          {activeTab === "professors" && (
            <ProfessorsTab
              professors={data.professors}
              modules={data.modules}
              subModules={data.subModules}
              onAdd={() => handleAdd("professors")}
              onEdit={(professor) => handleEdit("professors", professor)}
              onDelete={(professor) => handleDelete("professors", professor)}
            />
          )}
          {activeTab === "classrooms" && (
            <ClassroomTab
              classrooms={data.rooms}
              onAdd={() => handleAdd("classrooms")}
              onEdit={(classroom) => handleEdit("classrooms", classroom)}
              onDelete={(classroom) => {
                // Cette fonction sera appelée après confirmation
                handleSave("classrooms", classroom, "delete");
              }}
            />
          )}
        </div>

        {modalState.isOpen && modalState.type !== "delete" && (
          <CrudModal
            isOpen={modalState.isOpen}
            type={modalState.type}
            entityType={activeTab}
            entity={modalState.entity}
            fields={data.fields}
            professors={data.professors}
            modules={data.modules}
            subModules={data.subModules}
            groups={data.groups}
            onSave={handleSave}
            onClose={handleCloseModal}
          />
        )}

        <FieldFormModal
          isOpen={fieldModalState.isOpen}
          onClose={handleFieldClose}
          onSubmit={handleFieldSave}
          field={fieldModalState.field}
        />
      </div>
    </>
  );
};

export default PedagogicalDashboard;
