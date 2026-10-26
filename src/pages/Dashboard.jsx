import ProgressBar from '../components/ProgressBar'
function Dashboard() {
  return (
    <>
      <section className="welcome">
        <div>
          <span className="welcome-label">PAINEL DE CONTROLE</span>
          <h2>Bem-vindo ao NegócioFácil</h2>
          <p>
            Gerencie seus produtos, acompanhe suas vendas e controle
            seu estoque em um só lugar.
          </p>
        </div>
        <span className="welcome-anchor" aria-hidden="true">⚓</span>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-heading">
            <span>Vendas do mês</span>
            <span className="stat-icon blue">↗</span>
          </div>
          <h3>R$ 12.450,00</h3>
          <p className="stat-note">Valores demonstrativos</p>
        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Produtos cadastrados</span>
            <span className="stat-icon cyan">□</span>
          </div>
          <h3>128</h3>
          <p className="stat-note">Itens no catálogo</p>
        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Estoque baixo</span>
            <span className="stat-icon orange">!</span>
          </div>
          <h3>7</h3>
          <p className="stat-note warning">Precisam de atenção</p>
        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Vendas realizadas</span>
            <span className="stat-icon green">✓</span>
          </div>
          <h3>46</h3>
          <p className="stat-note">Neste mês</p>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel sales-panel">
          <div className="panel-heading">
            <div>
              <h2>Meta de vendas</h2>
              <p>Acompanhamento mensal</p>
            </div>
            <span className="tag">Outubro</span>
          </div>

          <div className="goal-values">
            <strong>R$ 12.450,00</strong>
            <span>de R$ 20.000,00</span>
          </div>

          
<ProgressBar value={12450} max={20000} label="Meta mensal de vendas" />

          <div className="goal-footer">
            <span>Faltam R$ 7.550,00</span>
            <span className="goal-indicator">Em andamento</span>
          </div>
        </article>

        <article className="panel stock-panel">
          <div className="panel-heading">
            <div>
              <h2>Estoque em atenção</h2>
              <p>Produtos com poucas unidades</p>
            </div>
            <span className="stock-alert">!</span>
          </div>

          <div className="stock-item">
            <div className="product-symbol">⚓</div>
            <div className="stock-description">
              <strong>Âncora galvanizada</strong>
              <small>Estoque mínimo: 5 un.</small>
            </div>
            <span className="stock-quantity">2 un.</span>
          </div>

          <div className="stock-item">
            <div className="product-symbol">〰</div>
            <div className="stock-description">
              <strong>Corda náutica 10 mm</strong>
              <small>Estoque mínimo: 10 un.</small>
            </div>
            <span className="stock-quantity">4 un.</span>
          </div>

          <div className="stock-item">
            <div className="product-symbol">◉</div>
            <div className="stock-description">
              <strong>Boia de sinalização</strong>
              <small>Estoque mínimo: 6 un.</small>
            </div>
            <span className="stock-quantity">3 un.</span>
          </div>
        </article>
      </section>
    </>
  )
}

export default Dashboard
