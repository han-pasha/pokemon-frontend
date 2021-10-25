// src/auth/auth0-provider-with-history.js

import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  //FOR REDIRECTING TO SPECIFIC URL USING HISTORY
  const history = useHistory();

  //If aps doesnt have any returnTo variable,
  //then it would choose the second parameter instead
  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain} //
      clientId={clientId} //
      redirectUri={window.location.origin} //
      onRedirectCallback={onRedirectCallback} //
      audience={audience} //
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
