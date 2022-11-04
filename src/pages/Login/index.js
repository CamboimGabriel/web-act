import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api";
import logo from "../../assets/Logo_Act.png";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (login === "admin" && password === "1234") {
      localStorage.setItem("type", "admin");

      const resolve = await instance.post("/signin", {
        nick: "matheus",
        password: "1234",
      });

      localStorage.setItem("token", resolve.data.token);
      navigate("/familias");
    } else {
      try {
        const resolve = await instance.post("/signin", {
          nick: login,
          password: password,
        });

        localStorage.setItem("token", resolve.data.token);
        localStorage.setItem("type", "coord");

        navigate("/familias");
      } catch (error) {
        console.log(error);
      }

      // localStorage.setItem("token", resolve.data.token);

      // navigate("/familias");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#f5f1e9",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          background: "#f5f1e9",
        }}
      >
        <img src={logo} alt="" style={{ width: 500 }} />
        <input
          placeholder="Login"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
          style={{
            height: 50,
            fontSize: 40,
            margin: 10,
            border: "2px solid grey",
            borderRadius: "30px",
            padding: 10,
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          style={{
            height: 50,
            fontSize: 40,
            margin: 10,
            border: "2px solid grey",
            borderRadius: "30px",
            padding: 10,
          }}
        />
        <button
          onClick={() => {
            handleLogin();
          }}
          style={{
            height: 70,
            fontSize: 40,
            margin: 10,
            border: "2px solid grey",
            borderRadius: "30px",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
        Contato: actribeirao@gmail.com | Versão: 2.0
      </div>
    </div>
  );
};

export default Login;
