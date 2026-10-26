
import { useState } from 'react'

function DropdownMenu({ onView, onEdit, onArchive }) {
  const [isOpen, setIsOpen] = useState(false)

  function handleAction(action) {
    setIsOpen(false)
    action?.()
  }

  return (
    <div className="dropdown-container">
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Opções <span aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onView)}
          >
            Visualizar
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onEdit)}
          >
            Editar
          </button>

          <button
            type="button"
            role="menuitem"
            className="dropdown-danger"
            onClick={() => handleAction(onArchive)}
          >
            Arquivar
          </button>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
