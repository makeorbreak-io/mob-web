import React, { Component } from "react";
import { shape, number, arrayOf, string, object } from "prop-types";
import { compose, setDisplayName } from "recompose";
import { times } from "lodash";
import classnames from "classnames";

import { withCurrentUser, waitForData } from "enhancers";

import {
  BinaryToggle,
  Button,
} from "components/uikit";

import {
  buildTurnStates,
  humanizeAction,
} from "lib/ai";

const gameProp = shape({
  width: number.isRequired,
  height: number.isRequired,
  colors: arrayOf(arrayOf(string).isRequired).isRequired,
  previous_actions: arrayOf(object.isRequired).isRequired,
  player_positions: object.isRequired,
  turns_left: number.isRequired,
});

export class AIDashboardViewer extends Component {

  static propTypes = {
    game: shape({
      initialState: gameProp.isRequired,
      finalState: gameProp,
    }),
  }

  state = {
    turn: 0,
    autoPlay: false,
    logType: "text",
  }

  componentWillMount() {
    const { game } = this.props;

    document.addEventListener("keydown", this.handleKeyDown);

    if (!game || !game.finalState) return;

    this.processGame(game);
  }

  componentWillReceiveProps(nextProps) {
    const { game } = nextProps;
    if (!game || !game.finalState) return;

    this.processGame(game);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  processGame = (game) => {
    const players = Object.keys(game.finalState.player_positions);

    const turnStates = buildTurnStates(game, players);

    this.setState({
      players,
      turn: 0,
      turnStates,
    });
  }

  handleKeyDown = (ev) => {
    // do not process keystrokes if viewer is not visible
    if (!this.container.offsetParent) return;

    // do not process keystrokes if a modifier key is pressed
    if (ev.altKey  || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;

    // do not process keystrokes if there's an element with focus
    if (document.activeElement && document.activeElement.tagName !== "BODY") return;

    switch (ev.key) {
    case "ArrowLeft":
    case "j":
      this.prevTurn();
      ev.preventDefault();
      break;
    case "ArrowRight":
    case "l":
      this.nextTurn();
      ev.preventDefault();
      break;
    case " ":
    case "k":
      this.toggleAutoPlay();
      ev.preventDefault();
      break;
    case "v":
      this.toggleLogType();
      ev.preventDefault();
      break;
    }
  }

  handleTurnChange = (ev) => {
    const turn = parseInt(ev.target.value);

    this.setState({ turn });
  }

  prevTurn = () => {
    const turn = parseInt(this.state.turn, 10);
    if (turn > 0) this.setState({ turn: turn - 1 });
  }

  nextTurn = () => {
    const { turnStates, autoPlay } = this.state;
    const turn = parseInt(this.state.turn);

    if (turn === turnStates.length - 1) {
      if (autoPlay) this.toggleAutoPlay();
      return;
    }

    this.setState({ turn: turn + 1 });
  }

  toggleAutoPlay = () => {
    const { autoPlay, turn, turnStates } = this.state;

    if (autoPlay)
      window.clearInterval(this.autoPlayInterval);
    else
      this.autoPlayInterval = window.setInterval(this.nextTurn, 300);

    if (!autoPlay && turn === turnStates.length - 1)
      this.setState({ turn: 0 });

    this.setState({ autoPlay: !autoPlay });
  }

  toggleLogType = () => {
    const { logType } = this.state;
    this.setLogType(logType === "text" ? "json" : "text");
  };

  setLogType = (logType) => {
    this.setState({ logType });
  }

  cellCx = (x, y) => {
    const { players, turnStates, turn } = this.state;
    const { colors } = turnStates[turn];

    return classnames(
      "cell", `cell-${x}`,
      { "owned": colors[y][x] !== null },
      ...players.map((player, i) => ({ [`player${i+1}`]: colors[y][x] === player })),
    );
  };

  botStyle = (bot) => {
    const { turn, turnStates } = this.state;
    const [ x, y ] = turnStates[turn].player_positions[bot];

    return {
      left: `calc(${x * 10}% + 1.5%)`,
      top: `calc(${y * 10}% + 1.5%)`,
    };
  };

  botScore = (bot) => {
    const { turn, turnStates } = this.state;
    const colors = turnStates[turn].colors;

    return colors.flatMap(f => f).filter(c => c === bot.id).length;
  }

  render() {
    if (!this.props.game) {
      return (
        <div className="AIDashboardViewer">
          <h1>No game selected</h1>
        </div>
      );
    }

    const { data: { me }, game, game: { bots: gameBots, finalState: { width, height } } } = this.props;
    const { turn, players, autoPlay, logType } = this.state;

    const totalTurns = game.finalState.previous_actions.length;
    const previousActions = game.finalState.previous_actions[turn - 1] || {};

    const actions = players.map(player => (
      turn === 0
      ? "No action"
      : JSON.stringify(previousActions[player], null, 2)
    ));

    const bots = players.map(player => (
      gameBots.find(({ id }) => id === player)
    ));

    return (
      <div className="AIDashboardViewer" ref={ref => this.container = ref}>

        <div className="board">
          {times(height).map((y, iy) => (
            <div key={`y-${iy}`} className={`row row-${iy}`}>
              {times(width).map((x, ix) => (
                <div key={`x-${ix}`} className={this.cellCx(ix, iy)}>
                </div>
              ))}
            </div>
          ))}

          {players.map((player, i) => (
            <div key={player} className={`bot player${i+1}`} style={this.botStyle(player)} />
          ))}
        </div>

        <div className="turn-scrubber">
          <input
            type="range"
            value={turn}
            onChange={this.handleTurnChange}
            min={0}
            max={totalTurns}
            step="1"
          />

          <Button primary disabled={turn <= 0} onClick={this.prevTurn}>
            &lt;
          </Button>

          <Button primary onClick={this.toggleAutoPlay} className="play-pause">
            {autoPlay ? <span>❚ ❚</span> : <span>&#9658;</span>}
          </Button>

          <Button primary disabled={turn >= totalTurns} onClick={this.nextTurn}>
            &gt;
          </Button>

        </div>

        <div className={`game-logs ${logType}`}>
          <div className="header">
            <h2 className="current-turn">Turn: {turn}</h2>
            <BinaryToggle
              selected={logType}
              options={[
                { label: "text", value: "text" },
                { label: "json", value: "json" },
              ]}
              onChange={this.setLogType}
            />
          </div>

          <div className="player-actions">
            {bots.map((bot, i) => (
              <div key={i} className={`player player${i+1}`}>
                <span className="author">
                  {bot.author.name} {bot.author.id === me.id ? "(you)" : ""}

                  <span className="score">{this.botScore(bot)}</span>
                </span>
                <span className="bot">{"// "}bot</span>
                <span className="bot">{"// "}{bot.title} (rev. {bot.revision})</span>
                <code className="json"><pre>{actions[i]}</pre></code>
                <code className="text"><pre>{humanizeAction(previousActions[bot.id] || "No action")}</pre></code>
              </div>
            ))}
          </div>
        </div>

        <ul className="hotkeys">
          <li>
            <span className="key wide">Space</span>
            <span className="key">K</span>
            <span className="action">Play / Pause</span>
          </li>
          <li>
            <span className="key flip">▶</span>
            <span className="key">J</span>
            <span className="action">Previous Turn</span>
          </li>
          <li>
            <span className="key">▶</span>
            <span className="key">L</span>
            <span className="action">Next Turn</span>
          </li>
          <li>
            <span className="key">V</span>
            <span className="action">Toggle text / json</span>
          </li>
        </ul>

      </div>
    );
  }
}

export default compose(
  withCurrentUser,
  waitForData,

  setDisplayName("AIDashboardViewer"),
)(AIDashboardViewer);
