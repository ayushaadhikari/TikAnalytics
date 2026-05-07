import { useState } from 'react';

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  const containerStyle = {
    display: 'flex',
    borderBottom: '1px solid #374151',
    marginBottom: '24px'
  };

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    backgroundColor: isActive ? '#1F2937' : 'transparent',
    border: 'none',
    borderBottom: isActive ? '2px solid #FF0050' : '2px solid transparent',
    color: isActive ? 'white' : '#9CA3AF',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s',
    marginRight: '8px'
  });

  return (
    <div style={containerStyle}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={tabStyle(activeTab === tab.id)}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
