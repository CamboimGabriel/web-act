import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../api";
import logo from "../../assets/Logo_Act.png";

const Familia = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [starterFamilias, setStarterFamilias] = useState({
    comGrupo: [],
    semGrupo: [],
  });
  const [familias, setFamilias] = useState({ comGrupo: [], semGrupo: [] });
  const [filtros, setFiltros] = useState(false);

  const [filtrosAux, setFiltrosAux] = useState({
    desativado: 0,
    numeroAvaliacoes: 0,
    passouControle: 0,
    estado: "",
    userId: "",
  });

  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    async function handleAPI() {
      const resolve = await instance.get("/todasfamilias");

      setFamilias(resolve.data);
      setStarterFamilias(resolve.data);

      const response = await instance.get("/users");
      setColaboradores(response.data);
    }

    handleAPI();
  }, []);

  function exportData(id) {
    // Select rows from table_id
    var rows = document.querySelectorAll("table#" + id + " tr");
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++) {
        // Clean innertext to remove multiple spaces and jumpline (break csv)
        var data = cols[j].innerText
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/(\s\s)/gm, " ");
        // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
        data = data.replace(/"/g, '""');
        // Push escaped string
        row.push('"' + data + '"');
      }
      csv.push(row.join(","));
    }
    var csv_string = csv.join("\n");
    // Download it
    var filename =
      "export_" + id + "_" + new Date().toLocaleDateString() + ".csv";
    var link = document.createElement("a");
    link.style.display = "none";
    link.setAttribute("target", "_blank");
    link.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
    );
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handlePesquisar = () => {
    setFamilias({
      comGrupo: starterFamilias.comGrupo.filter(
        (it) =>
          it.desabilitado === filtrosAux.desativado &&
          it.passouControle === filtrosAux.passouControle &&
          it.formulariosPreenchidos === filtrosAux.numeroAvaliacoes &&
          it.cuidador.estado
            .toLowerCase()
            .includes(filtrosAux.estado.toLowerCase()) &&
          it.userId.toLowerCase().includes(filtrosAux.userId.toLowerCase())
      ),
      semGrupo: starterFamilias.semGrupo.filter(
        (it) =>
          it.desabilitado === filtrosAux.desativado &&
          it.passouControle === filtrosAux.passouControle &&
          it.formulariosPreenchidos === filtrosAux.numeroAvaliacoes &&
          it.cuidador.estado
            .toLowerCase()
            .includes(filtrosAux.estado.toLowerCase()) &&
          it.userId.toLowerCase().includes(filtrosAux.userId.toLowerCase())
      ),
    });
  };

  return (
    <>
      <div
        style={{
          background: "#f5f1e9",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            borderBottom: "3px solid black",
            marginBottom: 30,
          }}
        >
          <img src={logo} alt="" style={{ width: 300 }} />

          <button
            disabled={location === "/colaboradores"}
            style={
              location === "/colaboradores"
                ? {
                    height: 80,
                    fontSize: 30,
                    borderRadius: 30,
                    background: "#faaa",
                    margin: 10,
                    color: "black",
                    border: "2px solid black",
                    cursor: "pointer",
                  }
                : {
                    height: 80,
                    fontSize: 30,
                    borderRadius: 30,
                    margin: 10,
                    border: "2px solid black",
                    cursor: "pointer",
                  }
            }
            onClick={() => {
              navigate("/colaboradores");
            }}
          >
            Colaboradores
          </button>
          <button
            disabled={location === "/familias"}
            style={
              location === "/familias"
                ? {
                    height: 80,
                    fontSize: 30,
                    borderRadius: 30,
                    background: "#faaa",
                    margin: 10,
                    color: "black",
                    border: "2px solid black",
                    cursor: "pointer",
                  }
                : {
                    height: 80,
                    fontSize: 30,
                    borderRadius: 30,
                    margin: 10,
                    border: "2px solid black",
                    cursor: "pointer",
                  }
            }
            onClick={() => {
              navigate("/familias");
            }}
          >
            Famílias
          </button>
          <button
            disabled={location === "/questionarios"}
            style={
              location === "/questionarios"
                ? {
                    height: 80,
                    fontSize: 30,
                    borderRadius: 30,
                    background: "#faaa",
                    margin: 10,
                    color: "black",
                    border: "2px solid black",
                    cursor: "pointer",
                  }
                : {
                    height: 80,
                    fontSize: 30,
                    borderRadius: 30,
                    margin: 10,
                    border: "2px solid black",
                    cursor: "pointer",
                  }
            }
            onClick={() => {
              navigate("/questionarios");
            }}
          >
            Questionários
          </button>
          <button
            style={{
              height: 80,
              fontSize: 30,
              borderRadius: 30,
              margin: 30,
              border: "2px solid grey",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Sair
          </button>
        </div>
        <button
          onClick={() => setFiltros(!filtros)}
          style={{
            height: 80,
            fontSize: 30,
            borderRadius: 30,
            background: "#faaa",
            margin: 10,
            color: "black",
            border: "2px solid black",
            cursor: "pointer",
          }}
        >
          Filtros
        </button>
        {filtros && (
          <div
            style={{
              margin: 8,
              border: "3px solid black",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "40%",
            }}
          >
            <div style={{ color: "black", fontSize: 30, fontWeight: 600 }}>
              FILTROS
            </div>
            <div>
              <div
                style={{
                  margin: 8,
                  borderLeft: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 30,
                }}
              >
                <label style={{ marginRight: 10 }}>Família desabilitada?</label>
                <input
                  type="checkbox"
                  checked={filtrosAux.desativado === 1}
                  onChange={(e) =>
                    setFiltrosAux((prev) => ({
                      ...prev,
                      desativado: filtrosAux.desativado === 1 ? 0 : 1,
                    }))
                  }
                />
              </div>
              <div
                style={{
                  margin: 8,
                  borderLeft: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 30,
                }}
              >
                <label style={{ marginRight: 10 }}>
                  Formulários Preenchidos:
                </label>
                <input
                  placeholder="numero de avaliacoes"
                  type="number"
                  value={filtrosAux.numeroAvaliacoes}
                  onChange={(e) =>
                    setFiltrosAux((prev) => ({
                      ...prev,
                      numeroAvaliacoes: parseInt(e.target.value, 10),
                    }))
                  }
                  style={{ width: 50 }}
                />
              </div>

              <div
                style={{
                  margin: 8,
                  borderLeft: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 30,
                }}
              >
                <label style={{ marginRight: 10 }}>Passou Pelo Controle?</label>
                <input
                  type="checkbox"
                  checked={filtrosAux.passouControle === 1}
                  onChange={(e) =>
                    setFiltrosAux((prev) => ({
                      ...prev,
                      passouControle: filtrosAux.passouControle === 1 ? 0 : 1,
                    }))
                  }
                />
              </div>
              {localStorage.getItem("type") !== "coord" && (
                <div
                  style={{
                    margin: 8,
                    borderLeft: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 30,
                  }}
                >
                  <label style={{ marginRight: 10 }}>Estado:</label>
                  <input
                    placeholder="Estado"
                    value={filtrosAux.estado}
                    onChange={(e) =>
                      setFiltrosAux((prev) => ({
                        ...prev,
                        estado: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
            <button
              style={{
                height: 40,
                fontSize: 20,
                borderRadius: 30,
                background: "#faaa",
                margin: 10,
                color: "black",
                border: "2px solid black",
                cursor: "pointer",
              }}
              onClick={handlePesquisar}
            >
              Pesquisar
            </button>
            <button
              style={{
                height: 40,
                fontSize: 20,
                borderRadius: 30,
                background: "#faaa",
                margin: 10,
                color: "black",
                border: "2px solid black",
                cursor: "pointer",
              }}
              onClick={() => {
                setFiltrosAux({
                  desativado: 0,
                  numeroAvaliacoes: 0,
                  passouControle: 0,
                  estado: "",
                  userId: "",
                });
                setFamilias(starterFamilias);
              }}
            >
              Limpar Filtros
            </button>
          </div>
        )}
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"
        />
        <button onClick={() => exportData("fam")}>
          <span class="glyphicon glyphicon-download"></span>
          Baixar tabela
        </button>
        <table id="fam">
          <thead>
            <tr>
              <th>Nome do Facilitador</th>
              <th>Cidade do Facilitador</th>
              <th>Nome da Criança</th>
              <th>Nascimento da Crianca</th>
              <th>Idade da crianca</th>
              <th>Pele da Crianca</th>
              <th>Sexo da Crianca</th>
              <th>Nome do Cuidador</th>
              <th>Idade do Cuidador</th>
              <th>Nascimento do Cuidador</th>
              <th>Pele do Cuidador</th>
              <th>Parentesco do Cuidador</th>
              <th>Anos de estudo do Cuidador</th>
              <th>Escolaridade do Cuidador</th>
              <th>Filhos de 0 a 6 anos do Cuidador</th>
              <th>CEP</th>
              <th>Endereço</th>
              <th>Estado</th>
              <th>Local do grupo</th>
              <th>Numero de filhos</th>
              <th>Ocupacao</th>
              <th>Pessoas Morando</th>
              <th>Recebe Auxilio</th>
              <th>Caso receba</th>
              <th>Religiao</th>
              <th>Renda mensal</th>
              <th>Situacao conjugal</th>
              <th>Telefones</th>
              <th>Desabilitado</th>
              <th>Formularios preenchidos</th>
              <th>mora atualmente</th>
              <th>Passou controle</th>
              <th>Pertence a grupo</th>
              <th>ID</th>
              <th>ID Facilitador</th>
            </tr>
          </thead>

          <tbody>
            {[...familias.semGrupo, ...familias.comGrupo].map((item) => (
              <tr>
                <td>
                  {colaboradores.find((el) => el._id === item.userId)?.nick}
                </td>
                <td>
                  {colaboradores.find((el) => el._id === item.userId)?.cidade}
                </td>
                <td>{item.crianca.nome}</td>
                <td>{item.crianca.nascimento}</td>
                <td>{item.crianca.idade}</td>
                <td>{item.crianca.pele}</td>
                <td>{item.crianca.sexo}</td>
                <td>{item.cuidador.nome}</td>
                <td>{item.cuidador.idade}</td>
                <td>{item.cuidador.nascimento}</td>
                <td>{item.cuidador.pele}</td>
                <td>{item.cuidador.parentesco}</td>
                <td>{item.cuidador.anosEstudo}</td>
                <td>{item.cuidador.escolaridade}</td>
                <td>{item.cuidador.filhos0a6Anos}</td>
                <td>{item.cuidador.cep}</td>
                <td>{item.cuidador.endereco}</td>
                <td>{item.cuidador.estado}</td>
                <td>{item.cuidador.localGrupo}</td>
                <td>{item.cuidador.numeroFilhos}</td>
                <td>{item.cuidador.ocupacao}</td>
                <td>{item.cuidador.pessoasMorando}</td>
                <td>{item.cuidador.recebeAuxilio}</td>
                <td>{item.cuidador.casoReceba}</td>
                <td>{item.cuidador.religiao}</td>
                <td>{item.cuidador.rendaMensal}</td>
                <td>{item.cuidador.situacaoConjugal}</td>
                <td>{item.cuidador.telefones}</td>
                <td>{item.desabilitado}</td>
                <td>{item.formulariosPreenchidos}</td>
                <td>{item.moraAtualmente}</td>
                <td>{item.passouControle}</td>
                <td>{item.pertenceGrupo}</td>
                <td>{item._id}</td>
                <td>{item.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Familia;
