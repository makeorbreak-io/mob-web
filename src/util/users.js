export const gravatarUrl = (user, size = 140) => `https://www.gravatar.com/avatar/${user.gravatar_hash}?s=${size}&d=mm`;

export const toCSV = (users) => {
  let csv = `"Email Address","First Name","Last Name"\n`; // eslint-disable-line quotes
  csv += users.map(({ email, first_name, last_name }) => `${email},${first_name},${last_name}`).join("\n");

  return csv;
};
