import { groupBy, cloneDeep, some, isString } from "lodash";

// gameState = shape({
//   width: number.isRequired,
//   height: number.isRequired,
//   colors: arrayOf(arrayOf(string).isRequired).isRequired,
//   previous_actions: arrayOf(object.isRequired).isRequired,
//   player_positions: object.isRequired,
//   turns_left: number.isRequired,
// });
//
// game = shape({
//   initialState: gameState.isRequired,
//   finalState: gameState,
// })

export const buildTurnStates = (game, players) => {
  if(!game || !game.finalState) return [];

  const { colors, player_positions } = game.initialState;
  const { previous_actions } = game.finalState;

  const turnStates = previous_actions.reduce((turns, actions, turn) => {
    const nextTurn = applyActions(turns[turn], actions, players);
    turns.push(nextTurn);

    return turns;
  }, [{ colors, player_positions }]);

  return turnStates;
};

export const humanizeAction = (action) => {
  if (!action) return null;
  if (isString(action)) return action;

  const { type, direction } = action;

  switch(direction.toString()) {
    case "0,0":
      return `${type} to own cell, invalid`;

    case "1,0":
      return `${type} right`;
    case "-1,0":
      return `${type} left`;
    case "0,-1":
      return `${type} up`;
    case "0,1":
      return `${type} down`;

    case "1,1":
      return `${type} southeast`;
    case "-1,1":
      return `${type} southwest`;
    case "-1,-1":
      return `${type} northeast`;
    case "1,-1":
      return `${type} northwest`;
  }
};

const applyActions = (previousTurn, actions, players) => {
  let nextTurn = resolveWalk(previousTurn, actions, players);
  nextTurn = resolveShoot(nextTurn, actions, players);

  return nextTurn;
};

//----------------------------------------------------------------------------- "walk"
//

// all movement actions are applied
const resolveWalk = (previousTurn, actions, players) => {
  const { colors, player_positions } = previousTurn;

  // each avatar is placed in its new position
  const newPositions = players.reduce((positions, player) => {
    const pos = player_positions[player];

    if (!actions[player]) return { ...positions, [player]: pos };

    const { type, direction } = actions[player];

    if (type !== "walk") return { ...positions, [player]: pos };

    const [ vx, vy ] = direction;
    const [ x, y ] = pos;

    const newPos = [ x + vx, y + vy ];
    return {
      ...positions,
      [player]: isValidPosition(colors, newPos) ? newPos : pos,
    };
  }, {});

  // while there is a square with two or more avatars in them,
  // actions from all avatars in the square are undone
  const byPosition = groupBy(Object.entries(newPositions), "[1]");

  Object.keys(byPosition).forEach(position => {
    if (byPosition[position].length > 1) {
      byPosition[position].forEach(([player, _]) => {
        newPositions[player] = player_positions[player];
      });
    }
  });

  // paint the squares occupied by all the avatars
  const newColors = cloneDeep(colors);
  Object.keys(newPositions).map(player => {
    const [ x, y ] = newPositions[player];
    newColors[y][x] = player;
  });

  return {
    colors: newColors,
    player_positions: newPositions,
  };
};

//----------------------------------------------------------------------------- "shoot"
//

// all shooting actions are applied
const resolveShoot = (previousTurn, actions, players) => {
  const { colors, player_positions } = previousTurn;
  const newColors = cloneDeep(colors);

  // each action's range is calculated
  const ranges = players.reduce((ranges, player) => {
    if (!actions[player] || actions[player].type !== "shoot")
      return { ...ranges, [player]: 0 };

    return {
      ...ranges,
      ...shotRange(colors, player, player_positions[player], actions[player].direction),
    };
  }, {});

  const shots = players.reduce((shots, player) => ({
    ...shots,
    [player]: player_positions[player],
  }), {});

  const paintedThisTurn = [];

  // while there are active shots
  while(some(ranges, range => range > 0)) {

    // advance all shots one square
    Object.keys(shots).forEach(player => (
      shots[player] = [
        shots[player][0] + actions[player].direction[0],
        shots[player][1] + actions[player].direction[1],
      ]
    ));

    Object.keys(ranges).forEach(player => {
      // shot is disabled once its range reaches 0
      if (ranges[player] === 0) return;

      const playerShot = shots[player];
      const otherShots = cloneDeep(shots);
      delete otherShots[player];

      // any shots that
      if (
        // are outside the board
        !isValidPosition(colors, playerShot) ||

        // share a square with other shots
        some(otherShots, shot => shot.toString() === playerShot.toString()) ||

        // or with any avatars,
        some(player_positions, playerPos => playerPos.toString() === playerShot.toString()) ||

        // or that are in squares painted in this turn,
        some(paintedThisTurn, painted => painted.toString() === playerShot.toString())
      ) {
        // are disabled
        ranges[player] = 0;
      }
      else {
        // paint the squares of the remaining active shots
        newColors[playerShot[1]][playerShot[0]] = player;
        paintedThisTurn.push(playerShot);

        ranges[player]--;
      }
    });
  }

  return {
    colors: newColors,
    player_positions,
  };
};

//----------------------------------------------------------------------------- helpers
//

const isValidPosition = (colors, [x, y]) => (
  x >= 0 && y >= 0 && x < colors[0].length && y < colors.length
);

const isPlayerPosition = (colors, [x, y], player) => (
  colors[y][x] === player
);

const shotRange = (colors, player, origin, direction) => {
  if (direction.join(",") === "0,0")
    return { [player]: 0 };

  const pos = cloneDeep(origin);
  let range = 0;

  // eslint-disable-next-line no-constant-condition
  do {
    pos[0] -= direction[0];
    pos[1] -= direction[1];

    if (!isValidPosition(colors, pos) || !isPlayerPosition(colors, pos, player))
      break;

    range++;
  } while (true);

  return { [player]: Math.max(1, range) };
};
