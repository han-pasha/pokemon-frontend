import React, { useState, useEffect } from "react";
import Footer from "./components/footer";
import LoginButton from "./components/login-button";
import LogoutButton from "./components/logout-button";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

const App = () => {
  //CONFIG
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  //COULD BE COMBINE BUT SEPERATE IS MORE READABLE
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated } = useAuth0();
  const { user } = useAuth0();

  //USER INFO
  const [userInfo, setUserInfo] = useState(" ");
  const [message, setMessage] = useState("");

  //POKEMON INFO
  const [pokemonName, setPokemonName] = useState();
  const [pokemonStats, setPokemonStats] = useState([]);

  //INPUT FORMS
  const [value, setValue] = useState();

  /* 
    USING TWO EFFECT
    THE FIRST ONE IS TO POPULATE THE STATE
    BECAUSE IT HAS EMPETY DEPENDENCE IT
    WOULD ONLY CALLED ONCE 
  */
  useEffect(() => {
    callRandomApi();
  }, []);

  // THE SECOND ONE FOR GETTING USER INFORMATION
  // EACH TIME isAuthenticated CALLED, IT WOULD REFRESH
  useEffect(() => {
    if (user !== undefined) {
      const { name, picture, email } = user;
      user === undefined ? setUserInfo("Not LoggedIn") : setUserInfo(name);
    }
  }, [isAuthenticated]);

  // FOR CALLING API WITHOUT AUTH
  const callApi = async (pokemon) => {
    try {
      const response = await fetch(`http://localhost:7000/pokemon/${pokemon}`);
      const responseData = await response.json();
      setMessage(responseData.message);
      setPokemonName(responseData.name);

      // IF UNDEFINED. MAP WOULD BE ERROR
      if (responseData.stats !== undefined) {
        setPokemonStats(responseData.stats);
      }
      console.log(responseData.stats);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const callRandomApi = async () => {
    try {
      var randNumber = Math.floor(Math.random() * (600 - 0) + 0);
      const response = await fetch(
        `http://localhost:7000/pokemon/${randNumber}`
      );
      const responseData = await response.json();
      setMessage(responseData.message);
      setPokemonName(responseData.name);
      setPokemonStats(responseData.stats);
      console.log(responseData.stats);
    } catch (error) {
      setMessage(error.message);
    }
  };


  const callSecureApi = async () => {
    try {
      //FOR GETTING TOKEN FROM THE API
      const token = await getAccessTokenSilently();
      const response = await fetch(`${serverUrl}/pokemon/withguard/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      console.log(responseData);
      setMessage(responseData.message);
      setPokemonName(responseData.name);
      setPokemonStats(responseData.stats);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (value > 1100) {
      //LIMIT
      setMessage("VALUE KEJAUHAN");
    }
    callApi(value);
  };
  const listStat = () => {
    return (
      <table className="table">
        <tbody>
          <tr>
            <th scope="col"> STAT</th>
            <td>Value</td>
          </tr>
          {pokemonStats.map((stat, index) => (
            <tr key={index}>
              <th scope="col">{stat.stat.name}</th>
              <td>{stat.base_stat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="grid-container">
      <div className="header-area">
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Pokemon
            </a>
            <a>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</a>
          </div>
        </nav>
      </div>

      <div className="main-area">
        <h5>Hallo {userInfo}</h5>
        <form onSubmit={onSubmit}>
          <input
            className="form-control"
            type="text"
            value={value}
            placeholder="input using it's name or just a number"
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="grid-pokemons">
            <button type="submit" className="btn btn-success w-75 item1-area">
              Get Pokemon
            </button>
            <button
              type="button"
              className="btn btn-success w-75 item2-area"
              value="submit"
              onClick={callRandomApi}
            >
              Get Random Pokemon
            </button>
            <button
              type="button"
              className="btn btn-danger w-75 item3-area"
              disabled={!isAuthenticated}
              onClick={callSecureApi}
            >
              Get Spesific Pokemon
            </button>
            <button
              type="button"
              className="btn btn-danger w-75 item4-area"
              disabled={!isAuthenticated}
              onClick={callSecureApi}
            >
              Get Unique Pokemon
            </button>
          </div>
        </form>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>{message}</h2>

        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          {pokemonName}
        </h2>
        {listStat()}
      </div>
      <div className="footer-area">
        <Footer />
      </div>
    </div>
  );
};

export default App;
