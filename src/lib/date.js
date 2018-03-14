import { filter, slice, isEmpty } from "lodash";

export const formatDate = (value) => {
  const numerals = filter((value || "").split(""), c => /\d/.test(c));
  const year  = slice(numerals, 0, 4).join("");
  const month = slice(numerals, 4, 6).join("");
  const day   = slice(numerals, 6, 8).join("");

  let finalValue = year;
  if(!isEmpty(month)) finalValue = `${year}-${month}`;
  if(!isEmpty(day))   finalValue = `${year}-${month}-${day}`;

  return finalValue;
};
