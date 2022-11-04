import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../api";
import logo from "../../assets/Logo_Act.png";

const Questionarios = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [familias, setFamilias] = useState({ comGrupo: [], semGrupo: [] });

  const [colaboradores, setColaboradores] = useState([]);
  const [newForm, setNewForm] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleAPI() {
      const resolve = await axios.get(
        "https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-1-wujmv/service/googlesheet-connect/incoming_webhook/FORMS"
      );

      const resolvea = await instance.get("/todasfamilias");

      const todasFamilias = [
        ...resolvea.data.comGrupo.filter(
          (it) => it.userId !== "5ff9ef226af22c1ad7c05d21"
        ),
        ...resolvea.data.semGrupo.filter(
          (it) => it.userId !== "5ff9ef226af22c1ad7c05d21"
        ),
      ];

      setFamilias(todasFamilias);

      const response = await instance.get("/users");
      setColaboradores(response.data);

      let newArray = [];

      todasFamilias.forEach((item) => {
        newArray.push({
          familia: item,
          formulario1: resolve.data.find(
            (it) =>
              it.numeroDoFormulario.$numberInt === "1" &&
              it.familyId.$oid === item._id
          )
            ? resolve.data.find(
                (it) =>
                  it.numeroDoFormulario.$numberInt === "1" &&
                  it.familyId.$oid === item._id
              )
            : undefined,
          formulario2: undefined,
          formulario3: undefined,
        });
      });

      newArray.forEach((item) => {
        const form2 = resolve.data.find(
          (el) =>
            el.familyId.$oid === item.familia._id &&
            el.numeroDoFormulario.$numberInt === "2"
        );
        const form3 = resolve.data.find(
          (el) =>
            el.familyId.$oid === item.familia._id &&
            el.numeroDoFormulario.$numberInt === "3"
        );

        if (form2) {
          item.formulario2 = form2;
        }
        if (form3) {
          item.formulario3 = form3;
        }
      });

      setNewForm(newArray);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
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
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"
        />

        {!loading && newForm.length > 1 ? (
          <>
            <button onClick={() => exportData("quest")}>
              <span className="glyphicon glyphicon-download"></span>
              Baixar tabela
            </button>

            {true && (
              <table id="quest">
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
                    <th>Randomização</th>
                    <th>Pertence a grupo</th>
                    <th>ID</th>
                    <th>ID Facilitador</th>
                    <th>formulário 1</th>
                    <th>Participou de outro projeto</th>
                    <th>Caso tenha participado</th>
                    <th>ABEP_1</th>
                    <th>ABEP_2</th>
                    <th>ABEP_3</th>
                    <th>ABEP_4</th>
                    <th>ABEP_5</th>
                    <th>ABEP_6</th>
                    <th>ABEP_7</th>
                    <th>ABEP_8</th>
                    <th>ABEP_9</th>
                    <th>ABEP_10</th>
                    <th>ABEP_11</th>
                    <th>ABEP_12</th>
                    <th>ABEP_13</th>
                    <th>ABEP_14</th>
                    <th>ABEP_15</th>
                    <th>F1_MICS_1</th>
                    <th>F1_MICS_2</th>
                    <th>F1_MICS_3</th>
                    <th>F1_MICS_4</th>
                    <th>F1_MICS_5</th>
                    <th>F1_MICS_6</th>
                    <th>F1_PSOC_1</th>
                    <th>F1_PSOC_2</th>
                    <th>F1_PSOC_3</th>
                    <th>F1_PSOC_4</th>
                    <th>F1_PSOC_5</th>
                    <th>F1_PSOC_6</th>
                    <th>F1_PSOC_7</th>
                    <th>F1_PSOC_8</th>
                    <th>F1_PSOC_9</th>
                    <th>F1_PSOC_10</th>
                    <th>F1_PSOC_11</th>
                    <th>F1_PSOC_12</th>
                    <th>F1_PSOC_13</th>
                    <th>F1_PSOC_14</th>
                    <th>F1_PSOC_15</th>
                    <th>F1_PSOC_16</th>
                    <th>F1_PSOC_17</th>
                    <th>F1_PSOC_18</th>
                    <th>F1_ACT_EP2</th>
                    <th>F1_ACT_EP4</th>
                    <th>F1_ACT_EP5</th>
                    <th>F1_ACT_EP6</th>
                    <th>F1_ACT_EP7</th>
                    <th>F1_ACT_EP8</th>
                    <th>F1_ACT_EP10</th>
                    <th>F1_ACT_EP11</th>
                    <th>F1_ACT_CP1</th>
                    <th>F1_ACT_CP2</th>
                    <th>F1_ACT_CP3</th>
                    <th>F1_ACT_CP4</th>
                    <th>F1_ACT_CP5</th>
                    <th>F1_ACT_CP6</th>
                    <th>F1_ACT_CP8</th>
                    <th>F1_PAFAS_1</th>
                    <th>F1_PAFAS_2</th>
                    <th>F1_PAFAS_3</th>
                    <th>F1_PAFAS_4</th>
                    <th>F1_PAFAS_5</th>
                    <th>F1_PAFAS_6</th>
                    <th>F1_PAFAS_7</th>
                    <th>F1_PAFAS_8</th>
                    <th>F1_PAFAS_9</th>
                    <th>F1_PAFAS_11</th>
                    <th>F1_SDQ_1</th>
                    <th>F1_SDQ_2</th>
                    <th>F1_SDQ_3</th>
                    <th>F1_SDQ_4</th>
                    <th>F1_SDQ_5</th>
                    <th>F1_SDQ_6</th>
                    <th>F1_SDQ_7</th>
                    <th>F1_SDQ_8</th>
                    <th>F1_SDQ_9</th>
                    <th>F1_SDQ_10</th>
                    <th>F1_SDQ_11</th>
                    <th>F1_SDQ_12</th>
                    <th>F1_SDQ_13</th>
                    <th>F1_SDQ_14</th>
                    <th>F1_SDQ_15</th>
                    <th>F1_SDQ_16</th>
                    <th>F1_SDQ_17</th>
                    <th>F1_SDQ_18(2-3)</th>
                    <th>F1_SDQ_18(4-8)</th>
                    <th>F1_SDQ_19</th>
                    <th>F1_SDQ_20</th>
                    <th>F1_SDQ_21(2-3)</th>
                    <th>F1_SDQ_21(4-8)</th>
                    <th>F1_SDQ_22(2-3)</th>
                    <th>F1_SDQ_22(4-8)</th>
                    <th>F1_SDQ_23</th>
                    <th>F1_SDQ_24</th>
                    <th>F1_SDQ_25</th>
                    <th>F1_EPVA_3</th>
                    <th>F1_EPVA_4</th>
                    <th>F1_EPVA_8</th>
                    <th>F1_EPVA_10</th>
                    <th>F1_EPVA_12</th>
                    <th>F1_EPVA_14</th>
                    <th>F1_EPVA_15</th>
                    <th>F1_EPVA_16</th>
                    <th>F1_EPVA_18</th>
                    <th>F1_EPVA_20</th>
                    <th>F1_EPVA_21</th>
                    <th>F1_EPVA_23</th>
                    <th>F1_EPVA_24</th>
                    <th>F1_EPVA_26</th>
                    <th>F1_EPVA_28</th>
                    <th>EPVA_31</th>
                    <th>EPVA_32</th>
                    <th>F1_EPVA_34</th>
                    <th>F1_EPVA_36</th>
                    <th>F1_EPVA_38</th>
                    <th>EPVA_40</th>
                    <th>F1_EPVA_42</th>
                    <th>formulario 2</th>
                    <th>Participou de outro projeto?</th>
                    <th>Caso participe</th>
                    <th>F2_MICS_1</th>
                    <th>F2_MICS_2</th>
                    <th>F2_MICS_3</th>
                    <th>F2_MICS_4</th>
                    <th>F2_MICS_5</th>
                    <th>F2_MICS_6</th>
                    <th>F2_PSOC_1</th>
                    <th>F2_PSOC_2</th>
                    <th>F2_PSOC_3</th>
                    <th>F2_PSOC_4</th>
                    <th>F2_PSOC_5</th>
                    <th>F2_PSOC_6</th>
                    <th>F2_PSOC_7</th>
                    <th>F2_PSOC_8</th>
                    <th>F2_PSOC_9</th>
                    <th>F2_PSOC_10</th>
                    <th>F2_PSOC_11</th>
                    <th>F2_PSOC_12</th>
                    <th>F2_PSOC_13</th>
                    <th>F2_PSOC_14</th>
                    <th>F2_PSOC_15</th>
                    <th>F2_PSOC_16</th>
                    <th>F2_PSOC_17</th>
                    <th>F2_PSOC_18</th>
                    <th>F2_ACT_EP2</th>
                    <th>F2_ACT_EP4</th>
                    <th>F2_ACT_EP5</th>
                    <th>F2_ACT_EP6</th>
                    <th>F2_ACT_EP7</th>
                    <th>F2_ACT_EP8</th>
                    <th>F2_ACT_EP10</th>
                    <th>F2_ACT_EP11</th>
                    <th>F2_ACT_CP1</th>
                    <th>F2_ACT_CP2</th>
                    <th>F2_ACT_CP3</th>
                    <th>F2_ACT_CP4</th>
                    <th>F2_ACT_CP5</th>
                    <th>F2_ACT_CP6</th>
                    <th>F2_ACT_CP8</th>
                    <th>F2_PAFAS_1</th>
                    <th>F2_PAFAS_2</th>
                    <th>F2_PAFAS_3</th>
                    <th>F2_PAFAS_4</th>
                    <th>F2_PAFAS_5</th>
                    <th>F2_PAFAS_6</th>
                    <th>F2_PAFAS_7</th>
                    <th>F2_PAFAS_8</th>
                    <th>F2_PAFAS_9</th>
                    <th>F2_PAFAS_11</th>
                    <th>F2_SDQ_1</th>
                    <th>F2_SDQ_2</th>
                    <th>F2_SDQ_3</th>
                    <th>F2_SDQ_4</th>
                    <th>F2_SDQ_5</th>
                    <th>F2_SDQ_6</th>
                    <th>F2_SDQ_7</th>
                    <th>F2_SDQ_8</th>
                    <th>F2_SDQ_9</th>
                    <th>F2_SDQ_10</th>
                    <th>F2_SDQ_11</th>
                    <th>F2_SDQ_12</th>
                    <th>F2_SDQ_13</th>
                    <th>F2_SDQ_14</th>
                    <th>F2_SDQ_15</th>
                    <th>F2_SDQ_16</th>
                    <th>F2_SDQ_17</th>
                    <th>F2_SDQ_18(2-3)</th>
                    <th>F2_SDQ_18(4-8)</th>
                    <th>F2_SDQ_19</th>
                    <th>F2_SDQ_20</th>
                    <th>F2_SDQ_21(2-3)</th>
                    <th>F2_SDQ_21(4-8)</th>
                    <th>F2_SDQ_22(2-3)</th>
                    <th>F2_SDQ_22(4-8)</th>
                    <th>F2_SDQ_23</th>
                    <th>F2_SDQ_24</th>
                    <th>F2_SDQ_25</th>
                    <th>F2_EPVA_4</th>
                    <th>F2_EPVA_8</th>
                    <th>F2_EPVA_10</th>
                    <th>F2_EPVA_12</th>
                    <th>F2_EPVA_16</th>
                    <th>F2_EPVA_18</th>
                    <th>F2_EPVA_20</th>
                    <th>F2_EPVA_21</th>
                    <th>F2_EPVA_23</th>
                    <th>F2_EPVA_24</th>
                    <th>F2_EPVA_26</th>
                    <th>F2_EPVA_28</th>
                    <th>F2_EPVA_34</th>
                    <th>F2_EPVA_36</th>
                    <th>F2_EPVA_38</th>
                    <th>F2_EPVA_42</th>
                    <th>VI_1</th>
                    <th>VI_2</th>
                    <th>VI_3</th>
                    <th>VI_4</th>
                    <th>ACT</th>
                    <th>formulario 3</th>
                    <th>Particiou de outro projeto?</th>
                    <th>Caso participe</th>
                    <th>F3_MICS_1</th>
                    <th>F3_MICS_2</th>
                    <th>F3_MICS_3</th>
                    <th>F3_MICS_4</th>
                    <th>F3_MICS_5</th>
                    <th>F3_MICS_6</th>
                    <th>F3_PSOC_1</th>
                    <th>F3_PSOC_2</th>
                    <th>F3_PSOC_3</th>
                    <th>F3_PSOC_4</th>
                    <th>F3_PSOC_5</th>
                    <th>F3_PSOC_6</th>
                    <th>F3_PSOC_7</th>
                    <th>F3_PSOC_8</th>
                    <th>F3_PSOC_9</th>
                    <th>F3_PSOC_10</th>
                    <th>F3_PSOC_11</th>
                    <th>F3_PSOC_12</th>
                    <th>F3_PSOC_13</th>
                    <th>F3_PSOC_14</th>
                    <th>F3_PSOC_15</th>
                    <th>F3_PSOC_16</th>
                    <th>F3_PSOC_17</th>
                    <th>F3_PSOC_18</th>
                    <th>F3_ACT_EP2</th>
                    <th>F3_ACT_EP4</th>
                    <th>F3_ACT_EP5</th>
                    <th>F3_ACT_EP6</th>
                    <th>F3_ACT_EP7</th>
                    <th>F3_ACT_EP8</th>
                    <th>F3_ACT_EP10</th>
                    <th>F3_ACT_EP11</th>
                    <th>F3_ACT_CP1</th>
                    <th>F3_ACT_CP2</th>
                    <th>F3_ACT_CP3</th>
                    <th>F3_ACT_CP4</th>
                    <th>F3_ACT_CP5</th>
                    <th>F3_ACT_CP6</th>
                    <th>F3_ACT_CP8</th>
                    <th>F3_PAFAS_1</th>
                    <th>F3_PAFAS_2</th>
                    <th>F3_PAFAS_3</th>
                    <th>F3_PAFAS_4</th>
                    <th>F3_PAFAS_5</th>
                    <th>F3_PAFAS_6</th>
                    <th>F3_PAFAS_7</th>
                    <th>F3_PAFAS_8</th>
                    <th>F3_PAFAS_9</th>
                    <th>F3_PAFAS_11</th>
                    <th>F3_SDQ_1</th>
                    <th>F3_SDQ_2</th>
                    <th>F3_SDQ_3</th>
                    <th>F3_SDQ_4</th>
                    <th>F3_SDQ_5</th>
                    <th>F3_SDQ_6</th>
                    <th>F3_SDQ_7</th>
                    <th>F3_SDQ_8</th>
                    <th>F3_SDQ_9</th>
                    <th>F3_SDQ_10</th>
                    <th>F3_SDQ_11</th>
                    <th>F3_SDQ_12</th>
                    <th>F3_SDQ_13</th>
                    <th>F3_SDQ_14</th>
                    <th>F3_SDQ_15</th>
                    <th>F3_SDQ_16</th>
                    <th>F3_SDQ_17</th>
                    <th>F3_SDQ_18(2-3)</th>
                    <th>F3_SDQ_18(4-8)</th>
                    <th>F3_SDQ_19</th>
                    <th>F3_SDQ_20</th>
                    <th>F3_SDQ_21(2-3)</th>
                    <th>F3_SDQ_21(4-8)</th>
                    <th>F3_SDQ_22(2-3)</th>
                    <th>F3_SDQ_22(4-8)</th>
                    <th>F3_SDQ_23</th>
                    <th>F3_SDQ_24</th>
                    <th>F3_SDQ_25</th>
                    <th>F3_EPVA_4</th>
                    <th>F3_EPVA_8</th>
                    <th>F3_EPVA_10</th>
                    <th>F3_EPVA_12</th>
                    <th>F3_EPVA_16</th>
                    <th>F3_EPVA_18</th>
                    <th>F3_EPVA_20</th>
                    <th>F3_EPVA_21</th>
                    <th>F3_EPVA_23</th>
                    <th>F3_EPVA_24</th>
                    <th>F3_EPVA_26</th>
                    <th>F3_EPVA_28</th>
                    <th>F3_EPVA_34</th>
                    <th>F3_EPVA_36</th>
                    <th>F3_EPVA_38</th>
                    <th>F3_EPVA_42</th>
                    <th>ACT</th>
                  </tr>
                </thead>

                <tbody>
                  {newForm.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {
                          colaboradores.find(
                            (el) => el._id === item?.familia?.userId
                          )?.nick
                        }
                      </td>
                      <td>
                        {
                          colaboradores.find(
                            (el) => el._id === item?.familia?.userId
                          )?.cidade
                        }
                      </td>
                      <td>{item?.familia?.crianca?.nome}</td>
                      <td>{item?.familia?.crianca?.nascimento}</td>
                      <td>{item?.familia?.crianca?.idade}</td>
                      <td>{item?.familia?.crianca?.pele}</td>
                      <td>{item?.familia?.crianca?.sexo}</td>
                      <td>{item?.familia?.cuidador?.nome}</td>
                      <td>{item?.familia?.cuidador?.idade}</td>
                      <td>{item?.familia?.cuidador?.nascimento}</td>
                      <td>{item?.familia?.cuidador?.pele}</td>
                      <td>{item?.familia?.cuidador?.parentesco}</td>
                      <td>{item?.familia?.cuidador?.anosEstudo}</td>
                      <td>{item?.familia?.cuidador?.escolaridade}</td>
                      <td>{item?.familia?.cuidador?.filhos0a6Anos}</td>
                      <td>{item?.familia?.cuidador?.cep}</td>
                      <td>{item?.familia?.cuidador?.endereco}</td>
                      <td>{item?.familia?.cuidador?.estado}</td>
                      <td>{item?.familia?.cuidador?.localGrupo}</td>
                      <td>{item?.familia?.cuidador?.numeroFilhos}</td>
                      <td>{item?.familia?.cuidador?.ocupacao}</td>
                      <td>{item?.familia?.cuidador?.pessoasMorando}</td>
                      <td>{item?.familia?.cuidador?.recebeAuxilio}</td>
                      <td>{item?.familia?.cuidador?.casoReceba}</td>
                      <td>{item?.familia?.cuidador?.religiao}</td>
                      <td>{item?.familia?.cuidador?.rendaMensal}</td>
                      <td>{item?.familia?.cuidador?.situacaoConjugal}</td>
                      <td>{item?.familia?.cuidador?.telefones}</td>
                      <td>
                        {familias.find((it) => it._id === item?.familia?._id)
                          ?.desabilitado === 1
                          ? "Sim"
                          : "Não"}
                      </td>
                      <td>
                        {familias.find((it) => it._id === item?.familia._id)
                          ?.formulariosPreenchidos
                          ? familias.find((it) => it._id === item?.familia._id)
                              ?.formulariosPreenchidos
                          : "0"}
                      </td>
                      <td>{item?.familia?.moraAtualmente}</td>
                      <td>
                        {item?.familia?.pertenceGrupo === 0
                          ? 0
                          : item?.familia?.passouControle === 1
                          ? 2
                          : 1}
                      </td>
                      <td>
                        {item?.familia?.pertenceGrupo
                          ? item?.familia?.pertenceGrupo !== 0
                            ? 1
                            : 0
                          : 0}
                      </td>

                      <td>{item?.familia?._id}</td>
                      <td>{item?.familia?.userId}</td>
                      <td>{item?.formulario1?._id?.$oid}</td>
                      <td>
                        {item?.formulario1?.questionario?.participouOutro}
                      </td>
                      <td>{item?.formulario1?.questionario?.casoParticipe}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_1}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_2}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_3}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_4}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_5}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_6}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_7}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_8}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_9}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_10}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_11}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_12}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_13}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_14}</td>
                      <td>{item?.formulario1?.questionario?.ABEP_15}</td>
                      <td>{item?.formulario1?.questionario?.MICS_1}</td>
                      <td>{item?.formulario1?.questionario?.MICS_2}</td>
                      <td>{item?.formulario1?.questionario?.MICS_3}</td>
                      <td>{item?.formulario1?.questionario?.MICS_4}</td>
                      <td>{item?.formulario1?.questionario?.MICS_5}</td>
                      <td>{item?.formulario1?.questionario?.MICS_6}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_1}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_2}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_3}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_4}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_5}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_6}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_7}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_8}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_9}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_10}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_11}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_12}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_13}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_14}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_15}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_16}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_17}</td>
                      <td>{item?.formulario1?.questionario?.PSOC_18}</td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP2?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP4?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP5?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP6?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP7?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP8?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP10?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario1?.questionario?.ACT_EP11?.$numberInt}
                      </td>
                      <td>{item?.formulario1?.questionario?.ACT_CP1}</td>
                      <td>{item?.formulario1?.questionario?.ACT_CP2}</td>
                      <td>{item?.formulario1?.questionario?.ACT_CP3}</td>
                      <td>{item?.formulario1?.questionario?.ACT_CP4}</td>
                      <td>{item?.formulario1?.questionario?.ACT_CP5}</td>
                      <td>{item?.formulario1?.questionario?.ACT_CP6}</td>
                      <td>{item?.formulario1?.questionario?.ACT_CP8}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_1}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_2}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_3}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_4}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_5}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_6}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_7}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_8}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_9}</td>
                      <td>{item?.formulario1?.questionario?.PAFAS_11}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_1}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_2}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_3}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_4}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_5}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_6}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_7}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_8}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_9}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_10}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_11}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_12}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_13}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_14}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_15}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_16}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_17}</td>
                      <td>{item?.formulario1?.questionario["SDQ_18(2-3)"]}</td>
                      <td>{item?.formulario1?.questionario["SDQ_18(4-8)"]}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_19}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_20}</td>
                      <td>{item?.formulario1?.questionario["SDQ_21(2-3)"]}</td>
                      <td>{item?.formulario1?.questionario["SDQ_21(4-8)"]}</td>
                      <td>{item?.formulario1?.questionario["SDQ_22(2-3)"]}</td>
                      <td>{item?.formulario1?.questionario["SDQ_22(4-8)"]}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_23}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_24}</td>
                      <td>{item?.formulario1?.questionario?.SDQ_25}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_3}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_4}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_8}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_10}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_12}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_14}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_15}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_16}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_18}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_20}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_21}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_23}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_24}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_26}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_28}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_31}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_32}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_34}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_36}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_38}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_40}</td>
                      <td>{item?.formulario1?.questionario?.EPVA_42}</td>
                      <td>{item?.formulario2?._id?.$oid}</td>
                      <td>
                        {item?.formulario2?.questionario?.participouOutro}
                      </td>
                      <td>{item?.formulario2?.questionario?.casoParticipe}</td>
                      <td>{item?.formulario2?.questionario?.MICS_1}</td>
                      <td>{item?.formulario2?.questionario?.MICS_2}</td>
                      <td>{item?.formulario2?.questionario?.MICS_3}</td>
                      <td>{item?.formulario2?.questionario?.MICS_4}</td>
                      <td>{item?.formulario2?.questionario?.MICS_5}</td>
                      <td>{item?.formulario2?.questionario?.MICS_6}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_1}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_2}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_3}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_4}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_5}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_6}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_7}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_8}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_9}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_10}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_11}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_12}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_13}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_14}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_15}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_16}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_17}</td>
                      <td>{item?.formulario2?.questionario?.PSOC_18}</td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP2?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP4?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP5?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP6?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP7?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP8?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP10?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario2?.questionario?.ACT_EP11?.$numberInt}
                      </td>
                      <td>{item?.formulario2?.questionario?.ACT_CP1}</td>
                      <td>{item?.formulario2?.questionario?.ACT_CP2}</td>
                      <td>{item?.formulario2?.questionario?.ACT_CP3}</td>
                      <td>{item?.formulario2?.questionario?.ACT_CP4}</td>
                      <td>{item?.formulario2?.questionario?.ACT_CP5}</td>
                      <td>{item?.formulario2?.questionario?.ACT_CP6}</td>
                      <td>{item?.formulario2?.questionario?.ACT_CP8}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_1}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_2}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_3}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_4}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_5}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_6}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_7}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_8}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_9}</td>
                      <td>{item?.formulario2?.questionario?.PAFAS_11}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_1}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_2}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_3}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_4}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_5}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_6}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_7}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_8}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_9}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_10}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_11}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_12}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_13}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_14}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_15}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_16}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_17}</td>
                      <td>{item?.formulario2?.questionario["SDQ_18(2-3)"]}</td>
                      <td>{item?.formulario2?.questionario["SDQ_18(4-8)"]}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_19}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_20}</td>
                      <td>{item?.formulario2?.questionario["SDQ_21(2-3)"]}</td>
                      <td>{item?.formulario2?.questionario["SDQ_21(4-8)"]}</td>
                      <td>{item?.formulario2?.questionario["SDQ_22(2-3)"]}</td>
                      <td>{item?.formulario2?.questionario["SDQ_22(4-8)"]}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_23}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_24}</td>
                      <td>{item?.formulario2?.questionario?.SDQ_25}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_4}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_8}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_10}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_12}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_16}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_18}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_20}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_21}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_23}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_24}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_26}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_28}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_34}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_36}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_38}</td>
                      <td>{item?.formulario2?.questionario?.EPVA_42}</td>
                      <td>{item?.formulario2?.questionario?.VI_1}</td>
                      <td>{item?.formulario2?.questionario?.VI_2}</td>
                      <td>{item?.formulario2?.questionario?.VI_3}</td>
                      <td>{item?.formulario2?.questionario?.VI_4}</td>
                      <td>{item?.formulario2?.questionario?.ACT}</td>
                      <td>{item?.formulario3?._id?.$oid}</td>
                      <td>
                        {item?.formulario3?.questionario?.participouOutro}
                      </td>
                      <td>{item?.formulario3?.questionario?.casoParticipe}</td>
                      <td>{item?.formulario3?.questionario?.MICS_1}</td>
                      <td>{item?.formulario3?.questionario?.MICS_2}</td>
                      <td>{item?.formulario3?.questionario?.MICS_3}</td>
                      <td>{item?.formulario3?.questionario?.MICS_4}</td>
                      <td>{item?.formulario3?.questionario?.MICS_5}</td>
                      <td>{item?.formulario3?.questionario?.MICS_6}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_1}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_2}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_3}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_4}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_5}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_6}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_7}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_8}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_9}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_10}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_11}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_12}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_13}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_14}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_15}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_16}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_17}</td>
                      <td>{item?.formulario3?.questionario?.PSOC_18}</td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP2?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP4?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP5?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP6?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP7?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP8?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP10?.$numberInt}
                      </td>
                      <td>
                        {item?.formulario3?.questionario?.ACT_EP11?.$numberInt}
                      </td>
                      <td>{item?.formulario3?.questionario?.ACT_CP1}</td>
                      <td>{item?.formulario3?.questionario?.ACT_CP2}</td>
                      <td>{item?.formulario3?.questionario?.ACT_CP3}</td>
                      <td>{item?.formulario3?.questionario?.ACT_CP4}</td>
                      <td>{item?.formulario3?.questionario?.ACT_CP5}</td>
                      <td>{item?.formulario3?.questionario?.ACT_CP6}</td>
                      <td>{item?.formulario3?.questionario?.ACT_CP8}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_1}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_2}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_3}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_4}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_5}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_6}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_7}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_8}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_9}</td>
                      <td>{item?.formulario3?.questionario?.PAFAS_11}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_1}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_2}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_3}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_4}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_5}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_6}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_7}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_8}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_9}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_10}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_11}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_12}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_13}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_14}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_15}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_16}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_17}</td>
                      <td>{item?.formulario3?.questionario["SDQ_18(2-3)"]}</td>
                      <td>{item?.formulario3?.questionario["SDQ_18(4-8)"]}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_19}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_20}</td>
                      <td>{item?.formulario3?.questionario["SDQ_21(2-3)"]}</td>
                      <td>{item?.formulario3?.questionario["SDQ_21(4-8)"]}</td>
                      <td>{item?.formulario3?.questionario["SDQ_22(2-3)"]}</td>
                      <td>{item?.formulario3?.questionario["SDQ_22(4-8)"]}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_23}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_24}</td>
                      <td>{item?.formulario3?.questionario?.SDQ_25}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_4}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_8}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_10}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_12}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_16}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_18}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_20}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_21}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_23}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_24}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_26}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_28}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_34}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_36}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_38}</td>
                      <td>{item?.formulario3?.questionario?.EPVA_42}</td>
                      <td>{item?.formulario3?.questionario.ACT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <>Carregando, por favor aguarde!</>
        )}
      </div>
    </>
  );
};

export default Questionarios;
