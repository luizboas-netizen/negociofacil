
import { useEffect, useState } from 'react'

function Toast({ message, type = 'success', onClose }) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    if (!message) {
      setVisivel(false)
      return
    }

    setVisivel(true)

    const temporizador = setTimeout(() => {
      setVisivel(false)
    }, 3000)

    const fechamento = setTimeout(() => {
      onClose?.()
    }, 3500)

    return () => {
      clearTimeout(temporizador)
      clearTimeout(fechamento)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      className={`toast toast-${type} ${visivel ? 'toast-visible' : 'toast-hidden'}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className="toast-icon" aria-hidden="true">
        {type === 'error' ? '!' : '✓'}
      </span>

      <span className="toast-message">{message}</span>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
