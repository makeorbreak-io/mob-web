import { get } from "lodash";

export const gravatarUrl = (user, size = 140) => `https://www.gravatar.com/avatar/${user.gravatar_hash}?s=${size}&d=mm`;

// columns = [ [ label, path ], [ label, path ], ... ]
export const toCSV = (collection, columns = []) => {
  let csv = columns.map(col => col[0]).join(",") + "\n";

  csv += collection.map(item => (
    columns.map(col => get(item, col[1])).join(",")
  )).sort().join("\n");

  return csv;
};

export const emailCSVSelector = [
  [ "Email Address", "email" ],
  [ "First Name", "first_name" ],
  [ "Last Name", "last_name" ],
];
