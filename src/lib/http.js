import axios from "axios";
import { map, reduce, merge, isString } from "lodash";
import { SubmissionError } from "redux-form";

//
// Config
import env from "config/environment";

//
// Redux
import store from "store";

class ServerError extends Error {}

//------------------------------------------------------------------------------
// default export
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------

const parseServerErrors = (error) => {
  if (!error.response) return {};

  const { errors } = error.response.data;

  if (isString(errors))
    return { "error": errors };

  const errorList = map(error.response.data.errors, (messages, field) => (
    { [field]: messages.join(", ") }
  ));

  return  reduce(errorList, merge, {});
};

//
// request failure handler
// export const requestFailure = (error) => Promise.reject(processSubmissionError(error));
export const requestFailed = (error) => {
  if (!error.response) return Promise.reject(error);

  const errors = parseServerErrors(error);

  const e = new ServerError();
  e.message = reduce(errors, (msg, error, field) => `\n\t${msg}${field}: ${error}`, "");

  return Promise.reject(e);
};

export const submissionFailed = (error) => {
  if (!error.response) return Promise.reject(error);

  const errors = parseServerErrors(error);

  return Promise.reject(new SubmissionError(errors));
};

export const ignoreFailure = () => {};
