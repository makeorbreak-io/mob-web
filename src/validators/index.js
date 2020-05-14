import { isValid, parse } from "date-fns";
import { isEmpty } from "lodash";

//
// Constants
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validatePresence = (value) => {
  if (isEmpty(value)) return "Required";
};

export const validateInt = (value) => {
  if (!value) return "Required";
  if (parseInt(value, 10) === "NaN") return "Must be a number";
};

export const validateChecked = (value) => {
  if (value !== true) return "Required";
};

export const validateMatch = (matchValue, matchLabel) => (value) => {
  if (isEmpty(value)) return "Required";
  if (matchValue !== value) return `Must match ${matchLabel}`;
};

export const validateEmail = (value) => {
  if (isEmpty(value)) return "Required";
  if (!EMAIL_REGEX.test(value)) return "Invalid email address";
};

export const validateDateFormat = (format) => (value) => {
  if (!isEmpty(value) && !isValid(parse(value))) return `Invalid date format, expected ${format}`;
};

export const validateSlug = (value) => {
  if (!/^[a-z0-9-]+$/.test(value)) return "Only lowercase, numbers, and dashes";
};

export const composeValidators = () => {};
