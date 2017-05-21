import moment from "moment";
import { map, reduce, merge, isEmpty, template } from "lodash";

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
    }
  }
}

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
  v => !isEmpty(v),
  "${label} is required",
);

// Non-required date format validation
export const validateDateFormat = createValidator(
  (v, opts) => isEmpty(v) ? true : moment(v, opts.format, false).isValid(),
  "${label} is not a valid date. Use ${format} format.",
);
