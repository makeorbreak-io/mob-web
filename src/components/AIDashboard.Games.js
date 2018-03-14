import React, { Component } from "react";
import { compose } from "recompose";
import { parse, format } from "date-fns";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import cx from "classnames";

import { waitForData } from "enhancers";

import { buildTurnStates } from "lib/ai";

import { download } from "lib/browser";

import AIDashboardViewer from "components/AIDashboard.Viewer";

export class AIDashboardGames extends Component {

  state = {
    selected: 0,
  }

  setSelected = (selected) => () => this.setState({ selected })

  downloadGameJSON = (game) => () => {
    const players = Object.keys(game.finalState.player_positions);
    const turns = buildTurnStates(game, players);

    const dump = {
      ...game,
      turns,
    };

    download(`${game.id}.json`, JSON.stringify(dump, null, 2));
  }

  render() {
    const { data: { me, aiGames } } = this.props;
    const { selected } = this.state;

    const games = aiGames.filter(g => !g.finalState.error);

    const hasGames = games.length > 0;
    const game = games[selected];

    const players = game ? Object.keys(game.finalState.player_positions) : [];

    return (
      <div className="AIDashboardGames">
        <div className="viewer">
          {game &&
            <h2 className="match">
              {players.map((player, i) => {
                const bot = game.bots.find(b => b.id === player);
                return (
                  <span key={i} className={`player player${i+1}`}>
                    {bot.title} (rev. {bot.revision})
                  </span>
                );
              })}
            </h2>
          }
          <AIDashboardViewer game={game} />
        </div>

        <div className="games">
          <h2>{hasGames ? "Latest matches" : "No games to show" }</h2>
          {hasGames &&
            <table>
              <thead>
                <tr>
                  <td>Date</td>
                  <td>Bot</td>
                  <td>Opponent</td>
                  <td>Result</td>
                  <td>JSON</td>
                </tr>
              </thead>
              <tbody>
                {games.map((game, i) => {
                  const opponent = game.bots.find(b => b.author.id !== me.id);
                  const bot = game.bots.find(b => b.author.id === me.id);

                  return (
                    <tr key={game.id} className={cx({ selected: selected === i })}>
                      <td className="date" onClick={this.setSelected(i)}>{format(parse(game.updatedAt), "DD/MM/YYYY HH:MM")}</td>
                      <td className="bot ellipsis">{bot.title} (rev. {bot.revision})</td>
                      <td>{opponent.author.name}</td>
                      <td>
                        {game.bots.map(bot => {
                          const colors = game.finalState.colors.flatMap(f => f);
                          const player = bot.author.id === me.id
                            ? "You"
                            : bot.author.name.split(" ")[0];

                          return `${player} - ${colors.filter(c => c === bot.id).length}`;
                        }).sort().join(", ")}
                      </td>
                      <td className="json-dump">
                        <span onClick={this.downloadGameJSON(game)}>download</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          }
        </div>
      </div>
    );
  }
}

export default compose(

  graphql(
    gql`{
      me { id }

      aiGames {
        id
        status
        initialState
        finalState
        updatedAt

        bots { id, title, revision, author }
      }
    }`,
    {
      options: {
        pollInterval: 10000,
      },
    },
  ),

  waitForData,
)(AIDashboardGames);
