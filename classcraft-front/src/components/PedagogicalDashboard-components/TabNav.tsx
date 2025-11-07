import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/TabNav.module.css";
import { TabType } from "../../types/type";

interface Tab {
  id: TabType;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNav: React.FC<TabNavProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className={styles.tabNav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.active : ""
          }`}
          onClick={() => onTabChange(tab.id)}>
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabNav;
