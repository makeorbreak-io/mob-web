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
  return (field, label) => {
    return (values) => {
      return test(values[field])
        ? {}
        : { [field]: template(message)({ label })};
    }
  }
}

//
// Validators
export const validatePresence = (field, label) => {
  return (values) => {
    return !isEmpty(values[field])
      ? {}
      : { [field]: template("${label} is required")({ label }) }
  }
}

// export const validatePresence = createValidator(
//   v => !isEmpty(v),
//   "${label} is required",
// )
