// Define action type constants
export const actions = {
  SET_NUM_ROWS_COLS: 'SET_NUM_ROWS_COLS',
  SET_UP_TILES_DATA: 'SET_UP_TILES_DATA',
  MOVE_TILE: 'MOVE_TILE',
  RANDOMIZE_TILES: 'RANDOMIZE_TILES',
};

// Define the action types
export type ActionType =
  | { type: typeof actions.SET_UP_TILES_DATA }
  | { type: typeof actions.SET_NUM_ROWS_COLS }
  | { type: typeof actions.MOVE_TILE; payload: { row: number; col: number } }
  | { type: typeof actions.RANDOMIZE_TILES };
