
import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'

const CHAVE_PRODUTOS = 'negociofacil-produtos'
const CHAVE_VENDAS = 'negociofacil-vendas'

function Vendas() {
  const { showToast } = useToast()

  const [produtos, setProdutos] = useState([])
  const [vendas, setVendas] = useState([])
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [busca, setBusca] = useState('')
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    try {
      const produtosSalvos = localStorage.getItem(CHAVE_PRODUTOS)
      const vendasSalvas = localStorage.getItem(CHAVE_VENDAS)

      if (produtosSalvos !== null) {
        const listaProdutos = JSON.parse(produtosSalvos)

        if (Array.isArray(listaProdutos)) {
          setProdutos(listaProdutos)
        }
      }

      if (vendasSalvas !== null) {
        const listaVendas = JSON.parse(vendasSalvas)

        if (Array.isArray(listaVendas)) {
          setVendas(listaVendas)
        }
      }
    } catch {
      showToast('Não foi possível carregar os dados de vendas.', 'error')
    } finally {
      setCarregado(true)
    }
  }, [showToast])

  useEffect(() => {
    if (!carregado) return

    try {
      localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos))
      localStorage.setItem(CHAVE_VENDAS, JSON.stringify(vendas))
    } catch {
      showToast('Não foi possível salvar os dados no navegador.', 'error')
    }
  }, [produtos, vendas, carregado, showToast])

  const produtoSelecionado = produtos.find(
    (produto) => String(produto.id) === produtoId,
  )

  const quantidadeNumerica = Number(quantidade)

  const total = produtoSelecionado
    ? produtoSelecionado.preco * quantidadeNumerica
    : 0

  const vendasFiltradas = vendas.filter((venda) =>
    venda.itens.some((item) =>
      item.nome.toLowerCase().includes(busca.toLowerCase()),
    ),
  )

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatarData(data) {
    return new Date(data).toLocaleString('pt-BR')
  }

  function registrarVenda(event) {
    event.preventDefault()

    if (!produtoSelecionado) {
      showToast('Selecione um produto para vender.', 'error')
      return
    }

    if (
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica <= 0
    ) {
      showToast('Informe uma quantidade inteira maior que zero.', 'error')
      return
    }

    if (quantidadeNumerica > produtoSelecionado.estoque) {
      showToast('Estoque insuficiente para essa venda.', 'error')
      return
    }

    const venda = {
      id: Date.now(),
      data: new Date().toISOString(),
      itens: [
        {
          produtoId: produtoSelecionado.id,
          nome: produtoSelecionado.nome,
          quantidade: quantidadeNumerica,
          precoUnitario: produtoSelecionado.preco,
          subtotal: total,
        },
      ],
      total,
    }

    setProdutos((atuais) =>
      atuais.map((produto) =>
        produto.id === produtoSelecionado.id
          ? {
              ...produto,
              estoque: produto.estoque - quantidadeNumerica,
            }
          : produto,
      ),
    )

    setVendas((atuais) => [venda, ...atuais])
    setProdutoId('')
    setQuantidade('1')

    showToast('Venda registrada com sucesso!')
  }

  if (!carregado) {
    return (
      <section className="products-page">
        <div className="panel">
          <p>Carregando vendas...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="products-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">OPERAÇÕES DA LOJA</p>
          <h2>Vendas</h2>
          <p>Registre vendas e acompanhe as movimentações do estoque.</p>
        </div>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-heading">
            <span>Vendas registradas</span>
            <span className="stat-icon blue">↗</span>
          </div>
          <h3>{vendas.length}</h3>
          <p className="stat-note">Histórico total</p>
        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Faturamento registrado</span>
            <span className="stat-icon green">R$</span>
          </div>
          <h3>
            {formatarMoeda(
              vendas.reduce((soma, venda) => soma + venda.total, 0),
            )}
          </h3>
          <p className="stat-note">Soma das vendas registradas</p>
        </article>
      </section>

      <section className="panel product-form-panel">
        <div className="panel-heading">
          <div>
            <h2>Registrar venda</h2>
            <p>Selecione o produto e informe a quantidade.</p>
          </div>
        </div>

        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado. Cadastre produtos primeiro.</p>
        ) : (
          <form className="product-form" onSubmit={registrarVenda}>
            <label>
              Produto
              <select
                value={produtoId}
                onChange={(event) => setProdutoId(event.target.value)}
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option
                    key={produto.id}
                    value={String(produto.id)}
                    disabled={produto.estoque <= 0}
                  >
                    {produto.nome} — {formatarMoeda(produto.preco)} (
                    {produto.estoque} un. disponíveis)
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantidade
              <input
                type="number"
                min="1"
                step="1"
                value={quantidade}
                onChange={(event) => setQuantidade(event.target.value)}
                required
              />
            </label>

            <div className="sale-total">
              <span>Total da venda</span>
              <strong>{formatarMoeda(total)}</strong>
            </div>

            <div className="product-form-actions">
              <button className="primary-button" type="submit">
                Registrar venda
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="panel product-list-panel">
        <div className="panel-heading">
          <div>
            <h2>Histórico de vendas</h2>
            <p>{vendas.length} venda(s) registrada(s)</p>
          </div>

          <input
            className="product-search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Pesquisar produto vendido..."
            aria-label="Pesquisar vendas por produto"
          />
        </div>

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço unitário</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {vendasFiltradas.flatMap((venda) =>
                venda.itens.map((item, indice) => (
                  <tr key={`${venda.id}-${indice}`}>
                    <td>{formatarData(venda.data)}</td>
                    <td>
                      <strong>{item.nome}</strong>
                    </td>
                    <td>{item.quantidade} un.</td>
                    <td>{formatarMoeda(item.precoUnitario)}</td>
                    <td>{formatarMoeda(item.subtotal)}</td>
                  </tr>
                )),
              )}

              {vendasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-products">
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default Vendas
