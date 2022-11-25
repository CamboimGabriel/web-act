import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../api";
import logo from "../../assets/Logo_Act.png";

const Facilitador = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [starterColaboradores, setStarterColaboradores] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  const [starterColaboradoresCoord, setStarterColaboradoresCoord] = useState(
    []
  );
  const [oldNick, setOldNick] = useState("");
  const [newNick, setNewNick] = useState("");
  const [changeNick, setChangeNick] = useState(false);
  const [colaboradoresCoord, setColaboradoresCoord] = useState([]);
  const [nick, setNick] = useState("");
  const [city, setCity] = useState("");
  const [changeCity, setChangeCity] = useState(false);

  useEffect(() => {
    async function handleApi() {
      const response = await instance.get("/users");

      setColaboradores(
        response.data.filter(
          (it) =>
            !it.coord &&
            (localStorage.getItem("type") !== "coord" ||
              (localStorage.getItem("type") === "coord" &&
                it.cidade ===
                  colaboradoresCoord.find(
                    (item) => item.nick === localStorage.getItem("user")
                  )?.cidade))
        )
      );
      setStarterColaboradores(response.data.filter((it) => !it.coord));

      setColaboradoresCoord(response.data.filter((it) => it.coord));
      setStarterColaboradoresCoord(response.data.filter((it) => it.coord));
    }

    handleApi();
  }, []);

  async function handleRemove(id) {
    await instance.post("/remove-user", { id }).then(() => {
      window.location.reload();
    });
  }

  const [filtros, setFiltros] = useState(false);
  const [add, setAdd] = useState(false);
  const [addPass, setAddPass] = useState(false);
  const [addCoord, setAddCoord] = useState(false);
  const [newAddCoord, setNewAddCoord] = useState({
    cidade: "",
    nick: "",
    senha: "",
  });
  const [newPass, setNewPass] = useState({
    nick: "",
    senha: "",
  });

  const [filtrosAux, setFiltrosAux] = useState({
    id: "",
    nick: "",
    cidade: "",
  });

  function exportData(id) {
    /* Get the HTML data using Element by Id */
    var table = document.getElementById(id);

    /* Declaring array variable */
    var rows = [];

    //iterate through rows of table
    for (var i = 0, row; (row = table.rows[i]); i++) {
      //rows would be accessed using the "row" variable assigned in the for loop
      //Get each cell value/column from the row
      const column1 = row.cells[0].innerText;
      const column2 = row.cells[1].innerText;
      const column3 = row.cells[2].innerText;

      /* add a new records in the array */
      rows.push([column1, column2, column3]);
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    /* add the column delimiter as comma(,) and each row splitted by new line character (\n) */
    rows.forEach(function (rowArray) {
      const row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    /* create a hidden <a> DOM node and set its download attribute */
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tabela.csv");
    document.body.appendChild(link);
    /* download the data file named "Stock_Price_Report.csv" */
    link.click();
  }

  const [newAdd, setNewAdd] = useState({ cidade: "", nick: "", senha: "" });

  const handlePesquisar = () => {
    setColaboradores(
      starterColaboradores.filter(
        (it) =>
          it._id.toLowerCase().includes(filtrosAux.id.toLowerCase()) &&
          it.nick.toLowerCase().includes(filtrosAux.nick.toLowerCase()) &&
          ((it.cidade &&
            it?.cidade
              .toLowerCase()
              .includes(filtrosAux.cidade?.toLowerCase())) ||
            (!it?.cidade && filtrosAux.cidade === "")) &&
          (localStorage.getItem("type") !== "coord" ||
            (localStorage.getItem("type") === "coord" &&
              it.cidade ===
                colaboradoresCoord.find(
                  (item) => item.nick === localStorage.getItem("user")
                )?.cidade))
      )
    );
  };

  const [excluir, setExcluir] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
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
        {localStorage.getItem("type") !== "coord" && (
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
        )}
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

      {localStorage.getItem("type") !== "coord" && (
        <button
          onClick={() => setAdd(!add)}
          style={{
            height: 80,
            fontSize: 30,
            borderRadius: 30,
            background: "#faaa",
            margin: 10,
            color: "black",
            border: "2px solid black",
            cursor: "pointer",
            width: 300,
          }}
        >
          Adicionar Facilitador
        </button>
      )}
      {localStorage.getItem("type") !== "coord" && (
        <button
          onClick={() => setAddPass(!addPass)}
          style={{
            height: 80,
            fontSize: 30,
            borderRadius: 30,
            background: "#faaa",
            margin: 10,
            color: "black",
            border: "2px solid black",
            cursor: "pointer",
            width: 300,
          }}
        >
          Trocar senha do facilitador
        </button>
      )}
      {add && (
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
            ADICIONAR FACILITADOR
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
            <label style={{ marginRight: 10 }}>Nome do usuário:</label>
            <input
              placeholder="Nome do usuário"
              value={newAdd.nick}
              onChange={(e) =>
                setNewAdd((prev) => ({
                  ...prev,
                  nick: e.target.value,
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
            <label style={{ marginRight: 10 }}>Cidade do usuário:</label>
            <input
              placeholder="Cidade do usuário"
              value={newAdd.cidade}
              onChange={(e) =>
                setNewAdd((prev) => ({
                  ...prev,
                  cidade: e.target.value,
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
            <label style={{ marginRight: 10 }}>Senha do usuário:</label>
            <input
              placeholder="Senha do usuário"
              type="password"
              value={newAdd.senha}
              onChange={(e) =>
                setNewAdd((prev) => ({
                  ...prev,
                  senha: e.target.value,
                }))
              }
            />
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
            onClick={async () => {
              setNewAdd({ cidade: "", nick: "", senha: "" });

              instance.post("/signup", {
                nick: newAdd.nick,
                password: newAdd.senha,
                cidade: newAdd.cidade,
              });
            }}
          >
            Adicionar Facilitador
          </button>
        </div>
      )}
      {addPass && (
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
            TROCAR SENHA DO FACILITADOR
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
            <label style={{ marginRight: 10 }}>Nome do usuário:</label>
            <input
              placeholder="Nome do usuário"
              value={newPass.nick}
              onChange={(e) =>
                setNewPass((prev) => ({
                  ...prev,
                  nick: e.target.value,
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
            <label style={{ marginRight: 10 }}>Nova Senha:</label>
            <input
              placeholder="Senha do usuário"
              value={newPass.senha}
              onChange={(e) =>
                setNewPass((prev) => ({
                  ...prev,
                  senha: e.target.value,
                }))
              }
            />
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
            onClick={async () => {
              setNewPass({ nick: "", senha: "" });

              await instance.post("/changepassword", {
                nick: newPass.nick,
                password: newPass.senha,
              });
            }}
          >
            Atualizar Senha
          </button>
        </div>
      )}
      {localStorage.getItem("type") !== "coord" && (
        <button
          onClick={() => setAddCoord(!addCoord)}
          style={{
            height: 80,
            fontSize: 30,
            borderRadius: 30,
            background: "#faaa",
            margin: 10,
            color: "black",
            border: "2px solid black",
            cursor: "pointer",
            width: 300,
          }}
        >
          Adicionar Coordenador
        </button>
      )}
      {addCoord && (
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
            ADICIONAR COORDENADOR
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
            <label style={{ marginRight: 10 }}>Nome do usuário:</label>
            <input
              placeholder="Nome do usuário"
              value={newAddCoord.nick}
              onChange={(e) =>
                setNewAddCoord((prev) => ({
                  ...prev,
                  nick: e.target.value,
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
            <label style={{ marginRight: 10 }}>Cidade do usuário:</label>
            <input
              placeholder="Cidade do usuário"
              value={newAddCoord.cidade}
              onChange={(e) =>
                setNewAddCoord((prev) => ({
                  ...prev,
                  cidade: e.target.value,
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
            <label style={{ marginRight: 10 }}>Senha do usuário:</label>
            <input
              placeholder="Senha do usuário"
              type="password"
              value={newAddCoord.senha}
              onChange={(e) =>
                setNewAddCoord((prev) => ({
                  ...prev,
                  senha: e.target.value,
                }))
              }
            />
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
            onClick={async () => {
              setNewAddCoord({ cidade: "", nick: "", senha: "" });

              instance.post("/signup", {
                nick: newAddCoord.nick,
                password: newAddCoord.senha,
                cidade: newAddCoord.cidade,
                coord: true,
              });

              window.location.reload();
            }}
          >
            Adicionar Coordenador
          </button>
        </div>
      )}
      {localStorage.getItem("type") !== "coord" && (
        <button
          style={{
            height: 80,
            fontSize: 20,
            borderRadius: 30,
            background: "#faaa",
            margin: 10,
            color: "black",
            border: "2px solid black",
            cursor: "pointer",

            width: 300,
          }}
          onClick={async () => {
            setChangeNick((prev) => !prev);

            instance.post("/signup", {
              nick: newAddCoord.nick,
              password: newAddCoord.senha,
              cidade: newAddCoord.cidade,
              coord: true,
            });
          }}
        >
          Modificar nome do Facilitador/Coordenador
        </button>
      )}
      {changeNick && (
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
            MUDAR NOME DE FACILITADOR/COORDENADOR
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
              <label style={{ marginRight: 10 }}>Nome atual:</label>
              <input
                placeholder="Nome atual"
                value={oldNick}
                onChange={(e) => setOldNick(e.target.value)}
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
                <label style={{ marginRight: 10 }}>Novo nome:</label>
                <input
                  placeholder="Novo nome"
                  value={newNick}
                  onChange={(e) => setNewNick(e.target.value)}
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
            onClick={() => {
              instance.post("/newnick", {
                oldNick,
                newNick,
              });

              window.location.reload();
            }}
          >
            Confirmar Mudança
          </button>
        </div>
      )}

      {localStorage.getItem("type") !== "coord" && (
        <button
          style={{
            height: 80,
            fontSize: 20,
            borderRadius: 30,
            background: "#faaa",
            margin: 10,
            color: "black",
            border: "2px solid black",
            cursor: "pointer",

            width: 300,
          }}
          onClick={async () => {
            setChangeCity((prev) => !prev);
          }}
        >
          Modificar cidade do Facilitador/Coordenador
        </button>
      )}

      {changeCity && (
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
            MUDAR CIDADE DE FACILITADOR/COORDENADOR
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
              <label style={{ marginRight: 10 }}>Nome do usuário:</label>
              <input
                placeholder="Nome do usuário"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
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
                <label style={{ marginRight: 10 }}>
                  Nova cidade do usuário:
                </label>
                <input
                  placeholder="Nova cidade do usuário"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
            onClick={async () => {
              await instance.post("/newcity", {
                nick,
                city,
              });

              window.location.reload();
            }}
          >
            Confirmar Mudança
          </button>
        </div>
      )}

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
          width: 300,
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
              <label style={{ marginRight: 10 }}>Nome do usuário:</label>
              <input
                placeholder="Nome do usuário"
                value={filtrosAux.nick}
                onChange={(e) =>
                  setFiltrosAux((prev) => ({
                    ...prev,
                    nick: e.target.value,
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
                <label style={{ marginRight: 10 }}>Cidade do usuário:</label>
                <input
                  placeholder="Cidade do usuário"
                  value={filtrosAux.cidade}
                  onChange={(e) =>
                    setFiltrosAux((prev) => ({
                      ...prev,
                      cidade: e.target.value,
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
                id: "",
                nick: "",
                cidade: "",
              });
              setColaboradores(starterColaboradores);
            }}
          >
            Limpar Filtros
          </button>
        </div>
      )}

      <div style={{ margin: 10, fontSize: 50, fontWeight: 700 }}>
        FACILITADORES
      </div>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"
      />
      <button onClick={() => exportData("fac")}>
        <span class="glyphicon glyphicon-download"></span>
        Baixar tabela
      </button>
      <div>
        <table id={"fac"}>
          <thead>
            <tr>
              {localStorage.getItem("type") !== "coord" && (
                <th>Excluir usuário</th>
              )}
              <th>Id do usuário</th>
              <th>Nome do usuário</th>
              <th>Cidade do usuário</th>
            </tr>
          </thead>

          <tbody>
            {colaboradores.map((item) => (
              <tr>
                {localStorage.getItem("type") !== "coord" && (
                  <td style={{ display: "flex", justifyContent: "center" }}>
                    {excluir === item._id ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        Excluir {item.nick}?
                        <button
                          onClick={() => {
                            handleRemove(item._id);
                            setExcluir(false);
                          }}
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => {
                            setExcluir(false);
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setExcluir(item._id);
                        }}
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                )}

                <td>{item._id}</td>
                <td>{item.nick}</td>
                <td>{item.cidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {localStorage.getItem("type") !== "coord" && (
        <>
          <div style={{ margin: 10, fontSize: 50, fontWeight: 700 }}>
            COORDENADORES
          </div>

          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"
          />
          <button onClick={() => exportData("coord")}>
            <span class="glyphicon glyphicon-download"></span>
            Baixar tabela
          </button>

          <div>
            <table id="coord">
              <thead>
                <tr>
                  <th>Excluir usuário</th>
                  <th>Id do usuário</th>
                  <th>Nome do usuário</th>
                  <th>Cidade do usuário</th>
                </tr>
              </thead>

              <tbody>
                {colaboradoresCoord.map((item) => (
                  <tr>
                    <td style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        onClick={() => {
                          handleRemove(item._id);
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                    <td>{item._id}</td>
                    <td>{item.nick}</td>
                    <td>{item.cidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Facilitador;
