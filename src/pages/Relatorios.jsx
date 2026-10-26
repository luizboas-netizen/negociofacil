

import { useEffect, useState } from 'react'
import Tabs from '../components/Tabs'
import Accordion from '../components/Accordion'

const CHAVE_VENDAS = 'negociofacil-vendas'
const CHAVE_PRODUTOS = 'negociofacil-produtos'

function Relatorios() {
  const [vendas, setVendas] = useState([])
  const [produtos, setProdutos] = useState([])
   const [accordionAberto, setAccordionAberto] = useState(null) 
  useEffect(() => {
    try {
      const vendasSalvas = JSON.parse(
        localStorage.getItem(CHAVE_VENDAS) || '[]',
      )
      const produtosSalvos = JSON.parse(
        localStorage.getItem(CHAVE_PRODUTOS) || '[]',
      )

      setVendas(Array.isArray(vendasSalvas) ? vendasSalvas : [])
      setProdutos(Array.isArray(produtosSalvos) ? produtosSalvos : [])
    } catch {
      setVendas([])
      setProdutos([])
    }
  }, [])

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const faturamento = vendas.reduce(
    (soma, venda) => soma + Number(venda.total || 0),
    0,
  )

  const unidadesVendidas = vendas.reduce(
    (soma, venda) =>
      soma +
      (Array.isArray(venda.itens)
        ? venda.itens.reduce(
            (total, item) => total + Number(item.quantidade || 0),
            0,
          )
        : 0),
    0,
  )

  const rankingProdutos = Object.values(
    vendas.reduce((acumulado, venda) => {
      if (!Array.isArray(venda.itens)) return acumulado

      venda.itens.forEach((item) => {
        const id = item.produtoId ?? item.nome

        if (!acumulado[id]) {
          acumulado[id] = {
            nome: item.nome,
            quantidade: 0,
            faturamento: 0,
          }
        }

        acumulado[id].quantidade += Number(item.quantidade || 0)
        acumulado[id].faturamento += Number(item.subtotal || 0)
      })

      return acumulado
    }, {}),
  ).sort((a, b) => b.quantidade - a.quantidade)

  const abas = [
    {
      label: 'Resumo',
      content: (
        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-heading">
              <span>Faturamento total</span>
              <span className="stat-icon green">R$</span>
            </div>
            <h3>{formatarMoeda(faturamento)}</h3>
            <p className="stat-note">Soma das vendas registradas</p>
          </article>

          <article className="stat-card">
            <div className="stat-heading">
              <span>Vendas realizadas</span>
              <span className="stat-icon blue">↗</span>
            </div>
            <h3>{vendas.length}</h3>
            <p className="stat-note">Quantidade de operações</p>
          </article>

          <article className="stat-card">
            <div className="stat-heading">
              <span>Unidades vendidas</span>
              <span className="stat-icon blue">▤</span>
            </div>
            <h3>{unidadesVendidas}</h3>
            <p className="stat-note">Total de itens vendidos</p>
          </article>

          <article className="stat-card">
            <div className="stat-heading">
              <span>Produtos cadastrados</span>
              <span className="stat-icon green">⚓</span>
            </div>
            <h3>{produtos.length}</h3>
            <p className="stat-note">Itens no estoque atual</p>
          </article>
        </section>
      ),
    },
    {
      label: 'Mais vendidos',
      content: (
        <section className="panel product-list-panel">
          <div className="panel-heading">
            <div>
              <h2>Produtos mais vendidos</h2>
              <p>Ranking baseado nas vendas registradas.</p>
            </div>
          </div>

          <div className="product-table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Produto</th>
                  <th>Unidades vendidas</th>
                  <th>Faturamento</th>
                </tr>
              </thead>

              <tbody>
                {rankingProdutos.map((produto, indice) => (
                  <tr key={produto.nome}>
                    <td>{indice + 1}º</td>
                    <td>
                      <strong>{produto.nome}</strong>
                    </td>
                    <td>{produto.quantidade}</td>
                    <td>{formatarMoeda(produto.faturamento)}</td>
                  </tr>
                ))}

                {rankingProdutos.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-products">
                      Ainda não há vendas para gerar o ranking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ),
    },
  ]

  return (
    <section className="products-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">DESEMPENHO DA LOJA</p>
          <h2>Relatórios</h2>
          <p>Consulte os indicadores e os produtos mais vendidos.</p>
        </div>
      </div>

      <Tabs tabs={abas} />
      <section className="panel">
  <div className="panel-heading">
    <div>
      <h2>Entenda seus indicadores</h2>
      <p>Saiba como interpretar os resultados da loja.</p>
    </div>
  </div>

<Accordion
  title="Como é calculado o faturamento?"
  isOpen={accordionAberto === 0}
  onToggle={() =>
    setAccordionAberto(accordionAberto === 0 ? null : 0)
  }
>
  O faturamento total é a soma dos valores das vendas registradas no sistema.
</Accordion>

<Accordion
  title="Como funciona o ranking de produtos?"
  isOpen={accordionAberto === 1}
  onToggle={() =>
    setAccordionAberto(accordionAberto === 1 ? null : 1)
  }
>
  Os produtos são organizados pela quantidade de unidades vendidas. Os primeiros
  colocados são os que tiveram maior saída.
</Accordion>

<Accordion
  title="O que significa unidades vendidas?"
  isOpen={accordionAberto === 2}
  onToggle={() =>
    setAccordionAberto(accordionAberto === 2 ? null : 2)
  }
>
  É a soma das quantidades de todos os itens registrados nas vendas.
</Accordion>
</section>
    </section>
  )
}

export default Relatorios
