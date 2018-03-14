const env = {
  apiHost: "http://localhost:4000/api",
  graphqlHost: "http://localhost:4000/graphql",
  sentryEndpoint: "https://689416f602364808bf75db638243c636@sentry.io/197455",
};

if (process.env.NODE_ENV === "production") {
  env.apiHost = "https://api.makeorbreak.io/api";
  env.graphqlHost = "https://api.makeorbreak.io/graphql",
  env.sentryEndpoint = "https://2ddbabca5f05478488ae5a0cd2045e83@sentry.io/197860";
}

export default env;
