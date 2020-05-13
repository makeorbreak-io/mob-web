import {
  createClient,
  cacheExchange,
  dedupExchange,
  fetchExchange,
} from "urql";
import { devtoolsExchange } from "@urql/devtools";

import env from "config/environment";

const cache = cacheExchange({
  updates: {
    Mutation: {
      authenticate: (result, args, cache, info) => {
        console.log(result, args, cache, info);
      },
    }
  },
});

const client = createClient({
  url: env.graphqlHost,
  exchanges: [dedupExchange, devtoolsExchange, cache, fetchExchange],
  fetchOptions: () => {
    const token = localStorage["jwt"];

    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  },
});

export default client;
