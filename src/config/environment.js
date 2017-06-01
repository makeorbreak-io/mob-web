const env = {
  apiHost: "http://localhost:4000/api",
};

if (process.env.NODE_ENV === "production") {
  env.apiHost = "https://api.portosummerofcode.com";
}

export default env;
