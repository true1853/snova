import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // замените на нужный URL
  cache: new InMemoryCache(),
});

export default client;
