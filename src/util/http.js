import axios from "axios";
import { map, reduce, merge } from "lodash";
import { SubmissionError } from "redux-form";

//
// Config
import env from "environment";

//
// Redux
import store from "redux-root/store";

const request = axios.create({
  baseURL: env.apiHost,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(config => {
  const { jwt } = store.getState();

  if (jwt) config.headers["Authorization"] = `Bearer ${jwt}`;

  return config;
});

export default request;

//
// Redux-Form submission errors
export const processSubmissionError = (error) => {
  const errorList = map(error.response.data.errors, (messages, field) => {
    return { [field]: messages.join(", ") };
  });

  const errors = reduce(errorList, merge, {});

  return new SubmissionError(errors);
};
