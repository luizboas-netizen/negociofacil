

import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Produtos from './pages/Produtos'
import Vendas from './pages/Vendas'
import Relatorios from './pages/Relatorios'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('dashboard')

  const paginas = {
  dashboard: {
    titulo: 'Visão geral',
    componente: <Dashboard />,
  },
  produtos: {
    titulo: 'Produtos',
    componente: <Produtos />,
  },
  vendas: {
    titulo: 'Vendas',
    componente: <Vendas />,
  },
  relatorios: {
  titulo: 'Relatórios',
  componente: <Relatorios />,
},
}

  const pagina = paginas[paginaAtual]

  function navegarPara(pagina) {
    if (paginas[pagina]) {
      setPaginaAtual(pagina)
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">⚓</span>
          <div>
            <h2>NegócioFácil</h2>
            <p>GESTÃO NÁUTICA</p>
          </div>
        </div>

        <nav className="menu">
          <button
            type="button"
            className={paginaAtual === 'dashboard' ? 'menu-item active' : 'menu-item'}
            onClick={() => navegarPara('dashboard')}
          >
            ▦ Dashboard
          </button>

          <button
            type="button"
            className={paginaAtual === 'produtos' ? 'menu-item active' : 'menu-item'}
            onClick={() => navegarPara('produtos')}
          >
            □ Produtos
          </button>

       
<button
  type="button"
  className={paginaAtual === 'vendas' ? 'menu-item active' : 'menu-item'}
  onClick={() => navegarPara('vendas')}
>
  ↗ Vendas
</button>


          
<button
  type="button"
  className={paginaAtual === 'relatorios' ? 'menu-item active' : 'menu-item'}
  onClick={() => navegarPara('relatorios')}
>
  ▤ Relatórios
</button>

        </nav>

        <div className="sidebar-footer">
          <span className="status-dot"></span>
          Sistema de gestão
          <small>Versão 1.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">GESTÃO DA LOJA</p>
            <h1>{pagina.titulo}</h1>
          </div>

          <div className="user-profile">
            <div className="avatar">NF</div>
            <div>
              <strong>Administrador</strong>
              <small>Loja náutica</small>
            </div>
          </div>
        </header>

        {pagina.componente}

        <footer className="footer">
          <span>NegócioFácil © 2026</span>
          <span>Gestão simples para sua loja náutica</span>
        </footer>
      </main>
    </div>
  )
}

export default App
