
import { useId, useRef, useState } from 'react'

function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0)
  const id = useId()
  const tabRefs = useRef([])

  if (!tabs || tabs.length === 0) {
    return null
  }

  function selecionarAba(index) {
    setActiveTab(index)
    tabRefs.current[index]?.focus()
  }

  function handleKeyDown(event, index) {
    let novaAba

    switch (event.key) {
      case 'ArrowRight':
        novaAba = (index + 1) % tabs.length
        break
      case 'ArrowLeft':
        novaAba = (index - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        novaAba = 0
        break
      case 'End':
        novaAba = tabs.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    selecionarAba(novaAba)
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header" role="tablist" aria-label="Abas de conteúdo">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            ref={(elemento) => {
              tabRefs.current[index] = elemento
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={activeTab === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            className={activeTab === index ? 'tab-button active' : 'tab-button'}
            onClick={() => selecionarAba(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="tab-content"
        role="tabpanel"
        id={`${id}-panel-${activeTab}`}
        aria-labelledby={`${id}-tab-${activeTab}`}
        tabIndex={0}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  )
}

export default Tabs
