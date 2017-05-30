import { isEmpty } from "lodash";

export const displayName = (user) => {
  return isEmpty(user.first_name) ? user.email : `${user.first_name} ${user.last_name}`;
};
