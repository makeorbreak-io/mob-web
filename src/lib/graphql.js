const ERROR_CODES = {
  already_taken      : "Email is already taken",
  wrong_credentials  : "Invalid username or password",
  "invalid password" : "Invalid username or password",
  length             : "Password needs to be at least 6 characters",
};

export const handleGraphQLErrors = (actions) => (error) => {

  // issues with the whole form (e.g. login)
  const { exception, message } = error.graphQLErrors[0];
  if (!exception) {
    actions.setFieldError("_error", ERROR_CODES[message] || message);

    return;
  }

  // issues with specific fields
  const errors = error.graphQLErrors.reduce((all, { exception: { param, code } }) => (
    { ...all, [param]: ERROR_CODES[code] || code }
  ), {});

  actions.setErrors(errors);
};
