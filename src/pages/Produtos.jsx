
import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import Pagination from '../components/Pagination'
import DropdownMenu from '../components/DropdownMenu'

const CHAVE_PRODUTOS = 'negociofacil-produtos'

const PRODUTOS_INICIAIS = [
  {
    id: 1,
    nome: 'Âncora galvanizada',
    categoria: 'Ancoragem',
    preco: 250,
    estoque: 2,
    minimo: 5,
  },
  {
    id: 2,
    nome: 'Corda náutica 10 mm',
    categoria: 'Cordas',
    preco: 85,
    estoque: 4,
    minimo: 10,
  },
  {
    id: 3,
    nome: 'Boia de sinalização',
    categoria: 'Segurança',
    preco: 45,
    estoque: 15,
    minimo: 6,
  },
]

function Produtos() {
  const { showToast } = useToast()

  const [produtos, setProdutos] = useState(PRODUTOS_INICIAIS)
  const [carregado, setCarregado] = useState(false)

  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const produtosPorPagina = 5

  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')
  const [minimo, setMinimo] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    try {
      const produtosSalvos = localStorage.getItem(CHAVE_PRODUTOS)

      if (produtosSalvos !== null) {
        const lista = JSON.parse(produtosSalvos)

        if (Array.isArray(lista)) {
          const listaNormalizada = lista.map((produto) => ({
            ...produto,
            minimo: Number(produto.minimo ?? 5),
          }))

          setProdutos(listaNormalizada)
        } else {
          showToast('Os dados salvos dos produtos são inválidos.', 'error')
        }
      }
    } catch {
      showToast('Não foi possível carregar os produtos salvos.', 'error')
    } finally {
      setCarregado(true)
    }
  }, [showToast])

  useEffect(() => {
    if (!carregado) return

    try {
      localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos))
    } catch {
      showToast('Não foi possível salvar os produtos no navegador.', 'error')
    }
  }, [produtos, carregado, showToast])

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase()),
  )

  const totalPaginas = Math.max(
    1,
    Math.ceil(produtosFiltrados.length / produtosPorPagina),
  )

  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina,
  )

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas)
    }
  }, [paginaAtual, totalPaginas])

  function pesquisarProdutos(event) {
    setBusca(event.target.value)
    setPaginaAtual(1)
  }

  function limparFormulario() {
    setNome('')
    setCategoria('')
    setPreco('')
    setEstoque('')
    setMinimo('')
    setEditandoId(null)
  }

  function salvarProduto(event) {
    event.preventDefault()

    if (!nome.trim() || !categoria.trim()) {
      showToast('Preencha o nome e a categoria.', 'error')
      return
    }

    if (
      preco.trim() === '' ||
      estoque.trim() === '' ||
      minimo.trim() === '' ||
      !Number.isFinite(Number(preco)) ||
      !Number.isInteger(Number(estoque)) ||
      !Number.isInteger(Number(minimo)) ||
      Number(preco) < 0 ||
      Number(estoque) < 0 ||
      Number(minimo) < 0
    ) {
      showToast(
        'Informe um preço válido e quantidades inteiras não negativas.',
        'error',
      )
      return
    }

    const produto = {
      id: editandoId ?? Date.now(),
      nome: nome.trim(),
      categoria: categoria.trim(),
      preco: Number(preco),
      estoque: Number(estoque),
      minimo: Number(minimo),
    }

    if (editandoId !== null) {
      setProdutos((atuais) =>
        atuais.map((item) => (item.id === editandoId ? produto : item)),
      )
      showToast('Produto atualizado com sucesso!')
    } else {
      setProdutos((atuais) => [...atuais, produto])
      setPaginaAtual(1)
      showToast('Produto cadastrado com sucesso!')
    }

    limparFormulario()
  }

  function editarProduto(produto) {
    setEditandoId(produto.id)
    setNome(produto.nome)
    setCategoria(produto.categoria)
    setPreco(String(produto.preco))
    setEstoque(String(produto.estoque))
    setMinimo(String(produto.minimo ?? 5))

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function arquivarProduto(id) {
    const confirmar = window.confirm(
      'Deseja arquivar este produto? Ele será retirado da lista atual.',
    )

    if (!confirmar) return

    setProdutos((atuais) =>
      atuais.filter((produto) => produto.id !== id),
    )

    if (editandoId === id) {
      limparFormulario()
    }

    showToast('Produto arquivado com sucesso!')
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (!carregado) {
    return (
      <section className="products-page">
        <div className="panel">
          <p>Carregando produtos...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="products-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">CONTROLE DE ESTOQUE</p>
          <h2>Produtos</h2>
          <p>Cadastre e acompanhe os produtos da sua loja náutica.</p>
        </div>
      </div>

      <section className="panel product-form-panel">
        <div className="panel-heading">
          <div>
            <h2>{editandoId !== null ? 'Editar produto' : 'Novo produto'}</h2>
            <p>Preencha as informações do item.</p>
          </div>
        </div>

        <form className="product-form" onSubmit={salvarProduto}>
          <label>
            Nome do produto
            <input
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Colete salva-vidas"
              required
            />
          </label>

          <label>
            Categoria
            <input
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
              placeholder="Ex.: Segurança"
              required
            />
          </label>

          <label>
            Preço (R$)
            <input
              type="number"
              min="0"
              step="0.01"
              value={preco}
              onChange={(event) => setPreco(event.target.value)}
              placeholder="0,00"
              required
            />
          </label>

          <label>
            Quantidade em estoque
            <input
              type="number"
              min="0"
              step="1"
              value={estoque}
              onChange={(event) => setEstoque(event.target.value)}
              placeholder="0"
              required
            />
          </label>

          <label>
            Estoque mínimo
            <input
              type="number"
              min="0"
              step="1"
              value={minimo}
              onChange={(event) => setMinimo(event.target.value)}
              placeholder="Ex.: 4"
              required
            />
          </label>

          <div className="product-form-actions">
            <button className="primary-button" type="submit">
              {editandoId !== null ? 'Salvar alterações' : 'Cadastrar produto'}
            </button>

            {editandoId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={limparFormulario}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel product-list-panel">
        <div className="panel-heading">
          <div>
            <h2>Estoque de produtos</h2>
            <p>{produtos.length} produto(s) cadastrado(s)</p>
          </div>

          <input
            className="product-search"
            value={busca}
            onChange={pesquisarProdutos}
            placeholder="Pesquisar produto..."
            aria-label="Pesquisar produto"
          />
        </div>

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Estoque mínimo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtosPaginados.map((produto) => {
                const estoqueMinimo = Number(produto.minimo ?? 5)
                const estoqueAtual = Number(produto.estoque)

                const estoqueBaixo = estoqueAtual <= estoqueMinimo

                return (
                  <tr key={produto.id}>
                    <td>
                      <strong>{produto.nome}</strong>
                    </td>
                    <td>{produto.categoria}</td>
                    <td>{formatarMoeda(produto.preco)}</td>
                    <td>{estoqueAtual} un.</td>
                    <td>{estoqueMinimo} un.</td>
                    <td>
                      <span
                        className={
                          estoqueBaixo
                            ? 'stock-status low'
                            : 'stock-status normal'
                        }
                      >
                        {estoqueBaixo ? 'Estoque baixo' : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <DropdownMenu
                        onView={() =>
                          showToast(
                            `${produto.nome} — Categoria: ${produto.categoria}; Preço: ${formatarMoeda(produto.preco)}; Estoque: ${estoqueAtual} unidade(s); Estoque mínimo: ${estoqueMinimo} unidade(s).`,
                          )
                        }
                        onEdit={() => editarProduto(produto)}
                        onArchive={() => arquivarProduto(produto.id)}
                      />
                    </td>
                  </tr>
                )
              })}

              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-products">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={paginaAtual}
          totalPages={totalPaginas}
          onPageChange={setPaginaAtual}
        />
      </section>
    </section>
  )
}

export default Produtos
