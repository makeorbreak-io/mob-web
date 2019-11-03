import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { aiCompetitionBot } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { DataTable, Button, Modal } from "components/uikit";

const BotDetailsModal = compose(
  graphql(
    gql` query bot($id: String!) {
      bot(id: $id) { ...aiCompetitionBot sourceCode }
    } ${aiCompetitionBot}`,
    {
      skip: props => (!props.id),
      options: props => ({
        variables: { id: props.id },
      }),
    },
  ),

  waitForData,
)(({ isOpen, onRequestClose, data: { bot } }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    title={`${bot.title} (rev. ${bot.revision})`}
    className="BotDetailsModal"
  >
    <h4>Compilation Output</h4>
    <code><pre>{bot.compilationOutput}</pre></code>

    <h4>Source Code</h4>
    <code><pre>{bot.sourceCode}</pre></code>
  </Modal>
));

export class AdminBots extends Component {

  state = {
    botDetailsId: null,
    botDetailsOpen: false,
  }

  openBotDetails = (botDetailsId) => () => this.setState({ botDetailsId, botDetailsOpen: true });
  closeBotDetails = () => this.setState({ botDetailsId: null, botDetailsOpen: false });

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { bots } = this.props.data;
    const { botDetailsId, botDetailsOpen } = this.state;

    return (
      <div className="AdminBots">
        <div className="content white">
          <div className="tools">
            <span className="left"><Link to="/admin">← Back to Admin</Link></span>
          </div>

          {botDetailsId && botDetailsOpen &&
            <BotDetailsModal
              isOpen
              id={botDetailsId}
              onRequestClose={this.closeBotDetails}
            />
          }

          <DataTable
            source={bots}
            labels={[ "Filename" , "rev" , "SDK" , "Status" , "" ]}
            sorter={[ "name"     , null  , null  , null     , null ]}
            render={bot => (
              <tr key={bot.id}>
                <td>{bot.title}</td>
                <td>{bot.revision}</td>
                <td>{bot.sdk}</td>
                <td>{bot.status}</td>
                <td>
                  <Button primary onClick={this.openBotDetails(bot.id)}>
                    Source
                  </Button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminBots"),

  graphql(gql`{
    bots { ...aiCompetitionBot }
  } ${aiCompetitionBot}`),

  waitForData,
)(AdminBots);

