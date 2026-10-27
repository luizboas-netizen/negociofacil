
import { useEffect, useRef, useState } from 'react'

function DropdownMenu({ onView, onEdit, onArchive }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  function handleAction(action) {
    setIsOpen(false)
    action?.()
  }

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setIsOpen((aberto) => !aberto)}
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

