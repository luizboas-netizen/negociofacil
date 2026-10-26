
function Accordion({ title, children, isOpen, onToggle }) {
  return (
    <div className="accordion">
      <button
        type="button"
        className="accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="accordion-arrow" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  )
}

export default Accordion
