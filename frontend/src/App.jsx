import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [statusApi, setStatusApi] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [erro, setErro] = useState("");

  // Executado quando o componente é carregado
  useEffect(() => {
    async function carregarDados() {
      try {
        // Consultar o status da API
        const respostaStatus = await fetch("/api/status");
        if (!respostaStatus.ok) {
          throw new Error("Erro ao consultar o status.");
        }

        const dadosStatus = await respostaStatus.json();
        setStatusApi(dadosStatus);

        // Consultar todos os eventos
        const respostaEventos = await fetch("/api/eventos");
        if (!respostaEventos.ok) {
          throw new Error("Erro ao consultar os eventos.");
        }

        const dadosEventos = await respostaEventos.json();
        setEventos(dadosEventos);
      } catch (error) {
        setErro(error.message);
      }
    }

    carregarDados();
  }, []);

  // Consultar um evento pelo ID
  async function buscarEvento(id) {
    try {
      setErro("");

      const resposta = await fetch(`/api/eventos/${id}`);

      if (!resposta.ok) {
        throw new Error("Evento não encontrado.");
      }

      const dados = await resposta.json();
      setEventoSelecionado(dados);
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>VIO WEB</h1>
        <p>Venda de Ingressos Online</p>
      </header>

      <main className="conteudo">
        <section className="card">
          <h2>Status da API - {statusApi?.projeto}</h2>

          <p>Back-end: {statusApi?.status || "Indisponível"}</p>

          <p>{statusApi?.mensagem}</p>
        </section>
        
        <section className="card">
          <h2>Eventos Disponíveis</h2>

          {eventos.map((evento) => (
            <div key={evento.id}>
              <h3>{evento.nome}</h3>
              <p>Local: {evento.local}</p>
              <p>Data: {evento.data}</p>
              <p>Preço: R$ {evento.preco.toFixed(2)}</p>

              <button onClick={() => buscarEvento(evento.id)}>
                Ver detalhes
              </button>

              <hr />
            </div>
          ))}
        </section>
        {eventoSelecionado && (
          <section className="card">
            <h2>Detalhes do Evento</h2>

            <h3>{eventoSelecionado.nome}</h3>
            <p>{eventoSelecionado.descricao}</p>
            <p>Local: {eventoSelecionado.local}</p>
            <p>Data: {eventoSelecionado.data}</p>
            <p>Preço: R$ {eventoSelecionado.preco.toFixed(2)}</p>
          </section>
        )}
        {erro && <p className="erro">{erro}</p>}
      </main>
    </div>
  );
}

export default App;
