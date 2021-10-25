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
  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState("");
  const [pokemonName, setPokemonName] = useState();

  useEffect(() => {
    if (user !== undefined) {
      const { name, picture, email } = user;
      user === undefined ? setUserInfo("Not LoggedIn") : setUserInfo(name);
    }
  }, [isAuthenticated]);

  const callApi = async () => {
    try {
      var randNumber = Math.floor(Math.random() * (600 - 0) + 0);
      const response = await fetch(
        `http://localhost:7000/pokemon/${randNumber}`
      );
      const responseData = await response.json();
      console.log(responseData);
      setMessage(responseData.message);
      setPokemonName(responseData.name);
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
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="grid-container">
      <div className="header-area">
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              {/* <img
                src="/docs/5.1/assets/brand/bootstrap-logo.svg"
                alt=""
                width="30"
                height="24"
                class="d-inline-block align-text-top"
              /> */}
              Bootstrap
            </a>
            <a>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</a>
          </div>
        </nav>
      </div>

      <div className="main-area">
        <h5>Hallo {userInfo}</h5>
        <input
          className="form-control"
          type="text"
          value="Readonly input here..."
          aria-label="readonly input example"
          readOnly
        />
        <div className="grid-pokemons">
          <button
            type="button"
            className="btn btn-success w-75 item1-area"
            onClick={callApi}
          >
            Get Pokemon
          </button>
          <button
            type="button"
            className="btn btn-success w-75 item2-area"
            onClick={callSecureApi}
          >
            Get Random Pokemon
          </button>
          <button
            type="button"
            className="btn btn-success w-75 item3-area"
            disabled={!isAuthenticated}
            onClick={callSecureApi}
          >
            Get Spesific Pokemon
          </button>
          <button
            type="button"
            className="btn btn-success w-75 item4-area"
            disabled={!isAuthenticated}
          >
            Get Unique Pokemon
          </button>
        </div>

        <h3>{pokemonName}</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type 1</th>
              <th scope="col">Type 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{pokemonName}</td>
              <td>
                <img src="https://pokeres.bastionbot.org/images/pokemon/1.png" />
              </td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="footer-area">
        <Footer />
      </div>
    </div>
  );
};

export default App;
