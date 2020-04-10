import ApolloClient from "apollo-boost";
// import { ApolloClient } from "apollo-client";
// import { createHttpLink } from "apollo-link-http";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { setContext } from "apollo-link-context";
import env from "config/environment";

// const httpLink = createHttpLink({ uri: env.graphqlHost });
// const middlewareLink = setContext(() => ({
//   headers: {
//     Authorization: localStorage["jwt"] ? `Bearer ${localStorage["jwt"]}` : "",
//   },
// }));
//
// const link = middlewareLink.concat(httpLink);
// const cache = new InMemoryCache({
//   dataIdfromObject: obj => `${obj.__typename}:${obj.id}`,
// });

// const client = new ApolloClient({ link, cache });
const client = new ApolloClient({
  uri: env.graphqlHost,
  request: (operation) => {
    const token = localStorage.getItem("jwt");

    return operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
});

export default client;

