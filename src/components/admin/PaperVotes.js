import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import QRCode from "qrcode";
import Select from "react-select";
import { connect } from "react-redux";
import { filter, orderBy, find } from "lodash";

//
// components
import { Tabs, Tab, Panel } from "components/uikit/tabs";
import { Button, Modal } from "components/uikit";

//
// redux
import { fetchUsersAdmin } from "actions/admin/users";
import { fetchTeams } from "actions/teams";

//
// API
import { createPaperVote, redeemPaperVote, annulPaperVote } from "api/paper_votes";

//
// constants
import { HARDCORE, FUNNY, USEFUL } from "constants/prizes";

const REDEEM_MODAL = "REDEEM_MODAL";
const ANNUL_MODAL = "ANNUL_MODAL";
const VIEW_MODAL = "VIEW_MODAL";

export class PaperVotes extends Component {

  state = {
    openModal: null,
    qrCode: null,
    paperVote: {},
    redeemingParticipant: null,
    redeemTeam: null,
    redeemError: null,
  }

  componentDidMount() {
    this.props.dispatch(fetchUsersAdmin());
    this.props.dispatch(fetchTeams({ admin: true }));

    this.redeemScanner = new Instascan.Scanner({ video: document.getElementById("redeem") });
    this.annulScanner = new Instascan.Scanner({ video: document.getElementById("annul") });

    this.redeemScanner.addListener("scan", id => {
      const { redeemingParticipant, redeemTeam } = this.state;

      if (!redeemingParticipant && !redeemTeam) {
        return;
      }

      redeemPaperVote(id, redeemingParticipant.id, redeemingParticipant.team.id)
      .then(() => this.closeModal())
      .catch(e => this.setState({ redeemError: e.errors.error }));
    });

    this.annulScanner.addListener("scan", id => {
      annulPaperVote(id).then(this.closeModal);
    });
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
  createVote = (category) => {
    createPaperVote(category)
    .then(paperVote => {
      this.generateQRCode(paperVote);
      this.openModal(VIEW_MODAL);
    });
  }

  openModal = (id) => {
    this.setState({ openModal: id });

    Instascan.Camera.getCameras().then(cameras => {
      if (cameras.length > 0) {

        switch (this.state.openModal) {
          case REDEEM_MODAL:
            this.redeemScanner.start(cameras[0]);
            break;

          case ANNUL_MODAL:
            this.annulScanner.start(cameras[0]);
            break;

          default:
            break;
        }

      }
    });
  }

  closeModal = () => {
    this.state.openModal === REDEEM_MODAL
    ? this.redeemScanner.stop()
    : this.annulScanner.stop();

    this.setState({
      openModal: null,
      qrCode: null,
      paperVote: {},
      redeemingParticipant: null,
      redeemTeam: null,
      redeemError: null,
    });
  }

  //----------------------------------------------------------------------------
  // Event handlers
  //----------------------------------------------------------------------------
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
    const { users } = this.props;

    this.setState({
      redeemingParticipant: option ? find(users, u => u.id === option.value) : null,
    });
  }

  handleRedeemTeamSelectChange = (option) => {
    const { teams } = this.props;

    this.setState({
      redeemTeam: option ? find(teams, t => t.id === option.value) : null,
    });
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { openModal, qrCode, paperVote, redeemingParticipant, redeemTeam, redeemError } = this.state;
    const { users, teams } = this.props;

    const userOptions = orderBy(users, [ "display_name" ], [ "asc" ]).map(user => ({
      label: user.display_name,
      value: user.id,
    }));

    const teamOptions = orderBy(teams, [ "name" ], [ "asc" ]).map(team => ({
      label: team.name,
      value: team.id,
    }));

    const redeemingParticipantValue = redeemingParticipant && { label: redeemingParticipant.display_name, value: redeemingParticipant.id };
    const redeemTeamValue = redeemTeam && { label: redeemTeam.name, value: redeemTeam.id };

    return (
      <div className="PaperVotes">
        <div className="content">
          <Tabs selected={0}>
            <Tab><span>Paper Votes</span></Tab>

            <Panel>
              <div className="actions">
                <Button primary onClick={() => this.createVote(HARDCORE)}>Create Paper Vote (Hardcore)</Button>
                <Button orange onClick={() => this.createVote(FUNNY)}>Create Paper Vote (Funny)</Button>
                <Button success onClick={() => this.createVote(USEFUL)}>Create Paper Vote (Useful)</Button>
                <Button primary onClick={() => this.openModal(REDEEM_MODAL)}>Redeem Paper Vote</Button>
                <Button primary onClick={() => this.openModal(ANNUL_MODAL)}>Annul Paper Vote</Button>
              </div>

              <h2>Unredeemed paper votes</h2>

              <Modal
                title="Paper Vote"
                isOpen={openModal === VIEW_MODAL}
                onRequestClose={this.closeModal}
              >
                <img width="400" src={`data:image/svg+xml;utf8,${qrCode}`} />

                <a
                  href={`/print-paper-vote?id=${paperVote.id}&category=${paperVote.category_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button primary large fullwidth>Print</Button>
                </a>
              </Modal>

              <Modal
                title="Redeem Paper Vote"
                isOpen={openModal === REDEEM_MODAL}
                onRequestClose={this.closeModal}
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
                  value={redeemTeamValue}
                />

                <video id="redeem" />

                <div className="ErrorMessage">
                  {redeemError}
                </div>
              </Modal>

              <Modal
                title="Annul Paper Vote"
                isOpen={openModal === ANNUL_MODAL}
                onRequestClose={this.closeModal}
              >
                <video id="annul" />
              </Modal>
            </Panel>
          </Tabs>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("PaperVotes"),

  connect(({ admin: { users }, teams }) => ({
    users: filter(users, user => user.team && user.team.applied),
    teams: filter(teams, team => team.applied && team.eligible && !team.disqualified_at),
  })),
)(PaperVotes);
