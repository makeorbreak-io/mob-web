import React from "react";
import { compose, setDisplayName } from "recompose";
import { get } from "lodash";
import { connect } from "react-redux";

//
// Components
import Team from "components/team";

export const AccountTeam = ({ currentUser }) => (
  <div>
    <h1>Team</h1>
    <Team id={get(currentUser, "team.id")} editable />
  </div>
);

export default compose(
  setDisplayName("AccountTeam"),

  connect(({ currentUser }) => ({ currentUser })),
)(AccountTeam);
