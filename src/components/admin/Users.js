import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { last } from "lodash";
import classnames from "classnames";

//
// gql
import { fullUser } from "fragments";
import { waitForData } from "enhancers";

//
// components
import {
  Btn,
  DataTable,
  CollapsibleContainer,
  EmailSender,
} from "components/uikit";

//
// constants
import { ADMIN } from "constants/roles";

export class AdminUsers extends Component {

  state = {
    openModal: null,
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  toggleRole = (user) => {
    const { makeParticipant, makeAdmin, data } = this.props;
    const func = user.role === ADMIN ? makeParticipant : makeAdmin;

    return func({ variables: { id: user.id } })
    .then(() => data.refetch());
  }

  deleteUser = (id) => {
    const { removeUser, data } = this.props;
    return removeUser({ variables: { id } })
    .then(() => data.refetch());
  }

  openModal = (modal) => {
    this.setState({ openModal: modal });
  }

  closeModal = () => {
    this.setState({ openModal: null });
  }

  renderActions = (selected) => {
    return (
      <Fragment>
        <EmailSender recipients={selected} />

        {selected.length === 1 &&
          <Btn
            className={classnames("icon", "icon--small", {
              "icon--star": selected[0].role !== ADMIN,
              "icon--star-border": selected[0].role === ADMIN,
            })}
            disableFeedback
            confirmation={`Really make ${selected[0].displayName} a ${selected[0].role === ADMIN ? "participant" : "admin"}?`}
            onClick={() => this.toggleRole(selected[0])}
          >
            {selected[0].role === ADMIN ? "Make participant" : "Make admin" }
          </Btn>
        }

        <Btn
          className="icon icon--small icon--delete"
          confirmation={`Really delete ${selected.length} users?`}
          onClick={() => selected.forEach(this.deleteUser)}
        >
          Delete {selected.length} users
        </Btn>
      </Fragment>
    );
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { users } = this.props.data;

    // const users = this.props.data.users.edges.map(e => e.node);

    return (
      <div className="admin--container admin--users">
        <DataTable
          filter
          source={users}
          labels={[ "Name"        , "Email" , "Role" , "Size"   , "Workshops" , "Team" , "GitHub" ]}
          mobile={[ true          , true    , true   , true   , false       , true   , true ]}
          sorter={[ "displayName" , "email" , "role" ,null   , null        , "currentTeam.name" , null ]}
          search={[ "displayName", "role", "tshirtSize", "currentTeam.name" ]}
          actions={this.renderActions}
          render={(user, select) => (
            <tr key={user.id} className={user.role}>
              {select}
              <td className="mobile">{user.displayName}</td>
              <td className="mobile">{user.email}</td>
              <td className="mobile">{user.role}</td>
              <td className="mobile">{user.tshirtSize}</td>
              <td className="desktop">
                <CollapsibleContainer
                  preview={`${user.workshops.length} workshops`}
                >
                  {user.workshops && user.workshops.map(({ slug }) => (
                    <div key={slug}>
                      <span className="tag purple">{slug}</span>
                    </div>
                  ))}
                </CollapsibleContainer>
              </td>
              <td className="mobile">{user.currentTeam && user.currentTeam.name}</td>
              <td className="github mobile">{last((user.githubHandle || "").split("/"))}</td>
            </tr>
          )}
        />
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminUsers"),

  graphql(gql`{
    # users(first: 1000) { edges { node { ...fullUser } } }
    users(first: 1000) { ...fullUser }
  } ${fullUser}`),

  graphql(
    gql`mutation makeAdmin($id: String!) {
      makeAdmin(id: $id) { ...fullUser }
    } ${fullUser}`,
    { name: "makeAdmin" }
  ),

  graphql(
    gql`mutation makeParticipant($id: String!) {
      makeParticipant(id: $id) { ...fullUser }
    } ${fullUser}`,
    { name: "makeParticipant" }
  ),

  graphql(
    gql`mutation removeUser($id: String!) {
      removeUser(id: $id)
    } ${fullUser}`,
    { name: "removeUser" }
  ),

  waitForData,
)(AdminUsers);
