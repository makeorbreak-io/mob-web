import React, { Component, Fragment } from "react";
import { compose, setDisplayName } from "recompose";
import QRCode from "qrcode";
import Select from "react-select";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import QrReader from "react-qr-reader";
import { orderBy, groupBy } from "lodash";

import { suffrage, paperVote } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { Tabs, Tab, Panel } from "components/uikit/tabs";
import { Button, Modal } from "components/uikit";

//
// constants
import { CREATIVE, FUN, USEFUL } from "constants/prizes";

const REDEEM_MODAL = "REDEEM_MODAL";
const ANNUL_MODAL = "ANNUL_MODAL";
const VIEW_MODAL = "VIEW_MODAL";

const SCAN_DELAY = 1000;

export class PaperVotes extends Component {

  state = {
    openModal: null,
    qrCode: null,
    paperVote: {},
    redeemingParticipant: null,
    redeemingTeam: null,
    redeemError: null,
  }

  suffrageIdForCategory = (category) => this.props.data.suffrages.find(s => s.slug === category).id
  categoryForSuffrageId = (suffrageId) => this.props.data.suffrages.find(s => s.id === suffrageId).slug

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  createVote = (category) => {
    const { data, createPaperVote } = this.props;
    const suffrageId = this.suffrageIdForCategory(category);

    return createPaperVote({ variables: { suffrageId } })
    .then(response => {
      const paperVote = response.data.createPaperVote;
      this.generateQRCode(paperVote);
      this.openModal(VIEW_MODAL);

      return data.refetch();
    });
  }

  handleRedeemScan = (id) => {
    if (id === null) return;

    const { redeemingParticipant, redeemingTeam } = this.state;

    if (!redeemingParticipant && !redeemingTeam) {
      return;
    }

    const { data, redeemPaperVote } = this.props;

    return redeemPaperVote({
      variables: {
        paperVoteId: id,
        userId: redeemingParticipant.id,
        teamId: redeemingTeam.id,
      },
    })
    .then(() => {
      data.refetch();
      this.closeModal();

      return null;
    })
    .catch(e => this.setState({ redeemError: e.message }));
  }

  handleAnnulScan = (id) => {
    if (id === null) return;

    const { data, annulPaperVote } = this.props;

    return annulPaperVote({ variables: { paperVoteId: id } })
    .then(() => {
      this.closeModal();
      data.refetch();

      return null;
    });
  }

  openModal = (id) => this.setState({ openModal: id })
  closeModal = () => {
    this.setState({
      openModal: null,
      qrCode: null,
      paperVote: {},
      redeemingParticipant: null,
      redeemingTeam: null,
      redeemError: null,
    });
  }

  generateQRCode = (paperVote) => {
    QRCode.toString(paperVote.id, (err, svg) => {
      this.setState({
        paperVote,
        qrCode: svg,
        openModal: VIEW_MODAL,
      });
    });
  }

  handleRedeemingParticipantSelectChange = (option) => {
    const users = this.props.data.users.edges.map(e => e.node);

    this.setState({
      redeemingParticipant: option ? users.find(u => u.id === option.value) : null,
    });
  }

  handleRedeemTeamSelectChange = (option) => {
    const teams = this.props.data.suffrages[0].teams;

    this.setState({
      redeemingTeam: option ? teams.find(t => t.id === option.value) : null,
    });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const users = this.props.data.users.edges.map(e => e.node);
    const teams = this.props.data.suffrages[0].teams;

    const { openModal, qrCode, paperVote, redeemingParticipant, redeemingTeam, redeemError } = this.state;

    const userOptions = orderBy(users, [ "displayName" ], [ "asc" ]).map(user => ({
      label: user.displayName,
      value: user.id,
    }));

    const teamOptions = orderBy(teams, [ "name" ], [ "asc" ]).map(team => ({
      label: team.name,
      value: team.id,
    }));

    const redeemingParticipantValue = redeemingParticipant && { label: redeemingParticipant.displayName, value: redeemingParticipant.id };
    const redeemingTeamValue = redeemingTeam && { label: redeemingTeam.name, value: redeemingTeam.id };

    const unredeemed = Object.entries(groupBy(this.props.data.unredeemedPaperVotes, "suffrageId"));
    const redeemed = Object.entries(groupBy(this.props.data.redeemedPaperVotes, "suffrageId"));

    return (
      <div className="PaperVotes">
        <div className="content white">
          <Tabs selected={0}>
            <Tab><span>Paper Votes</span></Tab>

            <Panel>
              <div className="actions">
                <Button primary onClick={() => this.createVote(CREATIVE)}>Create Paper Vote (Creative)</Button>
                <Button orange onClick={() => this.createVote(FUN)}>Create Paper Vote (Fun)</Button>
                <Button success onClick={() => this.createVote(USEFUL)}>Create Paper Vote (Useful)</Button>
                <Button primary onClick={() => this.openModal(REDEEM_MODAL)}>Redeem Paper Vote</Button>
                <Button primary onClick={() => this.openModal(ANNUL_MODAL)}>Annul Paper Vote</Button>
              </div>

              <h2>Unredeemed Paper Votes</h2>
              {unredeemed.map(([ id, paperVotes ]) => (
                <Fragment key={id}>
                  <h3>{this.categoryForSuffrageId(id)}</h3>
                  <ul>
                    {paperVotes.map(pv => <li key={pv.id}>{pv.id}</li>)}
                  </ul>
                </Fragment>
              ))}

              <h2>Redeemed Paper Votes</h2>
              {redeemed.map(([ id, paperVotes ]) => (
                <Fragment key={id}>
                  <h3>{this.categoryForSuffrageId(id)}</h3>
                  <ul>
                    {paperVotes.map(pv => <li key={pv.id}>{pv.id}</li>)}
                  </ul>
                </Fragment>
              ))}

              {paperVote && openModal === VIEW_MODAL &&
                <Modal
                  title="Paper Vote"
                  onRequestClose={this.closeModal}
                  isOpen
                >
                  <img width="400" src={`data:image/svg+xml;utf8,${qrCode}`} />

                  <a
                    href={`/print-paper-vote?id=${paperVote.id}&category=${this.categoryForSuffrageId(paperVote.suffrageId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button primary large fullwidth>Print</Button>
                  </a>
                </Modal>
              }

              {openModal === REDEEM_MODAL &&
                <Modal
                  title="Redeem Paper Vote"
                  onRequestClose={this.closeModal}
                  isOpen
                >

                  <Select
                    options={userOptions}
                    placeholder="Redeeming participant"
                    onChange={this.handleRedeemingParticipantSelectChange}
                    value={redeemingParticipantValue}
                  />

                  <Select
                    options={teamOptions}
                    placeholder="Team"
                    onChange={this.handleRedeemTeamSelectChange}
                    value={redeemingTeamValue}
                  />

                  <QrReader
                    delay={SCAN_DELAY}
                    onScan={this.handleRedeemScan}
                    onError={() => {}}
                  />

                  <div className="ErrorMessage">
                    {redeemError}
                  </div>
                </Modal>
              }

              {openModal === ANNUL_MODAL &&
                <Modal
                  title="Annul Paper Vote"
                  isOpen={openModal === ANNUL_MODAL}
                  onRequestClose={this.closeModal}
                >

                  <QrReader
                    delay={SCAN_DELAY}
                    onScan={this.handleAnnulScan}
                    onError={() => {}}
                  />
                </Modal>
              }
            </Panel>
          </Tabs>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("PaperVotes"),

  graphql(
    gql`{
      me { id }
      suffrages { ...suffrage }
      users(first: 1000) { edges { node { id displayName } } }
      unredeemedPaperVotes { ...paperVote }
      redeemedPaperVotes { ...paperVote }
    } ${suffrage} ${paperVote}`
  ),
  waitForData,

  graphql(
    gql`mutation createPaperVote($suffrageId: String!) {
      createPaperVote(suffrageId: $suffrageId) { ...paperVote }
    } ${paperVote}`,
    { name: "createPaperVote" },
  ),

  graphql(
    gql`mutation redeemPaperVote($paperVoteId: String!, $userId: String!, $teamId: String!) {
      redeemPaperVote(paperVoteId: $paperVoteId, userId: $userId, teamId: $teamId) { ...paperVote }
    } ${paperVote}`,
    { name: "redeemPaperVote" },
  ),

  graphql(
    gql`mutation annulPaperVote($paperVoteId: String!) {
      annulPaperVote(paperVoteId: $paperVoteId) { ...paperVote }
    } ${paperVote}`,
    { name: "annulPaperVote" },
  ),
)(PaperVotes);
