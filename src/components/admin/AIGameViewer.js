import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { waitForData } from "enhancers";

//
// components
import { DataTable } from "components/uikit";
import { AIDashboardViewer } from "components/AIDashboard.Viewer";

const WrappedViewer = compose(
  graphql(
    gql`query game($id: String!) {
      me { id }
      game(id: $id) {
        id
        initialState
        finalState
        status
        bots { id, title, revision, author }
      }
    }`,
    {
      skip: props => !props.id,
      options: props => ({
        variables: { id: props.id },
      }),
    },
  ),

  waitForData,
)(props => (
  !props.data.game.finalState.error && <AIDashboardViewer data={props.data} game={props.data.game} />
));

export class AdminAIGameViewer extends Component {

  state = {
    selectedGameId: null,
  }

  setSelectedGame = (selectedGameId) => this.setState({ selectedGameId })

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { runGames } = this.props.data;
    const { selectedGameId } = this.state;

    return (
      <div className="AdminGames AIDashboard">
        <div className="content white AIDashboardGames">

          <div className="viewer dedicated">
            <WrappedViewer id={selectedGameId} />
          </div>

          <div className="games">
            <DataTable
              source={runGames}
              labels={[ "ID" , "Status" , "Bot 1"               , "Bot 2" ]}
              sorter={[ "id" , null     , "bots[0].author.name" , "bots[1].author.name"     ]}
              render={game => (
                <tr key={game.id} onClick={() => this.setSelectedGame(game.id)} className={selectedGameId === game.id ? "selected" : ""}>
                  <td>{game.id}</td>
                  <td>{game.status}</td>
                  <td>{game.bots[0].author.name} - {game.bots[0].title} (rev. {game.bots[0].revision})</td>
                  <td>{game.bots[1].author.name} - {game.bots[1].title} (rev. {game.bots[1].revision})</td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("AdminGames"),

  graphql(
    gql`{
      runGames(runName: "day 6") {
        id
        status
        bots { id, title, revision, author }
      }
    }`,
  ),

  waitForData,
)(AdminAIGameViewer);


