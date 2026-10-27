
import { useEffect, useState } from 'react'
import ProgressBar from '../components/ProgressBar'

const CHAVE_VENDAS = 'negociofacil-vendas'

function Dashboard() {
  
  const [vendas, setVendas] = useState([])
  const [produtos, setProdutos] = useState([])
  
  useEffect(() => {
    const vendasSalvas = localStorage.getItem(CHAVE_VENDAS)
    const produtosSalvos = localStorage.getItem('negociofacil-produtos')

    if (vendasSalvas) {
      setVendas(JSON.parse(vendasSalvas))
    }

    if (produtosSalvos) {
      setProdutos(JSON.parse(produtosSalvos))
    }
  }, [])

  const faturamento = vendas.reduce(
    (soma, venda) => soma + Number(venda.total || 0),
    0,
  )

  const metaMensal = 20000
  const valorRestante = Math.max(0, metaMensal - faturamento)

  const produtosEstoqueBaixo = produtos.filter(
  (produto) =>
    Number(produto.estoque) <= Number(produto.minimo ?? 5),
)

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }


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
          
<h3>{formatarMoeda(faturamento)}</h3>
<p className="stat-note">Faturamento das vendas registradas</p>

        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Produtos cadastrados</span>
            <span className="stat-icon cyan">□</span>
          </div>
        
<h3>{produtos.length}</h3>
<p className="stat-note">Itens no catálogo</p>

        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Estoque baixo</span>
            <span className="stat-icon orange">!</span>
          </div>
       
<h3>{produtosEstoqueBaixo.length}</h3>
<p className="stat-note warning">Precisam de atenção</p>

        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Vendas realizadas</span>
            <span className="stat-icon green">✓</span>
          </div>
         
<h3>{vendas.length}</h3>
<p className="stat-note">Vendas registradas</p>

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
  <strong>{formatarMoeda(faturamento)}</strong>
  <span>de {formatarMoeda(metaMensal)}</span>
</div>

          

<ProgressBar
  value={faturamento}
  max={metaMensal}
  label="Meta mensal de vendas"
/>

          <div className="goal-footer">
          
<span>
  {valorRestante > 0
    ? `Faltam ${formatarMoeda(valorRestante)}`
    : 'Meta mensal atingida!'}
</span>

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

         
{produtos
  .filter(
    (produto) =>
      Number(produto.estoque) <= Number(produto.minimo ?? 5) &&
      !produto.arquivado,
  )
  .map((produto) => (
    <div className="stock-item" key={produto.id}>
      <div className="product-symbol">⚓</div>
      <div className="stock-description">
        <strong>{produto.nome}</strong>
        <small>Estoque baixo</small>
      </div>
      <span className="stock-quantity">
        {produto.estoque} un.
      </span>
    </div>
  ))}


{produtos.filter(
  (produto) => Number(produto.estoque) <= 5 && !produto.arquivado,
).length === 0 && (
  <p>Nenhum produto com estoque baixo.</p>
)}
        </article>
      </section>
    </>
  )
}

export default Dashboard
