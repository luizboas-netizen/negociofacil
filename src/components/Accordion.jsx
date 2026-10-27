
import { useId } from 'react'

function Accordion({ title, children, isOpen, onToggle }) {
  const id = useId()
  const panelId = `${id}-panel`

  return (
    <div className="accordion">
      <button
        type="button"
        className="accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span>{title}</span>
        <span className="accordion-arrow" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div
        id={panelId}
        className="accordion-content"
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  )
}

export default Accordion
