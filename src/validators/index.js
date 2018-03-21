import { isValid, parse } from "date-fns";
import { map, reduce, merge, isNumber, isEmpty, template } from "lodash";

//
// Constants
import { EMAIL_REGEX } from "constants/validators";

// Tidily compose validators for a whole set of inputs
//
// Example:
//
// const validate = (values) => {
//   return composeValidators(
//     validatePresence("email", "Email"),
//     validatePresence("password", "Password"),
//   )(values);
// }
export const composeValidators = (...validators) => {
  return (values) => {
    const results = map(validators, v => v(values));
    return reduce(results, merge, {});
  };
};

// Helper method to abstract validator creation implementation details,
// and focusing on actual validation logic
export const createValidator = (test, message) => {
  return (field, label, opts = {}) => {
    return (values) => {
      return test(values[field], opts)
        ? {}
        : { [field]: template(message)({ label, ...opts })};
    };
  };
};

//
// Validators

// createValidator is used as a shortcut to achieve more readable validators.
// The 2 code snippets below achieve the same results
//
// const validatePresence = (field, label) => {
//   return (values) => {
//     return !isEmpty(values[field])
//       ? {}
//       : { [field]: template("${label} is required")({ label }) }
//   }
// }
//
// const validatePresence = createValidator(
//   v => !isEmpty(v),
//   "${label} is required",
// )

// Presence
export const validatePresence = createValidator(
  v => isNumber(v) || !isEmpty(v),
  "${label} is required",
);

export const validateChecked = createValidator(
  v => v === true,
  "${label} must be checked",
);

// Password confirmation
export const validateMatch = createValidator(
  (v, opts) => v === opts.match,
  "Passwords do not match",
);

// Non-required date format validation
export const validateDateFormat = createValidator(
  v => isEmpty(v) ? true : isValid(parse(v)),
  "${label} is not a valid date, use ${format} format",
);

// Required email address
export const validateEmail = createValidator(
  v => EMAIL_REGEX.test(v),
  "${label} is not valid",
);
