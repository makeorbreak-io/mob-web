import React, { Component, Fragment } from "react";
import { compose } from "recompose";
import { parse, format, isAfter } from "date-fns";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import cx from "classnames";

import { waitForData } from "enhancers";

import { Tabs, Tab, Panel } from "components/uikit/tabs";
import AIDashboardViewer from "components/AIDashboard.Viewer";

import { buildTurnStates } from "lib/ai";
import { download } from "lib/browser";

const rankedGamesDates = [
  { date: parse("2018-04-10T03:00:00Z"), name: "day 1" },
  { date: parse("2018-04-11T03:00:00Z"), name: "day 2" },
  { date: parse("2018-04-12T03:00:00Z"), name: "day 3" },
  { date: parse("2018-04-13T03:00:00Z"), name: "day 4" },
  { date: parse("2018-04-14T03:00:00Z"), name: "day 5" },
  { date: parse("2018-04-15T03:00:00Z"), name: "day 6" },
].filter(run => isAfter((new Date()), run.date));

const downloadGameJSON = (game) => () => {
  const players = Object.keys(game.finalState.player_positions);
  const turns = buildTurnStates(game, players);

  const dump = {
    ...game,
    turns,
  };

  download(`${game.id}.json`, JSON.stringify(dump, null, 2));
};

const Games = ({
  me,
  name,
  date,
  games,
  selectedGame,
  setSelectedGame,
}) => {
  const dayGames = name
    ? games.filter(g => g.isRanked && g.run === name)
    : games.filter(g => !g.isRanked);

  const hasGames = dayGames.length > 0;

  const title = name
    ? `Ranked matches for ${format(date, "MMM D")}`
    : "Latest matches (last 50 shown)";

  return (
    <Fragment>
      <h2>{hasGames ? title : "No games to show" }</h2>
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
            {dayGames.map((game, _i) => {
              const opponent = game.bots.find(b => b.author.id !== me.id);
              const bot = game.bots.find(b => b.author.id === me.id);

              return (
                <tr key={game.id} className={cx({ selected: selectedGame === game.id })}>
                  <td className="date" onClick={setSelectedGame(game.id)}>{format(parse(game.updatedAt), "DD/MM/YYYY HH:mm")}</td>
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
                    <span onClick={downloadGameJSON(game)}>download</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      }
    </Fragment>
  );
};

export class AIDashboardGames extends Component {

  state = {
    selected: (this.props.data.aiGames.find(g => !g.isRanked && !g.finalState.error) || {}).id,
  }

  setSelectedGame = (selected) => () => this.setState({ selected })

  render() {
    const { data: { me, aiGames } } = this.props;
    const { selected } = this.state;

    const games = aiGames.filter(g => !g.finalState.error);
    const game = games.find(g => g.id === selected);
    const players = game ? Object.keys(game.finalState.player_positions) : [];

    const gamesCommonProps = {
      me,
      games,
      selectedGame: (game || {}).id,
      setSelectedGame: this.setSelectedGame,
    };

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
          <Tabs>
            <Tab><span>Unranked</span></Tab>
            {rankedGamesDates.map(run => (
              <Tab key={run.date}><span>{format(run.date, "MMM D")}</span></Tab>
            ))}

            <Panel>
              <Games
                {...gamesCommonProps}
                name={null}
                date={null}
              />
            </Panel>

            {rankedGamesDates.map(run => (
              <Panel key={run.date}>
                <Games
                  {...gamesCommonProps}
                  name={run.name}
                  date={run.date}
                />
              </Panel>
            ))}
          </Tabs>

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
        isRanked
        run

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
