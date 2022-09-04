import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./components/context/user-context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { split, HttpLink, ApolloProvider } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const wsLink = new GraphQLWsLink(createClient({
  url: process.env.REACT_APP_GRAPHQL_WEBSOCKET_SERVER
}));

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_SERVER
});

//Basically this checks the query operation type and decides what type of link it should use.
//Second argument is the link to execute if the operation returns true.
//Third argument is the link to execute if the operation returns false.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

//I can pass "wsLink" straight up but it's best to use the appropriate link for the given operation type since queries and mutations don't require long lasting connection.
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContextProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
