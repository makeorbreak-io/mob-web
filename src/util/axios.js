import axios from "axios";

import env from "environment";

export default axios.create({
  baseURL: env.apiHost,
  headers: {
    "Content-Type": "application/json",
  },
});
