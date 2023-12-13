export type TileDataType = {
  value: number | null;
  color: string;
};

export type GameStateType = {
  numRowsCols: number;
  numOfMoves: number;
  tilesData: TileDataType[][] | null;
  isSolved: boolean;
  isSolvable: boolean;
  excludeNonSolvablePermutations: boolean;
};

// Define action type constants
export const actions = {
  SET_NUM_ROWS_COLS: 'SET_NUM_ROWS_COLS',
  SET_UP_TILES_DATA: 'SET_UP_TILES_DATA',
  MOVE_TILE: 'MOVE_TILE',
  RANDOMIZE_TILES: 'RANDOMIZE_TILES',
  CHECK_IS_SOLEVED: 'CHECK_IS_SOLEVED',
  CHECK_IS_SOLEVABLE: 'CHECK_IS_SOLEVABLE',
  SET_EXCLUDE_UNSOLVABLE: 'SET_EXCLUDE_UNSOLVABLE',
};

// Define the action types
export type ActionType =
  | { type: typeof actions.SET_UP_TILES_DATA }
  | {
      type: typeof actions.SET_NUM_ROWS_COLS;
      payload: { newNumRowsCols: number };
    }
  | {
      type: typeof actions.MOVE_TILE;
      payload: { row: number; col: number };
    }
  | { type: typeof actions.RANDOMIZE_TILES }
  | { type: typeof actions.CHECK_IS_SOLEVED }
  | { type: typeof actions.CHECK_IS_SOLEVABLE }
  | {
      type: typeof actions.SET_EXCLUDE_UNSOLVABLE;
      payload: { excludeUnsolvable: boolean };
    };
