
import { useState } from 'react'

function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0)

  if (!tabs || tabs.length === 0) {
    return null
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`tab-${index}`}
            aria-selected={activeTab === index}
            aria-controls={`panel-${index}`}
            className={activeTab === index ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="tab-content"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  )
}

export default Tabs
