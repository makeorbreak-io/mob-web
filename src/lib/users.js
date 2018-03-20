import { get, isFunction } from "lodash";

export const gravatarUrl = (user, size = 140) => `https://www.gravatar.com/avatar/${user.gravatarHash}?s=${size}&d=mm`;

// columns = [ [ label, path ], [ label, func(item) ], ... ]
export const toCSV = (collection, columns = []) => {
  let csv = columns.map(col => `"${col[0]}"`).join(",") + "\n";

  csv += collection.map(item => (
    columns.map(col => (isFunction(col[1]) ? col[1](item) : get(item, col[1]))).join(",")
  )).sort().join("\n");

  return csv;
};

export const emailCSVSelector = [
  [ "Email Address", "email" ],
  [ "Name", "name" ],
];
