import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import client from "./client"; // убедитесь, что путь корректен

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
